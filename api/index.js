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
