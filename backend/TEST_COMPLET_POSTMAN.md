# Guide de test complet - Postman

## 📋 Configuration initiale

### Variables d'environnement Postman
Créez un environnement dans Postman avec ces variables :
- `base_url`: `http://localhost:4000`
- `token`: (sera rempli automatiquement après login)

---

## 🔐 1. AUTHENTIFICATION

### 1.1 Inscription (Register)
**Méthode:** `POST`  
**URL:** `{{base_url}}/api/auth/register`

**Body (raw JSON):**
```json
{
  "name": "Admin User",
  "email": "admin@miagerank.com",
  "password": "admin123"
}
```

**Réponse attendue:** 201 Created
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@miagerank.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Action:** Copiez le `token` et sauvegardez-le dans la variable `{{token}}`

---

### 1.2 Connexion (Login)
**Méthode:** `POST`  
**URL:** `{{base_url}}/api/auth/login`

**Body (raw JSON):**
```json
{
  "email": "admin@miagerank.com",
  "password": "admin123"
}
```

**Réponse attendue:** 200 OK
```json
{
  "success": true,
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@miagerank.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Action:** Mettez à jour `{{token}}` avec le nouveau token

---

## 👥 2. GESTION DES ÉQUIPES

### 2.1 Créer une équipe
**Méthode:** `POST`  
**URL:** `{{base_url}}/api/teams`  
**Headers:** `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "name": "Équipe Alpha",
  "description": "La meilleure équipe de développement",
  "color": "#3B82F6",
  "logo": "https://example.com/logo.png"
}
```

**Réponse attendue:** 201 Created

---

### 2.2 Récupérer toutes les équipes
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/teams?page=1&limit=10`

**Query params optionnels:**
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre d'éléments (défaut: 10)
- `search`: Recherche par nom/description
- `isActive`: Filtrer par statut (true/false)

**Réponse attendue:** 200 OK avec pagination

---

### 2.3 Récupérer une équipe par ID
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/teams/1`

**Réponse attendue:** 200 OK avec détails complets de l'équipe

---

### 2.4 Mettre à jour une équipe
**Méthode:** `PUT`  
**URL:** `{{base_url}}/api/teams/1`  
**Headers:** `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "name": "Équipe Alpha Modifiée",
  "description": "Nouvelle description",
  "color": "#FF5733"
}
```

**Réponse attendue:** 200 OK

---

### 2.5 Ajouter un membre à une équipe
**Méthode:** `POST`  
**URL:** `{{base_url}}/api/teams/1/members`  
**Headers:** `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "userId": 2
}
```

**Réponse attendue:** 201 Created

---

### 2.6 Retirer un membre d'une équipe
**Méthode:** `DELETE`  
**URL:** `{{base_url}}/api/teams/1/members/2`  
**Headers:** `Authorization: Bearer {{token}}`

**Réponse attendue:** 200 OK

---

### 2.7 Supprimer une équipe
**Méthode:** `DELETE`  
**URL:** `{{base_url}}/api/teams/1`  
**Headers:** `Authorization: Bearer {{token}}`

**Réponse attendue:** 200 OK

---

## 🎯 3. GESTION DES DÉFIS

### 3.1 Créer un défi
**Méthode:** `POST`  
**URL:** `{{base_url}}/api/challenges`  
**Headers:** `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "title": "Défi Innovation 2024",
  "description": "Créer une solution innovante pour améliorer l'expérience utilisateur",
  "category": "innovation",
  "points": 100,
  "difficulty": "difficile",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z",
  "maxTeams": 10,
  "requirements": {
    "minMembers": 2,
    "maxMembers": 5,
    "technologies": ["React", "Node.js"]
  }
}
```

**Catégories disponibles:** `technique`, `creativite`, `collaboration`, `innovation`, `autre`  
**Difficultés:** `facile`, `moyen`, `difficile`, `expert`

**Réponse attendue:** 201 Created

---

### 3.2 Récupérer tous les défis
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/challenges?page=1&limit=10`

**Query params optionnels:**
- `page`, `limit`: Pagination
- `category`: Filtrer par catégorie
- `isActive`: Filtrer par statut
- `difficulty`: Filtrer par difficulté

**Réponse attendue:** 200 OK

---

### 3.3 Récupérer les défis actifs
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/challenges/active`

**Réponse attendue:** 200 OK avec liste des défis actifs

---

### 3.4 Récupérer un défi par ID
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/challenges/1`

**Réponse attendue:** 200 OK avec détails complets

---

### 3.5 Mettre à jour un défi
**Méthode:** `PUT`  
**URL:** `{{base_url}}/api/challenges/1`  
**Headers:** `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "title": "Défi Innovation 2024 - Mis à jour",
  "points": 150
}
```

**Réponse attendue:** 200 OK

---

### 3.6 Supprimer un défi
**Méthode:** `DELETE`  
**URL:** `{{base_url}}/api/challenges/1`  
**Headers:** `Authorization: Bearer {{token}}`

**Réponse attendue:** 200 OK

---

## 📊 4. GESTION DES SCORES

### 4.1 Soumettre un score
**Méthode:** `POST`  
**URL:** `{{base_url}}/api/scores/submit`  
**Headers:** `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "challengeId": 1,
  "teamId": 1,
  "points": 85,
  "bonus": 10,
  "notes": "Excellent travail d'équipe!"
}
```

**Réponse attendue:** 201 Created

---

### 4.2 Récupérer tous les scores
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/scores?page=1&limit=10`

**Query params optionnels:**
- `page`, `limit`: Pagination
- `status`: Filtrer par statut (`pending`, `validated`, `rejected`)
- `teamId`: Filtrer par équipe
- `challengeId`: Filtrer par défi

**Réponse attendue:** 200 OK

---

### 4.3 Récupérer un score par ID
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/scores/1`

**Réponse attendue:** 200 OK

---

### 4.4 Valider/Rejeter un score
**Méthode:** `PUT`  
**URL:** `{{base_url}}/api/scores/1/validate`  
**Headers:** `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "status": "validated",
  "notes": "Score validé avec succès"
}
```

**Statuts possibles:** `validated`, `rejected`

**Réponse attendue:** 200 OK

**⚠️ Note:** Lorsqu'un score est validé, le classement est automatiquement mis à jour en temps réel via WebSocket.

---

## 🏆 5. CLASSEMENTS

### 5.1 Classement général
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/ranking?limit=10`

**Query params optionnels:**
- `limit`: Limiter le nombre de résultats (ex: top 10)

**Réponse attendue:** 200 OK
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

---

### 5.2 Classement par catégorie
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/ranking/category/innovation?limit=5`

**Catégories:** `technique`, `creativite`, `collaboration`, `innovation`, `autre`

**Réponse attendue:** 200 OK avec classement filtré par catégorie

---

### 5.3 Statistiques globales
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/ranking/statistics`

**Réponse attendue:** 200 OK
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

---

### 5.4 Historique des classements
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/ranking/history?days=30`

**Query params:**
- `days`: Nombre de jours à récupérer (défaut: 30)

**Réponse attendue:** 200 OK avec historique pour graphiques

---

## 👤 6. UTILISATEURS

### 6.1 Récupérer tous les utilisateurs
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/users`  
**Headers:** `Authorization: Bearer {{token}}`

**Réponse attendue:** 200 OK avec liste des utilisateurs

---

## 🔌 7. WEBSOCKET (Socket.io)

### Configuration dans Postman
Postman ne supporte pas nativement WebSocket. Utilisez un client WebSocket séparé ou testez depuis le frontend.

### Événements disponibles:

**Connexion:**
```javascript
const socket = io("http://localhost:4000");
```

**Rejoindre des rooms:**
```javascript
socket.emit("join:ranking");           // Classement général
socket.emit("join:team", teamId);       // Équipe spécifique
socket.emit("join:challenge", challengeId); // Défi spécifique
```

**Écouter les mises à jour:**
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

## 📝 8. ORDRE RECOMMANDÉ DE TEST

1. **Authentification**
   - Register → Login → Sauvegarder le token

2. **Créer des données de base**
   - Créer 2-3 équipes
   - Créer 2-3 défis
   - Ajouter des membres aux équipes

3. **Soumettre des scores**
   - Soumettre des scores pour différents défis
   - Vérifier qu'ils sont en statut "pending"

4. **Valider des scores**
   - Valider quelques scores
   - Vérifier que le classement se met à jour

5. **Consulter les classements**
   - Voir le classement général
   - Voir les classements par catégorie
   - Consulter les statistiques

6. **Tester les mises à jour en temps réel**
   - Utiliser un client WebSocket
   - Valider un score et observer la mise à jour automatique

---

## ✅ Checklist de test complète

- [ ] Register fonctionne
- [ ] Login fonctionne
- [ ] Token JWT est valide
- [ ] Création d'équipe fonctionne
- [ ] Récupération des équipes fonctionne
- [ ] Mise à jour d'équipe fonctionne
- [ ] Ajout de membre fonctionne
- [ ] Création de défi fonctionne
- [ ] Récupération des défis fonctionne
- [ ] Soumission de score fonctionne
- [ ] Validation de score fonctionne
- [ ] Classement se met à jour après validation
- [ ] Statistiques fonctionnent
- [ ] Historique fonctionne
- [ ] WebSocket émet des événements
- [ ] Erreurs sont gérées correctement
- [ ] Validation des données fonctionne
- [ ] Pagination fonctionne
- [ ] Recherche fonctionne
- [ ] Filtres fonctionnent

---

## 🐛 Tests d'erreurs

### Test avec token invalide
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/teams`  
**Headers:** `Authorization: Bearer token_invalide`

**Réponse attendue:** 401 Unauthorized

### Test avec données invalides
**Méthode:** `POST`  
**URL:** `{{base_url}}/api/teams`  
**Body:** `{"name": ""}` (nom vide)

**Réponse attendue:** 400 Bad Request avec erreurs de validation

### Test avec ressource inexistante
**Méthode:** `GET`  
**URL:** `{{base_url}}/api/teams/999`

**Réponse attendue:** 404 Not Found

---

## 💡 Astuces Postman

1. **Créer une collection** avec toutes ces requêtes
2. **Utiliser des variables d'environnement** pour `base_url` et `token`
3. **Créer des scripts de test** pour sauvegarder automatiquement le token après login
4. **Organiser par dossiers** (Auth, Teams, Challenges, etc.)
5. **Utiliser Pre-request Scripts** pour ajouter automatiquement le token

### Script pour sauvegarder le token automatiquement
Dans la requête Login, onglet **Tests**:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
    console.log("Token sauvegardé:", response.token);
}
```

### Pre-request Script pour ajouter le token automatiquement
Dans chaque requête protégée, onglet **Pre-request Script**:
```javascript
const token = pm.environment.get("token");
if (token) {
    pm.request.headers.add({
        key: "Authorization",
        value: `Bearer ${token}`
    });
}
```

---

## 📊 Exemples de données de test

### Équipes
```json
[
  {"name": "Équipe Alpha", "color": "#3B82F6"},
  {"name": "Équipe Beta", "color": "#10B981"},
  {"name": "Équipe Gamma", "color": "#F59E0B"}
]
```

### Défis
```json
[
  {
    "title": "Défi Technique",
    "category": "technique",
    "points": 100,
    "difficulty": "difficile"
  },
  {
    "title": "Défi Créativité",
    "category": "creativite",
    "points": 80,
    "difficulty": "moyen"
  }
]
```

---

Ce guide couvre toutes les fonctionnalités de l'API. Testez chaque endpoint dans l'ordre recommandé pour une expérience complète!

