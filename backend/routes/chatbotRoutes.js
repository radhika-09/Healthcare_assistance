const express = require("express");
const {
  getChatbotReply,
  getChatHistory,
  clearChatHistory,
} = require("../controllers/chatbotController");
const { protect, optionalProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/message", optionalProtect, getChatbotReply);
router.get("/history", protect, getChatHistory);
router.delete("/history", protect, clearChatHistory);

module.exports = router;