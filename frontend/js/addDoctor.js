const API_BASE_URL = "http://localhost:5000/api";

const addDoctorForm = document.getElementById("addDoctorForm");
const addDoctorMessage = document.getElementById("addDoctorMessage");

function getAuthData() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  return { token, user };
}

function showAddDoctorMessage(message, type = "error") {
  if (!addDoctorMessage) return;

  addDoctorMessage.textContent = message;
  addDoctorMessage.className = `form-message ${type}`;
}

function checkAdminAccess() {
  const { token, user } = getAuthData();

  if (!token || !user) {
    window.location.href = "login.html";
    return false;
  }

  if (user.role !== "admin") {
    showAddDoctorMessage("Access denied. Admin only.");
    return false;
  }

  return true;
}

if (addDoctorForm) {
  checkAdminAccess();

  addDoctorForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!checkAdminAccess()) return;

    const { token } = getAuthData();

    const name = document.getElementById("doctorName").value.trim();
    const specialty = document.getElementById("doctorSpecialty").value.trim();
    const experience = Number(document.getElementById("doctorExperience").value);
    const location = document.getElementById("doctorLocation").value.trim();
    const phone = document.getElementById("doctorPhone").value.trim();
    const email = document.getElementById("doctorEmail").value.trim();
    const available = document.getElementById("doctorAvailable").checked;

    if (!name || !specialty || experience < 0 || !location) {
      showAddDoctorMessage(
        "Name, specialty, experience, and location are required."
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          specialty,
          experience,
          location,
          phone,
          email,
          available,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAddDoctorMessage(data.message || "Unable to add doctor.");
        return;
      }

      showAddDoctorMessage("Doctor added successfully.", "success");
      addDoctorForm.reset();
      document.getElementById("doctorAvailable").checked = true;
    } catch (error) {
      showAddDoctorMessage("Unable to connect to server.");
    }
  });
}