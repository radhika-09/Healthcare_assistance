const API_BASE_URL = "http://localhost:5000/api";

const profileForm = document.getElementById("profileForm");
const passwordForm = document.getElementById("passwordForm");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function showProfileMessage(elementId, message, type = "error") {
  const messageElement = document.getElementById(elementId);

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.className = `form-message ${type}`;
}

function checkProfileAccess() {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    window.location.href = "login.html";
    return false;
  }

  return true;
}

function loadProfileData() {
  const user = getUser();

  if (!user) return;

  profileName.value = user.name || "";
  profileEmail.value = user.email || "";
}

if (profileForm) {
  if (checkProfileAccess()) {
    loadProfileData();
  }

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = getToken();
    const name = profileName.value.trim();
    const email = profileEmail.value.trim();

    if (!name || !email) {
      showProfileMessage("profileMessage", "Name and email are required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showProfileMessage(
          "profileMessage",
          data.message || "Unable to update profile."
        );
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      showProfileMessage("profileMessage", "Profile updated successfully.", "success");
    } catch (error) {
      showProfileMessage("profileMessage", "Unable to connect to server.");
    }
  });
}

if (passwordForm) {
  passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = getToken();
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!oldPassword || !newPassword) {
      showProfileMessage(
        "passwordMessage",
        "Old password and new password are required."
      );
      return;
    }

    if (newPassword.length < 6) {
      showProfileMessage(
        "passwordMessage",
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        showProfileMessage(
          "passwordMessage",
          data.message || "Unable to update password."
        );
        return;
      }

      showProfileMessage("passwordMessage", "Password updated successfully.", "success");
      passwordForm.reset();
    } catch (error) {
      showProfileMessage("passwordMessage", "Unable to connect to server.");
    }
  });
}