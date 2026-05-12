const navUser = JSON.parse(localStorage.getItem("user"));
const navToken = localStorage.getItem("token");

const guestLinks = document.querySelectorAll(".guest-link");
const authLinks = document.querySelectorAll(".auth-link");
const doctorAdminLinks = document.querySelectorAll(".doctor-admin-link");
const adminLinks = document.querySelectorAll(".admin-link");
const navLogoutBtn = document.getElementById("navLogoutBtn");


function hideElements(elements) {
  elements.forEach((element) => {
    element.style.display = "none";
  });
}

function showElements(elements) {
  elements.forEach((element) => {
    element.style.display = "";
  });
}

hideElements(authLinks);
hideElements(doctorAdminLinks);
hideElements(adminLinks);

if (navToken && navUser) {
  hideElements(guestLinks);
  showElements(authLinks);

  if (navUser.role === "doctor" || navUser.role === "admin") {
    showElements(doctorAdminLinks);
  }

  if (navUser.role === "admin") {
    showElements(adminLinks);
  }
} else {
  showElements(guestLinks);
}

if (navLogoutBtn) {
  navLogoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}