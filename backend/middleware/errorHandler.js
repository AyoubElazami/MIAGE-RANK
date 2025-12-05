
const errorHandler = (err, req, res, next) => {
    console.error("Erreur:", err);
    if (err.name === "SequelizeValidationError") {
        return res.status(400).json({
            success: false,
            message: "Erreur de validation",
            errors: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }
    if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
            success: false,
            message: "Cette valeur existe déjà",
            field: err.errors[0]?.path || "unknown"
        });
    }
    if (err.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
            success: false,
            message: "Référence invalide",
            error: err.message
        });
    }
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Token invalide"
        });
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token expiré"
        });
    }
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.data && { data: err.data })
        });
    }
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Erreur serveur interne",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} non trouvée`
    });
};
module.exports = {
    errorHandler,
    notFoundHandler
};