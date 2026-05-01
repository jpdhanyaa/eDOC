const express = require("express");

module.exports = (db) => {

    const router = express.Router();

    router.get("/:email", (req, res) => {
        const email = req.params.email;

        if (!email) {
            return res.json({ error: "Email is required" });
        }

        db.query(
            "SELECT id, first_name, last_name, email FROM patients WHERE email = ?",
            [email],
            (err, userResult) => {
                if (err) {
                    console.log(err);
                    return res.json({ error: "Database error" });
                }

                if (userResult.length === 0) {
                    return res.json({ error: "User not found" });
                }

                const user = userResult[0];
                const patientId = user.id;
                const query = `
                    SELECT 
                        a.date, 
                        a.time, 
                        CONCAT(d.first_name, ' ', d.last_name) AS doctor
                    FROM appointments a
                    JOIN doctors d ON a.doctor_id = d.id
                    WHERE a.patient_id = ?
                    ORDER BY a.date DESC
                    LIMIT 1
                `;

                db.query(query, [patientId], (err2, appointmentResult) => {
                    if (err2) {
                        console.log(err2);
                        return res.json({ error: "Appointment query error" });
                    }

                    res.json({
                        user: user,
                        appointment: appointmentResult.length > 0
                            ? appointmentResult[0]
                            : null
                    });
                });
            }
        );
    });

    return router;
};