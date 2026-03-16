(function () {

const api = "https://support-chatbot-2-0.vercel.app/api/chat";

  
function getProductInfo(){

  if(window.ShopifyAnalytics &&
     window.ShopifyAnalytics.meta &&
     window.ShopifyAnalytics.meta.product){

    const product = window.ShopifyAnalytics.meta.product;

    return {
      title: product.title,
      price: product.variants?.[0]?.price,
      vendor: product.vendor
    };
  }
  
  return null;
}
  
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
button.style.zIndex = "999999";

const chat = document.createElement("div");

chat.style.position = "fixed";
chat.style.bottom = "70px";
chat.style.right = "20px";
chat.style.width = "320px";
chat.style.height = "420px";
chat.style.background = "white";
chat.style.border = "1px solid #ddd";
chat.style.borderRadius = "10px";
chat.style.display = "none";
chat.style.flexDirection = "column";
chat.style.zIndex = "999999";

chat.innerHTML = `
<div style="padding:10px;background:black;color:white;border-radius:10px 10px 0 0">
Support AI
</div>

<div id="messages" style="flex:1;padding:10px;overflow:auto;font-size:14px"></div>

<input id="chatInput"
placeholder="Type a message..."
style="border:none;border-top:1px solid #ddd;padding:10px;width:100%;outline:none">
`;

document.body.appendChild(button);
document.body.appendChild(chat);

const messages = chat.querySelector("#messages");
const input = chat.querySelector("#chatInput");

button.onclick = () => {
chat.style.display =
chat.style.display === "none" ? "flex" : "none";
};

function addMessage(author, text){
messages.innerHTML += `<div><b>${author}:</b> ${text}</div>`;
messages.scrollTop = messages.scrollHeight;
}

input.addEventListener("keypress", async (e)=>{
if(e.key === "Enter"){

const message = input.value;
if(!message) return;

addMessage("You", message);
input.value = "";

try{

const res = await fetch(api,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
  message: message,
  product: getProductInfo(),
  url: window.location.href
})

const data = await res.json();

addMessage("AI", data.reply || "Pas de réponse");

}catch(err){

addMessage("AI","Erreur serveur");

}

}
});

})();
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
button.style.zIndex = "999999";

const chat = document.createElement("div");

chat.style.position = "fixed";
chat.style.bottom = "70px";
chat.style.right = "20px";
chat.style.width = "320px";
chat.style.height = "420px";
chat.style.background = "white";
chat.style.border = "1px solid #ddd";
chat.style.borderRadius = "10px";
chat.style.display = "none";
chat.style.flexDirection = "column";
chat.style.zIndex = "999999";

chat.innerHTML = `
<div style="padding:10px;background:black;color:white;border-radius:10px 10px 0 0">
Support AI
</div>

<div id="messages" style="flex:1;padding:10px;overflow:auto;font-size:14px"></div>

<input id="chatInput"
placeholder="Type a message..."
style="border:none;border-top:1px solid #ddd;padding:10px;width:100%;outline:none">
`;

document.body.appendChild(button);
document.body.appendChild(chat);

const messages = chat.querySelector("#messages");
const input = chat.querySelector("#chatInput");

button.onclick = () => {
chat.style.display =
chat.style.display === "none" ? "flex" : "none";
};

function addMessage(author, text){
messages.innerHTML += `<div><b>${author}:</b> ${text}</div>`;
messages.scrollTop = messages.scrollHeight;
}

input.addEventListener("keypress", async (e)=>{
if(e.key === "Enter"){

const message = input.value;
if(!message) return;

addMessage("You", message);
input.value = "";

try{

await fetch(api,{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify({
    message: message,
    product: getProductInfo(),
    url: window.location.href
  })
});

const data = await res.json();

addMessage("AI", data.reply || "Pas de réponse");

}catch(err){

addMessage("AI","Erreur serveur");

}

}
});

})();
