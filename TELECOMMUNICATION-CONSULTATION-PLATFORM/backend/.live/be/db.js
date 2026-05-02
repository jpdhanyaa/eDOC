const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kanishka@2006",
    database: "edoc"
});

db.connect(function(err){
    if(err){
        console.log("Database connection failed");
    } else {
        console.log("Connected to MySQL");
    }
});

module.exports = db;