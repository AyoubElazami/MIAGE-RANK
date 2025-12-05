// Middleware pour vérifier les rôles des utilisateurs

// Vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentification requise"
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Accès refusé. Seuls les administrateurs peuvent effectuer cette action."
        });
    }

    next();
};

// Vérifier si l'utilisateur est admin ou propriétaire de la ressource
const isAdminOrOwner = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentification requise"
        });
    }

    // Si admin, autoriser
    if (req.user.role === 'admin') {
        return next();
    }

    // Si l'utilisateur est le propriétaire (userId dans les params ou body)
    const resourceUserId = req.params.userId || req.body.userId || req.params.id;
    if (resourceUserId && parseInt(resourceUserId) === req.user.id) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Accès refusé"
    });
};

// Vérifier si l'utilisateur a un rôle spécifique
const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentification requise"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Accès refusé. Rôles autorisés: ${roles.join(', ')}`
            });
        }

        next();
    };
};

module.exports = {
    isAdmin,
    isAdminOrOwner,
    hasRole
};

