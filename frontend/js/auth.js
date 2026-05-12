const API_BASE_URL = "http://localhost:5000/api";

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

function saveAuthData(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
}

function showMessage(elementId, message, type = "error") {
  const messageElement = document.getElementById(elementId);

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.className = `form-message ${type}`;
}

function showElementById(id) {
  const element = document.getElementById(id);

  if (element) {
    element.classList.remove("hidden");
  }
}

if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const role = document.getElementById("signupRole").value;

    if (!name || !email || !password) {
      showMessage("signupMessage", "Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      showMessage("signupMessage", "Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage("signupMessage", data.message || "Signup failed.");
        return;
      }

      saveAuthData(data);
      showMessage("signupMessage", "Signup successful.", "success");

      window.location.href = "dashboard.html";
    } catch (error) {
      showMessage("signupMessage", "Unable to connect to server.");
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      showMessage("loginMessage", "Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage("loginMessage", data.message || "Login failed.");
        return;
      }

      saveAuthData(data);
      showMessage("loginMessage", "Login successful.", "success");

      window.location.href = "dashboard.html";
    } catch (error) {
      showMessage("loginMessage", "Unable to connect to server.");
    }
  });
}

async function loadMyAppointments() {
  const token = localStorage.getItem("token");
  const appointmentsList = document.getElementById("appointmentsList");
  const appointmentsMessage = document.getElementById("appointmentsMessage");

  if (!appointmentsList || !appointmentsMessage) return;

  try {
    appointmentsMessage.textContent = "Loading appointments...";

    const response = await fetch(`${API_BASE_URL}/appointments/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      appointmentsMessage.textContent =
        data.message || "Unable to fetch appointments.";
      return;
    }

    appointmentsList.innerHTML = "";

    if (!data.appointments || data.appointments.length === 0) {
      appointmentsMessage.textContent = "No appointments booked yet.";
      return;
    }

    appointmentsMessage.textContent = "";

    data.appointments.forEach((appointment) => {
      const appointmentCard = document.createElement("div");
      appointmentCard.className = "appointment-card";

      const canCancel =
        appointment.status === "pending" || appointment.status === "confirmed";

      appointmentCard.innerHTML = `
        <h3>${appointment.doctor.name}</h3>
        <p><strong>Specialty:</strong> ${appointment.doctor.specialty}</p>
        <p><strong>Location:</strong> ${appointment.doctor.location}</p>
        <p><strong>Date:</strong> ${appointment.date}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p><strong>Reason:</strong> ${appointment.reason}</p>
        <p><strong>Status:</strong> ${appointment.status}</p>
        ${
          canCancel
            ? `<button class="cancel-appointment-btn" data-appointment-id="${appointment._id}">
                Cancel Appointment
              </button>`
            : ""
        }
      `;

      appointmentsList.appendChild(appointmentCard);
    });
  } catch (error) {
    appointmentsMessage.textContent = "Unable to connect to server.";
  }
}

async function cancelAppointment(appointmentId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `${API_BASE_URL}/appointments/${appointmentId}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to cancel appointment.");
      return;
    }

    alert("Appointment cancelled successfully.");
    loadMyAppointments();
  } catch (error) {
    alert("Unable to connect to server.");
  }
}

function loadDashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    window.location.href = "login.html";
    return;
  }

  const nameElement = document.getElementById("dashboardName");
  const emailElement = document.getElementById("dashboardEmail");
  const roleElement = document.getElementById("dashboardRole");

  if (nameElement) nameElement.textContent = user.name;
  if (emailElement) emailElement.textContent = user.email;
  if (roleElement) roleElement.textContent = user.role;

  if (user.role === "patient") {
    showElementById("patientSection");
    showElementById("appointmentsSection");
    loadMyAppointments();
  }

  if (user.role === "doctor") {
    showElementById("doctorSection");
  }

  if (user.role === "admin") {
    showElementById("adminSection");
  }
}

if (window.location.pathname.includes("dashboard.html")) {
  loadDashboard();
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}

const appointmentsList = document.getElementById("appointmentsList");

if (appointmentsList) {
  appointmentsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("cancel-appointment-btn")) {
      const appointmentId = event.target.dataset.appointmentId;
      cancelAppointment(appointmentId);
    }
  });
}