# Documentation API - MiageRank

## Base URL
```
http://localhost:4000/api
```

## Authentification

La plupart des routes nécessitent un token JWT dans le header `Authorization`:
```
Authorization: Bearer VOTRE_TOKEN_JWT
```

---

## 🔐 Authentification

### POST /auth/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/login
Connexion d'un utilisateur

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## 👥 Équipes

### GET /teams
Récupérer toutes les équipes (pagination disponible)

**Query params:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 10)
- `search` (optionnel): Recherche par nom ou description
- `isActive` (optionnel): Filtrer par statut actif (true/false)

**Réponse:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### GET /teams/:id
Récupérer une équipe par ID

### POST /teams
Créer une nouvelle équipe (🔒 Authentifié)

**Body:**
```json
{
  "name": "Équipe Alpha",
  "description": "Description de l'équipe",
  "color": "#3B82F6",
  "logo": "url_du_logo"
}
```

### PUT /teams/:id
Mettre à jour une équipe (🔒 Authentifié - Leader uniquement)

### POST /teams/:id/members
Ajouter un membre à une équipe (🔒 Authentifié - Leader uniquement)

**Body:**
```json
{
  "userId": 2
}
```

### DELETE /teams/:id/members/:memberId
Retirer un membre d'une équipe (🔒 Authentifié - Leader uniquement)

### DELETE /teams/:id
Supprimer une équipe (🔒 Authentifié - Leader uniquement)

---

## 🎯 Défis

### GET /challenges
Récupérer tous les défis

**Query params:**
- `page`, `limit`: Pagination
- `category`: Filtrer par catégorie (technique, creativite, collaboration, innovation, autre)
- `isActive`: Filtrer par statut actif
- `difficulty`: Filtrer par difficulté (facile, moyen, difficile, expert)

### GET /challenges/active
Récupérer tous les défis actifs

### GET /challenges/:id
Récupérer un défi par ID

### POST /challenges
Créer un nouveau défi (🔒 Authentifié)

**Body:**
```json
{
  "title": "Défi Innovation",
  "description": "Description du défi",
  "category": "innovation",
  "points": 50,
  "difficulty": "moyen",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.000Z",
  "maxTeams": 10,
  "requirements": {
    "minMembers": 2,
    "maxMembers": 5
  }
}
```

### PUT /challenges/:id
Mettre à jour un défi (🔒 Authentifié)

### DELETE /challenges/:id
Supprimer un défi (🔒 Authentifié)

---

## 📊 Scores

### GET /scores
Récupérer tous les scores

**Query params:**
- `page`, `limit`: Pagination
- `status`: Filtrer par statut (pending, validated, rejected)
- `teamId`: Filtrer par équipe
- `challengeId`: Filtrer par défi

### GET /scores/:id
Récupérer un score par ID

### POST /scores/submit
Soumettre un score pour un défi (🔒 Authentifié)

**Body:**
```json
{
  "challengeId": 1,
  "teamId": 1,
  "points": 45,
  "bonus": 5,
  "notes": "Notes optionnelles"
}
```

### PUT /scores/:id/validate
Valider ou rejeter un score (🔒 Authentifié)

**Body:**
```json
{
  "status": "validated",
  "notes": "Score validé avec succès"
}
```

---

## 🏆 Classement

### GET /ranking
Récupérer le classement général

**Query params:**
- `limit`: Limiter le nombre de résultats (ex: top 10)

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "team": {
        "id": 1,
        "name": "Équipe Alpha",
        "color": "#3B82F6",
        "logo": "...",
        "membersCount": 5
      },
      "totalScore": 1250,
      "validatedScores": 12,
      "lastUpdate": "2024-01-15T10:30:00.000Z"
    }
  ],
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### GET /ranking/category/:category
Récupérer le classement par catégorie

**Categories:** technique, creativite, collaboration, innovation, autre

### GET /ranking/statistics
Récupérer les statistiques globales

**Réponse:**
```json
{
  "success": true,
  "data": {
    "teams": {
      "total": 15,
      "top3": [...]
    },
    "challenges": {
      "total": 8
    },
    "scores": {
      "total": 45,
      "totalPoints": 12500
    },
    "popularChallenges": [...]
  }
}
```

### GET /ranking/history
Récupérer l'historique des classements

**Query params:**
- `days`: Nombre de jours à récupérer (défaut: 30)

---

## 🔌 WebSocket (Socket.io)

### Connexion
```javascript
const socket = io("http://localhost:4000");
```

### Événements disponibles

#### Rejoindre une room
```javascript
socket.emit("join:ranking");           // Rejoindre le classement
socket.emit("join:team", teamId);       // Rejoindre une équipe
socket.emit("join:challenge", challengeId); // Rejoindre un défi
```

#### Écouter les mises à jour
```javascript
socket.on("ranking:update", (data) => {
  console.log("Classement mis à jour:", data);
});

socket.on("team:update", (data) => {
  console.log("Équipe mise à jour:", data);
});

socket.on("challenge:update", (data) => {
  console.log("Défi mis à jour:", data);
});

socket.on("notification", (data) => {
  console.log("Notification:", data.message);
});

socket.on("ranking:refresh", () => {
  // Forcer le rafraîchissement du classement
});
```

---

## 📝 Codes de statut HTTP

- `200`: Succès
- `201`: Créé avec succès
- `400`: Erreur de validation
- `401`: Non authentifié
- `403`: Accès interdit
- `404`: Ressource non trouvée
- `409`: Conflit (ex: email déjà utilisé)
- `500`: Erreur serveur

---

## 🔒 Routes protégées

Les routes marquées avec 🔒 nécessitent un token JWT valide dans le header `Authorization`.

---

## ⚠️ Gestion des erreurs

Toutes les erreurs suivent ce format:
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": [...] // Détails des erreurs de validation
}
```

