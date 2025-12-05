const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
    try {
        // Récupérer le token depuis le header Authorization
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({
                message: "Token d'authentification manquant"
            });
        }
 
        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Récupérer l'utilisateur depuis la base de données
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "Utilisateur non trouvé"
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Token invalide"
            });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expiré"
            });
        }
        res.status(500).json({
            message: "Erreur lors de la vérification du token",
            error: error.message
        });
    }
};

module.exports = { authenticateToken };

