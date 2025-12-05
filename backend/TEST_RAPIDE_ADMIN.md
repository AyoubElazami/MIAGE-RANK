# Test Rapide - Créer Admin et User

## 🚀 Méthode la plus rapide

### 1. Créer un utilisateur normal (via Register)

**Postman:**
```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "Admin Test",
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Réponse:** Vous recevez un token, mais le rôle est `user`

---

### 2. Modifier le rôle en admin (via SQL)

**Ouvrez MySQL et exécutez:**
```sql
USE MIAGERANK;
UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';
```

**Ou via ligne de commande:**
```bash
mysql -u root -p MIAGERANK -e "UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';"
```

---

### 3. Se reconnecter pour obtenir le token admin

**Postman:**
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Réponse:** Maintenant `role: "admin"` ✅

**⚠️ Copiez le token et utilisez-le pour les requêtes suivantes !**

---

### 4. Créer un User via l'API (avec token admin)

**Postman:**
```
POST http://localhost:4000/api/users
Authorization: Bearer VOTRE_TOKEN_ADMIN
Content-Type: application/json

{
  "name": "User Test",
  "email": "user@test.com",
  "password": "user123",
  "role": "user"
}
```

---

### 5. Créer un autre Admin via l'API (avec token admin)

**Postman:**
```
POST http://localhost:4000/api/users
Authorization: Bearer VOTRE_TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Admin 2",
  "email": "admin2@test.com",
  "password": "admin123",
  "role": "admin"
}
```

---

## ✅ Vérification

**Récupérer tous les utilisateurs:**
```
GET http://localhost:4000/api/users
Authorization: Bearer VOTRE_TOKEN_ADMIN
```

Vous devriez voir tous les utilisateurs avec leurs rôles !

---

## 📝 Résumé des endpoints

| Action | Méthode | URL | Auth | Body |
|--------|---------|-----|-------|------|
| Créer user (register) | POST | `/api/auth/register` | ❌ | name, email, password |
| Login | POST | `/api/auth/login` | ❌ | email, password |
| Créer user/admin | POST | `/api/users` | ✅ Admin | name, email, password, role |
| Liste users | GET | `/api/users` | ✅ | - |
| Modifier user | PUT | `/api/users/:id` | ✅ | name, email, role, team_id |
| Supprimer user | DELETE | `/api/users/:id` | ✅ Admin | - |

---

**C'est tout ! Vous avez maintenant un système complet de gestion des utilisateurs avec rôles admin/user.**

