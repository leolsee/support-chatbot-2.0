export default async function handler(req, res) {
  const { code, shop } = req.query;

  // 👉 Si Shopify appelle le callback
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

    console.log("🔥 TOKEN:", data.access_token);

    return res.status(200).json({
      success: true,
      token: data.access_token,
    });
  }

  // sinon route normale
  res.status(200).json({ status: "ok", message: "Supportbot API running 🚀" });
}
