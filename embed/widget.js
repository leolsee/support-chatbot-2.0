(function () {

  const button = document.createElement("div");
  button.innerHTML = "💬 Chat Support";

  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.background = "black";
  button.style.color = "white";
  button.style.padding = "10px 15px";
  button.style.borderRadius = "20px";
  button.style.cursor = "pointer";
  button.style.zIndex = "9999";
  button.style.zIndex = "999999";

  const chat = document.createElement("div");
  chat.style.position = "fixed";
  chat.style.bottom = "70px";
  chat.style.right = "20px";
  chat.style.width = "320px";
  chat.style.height = "400px";
  chat.style.background = "white";
  chat.style.border = "1px solid #ddd";
  chat.style.borderRadius = "10px";
  chat.style.boxShadow = "0 10px 40px rgba(0,0,0,0.2)";
  chat.style.display = "none";
  chat.style.flexDirection = "column";
  chat.style.zIndex = "999999";

  chat.innerHTML = `
    <div style="padding:10px;background:black;color:white;border-radius:10px 10px 0 0">
      Support AI
    </div>
    <div id="messages" style="flex:1;padding:10px;overflow:auto"></div>
    <input id="chatInput" placeholder="Type a message..." style="border:none;border-top:1px solid #ddd;padding:10px;width:100%">
  `;

  button.onclick = () => {
    chat.style.display = chat.style.display === "none" ? "flex" : "none";
  };

  document.body.appendChild(button);
  document.body.appendChild(chat);

  document.addEventListener("keydown", async (e) => {
    if (e.target.id === "chatInput" && e.key === "Enter") {

      const input = e.target;
      const message = input.value;
      input.value = "";

      const messages = document.getElementById("messages");

      messages.innerHTML += `<div><b>You:</b> ${message}</div>`;

    const res = await fetch("https://support-chatbot-2-0.vercel.app/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ message })
});

const data = await res.json();

const reply = data.reply || data.response || data.content || "Je réfléchis...";

messages.innerHTML += `<div><b>AI:</b> ${reply}</div>`;
