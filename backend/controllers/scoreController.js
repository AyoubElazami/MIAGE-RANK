const { Score, Team, Challenge, User } = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

// Soumettre un score pour un défi
const submitScore = async (req, res) => {
    try {
        const { challengeId, teamId, points, bonus, notes, workSubmission, workFiles } = req.body;
        const userId = req.user.id;

        // Vérifier que l'utilisateur appartient à l'équipe
        const teamMember = await require("../models/TeamMember").findOne({
            where: { TeamId: teamId, UserId: userId }
        });

        if (!teamMember) {
            return res.status(403).json({
                success: false,
                message: "Vous n'appartenez pas à cette équipe"
            });
        }

        // Vérifier que le défi existe et est actif
        const challenge = await Challenge.findByPk(challengeId);
        if (!challenge || !challenge.isActive) {
            return res.status(400).json({
                success: false,
                message: "Défi non trouvé ou inactif"
            });
        }

        // Vérifier si un score existe déjà pour cette équipe et ce défi
        const existingScore = await Score.findOne({
            where: { TeamId: teamId, ChallengeId: challengeId }
        });

        if (existingScore) {
            return res.status(400).json({
                success: false,
                message: "Un score a déjà été soumis pour ce défi"
            });
        }

        const totalPoints = (points || 0) + (bonus || 0);

        const score = await Score.create({
            TeamId: teamId,
            ChallengeId: challengeId,
            points: points || 0,
            bonus: bonus || 0,
            totalPoints,
            status: "pending",
            notes,
            workSubmission: workSubmission || null,
            workFiles: workFiles || null
        });

        const scoreWithDetails = await Score.findByPk(score.id, {
            include: [
                {
                    model: Team,
                    as: "team",
                    attributes: ["id", "name", "color"]
                },
                {
                    model: Challenge,
                    as: "challenge",
                    attributes: ["id", "title", "category", "points"]
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: "Score soumis avec succès",
            data: scoreWithDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la soumission du score",
            error: error.message
        });
    }
};

// Valider ou rejeter un score
const validateScore = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const userId = req.user.id;

        console.log("validateScore - id:", id, "status:", status, "userId:", userId, "body:", req.body);

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Le statut est requis"
            });
        }

        if (!["validated", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Statut invalide (validated ou rejected)"
            });
        }

        const score = await Score.findByPk(id, {
            include: [
                {
                    model: Team,
                    as: "team"
                },
                {
                    model: Challenge,
                    as: "challenge",
                    attributes: ["id", "title", "category", "points", "difficulty", "createdBy"]
                }
            ]
        });

        if (!score) {
            return res.status(404).json({
                success: false,
                message: "Score non trouvé"
            });
        }

        if (score.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Ce score a déjà été traité"
            });
        }

        // Vérifier que l'admin est le créateur du défi
        // Si createdBy est null, permettre à tous les admins de valider (pour les anciens défis)
        if (score.challenge.createdBy !== null && score.challenge.createdBy !== undefined) {
            if (score.challenge.createdBy !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Vous n'êtes pas autorisé à valider ce score. Seul le créateur du défi peut valider."
                });
            }
        } else {
            // Si createdBy est null, vérifier que l'utilisateur est admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: "Accès refusé. Administrateur requis."
                });
            }
        }

        const updateData = {
            status,
            validatedBy: userId,
            validatedAt: new Date()
        };

        if (notes) {
            updateData.notes = notes;
        }

        await score.update(updateData);

        // Si le score est validé, mettre à jour le total de l'équipe
        if (status === "validated") {
            await updateTeamTotalScore(score.TeamId);
            
            // Émettre des événements Socket.io pour les mises à jour en temps réel
            const io = req.app.get("io");
            if (io) {
                const { emitRankingUpdate, emitTeamUpdate, emitChallengeUpdate, emitNotification } = require("../services/socketService");
                
                // Mettre à jour l'équipe
                const team = await Team.findByPk(score.TeamId, {
                    include: [
                        {
                            model: User,
                            as: "members",
                            through: { attributes: ["role"] },
                            attributes: ["id", "name", "email"]
                        }
                    ]
                });
                if (team) {
                    emitTeamUpdate(team.id, team);
                }
                
                // Mettre à jour le défi
                emitChallengeUpdate(score.ChallengeId, updatedScore.challenge);
                
                // Notification générale
                emitNotification(`Score validé pour ${team?.name || "l'équipe"} - ${updatedScore.totalPoints} points`, "success");
                
                // Émettre un événement pour forcer la mise à jour du classement
                io.to("ranking").emit("ranking:refresh");
            }
        }

        const updatedScore = await Score.findByPk(id, {
            include: [
                {
                    model: Team,
                    as: "team",
                    attributes: ["id", "name", "color", "totalScore"]
                },
                {
                    model: Challenge,
                    as: "challenge",
                    attributes: ["id", "title", "category"]
                },
                {
                    model: User,
                    as: "validator",
                    attributes: ["id", "name", "email"]
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: `Score ${status === "validated" ? "validé" : "rejeté"} avec succès`,
            data: updatedScore
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la validation du score",
            error: error.message
        });
    }
};

// Fonction helper pour mettre à jour le total de l'équipe
const updateTeamTotalScore = async (teamId) => {
    const totalScore = await Score.sum("totalPoints", {
        where: {
            TeamId: teamId,
            status: "validated"
        }
    });

    await Team.update(
        { totalScore: totalScore || 0 },
        { where: { id: teamId } }
    );

    // Mettre à jour les rangs
    await updateRankings();
};

// Mettre à jour les rangs de toutes les équipes
const updateRankings = async () => {
    const teams = await Team.findAll({
        where: { isActive: true },
        order: [["totalScore", "DESC"], ["id", "ASC"]]
    });

    for (let i = 0; i < teams.length; i++) {
        await teams[i].update({ rank: i + 1 });
    }
};

// Récupérer tous les scores
const getScores = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { status, teamId, challengeId } = req.query;

        const where = {};
        if (status) {
            where.status = status;
        }
        if (teamId) {
            where.TeamId = teamId;
        }
        if (challengeId) {
            where.ChallengeId = challengeId;
        }

        const { count, rows: scores } = await Score.findAndCountAll({
            where,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Team,
                    as: "team",
                    attributes: ["id", "name", "color"]
                },
                {
                    model: Challenge,
                    as: "challenge",
                    attributes: ["id", "title", "category", "points"]
                },
                {
                    model: User,
                    as: "validator",
                    attributes: ["id", "name", "email"],
                    required: false
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: scores,
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
            message: "Erreur lors de la récupération des scores",
            error: error.message
        });
    }
};

// Récupérer les participations aux défis créés par l'admin connecté
const getMyChallengeScores = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Accès refusé. Administrateur requis."
            });
        }

        const { status, challengeId } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        // Récupérer les IDs des défis créés par cet admin
        const myChallenges = await Challenge.findAll({
            where: { createdBy: req.user.id },
            attributes: ['id']
        });

        const myChallengeIds = myChallenges.map(c => c.id);

        if (myChallengeIds.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                pagination: {
                    page: 1,
                    limit,
                    total: 0,
                    pages: 0
                }
            });
        }

        const where = {
            ChallengeId: challengeId ? parseInt(challengeId) : { [require("sequelize").Op.in]: myChallengeIds }
        };

        if (status) {
            where.status = status;
        }

        const { count, rows: scores } = await Score.findAndCountAll({
            where,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Team,
                    as: "team",
                    attributes: ["id", "name", "color"]
                },
                {
                    model: Challenge,
                    as: "challenge",
                    attributes: ["id", "title", "category", "points", "difficulty"],
                    include: [
                        {
                            model: User,
                            as: "creator",
                            attributes: ["id", "name", "email"]
                        }
                    ]
                },
                {
                    model: User,
                    as: "validator",
                    attributes: ["id", "name", "email"],
                    required: false
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: scores,
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
            message: "Erreur lors de la récupération des participations",
            error: error.message
        });
    }
};

// Récupérer un score par ID
const getScoreById = async (req, res) => {
    try {
        const { id } = req.params;

        const score = await Score.findByPk(id, {
            include: [
                {
                    model: Team,
                    as: "team",
                    attributes: ["id", "name", "color", "totalScore"]
                },
                {
                    model: Challenge,
                    as: "challenge",
                    attributes: ["id", "title", "category", "points", "difficulty", "createdBy"],
                    include: [
                        {
                            model: User,
                            as: "creator",
                            attributes: ["id", "name", "email"],
                            required: false
                        }
                    ]
                },
                {
                    model: User,
                    as: "validator",
                    attributes: ["id", "name", "email"],
                    required: false
                }
            ]
        });

        if (!score) {
            return res.status(404).json({
                success: false,
                message: "Score non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            data: score
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du score",
            error: error.message
        });
    }
};

// Mettre à jour un score (avant validation, pour ajuster les points)
const updateScore = async (req, res) => {
    try {
        const { id } = req.params;
        const { points, bonus } = req.body;

        const score = await Score.findByPk(id, {
            include: [
                {
                    model: Challenge,
                    as: "challenge"
                }
            ]
        });

        if (!score) {
            return res.status(404).json({
                success: false,
                message: "Score non trouvé"
            });
        }

        // Vérifier que seul le créateur du défi peut modifier
        if (score.challenge.createdBy && score.challenge.createdBy !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Vous n'êtes pas autorisé à modifier ce score"
            });
        }

        // Ne peut modifier que si en attente
        if (score.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Le score a déjà été traité, impossible de le modifier"
            });
        }

        const totalPoints = (points || score.points) + (bonus || score.bonus || 0);

        await score.update({
            points: points !== undefined ? points : score.points,
            bonus: bonus !== undefined ? bonus : score.bonus,
            totalPoints
        });

        const updatedScore = await Score.findByPk(id, {
            include: [
                {
                    model: Team,
                    as: "team",
                    attributes: ["id", "name", "color"]
                },
                {
                    model: Challenge,
                    as: "challenge",
                    attributes: ["id", "title", "category"]
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Score mis à jour avec succès",
            data: updatedScore
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du score",
            error: error.message
        });
    }
};

module.exports = {
    submitScore,
    validateScore,
    getScores,
    getScoreById,
    getMyChallengeScores,
    updateScore,
    updateTeamTotalScore,
    updateRankings
};

