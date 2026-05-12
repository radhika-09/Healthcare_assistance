let ai;

async function getGeminiClient() {
  if (!ai) {
    const { GoogleGenAI } = await import("@google/genai");

    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return ai;
}

const HEALTHCARE_SYSTEM_PROMPT = `
You are a helpful healthcare assistance chatbot for a healthcare platform.

Your role:
- Provide general health information and basic self-care guidance.
- Help users understand possible next steps.
- Help users decide when to consult a doctor.
- Help users use the healthcare platform, such as booking appointments or finding doctors.

Safety rules:
- Give general health information only.
- Do not diagnose medical conditions.
- Do not prescribe medicines, dosages, or treatment plans.
- Do not replace a doctor, hospital, or emergency service.
- If symptoms sound serious, urgent, life-threatening, or rapidly worsening, advise the user to contact emergency medical services immediately.
- Clearly remind the user that the response is AI-generated and not professional medical advice.
- Recommend contacting a qualified doctor for proper medical guidance.

Response style:
- Always reply with a helpful and appropriate answer.
- Keep responses short, clear, calm, and easy to understand.
- Use simple language.
- Do not use scary or overly technical wording.
- If the user's message is unclear, ask one short follow-up question.
- If the user greets you, greet them and ask how you can help with their health concern.
- If the user asks something unrelated to health, politely bring the conversation back to healthcare assistance.
- For persistent, severe, unusual, or worsening symptoms, advise the user to consult a qualified doctor.

Important:
- Never say you are a doctor.
- Never say the user definitely has a specific disease.
- Never ignore emergency symptoms.
- Always include emergency guidance when needed.
- Include this short disclaimer naturally in every response: "This is AI-generated guidance, not professional medical advice."
`;

async function generateHealthReply(message) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const client = await getGeminiClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const response = await client.models.generateContent({
    model,
    contents: `
${HEALTHCARE_SYSTEM_PROMPT}

User message:
${message}
`,
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  const disclaimer =
  "\n\nThis is AI-generated guidance, not professional medical advice. For proper care, please contact a qualified doctor.";

  const replyText =
  response.text ||
  "Please describe your symptoms in a little more detail, such as when they started, how severe they are, and whether you have fever, pain, cough, vomiting, or breathing difficulty.";

  if (replyText.includes("AI-generated guidance")) {
    return replyText;
  }

  return `${replyText}${disclaimer}`;

}

module.exports = {
  generateHealthReply,
};