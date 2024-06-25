const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const basicAuth = require("basic-auth");
const ftp = require("basic-ftp");

// Middleware para permitir parsear FormData
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Directorio temporal para almacenar archivos subidos

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Ruta para manejar la subida de archivos
app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    // Implementar lógica de subida a FTP aquí
    const credentials = { host: "192.168.1.41", user: "app", password: "123" };
    const client = new ftp.Client();
    await client.access(credentials);

    const files = req.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await client.uploadFrom(file.path, "/" + file.originalname);
    }

    await client.close();
    res.status(200).send("Archivos subidos con éxito.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al subir archivos.");
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
