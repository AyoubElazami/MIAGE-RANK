const User = require("./User");
const Team = require("./Team");
const Challenge = require("./Challenge");
const Score = require("./Score");
const TeamMember = require("./TeamMember");
User.belongsTo(Team, {
    foreignKey: "team_id",
    as: "team",
    onDelete: "SET NULL"
});
Team.hasMany(User, {
    foreignKey: "team_id",
    as: "users"
});
User.belongsToMany(Team, {
    through: TeamMember,
    foreignKey: "UserId",
    as: "teams"
});
Team.belongsToMany(User, {
    through: TeamMember,
    foreignKey: "TeamId",
    as: "members"
});
TeamMember.belongsTo(User, {
    foreignKey: "UserId",
    as: "user"
});
TeamMember.belongsTo(Team, {
    foreignKey: "TeamId",
    as: "team"
});
Team.hasMany(Score, {
    foreignKey: "TeamId",
    as: "scores"
});
Score.belongsTo(Team, {
    foreignKey: "TeamId",
    as: "team"
});
Challenge.hasMany(Score, {
    foreignKey: "ChallengeId",
    as: "scores"
});
Score.belongsTo(Challenge, {
    foreignKey: "ChallengeId",
    as: "challenge"
});
User.hasMany(Score, {
    foreignKey: "validatedBy",
    as: "validatedScores"
});
Score.belongsTo(User, {
    foreignKey: "validatedBy",
    as: "validator"
});
Challenge.belongsTo(User, {
    foreignKey: "createdBy",
    as: "creator"
});
User.hasMany(Challenge, {
    foreignKey: "createdBy",
    as: "createdChallenges"
});
const syncModels = async () => {
    try {
        console.log("🔄 Synchronisation des modèles...");
        const syncOptions = { alter: false, force: false };
        await Team.sync(syncOptions);
        console.log("✅ Table Team vérifiée!");
        await User.sync(syncOptions);
        console.log("✅ Table User vérifiée!");
        try {
            await Challenge.sync({ alter: true, force: false });
            console.log("✅ Table Challenge vérifiée et mise à jour!");
        } catch (error) {
            console.warn("⚠️  Alter échoué pour Challenge, tentative sans alter...");
            await Challenge.sync(syncOptions);
            console.log("✅ Table Challenge vérifiée!");
        }
        await TeamMember.sync(syncOptions);
        console.log("✅ Table TeamMember vérifiée!");
        await Score.sync(syncOptions);
        console.log("✅ Table Score vérifiée!");
        console.log("✅ Tous les modèles ont été vérifiés avec succès!");
    } catch (error) {
        console.error("❌ Erreur lors de la synchronisation des modèles:", error.message);
        if (error.parent && error.parent.code === 'ER_TOO_MANY_KEYS') {
            console.error("⚠️  ERREUR: Trop d'index dans une table MySQL (limite: 64)");
            console.error("💡 Solution: Exécutez le script backend/scripts/cleanup_database.sql");
            console.error("   Ou supprimez manuellement les index en double dans MySQL");
        }
        console.warn("⚠️  Le serveur continue malgré l'erreur de synchronisation");
        console.warn("⚠️  Les tables existantes seront utilisées telles quelles");
    }
};
syncModels().catch(console.error);
module.exports = {
    User,
    Team,
    Challenge,
    Score,
    TeamMember
};