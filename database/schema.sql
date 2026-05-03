CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('patient', 'doctor') NOT NULL
);

CREATE TABLE Consultations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    date_time DATETIME NOT NULL,
    status ENUM('pending', 'completed', 'canceled') NOT NULL,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES Users(id),
    FOREIGN KEY (doctor_id) REFERENCES Users(id)
);

CREATE TABLE MedicalRecords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consultation_id INT,
    record_data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consultation_id) REFERENCES Consultations(id)
);