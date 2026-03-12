import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {

  try {

    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const message = body?.message || "Hello";

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    res.status(200).json({
      reply: response.content[0].text
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Claude API error",
      details: error.message
    });

  }

}
