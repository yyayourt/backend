const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "image/webp": "webp",
    "image/tiff": "tiff",
    "image/svg+xml": "svg",
};

const storage = multer.memoryStorage(); // Stocker l'image dans la mémoire temporairement

const fileFilter = (req, file, callback) => {
    const isValid = MIME_TYPES[file.mimetype];
    if (isValid) {
        callback(null, true);
    } else {
        callback(new Error("Invalid file type. Only image files are allowed."), false);
    }
};

module.exports = multer({ storage: storage, fileFilter: fileFilter }).single("image");

// Fonction pour optimiser l'image
const optimizeImage = async (req, res, next) => {
    if (!req.file) {
        return next(); // Si pas de fichier, passer à l'étape suivante
    }

    const filename = `${req.file.originalname.split(" ").join("_")}_${Date.now()}.webp`;
    const filepath = path.join("images", filename);

    try {
        await sharp(req.file.buffer) // Traite l'image à partir du buffer en mémoire
            .resize(800)
            .toFormat("webp")
            .webp({ quality: 80 })
            .toFile(filepath);

        req.file.filename = filename;
        req.file.path = filepath;

        next();
    } catch (error) {
        return res.status(500).json({ error: "Erreur lors de l'optimisation de l'image." });
    }
};

module.exports.optimizeImage = optimizeImage;
