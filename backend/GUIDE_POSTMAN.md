# Guide complet pour tester avec Postman

## 📋 Prérequis

1. **Démarrer le serveur**:
   ```bash
   npm start
   ```
   Vous devriez voir:
   ```
   ✅ Connexion à la base de données MySQL réussie!
   ✅ Table User créée avec succès!
   Server is running on port 4000
   ```

2. **Ouvrir Postman** et créer une nouvelle collection (optionnel mais recommandé)

---

## 🔐 Étape 1: Inscription (Register)

### Configuration dans Postman:

1. **Méthode**: `POST`
2. **URL**: `http://localhost:4000/auth/register`
3. **Onglet Headers**:
   - Clé: `Content-Type`
   - Valeur: `application/json`
4. **Onglet Body**:
   - Sélectionner: `raw`
   - Choisir: `JSON` (dans le menu déroulant à droite)
   - Coller ce JSON:
   ```json
   {
     "name": "John Doe",
     "email": "john.doe@example.com",
     "password": "password123"
   }
   ```

### Réponse attendue (201 Created):
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzMzA0ODgwMCwiZXhwIjoxNjMzMTM1MjAwfQ.xxxxx"
}
```

### ⚠️ IMPORTANT: 
**Copiez le `token` de la réponse!** Vous en aurez besoin pour les routes protégées.

---

## 🔑 Étape 2: Connexion (Login)

### Configuration dans Postman:

1. **Méthode**: `POST`
2. **URL**: `http://localhost:4000/auth/login`
3. **Onglet Headers**:
   - Clé: `Content-Type`
   - Valeur: `application/json`
4. **Onglet Body**:
   - Sélectionner: `raw`
   - Choisir: `JSON`
   - Coller ce JSON:
   ```json
   {
     "email": "john.doe@example.com",
     "password": "password123"
   }
   ```

### Réponse attendue (200 OK):
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzMzA0ODgwMCwiZXhwIjoxNjMzMTM1MjAwfQ.xxxxx"
}
```

### ⚠️ IMPORTANT: 
**Copiez le `token` de la réponse!**

---

## 👥 Étape 3: Récupérer tous les utilisateurs (Route protégée)

### Méthode 1: Utiliser l'onglet Authorization (RECOMMANDÉ)

1. **Méthode**: `GET`
2. **URL**: `http://localhost:4000/users`
3. **Onglet Authorization**:
   - Type: `Bearer Token`
   - Token: Collez votre token ici (celui obtenu lors du login/register)
4. **Onglet Headers**: Postman ajoutera automatiquement `Authorization: Bearer TOKEN`

### Méthode 2: Ajouter manuellement dans Headers

1. **Méthode**: `GET`
2. **URL**: `http://localhost:4000/users`
3. **Onglet Headers**:
   - Clé: `Authorization`
   - Valeur: `Bearer VOTRE_TOKEN_ICI` (remplacez par votre token réel)
   - Clé: `Content-Type`
   - Valeur: `application/json`

### Réponse attendue (200 OK):
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### ❌ Si le token est manquant ou invalide:
```json
{
  "message": "Token d'authentification manquant"
}
```
ou
```json
{
  "message": "Token invalide"
}
```

---

## 📝 Étape 4: Créer un utilisateur (Route protégée)

### Configuration dans Postman:

1. **Méthode**: `POST`
2. **URL**: `http://localhost:4000/users`
3. **Onglet Authorization**:
   - Type: `Bearer Token`
   - Token: Collez votre token
4. **Onglet Headers**:
   - Clé: `Content-Type`
   - Valeur: `application/json`
5. **Onglet Body**:
   - Sélectionner: `raw`
   - Choisir: `JSON`
   - Coller ce JSON:
   ```json
   {
     "name": "Marie Dupont",
     "email": "marie.dupont@example.com",
     "password": "password456"
   }
   ```

### Réponse attendue (201 Created):
```json
{
  "id": 2,
  "name": "Marie Dupont",
  "email": "marie.dupont@example.com",
  "password": "$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🎯 Résumé des routes

| Route | Méthode | Authentification | Description |
|-------|---------|------------------|-------------|
| `/` | GET | ❌ Non | Page d'accueil |
| `/about` | GET | ❌ Non | Page About |
| `/auth/register` | POST | ❌ Non | Inscription |
| `/auth/login` | POST | ❌ Non | Connexion |
| `/users` | GET | ✅ Oui | Liste des utilisateurs |
| `/users` | POST | ✅ Oui | Créer un utilisateur |

---

## 💡 Astuces Postman

### 1. Créer une variable d'environnement pour le token

1. Cliquez sur l'icône d'engrenage (⚙️) en haut à droite
2. Créez un nouvel environnement (ex: "Local")
3. Ajoutez une variable:
   - Variable: `token`
   - Valeur initiale: (laissez vide)
4. Dans vos requêtes, utilisez `{{token}}` dans le champ Authorization
5. Après le login, utilisez un script de test pour sauvegarder automatiquement le token:

**Onglet Tests** (après la requête login):
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
}
```

### 2. Créer une collection

Organisez vos requêtes dans une collection:
- `1. Register`
- `2. Login`
- `3. Get Users`
- `4. Create User`

### 3. Tester les erreurs

Testez aussi les cas d'erreur:
- Email déjà utilisé (register avec le même email)
- Mauvais mot de passe (login)
- Token manquant (route protégée sans token)
- Token expiré (attendez 24h ou modifiez l'expiration dans le code)

---

## 🔧 Dépannage

### Erreur: "Token d'authentification manquant"
- Vérifiez que vous avez bien ajouté le header `Authorization: Bearer TOKEN`
- Vérifiez que le token est bien collé (sans espaces avant/après)

### Erreur: "Token invalide"
- Le token a peut-être expiré (24h par défaut)
- Faites un nouveau login pour obtenir un nouveau token
- Vérifiez que vous utilisez bien `Bearer TOKEN` (avec l'espace)

### Erreur: "Cet email est déjà utilisé"
- L'email existe déjà en base de données
- Utilisez un autre email ou connectez-vous avec cet email

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré
- Vérifiez les variables dans `.env` (DB_NAME, DB_USER, DB_PASSWORD, etc.)

---

## ✅ Checklist de test

- [ ] Serveur démarré (`npm start`)
- [ ] Base de données connectée
- [ ] Table User créée
- [ ] Test Register réussi (token reçu)
- [ ] Test Login réussi (token reçu)
- [ ] Test Get Users avec token (liste reçue)
- [ ] Test Create User avec token (utilisateur créé)
- [ ] Test sans token (erreur 401 reçue)

