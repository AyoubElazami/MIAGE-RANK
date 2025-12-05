const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const { validateId, validatePagination } = require("../middleware/validation");
  
// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes accessibles à tous les utilisateurs authentifiés
router.get("/", validatePagination, getUsers);
router.get("/:id", validateId, getUserById);

// Routes nécessitant les droits admin
router.post("/", isAdmin, createUser);
router.put("/:id", validateId, updateUser);
router.delete("/:id", validateId, isAdmin, deleteUser);

module.exports = router;

