const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: "Objet enregistré !" });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            res.status(200).json(book);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

exports.modifyBook = (req, res, next) => {
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
                res.status(401).json({ message: "Not authorized" });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet modifié!" }))
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
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

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => {
            res.status(200).json(Array.isArray(books) ? books : []);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

exports.getBestRatingBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

exports.rateBook = (req, res, next) => {
    const { userId, rating } = req.body;

    // Ajout de journaux pour diagnostiquer
    console.log('rateBook request:', req.body);

    // Validation des entrées
    if (!userId || typeof rating === 'undefined') {
        console.log('Validation Error: Missing userId or rating');
        return res.status(400).json({ message: "Missing userId or rating" });
    }
    if (rating < 0 || rating > 5) {
        console.log('Validation Error: Rating must be between 0 and 5');
        return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                console.log('Book not found');
                return res.status(404).json({ message: "Book not found" });
            }
            const existingRating = book.ratings.find((r) => r.userId === userId);
            if (existingRating) {
                console.log('User has already rated this book');
                return res.status(400).json({ message: "User has already rated this book" });
            }

            const newRating = { userId, grade: rating };
            book.ratings.push(newRating);
            const totalRatings = book.ratings.reduce((acc, r) => acc + r.grade, 0);
            book.averageRating = totalRatings / book.ratings.length;

            book.save()
                .then((updatedBook) => {
                    console.log('Book updated successfully');
                    res.status(200).json(updatedBook);
                })
                .catch((error) => {
                    console.log('Error saving book:', error);
                    res.status(400).json({ error });
                });
        })
        .catch((error) => {
            console.log('Error finding book:', error);
            res.status(500).json({ error });
        });
};