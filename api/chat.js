import supabase from "../lib/supabase.js";
import Anthropic from "@anthropic-ai/sdk";

 export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
   return res.status(200).json({
  reply,
  product
});
    
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
    const product = body?.product;
    const userId = body?.userId || "anonymous";

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    // récupérer historique
    const { data: history } = await supabase
  .from("messages")
  .select("expediteur,message")
  .eq("conversation_id", userId)
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

  let productContext = "";

if (product) {
  productContext = `
Produit actuel :

Nom : ${product.title || "Non défini"}
Prix : ${product.price || "Non défini"}
Description : ${product.description || "Non définie"}
Lien : ${product.url || ""}

`;
}
   
 const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 200,

 system: `
Tu es le support client d'une boutique Shopify.

Ton objectif est d'aider le client à acheter.

${productContext}

Règles :

- Tu parles comme un vendeur humain
- Tu mets en avant les produits
- Tu proposes des recommandations
- Tu aides à choisir (taille, style, etc.)
- Tu incites doucement à acheter

Si le client parle du produit affiché :
utilise les informations pour répondre de façon précise.

Tu peux suggérer d'ajouter au panier ou de voir d'autres produits.

Tu ne dis jamais que tu es une IA.
Tu représentes la boutique.

Réponds naturellement, de façon courte et engageante.
`,
  
  messages: messages
});
   
    const reply = response?.content?.[0]?.text || "Pas de réponse";

  await supabase.from("messages").insert([
  {
    conversation_id: userId,
    expediteur: "user",
    message: message
  },
  {
    conversation_id: userId,
    expediteur: "assistant",
    message: reply
  }
]);
   
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("ERREUR COMPLETE:", error);
    return res.status(500).json({ error: error.message });
  }
}
