const express = require("express");
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelMyAppointment,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("patient"), createAppointment);
router.get("/my", protect, getMyAppointments);
router.get("/", protect, allowRoles("doctor", "admin"), getAllAppointments);
router.patch("/:id/cancel", protect, allowRoles("patient"), cancelMyAppointment);
router.patch(
  "/:id/status",
  protect,
  allowRoles("doctor", "admin"),
  updateAppointmentStatus
);

module.exports = router;