const express = require("express");
const router = express.Router();
const { 
    getTeams,
    getTeamById,
    createTeam,
    updateTeam,
    addMember,
    removeMember,  
    deleteTeam
} = require("../controllers/teamController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { validateTeam, validateId, validatePagination } = require("../middleware/validation");
router.get("/", validatePagination, getTeams);
router.get("/:id", validateId, getTeamById);
router.post("/", authenticateToken, validateTeam, createTeam);
router.put("/:id", authenticateToken, validateId, validateTeam, updateTeam);
router.post("/:id/members", authenticateToken, validateId, addMember);
router.delete("/:id/members/:memberId", authenticateToken, validateId, removeMember);
router.delete("/:id", authenticateToken, validateId, deleteTeam);
module.exports = router;