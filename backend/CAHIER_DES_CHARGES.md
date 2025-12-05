# Cahier des Charges - Backend MiageRank

## 📋 Vue d'ensemble

**Projet:** Système de gamification avec classement en temps réel  
**Type:** API REST + WebSocket  
**Technologies:** Node.js, Express.js, Sequelize, MySQL, Socket.io, JWT  
**Date:** 2024

---

## 🎯 Objectifs du projet

Développer une API backend complète pour un système de gamification permettant :
- La gestion d'équipes et de leurs membres
- La création et gestion de défis
- Le suivi des scores et leur validation
- Un classement en temps réel avec mise à jour automatique
- Une authentification sécurisée
- Des statistiques et analyses

---

## 🏗️ Architecture technique

### Stack technologique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Runtime | Node.js | v14+ |
| Framework | Express.js | ^5.2.1 |
| ORM | Sequelize | ^6.37.7 |
| Base de données | MySQL | v8+ |
| Authentification | JWT (jsonwebtoken) | ^9.0.3 |
| Hashage | bcrypt | ^6.0.0 |
| WebSocket | Socket.io | Latest |
| Validation | express-validator | Latest |
| CORS | cors | Latest |

### Structure du projet

```
backend/
├── config/
│   └── db.js                    # Configuration base de données
├── controllers/
│   ├── authController.js        # Authentification
│   ├── teamController.js        # Gestion équipes
│   ├── challengeController.js   # Gestion défis
│   ├── scoreController.js       # Gestion scores
│   └── rankingController.js     # Classements
├── middleware/
│   ├── authMiddleware.js       # Vérification JWT
│   ├── validation.js            # Validation données
│   └── errorHandler.js          # Gestion erreurs
├── models/
│   ├── User.js                  # Modèle utilisateur
│   ├── Team.js                  # Modèle équipe
│   ├── Challenge.js             # Modèle défi
│   ├── Score.js                 # Modèle score
│   ├── TeamMember.js            # Modèle membre équipe
│   └── index.js                 # Relations & synchronisation
├── routes/
│   ├── authRoutes.js            # Routes authentification
│   ├── teamRoutes.js            # Routes équipes
│   ├── challengeRoutes.js       # Routes défis
│   ├── scoreRoutes.js           # Routes scores
│   └── rankingRoutes.js         # Routes classements
├── services/
│   └── socketService.js         # Service WebSocket
└── app.js                       # Application principale
```

---

## 📊 Modèle de données

### 1. User (Utilisateur)
**Table:** `Users`

| Champ | Type | Contraintes |
|-------|------|-------------|
| id | INTEGER | PK, Auto-increment |
| name | STRING | NOT NULL |
| email | STRING | NOT NULL, UNIQUE |
| password | STRING | NOT NULL (hashé) |
| createdAt | DATETIME | Auto |
| updatedAt | DATETIME | Auto |

**Relations:**
- Many-to-Many avec Team (via TeamMember)
- One-to-Many avec Score (validatedBy)

---

### 2. Team (Équipe)
**Table:** `Teams`

| Champ | Type | Contraintes |
|-------|------|-------------|
| id | INTEGER | PK, Auto-increment |
| name | STRING | NOT NULL, UNIQUE |
| description | TEXT | Nullable |
| color | STRING | Hex color (#RRGGBB) |
| logo | STRING | URL, Nullable |
| totalScore | INTEGER | DEFAULT 0 |
| rank | INTEGER | DEFAULT 0 |
| isActive | BOOLEAN | DEFAULT true |
| createdAt | DATETIME | Auto |
| updatedAt | DATETIME | Auto |

**Index:**
- totalScore (pour classement)
- rank (pour classement)
- isActive (pour filtrage)

**Relations:**
- Many-to-Many avec User (via TeamMember)
- One-to-Many avec Score

---

### 3. Challenge (Défi)
**Table:** `Challenges`

| Champ | Type | Contraintes |
|-------|------|-------------|
| id | INTEGER | PK, Auto-increment |
| title | STRING | NOT NULL (3-100 chars) |
| description | TEXT | NOT NULL |
| category | ENUM | technique, creativite, collaboration, innovation, autre |
| points | INTEGER | DEFAULT 10 (1-1000) |
| difficulty | ENUM | facile, moyen, difficile, expert |
| startDate | DATETIME | NOT NULL |
| endDate | DATETIME | Nullable |
| isActive | BOOLEAN | DEFAULT true |
| maxTeams | INTEGER | Nullable |
| requirements | JSON | Nullable |
| createdAt | DATETIME | Auto |
| updatedAt | DATETIME | Auto |

**Index:**
- isActive
- category
- startDate, endDate

**Relations:**
- One-to-Many avec Score

---

### 4. Score
**Table:** `Scores`

| Champ | Type | Contraintes |
|-------|------|-------------|
| id | INTEGER | PK, Auto-increment |
| TeamId | INTEGER | FK → Teams.id |
| ChallengeId | INTEGER | FK → Challenges.id |
| points | INTEGER | NOT NULL (≥0) |
| bonus | INTEGER | DEFAULT 0 |
| totalPoints | INTEGER | DEFAULT 0 (points + bonus) |
| status | ENUM | pending, validated, rejected |
| validatedAt | DATETIME | Nullable |
| validatedBy | INTEGER | FK → Users.id, Nullable |
| notes | TEXT | Nullable |
| createdAt | DATETIME | Auto |
| updatedAt | DATETIME | Auto |

**Index:**
- status
- totalPoints
- TeamId
- ChallengeId

**Relations:**
- Many-to-One avec Team
- Many-to-One avec Challenge
- Many-to-One avec User (validator)

---

### 5. TeamMember (Membre d'équipe)
**Table:** `TeamMembers`

| Champ | Type | Contraintes |
|-------|------|-------------|
| id | INTEGER | PK, Auto-increment |
| TeamId | INTEGER | FK → Teams.id |
| UserId | INTEGER | FK → Users.id |
| role | ENUM | leader, member |
| joinedAt | DATETIME | DEFAULT NOW |
| createdAt | DATETIME | Auto |
| updatedAt | DATETIME | Auto |

**Contraintes:**
- UNIQUE(TeamId, UserId) - Un utilisateur ne peut être qu'une fois dans une équipe

**Index:**
- TeamId
- UserId
- role

---

## 🔐 Authentification & Sécurité

### JWT (JSON Web Token)
- **Algorithme:** HS256
- **Durée de vie:** 24 heures
- **Secret:** Variable d'environnement `JWT_SECRET`

### Hashage des mots de passe
- **Algorithme:** bcrypt
- **Salt rounds:** 10

### Middleware d'authentification
- Vérification du token dans le header `Authorization: Bearer TOKEN`
- Extraction de l'utilisateur depuis la base de données
- Ajout de `req.user` pour les routes protégées

### Routes protégées
Toutes les routes nécessitant une authentification sont marquées avec le middleware `authenticateToken`.

---

## 📡 API Endpoints

### Authentification (`/api/auth`)
- `POST /register` - Inscription
- `POST /login` - Connexion

### Équipes (`/api/teams`)
- `GET /` - Liste des équipes (pagination, recherche, filtres)
- `GET /:id` - Détails d'une équipe
- `POST /` - Créer une équipe (🔒)
- `PUT /:id` - Modifier une équipe (🔒 Leader)
- `POST /:id/members` - Ajouter un membre (🔒 Leader)
- `DELETE /:id/members/:memberId` - Retirer un membre (🔒 Leader)
- `DELETE /:id` - Supprimer une équipe (🔒 Leader)

### Défis (`/api/challenges`)
- `GET /` - Liste des défis (pagination, filtres)
- `GET /active` - Défis actifs uniquement
- `GET /:id` - Détails d'un défi
- `POST /` - Créer un défi (🔒)
- `PUT /:id` - Modifier un défi (🔒)
- `DELETE /:id` - Supprimer un défi (🔒)

### Scores (`/api/scores`)
- `GET /` - Liste des scores (pagination, filtres)
- `GET /:id` - Détails d'un score
- `POST /submit` - Soumettre un score (🔒)
- `PUT /:id/validate` - Valider/Rejeter un score (🔒)

### Classements (`/api/ranking`)
- `GET /` - Classement général
- `GET /category/:category` - Classement par catégorie
- `GET /statistics` - Statistiques globales
- `GET /history` - Historique des classements

### Utilisateurs (`/api/users`)
- `GET /` - Liste des utilisateurs (🔒)

---

## 🔄 WebSocket (Socket.io)

### Événements émis par le serveur

1. **ranking:update**
   - Émis lors de la mise à jour du classement
   - Room: `ranking`
   - Données: Classement complet

2. **team:update**
   - Émis lors de la mise à jour d'une équipe
   - Room: `team:{teamId}`
   - Données: Données de l'équipe

3. **challenge:update**
   - Émis lors de la mise à jour d'un défi
   - Room: `challenge:{challengeId}`
   - Données: Données du défi

4. **notification**
   - Notification générale
   - Room: Tous les clients
   - Données: Message et type

5. **ranking:refresh**
   - Demande de rafraîchissement du classement
   - Room: `ranking`

### Événements reçus par le serveur

1. **join:ranking** - Rejoindre la room du classement
2. **join:team** - Rejoindre la room d'une équipe
3. **join:challenge** - Rejoindre la room d'un défi

---

## ✅ Validation des données

### Middleware de validation
Utilisation de `express-validator` pour valider toutes les entrées.

### Validations implémentées

**Équipes:**
- Nom: 2-50 caractères
- Description: max 500 caractères
- Couleur: Format hexadécimal (#RRGGBB)

**Défis:**
- Titre: 3-100 caractères
- Description: Requis
- Catégorie: Enum (technique, creativite, collaboration, innovation, autre)
- Points: 1-1000
- Difficulté: Enum (facile, moyen, difficile, expert)
- Dates: Format ISO8601

**Scores:**
- Points: Entier positif
- Bonus: Entier positif
- Notes: max 500 caractères

**Pagination:**
- Page: Entier positif
- Limit: 1-100

---

## 🛡️ Gestion des erreurs

### Gestionnaire centralisé
Toutes les erreurs sont gérées par `errorHandler.js`.

### Types d'erreurs gérées

1. **SequelizeValidationError** → 400 Bad Request
2. **SequelizeUniqueConstraintError** → 409 Conflict
3. **SequelizeForeignKeyConstraintError** → 400 Bad Request
4. **JsonWebTokenError** → 401 Unauthorized
5. **TokenExpiredError** → 401 Unauthorized
6. **Erreurs personnalisées** → Status code défini
7. **Erreurs par défaut** → 500 Internal Server Error

### Format des réponses d'erreur
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": [...] // Détails pour validation
}
```

---

## 📈 Fonctionnalités avancées

### 1. Classement automatique
- Calcul automatique du `totalScore` de chaque équipe
- Mise à jour automatique du `rank` lors de la validation d'un score
- Tri par score décroissant, puis par ID croissant

### 2. Mise à jour en temps réel
- Émission d'événements WebSocket lors de:
  - Validation d'un score
  - Mise à jour d'une équipe
  - Modification d'un défi

### 3. Statistiques
- Nombre total d'équipes
- Top 3 équipes
- Nombre total de défis
- Nombre total de scores validés
- Points totaux distribués
- Défis les plus populaires

### 4. Historique
- Suivi de l'évolution des scores sur une période
- Données formatées pour graphiques
- Groupement par date et équipe

### 5. Recherche et filtres
- Recherche textuelle (nom, description)
- Filtres par statut (isActive)
- Filtres par catégorie
- Filtres par difficulté
- Filtres par date

### 6. Pagination
- Pagination sur toutes les listes
- Paramètres: `page`, `limit`
- Réponse inclut métadonnées de pagination

---

## 🔧 Configuration

### Variables d'environnement (.env)

```env
# Base de données
DB_NAME=MIAGERANK
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

# JWT
JWT_SECRET=votre_secret_key_super_securisee

# Serveur
PORT=4000
NODE_ENV=development

# Frontend (CORS)
FRONTEND_URL=http://localhost:3000
```

---

## 📦 Dépendances

### Production
- `express` - Framework web
- `sequelize` - ORM
- `mysql2` - Driver MySQL
- `jsonwebtoken` - JWT
- `bcrypt` - Hashage
- `socket.io` - WebSocket
- `cors` - CORS
- `express-validator` - Validation
- `dotenv` - Variables d'environnement

### Développement
- `nodemon` - Auto-reload

---

## 🚀 Déploiement

### Prérequis
- Node.js v14+
- MySQL v8+
- npm ou yarn

### Installation
```bash
npm install
```

### Configuration
1. Copier `.env.example` vers `.env`
2. Configurer les variables d'environnement
3. Créer la base de données MySQL

### Démarrage
```bash
npm start
```

### Production
- Utiliser `NODE_ENV=production`
- Configurer un secret JWT fort
- Utiliser HTTPS
- Configurer CORS correctement

---

## 📊 Performance

### Optimisations
- Index sur les colonnes fréquemment utilisées
- Pagination pour limiter les résultats
- Requêtes optimisées avec Sequelize
- Pool de connexions MySQL configuré

### Pool de connexions MySQL
- Max: 5 connexions
- Min: 0 connexions
- Acquire: 30000ms
- Idle: 10000ms

---

## 🔒 Sécurité

### Mesures implémentées
- ✅ Hashage des mots de passe (bcrypt)
- ✅ Authentification JWT
- ✅ Validation des entrées utilisateur
- ✅ Protection contre les injections SQL (Sequelize)
- ✅ Gestion des erreurs sans exposer les détails
- ✅ CORS configuré
- ✅ Headers de sécurité (à ajouter en production)

### Recommandations production
- Utiliser HTTPS
- Rate limiting
- Helmet.js pour headers de sécurité
- Validation stricte des entrées
- Logging des actions sensibles
- Rotation des secrets JWT

---

## 📝 Documentation

### Fichiers de documentation créés
1. `README.md` - Guide d'installation et utilisation
2. `API_DOCUMENTATION.md` - Documentation complète de l'API
3. `GUIDE_POSTMAN.md` - Guide de test avec Postman
4. `TEST_COMPLET_POSTMAN.md` - Guide de test exhaustif
5. `CAHIER_DES_CHARGES.md` - Ce document

---

## ✅ Checklist de fonctionnalités

### Authentification
- [x] Inscription (register)
- [x] Connexion (login)
- [x] Génération de token JWT
- [x] Vérification de token
- [x] Hashage des mots de passe

### Gestion des équipes
- [x] Création d'équipe
- [x] Liste des équipes (pagination)
- [x] Détails d'une équipe
- [x] Modification d'équipe
- [x] Ajout de membre
- [x] Retrait de membre
- [x] Suppression d'équipe
- [x] Recherche et filtres

### Gestion des défis
- [x] Création de défi
- [x] Liste des défis (pagination)
- [x] Défis actifs
- [x] Détails d'un défi
- [x] Modification de défi
- [x] Suppression de défi
- [x] Filtres par catégorie/difficulté

### Gestion des scores
- [x] Soumission de score
- [x] Liste des scores (pagination)
- [x] Détails d'un score
- [x] Validation de score
- [x] Rejet de score
- [x] Calcul automatique du total
- [x] Mise à jour du score d'équipe

### Classements
- [x] Classement général
- [x] Classement par catégorie
- [x] Statistiques globales
- [x] Historique des classements
- [x] Mise à jour automatique des rangs

### WebSocket
- [x] Connexion Socket.io
- [x] Rooms (ranking, team, challenge)
- [x] Émission d'événements
- [x] Mise à jour en temps réel

### Validation & Erreurs
- [x] Validation des données
- [x] Gestion centralisée des erreurs
- [x] Messages d'erreur clairs
- [x] Codes HTTP appropriés

### Base de données
- [x] Modèles Sequelize
- [x] Relations entre modèles
- [x] Synchronisation automatique
- [x] Index pour performance
- [x] Contraintes d'intégrité

---

## 🎯 Résultats

### Fonctionnalités livrées
✅ API REST complète avec 20+ endpoints  
✅ Authentification JWT sécurisée  
✅ Gestion complète CRUD pour équipes, défis, scores  
✅ Classement en temps réel avec WebSocket  
✅ Validation des données  
✅ Gestion d'erreurs professionnelle  
✅ Documentation complète  
✅ Structure modulaire et maintenable  

### Points forts
- Architecture propre et modulaire
- Code bien organisé et commenté
- Sécurité implémentée (JWT, bcrypt)
- Performance optimisée (index, pagination)
- Temps réel avec WebSocket
- Documentation exhaustive
- Gestion d'erreurs robuste

---

## 📞 Support

Pour toute question ou problème, consulter:
- `README.md` - Guide d'installation
- `API_DOCUMENTATION.md` - Documentation API
- `TEST_COMPLET_POSTMAN.md` - Guide de test

---

**Version:** 1.0.0  
**Date:** 2024  
**Auteur:** MiageRank Team

