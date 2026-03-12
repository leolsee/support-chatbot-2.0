import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

export default async function handler(req, res) {

  const { message } = req.body;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet",
    max_tokens: 300,
    messages: [
      { role: "user", content: message }
    ]
  });

  res.json({
    reply: response.content[0].text
  });

}
