async function getOrders(shop, token) {
  const res = await fetch(`https://${shop}/admin/api/2024-01/orders.json`, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  console.log("🧠 Shopify response:", data);

  return data.orders || [];
}

export default async function handler(req, res) {

  // 👉 CHATBOT (POST)
  if (req.method === "POST") {
    try {
      console.log("🔥 POST reçu");

      const { message } = req.body;

      console.log("🧠 SHOP:", process.env.SHOP_DOMAIN);
      console.log("🧠 TOKEN:", process.env.SHOPIFY_ACCESS_TOKEN);

      const orders = await getOrders(
        process.env.SHOP_DOMAIN,
        process.env.SHOPIFY_ACCESS_TOKEN
      );

      console.log("📦 orders:", orders);

      if (
        message.toLowerCase().includes("colis") ||
        message.toLowerCase().includes("commande")
      ) {
        if (orders && orders.length > 0) {
          const order = orders[0];

          return res.json({
            reply: `📦 Commande ${order.name}\nStatut : ${
              order.fulfillment_status || "en préparation"
            }`,
          });
        } else {
          return res.json({
            reply: "Je ne trouve pas encore de commande 🤔",
          });
        }
      }

      return res.json({
        reply: "Je suis là pour vous aider 😊",
      });

    } catch (err) {
      console.error("❌ ERREUR:", err);
      return res.status(500).json({
        reply: "Erreur serveur",
      });
    }
  }

  // 👉 fallback
  return res.status(200).json({
    status: "ok",
    message: "Supportbot API running 🚀",
  });
}
