import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {

  try {

    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: "Bonjour"
        }
      ]
    });

    console.log("CLAUDE RESPONSE:", JSON.stringify(response));

const reply = response.content[0].text;
    
    return res.status(200).json({
      reply: reply
    });

  } catch (error) {

    console.error("ERROR:", error);

    return res.status(500).json({
      error: error.message
    });

  }

}
