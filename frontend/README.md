# Frontend React - MiageRank

Application React moderne et professionnelle pour le système de gamification MiageRank.

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v18+)
- npm installé

### Installation

```bash
# Installer les dépendances
npm install

# Créer le fichier .env (déjà créé normalement)
# VITE_API_URL=http://localhost:4000/api
# VITE_SOCKET_URL=http://localhost:4000

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   └── Layout/
│   ├── pages/               # Pages de l'application
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Admin/
│   │   ├── Teams/
│   │   ├── Challenges/
│   │   ├── Ranking/
│   │   └── Scores/
│   ├── services/            # Services API
│   ├── context/             # Context API
│   ├── utils/               # Utilitaires
│   └── App.jsx
```

## 🎯 Fonctionnalités

### ✅ Authentification
- Page de connexion avec validation
- Page d'inscription
- Gestion du token JWT
- Déconnexion
- Routes protégées

### ✅ Dashboard
- Vue d'ensemble avec statistiques
- Top 5 équipes
- Défis actifs
- Actions rapides

### ✅ Espace Admin
- Dashboard admin avec statistiques complètes
- Gestion des utilisateurs (CRUD)
- Création d'admins/users
- Modification des rôles
- Assignation aux équipes

### ✅ Gestion des Équipes
- Liste des équipes avec recherche
- Détails d'une équipe
- Création d'équipe
- Gestion des membres
- Visualisation des scores

### ✅ Défis
- Liste des défis actifs
- Filtres par catégorie et difficulté
- Détails d'un défi
- Soumission de scores

### ✅ Classement Temps Réel
- Classement général
- Filtrage par catégorie
- Mises à jour automatiques via WebSocket
- Statistiques détaillées

### ✅ Scores
- Soumission de scores
- Validation (admin)
- Historique des scores

## 🔧 Technologies

- **React 19** - Bibliothèque UI
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Socket.io-client** - WebSocket pour temps réel
- **Vite** - Build tool moderne

## 📡 Configuration API

L'application se connecte au backend sur :
- **API** : `http://localhost:4000/api`
- **WebSocket** : `http://localhost:4000`

Configurer dans `.env` :
```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## 🎨 Design

- Design moderne et épuré
- Responsive (Mobile First)
- Animations fluides
- Accessibilité (WCAG 2.1)
- Gradients et couleurs attrayantes

## 📝 Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

## 🚀 Utilisation

1. **Démarrer le backend** (port 4000)
2. **Démarrer le frontend** : `npm run dev` (port 3000)
3. **Ouvrir** `http://localhost:3000`
4. **Créer un compte** ou **se connecter**
5. **Explorer** toutes les fonctionnalités !

## 📦 Dépendances Principales

- `react` & `react-dom` - Framework React
- `react-router-dom` - Routing
- `axios` - HTTP client
- `socket.io-client` - WebSocket
- `zustand` - State management (optionnel)

---

**Développé avec ❤️ pour MiageRank**
