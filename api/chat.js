import supabase from "../lib/supabase.js";
import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {

  try {

    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const message = body?.message || "Hello";
    
    await supabase.from("messages").insert([
  {
    conversation_id: 1,
    expediteur: "user",
    message: message
  }
]);

    const response = await anthropic.messages.create({
  model: "claude-3-haiku-20241022",
  max_tokens: 120,
  messages: [
    {
      role: "user",
      content: message
    }
  ]
});

   const reply = response.content?.[0]?.text || "Je n'ai pas de réponse.";

await supabase.from("messages").insert([
  {
    conversation_id: 1,
    expediteur: "ai",
    message: reply
  }
]);
    
    res.status(200).json({
      reply: reply
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Claude API error",
      details: error.message
    });

  }

}
