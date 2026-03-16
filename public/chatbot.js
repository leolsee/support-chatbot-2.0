(function () {

const api = "https://support-chatbot-2-0.vercel.app/api/chat";

const button = document.createElement("button");
button.innerText = "💬 Chat Support";

button.style.position = "fixed";
button.style.bottom = "20px";
button.style.right = "20px";
button.style.background = "black";
button.style.color = "white";
button.style.padding = "10px 15px";
button.style.borderRadius = "20px";
button.style.zIndex = "999999";

document.body.appendChild(button);

const chat = document.createElement("div");

chat.style.position = "fixed";
chat.style.bottom = "70px";
chat.style.right = "20px";
chat.style.width = "300px";
chat.style.height = "400px";
chat.style.background = "white";
chat.style.border = "1px solid #ddd";
chat.style.display = "none";
chat.style.flexDirection = "column";
chat.style.zIndex = "999999";

chat.innerHTML = `
<div style="padding:10px;background:black;color:white">
Support AI
</div>

<div id="messages" style="flex:1;padding:10px;overflow:auto"></div>

<input id="chatInput" placeholder="Type a message..." style="border:none;border-top:1px solid #ddd;padding:10px"/>
`;

document.body.appendChild(chat);

button.onclick = () => {
chat.style.display = chat.style.display === "none" ? "flex" : "none";
};

const input = chat.querySelector("#chatInput");
const messages = chat.querySelector("#messages");

input.addEventListener("keypress", async (e) => {

if (e.key === "Enter") {

const message = input.value;

messages.innerHTML += `<div><b>You:</b> ${message}</div>`;

input.value = "";

const res = await fetch(api,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message})
});

const data = await res.json();

messages.innerHTML += `<div><b>AI:</b> ${data.reply}</div>`;

messages.scrollTop = messages.scrollHeight;

}

});

})();
