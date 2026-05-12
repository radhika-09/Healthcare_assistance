const API_BASE_URL = "http://localhost:5000/api";

const adminAppointmentsList = document.getElementById("adminAppointmentsList");
const adminAppointmentsMessage = document.getElementById(
  "adminAppointmentsMessage"
);

function getAuthData() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  return { token, user };
}

function showAdminAppointmentsMessage(message, type = "error") {
  if (!adminAppointmentsMessage) return;

  adminAppointmentsMessage.textContent = message;
  adminAppointmentsMessage.className = `form-message ${type}`;
}

function checkAdminAppointmentAccess() {
  const { token, user } = getAuthData();

  if (!token || !user) {
    window.location.href = "login.html";
    return false;
  }

  if (user.role !== "admin" && user.role !== "doctor") {
    showAdminAppointmentsMessage("Access denied. Doctor or admin only.");
    return false;
  }

  return true;
}

function createAppointmentCard(appointment) {
  const card = document.createElement("article");
  card.className = "appointment-card";

  const patientName = appointment.patient?.name || "Unknown patient";
  const patientEmail = appointment.patient?.email || "No email";
  const doctorName = appointment.doctor?.name || "Unknown doctor";
  const doctorSpecialty = appointment.doctor?.specialty || "No specialty";

  card.innerHTML = `
    <h3>${patientName}</h3>
    <p><strong>Patient Email:</strong> ${patientEmail}</p>
    <p><strong>Doctor:</strong> ${doctorName}</p>
    <p><strong>Specialty:</strong> ${doctorSpecialty}</p>
    <p><strong>Date:</strong> ${appointment.date}</p>
    <p><strong>Time:</strong> ${appointment.time}</p>
    <p><strong>Reason:</strong> ${appointment.reason}</p>
    <p><strong>Status:</strong> ${appointment.status}</p>

    <label>Update Status</label>
    <select class="status-select" data-appointment-id="${appointment._id}">
      <option value="pending" ${appointment.status === "pending" ? "selected" : ""}>Pending</option>
      <option value="confirmed" ${appointment.status === "confirmed" ? "selected" : ""}>Confirmed</option>
      <option value="cancelled" ${appointment.status === "cancelled" ? "selected" : ""}>Cancelled</option>
      <option value="completed" ${appointment.status === "completed" ? "selected" : ""}>Completed</option>
    </select>
  `;

  return card;
}

async function loadAllAppointments() {
  if (!checkAdminAppointmentAccess()) return;

  const { token } = getAuthData();

  try {
    showAdminAppointmentsMessage("Loading appointments...", "success");

    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      showAdminAppointmentsMessage(
        data.message || "Unable to fetch appointments."
      );
      return;
    }

    adminAppointmentsList.innerHTML = "";

    if (!data.appointments || data.appointments.length === 0) {
      showAdminAppointmentsMessage("No appointments found.");
      return;
    }

    showAdminAppointmentsMessage("");

    data.appointments.forEach((appointment) => {
      adminAppointmentsList.appendChild(createAppointmentCard(appointment));
    });
  } catch (error) {
    showAdminAppointmentsMessage("Unable to connect to server.");
  }
}

async function updateAppointmentStatus(appointmentId, status) {
  const { token } = getAuthData();

  try {
    const response = await fetch(
      `${API_BASE_URL}/appointments/${appointmentId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showAdminAppointmentsMessage(
        data.message || "Unable to update appointment."
      );
      return;
    }

    showAdminAppointmentsMessage("Appointment status updated.", "success");
    loadAllAppointments();
  } catch (error) {
    showAdminAppointmentsMessage("Unable to connect to server.");
  }
}

if (adminAppointmentsList) {
  adminAppointmentsList.addEventListener("change", (event) => {
    if (event.target.classList.contains("status-select")) {
      const appointmentId = event.target.dataset.appointmentId;
      const status = event.target.value;

      updateAppointmentStatus(appointmentId, status);
    }
  });
}

loadAllAppointments();