const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctors");

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({
        message: "Doctor, date, time, and reason are required.",
      });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor", "name specialty location")
      .populate("patient", "name email");

    res.status(201).json({
      message: "Appointment booked successfully.",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    res.status(500).json({
      message: "Unable to book appointment.",
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name specialty location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.error("Get my appointments error:", error);

    res.status(500).json({
      message: "Unable to fetch appointments.",
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name specialty location")
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    res.status(500).json({
      message: "Unable to fetch appointments.",
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status.",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("doctor", "name specialty location")
      .populate("patient", "name email");

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    res.status(200).json({
      message: "Appointment status updated.",
      appointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);

    res.status(500).json({
      message: "Unable to update appointment.",
    });
  }
};

const cancelMyAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can cancel only your own appointment.",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        message: "Appointment is already cancelled.",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        message: "Completed appointments cannot be cancelled.",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor", "name specialty location")
      .populate("patient", "name email");

    res.status(200).json({
      message: "Appointment cancelled successfully.",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    res.status(500).json({
      message: "Unable to cancel appointment.",
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelMyAppointment,
};