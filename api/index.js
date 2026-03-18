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
  const { code, shop } = req.query;

  // 👉 1. LANCER INSTALLATION
  if (!code && shop) {
    const redirectUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_products,read_orders,read_customers&redirect_uri=https://support-chatbot-2-0.vercel.app/api&state=123`;

    return res.redirect(redirectUrl);
  }

  // 👉 2. RÉCUPÉRER TOKEN
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

      return res.json({
        success: true,
        token: data.access_token,
      });

    } catch (err) {
      console.error("❌ TOKEN ERROR:", err);
      return res.status(500).json({ error: "token error" });
    }
  }

  // 👉 3. CHATBOT
  if (req.method === "POST") {
    try {
      const { message } = req.body;

      const orders = await getOrders(
        process.env.SHOP_DOMAIN,
        process.env.SHOPIFY_ACCESS_TOKEN
      );

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
        reply: "Je suis là 😊",
      });

    } catch (err) {
      console.error("❌ CHAT ERROR:", err);
      return res.status(500).json({
        reply: "Erreur serveur",
      });
    }
  }

  return res.json({
    status: "ok",
  });
}
