const express = require("express");

const bodyParser = require("express");

const app = express();

const mongoose = require("mongoose");

const booksRoutes = require("./routes/books");

const authRoutes = require("./routes/auth");

const path = require("path");

require('dotenv').config()

const apiUrl = process.env.API_URL

mongoose
    .connect(apiUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
