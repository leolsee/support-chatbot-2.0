async function getOrders(shop, token) {
  const res = await fetch(`https://${shop}/admin/api/2024-01/orders.json`, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data.orders;
}

export default async function handler(req, res) {
  const { message } = req.body;

  const SHOP = process.env.SHOP_DOMAIN;
  const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  // 👉 récupérer commandes
  const orders = await getOrders(SHOP, TOKEN);

  // 👉 réponse simple test
  if (message.includes("colis") || message.includes("commande")) {
    if (orders.length > 0) {
      const order = orders[0];

      return res.json({
        reply: `📦 Bonne nouvelle ! Votre commande #${order.name} est en cours.\nStatut : ${order.fulfillment_status || "en préparation"}`,
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
}

  // 👉 1. SI PAS DE CODE → lancer OAuth
  if (!code && shop) {
    const redirectUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_products,read_orders,read_customers&redirect_uri=https://support-chatbot-2-0.vercel.app/api&state=123`;

    return res.redirect(redirectUrl);
  }

  // 👉 2. SI CODE → récupérer token
  if (code && shop) {
    try {
      const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_API_KEY,
          client_secret: process.env.SHOPIFY_API_SECRET,
          code,
        }),
      });

      const data = await response.json();

      console.log("🔥 TOKEN:", data);

      return res.status(200).json({
        success: true,
        token: data.access_token,
      });
    } catch (err) {
      console.error("❌ ERROR:", err);
      return res.status(500).json({ error: "token error" });
    }
  }

  // 👉 3. ROUTE NORMALE
  return res.status(200).json({
    status: "ok",
    message: "Supportbot API running 🚀",
  });
}
