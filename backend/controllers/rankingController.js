const { Team, Score, Challenge, User } = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const getRanking = async (req, res) => {
    try {
        const { limit } = req.query;
        const topLimit = limit ? parseInt(limit) : null;
        let teams = await Team.findAll({
            where: { isActive: true },
            order: [["totalScore", "DESC"], ["rank", "ASC"], ["id", "ASC"]],
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: ["role"] },
                    attributes: ["id", "name", "email"]
                },
                {
                    model: Score,
                    as: "scores",
                    where: { status: "validated" },
                    required: false,
                    include: [
                        {
                            model: Challenge,
                            as: "challenge",
                            attributes: ["id", "title", "category"]
                        }
                    ]
                }
            ]
        });
        if (topLimit) {
            teams = teams.slice(0, topLimit);
        }
        const ranking = teams.map((team, index) => ({
            rank: team.rank || index + 1,
            team: {
                id: team.id,
                name: team.name,
                color: team.color,
                logo: team.logo,
                membersCount: team.members ? team.members.length : 0
            },
            totalScore: team.totalScore || 0,
            validatedScores: team.scores ? team.scores.length : 0,
            lastUpdate: team.updatedAt
        }));
        res.status(200).json({
            success: true,
            data: ranking,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Erreur dans getRanking:", error);
        console.error("Stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du classement",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
const getRankingByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { limit } = req.query;
        const validCategories = ["technique", "creativite", "collaboration", "innovation", "autre"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Catégorie invalide"
            });
        }
        const scores = await Score.findAll({
            where: { status: "validated" },
            include: [
                {
                    model: Challenge,
                    as: "challenge",
                    where: { category },
                    attributes: ["id", "title", "category"]
                },
                {
                    model: Team,
                    as: "team",
                    attributes: ["id", "name", "color", "logo"]
                }
            ],
            order: [["totalPoints", "DESC"]]
        });
        const teamScores = {};
        scores.forEach(score => {
            const teamId = score.TeamId;
            if (!teamScores[teamId]) {
                teamScores[teamId] = {
                    team: score.team,
                    totalScore: 0,
                    scores: []
                };
            }
            teamScores[teamId].totalScore += score.totalPoints;
            teamScores[teamId].scores.push({
                challenge: score.challenge,
                points: score.totalPoints,
                date: score.validatedAt
            });
        });
        let ranking = Object.values(teamScores)
            .map((item, index) => ({
                rank: index + 1,
                team: item.team,
                totalScore: item.totalScore,
                scores: item.scores
            }))
            .sort((a, b) => b.totalScore - a.totalScore);
        if (limit) {
            ranking = ranking.slice(0, parseInt(limit));
        }
        res.status(200).json({
            success: true,
            category,
            data: ranking,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Erreur dans getRankingByCategory:", error);
        console.error("Stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du classement par catégorie",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
const getStatistics = async (req, res) => {
    try {
        const totalTeams = await Team.count({ where: { isActive: true } });
        const totalChallenges = await Challenge.count({ where: { isActive: true } });
        const totalScores = await Score.count({ where: { status: "validated" } });
        const totalPoints = await Score.sum("totalPoints", {
            where: { status: "validated" }
        }) || 0;
        const topTeams = await Team.findAll({
            where: { isActive: true },
            order: [["totalScore", "DESC"]],
            limit: 3,
            attributes: ["id", "name", "color", "totalScore"]
        });
        let popularChallenges = [];
        try {
            const allChallenges = await Challenge.findAll({
                include: [
                    {
                        model: Score,
                        as: "scores",
                        where: { status: "validated" },
                        required: false,
                        attributes: ["id"]
                    }
                ],
                attributes: ["id", "title", "category"]
            });
            popularChallenges = allChallenges
                .map(challenge => ({
                    id: challenge.id,
                    title: challenge.title,
                    category: challenge.category,
                    scoresCount: challenge.scores ? challenge.scores.length : 0
                }))
                .sort((a, b) => b.scoresCount - a.scoresCount)
                .slice(0, 5);
        } catch (error) {
            console.error("Erreur lors de la récupération des défis populaires:", error.message);
            popularChallenges = [];
        }
        res.status(200).json({
            success: true,
            data: {
                teams: {
                    total: totalTeams,
                    top3: topTeams
                },
                challenges: {
                    total: totalChallenges
                },
                scores: {
                    total: totalScores,
                    totalPoints
                },
                popularChallenges
            },
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Erreur dans getStatistics:", error);
        console.error("Stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des statistiques",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
const getRankingHistory = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(days));
        const scores = await Score.findAll({
            where: {
                status: "validated",
                validatedAt: { [Op.gte]: daysAgo }
            },
            include: [
                {
                    model: Team,
                    as: "team",
                    attributes: ["id", "name", "color"]
                },
                {
                    model: Challenge,
                    as: "challenge",
                    attributes: ["id", "title"]
                }
            ],
            order: [["validatedAt", "ASC"]]
        });
        const history = {};
        scores.forEach(score => {
            const date = score.validatedAt.toISOString().split("T")[0];
            if (!history[date]) {
                history[date] = {};
            }
            const teamId = score.TeamId;
            if (!history[date][teamId]) {
                history[date][teamId] = {
                    team: score.team,
                    points: 0
                };
            }
            history[date][teamId].points += score.totalPoints;
        });
        res.status(200).json({
            success: true,
            data: history,
            period: {
                days: parseInt(days),
                from: daysAgo,
                to: new Date()
            }
        });
    } catch (error) {
        console.error("Erreur dans getRankingHistory:", error);
        console.error("Stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de l'historique",
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
module.exports = {
    getRanking,
    getRankingByCategory,
    getStatistics,
    getRankingHistory
};