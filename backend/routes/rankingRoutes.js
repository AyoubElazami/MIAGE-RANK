const express = require("express");
const router = express.Router();
const {
    getRanking,
    getRankingByCategory,
    getStatistics,
    getRankingHistory
} = require("../controllers/rankingController");
router.get("/", getRanking);
router.get("/category/:category", getRankingByCategory);
router.get("/statistics", getStatistics);
router.get("/history", getRankingHistory);
module.exports = router;