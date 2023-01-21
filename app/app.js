const db = require("../database/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM `users` WHERE `username` = ?",
      [username],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
}

async function register(req, res) {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (user.length == 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query("INSERT INTO users (username,password) VALUES (?, ?)", [
        username,
        hashedPassword,
      ]);
      res.send("You've succesfully signed up");
    } else {
      res.send(`User ${username} already exists`);
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (user.length > 0) {
    const result = await bcrypt.compare(password, user[0]["password"]);
    if (result) {
      const accesToken = jwt.sign({ username }, process.env.ACCES_SECRET, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign({ username }, process.env.REFRESH_SECRET, {
        expiresIn: "180d",
      });
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      db.query(`UPDATE users SET refreshToken = ? WHERE username = ? `, [
        hashedRefreshToken,
        username,
      ]);
      res.json({ accesToken, refreshToken });
    } else {
      res.send("Please check your username or/and password");
    }
  } else {
    res.send("You've to register at first");
  }
}

async function refreshToken(req, res) {
  try {
    const token = await req.body.token;
    const result = jwt.verify(token, process.env.REFRESH_SECRET);
    db.query(
      "SELECT * FROM users WHERE username LIKE ?",
      [result.username],
      async (err, data) => {
        const [user] = await data;
        const compare = bcrypt.compareSync(token, user.refreshToken);
        if (compare) {
          const username = user.username;
          const accesToken = jwt.sign({ username }, process.env.ACCES_SECRET, {
            expiresIn: "15m",
          });
          res.json({ accesToken });
        } else {
          res.send("you have to log in");
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
}

async function getUserInfo(req, res) {
  try {
    const [result] = await getUserByUsername(req.username)
    res.send(result)
  } catch (err) {
    res.send(err);
  }
}

async function logOut(req,res){
  db.query(`UPDATE users SET refreshToken = '' WHERE username = ? `, [req.username],(err)=>{
    if(err){
      res.send(err)
    }else{
      res.send("Succesfully logged out")
    }
  })

}
module.exports = {
  register,
  login,
  refreshToken,
  getUserInfo,
  logOut
};
