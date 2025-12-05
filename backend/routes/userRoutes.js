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
router.use(authenticateToken);
router.get("/", validatePagination, getUsers);
router.get("/:id", validateId, getUserById);
router.post("/", isAdmin, createUser);
router.put("/:id", validateId, updateUser);
router.delete("/:id", validateId, isAdmin, deleteUser);
module.exports = router;