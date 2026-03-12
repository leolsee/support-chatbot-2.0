export default async function handler(req, res) {

  const { message } = req.body;

  // réponse temporaire pendant que Claude n'est pas connecté
  res.status(200).json({
    reply: "Le support AI est en cours de configuration. Merci pour votre message : " + message
  });

}
