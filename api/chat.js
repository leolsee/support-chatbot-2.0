import supabase from "../lib/supabase.js";
import Anthropic from "@anthropic-ai/sdk";

function isTrackingQuestion(message){
  return message.toLowerCase().includes("colis") ||
         message.toLowerCase().includes("commande") ||
         message.toLowerCase().includes("livraison");
}

async function getOrderByEmail(email){

  const res = await fetch(
    `https://${process.env.SHOP_DOMAIN}/admin/api/2023-10/orders.json?email=${email}`,
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json"
      }
    }
  );

  const data = await res.json();

  return data.orders;
}

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
    const shop = body?.shop || "unknown";
    const email = body?.email || null;

    function getFakeTracking() {
  return {
    status: "En cours de livraison 🚚",
    date: "Arrive demain",
    tracking: "FR123456789"
  };
}

// SI LE CLIENT DEMANDE SA COMMANDE
if (
  message.toLowerCase().includes("commande") ||
  message.toLowerCase().includes("colis") ||
  message.toLowerCase().includes("livraison")
) {

  const tracking = getFakeTracking();

  return res.status(200).json({
    reply: `📦 Bonne nouvelle !

Votre commande est actuellement : ${tracking.status}

📅 Livraison estimée : ${tracking.date}
🔎 Numéro de suivi : ${tracking.tracking}`
  });
}
    
   if(isTrackingQuestion(message) && !email){
  return res.status(200).json({
    reply: "📦 Pour suivre votre commande, pouvez-vous me donner votre email ?"
  });
}
   
   if(email){

  const orders = await getOrderByEmail(email);

  if(!orders.length){
    return res.status(200).json({
      reply: "❌ Je ne trouve aucune commande avec cet email."
    });
  }

  const order = orders[0];

  const tracking = order.fulfillments?.[0]?.tracking_number;
  const company = order.fulfillments?.[0]?.tracking_company;
  const status = order.fulfillment_status;

  return res.status(200).json({
    reply: `📦 Statut : ${status || "en préparation"}
🚚 Transporteur : ${company || "non précisé"}
🔎 Suivi : ${tracking || "pas encore disponible"}`
  });
}

    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    // récupérer historique
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
   
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("ERREUR COMPLETE:", error);
    return res.status(500).json({ error: error.message });
  }
}
