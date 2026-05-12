const API_BASE_URL = "http://localhost:5000/api";

const doctorsList = document.getElementById("doctorsList");
const doctorsMessage = document.getElementById("doctorsMessage");
const doctorSearch = document.getElementById("doctorSearch");
const specialtyFilter = document.getElementById("specialtyFilter");
const locationFilter = document.getElementById("locationFilter");
const availableOnlyFilter = document.getElementById("availableOnlyFilter");
const clearDoctorFilters = document.getElementById("clearDoctorFilters");

let allDoctors = [];

function showDoctorsMessage(message, type = "error") {
  if (!doctorsMessage) return;

  doctorsMessage.textContent = message;
  doctorsMessage.className = `form-message ${type}`;
}

function createDoctorCard(doctor) {
  const card = document.createElement("article");
  card.className = "doctor-card";

  card.innerHTML = `
    <h2>${doctor.name}</h2>
    <p><strong>Specialty:</strong> ${doctor.specialty}</p>
    <p><strong>Experience:</strong> ${doctor.experience} years</p>
    <p><strong>Location:</strong> ${doctor.location}</p>
    <p><strong>Status:</strong> ${doctor.available ? "Available" : "Not Available"}</p>
    <button
      class="book-btn"
      data-doctor-id="${doctor._id}"
      data-doctor-name="${doctor.name}"
      ${doctor.available ? "" : "disabled"}
    >
      Book Appointment
    </button>
  `;

  return card;
}

function renderDoctors(doctors) {
  doctorsList.innerHTML = "";

  if (!doctors.length) {
    showDoctorsMessage("No doctors found.");
    return;
  }

  showDoctorsMessage("");

  doctors.forEach((doctor) => {
    doctorsList.appendChild(createDoctorCard(doctor));
  });
}

function populateSpecialtyFilter(doctors) {
  if (!specialtyFilter) return;

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))]
    .filter(Boolean)
    .sort();

  specialtyFilter.innerHTML = `<option value="">All Specialties</option>`;

  specialties.forEach((specialty) => {
    const option = document.createElement("option");
    option.value = specialty;
    option.textContent = specialty;
    specialtyFilter.appendChild(option);
  });
}

function applyDoctorFilters() {
  const searchValue = doctorSearch?.value.toLowerCase().trim() || "";
  const specialtyValue = specialtyFilter?.value || "";
  const locationValue = locationFilter?.value.toLowerCase().trim() || "";
  const availableOnly = availableOnlyFilter?.checked || false;

  const filteredDoctors = allDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchValue) ||
      doctor.specialty.toLowerCase().includes(searchValue) ||
      doctor.location.toLowerCase().includes(searchValue);

    const matchesSpecialty =
      !specialtyValue || doctor.specialty === specialtyValue;

    const matchesLocation =
      !locationValue || doctor.location.toLowerCase().includes(locationValue);

    const matchesAvailability = !availableOnly || doctor.available;

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesLocation &&
      matchesAvailability
    );
  });

  renderDoctors(filteredDoctors);
}

async function fetchDoctors() {
  try {
    showDoctorsMessage("Loading doctors...", "success");

    const response = await fetch(`${API_BASE_URL}/doctors`);
    const data = await response.json();

    if (!response.ok) {
      showDoctorsMessage(data.message || "Unable to fetch doctors.");
      return;
    }

    allDoctors = data.doctors || [];
    populateSpecialtyFilter(allDoctors);
    renderDoctors(allDoctors);
  } catch (error) {
    showDoctorsMessage("Unable to connect to server.");
  }
}

[doctorSearch, specialtyFilter, locationFilter, availableOnlyFilter].forEach(
  (filterElement) => {
    if (filterElement) {
      filterElement.addEventListener("input", applyDoctorFilters);
      filterElement.addEventListener("change", applyDoctorFilters);
    }
  }
);

if (clearDoctorFilters) {
  clearDoctorFilters.addEventListener("click", () => {
    if (doctorSearch) doctorSearch.value = "";
    if (specialtyFilter) specialtyFilter.value = "";
    if (locationFilter) locationFilter.value = "";
    if (availableOnlyFilter) availableOnlyFilter.checked = false;

    renderDoctors(allDoctors);
  });
}

if (doctorsList) {
  doctorsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("book-btn")) {
      const doctorId = event.target.dataset.doctorId;
      const doctorName = event.target.dataset.doctorName;

      localStorage.setItem("selectedDoctorId", doctorId);
      localStorage.setItem("selectedDoctorName", doctorName);

      window.location.href = "appointment.html";
    }
  });
}

fetchDoctors();