const { StateGraph, Annotation, START, END } = require("@langchain/langgraph");
const { generateHealthReply } = require("./geminiService");

const HealthChatState = Annotation.Root({
  message: Annotation(),
  category: Annotation(),
  reply: Annotation(),
});

const emergencyKeywords = [
  "chest pain",
  "difficulty breathing",
  "shortness of breath",
  "unconscious",
  "severe bleeding",
  "stroke",
  "heart attack",
  "suicide",
  "poison",
  "seizure",
  "fainting",
  "can't breathe",
  "cannot breathe",
  "severe allergic reaction",
  "face drooping",
  "loss of consciousness",
];

const healthKeywords = [
  "fever",
  "headache",
  "cough",
  "cold",
  "pain",
  "stomach",
  "vomit",
  "vomiting",
  "nausea",
  "dizzy",
  "dizziness",
  "rash",
  "sore throat",
  "body pain",
  "weakness",
  "fatigue",
  "diarrhea",
  "breathing",
  "blood pressure",
  "sugar",
  "diabetes",
  "infection",
  "symptom",
  "symptoms",
];

function normalizeMessage(message) {
  return String(message || "").trim().toLowerCase();
}

function addDisclaimer(reply) {
  const safeReply =
    reply ||
    "Please describe your symptoms in simple words, including when they started and how severe they are.";

  const disclaimer =
    "This is AI-generated guidance, not professional medical advice. For proper care, please contact a qualified doctor.";

  if (safeReply.includes("AI-generated guidance")) {
    return safeReply;
  }

  return `${safeReply}\n\n${disclaimer}`;
}

function classifyMessage(state) {
  const message = normalizeMessage(state.message);

  const isEmergency = emergencyKeywords.some((keyword) =>
    message.includes(keyword)
  );

  if (isEmergency) {
    return { category: "emergency" };
  }

  const greetingWords = ["hi", "hello", "hey", "namaste"];

  const isGreeting =
    greetingWords.includes(message) ||
    greetingWords.some((word) => message.startsWith(`${word} `)) ||
    message.includes("good morning") ||
    message.includes("good afternoon") ||
    message.includes("good evening");

  if (isGreeting && message.length <= 25) {
    return { category: "greeting" };
  }

  if (message.length < 4) {
    return { category: "unclear" };
  }

  if (
    message.includes("appointment") ||
    message.includes("book doctor") ||
    message.includes("find doctor") ||
    message.includes("doctor appointment") ||
    message.includes("consult doctor")
  ) {
    return { category: "appointment_help" };
  }

  const isHealthQuestion = healthKeywords.some((keyword) =>
    message.includes(keyword)
  );

  if (isHealthQuestion) {
    return { category: "health_question" };
  }

  return { category: "health_question" };
}

function routeMessage(state) {
  return state.category || "health_question";
}

function emergencyResponse() {
  return {
    category: "emergency",
    reply:
      "Your symptoms may be urgent. Please contact emergency medical services immediately or go to the nearest hospital.\n\nThis is AI-generated guidance, not professional medical advice.",
  };
}

function greetingResponse() {
  return {
    category: "greeting",
    reply:
      "Hello! Please tell me your health concern or symptom, and I can share general guidance.\n\nThis is AI-generated guidance, not professional medical advice.",
  };
}

function unclearResponse() {
  return {
    category: "unclear",
    reply:
      "Please describe your symptoms in simple words, such as when they started, how severe they are, and whether you have fever, pain, cough, vomiting, or breathing difficulty.\n\nThis is AI-generated guidance, not professional medical advice.",
  };
}

function appointmentResponse() {
  return {
    category: "appointment_help",
    reply:
      "You can book an appointment by choosing a doctor, selecting a date and time, and submitting your request. If your symptoms are severe or urgent, contact emergency medical services immediately.\n\nThis is AI-generated guidance, not professional medical advice.",
  };
}

function getFallbackReply(message) {
  const lowerMessage = normalizeMessage(message);

  if (lowerMessage.includes("fever")) {
    return "Fever can happen for many reasons. Please rest, drink fluids, and monitor your temperature. Are you also having cough, headache, body pain, sore throat, vomiting, rash, or breathing difficulty?";
  }

  if (lowerMessage.includes("headache")) {
    return "A headache may be related to stress, dehydration, lack of sleep, or other causes. Are you also having fever, vomiting, vision changes, neck stiffness, or severe pain?";
  }

  if (lowerMessage.includes("cough")) {
    return "For cough, warm fluids and rest may help. Are you also having fever, chest pain, breathing difficulty, or cough lasting more than a few days?";
  }

  if (lowerMessage.includes("stomach") || lowerMessage.includes("vomit")) {
    return "Stomach discomfort or vomiting can have many causes. Try to stay hydrated. Are you also having fever, severe pain, blood in vomit or stool, or signs of dehydration?";
  }

  return "Please describe your symptoms in a little more detail, such as when they started, how severe they are, and whether you have fever, pain, cough, vomiting, or breathing difficulty.";
}

async function geminiResponse(state) {
  try {
    const geminiReply = await generateHealthReply(state.message);

    return {
      category: "health_question",
      reply: addDisclaimer(geminiReply),
    };
  } catch (error) {
    console.error("Gemini failed:", error.message);

    return {
      category: "fallback_health_guidance",
      reply: addDisclaimer(getFallbackReply(state.message)),
    };
  }
}

const healthChatGraph = new StateGraph(HealthChatState)
  .addNode("classifyMessage", classifyMessage)
  .addNode("emergencyResponse", emergencyResponse)
  .addNode("greetingResponse", greetingResponse)
  .addNode("unclearResponse", unclearResponse)
  .addNode("appointmentResponse", appointmentResponse)
  .addNode("geminiResponse", geminiResponse)
  .addEdge(START, "classifyMessage")
  .addConditionalEdges("classifyMessage", routeMessage, {
    emergency: "emergencyResponse",
    greeting: "greetingResponse",
    unclear: "unclearResponse",
    appointment_help: "appointmentResponse",
    health_question: "geminiResponse",
  })
  .addEdge("emergencyResponse", END)
  .addEdge("greetingResponse", END)
  .addEdge("unclearResponse", END)
  .addEdge("appointmentResponse", END)
  .addEdge("geminiResponse", END)
  .compile();

async function runHealthChatGraph(message) {
  const result = await healthChatGraph.invoke({
    message,
    category: "",
    reply: "",
  });

  return {
    reply:
      result.reply ||
      addDisclaimer(getFallbackReply(message)),
    category: result.category || "fallback_health_guidance",
  };
}

module.exports = {
  runHealthChatGraph,
};