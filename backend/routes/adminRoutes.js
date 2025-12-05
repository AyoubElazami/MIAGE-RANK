const express = require("express");
const router = express.Router();
const {
    getAdminDashboard,
    createUserByAdmin,
    updateUserRole,
    assignUserToTeam
} = require("../controllers/adminController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const { validateId } = require("../middleware/validation");

// Toutes les routes admin nécessitent une authentification et le rôle admin
router.use(authenticateToken);
router.use(isAdmin);

// Dashboard admin
router.get("/dashboard", getAdminDashboard);

// Gestion des utilisateurs
router.post("/users", createUserByAdmin);
router.put("/users/:id/role", validateId, updateUserRole);
router.put("/users/:id/team", validateId, assignUserToTeam);

module.exports = router;

