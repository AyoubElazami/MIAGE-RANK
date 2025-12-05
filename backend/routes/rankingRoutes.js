const express = require("express");
const router = express.Router();
const {
    getRanking,
    getRankingByCategory,
    getStatistics,
    getRankingHistory
} = require("../controllers/rankingController");

// Toutes les routes de classement sont publiques
router.get("/", getRanking);
router.get("/category/:category", getRankingByCategory);
router.get("/statistics", getStatistics);
router.get("/history", getRankingHistory);

module.exports = router;

