const { Team, User, TeamMember, Score } = require("../models");
const { Op } = require("sequelize");

// Récupérer toutes les équipes avec pagination
const getTeams = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { search, isActive } = req.query;

        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }

        const { count, rows: teams } = await Team.findAndCountAll({
            where,
            limit,
            offset,
            order: [["totalScore", "DESC"], ["rank", "ASC"]],
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: ["role", "joinedAt"] },
                    attributes: ["id", "name", "email"]
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: teams,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des équipes",
            error: error.message
        });
    }
};

// Récupérer une équipe par ID
const getTeamById = async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: ["role", "joinedAt"] },
                    attributes: ["id", "name", "email"]
                },
                {
                    model: Score,
                    as: "scores",
                    include: [
                        {
                            model: require("../models/Challenge"),
                            as: "challenge",
                            attributes: ["id", "title", "category", "points"]
                        }
                    ],
                    order: [["createdAt", "DESC"]]
                }
            ]
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Équipe non trouvée"
            });
        }

        res.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de l'équipe",
            error: error.message
        });
    }
};

// Créer une nouvelle équipe
const createTeam = async (req, res) => {
    try {
        const { name, description, color, logo } = req.body;
        const userId = req.user.id;

        // Vérifier si l'utilisateur n'a pas déjà une équipe
        const existingMember = await TeamMember.findOne({
            where: { UserId: userId }
        });

        if (existingMember) {
            return res.status(400).json({
                success: false,
                message: "Vous êtes déjà membre d'une équipe"
            });
        }

        const team = await Team.create({
            name,
            description,
            color: color || "#3B82F6",
            logo
        });

        // Ajouter le créateur comme leader
        await TeamMember.create({
            TeamId: team.id,
            UserId: userId,
            role: "leader"
        });

        const teamWithMembers = await Team.findByPk(team.id, {
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: ["role", "joinedAt"] },
                    attributes: ["id", "name", "email"]
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: "Équipe créée avec succès",
            data: teamWithMembers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de l'équipe",
            error: error.message
        });
    }
};

// Mettre à jour une équipe
const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, color, logo, isActive } = req.body;
        const userId = req.user.id;

        const team = await Team.findByPk(id);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Équipe non trouvée"
            });
        }

        // Vérifier si l'utilisateur est le leader
        const member = await TeamMember.findOne({
            where: { TeamId: id, UserId: userId, role: "leader" }
        });

        if (!member) {
            return res.status(403).json({
                success: false,
                message: "Seul le leader peut modifier l'équipe"
            });
        }

        await team.update({
            name: name || team.name,
            description: description !== undefined ? description : team.description,
            color: color || team.color,
            logo: logo !== undefined ? logo : team.logo,
            isActive: isActive !== undefined ? isActive : team.isActive
        });

        res.status(200).json({
            success: true,
            message: "Équipe mise à jour avec succès",
            data: team
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour de l'équipe",
            error: error.message
        });
    }
};

// Ajouter un membre à une équipe
const addMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const currentUserId = req.user.id;

        const team = await Team.findByPk(id);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Équipe non trouvée"
            });
        }

        // Vérifier si l'utilisateur actuel est le leader
        const leader = await TeamMember.findOne({
            where: { TeamId: id, UserId: currentUserId, role: "leader" }
        });

        if (!leader) {
            return res.status(403).json({
                success: false,
                message: "Seul le leader peut ajouter des membres"
            });
        }

        // Vérifier si l'utilisateur n'est pas déjà membre
        const existingMember = await TeamMember.findOne({
            where: { TeamId: id, UserId: userId }
        });

        if (existingMember) {
            return res.status(400).json({
                success: false,
                message: "Cet utilisateur est déjà membre de l'équipe"
            });
        }

        await TeamMember.create({
            TeamId: id,
            UserId: userId,
            role: "member"
        });

        res.status(201).json({
            success: true,
            message: "Membre ajouté avec succès"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'ajout du membre",
            error: error.message
        });
    }
};

// Retirer un membre d'une équipe
const removeMember = async (req, res) => {
    try {
        const { id, memberId } = req.params;
        const currentUserId = req.user.id;

        // Vérifier si l'utilisateur actuel est le leader
        const leader = await TeamMember.findOne({
            where: { TeamId: id, UserId: currentUserId, role: "leader" }
        });

        if (!leader) {
            return res.status(403).json({
                success: false,
                message: "Seul le leader peut retirer des membres"
            });
        }

        const member = await TeamMember.findOne({
            where: { TeamId: id, UserId: memberId }
        });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Membre non trouvé"
            });
        }

        if (member.role === "leader") {
            return res.status(400).json({
                success: false,
                message: "Le leader ne peut pas être retiré"
            });
        }

        await member.destroy();

        res.status(200).json({
            success: true,
            message: "Membre retiré avec succès"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors du retrait du membre",
            error: error.message
        });
    }
};

// Supprimer une équipe
const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const team = await Team.findByPk(id);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Équipe non trouvée"
            });
        }

        // Vérifier si l'utilisateur est le leader
        const leader = await TeamMember.findOne({
            where: { TeamId: id, UserId: userId, role: "leader" }
        });

        if (!leader) {
            return res.status(403).json({
                success: false,
                message: "Seul le leader peut supprimer l'équipe"
            });
        }

        await team.destroy();

        res.status(200).json({
            success: true,
            message: "Équipe supprimée avec succès"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'équipe",
            error: error.message
        });
    }
};

module.exports = {
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    addMember,
    removeMember,
    deleteTeam
};

