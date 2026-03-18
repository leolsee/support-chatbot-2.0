export default async function handler(req, res) {
  try {
    const { message } = req.body;

    console.log("MESSAGE:", message);

    return res.status(200).json({
      reply: "Tu as dit : " + message
    });

  } catch (err) {
    console.error("ERROR:", err);

    return res.status(500).json({
      reply: "Erreur serveur"
    });
  }
}
