const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/auth"); // Contrôleur pour les opérations d'authentification

router.post("/signup", userCtrl.signup); // Route pour l'inscription des utilisateurs
router.post("/login", userCtrl.login); // Route pour la connexion des utilisateurs

module.exports = router; // Exportation du routeur
