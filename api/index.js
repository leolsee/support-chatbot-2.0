async function getOrders(shop, token) {
  const res = await fetch(`https://${shop}/admin/api/2024-01/orders.json`, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  console.log("🧠 RAW SHOPIFY:", data);

  return data.orders || [];
}

export default async function handler(req, res) {
  const { code, shop } = req.query;

  // 👉 OAuth
  if (!code && shop) {
    const redirectUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_products,read_orders,read_customers&redirect_uri=https://support-chatbot-2-0.vercel.app/api&state=123`;
    return res.redirect(redirectUrl);
  }

  // 👉 Token
  if (code && shop) {
    try {
      const response = await fetch(
        `https://${shop}/admin/oauth/access_token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: process.env.SHOPIFY_API_KEY,
            client_secret: process.env.SHOPIFY_API_SECRET,
            code,
          }),
        }
      );

      const data = await response.json();
      console.log("🔥 TOKEN:", data);

      return res.status(200).json({
        success: true,
        token: data.access_token,
      });
    } catch (err) {
      console.error("❌ TOKEN ERROR:", err);
      return res.status(500).json({ error: "token error" });
    }
  }

  // 👉 CHATBOT
  if (req.method === "POST") {
    try {
      console.log("🔥 POST reçu");

      const { message } = req.body;
      console.log("💬 message:", message);

      const orders = await getOrders(
        process.env.SHOP_DOMAIN,
        process.env.SHOPIFY_ACCESS_TOKEN
      );

      console.log("📦 orders:", orders);

      if (
        message?.toLowerCase().includes("colis") ||
        message?.toLowerCase().includes("commande")
      ) {
        if (orders && orders.length > 0) {
          const order = orders[0];

          return res.json({
            reply: `📦 Commande #${order.name}\nStatut : ${
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
      console.error("❌ CHAT ERROR:", err);
      return res.status(500).json({ error: "server error" });
    }
  }

  // 👉 fallback
  return res.status(200).json({
    status: "ok",
    message: "Supportbot API running 🚀",
  });
}
