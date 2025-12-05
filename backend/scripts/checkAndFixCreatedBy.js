require("dotenv").config();
const sequelize = require("../config/db");
const { Challenge, User } = require("../models");

async function checkAndFixCreatedBy() {
    try {
        console.log("🔄 Vérification des défis sans createdBy...");
        
        // Récupérer tous les défis
        const challenges = await Challenge.findAll({
            attributes: ['id', 'title', 'createdBy']
        });
        
        console.log(`\n📊 Total de défis: ${challenges.length}`);
        
        // Compter les défis sans createdBy
        const challengesWithoutCreator = challenges.filter(c => !c.createdBy);
        console.log(`⚠️  Défis sans createdBy: ${challengesWithoutCreator.length}`);
        
        if (challengesWithoutCreator.length > 0) {
            console.log("\n📋 Liste des défis sans créateur:");
            challengesWithoutCreator.forEach(c => {
                console.log(`   - ID: ${c.id}, Titre: ${c.title}`);
            });
            
            // Récupérer le premier admin disponible
            const firstAdmin = await User.findOne({
                where: { role: 'admin' },
                order: [['id', 'ASC']]
            });
            
            if (firstAdmin) {
                console.log(`\n🔧 Attribution des défis sans créateur au premier admin: ${firstAdmin.name} (ID: ${firstAdmin.id})`);
                
                // Mettre à jour les défis sans createdBy
                await Challenge.update(
                    { createdBy: firstAdmin.id },
                    { where: { createdBy: null } }
                );
                
                console.log(`✅ ${challengesWithoutCreator.length} défis mis à jour`);
            } else {
                console.log("❌ Aucun admin trouvé dans la base de données");
            }
        }
        
        // Afficher la répartition par admin
        console.log("\n📊 Répartition des défis par admin:");
        const admins = await User.findAll({
            where: { role: 'admin' },
            attributes: ['id', 'name', 'email']
        });
        
        for (const admin of admins) {
            const count = await Challenge.count({
                where: { createdBy: admin.id }
            });
            console.log(`   ${admin.name} (ID: ${admin.id}): ${count} défis`);
        }
        
        // Défis sans créateur restants
        const remaining = await Challenge.count({
            where: { createdBy: null }
        });
        if (remaining > 0) {
            console.log(`\n⚠️  ${remaining} défis restent sans créateur`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur:", error.message);
        console.error("Stack:", error.stack);
        process.exit(1);
    }
}

checkAndFixCreatedBy();

