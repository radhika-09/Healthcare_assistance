const API_BASE_URL = "http://localhost:5000/api";

const manageDoctorsList = document.getElementById("manageDoctorsList");
const manageDoctorsMessage = document.getElementById("manageDoctorsMessage");

function getAuthData() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  return { token, user };
}

function showManageDoctorsMessage(message, type = "error") {
  if (!manageDoctorsMessage) return;

  manageDoctorsMessage.textContent = message;
  manageDoctorsMessage.className = `form-message ${type}`;
}

function checkAdminAccess() {
  const { token, user } = getAuthData();

  if (!token || !user) {
    window.location.href = "login.html";
    return false;
  }

  if (user.role !== "admin") {
    showManageDoctorsMessage("Access denied. Admin only.");
    return false;
  }

  return true;
}

function createDoctorManageCard(doctor) {
  const card = document.createElement("article");
  card.className = "doctor-card";

  card.innerHTML = `
    <form class="edit-doctor-form" data-doctor-id="${doctor._id}">
      <input type="text" name="name" value="${doctor.name}" required />
      <input type="text" name="specialty" value="${doctor.specialty}" required />
      <input type="number" name="experience" value="${doctor.experience}" required />
      <input type="text" name="location" value="${doctor.location}" required />
      <input type="text" name="phone" value="${doctor.phone || ""}" />
      <input type="email" name="email" value="${doctor.email || ""}" />

      <label class="checkbox-label">
        <input type="checkbox" name="available" ${doctor.available ? "checked" : ""} />
        Available
      </label>

      <button type="submit">Update</button>
      <button type="button" class="delete-doctor-btn" data-doctor-id="${doctor._id}">
        Delete
      </button>
    </form>
  `;

  return card;
}

async function loadDoctorsForManagement() {
  if (!checkAdminAccess()) return;

  try {
    showManageDoctorsMessage("Loading doctors...", "success");

    const response = await fetch(`${API_BASE_URL}/doctors`);
    const data = await response.json();

    if (!response.ok) {
      showManageDoctorsMessage(data.message || "Unable to fetch doctors.");
      return;
    }

    manageDoctorsList.innerHTML = "";

    if (!data.doctors || data.doctors.length === 0) {
      showManageDoctorsMessage("No doctors found.");
      return;
    }

    showManageDoctorsMessage("");

    data.doctors.forEach((doctor) => {
      manageDoctorsList.appendChild(createDoctorManageCard(doctor));
    });
  } catch (error) {
    showManageDoctorsMessage("Unable to connect to server.");
  }
}

async function updateDoctor(form) {
  const { token } = getAuthData();
  const doctorId = form.dataset.doctorId;

  const formData = new FormData(form);

  const updatedDoctor = {
    name: formData.get("name").trim(),
    specialty: formData.get("specialty").trim(),
    experience: Number(formData.get("experience")),
    location: formData.get("location").trim(),
    phone: formData.get("phone").trim(),
    email: formData.get("email").trim(),
    available: formData.get("available") === "on",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedDoctor),
    });

    const data = await response.json();

    if (!response.ok) {
      showManageDoctorsMessage(data.message || "Unable to update doctor.");
      return;
    }

    showManageDoctorsMessage("Doctor updated successfully.", "success");
    loadDoctorsForManagement();
  } catch (error) {
    showManageDoctorsMessage("Unable to connect to server.");
  }
}

async function deleteDoctor(doctorId) {
  const { token } = getAuthData();

  const confirmDelete = confirm("Are you sure you want to delete this doctor?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      showManageDoctorsMessage(data.message || "Unable to delete doctor.");
      return;
    }

    showManageDoctorsMessage("Doctor deleted successfully.", "success");
    loadDoctorsForManagement();
  } catch (error) {
    showManageDoctorsMessage("Unable to connect to server.");
  }
}

if (manageDoctorsList) {
  manageDoctorsList.addEventListener("submit", (event) => {
    if (event.target.classList.contains("edit-doctor-form")) {
      event.preventDefault();
      updateDoctor(event.target);
    }
  });

  manageDoctorsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-doctor-btn")) {
      const doctorId = event.target.dataset.doctorId;
      deleteDoctor(doctorId);
    }
  });
}

loadDoctorsForManagement();