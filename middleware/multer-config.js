const multer = require("multer");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// Configuration du stockage pour multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images"); // Définir le dossier de destination pour les fichiers
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_"); // Remplacer les espaces par des underscores
        const extension = MIME_TYPES[file.mimetype]; // Obtenir l'extension du fichier à partir du MIME type
        callback(null, name + Date.now() + "." + extension); // Générer le nom du fichier
    },
});

module.exports = multer({ storage: storage }).single("image"); // Exporter le middleware multer pour un seul fichier image
