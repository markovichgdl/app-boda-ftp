const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const ftp = require("basic-ftp");

// Middleware para permitir parsear FormData
const upload = multer({
  dest: "uploads/htdocs/",
});

// Función para generar un nombre aleatorio de archivo
function generateRandomFilename() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomFilename = "";
  for (let i = 0; i < 9; i++) {
    randomFilename += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomFilename;
}

// Ruta para manejar la subida de archivos
app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    // Implementar lógica de subida a FTP aquí
    const credentials = {
      host: "ftpupload.net",
      user: "if0_36783695",
      password: "4g00byvCET",
    };
    const client = new ftp.Client();
    await client.access(credentials);

    const files = req.files;
    const uploadPromises = files.map(async (file) => {
      const randomFilename = generateRandomFilename();
      const remotePath = `/htdocs/${randomFilename}${path.extname(
        file.originalname
      )}`;
      await client.uploadFrom(file.path, remotePath);
      console.log(`Archivo ${file.originalname} subido como ${randomFilename}`);

      // Eliminar archivo temporal
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(
            `Error al eliminar archivo temporal ${file.path}:`,
            err
          );
        } else {
          console.log(`Archivo temporal ${file.path} eliminado correctamente.`);
        }
      });
    });

    // Esperar a que todas las subidas de archivos terminen
    await Promise.all(uploadPromises);

    // Cerrar conexión FTP
    await client.close();

    // Enviar respuesta al cliente
    res.status(200).send("Archivos subidos con éxito.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al subir archivos.");
  }
});

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Ruta para manejar la solicitud GET a la raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Configuración para que el servidor escuche en todas las interfaces de red disponibles
const PORT = process.env.PORT || 80;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
