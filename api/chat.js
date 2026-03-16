import supabase from "../lib/supabase.js";
import Anthropic from "@anthropic-ai/sdk";

 export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
    
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

    messages.push({
      role: "user",
      content: message
    });

    const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 200,

  system: `
Tu es le support client d'une boutique Shopify.
Tu aides les clients à acheter des produits.
Tu réponds comme un vendeur du magasin.
Tu ne dis jamais que tu es une IA ou Claude.
Tu représentes la boutique.
Tu es un assistant de support client. Ne répète pas 'bonjour' si la conversation a déjà commencé.
Réponds naturellement et brièvement.
`,

  messages: messages
});

    const reply = response.content[0].text;

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("ERREUR COMPLETE:", error);
    return res.status(500).json({ error: error.message });
  }
}
