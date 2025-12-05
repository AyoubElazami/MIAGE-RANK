const { Challenge, Score, Team, User } = require("../models");
const { Op } = require("sequelize");
const getChallenges = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { category, isActive, difficulty } = req.query;
        const where = {};
        if (category) {
            where.category = category;
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        if (difficulty) {
            where.difficulty = difficulty;
        }
        let challenges, count;
        try {
            const result = await Challenge.findAndCountAll({
                where,
                limit,
                offset,
                order: [["startDate", "DESC"]],
                include: [
                    {
                        model: Score,
                        as: "scores",
                        required: false,
                        include: [
                            {
                                model: Team,
                                as: "team",
                                attributes: ["id", "name", "color"],
                                required: false
                            }
                        ]
                    },
                    {
                        model: User,
                        as: "creator",
                        attributes: ["id", "name", "email"],
                        required: false
                    }
                ]
            });
            challenges = result.rows;
            count = result.count;
        } catch (includeError) {
            console.warn("Include creator échoué, tentative sans creator:", includeError.message);
            const result = await Challenge.findAndCountAll({
                where,
                limit,
                offset,
                order: [["startDate", "DESC"]],
                include: [
                    {
                        model: Score,
                        as: "scores",
                        required: false,
                        include: [
                            {
                                model: Team,
                                as: "team",
                                attributes: ["id", "name", "color"],
                                required: false
                            }
                        ]
                    }
                ]
            });
            challenges = result.rows;
            count = result.count;
        }
        res.status(200).json({
            success: true,
            data: challenges,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error("Erreur dans getChallenges:", error);
        console.error("Stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des défis",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
const getChallengeById = async (req, res) => {
    try {
        const { id } = req.params;
        const challenge = await Challenge.findByPk(id, {
            include: [
                {
                    model: Score,
                    as: "scores",
                    required: false,
                    include: [
                        {
                            model: Team,
                            as: "team",
                            attributes: ["id", "name", "color", "totalScore"],
                            required: false
                        }
                    ],
                    order: [["totalPoints", "DESC"]]
                },
                {
                    model: User,
                    as: "creator",
                    attributes: ["id", "name", "email"],
                    required: false
                }
            ]
        });
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Défi non trouvé"
            });
        }
        res.status(200).json({
            success: true,
            data: challenge
        });
    } catch (error) {
        console.error("Erreur dans getChallengeById:", error);
        console.error("Stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du défi",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
const createChallenge = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Seuls les administrateurs peuvent créer des défis"
            });
        }
        const challengeData = {
            ...req.body,
            createdBy: req.user.id
        };
        const challenge = await Challenge.create(challengeData);
        const challengeWithCreator = await Challenge.findByPk(challenge.id, {
            include: [
                {
                    model: User,
                    as: "creator",
                    attributes: ["id", "name", "email"]
                }
            ]
        });
        res.status(201).json({
            success: true,
            message: "Défi créé avec succès",
            data: challengeWithCreator
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création du défi",
            error: error.message
        });
    }
};
const getMyChallenges = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Accès refusé. Administrateur requis."
            });
        }
        console.log("getMyChallenges - Recherche des défis pour admin ID:", req.user.id, "Email:", req.user.email);
        let challenges = [];
        try {
            challenges = await Challenge.findAll({
                where: { 
                    createdBy: req.user.id
                },
                order: [["created_at", "DESC"]],
                include: [
                    {
                        model: User,
                        as: "creator",
                        attributes: ["id", "name", "email"],
                        required: false
                    }
                ]
            });
            console.log(`Trouvé ${challenges.length} défis pour l'admin ${req.user.id} (${req.user.email})`);
            if (challenges.length > 0) {
                console.log("IDs des défis trouvés:", challenges.map(c => c.id).join(", "));
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des défis:", err.message);
            console.error("Stack:", err.stack);
            return res.status(200).json({
                success: true,
                data: []
            });
        }
        const challengesWithScores = [];
        for (const challenge of challenges) {
            try {
                if (challenge.createdBy !== null && challenge.createdBy !== undefined && challenge.createdBy !== req.user.id) {
                    console.log(`Défi ${challenge.id} ignoré: createdBy=${challenge.createdBy}, userId=${req.user.id}`);
                    continue;
                }
                let scoresCount = 0;
                let pendingCount = 0;
                try {
                    scoresCount = await Score.count({
                        where: { ChallengeId: challenge.id }
                    });
                } catch (err) {
                    console.error(`Erreur count scores pour défi ${challenge.id}:`, err.message);
                }
                try {
                    pendingCount = await Score.count({
                        where: { ChallengeId: challenge.id, status: 'pending' }
                    });
                } catch (err) {
                    console.error(`Erreur count pending pour défi ${challenge.id}:`, err.message);
                }
                const challengeData = challenge.toJSON ? challenge.toJSON() : challenge;
                challengesWithScores.push({
                    ...challengeData,
                    participationsCount: scoresCount,
                    pendingCount: pendingCount
                });
            } catch (error) {
                console.error(`Erreur lors du traitement du défi ${challenge.id}:`, error.message);
                console.error("Stack:", error.stack);
                try {
                    const challengeData = challenge.toJSON ? challenge.toJSON() : challenge;
                    challengesWithScores.push({
                        ...challengeData,
                        participationsCount: 0,
                        pendingCount: 0
                    });
                } catch (jsonError) {
                    console.error(`Erreur lors de la conversion JSON du défi ${challenge.id}:`, jsonError.message);
                }
            }
        }
        console.log(`Retour de ${challengesWithScores.length} défis avec scores`);
        if (challengesWithScores.length > 0) {
            console.log("Titres des défis retournés:", challengesWithScores.map(c => c.title).join(", "));
        } else {
            console.log("⚠️  Aucun défi trouvé pour cet admin. Vérifiez que createdBy correspond à l'ID de l'admin.");
        }
        res.status(200).json({
            success: true,
            data: challengesWithScores
        });
    } catch (error) {
        console.error("Erreur dans getMyChallenges:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de vos défis",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
const updateChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const challenge = await Challenge.findByPk(id);
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Défi non trouvé"
            });
        }
        await challenge.update(updateData);
        res.status(200).json({
            success: true,
            message: "Défi mis à jour avec succès",
            data: challenge
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du défi",
            error: error.message
        });
    }
};
const deleteChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const challenge = await Challenge.findByPk(id);
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Défi non trouvé"
            });
        }
        await challenge.destroy();
        res.status(200).json({
            success: true,
            message: "Défi supprimé avec succès"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression du défi",
            error: error.message
        });
    }
};
const getActiveChallenges = async (req, res) => {
    try {
        const now = new Date();
        let challenges;
        try {
            challenges = await Challenge.findAll({
                where: {
                    isActive: true,
                    startDate: { [Op.lte]: now },
                    [Op.or]: [
                        { endDate: null },
                        { endDate: { [Op.gte]: now } }
                    ]
                },
                order: [["startDate", "DESC"]],
                include: [
                    {
                        model: Score,
                        as: "scores",
                        required: false,
                        include: [
                            {
                                model: Team,
                                as: "team",
                                attributes: ["id", "name", "color"],
                                required: false
                            }
                        ]
                    },
                    {
                        model: User,
                        as: "creator",
                        attributes: ["id", "name", "email"],
                        required: false
                    }
                ]
            });
        } catch (includeError) {
            console.warn("Include creator échoué, tentative sans creator:", includeError.message);
            challenges = await Challenge.findAll({
                where: {
                    isActive: true,
                    startDate: { [Op.lte]: now },
                    [Op.or]: [
                        { endDate: null },
                        { endDate: { [Op.gte]: now } }
                    ]
                },
                order: [["startDate", "DESC"]],
                include: [
                    {
                        model: Score,
                        as: "scores",
                        required: false,
                        include: [
                            {
                                model: Team,
                                as: "team",
                                attributes: ["id", "name", "color"],
                                required: false
                            }
                        ]
                    }
                ]
            });
        }
        res.status(200).json({
            success: true,
            data: challenges
        });
    } catch (error) {
        console.error("Erreur dans getActiveChallenges:", error);
        console.error("Stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des défis actifs",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
module.exports = {
    getChallenges,
    getChallengeById,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getActiveChallenges,
    getMyChallenges
};