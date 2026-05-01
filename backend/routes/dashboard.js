const express = require("express")
const router = express.Router()

module.exports = (db) => {

    router.get("/:email", (req, res) => {
        const email = req.params.email

        // Get user
        db.query("SELECT * FROM patients WHERE email = ?", [email], (err, userResult) => {
            if (err) return res.json({ error: err })

            // Get appointment
            db.query("SELECT * FROM appointments WHERE email = ?", [email], (err2, appointmentResult) => {
                if (err2) return res.json({ error: err2 })

                res.json({
                    user: userResult[0],
                    appointment: appointmentResult[0]
                })
            })
        })
    })

    return router
}