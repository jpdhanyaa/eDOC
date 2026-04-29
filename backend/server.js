const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dhanyaa@2006",
    database: "edoc"
});

db.connect(err => {
    if (err) {
        console.log("DB error", err);
    } else {
        console.log("Connected to DB");
    }
});

// LOGIN API
app.post("/login", (req, res) => {
    const { email, password, role } = req.body;

    let table = "";

    if (role === "Patient") table = "patients";
    else if (role === "Doctor") table = "doctors";
    else table = "admins";

    const sql = `SELECT * FROM ${table} WHERE email=? AND password=?`;

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.json({ status: "error" });
        }

        if (result.length > 0) {
            res.json({ status: "success" });
        } else {
            res.json({ status: "fail" });
        }
    });
});

// START SERVER
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});