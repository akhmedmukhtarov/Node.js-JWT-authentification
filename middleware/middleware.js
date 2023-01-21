const jwt = require("jsonwebtoken")



module.exports = function middleware(req, res, next) {
    const token =
      req.headers["authorization"] && req.headers.authorization.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.ACCES_SECRET, (err, user) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          req.username = user.username
          next();
        }
      });
    } else {
      res.send("ERROR");
    }
  }