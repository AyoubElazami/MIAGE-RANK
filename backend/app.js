require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

// Import des routes
const aboutRoutes = require("./routes/aboutRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const teamRoutes = require("./routes/teamRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const rankingRoutes = require("./routes/rankingRoutes");

// Import des middlewares
const { authenticateToken } = require("./middleware/authMiddleware");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

// Import des services
const { initializeSocket } = require("./services/socketService");

// Import de la base de données (pour initialiser les modèles)
const db = require("./config/db");
require("./models"); // Initialiser toutes les relations

const app = express();
const server = http.createServer(app);

// Configuration CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour logger les requêtes (optionnel)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes publiques
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API MiageRank - Système de gamification",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            users: "/api/users",
            admin: "/api/admin",
            teams: "/api/teams",
            challenges: "/api/challenges",
            scores: "/api/scores",
            ranking: "/api/ranking"
        }
    });
});

app.use("/about", aboutRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/ranking", rankingRoutes);

// Gestion des routes non trouvées
app.use(notFoundHandler);

// Gestionnaire d'erreurs global
app.use(errorHandler);

// Initialiser Socket.io
const io = initializeSocket(server);

// Exporter io pour utilisation dans les contrôleurs
app.set("io", io);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 Socket.io initialisé`);
    console.log(`🌐 CORS activé pour: ${process.env.FRONTEND_URL || "*"}`);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Erreur: Le port ${PORT} est déjà utilisé.`);
        console.error(`💡 Solution: Arrêtez le processus qui utilise le port ${PORT} ou changez le port dans .env`);
        console.error(`   Pour Windows: netstat -ano | findstr :${PORT} puis taskkill /PID <PID> /F`);
        process.exit(1);
    } else {
        console.error("❌ Erreur lors du démarrage du serveur:", err);
        process.exit(1);
    }
});

module.exports = { app, server, io };
