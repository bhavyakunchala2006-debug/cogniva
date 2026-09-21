const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");

// Define Gemini API Key in Firebase Secret Manager
const geminiApiKeySecret = defineSecret("GEMINI_API_KEY");

// Firebase Cloud Function proxy for Google Gemini API
// Explicitly bound to Secret Manager secret (GEMINI_API_KEY)
exports.geminiChat = onRequest({ secrets: [geminiApiKeySecret], cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Retrieve API key securely from bound Secret Manager secret or environment
  const apiKey = geminiApiKeySecret.value() || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    logger.error("GEMINI_API_KEY is not configured in Firebase Secret Manager.");
    return res.status(503).json({
      error: "Gemini AI service unavailable (Secret Manager configuration required).",
      isOfflineFallback: true
    });
  }

  try {
    const { message, history = [], context = {} } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message field is required." });
    }

    // Build system prompt with context
    const lang = context.language || "English";
    const user = context.user || {};
    const clock = context.clock || {};
    const reminders = context.reminders || [];
    const games = context.games || [];
    const allowedRoutes = context.allowedRoutes || ["/elderly", "/elderly/reminders", "/elderly/games", "/elderly/profile"];

    const systemPrompt = `You are Cogniva, an empathetic AI voice companion designed for elderly users (and those with mild memory issues/dementia in Northeast India).

CURRENT REAL-TIME CONTEXT:
- User Name: ${user.name || "Friend"}
- User Role: ${user.role || "elderly"}
- State/Region: ${user.state || "Northeast India"}
- Current Date: ${clock.date || new Date().toDateString()}
- Current Local Time: ${clock.localTime || new Date().toLocaleTimeString()}
- Timezone: ${clock.timezone || "Asia/Kolkata"}
- Selected Output Language: ${lang}
- Today's Reminders & Medication Schedule: ${JSON.stringify(reminders)}
- Cognitive Games Available: ${JSON.stringify(games)}
- Safe Allowed Navigation Routes: ${JSON.stringify(allowedRoutes)}

RULES FOR RESPONDING:
1. You MUST respond strictly in the requested language (${lang}). If ${lang} is Hindi, respond in Hindi. If Assamese, in Assamese. If Manipuri, in Manipuri. If English, in English.
2. Tone: Calm, respectful, simple language, short sentences, elderly-friendly. No jargon or technical complexity.
3. Health/Medicine: Use ONLY the provided reminder/medication schedule. Never diagnose or invent medical advice. Suggest contacting a doctor or caregiver for medical concerns.
4. Real Data: If the user asks about time, date, reminders, or games, use the CURRENT REAL-TIME CONTEXT provided above. Do NOT use fake generic placeholders.
5. Navigation Intent: If the user asks to open/go to a section (e.g., "Open reminders", "Show profile", "Let's play games"), identify if there is a matching route from the Allowed Navigation Routes.

OUTPUT FORMAT:
Return a valid JSON object with the following structure:
{
  "response": "Your spoken conversational response text here in ${lang}",
  "intent": "NAVIGATE" | "NONE",
  "route": "/elderly/reminders" (or empty string if intent is NONE)
}`;

    // Prepare contents for Gemini API using supported gemini-2.5-flash model
    const contents = [];
    
    // Add conversation history
    for (const msg of history) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      });
    }

    // Add current prompt
    contents.push({
      role: "user",
      parts: [{ text: `${systemPrompt}\n\nUSER MESSAGE: "${message}"` }]
    });

    // Single currently supported stable Gemini model (gemini-2.5-flash)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const apiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 300,
          responseMimeType: "application/json"
        }
      })
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      logger.error("Gemini API call failed:", errText);
      return res.status(502).json({ error: "Gemini API error", details: errText });
    }

    const rawData = await apiRes.json();
    const candidates = rawData.candidates;
    if (!candidates || candidates.length === 0) {
      return res.status(500).json({ error: "No candidate response returned from Gemini." });
    }

    const responseText = candidates[0].content.parts[0].text;
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = { response: responseText, intent: "NONE", route: "" };
    }

    // Security route allowlist validation
    if (parsed.intent === "NAVIGATE" && parsed.route) {
      if (!allowedRoutes.includes(parsed.route)) {
        logger.warn(`Rejected unauthorized route intent: ${parsed.route}`);
        parsed.intent = "NONE";
        parsed.route = "";
      }
    }

    return res.status(200).json({
      response: parsed.response || responseText,
      intent: parsed.intent || "NONE",
      route: parsed.route || "",
      isOfflineFallback: false
    });

  } catch (err) {
    logger.error("Error in geminiChat function:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});
