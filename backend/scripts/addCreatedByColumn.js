require("dotenv").config();
const sequelize = require("../config/db");

async function addCreatedByColumn() {
    try {
        console.log("🔄 Vérification de la colonne createdBy dans la table Challenges...");
        
        // Vérifier si la colonne existe
        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'Challenges' 
            AND COLUMN_NAME = 'createdBy'
        `);

        if (results.length === 0) {
            console.log("⚠️  La colonne createdBy n'existe pas. Ajout en cours...");
            
            // Ajouter la colonne
            await sequelize.query(`
                ALTER TABLE Challenges 
                ADD COLUMN createdBy INT NULL,
                ADD INDEX idx_createdBy (createdBy),
                ADD CONSTRAINT fk_challenge_creator 
                FOREIGN KEY (createdBy) REFERENCES Users(id) 
                ON DELETE SET NULL
            `);
            
            console.log("✅ Colonne createdBy ajoutée avec succès!");
        } else {
            console.log("✅ La colonne createdBy existe déjà.");
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

addCreatedByColumn();

