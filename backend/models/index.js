const User = require("./User");
const Team = require("./Team");
const Challenge = require("./Challenge");
const Score = require("./Score");
const TeamMember = require("./TeamMember");

// Relation User - Team (via team_id)
User.belongsTo(Team, {
    foreignKey: "team_id",
    as: "team",
    onDelete: "SET NULL"
});

Team.hasMany(User, {
    foreignKey: "team_id",
    as: "users"
});

// Relations User - TeamMember - Team (pour les membres multiples)
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

// Relations Team - Score - Challenge
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

// Relations User - Score (pour validatedBy)
User.hasMany(Score, {
    foreignKey: "validatedBy",
    as: "validatedScores"
});

Score.belongsTo(User, {
    foreignKey: "validatedBy",
    as: "validator"
});

// Relation Challenge - User (pour createdBy)
Challenge.belongsTo(User, {
    foreignKey: "createdBy",
    as: "creator"
});

User.hasMany(Challenge, {
    foreignKey: "createdBy",
    as: "createdChallenges"
});

// Synchronisation des modèles dans le bon ordre (séquentielle)
const syncModels = async () => {
    try {
        console.log("🔄 Synchronisation des modèles...");
        
        // Utiliser force: false pour éviter de recréer les tables
        // alter: true peut causer des problèmes avec trop d'index
        const syncOptions = { alter: false, force: false };
        
        // 1. Synchroniser Team en premier (pas de dépendances)
        await Team.sync(syncOptions);
        console.log("✅ Table Team vérifiée!");
        
        // 2. Synchroniser User (dépend de Team pour team_id)
        await User.sync(syncOptions);
        console.log("✅ Table User vérifiée!");
        
        // 3. Synchroniser Challenge (pas de dépendances)
        // Utiliser alter: true uniquement pour Challenge pour ajouter createdBy si nécessaire
        try {
            await Challenge.sync({ alter: true, force: false });
            console.log("✅ Table Challenge vérifiée et mise à jour!");
        } catch (error) {
            // Si alter échoue, essayer sans alter
            console.warn("⚠️  Alter échoué pour Challenge, tentative sans alter...");
            await Challenge.sync(syncOptions);
            console.log("✅ Table Challenge vérifiée!");
        }
        
        // 4. Synchroniser TeamMember (dépend de User et Team)
        await TeamMember.sync(syncOptions);
        console.log("✅ Table TeamMember vérifiée!");
        
        // 5. Synchroniser Score en dernier (dépend de Team, Challenge et User)
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
        // Ne pas bloquer le démarrage du serveur si la synchronisation échoue
        console.warn("⚠️  Le serveur continue malgré l'erreur de synchronisation");
        console.warn("⚠️  Les tables existantes seront utilisées telles quelles");
    }
};

// Exécuter la synchronisation
syncModels().catch(console.error);

module.exports = {
    User,
    Team,
    Challenge,
    Score,
    TeamMember
};

