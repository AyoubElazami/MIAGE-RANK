require("dotenv").config();
const sequelize = require("../config/db");
const Challenge = require("../models/Challenge");
const challenges = [
    {
        title: "Premier Pas en Programmation",
        description: "Créez votre premier programme 'Hello World' dans le langage de votre choix. Partagez une capture d'écran ou un lien vers votre code.",
        category: "technique",
        points: 50,
        difficulty: "facile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            languages: ["JavaScript", "Python", "Java", "C++", "Autre"],
            deliverable: "code_source_ou_capture"
        }
    },
    {
        title: "API REST Créative",
        description: "Développez une API REST complète avec au moins 3 endpoints (GET, POST, PUT/DELETE). Documentez votre API avec Swagger ou Postman.",
        category: "technique",
        points: 200,
        difficulty: "moyen",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            endpoints: 3,
            methods: ["GET", "POST", "PUT", "DELETE"],
            documentation: true
        }
    },
    {
        title: "Architecture Microservices",
        description: "Concevez et implémentez une architecture microservices avec au moins 3 services communicant via une API Gateway. Incluez la gestion des erreurs et la documentation.",
        category: "technique",
        points: 500,
        difficulty: "difficile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: 5,
        requirements: {
            services: 3,
            gateway: true,
            communication: "async_recommandé"
        }
    },
    {
        title: "Système Distribué Scalable",
        description: "Créez un système distribué capable de gérer 10,000+ requêtes/seconde avec load balancing, cache distribué (Redis), et monitoring en temps réel. Déployez sur cloud (AWS/Azure/GCP).",
        category: "technique",
        points: 1000,
        difficulty: "expert",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: 3,
        requirements: {
            performance: "10000_req_sec",
            technologies: ["LoadBalancer", "Cache", "Monitoring", "Cloud"],
            deployment: "production_ready"
        }
    },
    {
        title: "Design de Logo Original",
        description: "Créez un logo original et moderne pour MiageRank. Le logo doit être vectoriel, utilisable en différentes tailles, et refléter l'esprit de compétition et de collaboration.",
        category: "creativite",
        points: 75,
        difficulty: "facile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            format: "SVG_recommandé",
            sizes: ["favicon", "header", "print"],
            colors: "max_3_couleurs"
        }
    },
    {
        title: "Vidéo de Présentation Équipe",
        description: "Réalisez une vidéo créative de 2-3 minutes présentant votre équipe, vos compétences, et votre vision du projet. Montage professionnel requis avec musique et effets.",
        category: "creativite",
        points: 250,
        difficulty: "moyen",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            duration: "2-3_minutes",
            quality: "HD_1080p",
            elements: ["presentation", "montage", "musique"]
        }
    },
    {
        title: "Expérience Utilisateur Immersive",
        description: "Concevez et prototypiez une expérience utilisateur innovante pour une application mobile ou web. Incluez wireframes, user flow, prototype interactif (Figma/Adobe XD), et test utilisateur.",
        category: "creativite",
        points: 600,
        difficulty: "difficile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: 4,
        requirements: {
            deliverables: ["wireframes", "user_flow", "prototype", "tests"],
            tools: ["Figma", "Adobe XD", "Sketch"]
        }
    },
    {
        title: "Projet Artistique Multimédia",
        description: "Créez une œuvre d'art interactive combinant programmation, design graphique, animation, et son. L'œuvre doit être accessible en ligne et réagir aux interactions utilisateur.",
        category: "creativite",
        points: 1000,
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
        title: "Organisation d'un Event Team",
        description: "Organisez un événement team building (virtuel ou présentiel) pour votre équipe. Documentez l'événement avec photos/vidéos et un retour d'expérience.",
        category: "collaboration",
        points: 80,
        difficulty: "facile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            participants: "min_5_personnes",
            documentation: ["photos", "video", "feedback"],
            duration: "min_2_heures"
        }
    },
    {
        title: "Projet Open Source Collaboratif",
        description: "Contribuez à un projet open source existant ou créez-en un nouveau avec au moins 5 contributions significatives de membres différents de l'équipe. Documentez le processus de collaboration.",
        category: "collaboration",
        points: 300,
        difficulty: "moyen",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            contributions: 5,
            contributors: "min_3_personnes",
            documentation: true,
            github: true
        }
    },
    {
        title: "Hackathon Inter-Équipes",
        description: "Organisez et participez à un hackathon de 24h impliquant au moins 3 équipes. Créez un projet complet en collaboration avec d'autres équipes. Documentez toute l'organisation.",
        category: "collaboration",
        points: 700,
        difficulty: "difficile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: 6,
        requirements: {
            duration: "24_heures",
            teams: "min_3",
            project: "complet_et_fonctionnel",
            documentation: "complete"
        }
    },
    {
        title: "Partnership Stratégique Multi-Équipes",
        description: "Formez une alliance avec au moins 2 autres équipes pour créer un projet ambitieux sur 2 semaines. Définissez une stratégie, répartissez les rôles, livrez un produit final complet avec documentation et présentation commune.",
        category: "collaboration",
        points: 1000,
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
        title: "Solution Éco-Responsable",
        description: "Proposez une solution simple mais innovante pour réduire l'impact environnemental d'un processus quotidien. Présentez-la avec un prototype basique ou un mockup.",
        category: "innovation",
        points: 100,
        difficulty: "facile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            focus: "environmental_impact",
            deliverable: "prototype_ou_mockup",
            presentation: true
        }
    },
    {
        title: "IA pour Automatisation",
        description: "Développez une solution utilisant l'intelligence artificielle (ML/Deep Learning) pour automatiser une tâche répétitive. Incluez un modèle entraîné, une API, et une démo fonctionnelle.",
        category: "innovation",
        points: 400,
        difficulty: "moyen",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            technology: "AI/ML",
            model: "trained",
            api: true,
            demo: true
        }
    },
    {
        title: "Blockchain Application Réelle",
        description: "Créez une application blockchain (Ethereum, Solana, ou autre) résolvant un problème réel. Incluez smart contracts, interface utilisateur, et documentation complète du système.",
        category: "innovation",
        points: 800,
        difficulty: "difficile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: 3,
        requirements: {
            blockchain: true,
            smart_contracts: true,
            ui: true,
            real_world_problem: true
        }
    },
    {
        title: "Technologie Révolutionnaire",
        description: "Concevez et prototypiez une technologie novatrice (IoT, AR/VR, Quantum Computing, etc.) avec démo fonctionnelle, business plan, et potentiel commercial réel. Présentation devant jury requis.",
        category: "innovation",
        points: 1000,
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
        title: "Documentation Complète de Projet",
        description: "Rédigez une documentation professionnelle complète pour un projet existant ou nouveau. Incluez README, guide d'installation, API docs, architecture, et guides utilisateur.",
        category: "autre",
        points: 60,
        difficulty: "facile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            sections: ["README", "installation", "API", "architecture", "user_guide"],
            quality: "professional"
        }
    },
    {
        title: "Série de Tutoriels Vidéo",
        description: "Créez une série de 5+ tutoriels vidéo de qualité professionnelle sur un sujet technique. Chaque vidéo doit durer 10-15 minutes avec audio clair et sous-titres.",
        category: "autre",
        points: 350,
        difficulty: "moyen",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            videos: "min_5",
            duration: "10-15_min",
            quality: "HD_1080p",
            subtitles: true
        }
    },
    {
        title: "Formation Complète en Ligne",
        description: "Développez un cours en ligne complet (MOOC) avec vidéos, exercices interactifs, quiz, et certification. Le cours doit couvrir un sujet complet avec progression pédagogique claire.",
        category: "autre",
        points: 900,
        difficulty: "difficile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: 2,
        requirements: {
            modules: "min_5",
            content: ["videos", "exercises", "quizzes", "certification"],
            platform: "online_accessible"
        }
    },
    {
        title: "Transformation Digitale Complète",
        description: "Menez un projet complet de transformation digitale pour une organisation (réelle ou fictive). Incluez audit, stratégie, roadmap, implémentation, KPI, et ROI mesurable sur 1 mois.",
        category: "autre",
        points: 1000,
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
    },
    {
        title: "Optimisation de Performance Web",
        description: "Analysez et optimisez les performances d'un site web existant. Réduisez le temps de chargement de 50% minimum. Utilisez Lighthouse, WebPageTest, et documentez toutes les optimisations.",
        category: "technique",
        points: 350,
        difficulty: "moyen",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            improvement: "50_percent_min",
            tools: ["Lighthouse", "WebPageTest"],
            documentation: "complete"
        }
    },
    {
        title: "Application Mobile Cross-Platform",
        description: "Développez une application mobile fonctionnelle avec React Native ou Flutter. L'app doit avoir au moins 3 écrans, gestion d'état, et API backend intégrée.",
        category: "technique",
        points: 450,
        difficulty: "moyen",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            platform: "cross_platform",
            screens: "min_3",
            state_management: true,
            backend: true
        }
    },
    {
        title: "Game Jam 48h",
        description: "Créez un jeu vidéo complet en 48h lors d'un Game Jam. Le jeu doit être jouable, avoir un thème, et être présentable. Utilisez Unity, Godot, ou framework web.",
        category: "creativite",
        points: 500,
        difficulty: "difficile",
        startDate: new Date(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        isActive: true,
        maxTeams: null,
        requirements: {
            duration: "48h",
            playable: true,
            theme: true,
            engine: ["Unity", "Godot", "Web"]
        }
    },
    {
        title: "Analyse de Données avec Visualisation",
        description: "Analysez un dataset intéressant (minimum 10,000 lignes) et créez des visualisations interactives. Présentez vos découvertes avec un dashboard interactif (Tableau, Power BI, D3.js).",
        category: "innovation",
        points: 400,
        difficulty: "moyen",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            dataset: "min_10000_rows",
            visualizations: "interactive",
            dashboard: true,
            insights: true
        }
    },
    {
        title: "Challenge Sécurité et Ethical Hacking",
        description: "Identifiez et corrigez 10+ vulnérabilités de sécurité dans une application fournie. Rédigez un rapport détaillé avec explications et solutions. Bonus pour création de CTF.",
        category: "technique",
        points: 600,
        difficulty: "difficile",
        startDate: new Date(),
        endDate: null,
        isActive: true,
        maxTeams: null,
        requirements: {
            vulnerabilities: "min_10",
            report: "detailed",
            fixes: true,
            bonus: "ctf_creation"
        }
    }
];
async function addChallenges() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connexion à la base de données réussie!");
        await Challenge.sync({ alter: true });
        console.log("✅ Modèle Challenge synchronisé!");
        let added = 0;
        let skipped = 0;
        for (const challengeData of challenges) {
            try {
                const existing = await Challenge.findOne({
                    where: { title: challengeData.title }
                });
                if (!existing) {
                    await Challenge.create(challengeData);
                    added++;
                    console.log(`✅ Défi ajouté: "${challengeData.title}" (${challengeData.category} - ${challengeData.difficulty})`);
                } else {
                    skipped++;
                    console.log(`⏭️  Défi déjà existant: "${challengeData.title}"`);
                }
            } catch (error) {
                console.error(`❌ Erreur pour "${challengeData.title}":`, error.message);
            }
        }
        console.log("\n📊 Résumé:");
        console.log(`✅ ${added} défis ajoutés`);
        console.log(`⏭️  ${skipped} défis déjà existants`);
        console.log(`📝 Total: ${challenges.length} défis traités`);
        console.log("\n📈 Statistiques par catégorie:");
        const categories = ['technique', 'creativite', 'collaboration', 'innovation', 'autre'];
        for (const category of categories) {
            const count = await Challenge.count({ where: { category } });
            console.log(`   ${category}: ${count} défis`);
        }
        console.log("\n📈 Statistiques par difficulté:");
        const difficulties = ['facile', 'moyen', 'difficile', 'expert'];
        for (const difficulty of difficulties) {
            const count = await Challenge.count({ where: { difficulty } });
            console.log(`   ${difficulty}: ${count} défis`);
        }
        console.log("\n🎉 Script terminé avec succès!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout des défis:", error);
        process.exit(1);
    }
}
addChallenges();