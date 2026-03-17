(function () {

const api = "https://support-chatbot-2-0.vercel.app/api/chat";

// 🧠 USER ID
function getUserId(){
  let id = localStorage.getItem("supportbot_user");

  if(!id){
    id = "user_" + Math.random().toString(36).substring(2,10);
    localStorage.setItem("supportbot_user", id);
  }

  return id;
}

// 🛒 ADD TO CART (GLOBAL)
window.addToCart = function(variantId){
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: variantId,
      quantity: 1
    })
  })
  .then(() => alert("Produit ajouté au panier 🛒"))
  .catch(() => alert("Erreur ajout panier"));
};

// 📦 PRODUIT SHOPIFY
function getProductInfo(){
  if(window.ShopifyAnalytics &&
     window.ShopifyAnalytics.meta &&
     window.ShopifyAnalytics.meta.product){

    const product = window.ShopifyAnalytics.meta.product;

    return {
      title: product.title,
      price: product.variants?.[0]?.price,
      vendor: product.vendor,
      variantId: product.variants?.[0]?.id
    };
  }
  return null;
}

// 🎨 UI
const button = document.createElement("div");
button.innerHTML = "💬 Chat Support";

Object.assign(button.style, {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  background: "black",
  color: "white",
  padding: "10px 15px",
  borderRadius: "20px",
  cursor: "pointer",
  zIndex: "999999"
});

const chat = document.createElement("div");

Object.assign(chat.style, {
  position: "fixed",
  bottom: "70px",
  right: "20px",
  width: "320px",
  height: "420px",
  background: "white",
  border: "1px solid #ddd",
  borderRadius: "10px",
  display: "none",
  flexDirection: "column",
  zIndex: "999999"
});

chat.innerHTML = `
<div style="padding:10px;background:black;color:white">
Support AI
</div>

<div id="messages" style="flex:1;padding:10px;overflow:auto"></div>

<input id="chatInput"
placeholder="Type a message..."
style="border:none;border-top:1px solid #ddd;padding:10px;width:100%">
`;

document.body.appendChild(button);
document.body.appendChild(chat);

const messages = chat.querySelector("#messages");
const input = chat.querySelector("#chatInput");

// ouvrir chat
button.onclick = () => {
  chat.style.display = chat.style.display === "none" ? "flex" : "none";
};

// afficher message
function addMessage(author, text, product){
  messages.innerHTML += `
  <div style="margin-bottom:8px;">
  <b>${author}:</b> ${text}
  ${product?.variantId ? `<br><button onclick="addToCart(${product.variantId})">🛒 Ajouter au panier</button>` : ""}
  </div>
  `;
  messages.scrollTop = messages.scrollHeight;
}

// envoyer message
input.addEventListener("keypress", async (e)=>{
if(e.key === "Enter"){

const message = input.value;
if(!message) return;

addMessage("You", message);
input.value = "";

try{

const product = getProductInfo();

const res = await fetch(api,{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body: JSON.stringify({
    message,
    product,
    userId: getUserId(),
    shop: window.SupportBot?.shop,
    email: message.includes("@") ? message : null
  })
});

const data = await res.json();

addMessage("AI", data.reply || "Pas de réponse", data.product);

}catch(err){

addMessage("AI","Erreur serveur");

}

}
});

})();
