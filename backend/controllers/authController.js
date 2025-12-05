const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "24h"
    });
};
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Tous les champs sont requis (name, email, password)"
            });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé"
            });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        const token = generateToken(user.id);
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
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email et mot de passe sont requis"
            });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }
        const token = generateToken(user.id);
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