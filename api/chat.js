export default function handler(req, res) {

  const { message } = req.body || {};

  res.status(200).json({
    reply: "Support AI : message reçu → " + message
  });

}
