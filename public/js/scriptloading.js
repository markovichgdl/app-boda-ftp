// script.js
window.addEventListener("load", function () {
  console.log("La página ha cargado completamente");
  var loader = document.getElementById("loader");
  var content = document.getElementById("content");
  loader.style.display = "none";
  content.style.display = "block";
});
