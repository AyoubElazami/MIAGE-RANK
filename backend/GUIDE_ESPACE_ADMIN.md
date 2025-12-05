# Guide - Espace Admin

## 🎯 Vue d'ensemble

L'espace admin est une section réservée aux administrateurs pour gérer tous les aspects de l'application, notamment la création et la gestion des utilisateurs.

---

## 🔐 Accès à l'espace admin

### Prérequis
- Avoir un compte avec le rôle `admin`
- Être authentifié avec un token JWT valide

### Vérifier si vous êtes admin
Après connexion, vérifiez le champ `role` dans la réponse :
```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@test.com",
    "role": "admin"  // ← Doit être "admin"
  }
}
```

---

## 📊 Dashboard Admin

### GET `/api/admin/dashboard`

Récupère les statistiques et informations pour le dashboard admin.

**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ADMIN
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "users": {
        "total": 25,
        "admins": 3,
        "regular": 22
      },
      "teams": {
        "total": 10
      },
      "challenges": {
        "total": 8
      },
      "scores": {
        "total": 45,
        "pending": 5
      }
    },
    "recentUsers": [...],
    "recentPendingScores": [...]
  }
}
```

**Utilisation frontend:**
- Afficher les statistiques générales
- Montrer les derniers utilisateurs créés
- Afficher les scores en attente de validation

---

## 👥 Gestion des utilisateurs (Espace Admin)

### 1. Créer un utilisateur (Admin ou User)

**POST** `/api/admin/users`

**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ADMIN
Content-Type: application/json
```

**Body pour créer un ADMIN:**
```json
{
  "name": "Nouvel Admin",
  "email": "admin2@test.com",
  "password": "admin123",
  "role": "admin",
  "team_id": null
}
```

**Body pour créer un USER:**
```json
{
  "name": "Nouvel User",
  "email": "user@test.com",
  "password": "user123",
  "role": "user",
  "team_id": 1
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": 5,
    "name": "Nouvel Admin",
    "email": "admin2@test.com",
    "role": "admin",
    "team_id": null,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**⚠️ Important:** Seuls les admins peuvent créer des utilisateurs via cette route.

---

### 2. Modifier le rôle d'un utilisateur

**PUT** `/api/admin/users/:id/role`

**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ADMIN
Content-Type: application/json
```

**Body:**
```json
{
  "role": "admin"
}
```

**Exemple:** Promouvoir un user en admin
```
PUT /api/admin/users/2/role
{
  "role": "admin"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Rôle de l'utilisateur mis à jour avec succès",
  "data": {
    "id": 2,
    "name": "User Test",
    "email": "user@test.com",
    "role": "admin"
  }
}
```

**⚠️ Note:** Un admin ne peut pas modifier son propre rôle.

---

### 3. Assigner un utilisateur à une équipe

**PUT** `/api/admin/users/:id/team`

**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ADMIN
Content-Type: application/json
```

**Body pour assigner:**
```json
{
  "team_id": 1
}
```

**Body pour retirer de l'équipe:**
```json
{
  "team_id": null
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Utilisateur assigné à l'équipe avec succès",
  "data": {
    "id": 3,
    "name": "User Test",
    "email": "user@test.com",
    "team_id": 1
  }
}
```

---

## 🎨 Interface Frontend - Exemple d'utilisation

### Page Admin Dashboard

```javascript
// Récupérer les données du dashboard
const fetchDashboard = async () => {
  const response = await fetch('http://localhost:4000/api/admin/dashboard', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  const data = await response.json();
  return data.data;
};
```

### Formulaire de création d'utilisateur

```javascript
// Créer un utilisateur (admin ou user)
const createUser = async (userData) => {
  const response = await fetch('http://localhost:4000/api/admin/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role, // 'admin' ou 'user'
      team_id: userData.team_id || null
    })
  });
  return await response.json();
};
```

### Liste des utilisateurs avec actions admin

```javascript
// Récupérer tous les utilisateurs
const getUsers = async () => {
  const response = await fetch('http://localhost:4000/api/users', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return await response.json();
};

// Modifier le rôle d'un utilisateur
const updateUserRole = async (userId, newRole) => {
  const response = await fetch(`http://localhost:4000/api/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: newRole })
  });
  return await response.json();
};
```

---

## 📋 Routes Admin disponibles

| Route | Méthode | Description | Auth |
|-------|---------|-------------|------|
| `/api/admin/dashboard` | GET | Statistiques et dashboard | Admin |
| `/api/admin/users` | POST | Créer un utilisateur | Admin |
| `/api/admin/users/:id/role` | PUT | Modifier le rôle | Admin |
| `/api/admin/users/:id/team` | PUT | Assigner à une équipe | Admin |

---

## 🔒 Sécurité

### Vérification du rôle admin
Toutes les routes `/api/admin/*` nécessitent :
1. Un token JWT valide (`authenticateToken`)
2. Le rôle `admin` (`isAdmin`)

### Middleware de protection
```javascript
router.use(authenticateToken);  // Vérifie le token
router.use(isAdmin);             // Vérifie le rôle admin
```

Si un utilisateur non-admin essaie d'accéder à ces routes, il recevra :
```json
{
  "success": false,
  "message": "Accès refusé. Seuls les administrateurs peuvent effectuer cette action."
}
```

---

## ✅ Checklist de test

### Test 1 : Accéder au dashboard
- [ ] Se connecter avec un compte admin
- [ ] GET `/api/admin/dashboard`
- [ ] Vérifier les statistiques

### Test 2 : Créer un admin
- [ ] POST `/api/admin/users` avec `"role": "admin"`
- [ ] Vérifier la création
- [ ] Se connecter avec le nouvel admin

### Test 3 : Créer un user
- [ ] POST `/api/admin/users` avec `"role": "user"`
- [ ] Vérifier la création
- [ ] Vérifier que le rôle est bien "user"

### Test 4 : Modifier un rôle
- [ ] PUT `/api/admin/users/:id/role`
- [ ] Promouvoir un user en admin
- [ ] Vérifier la modification

### Test 5 : Assigner à une équipe
- [ ] PUT `/api/admin/users/:id/team`
- [ ] Vérifier l'assignation

### Test 6 : Permissions
- [ ] Essayer d'accéder avec un token user (doit échouer 403)
- [ ] Essayer sans token (doit échouer 401)

---

## 🎯 Scénario d'utilisation typique

### 1. Premier setup
```
1. Créer un user via /api/auth/register
2. Modifier en admin via SQL
3. Se reconnecter pour obtenir token admin
4. Accéder à l'espace admin
```

### 2. Création d'utilisateurs depuis l'espace admin
```
1. Admin se connecte
2. Va dans l'espace admin
3. Clique sur "Créer un utilisateur"
4. Remplit le formulaire (nom, email, password, rôle)
5. Soumet → POST /api/admin/users
6. L'utilisateur est créé
```

### 3. Gestion des utilisateurs
```
1. Admin voit la liste des utilisateurs
2. Peut modifier le rôle (user ↔ admin)
3. Peut assigner à une équipe
4. Peut supprimer un utilisateur
```

---

## 💡 Exemple de composant React (Frontend)

```jsx
// AdminDashboard.jsx
import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    // Charger le dashboard
    fetch('http://localhost:4000/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDashboard(data.data));

    // Charger les utilisateurs
    fetch('http://localhost:4000/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data.data));
  }, [token]);

  const createUser = async (userData) => {
    const response = await fetch('http://localhost:4000/api/admin/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    const result = await response.json();
    if (result.success) {
      // Recharger la liste
      // Afficher un message de succès
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Espace Administrateur</h1>
      
      {/* Statistiques */}
      {dashboard && (
        <div className="stats">
          <div>Total Users: {dashboard.statistics.users.total}</div>
          <div>Admins: {dashboard.statistics.users.admins}</div>
          <div>Scores en attente: {dashboard.statistics.scores.pending}</div>
        </div>
      )}

      {/* Formulaire de création */}
      <CreateUserForm onSubmit={createUser} />

      {/* Liste des utilisateurs */}
      <UsersList users={users} />
    </div>
  );
}
```

---

## 📝 Résumé

**L'espace admin permet aux administrateurs de :**
- ✅ Voir les statistiques de l'application
- ✅ Créer des utilisateurs (admin ou user)
- ✅ Modifier les rôles des utilisateurs
- ✅ Assigner des utilisateurs à des équipes
- ✅ Gérer tous les aspects de l'application

**Routes principales:**
- `/api/admin/dashboard` - Dashboard avec statistiques
- `/api/admin/users` - Créer un utilisateur
- `/api/admin/users/:id/role` - Modifier le rôle
- `/api/admin/users/:id/team` - Assigner à une équipe

**Sécurité:**
- Toutes les routes nécessitent un token admin
- Vérification automatique du rôle
- Protection contre les accès non autorisés

---

C'est exactement ça ! L'espace admin est maintenant prêt pour être intégré dans votre frontend ! 🚀

