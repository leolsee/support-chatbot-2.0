import supabase from "../lib/supabase.js";
import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  try {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const message = body?.message;

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    console.log("MESSAGE RECU:", message);

    // appel Claude
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 120,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    console.log("REPONSE CLAUDE:", JSON.stringify(response, null, 2));

   const reply = Array.isArray(response?.content)
  ? response.content
      .filter(c => c.type === "text")
      .map(c => c.text)
      .join("\n")
  : "Je n'ai pas de réponse.";

    return res.status(200).json({
      reply: reply
    });

  } catch (error) {

    console.error("ERREUR COMPLETE:", error);

    return res.status(500).json({
      error: error.message,
      full: error
    });

  }
}
