# MiageRank - Backend API

Système de gamification professionnel avec classement en temps réel, gestion d'équipes et défis.

## 🚀 Installation

### Prérequis
- Node.js (v14 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

### Étapes

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer les variables d'environnement**
Copiez `.env.example` vers `.env` et configurez vos variables:
```bash
cp .env.example .env
```

3. **Configurer la base de données**
Assurez-vous que MySQL est démarré et que la base de données `MIAGERANK` existe.

4. **Démarrer le serveur**
```bash
npm start
```

Le serveur démarrera sur `http://localhost:4000`

## 📁 Structure du projet

```
backend/
├── config/
│   └── db.js              # Configuration de la base de données
├── controllers/
│   ├── authController.js   # Authentification (login, register)
│   ├── teamController.js   # Gestion des équipes
│   ├── challengeController.js # Gestion des défis
│   ├── scoreController.js  # Gestion des scores
│   └── rankingController.js # Classements
├── middleware/
│   ├── authMiddleware.js   # Vérification JWT
│   ├── validation.js      # Validation des données
│   └── errorHandler.js    # Gestion des erreurs
├── models/
│   ├── User.js            # Modèle utilisateur
│   ├── Team.js            # Modèle équipe
│   ├── Challenge.js       # Modèle défi
│   ├── Score.js           # Modèle score
│   ├── TeamMember.js      # Modèle membre d'équipe
│   └── index.js           # Relations entre modèles
├── routes/
│   ├── authRoutes.js      # Routes d'authentification
│   ├── teamRoutes.js      # Routes des équipes
│   ├── challengeRoutes.js # Routes des défis
│   ├── scoreRoutes.js     # Routes des scores
│   └── rankingRoutes.js   # Routes des classements
├── services/
│   └── socketService.js   # Service Socket.io pour temps réel
├── utils/
│   └── syncModels.js      # Synchronisation des modèles
├── app.js                 # Application principale
└── package.json
```

## 🔧 Variables d'environnement

Créez un fichier `.env` avec les variables suivantes:

```env
# Base de données
DB_NAME=MIAGERANK
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

# JWT
JWT_SECRET=votre_secret_key_super_securisee_changez_moi

# Serveur
PORT=4000
NODE_ENV=development

# Frontend (pour CORS)
FRONTEND_URL=http://localhost:3000
```

## 📡 API Endpoints

Voir [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) pour la documentation complète de l'API.

### Principales routes:
- `/api/auth` - Authentification
- `/api/teams` - Gestion des équipes
- `/api/challenges` - Gestion des défis
- `/api/scores` - Gestion des scores
- `/api/ranking` - Classements

## 🔌 WebSocket (Socket.io)

Le serveur utilise Socket.io pour les mises à jour en temps réel:

```javascript
const socket = io("http://localhost:4000");

// Rejoindre le classement
socket.emit("join:ranking");

// Écouter les mises à jour
socket.on("ranking:update", (data) => {
  console.log("Classement mis à jour:", data);
});
```

## 🧪 Tests avec Postman

Voir [GUIDE_POSTMAN.md](./GUIDE_POSTMAN.md) pour un guide complet de test.

## 🔒 Sécurité

- Authentification JWT
- Hashage des mots de passe avec bcrypt
- Validation des données avec express-validator
- Gestion centralisée des erreurs
- CORS configuré

## 📊 Fonctionnalités

✅ Authentification JWT (register, login)
✅ Gestion des équipes (CRUD complet)
✅ Gestion des défis (CRUD complet)
✅ Système de scores avec validation
✅ Classement en temps réel
✅ WebSocket pour mises à jour live
✅ Pagination sur toutes les listes
✅ Recherche et filtres
✅ Statistiques globales
✅ Historique des classements

## 🛠️ Technologies utilisées

- **Express.js** - Framework web
- **Sequelize** - ORM pour MySQL
- **Socket.io** - WebSocket pour temps réel
- **JWT** - Authentification
- **bcrypt** - Hashage des mots de passe
- **express-validator** - Validation des données
- **CORS** - Gestion CORS

## 📝 Scripts disponibles

```bash
npm start      # Démarrer le serveur (avec nodemon)
npm test       # Lancer les tests (à implémenter)
```

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré
- Vérifiez les variables dans `.env`
- Vérifiez que la base de données existe

### Erreur "Table doesn't exist"
- Les tables sont créées automatiquement au démarrage
- Vérifiez les logs pour les erreurs de synchronisation

### Token JWT invalide
- Vérifiez que `JWT_SECRET` est défini dans `.env`
- Le token expire après 24h par défaut

## 📄 Licence

ISC

## 👥 Auteur

MiageRank Team

