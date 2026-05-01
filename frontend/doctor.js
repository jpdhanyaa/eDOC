function loadDoctorAppointments() {

    fetch("http://localhost:3000/appointments")
        .then(res => res.json())
        .then(data => {

            const box = document.getElementById("doctorAppointments");

            if (data.length === 0) {
                box.innerHTML = "<p>No appointments found</p>";
                return;
            }

            box.innerHTML = "";

            data.reverse().forEach(app => {

                const date = app.appointment_date.split("T")[0];

                box.innerHTML += `
                    <div style="
                        border:1px solid #ddd;
                        padding:20px;
                        border-radius:12px;
                        margin-bottom:15px;
                        background:${app.status === 'Accepted'
                            ? '#ecfdf5'
                            : app.status === 'Rejected'
                            ? '#fef2f2'
                            : '#f9fafb'};
                    ">
                        <h3>${app.patient_name}</h3>
                        <p><b>Date:</b> ${date}</p>
                        <p><b>Session:</b> ${app.session}</p>
                        <p><b>Status:</b> ${app.status}</p>

                        ${
                            app.doctor_note
                            ? `<p><b>Doctor Note:</b> ${app.doctor_note}</p>`
                            : ""
                        }

                        ${
                            app.status !== "Rejected"
                            ? `
                                <textarea 
                                    id="note-${app.id}"
                                    placeholder="Doctor Notes..."
                                    style="
                                        width:100%;
                                        margin-top:15px;
                                        padding:10px;
                                        border-radius:8px;
                                        border:1px solid #ccc;
                                    "
                                ></textarea>
                            `
                            : ""
                        }

                        ${
                            app.status === "Booked"
                            ? `
                                <button onclick="acceptAppointment(${app.id})">
                                    Accept
                                </button>

                                <button onclick="rejectAppointment(${app.id})"
                                    style="background:#dc2626;margin-left:10px;">
                                    Reject
                                </button>
                            `
                            : ""
                        }

                        ${
                            app.status === "Accepted"
                            ? `
                                <button onclick="rejectAppointment(${app.id})"
                                    style="background:#dc2626;margin-left:10px;">
                                    Cancel Accepted Appointment
                                </button>
                            `
                            : ""
                        }

                        ${
                            app.report_path
                            ? `
                                <button onclick="viewReport('${app.report_path}')"
                                    style="background:#059669;margin-left:10px;">
                                    View Report
                                </button>
                            `
                            : ""
                        }
                    </div>
                `;
            });

        })
        .catch(err => {
            console.error(err);
            document.getElementById("doctorAppointments").innerHTML =
                "<p>Failed to load appointments</p>";
        });
}


function acceptAppointment(id) {

    const noteBox = document.getElementById(`note-${id}`);
    const note = noteBox ? noteBox.value : "";

    fetch("http://localhost:3000/accept-appointment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, note })
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        loadDoctorAppointments();
    });
}


function rejectAppointment(id) {

    const noteBox = document.getElementById(`note-${id}`);
    const note = noteBox ? noteBox.value : "";

    fetch("http://localhost:3000/reject-appointment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, note })
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        loadDoctorAppointments();
    });
}


function viewReport(file) {
    window.open(`http://localhost:3000/uploads/${file}`, "_blank");
}


window.onload = loadDoctorAppointments;