require("dotenv").config();
const sequelize = require("../config/db");

async function addWorkSubmissionColumn() {
    try {
        console.log("🔄 Vérification des colonnes workSubmission et workFiles dans la table Scores...");
        
        // Vérifier si les colonnes existent
        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'Scores' 
            AND COLUMN_NAME IN ('workSubmission', 'workFiles')
        `);

        const existingColumns = results.map(r => r.COLUMN_NAME);
        
        if (!existingColumns.includes('workSubmission')) {
            console.log("⚠️  La colonne workSubmission n'existe pas. Ajout en cours...");
            
            await sequelize.query(`
                ALTER TABLE Scores 
                ADD COLUMN workSubmission TEXT NULL
            `);
            
            console.log("✅ Colonne workSubmission ajoutée avec succès!");
        } else {
            console.log("✅ La colonne workSubmission existe déjà.");
        }

        if (!existingColumns.includes('workFiles')) {
            console.log("⚠️  La colonne workFiles n'existe pas. Ajout en cours...");
            
            await sequelize.query(`
                ALTER TABLE Scores 
                ADD COLUMN workFiles JSON NULL
            `);
            
            console.log("✅ Colonne workFiles ajoutée avec succès!");
        } else {
            console.log("✅ La colonne workFiles existe déjà.");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur:", error.message);
        if (error.message.includes("Duplicate column name")) {
            console.log("ℹ️  La colonne existe déjà, c'est normal.");
        } else {
            console.error("Stack:", error.stack);
        }
        process.exit(1);
    }
}

addWorkSubmissionColumn();

