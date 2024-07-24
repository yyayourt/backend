const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

// Gestion de l'inscription des utilisateurs
exports.signup = (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10) // Hasher le mot de passe avec un salt de 10
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash, // Stocker le hash du mot de passe
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// Gestion de la connexion des utilisateurs
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" }); // Utilisateur non trouvé
            }
            bcrypt
                .compare(req.body.password, user.password) // Comparer le mot de passe avec le hash stocké
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" }); // Mot de passe incorrect
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }), // Générer un token JWT
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
