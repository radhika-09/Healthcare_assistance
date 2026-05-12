const Doctor = require("../models/Doctors");

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });

    res.status(200).json({
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);

    res.status(500).json({
      message: "Unable to fetch doctors.",
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    res.status(200).json({
      doctor,
    });
  } catch (error) {
    console.error("Get doctor error:", error);

    res.status(500).json({
      message: "Unable to fetch doctor.",
    });
  }
};

const createDoctor = async (req, res) => {
  try {
    const { name, specialty, experience, location, phone, email, available } =
      req.body;

    if (!name || !specialty || experience === undefined || !location) {
      return res.status(400).json({
        message: "Name, specialty, experience, and location are required.",
      });
    }

    const doctor = await Doctor.create({
      name,
      specialty,
      experience,
      location,
      phone,
      email,
      available,
    });

    res.status(201).json({
      message: "Doctor created successfully.",
      doctor,
    });
  } catch (error) {
    console.error("Create doctor error:", error);

    res.status(500).json({
      message: "Unable to create doctor.",
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { name, specialty, experience, location, phone, email, available } =
      req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    doctor.name = name ?? doctor.name;
    doctor.specialty = specialty ?? doctor.specialty;
    doctor.experience =
      experience !== undefined ? experience : doctor.experience;
    doctor.location = location ?? doctor.location;
    doctor.phone = phone ?? doctor.phone;
    doctor.email = email ?? doctor.email;
    doctor.available =
      available !== undefined ? available : doctor.available;

    await doctor.save();

    res.status(200).json({
      message: "Doctor updated successfully.",
      doctor,
    });
  } catch (error) {
    console.error("Update doctor error:", error);

    res.status(500).json({
      message: "Unable to update doctor.",
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    await doctor.deleteOne();

    res.status(200).json({
      message: "Doctor deleted successfully.",
    });
  } catch (error) {
    console.error("Delete doctor error:", error);

    res.status(500).json({
      message: "Unable to delete doctor.",
    });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};