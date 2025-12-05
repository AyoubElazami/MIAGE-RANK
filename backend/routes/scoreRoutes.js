const express = require("express");
const router = express.Router();
const {
    submitScore,
    validateScore,
    getScores,
    getScoreById,
    getMyChallengeScores,
    updateScore
} = require("../controllers/scoreController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { validateScore: validateScoreInput, validateScoreValidation, validateId, validatePagination } = require("../middleware/validation");
router.get("/", validatePagination, getScores);
router.get("/:id", validateId, getScoreById);
router.post("/submit", authenticateToken, validateScoreInput, submitScore);
router.get("/admin/my-participations", authenticateToken, getMyChallengeScores);
router.put("/:id", authenticateToken, validateId, updateScore);
router.put("/:id/validate", authenticateToken, validateId, validateScoreValidation, validateScore);
module.exports = router;