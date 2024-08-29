const Book = require("../models/Book");
const fs = require("fs");
const { optimizeImage } = require("../middleware/multer-config");

// Création d'un nouveau livre
exports.createBook = async (req, res, next) => {
    try {
        await optimizeImage(req, res, async () => {
            const bookObject = JSON.parse(req.body.book);
            delete bookObject._id;
            delete bookObject._userId;

            const book = new Book({
                ...bookObject,
                userId: req.auth.userId,
                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            });

            book.save()
                .then(() => res.status(201).json({ message: "Objet enregistré !" }))
                .catch((error) => res.status(400).json({ error }));
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création du livre." });
    }
};

// Récupération d'un livre par ID
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ error: "Livre non trouvé" });
            }
            res.status(200).json(book);
        })
        .catch((error) => {
            res.status(404).json({ error });
        });
};

// Modification d'un livre
exports.modifyBook = async (req, res, next) => {
    try {
        await optimizeImage(req, res, async () => {
            const bookObject = req.file
                ? {
                      ...JSON.parse(req.body.book),
                      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                  }
                : { ...req.body };

            delete bookObject._userId;

            Book.findOne({ _id: req.params.id })
                .then((book) => {
                    if (book.userId != req.auth.userId) {
                        res.status(401).json({ message: "Non autorisé" });
                    } else {
                        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: "Objet modifié!" }))
                            .catch((error) => res.status(401).json({ error }));
                    }
                })
                .catch((error) => res.status(400).json({ error }));
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la modification du livre." });
    }
};

// Suppression d'un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "Non autorisé" });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "Objet supprimé !" });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

// Récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => {
            res.status(200).json(Array.isArray(books) ? books : []);
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Récupération des livres avec les meilleures notes
exports.getBestRatingBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Notation d'un livre
exports.rateBook = (req, res, next) => {
    const { userId, rating } = req.body;

    // Validation des entrées
    if (!userId || typeof rating === "undefined") {
        return res.status(400).json({ message: "UserId ou note manquant" });
    }
    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: "La note doit être comprise entre 0 et 5" });
    }

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: "Livre non trouvé" });
            }
            const existingRating = book.ratings.find((r) => r.userId === userId);
            if (existingRating) {
                return res.status(400).json({ message: "L'utilisateur a déjà noté ce livre" });
            }

            const newRating = { userId, grade: rating };
            book.ratings.push(newRating);
            const totalRatings = book.ratings.reduce((acc, r) => acc + r.grade, 0);
            book.averageRating = totalRatings / book.ratings.length;

            book.save()
                .then((updatedBook) => {
                    res.status(200).json(updatedBook);
                })
                .catch((error) => {
                    res.status(400).json({ error });
                });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};
