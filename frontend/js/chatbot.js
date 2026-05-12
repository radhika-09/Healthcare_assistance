const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");
const loadHistoryBtn = document.getElementById("loadHistoryBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const API_BASE_URL = "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/chatbot/message`;

function getToken() {
  return localStorage.getItem("token");
}

function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function resetChatBox() {
  chatBox.innerHTML = "";

  addMessage(
    "Hello! I can give basic health guidance. How can I help you?",
    "bot"
  );
}

async function loadChatHistory() {
  const token = getToken();

  if (!token) {
    addMessage("Please login to view chat history.", "bot");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/chatbot/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      addMessage(data.message || "Unable to load chat history.", "bot");
      return;
    }

    resetChatBox();

    if (!data.history || data.history.length === 0) {
      addMessage("No chat history found.", "bot");
      return;
    }

    data.history.forEach((chat) => {
      addMessage(chat.message, "user");
      addMessage(chat.reply, "bot");
    });
  } catch (error) {
    addMessage("Unable to connect to server.", "bot");
  }
}

async function clearChatHistory() {
  const token = getToken();

  if (!token) {
    addMessage("Please login to clear chat history.", "bot");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/chatbot/history`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      addMessage(data.message || "Unable to clear chat history.", "bot");
      return;
    }

    resetChatBox();
    addMessage("Chat history cleared.", "bot");
  } catch (error) {
    addMessage("Unable to connect to server.", "bot");
  }
}

if (chatForm) {
  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
      return;
    }

    addMessage(message, "user");
    messageInput.value = "";

    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        addMessage(
          data.reply ||
            data.message ||
            "Please describe your symptoms in more detail. If this is urgent or severe, contact emergency medical services immediately.",
          "bot"
        );
        return;
      }

      addMessage(data.reply || data.message || "I received your message.", "bot");
    } catch (error) {
      addMessage("Unable to connect to chatbot server. Please try again.", "bot");
    }
  });
}

if (loadHistoryBtn) {
  loadHistoryBtn.addEventListener("click", loadChatHistory);
}

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", clearChatHistory);
}