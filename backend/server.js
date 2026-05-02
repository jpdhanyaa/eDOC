const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

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

app.post("/login", (req, res) => {
    const { email, password, role } = req.body;

    let table = "";

    const roleLower = role.toLowerCase();

    if (roleLower === "patient") table = "patients";
    else if (roleLower === "doctor") table = "doctors";
    else table = "admins";

    console.log("LOGIN:", email, roleLower);

    const sql = `SELECT * FROM ${table} WHERE email=?`;

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.json({ status: "error" });
        }

        if (result.length === 0) {
            return res.json({ status: "fail" });
        }

        if (result[0].password !== password) {
            return res.json({ status: "fail" });
        }

        res.json({
            status: "success",
            user: result[0]
        });
    });
});

app.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    const tables = ["patients", "doctors", "admins"];

    const checkNext = (i) => {
        if (i >= tables.length) {
            return res.json({ status: "fail" });
        }

        const sql = `SELECT * FROM ${tables[i]} WHERE email=?`;

        db.query(sql, [email], (err, result) => {
            if (result && result.length > 0) {
                return res.json({ status: "success" });
            } else {
                checkNext(i + 1);
            }
        });
    };

    checkNext(0);
});

app.post("/reset-password", (req, res) => {
    const { email, newPassword } = req.body;

    const tables = ["patients", "doctors", "admins"];

    const updateNext = (i) => {
        if (i >= tables.length) {
            return res.json({ status: "fail" });
        }

        const checkSql = `SELECT * FROM ${tables[i]} WHERE email=?`;

        db.query(checkSql, [email], (err, result) => {
            if (result && result.length > 0) {

                const updateSql = `UPDATE ${tables[i]} SET password=? WHERE email=?`;

                db.query(updateSql, [newPassword, email], (err2) => {
                    if (err2) {
                        return res.json({ status: "error" });
                    }
                    return res.json({ status: "success" });
                });

            } else {
                updateNext(i + 1);
            }
        });
    };

    updateNext(0);
});

app.post("/signup", (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    let table = "";

    const roleLower = role.toLowerCase();

    if (roleLower === "patient") table = "patients";
    else if (roleLower === "doctor") table = "doctors";

    const checkSql = `SELECT * FROM ${table} WHERE email=?`;

    db.query(checkSql, [email], (err, result) => {
        if (result.length > 0) {
            return res.json({ status: "exists" });
        }

        const insertSql = `
            INSERT INTO ${table} (first_name, last_name, email, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(insertSql, [firstName, lastName, email, password], (err2, result2) => {
            if (err2) {
                return res.json({ status: "error" });
            }
            res.json({
                status: "success",
                user: {
                    id: result2.insertId,
                    first_name: firstName,
                    last_name: lastName,
                    email: email
                }
            });
        });
    });
});

const dashboardRoutes = require('./routes/dashboard')(db);
app.use("/patient", dashboardRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});