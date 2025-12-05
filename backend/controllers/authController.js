const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Fonction pour générer un token JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "24h"
    });
};

// Register - Créer un nouvel utilisateur
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérifier que tous les champs sont remplis
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Tous les champs sont requis (name, email, password)"
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé"
            });
        }

        // Hasher le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créer l'utilisateur
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Générer le token JWT
        const token = generateToken(user.id);

        // Retourner l'utilisateur et le token (sans le mot de passe)
        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                team_id: user.team_id
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de l'inscription",
            error: error.message
        });
    }
};

// Login - Connecter un utilisateur
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier que tous les champs sont remplis
        if (!email || !password) {
            return res.status(400).json({
                message: "Email et mot de passe sont requis"
            });
        }

        // Trouver l'utilisateur par email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

        // Générer le token JWT
        const token = generateToken(user.id);

        // Retourner l'utilisateur et le token (sans le mot de passe)
        res.status(200).json({
            message: "Connexion réussie",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                team_id: user.team_id
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la connexion",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login
};
