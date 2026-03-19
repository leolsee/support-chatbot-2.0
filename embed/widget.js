export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      message: "Supportbot API running 🚀"
    });
  }

  if (req.method === "POST") {
    try {
      const { message } = req.body || {};

      if (!message) {
        return res.status(400).json({
          reply: "Message manquant."
        });
      }

      const lower = message.toLowerCase();

      if (lower.includes("bonjour") || lower.includes("salut")) {
        return res.status(200).json({
          reply: "Bonjour 👋 Comment puis-je vous aider aujourd’hui ?"
        });
      }

      if (lower.includes("prix")) {
        return res.status(200).json({
          reply: "Nos prix varient selon les produits. Vous cherchez un vêtement, un accessoire ou autre chose ?"
        });
      }

      if (lower.includes("colis") || lower.includes("commande")) {
        return res.status(200).json({
          reply: "📦 Pour suivre votre commande, merci de me donner votre email ou votre numéro de commande."
        });
      }

      if (lower.includes("@")) {
        return res.status(200).json({
          reply: "Merci 🙌 Nous avons bien reçu votre email. Un conseiller ou le système de suivi pourra l’utiliser pour retrouver votre commande."
        });
      }

      return res.status(200).json({
        reply: "Je suis là pour vous aider 😊 Vous pouvez me demander les prix, le suivi de commande ou des infos produits."
      });
    } catch (error) {
      console.error("API ERROR:", error);

      return res.status(500).json({
        reply: "Erreur serveur"
      });
    }
  }

  return res.status(405).json({
    reply: "Méthode non autorisée"
  });
}
