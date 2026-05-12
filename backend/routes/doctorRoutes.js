const express = require("express");
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.post("/", protect, allowRoles("admin"), createDoctor);
router.patch("/:id", protect, allowRoles("admin"), updateDoctor);
router.delete("/:id", protect, allowRoles("admin"), deleteDoctor);

module.exports = router;