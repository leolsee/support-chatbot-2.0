export default async function handler(req, res) {
  const { code, shop } = req.query;

  // 👉 SI PAS DE CODE → lancer OAuth
  if (!code && shop) {
    const redirectUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_products,read_orders,read_customers&redirect_uri=https://support-chatbot-2-0.vercel.app/api&state=123`;

    return res.redirect(redirectUrl);
  }

  // 👉 SI CODE → récupérer token
  if (code && shop) {
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
  }

  return res.status(200).json({ status: "ok" });
}

export default async function handler(req, res) {
  const { code, shop } = req.query;

  // 👉 CAS SHOPIFY (installation)
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

  // 👉 ROUTE NORMALE
  res.status(200).json({
    status: "ok",
    message: "Supportbot API running 🚀",
  });
}
