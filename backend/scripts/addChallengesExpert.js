require("dotenv").config();
const sequelize = require("../config/db");
const Challenge = require("../models/Challenge");

// Défis experts qui nécessitent plus de 1000 points
const expertChallenges = [
    {
        title: "Projet Artistique Multimédia",
        description: "Créez une œuvre d'art interactive combinant programmation, design graphique, animation, et son. L'œuvre doit être accessible en ligne et réagir aux interactions utilisateur.",
        category: "creativite",
        points: 1000, // Réduit à 1000 pour respecter la limite
        difficulty: "expert",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: 2,
        requirements: {
            media: ["code", "graphics", "animation", "sound"],
            interaction: true,
            online: true
        }
    },
    {
        title: "Partnership Stratégique Multi-Équipes",
        description: "Formez une alliance avec au moins 2 autres équipes pour créer un projet ambitieux sur 2 semaines. Définissez une stratégie, répartissez les rôles, livrez un produit final complet avec documentation et présentation commune.",
        category: "collaboration",
        points: 1000, // Réduit à 1000
        difficulty: "expert",
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        isActive: true,
        maxTeams: 4,
        requirements: {
            teams: "min_3",
            duration: "2_semaines",
            deliverables: ["strategy", "product", "documentation", "presentation"]
        }
    },
    {
        title: "Technologie Révolutionnaire",
        description: "Concevez et prototypiez une technologie novatrice (IoT, AR/VR, Quantum Computing, etc.) avec démo fonctionnelle, business plan, et potentiel commercial réel. Présentation devant jury requis.",
        category: "innovation",
        points: 1000, // Réduit à 1000
        difficulty: "expert",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: 2,
        requirements: {
            technology: "cutting_edge",
            prototype: "functional",
            business_plan: true,
            presentation: "jury_required"
        }
    },
    {
        title: "Transformation Digitale Complète",
        description: "Menez un projet complet de transformation digitale pour une organisation (réelle ou fictive). Incluez audit, stratégie, roadmap, implémentation, KPI, et ROI mesurable sur 1 mois.",
        category: "autre",
        points: 1000, // Réduit à 1000
        difficulty: "expert",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        maxTeams: 1,
        requirements: {
            phases: ["audit", "strategy", "roadmap", "implementation", "measurement"],
            kpi: true,
            roi: "measurable",
            duration: "1_mois"
        }
    }
];

async function addExpertChallenges() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connexion à la base de données réussie!");

        let added = 0;
        let updated = 0;

        for (const challengeData of expertChallenges) {
            try {
                const existing = await Challenge.findOne({
                    where: { title: challengeData.title }
                });

                if (!existing) {
                    await Challenge.create(challengeData);
                    added++;
                    console.log(`✅ Défi ajouté: "${challengeData.title}"`);
                } else {
                    // Mettre à jour les points si le défi existe déjà
                    if (existing.points !== challengeData.points) {
                        await existing.update({ points: challengeData.points });
                        updated++;
                        console.log(`🔄 Défi mis à jour: "${challengeData.title}" (${challengeData.points} points)`);
                    } else {
                        console.log(`⏭️  Défi déjà existant: "${challengeData.title}"`);
                    }
                }
            } catch (error) {
                console.error(`❌ Erreur pour "${challengeData.title}":`, error.message);
            }
        }

        console.log("\n📊 Résumé:");
        console.log(`✅ ${added} défis ajoutés`);
        console.log(`🔄 ${updated} défis mis à jour`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur:", error);
        process.exit(1);
    }
}

addExpertChallenges();

