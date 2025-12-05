const express = require("express");
const router = express.Router();
const {
    getChallenges,
    getChallengeById,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getActiveChallenges,
    getMyChallenges
} = require("../controllers/challengeController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { validateChallenge, validateId, validatePagination } = require("../middleware/validation");

// Routes publiques
router.get("/", validatePagination, getChallenges);
router.get("/active", getActiveChallenges);

// Routes protégées (nécessitent authentification) - IMPORTANT: avant /:id pour éviter les conflits
router.get("/admin/my-challenges", authenticateToken, getMyChallenges);
router.post("/", authenticateToken, validateChallenge, createChallenge);

// Routes avec paramètres (doivent être après les routes spécifiques)
router.get("/:id", validateId, getChallengeById);
router.put("/:id", authenticateToken, validateId, validateChallenge, updateChallenge);
router.delete("/:id", authenticateToken, validateId, deleteChallenge);

module.exports = router;

