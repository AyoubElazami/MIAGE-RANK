require("dotenv").config();
const sequelize = require("../config/db");
const { Challenge, User } = require("../models");
async function redistributeChallenges() {
    try {
        console.log("🔄 Redistribution des défis aux admins...");
        const admins = await User.findAll({
            where: { role: 'admin' },
            order: [['id', 'ASC']],
            attributes: ['id', 'name', 'email']
        });
        console.log(`\n📊 Total d'admins: ${admins.length}`);
        if (admins.length === 0) {
            console.log("❌ Aucun admin trouvé dans la base de données");
            process.exit(1);
        }
        const allChallenges = await Challenge.findAll({
            order: [['id', 'ASC']],
            attributes: ['id', 'title', 'createdBy']
        });
        console.log(`📊 Total de défis: ${allChallenges.length}`);
        console.log("\n📋 Répartition actuelle:");
        for (const admin of admins) {
            const count = await Challenge.count({
                where: { createdBy: admin.id }
            });
            console.log(`   ${admin.name} (ID: ${admin.id}): ${count} défis`);
        }
        const challengesPerAdmin = Math.ceil(allChallenges.length / admins.length);
        console.log(`\n🎯 Objectif: ~${challengesPerAdmin} défis par admin`);
        let adminIndex = 0;
        let redistributed = 0;
        for (const challenge of allChallenges) {
            if (!challenge.createdBy || challenge.createdBy === 1) {
                const targetAdmin = admins[adminIndex % admins.length];
                await Challenge.update(
                    { createdBy: targetAdmin.id },
                    { where: { id: challenge.id } }
                );
                redistributed++;
                adminIndex++;
                if (redistributed % 5 === 0) {
                    console.log(`   ${redistributed} défis redistribués...`);
                }
            }
        }
        console.log(`\n✅ ${redistributed} défis redistribués`);
        console.log("\n📊 Nouvelle répartition:");
        for (const admin of admins) {
            const count = await Challenge.count({
                where: { createdBy: admin.id }
            });
            const challenges = await Challenge.findAll({
                where: { createdBy: admin.id },
                attributes: ['id', 'title'],
                limit: 3
            });
            console.log(`   ${admin.name} (ID: ${admin.id}): ${count} défis`);
            if (challenges.length > 0) {
                challenges.forEach(c => {
                    console.log(`      - ${c.title}`);
                });
                if (count > 3) {
                    console.log(`      ... et ${count - 3} autres`);
                }
            }
        }
        console.log("\n🎉 Redistribution terminée avec succès!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur:", error.message);
        console.error("Stack:", error.stack);
        process.exit(1);
    }
}
redistributeChallenges();