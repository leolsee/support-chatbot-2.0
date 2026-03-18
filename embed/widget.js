console.log("🔥 widget chargé");

// créer le chatbot
const chat = document.createElement("div");
chat.innerHTML = `
  <div id="chatbox" style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    z-index: 9999;
  ">
    <div id="messages" style="height:200px; overflow:auto;"></div>
    <input id="chat-input" placeholder="Tape un message..." style="width:100%;" />
  </div>
`;

document.body.appendChild(chat);

// logique chatbot
const input = document.getElementById("chat-input");
const messages = document.getElementById("messages");

function addMessage(author, text) {
  messages.innerHTML += `<div><b>${author}:</b> ${text}</div>`;
  messages.scrollTop = messages.scrollHeight;
}

input.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const message = input.value;
    if (!message) return;

    addMessage("You", message);
    input.value = "";

    try {
      const res = await fetch("https://support-chatbot-2-0.vercel.app/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      addMessage("AI", data.reply);
    } catch (err) {
      addMessage("AI", "Erreur serveur");
    }
  }
});

})();
