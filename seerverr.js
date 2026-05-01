const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   ENSURE UPLOADS FOLDER EXISTS
========================= */
const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/* =========================
   STATIC FILE SERVING
========================= */
app.use("/uploads", express.static(uploadsDir));

/* =========================
   DB CONNECTION
========================= */
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "edoc"
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

/* =========================
   BOOK APPOINTMENT
========================= */
app.post("/book-appointment", upload.single("report"), (req, res) => {
    const { patient_name, appointment_date, session } = req.body;

    const reportPath = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO appointments
        (patient_name, appointment_date, session, status, report_path)
        VALUES (?, ?, ?, 'Booked', ?)
    `;

    db.query(
        sql,
        [patient_name, appointment_date, session, reportPath],
        (err) => {
            if (err) {
                console.log("BOOK ERROR:", err);
                return res.status(500).send("Error booking");
            }

            res.send("Appointment booked successfully");
        }
    );
});

/* =========================
   GET APPOINTMENTS
========================= */
app.get("/appointments", (req, res) => {
    db.query("SELECT * FROM appointments ORDER BY id ASC", (err, result) => {
        if (err) {
            console.log(err);
            return res.json([]);
        }

        res.json(result);
    });
});

/* =========================
   CANCEL APPOINTMENT
========================= */
app.post("/cancel-appointment", (req, res) => {
    const sql = `
        UPDATE appointments
        SET status='Cancelled'
        WHERE id = (
            SELECT id FROM (
                SELECT id FROM appointments
                ORDER BY id DESC
                LIMIT 1
            ) temp
        )
    `;

    db.query(sql, err => {
        if (err) {
            console.log(err);
            return res.send("Cancel failed");
        }

        res.send("Appointment cancelled");
    });
});

/* =========================
   ACCEPT
========================= */
app.post("/accept-appointment", (req, res) => {
    const { id, note } = req.body;

    db.query(
        `
        UPDATE appointments
        SET status='Accepted',
            doctor_note=?
        WHERE id=?
        `,
        [note || "", id],
        err => {
            if (err) {
                console.log(err);
                return res.send("Accept failed");
            }

            res.send("Appointment accepted");
        }
    );
});

/* =========================
   REJECT
========================= */
app.post("/reject-appointment", (req, res) => {
    const { id, note } = req.body;

    db.query(
        `
        UPDATE appointments
        SET status='Rejected',
            doctor_note=?
        WHERE id=?
        `,
        [note || "", id],
        err => {
            if (err) {
                console.log(err);
                return res.send("Reject failed");
            }

            res.send("Appointment rejected");
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});