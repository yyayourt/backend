const express = require("express");
const bodyParser = require("express");
const app = express();
const mongoose = require("mongoose");
const booksRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const path = require("path");
require('dotenv').config();

const apiUrl = process.env.API_URL;

// Connexion à la base de données MongoDB
mongoose
    .connect(apiUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(bodyParser.json()); // Middleware pour parser les requêtes avec un corps JSON

// Middleware pour configurer les en-têtes CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next(); 
});

// Définition des routes pour les livres et l'authentification
app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);
app.use("/images", express.static(path.join(__dirname, "images"))); // Servir les fichiers statiques dans le dossier images

module.exports = app; 
