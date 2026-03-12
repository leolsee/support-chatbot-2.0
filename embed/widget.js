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

  const chatBox = document.createElement("div");
  chatBox.style.position = "fixed";
  chatBox.style.bottom = "70px";
  chatBox.style.right = "20px";
  chatBox.style.width = "300px";
  chatBox.style.height = "400px";
  chatBox.style.background = "white";
  chatBox.style.border = "1px solid #ddd";
  chatBox.style.borderRadius = "10px";
  chatBox.style.display = "none";
  chatBox.style.boxShadow = "0 5px 20px rgba(0,0,0,0.2)";

  chatBox.innerHTML = `
    <div style="padding:10px;background:black;color:white;border-radius:10px 10px 0 0">
      Support AI
    </div>
    <div style="padding:10px;height:300px;overflow:auto" id="messages"></div>
    <input id="input" placeholder="Type a message..." style="width:100%;padding:10px;border:none;border-top:1px solid #eee"/>
  `;

  button.onclick = () => {
    chatBox.style.display =
      chatBox.style.display === "none" ? "block" : "none";
  };

  document.body.appendChild(button);
  document.body.appendChild(chatBox);

})();
