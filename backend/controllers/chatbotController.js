const { runHealthChatGraph } = require("../services/healthChatGraph");
const ChatMessage = require("../models/ChatMessage");

const getChatbotReply = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim().length < 2) {
      return res.status(400).json({
        reply: "Please enter a valid health question.",
      });
    }

    const cleanMessage = message.trim();
    const result = await runHealthChatGraph(cleanMessage);

    if (req.user) {
      await ChatMessage.create({
        user: req.user._id,
        message: cleanMessage,
        reply: result.reply,
        category: result.category,
      });
    }

    res.status(200).json({
      reply: result.reply,
      category: result.category,
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    res.status(500).json({
      reply:
        "Please describe your symptoms in simple words, such as when they started, how severe they are, and whether you have fever, pain, cough, vomiting, or breathing difficulty. If symptoms are severe, worsening, or urgent, contact emergency medical services immediately.\n\nThis is AI-generated guidance, not professional medical advice.",
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const history = await ChatMessage.find({ user: req.user._id }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      history,
    });
  } catch (error) {
    console.error("Get chat history error:", error);

    res.status(500).json({
      message: "Unable to fetch chat history.",
    });
  }
};

const clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ user: req.user._id });

    res.status(200).json({
      message: "Chat history cleared.",
    });
  } catch (error) {
    console.error("Clear chat history error:", error);

    res.status(500).json({
      message: "Unable to clear chat history.",
    });
  }
};

module.exports = {
  getChatbotReply,
  getChatHistory,
  clearChatHistory,
};