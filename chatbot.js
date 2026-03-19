console.log("chatbot.js chargé");

const inputEl = document.getElementById("chat-input");
const messagesEl = document.getElementById("messages");

function addMessage(author, text) {
  messagesEl.innerHTML += `<div><b>${author}:</b> ${text}</div>`;
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

if (inputEl) {
  inputEl.addEventListener("keypress", async (e) => {
    if (e.key !== "Enter") return;

    const message = inputEl.value.trim();
    if (!message) return;

    addMessage("You", message);
    inputEl.value = "";

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      addMessage("AI", data.reply || "Pas de réponse");
    } catch (err) {
      console.error(err);
      addMessage("AI", "Erreur serveur");
    }
  });
}
