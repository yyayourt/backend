const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Schéma de l'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); // Applique le validateur d'unicité au schéma

module.exports = mongoose.model("User", userSchema); // Exporte le modèle d'utilisateur
