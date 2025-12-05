# Script d'Ajout de Défis

Ce script ajoute automatiquement 25+ défis variés et intéressants dans la base de données, couvrant toutes les catégories et difficultés.

## 📋 Défis Inclus

### Par Catégorie (5 catégories)
- **Technique** : 6 défis (facile à expert + bonus)
- **Créativité** : 5 défis (facile à expert)
- **Collaboration** : 4 défis (facile à expert)
- **Innovation** : 5 défis (facile à expert + bonus)
- **Autre** : 5 défis (facile à expert + bonus)

### Par Difficulté (4 niveaux)
- **Facile** : 5 défis (50-100 points)
- **Moyen** : 7 défis (200-450 points)
- **Difficile** : 7 défis (500-900 points)
- **Expert** : 5 défis (1000-2000 points)

## 🚀 Utilisation

### Option 1 : Exécuter directement

```bash
cd backend
node scripts/addChallenges.js
```

### Option 2 : Via npm script (si ajouté dans package.json)

```bash
cd backend
npm run add-challenges
```

## 📝 Détails des Défis

### Technique
- ✅ Premier Pas en Programmation (Facile - 50pts)
- ✅ API REST Créative (Moyen - 200pts)
- ✅ Architecture Microservices (Difficile - 500pts)
- ✅ Système Distribué Scalable (Expert - 1000pts)
- ✅ Optimisation de Performance Web (Moyen - 350pts)
- ✅ Challenge Sécurité et Ethical Hacking (Difficile - 600pts)

### Créativité
- ✅ Design de Logo Original (Facile - 75pts)
- ✅ Vidéo de Présentation Équipe (Moyen - 250pts)
- ✅ Expérience Utilisateur Immersive (Difficile - 600pts)
- ✅ Projet Artistique Multimédia (Expert - 1200pts)
- ✅ Game Jam 48h (Difficile - 500pts)

### Collaboration
- ✅ Organisation d'un Event Team (Facile - 80pts)
- ✅ Projet Open Source Collaboratif (Moyen - 300pts)
- ✅ Hackathon Inter-Équipes (Difficile - 700pts)
- ✅ Partnership Stratégique Multi-Équipes (Expert - 1500pts)

### Innovation
- ✅ Solution Éco-Responsable (Facile - 100pts)
- ✅ IA pour Automatisation (Moyen - 400pts)
- ✅ Blockchain Application Réelle (Difficile - 800pts)
- ✅ Technologie Révolutionnaire (Expert - 2000pts)
- ✅ Analyse de Données avec Visualisation (Moyen - 400pts)

### Autre
- ✅ Documentation Complète de Projet (Facile - 60pts)
- ✅ Série de Tutoriels Vidéo (Moyen - 350pts)
- ✅ Formation Complète en Ligne (Difficile - 900pts)
- ✅ Transformation Digitale Complète (Expert - 1800pts)
- ✅ Application Mobile Cross-Platform (Moyen - 450pts)

## ⚙️ Configuration

Le script :
- ✅ Vérifie si un défi existe déjà (par titre) pour éviter les doublons
- ✅ Affiche les statistiques par catégorie et difficulté
- ✅ Gère les erreurs proprement
- ✅ Peut être exécuté plusieurs fois sans créer de doublons

## 🔄 Réinitialisation

Si vous voulez supprimer tous les défis existants avant d'ajouter les nouveaux, décommentez cette ligne dans le script :

```javascript
await Challenge.destroy({ where: {}, truncate: true });
```

## 📊 Résultat Attendu

Après l'exécution, vous devriez avoir :
- **25+ défis** dans la base de données
- **Répartition équilibrée** entre toutes les catégories
- **Toutes les difficultés** représentées
- **Défis actifs** prêts à être utilisés

---

**Note** : Certains défis ont des dates de fin définies, d'autres sont ouverts indéfiniment.

