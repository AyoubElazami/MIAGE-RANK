const { Score, Team, Challenge, User } = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const submitScore = async (req, res) => {
    try {
        const { challengeId, teamId, points, bonus, notes, workSubmission, workFiles } = req.body;
        const userId = req.user.id;
        const teamMember = await require("../models/TeamMember").findOne({
            where: { TeamId: teamId, UserId: userId }
        });
        if (!teamMember) {
            return res.status(403).json({
                success: false,
                message: "Vous n'appartenez pas à cette équipe"
            });
        }
        const challenge = await Challenge.findByPk(challengeId);
        if (!challenge || !challenge.isActive) {
            return res.status(400).json({
                success: false,
                message: "Défi non trouvé ou inactif"
            });
        }
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
        if (score.challenge.createdBy !== null && score.challenge.createdBy !== undefined) {
            if (score.challenge.createdBy !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Vous n'êtes pas autorisé à valider ce score. Seul le créateur du défi peut valider."
                });
            }
        } else {
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
        if (status === "validated") {
            await updateTeamTotalScore(score.TeamId);
            const io = req.app.get("io");
            if (io) {
                const { emitRankingUpdate, emitTeamUpdate, emitChallengeUpdate, emitNotification } = require("../services/socketService");
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
                emitChallengeUpdate(score.ChallengeId, updatedScore.challenge);
                emitNotification(`Score validé pour ${team?.name || "l'équipe"} - ${updatedScore.totalPoints} points`, "success");
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
    await updateRankings();
};
const updateRankings = async () => {
    const teams = await Team.findAll({
        where: { isActive: true },
        order: [["totalScore", "DESC"], ["id", "ASC"]]
    });
    for (let i = 0; i < teams.length; i++) {
        await teams[i].update({ rank: i + 1 });
    }
};
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
        if (score.challenge.createdBy && score.challenge.createdBy !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Vous n'êtes pas autorisé à modifier ce score"
            });
        }
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