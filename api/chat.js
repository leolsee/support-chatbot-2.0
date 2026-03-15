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

    const { data: history } = await supabase
      .from("messages")
      .select("expediteur,message")
      .eq("conversation_id", 1)
      .order("id", { ascending: true })
      .limit(10);

    const messages = (history || []).map(m => ({
      role: m.expediteur === "user" ? "user" : "assistant",
      content: m.message
    }));

    messages.push({
      role: "user",
      content: message
    });

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest"
      max_tokens: 200,
      messages: messages
    });

    const reply = Array.isArray(response?.content)
      ? response.content
          .filter(c => c.type === "text")
          .map(c => c.text)
          .join("\n")
      : "Pas de réponse";

    return res.status(200).json({
      reply: reply
    });

  } catch (error) {

    console.error("ERREUR COMPLETE:", error);

    return res.status(500).json({
      error: error.message
    });

  }
}

