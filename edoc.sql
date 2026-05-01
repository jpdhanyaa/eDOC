CREATE DATABASE IF NOT EXISTS edoc;
USE edoc;

DROP TABLE IF EXISTS reminders;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS appointments;


-- =========================
-- APPOINTMENTS TABLE
-- =========================
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    session ENUM('FN','AN') NOT NULL,

    has_document TINYINT(1) DEFAULT 0,

    status VARCHAR(50) DEFAULT 'Booked',

    cancel_reason VARCHAR(255),

    report_path VARCHAR(255),

    doctor_note TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- DOCUMENTS TABLE
-- =========================
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);


-- =========================
-- NOTIFICATIONS TABLE
-- =========================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    message VARCHAR(255),
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);


-- =========================
-- REMINDERS TABLE
-- =========================
CREATE TABLE reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    reminder_date DATE,
    is_sent TINYINT(1) DEFAULT 0,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);


INSERT INTO appointments 
(patient_name, appointment_date, session, status)
VALUES 
('Anu', '2026-03-25', 'FN', 'Booked');


SELECT * FROM appointments;