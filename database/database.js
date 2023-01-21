const mysql = require('mysql');
require("dotenv").config()

const db =  mysql.createConnection({
    host: "localhost:8889 ",
    user: "root",
    password: process.env.DB,
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
    database: "users"
})

db.connect((rej)=>{
    if(rej){
        console.log(rej);
        return
    }
    console.log("DB connected");
})


module.exports = db