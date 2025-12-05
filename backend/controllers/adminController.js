const User = require("../models/User");
const Team = require("../models/Team");
const Challenge = require("../models/Challenge");
const Score = require("../models/Score");
const bcrypt = require("bcrypt");
const getAdminDashboard = async (req, res) => {
    try {
        const safeCount = async (model, where = {}) => {
            try {
                return await model.count({ where });
            } catch (error) {
                console.error(`Erreur lors du count de ${model.name}:`, error.message);
                return 0;
            }
        };
        const safeFindAll = async (model, options = {}) => {
            try {
                return await model.findAll(options);
            } catch (error) {
                console.error(`Erreur lors du findAll de ${model.name}:`, error.message);
                return [];
            }
        };
        const [totalUsers, totalAdmins, totalRegularUsers, totalTeams, totalChallenges, totalScores, pendingScores] = await Promise.all([
            safeCount(User),
            safeCount(User, { role: 'admin' }),
            safeCount(User, { role: 'user' }),
            safeCount(Team, { isActive: true }),
            safeCount(Challenge, { isActive: true }),
            safeCount(Score, { status: 'validated' }),
            safeCount(Score, { status: 'pending' })
        ]);
        const recentUsers = await safeFindAll(User, {
            attributes: { exclude: ['password'] },
            order: [['created_at', 'DESC']],
            limit: 5
        });
        const recentPendingScores = await safeFindAll(Score, {
            where: { status: 'pending' },
            include: [
                {
                    model: Team,
                    as: 'team',
                    attributes: ['id', 'name', 'color'],
                    required: false
                },
                {
                    model: Challenge,
                    as: 'challenge',
                    attributes: ['id', 'title', 'category'],
                    required: false
                }
            ],
            order: [['created_at', 'DESC']],
            limit: 5
        });
        res.status(200).json({
            success: true,
            data: {
                statistics: {
                    users: {
                        total: totalUsers,
                        admins: totalAdmins,
                        regular: totalRegularUsers
                    },
                    teams: {
                        total: totalTeams
                    },
                    challenges: {
                        total: totalChallenges
                    },
                    scores: {
                        total: totalScores,
                        pending: pendingScores
                    }
                },
                recentUsers: recentUsers || [],
                recentPendingScores: recentPendingScores || []
            }
        });
    } catch (error) {
        console.error("Erreur dans getAdminDashboard:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du dashboard",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
const createUserByAdmin = async (req, res) => {
    try {
        const { name, email, password, role, team_id } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Les champs name, email et password sont requis"
            });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Cet email est déjà utilisé"
            });
        }
        if (role && !['admin', 'user'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Le rôle doit être 'admin' ou 'user'"
            });
        }
        if (team_id) {
            const team = await Team.findByPk(team_id);
            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: "L'équipe spécifiée n'existe pas"
                });
            }
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            team_id: team_id || null
        });
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
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!role || !['admin', 'user'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Le rôle doit être 'admin' ou 'user'"
            });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }
        if (req.user.id === parseInt(id)) {
            return res.status(400).json({
                success: false,
                message: "Vous ne pouvez pas modifier votre propre rôle"
            });
        }
        await user.update({ role });
        res.status(200).json({
            success: true,
            message: "Rôle de l'utilisateur mis à jour avec succès",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du rôle",
            error: error.message
        });
    }
};
const assignUserToTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { team_id } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }
        if (team_id) {
            const team = await Team.findByPk(team_id);
            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: "L'équipe spécifiée n'existe pas"
                });
            }
        }
        await user.update({ team_id: team_id || null });
        res.status(200).json({
            success: true,
            message: team_id ? "Utilisateur assigné à l'équipe avec succès" : "Utilisateur retiré de l'équipe avec succès",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                team_id: user.team_id
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'assignation",
            error: error.message
        });
    }
};
module.exports = {
    getAdminDashboard,
    createUserByAdmin,
    updateUserRole,
    assignUserToTeam
};