const API_BASE_URL = "http://localhost:5000/api";

const appointmentForm = document.getElementById("appointmentForm");
const doctorNameInput = document.getElementById("doctorName");
const appointmentMessage = document.getElementById("appointmentMessage");

const selectedDoctorId = localStorage.getItem("selectedDoctorId");
const selectedDoctorName = localStorage.getItem("selectedDoctorName");

function showAppointmentMessage(message, type = "error") {
  if (!appointmentMessage) return;

  appointmentMessage.textContent = message;
  appointmentMessage.className = `form-message ${type}`;
}

function checkAppointmentAccess() {
  const token = localStorage.getItem("token");

  if (!token) {
    showAppointmentMessage("Please login before booking an appointment.");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
    return false;
  }

  if (!selectedDoctorId || !selectedDoctorName) {
    showAppointmentMessage("Please select a doctor first.");
    setTimeout(() => {
      window.location.href = "doctors.html";
    }, 1000);
    return false;
  }

  return true;
}

if (doctorNameInput) {
  doctorNameInput.value = selectedDoctorName || "";
}

if (appointmentForm) {
  checkAppointmentAccess();

  appointmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;
    const reason = document.getElementById("appointmentReason").value.trim();

    if (!date || !time || !reason) {
      showAppointmentMessage("Please fill all appointment details.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          date,
          time,
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAppointmentMessage(data.message || "Unable to book appointment.");
        return;
      }

      localStorage.removeItem("selectedDoctorId");
      localStorage.removeItem("selectedDoctorName");

      showAppointmentMessage("Appointment booked successfully.", "success");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } catch (error) {
      showAppointmentMessage("Unable to connect to server.");
    }
  });
}