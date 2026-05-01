function goToPage2() {
    let name = document.getElementById("name").value.trim();
    let date = document.getElementById("date").value;

    if (!name || !date) {
        alert("Fill all fields");
        return;
    }

    document.getElementById("page1").classList.add("hidden");
    document.getElementById("page2").classList.remove("hidden");
}


/* =========================
   BOOK APPOINTMENT
========================= */
function bookAppointment() {

    let name = document.getElementById("name").value.trim();
    let date = document.getElementById("date").value;
    let session = document.getElementById("session").value;
    let file = document.getElementById("file").files[0];

    if (!name || !date || !session) {
        alert("Fill all fields");
        return;
    }

    const formData = new FormData();

    formData.append("patient_name", name);
    formData.append("appointment_date", date);
    formData.append("session", session);

    if (file) {
        formData.append("report", file);
    }

    fetch("http://localhost:3000/book-appointment", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);

        loadAppointments();

        document.getElementById("name").value = "";
        document.getElementById("date").value = "";
        document.getElementById("session").value = "FN";
        document.getElementById("file").value = "";
        document.getElementById("consultOnly").checked = false;

        document.getElementById("page2").classList.add("hidden");
        document.getElementById("page1").classList.remove("hidden");
    })
    .catch(err => {
        console.log(err);
        alert("Booking failed");
    });
}


/* =========================
   LOAD APPOINTMENTS
========================= */
function loadAppointments() {

    fetch("http://localhost:3000/appointments")
        .then(res => res.json())
        .then(data => {

            const box = document.getElementById("notifications");
            box.innerHTML = "";

            if (data.length === 0) {
                box.innerHTML = "<p>No appointments</p>";
                return;
            }

            const app = data[data.length - 1];

            const date = app.appointment_date.split("T")[0];

            let statusMessage = app.status;

            if (app.status === "Accepted") {
                statusMessage = "Doctor Accepted Appointment";
            }
            else if (app.status === "Rejected") {
                statusMessage = "Doctor Rejected Appointment";
            }

            box.innerHTML = `
                <div class="p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <b>${app.patient_name}</b><br>
                    ${date} | ${app.session}<br>
                    Status: ${statusMessage}
                    ${
                        app.doctor_note
                        ? `<br><small><b>Doctor Note:</b> ${app.doctor_note}</small>`
                        : ""
                    }
                </div>
            `;
        })
        .catch(err => console.log(err));
}


/* =========================
   CANCEL APPOINTMENT
========================= */
function cancelAppointment() {

    const reason = document.getElementById("cancelReason").value.trim();

    if (!reason) {
        alert("Enter cancel reason");
        return;
    }

    fetch("http://localhost:3000/appointments")
        .then(res => res.json())
        .then(data => {

            if (data.length === 0) {
                alert("No appointment");
                return;
            }

            const app = data[data.length - 1];

            const today = new Date();
            today.setHours(0,0,0,0);

            const appDate = new Date(app.appointment_date);
            appDate.setHours(0,0,0,0);

            const diff = Math.ceil(
                (appDate - today) / (1000 * 60 * 60 * 24)
            );

            if (diff <= 2) {
                alert("Cannot cancel (less than 2 days)");
                return;
            }

            fetch("http://localhost:3000/cancel-appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ reason })
            })
            .then(res => res.text())
            .then(msg => {
                alert(msg);

                document.getElementById("cancelReason").value = "";

                loadAppointments();
            });

        })
        .catch(err => console.log(err));
}


window.onload = loadAppointments;