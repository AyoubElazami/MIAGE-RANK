const { body, param, query, validationResult } = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Erreurs de validation",
            errors: errors.array()
        });
    }
    next();
};
const validateTeam = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Le nom de l'équipe doit contenir entre 2 et 50 caractères"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("La description ne peut pas dépasser 500 caractères"),
    body("color")
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage("La couleur doit être au format hexadécimal (#RRGGBB)"),
    handleValidationErrors
];
const validateChallenge = [
    body("title")
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Le titre doit contenir entre 3 et 100 caractères"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("La description est requise"),
    body("category")
        .isIn(["technique", "creativite", "collaboration", "innovation", "autre"])
        .withMessage("Catégorie invalide"),
    body("points")
        .isInt({ min: 1, max: 1000 })
        .withMessage("Les points doivent être entre 1 et 1000"),
    body("difficulty")
        .optional()
        .isIn(["facile", "moyen", "difficile", "expert"])
        .withMessage("Difficulté invalide"),
    body("startDate")
        .isISO8601()
        .withMessage("Date de début invalide"),
    body("endDate")
        .optional()
        .isISO8601()
        .withMessage("Date de fin invalide"),
    handleValidationErrors
];
const validateScore = [
    body("points")
        .isInt({ min: 0 })
        .withMessage("Les points doivent être un entier positif"),
    body("bonus")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Le bonus doit être un entier positif"),
    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Les notes ne peuvent pas dépasser 500 caractères"),
    handleValidationErrors
];
const validateScoreValidation = [
    body("status")
        .isIn(["validated", "rejected"])
        .withMessage("Le statut doit être 'validated' ou 'rejected'"),
    body("notes")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Les notes ne peuvent pas dépasser 1000 caractères"),
    handleValidationErrors
];
const validateId = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("L'ID doit être un entier positif"),
    handleValidationErrors
];
const validatePagination = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("La page doit être un entier positif"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("La limite doit être entre 1 et 100"),
    handleValidationErrors
];
module.exports = {
    validateTeam,
    validateChallenge,
    validateScore,
    validateScoreValidation,
    validateId,
    validatePagination,
    handleValidationErrors
};