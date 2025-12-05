
const { User, Team, Challenge, Score, TeamMember } = require("../models");
const syncAllModels = async () => {
    try {
        console.log("🔄 Synchronisation des modèles...");
        await User.sync({ alter: true });
        await Team.sync({ alter: true });
        await Challenge.sync({ alter: true });
        await TeamMember.sync({ alter: true });
        await Score.sync({ alter: true });
        console.log("✅ Tous les modèles ont été synchronisés avec succès!");
    } catch (error) {
        console.error("❌ Erreur lors de la synchronisation des modèles:", error);
        throw error;
    }
};
module.exports = { syncAllModels };