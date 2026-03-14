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

    // sauvegarder message user
    await supabase.from("messages").insert({
      conversation_id: 1,
      expediteur: "user",
      message: message
    });

    // récupérer historique
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

    const systemPrompt = `
Tu es un assistant de support client.
Ne répète pas les mêmes phrases.
Réponds naturellement comme dans une conversation.
`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      system: systemPrompt,
      max_tokens: 200,
      messages: messages
    });

    const reply = Array.isArray(response?.content)
      ? response.content
          .filter(c => c.type === "text")
          .map(c => c.text)
          .join("\n")
      : "Je n'ai pas de réponse.";

    // sauvegarder réponse IA
    await supabase.from("messages").insert({
      conversation_id: 1,
      expediteur: "ai",
      message: reply
    });

    return res.status(200).json({ reply });

  } catch (error) {

    console.error("ERREUR COMPLETE:", error);

    return res.status(500).json({
      error: error.message
    });

  }
}

  }
}
