const express = require("express");
const { signup, login, getMe } = require("../controllers/authControllers");
const { protect } = require("../middleware/authMiddleware");
const { updateProfile, updatePassword } = require("../controllers/authControllers");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.patch("/password", protect, updatePassword);

module.exports = router;