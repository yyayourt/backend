const mongoose = require("mongoose");

// Schéma de notation des livres
const ratingSchema = mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
        required: true,
    },
    grade: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
});

// Schéma de livre
const bookSchema = mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    ratings: [ratingSchema], // Intègre le schéma de notation
    averageRating: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("book", bookSchema); // Exporte le modèle de livre
