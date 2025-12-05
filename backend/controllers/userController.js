const User = require("../models/User");
const bcrypt = require("bcrypt");

// Récupérer tous les utilisateurs
const getUsers = async (_req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['created_at', 'DESC']]
        });
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des utilisateurs",
            error: error.message
        });
    }
};

// Récupérer un utilisateur par ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de l'utilisateur",
            error: error.message
        });
    }
};

// Créer un utilisateur (admin uniquement)
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, team_id } = req.body;

        // Vérifier que tous les champs requis sont remplis
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Les champs name, email et password sont requis"
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
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
            password: hashedPassword,
            role: role || 'user', // Par défaut 'user' si non spécifié
            team_id: team_id || null
        });

        // Retourner l'utilisateur sans le mot de passe
        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                team_id: user.team_id,
                created_at: user.created_at
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de l'utilisateur",
            error: error.message
        });
    }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, team_id } = req.body;
        const currentUser = req.user;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        // Seul un admin peut modifier le rôle ou un utilisateur peut se modifier lui-même (sauf le rôle)
        if (role && currentUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Seuls les administrateurs peuvent modifier les rôles"
            });
        }

        // Un utilisateur ne peut modifier que ses propres informations (sauf s'il est admin)
        if (currentUser.role !== 'admin' && currentUser.id !== parseInt(id)) {
            return res.status(403).json({
                success: false,
                message: "Vous ne pouvez modifier que vos propres informations"
            });
        }

        // Mettre à jour
        await user.update({
            name: name || user.name,
            email: email || user.email,
            role: role !== undefined && currentUser.role === 'admin' ? role : user.role,
            team_id: team_id !== undefined ? team_id : user.team_id
        });

        res.status(200).json({
            success: true,
            message: "Utilisateur mis à jour avec succès",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                team_id: user.team_id
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour de l'utilisateur",
            error: error.message
        });
    }
};

// Supprimer un utilisateur (admin uniquement)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;

        // Empêcher un utilisateur de se supprimer lui-même
        if (currentUser.id === parseInt(id)) {
            return res.status(400).json({
                success: false,
                message: "Vous ne pouvez pas supprimer votre propre compte"
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        await user.destroy();

        res.status(200).json({
            success: true,
            message: "Utilisateur supprimé avec succès"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'utilisateur",
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
