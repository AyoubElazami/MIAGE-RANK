require("dotenv").config();
const sequelize = require("../config/db");
const User = require("../models/User");
const Challenge = require("../models/Challenge");
const bcrypt = require("bcrypt");
const adminsData = [
    {
        admin: {
            name: "Admin Technique 1",
            email: "admin.technique1@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Développement API REST Avancée",
                description: "Créez une API REST complète avec authentification JWT, gestion des erreurs, documentation Swagger, et tests unitaires. L'API doit gérer au moins 5 ressources différentes.",
                category: "technique",
                points: 300,
                difficulty: "difficile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            },
            {
                title: "Optimisation Base de Données",
                description: "Analysez et optimisez une base de données existante. Créez des index appropriés, normalisez les tables si nécessaire, et documentez les améliorations avec des métriques avant/après.",
                category: "technique",
                points: 250,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Créativité 1",
            email: "admin.creativite1@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Design System Complet",
                description: "Concevez un design system complet avec composants réutilisables, guide de style, palette de couleurs, typographie, et documentation pour les développeurs.",
                category: "creativite",
                points: 400,
                difficulty: "difficile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: { 
            name: "Admin Innovation 1",
            email: "admin.innovation1@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Application IoT Connectée",
                description: "Développez une application IoT qui collecte des données en temps réel depuis des capteurs simulés, les analyse, et fournit un dashboard interactif avec alertes.",
                category: "innovation",
                points: 500,
                difficulty: "difficile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            },
            {
                title: "Chatbot Intelligent",
                description: "Créez un chatbot intelligent utilisant l'IA pour répondre aux questions d'un domaine spécifique. Incluez une interface de chat et des métriques de performance.",
                category: "innovation",
                points: 350,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Collaboration 1",
            email: "admin.collaboration1@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Projet Open Source Contributif",
                description: "Créez ou contribuez à un projet open source avec au moins 10 contributions de qualité de différents membres de l'équipe. Documentez le processus collaboratif.",
                category: "collaboration",
                points: 300,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Technique 2",
            email: "admin.technique2@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Architecture Microservices",
                description: "Concevez et implémentez une architecture microservices avec au moins 3 services, API Gateway, service de découverte, et gestion des erreurs distribuées.",
                category: "technique",
                points: 600,
                difficulty: "expert",
                startDate: new Date(),
                endDate: null,
                isActive: true
            },
            {
                title: "Application Mobile React Native",
                description: "Développez une application mobile complète avec React Native incluant navigation, gestion d'état, intégration API, et publication sur store (ou APK).",
                category: "technique",
                points: 450,
                difficulty: "difficile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    { 
        admin: {
            name: "Admin Créativité 2",
            email: "admin.creativite2@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Vidéo Promo Équipe",
                description: "Créez une vidéo promotionnelle de 3-5 minutes pour votre équipe avec montage professionnel, musique, effets, et sous-titres. Publiez sur YouTube ou Vimeo.",
                category: "creativite",
                points: 250,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Innovation 2",
            email: "admin.innovation2@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Blockchain Smart Contracts",
                description: "Développez des smart contracts sur Ethereum ou une autre blockchain pour une application réelle. Incluez tests, déploiement, et interface utilisateur.",
                category: "innovation",
                points: 700,
                difficulty: "expert",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Collaboration 2",
            email: "admin.collaboration2@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Hackathon 48h Inter-Équipes",
                description: "Organisez et participez à un hackathon de 48h impliquant au moins 3 équipes. Créez un projet complet et documentez toute l'organisation et la collaboration.",
                category: "collaboration",
                points: 500,
                difficulty: "difficile",
                startDate: new Date(),
                endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Technique 3",
            email: "admin.technique3@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Sécurité et Penetration Testing",
                description: "Identifiez et corrigez 15+ vulnérabilités de sécurité dans une application fournie. Rédigez un rapport détaillé avec explications et solutions. Bonus pour création de CTF.",
                category: "technique",
                points: 600,
                difficulty: "difficile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Créativité 3",
            email: "admin.creativite3@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Jeu Vidéo Indépendant",
                description: "Créez un jeu vidéo complet en 2D ou 3D avec Unity, Godot, ou un framework web. Le jeu doit être jouable, avoir un gameplay intéressant, et être présentable.",
                category: "creativite",
                points: 500,
                difficulty: "difficile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            },
            {
                title: "Expérience AR/VR",
                description: "Développez une expérience immersive en réalité augmentée ou virtuelle. Peut être une démo, une application éducative, ou un prototype interactif.",
                category: "creativite",
                points: 550,
                difficulty: "expert",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Innovation 3",
            email: "admin.innovation3@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Système de Recommandation IA",
                description: "Développez un système de recommandation utilisant l'apprentissage automatique. Traitez des données réelles, entraînez un modèle, et évaluez ses performances.",
                category: "innovation",
                points: 450,
                difficulty: "difficile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Autre 1",
            email: "admin.autre1@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Formation Complète en Ligne",
                description: "Créez un cours en ligne complet (MOOC) avec vidéos, exercices interactifs, quiz, et certification. Le cours doit couvrir un sujet complet avec progression pédagogique.",
                category: "autre",
                points: 600,
                difficulty: "difficile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Technique 4",
            email: "admin.technique4@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "CI/CD Pipeline Complet",
                description: "Configurez un pipeline CI/CD complet avec tests automatisés, linting, build, déploiement automatique, et monitoring. Utilisez GitHub Actions, GitLab CI, ou Jenkins.",
                category: "technique",
                points: 350,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Créativité 4",
            email: "admin.creativite4@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Brand Identity Complète",
                description: "Créez une identité de marque complète : logo, palette de couleurs, typographie, guidelines, et application sur différents supports (web, print, mobile).",
                category: "creativite",
                points: 300,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Innovation 4",
            email: "admin.innovation4@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Analyse Prédictive avec ML",
                description: "Analysez un dataset complexe (minimum 50,000 lignes) et créez des modèles prédictifs avec évaluation, visualisations interactives, et dashboard de prédictions.",
                category: "innovation",
                points: 500,
                difficulty: "difficile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            },
            {
                title: "Automation avec RPA",
                description: "Automatisez un processus métier complexe avec RPA (Robotic Process Automation). Documentez le processus, créez le bot, et mesurez les gains de temps.",
                category: "innovation",
                points: 400,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Collaboration 3",
            email: "admin.collaboration3@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Documentation Technique Collaborative",
                description: "Créez une documentation technique complète en collaboration avec plusieurs équipes. Incluez guides, API docs, architecture, et maintenez-la à jour.",
                category: "collaboration",
                points: 250,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Technique 5",
            email: "admin.technique5@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Performance Web Avancée",
                description: "Optimisez un site web existant pour atteindre un score Lighthouse de 95+ sur tous les critères. Documentez toutes les optimisations avec métriques avant/après.",
                category: "technique",
                points: 300,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Créativité 5",
            email: "admin.creativite5@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Animation Interactive Web",
                description: "Créez une animation interactive complexe pour le web utilisant CSS, JavaScript, ou des bibliothèques comme GSAP, Three.js. L'animation doit être fluide et engageante.",
                category: "creativite",
                points: 350,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            },
            {
                title: "Illustration Numérique",
                description: "Créez une série de 5+ illustrations numériques sur un thème cohérent. Utilisez des techniques professionnelles et publiez dans un portfolio en ligne.",
                category: "creativite",
                points: 200,
                difficulty: "facile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Innovation 5",
            email: "admin.innovation5@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Solution Éco-Tech",
                description: "Développez une solution technologique qui réduit l'impact environnemental. Peut être une app, un système, ou un prototype avec mesure de l'impact.",
                category: "innovation",
                points: 400,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    },
    {
        admin: {
            name: "Admin Autre 2",
            email: "admin.autre2@miagerank.fr",
            password: "Admin123!",
            role: "admin"
        },
        challenges: [
            {
                title: "Podcast ou Webinaire Technique",
                description: "Créez une série de 3+ épisodes de podcast ou webinaire sur un sujet technique. Chaque épisode doit durer 15-30 minutes avec contenu de qualité.",
                category: "autre",
                points: 300,
                difficulty: "moyen",
                startDate: new Date(),
                endDate: null,
                isActive: true
            },
            {
                title: "Blog Technique avec Articles",
                description: "Créez un blog technique et publiez 5+ articles de qualité (minimum 1000 mots chacun) sur des sujets techniques pertinents avec exemples de code.",
                category: "autre",
                points: 250,
                difficulty: "facile",
                startDate: new Date(),
                endDate: null,
                isActive: true
            }
        ]
    }
];
async function addAdminsAndChallenges() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connexion à la base de données réussie!");
        await User.sync({ alter: true });
        await Challenge.sync({ alter: true });
        console.log("✅ Modèles synchronisés!");
        let adminsCreated = 0;
        let challengesCreated = 0;
        let adminsSkipped = 0;
        let challengesSkipped = 0;
        for (const adminData of adminsData) {
            try {
                let admin = await User.findOne({
                    where: { email: adminData.admin.email }
                });
                if (!admin) {
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(adminData.admin.password, saltRounds);
                    admin = await User.create({
                        name: adminData.admin.name,
                        email: adminData.admin.email,
                        password: hashedPassword,
                        role: 'admin'
                    });
                    adminsCreated++;
                    console.log(`✅ Admin créé: ${adminData.admin.name}`);
                } else {
                    adminsSkipped++;
                    console.log(`⏭️  Admin déjà existant: ${adminData.admin.name}`);
                }
                for (const challengeData of adminData.challenges) {
                    try {
                        const existing = await Challenge.findOne({
                            where: { 
                                title: challengeData.title,
                                createdBy: admin.id
                            }
                        });
                        if (!existing) {
                            await Challenge.create({
                                ...challengeData,
                                createdBy: admin.id
                            });
                            challengesCreated++;
                            console.log(`  ✅ Défi créé: "${challengeData.title}"`);
                        } else {
                            challengesSkipped++;
                            console.log(`  ⏭️  Défi déjà existant: "${challengeData.title}"`);
                        }
                    } catch (error) {
                        console.error(`  ❌ Erreur pour le défi "${challengeData.title}":`, error.message);
                    }
                }
            } catch (error) {
                console.error(`❌ Erreur pour l'admin "${adminData.admin.name}":`, error.message);
            }
        }
        console.log("\n📊 Résumé:");
        console.log(`✅ ${adminsCreated} admins créés`);
        console.log(`⏭️  ${adminsSkipped} admins déjà existants`);
        console.log(`✅ ${challengesCreated} défis créés`);
        console.log(`⏭️  ${challengesSkipped} défis déjà existants`);
        console.log(`📝 Total: ${adminsData.length} admins traités`);
        console.log("\n📈 Statistiques par admin:");
        const allAdmins = await User.findAll({ where: { role: 'admin' } });
        for (const admin of allAdmins) {
            const challengeCount = await Challenge.count({ where: { createdBy: admin.id } });
            console.log(`   ${admin.name}: ${challengeCount} défis`);
        }
        console.log("\n🎉 Script terminé avec succès!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur:", error);
        process.exit(1);
    }
}
addAdminsAndChallenges();