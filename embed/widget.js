(function () {

  const button = document.createElement("div");
  button.innerHTML = "💬 Chat Support";

  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.background = "black";
  button.style.color = "white";
  button.style.padding = "10px";
  button.style.borderRadius = "20px";
  button.style.cursor = "pointer";

  button.onclick = () => {
    alert("Chat ouvert !");
  };

  document.body.appendChild(button);

})();
  document.body.appendChild(chatBox);

})();
