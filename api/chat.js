import supabase from "../lib/supabase.js";
import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {

  try {

    // Sécurité méthode
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Initialisation Claude
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });

    console.log("CLAUDE KEY PRESENT:", !!process.env.CLAUDE_API_KEY);

    // Lecture du body
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const message = body?.message;

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    // Sauvegarde message utilisateur
    await supabase.from("messages").insert({
      conversation_id: 1,
      expediteur: "user",
      message: message
    });

    // Appel Claude
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 120,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response?.content?.[0]?.text || "Je n'ai pas de réponse.";

    // Sauvegarde réponse IA
    await supabase.from("messages").insert({
      conversation_id: 1,
      expediteur: "ai",
      message: reply
    });

    return res.status(200).json({
      reply: reply
    });

  } catch (error) {

    console.error("API ERROR:", error);

    return res.status(500).json({
      error: "Erreur serveur",
      details: error.message
    });

  }

}
