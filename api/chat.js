import supabase from "../lib/supabase.js";
import Anthropic from "@anthropic-ai/sdk";

// 🔎 Détection tracking
function isTrackingQuestion(message){
  return message.toLowerCase().includes("colis") ||
         message.toLowerCase().includes("commande") ||
         message.toLowerCase().includes("livraison");
}

// 📦 Tracking fake (propre pour MVP)
function getFakeTracking() {
  return {
    status: "En cours de livraison 🚚",
    date: "Arrive demain",
    tracking: "FR123456789"
  };
}

export default async function handler(req, res) {

  // ✅ CORS
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
    const product = body?.product;
    const userId = body?.userId || "anonymous";
    const shop = body?.shop || "unknown";

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    // 📦 TRACKING (prioritaire)
    if(isTrackingQuestion(message)){
      const tracking = getFakeTracking();

      return res.status(200).json({
        reply: `📦 Bonne nouvelle !

Votre commande est en route 🚚

📅 Livraison estimée : ${tracking.date}
🔎 Numéro de suivi : ${tracking.tracking}`
      });
    }

    // 🧠 HISTORIQUE
    const { data: history } = await supabase
      .from("messages")
      .select("expediteur,message")
      .eq("conversation_id", userId + "_" + shop)
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

    // 🛍️ CONTEXTE PRODUIT
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

    // 🤖 CLAUDE
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

Tu ne dis jamais que tu es une IA.
Tu représentes la boutique.

Réponds naturellement, de façon courte et engageante.
`,

      messages: messages
    });

    const reply = response?.content?.[0]?.text || "Pas de réponse";

    // 💾 SAUVEGARDE
    await supabase.from("messages").insert([
      {
        conversation_id: userId + "_" + shop,
        expediteur: "user",
        message: message
      },
      {
        conversation_id: userId + "_" + shop,
        expediteur: "assistant",
        message: reply
      }
    ]);

    return res.status(200).json({
      reply,
      product
    });

  } catch (error) {

    console.error("ERREUR COMPLETE:", error);

    return res.status(500).json({
      error: error.message
    });

  }
}
