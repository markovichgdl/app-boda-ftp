document.getElementById("files").addEventListener("change", function () {
  const fileCount = this.files.length;
  const customFileButton = document.getElementById("customFileButton");

  if (fileCount === 0) {
    customFileButton.textContent = "Seleccionar Archivos";
  } else {
    customFileButton.textContent = `${fileCount} Archivos seleccionados.`;
    confirmUpload(this.files);
  }
});

function confirmUpload(files) {
  Swal.fire({
    title: "¿Estás listo para subir tus fotos y videos?",
    text: "Se subirá un total de " + files.length + " archivos.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6c757d",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, subir",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      uploadFiles(files);
    }
  });
}

function uploadFiles(files) {
  // Verificar si no se ha seleccionado ningún archivo
  if (files.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor selecciona hasta un máximo de 5 archivos.",
      confirmButtonColor: "#6c757d", // Color gris
    });
    return;
  }

  // Verificar tamaño máximo de archivos
  const maxSizeInBytes = 150 * 1024 * 1024; // 150MB en bytes

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSizeInBytes) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `El archivo ${files[i].name} excede el tamaño máximo permitido de 150MB.`,
        confirmButtonColor: "#6c757d", // Color gris
      });
      return;
    }
  }

  // Verificar si se excede el límite de archivos (5 archivos)
  if (files.length > 5) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No puedes subir más de 5 archivos a la vez.",
      confirmButtonColor: "#6c757d", // Color gris
    });
    return;
  }

  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  const xhr = new XMLHttpRequest();

  xhr.open("POST", "http://localhost:3000/upload", true); // Cambiar la URL si es necesario

  xhr.onload = function () {
    if (xhr.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Se subieron tus fotos y videos con éxito!",
        confirmButtonColor: "#6c757d", // Color gris
      }).then(() => {
        window.location.href = "Out.html"; // Redirigir a la nueva página
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error!",
        confirmButtonColor: "#6c757d", // Color gris
      });
    }
  };

  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      const percentComplete = Math.floor((event.loaded / event.total) * 100);
      const progressBar = document.getElementById("progressBar");
      progressBar.style.width = percentComplete + "%";
      progressBar.textContent = ` ${percentComplete}%`;
    }
  };

  xhr.send(formData);
}
