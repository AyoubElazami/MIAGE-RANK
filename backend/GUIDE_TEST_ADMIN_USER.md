# Guide de test - Création Admin et User

## 📋 Vue d'ensemble

Ce guide explique comment créer et tester des utilisateurs avec les rôles `admin` et `user`.

---

## 🔐 Méthode 1 : Créer un Admin via l'API (Recommandé)

### Étape 1 : Créer un premier utilisateur (via Register)

**Méthode:** `POST`  
**URL:** `http://localhost:4000/api/auth/register`
  
**Body (raw JSON):** 
```json
{
  "name": "Premier Admin",
  "email": "admin@miagerank.com",
  "password": "admin123"
}
```

**Réponse:**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "name": "Premier Admin",
    "email": "admin@miagerank.com",
    "role": "user",
    "team_id": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Note:** Par défaut, le rôle est `user`. Il faut le modifier manuellement en base de données ou via l'API.

---

### Étape 2 : Se connecter avec le premier utilisateur

**Méthode:** `POST`  
**URL:** `http://localhost:4000/api/auth/login`

**Body (raw JSON):**
```json
{
  "email": "admin@miagerank.com",
  "password": "admin123"
}
```

**⚠️ Action:** Copiez le `token` et sauvegardez-le dans `{{token}}`

---

### Étape 3 : Modifier le rôle en admin (via SQL direct)

Pour le premier admin, vous devez modifier directement en base de données :

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@miagerank.com';
```

**Ou via MySQL Workbench/phpMyAdmin:**
1. Connectez-vous à la base de données `MIAGERANK`
2. Exécutez la requête SQL ci-dessus

---

### Étape 4 : Se reconnecter pour obtenir un nouveau token avec le rôle admin

**Méthode:** `POST`  
**URL:** `http://localhost:4000/api/auth/login`

**Body:**
```json
{
  "email": "admin@miagerank.com",
  "password": "admin123"
}
```

**Réponse:**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "name": "Premier Admin",
    "email": "admin@miagerank.com",
    "role": "admin",
    "team_id": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**✅ Maintenant vous avez un token admin !**

---

## 👤 Méthode 2 : Créer un User normal (via Register)

**Méthode:** `POST`  
**URL:** `http://localhost:4000/api/auth/register`

**Body (raw JSON):**
```json
{
  "name": "User Normal",
  "email": "user@miagerank.com",
  "password": "user123"
}
```

**Réponse:**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 2,
    "name": "User Normal",
    "email": "user@miagerank.com",
    "role": "user",
    "team_id": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**✅ L'utilisateur est créé avec le rôle `user` par défaut.**

---

## 🔧 Méthode 3 : Créer un Admin via l'API (nécessite un admin existant)

Une fois que vous avez un admin, vous pouvez créer d'autres admins via l'API :

**Méthode:** `POST`  
**URL:** `http://localhost:4000/api/users`  
**Headers:** `Authorization: Bearer {{token}}` (token admin)

**Body (raw JSON):**
```json
{
  "name": "Nouvel Admin",
  "email": "admin2@miagerank.com",
  "password": "admin123",
  "role": "admin"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": 3,
    "name": "Nouvel Admin",
    "email": "admin2@miagerank.com",
    "role": "admin",
    "team_id": null,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 📝 Méthode 4 : Créer un User via l'API (nécessite un admin)

**Méthode:** `POST`  
**URL:** `http://localhost:4000/api/users`  
**Headers:** `Authorization: Bearer {{token}}` (token admin)

**Body (raw JSON):**
```json
{
  "name": "Nouvel User",
  "email": "user2@miagerank.com",
  "password": "user123",
  "role": "user"
}
```

**Ou sans spécifier le rôle (par défaut 'user'):**
```json
{
  "name": "Nouvel User",
  "email": "user3@miagerank.com",
  "password": "user123"
}
```

---

## 🔄 Modifier le rôle d'un utilisateur

### Via l'API (admin uniquement)

**Méthode:** `PUT`  
**URL:** `http://localhost:4000/api/users/:id`  
**Headers:** `Authorization: Bearer {{token}}` (token admin)

**Body (raw JSON):**
```json
{
  "role": "admin"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Utilisateur mis à jour avec succès",
  "data": {
    "id": 2,
    "name": "User Normal",
    "email": "user@miagerank.com",
    "role": "admin",
    "team_id": null
  }
}
```

---

## 📊 Récupérer tous les utilisateurs

**Méthode:** `GET`  
**URL:** `http://localhost:4000/api/users`  
**Headers:** `Authorization: Bearer {{token}}`

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Premier Admin",
      "email": "admin@miagerank.com",
      "role": "admin",
      "team_id": null,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "User Normal",
      "email": "user@miagerank.com",
      "role": "user",
      "team_id": null,
      "created_at": "2024-01-15T10:05:00.000Z",
      "updated_at": "2024-01-15T10:05:00.000Z"
    }
  ]
}
```

---

## 🔍 Récupérer un utilisateur par ID

**Méthode:** `GET`  
**URL:** `http://localhost:4000/api/users/:id`  
**Headers:** `Authorization: Bearer {{token}}`

**Exemple:** `GET http://localhost:4000/api/users/1`

---

## 🗑️ Supprimer un utilisateur (admin uniquement)

**Méthode:** `DELETE`  
**URL:** `http://localhost:4000/api/users/:id`  
**Headers:** `Authorization: Bearer {{token}}` (token admin)

**⚠️ Note:** Un admin ne peut pas supprimer son propre compte.

---

## ✅ Checklist de test complète

### Test 1 : Créer un premier utilisateur
- [ ] POST `/api/auth/register` avec email/password
- [ ] Vérifier que le rôle est `user` par défaut
- [ ] Sauvegarder le token

### Test 2 : Modifier le rôle en admin (SQL)
- [ ] Se connecter à MySQL
- [ ] Exécuter `UPDATE users SET role = 'admin' WHERE email = '...'`
- [ ] Vérifier la modification

### Test 3 : Se reconnecter avec le rôle admin
- [ ] POST `/api/auth/login`
- [ ] Vérifier que `role: "admin"` dans la réponse
- [ ] Sauvegarder le nouveau token admin

### Test 4 : Créer un admin via l'API
- [ ] POST `/api/users` avec token admin
- [ ] Body avec `"role": "admin"`
- [ ] Vérifier la création

### Test 5 : Créer un user via l'API
- [ ] POST `/api/users` avec token admin
- [ ] Body avec `"role": "user"` ou sans rôle
- [ ] Vérifier la création avec rôle `user`

### Test 6 : Modifier le rôle d'un utilisateur
- [ ] PUT `/api/users/:id` avec token admin
- [ ] Body avec `"role": "admin"`
- [ ] Vérifier la modification

### Test 7 : Récupérer tous les utilisateurs
- [ ] GET `/api/users` avec token
- [ ] Vérifier la liste complète

### Test 8 : Tester les permissions
- [ ] Essayer de créer un user avec un token user (doit échouer 403)
- [ ] Essayer de modifier un rôle avec un token user (doit échouer 403)
- [ ] Essayer de supprimer un user avec un token user (doit échouer 403)

---

## 🎯 Scénario de test complet

### Scénario 1 : Setup initial

1. **Créer le premier admin:**
   ```bash
   POST /api/auth/register
   {
     "name": "Super Admin",
     "email": "superadmin@miagerank.com",
     "password": "admin123"
   }
   ```

2. **Modifier en admin via SQL:**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'superadmin@miagerank.com';
   ```

3. **Se reconnecter:**
   ```bash
   POST /api/auth/login
   {
     "email": "superadmin@miagerank.com",
     "password": "admin123"
   }
   ```

### Scénario 2 : Créer des utilisateurs via l'API

1. **Créer un admin:**
   ```bash
   POST /api/users
   Authorization: Bearer <admin_token>
   {
     "name": "Admin 2",
     "email": "admin2@miagerank.com",
     "password": "admin123",
     "role": "admin"
   }
   ```

2. **Créer un user:**
   ```bash
   POST /api/users
   Authorization: Bearer <admin_token>
   {
     "name": "User 1",
     "email": "user1@miagerank.com",
     "password": "user123",
     "role": "user"
   }
   ```

3. **Vérifier la liste:**
   ```bash
   GET /api/users
   Authorization: Bearer <admin_token>
   ```

---

## 🔒 Permissions

| Action | Admin | User |
|--------|-------|------|
| Créer un utilisateur | ✅ | ❌ |
| Modifier le rôle | ✅ | ❌ |
| Modifier ses propres infos | ✅ | ✅ |
| Modifier les infos d'autres users | ✅ | ❌ |
| Supprimer un utilisateur | ✅ | ❌ |
| Voir tous les utilisateurs | ✅ | ✅ |
| Voir un utilisateur spécifique | ✅ | ✅ |

---

## 💡 Astuces

1. **Pour tester rapidement:** Utilisez SQL pour créer directement un admin
2. **Token expiré:** Reconnectez-vous pour obtenir un nouveau token
3. **Permissions:** Vérifiez toujours le rôle dans la réponse du login
4. **Sécurité:** Ne partagez jamais les tokens admin

---

## 🐛 Dépannage

### Erreur 403 "Accès refusé"
- Vérifiez que vous utilisez un token admin
- Vérifiez que le rôle dans le token est bien `admin`

### Erreur 401 "Token invalide"
- Le token a peut-être expiré (24h)
- Reconnectez-vous pour obtenir un nouveau token

### Le rôle ne change pas
- Vérifiez que vous êtes connecté avec un compte admin
- Vérifiez que le token est bien celui d'un admin
- Reconnectez-vous après modification du rôle

---

Ce guide couvre tous les cas d'usage pour créer et gérer des admins et des users !

