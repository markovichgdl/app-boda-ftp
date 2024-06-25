document.addEventListener("DOMContentLoaded", function () {
  // Lista de rutas de las imágenes
  const imagenes = ["img/imagen1.jpg", "img/imagen2.jpg", "img/imagen3.jpg"];

  // Selección aleatoria de una imagen
  const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
  const imagenSeleccionada = imagenes[indiceAleatorio];

  // Aplicación de la imagen de fondo
  document.body.style.backgroundImage = `url(${imagenSeleccionada})`;
});
