require("dotenv").config();
const sequelize = require("../config/db");

async function fixIndexes() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connexion à la base de données réussie!");

        // Vérifier les index de la table Teams
        const [results] = await sequelize.query(`
            SELECT 
                INDEX_NAME,
                COLUMN_NAME,
                NON_UNIQUE,
                SEQ_IN_INDEX
            FROM 
                INFORMATION_SCHEMA.STATISTICS
            WHERE 
                TABLE_SCHEMA = '${process.env.DB_NAME}'
                AND TABLE_NAME = 'Teams'
            ORDER BY 
                INDEX_NAME, SEQ_IN_INDEX
        `);

        console.log("\n📊 Index actuels dans la table Teams:");
        console.log(results);

        const indexCount = await sequelize.query(`
            SELECT COUNT(DISTINCT INDEX_NAME) as count
            FROM INFORMATION_SCHEMA.STATISTICS
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' AND TABLE_NAME = 'Teams'
        `);

        console.log(`\n📈 Nombre total d'index: ${indexCount[0][0].count}`);

        if (indexCount[0][0].count > 10) {
            console.log("\n⚠️  Beaucoup d'index détectés. Vérifiez s'il y a des doublons.");
            console.log("💡 Pour supprimer un index en double, utilisez:");
            console.log("   DROP INDEX nom_index ON Teams;");
        } else {
            console.log("\n✅ Nombre d'index raisonnable.");
        }

        // Vérifier les autres tables aussi
        const tables = ['Users', 'Challenges', 'Scores', 'TeamMembers'];
        for (const table of tables) {
            const [tableIndexes] = await sequelize.query(`
                SELECT COUNT(DISTINCT INDEX_NAME) as count
                FROM INFORMATION_SCHEMA.STATISTICS
                WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' AND TABLE_NAME = '${table}'
            `);
            console.log(`📊 ${table}: ${tableIndexes[0][0].count} index`);
        }

        console.log("\n✅ Vérification terminée!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur:", error);
        process.exit(1);
    }
}

fixIndexes();

