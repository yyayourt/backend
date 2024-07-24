const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Récupérer le token dans les en-têtes de la requête
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Décoder le token
        const userId = decodedToken.userId; // Extraire l'ID utilisateur du token décodé
        req.auth = { userId: userId }; // Ajouter l'ID utilisateur à l'objet req.auth
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
