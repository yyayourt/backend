const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth"); // Middleware d'authentification
const multer = require("../middleware/multer-config"); // Middleware pour la gestion des fichiers

const booksCtrl = require("../controllers/books"); 

router.get("/bestrating", booksCtrl.getBestRatingBooks); // Route pour obtenir les livres avec les meilleures notes
router.post("/:id/rating", booksCtrl.rateBook); // Route pour noter un livre
router.get("/", booksCtrl.getAllBooks); // Route pour obtenir tous les livres
router.post("/", auth, multer, booksCtrl.createBook); // Route pour créer un livre avec authentification et gestion de fichiers
router.get("/:id", booksCtrl.getOneBook); // Route pour obtenir un livre par ID
router.put("/:id", auth, multer, booksCtrl.modifyBook); // Route pour modifier un livre par ID avec authentification et gestion de fichiers
router.delete("/:id", auth, booksCtrl.deleteBook); // Route pour supprimer un livre par ID avec authentification

module.exports = router;
