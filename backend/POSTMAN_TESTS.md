# Guide de test Postman

## Configuration de base
- **URL de base**: `http://localhost:4000`
- **Port**: 4000

---

## 1. Route racine - GET

**URL**: `http://localhost:4000/`

**Méthode**: `GET`

**Headers**: Aucun

**Body**: Aucun

**Réponse attendue**:
```
Hello World
```

---

## 2. Route About - GET

**URL**: `http://localhost:4000/about`

**Méthode**: `GET`

**Headers**: Aucun

**Body**: Aucun

**Réponse attendue**:
```
About page
```

---

## 3. Inscription (Register) - POST

**URL**: `http://localhost:4000/auth/register`

**Méthode**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "monMotDePasse123"
}
```

**Réponse attendue** (201 Created):
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Important**: Sauvegardez le `token` retourné, vous en aurez besoin pour accéder aux routes protégées!

---

## 4. Connexion (Login) - POST

**URL**: `http://localhost:4000/auth/login`

**Méthode**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "email": "john.doe@example.com",
  "password": "monMotDePasse123"
}
```

**Réponse attendue** (200 OK):
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Important**: Sauvegardez le `token` retourné pour les requêtes suivantes!

---

## 5. Récupérer tous les utilisateurs - GET (Route protégée)

**URL**: `http://localhost:4000/users`

**Méthode**: `GET`

**Headers**:
```
Authorization: Bearer VOTRE_TOKEN_ICI
Content-Type: application/json
```

**Body**: Aucun

**⚠️ Important**: Cette route nécessite un token JWT valide dans le header `Authorization`!

**Réponse attendue** (200 OK):
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "$2b$10$...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Si le token est manquant ou invalide**:
```json
{
  "message": "Token d'authentification manquant"
}
```

---

---

## Ordre recommandé pour tester

1. **Inscription** (`POST /auth/register`) - Créez un compte
2. **Connexion** (`POST /auth/login`) - Connectez-vous et récupérez le token
3. **Récupérer les utilisateurs** (`GET /users`) - Utilisez le token pour accéder à la route protégée

---

## Comment utiliser le token JWT dans Postman

1. Après avoir fait un **register** ou **login**, copiez le `token` de la réponse
2. Pour les routes protégées, allez dans l'onglet **Headers**
3. Ajoutez une nouvelle clé: `Authorization`
4. Dans la valeur, entrez: `Bearer VOTRE_TOKEN_ICI` (remplacez `VOTRE_TOKEN_ICI` par le token réel)
5. Ou utilisez l'onglet **Authorization** dans Postman:
   - Type: `Bearer Token`
   - Token: collez votre token

---

## Notes importantes

1. **Démarrez le serveur** avant de tester:
   ```bash
   npm start
   ```

2. **Vérifiez que la base de données est connectée** - vous devriez voir le message:
   ```
   ✅ Connexion à la base de données MySQL réussie!
   ```

3. **La table User sera créée automatiquement** au démarrage avec le message:
   ```
   ✅ Table User créée avec succès!
   ```

4. **Le token JWT expire après 24h** - vous devrez vous reconnecter après expiration

5. **En cas d'erreur**, vérifiez:
   - Que le serveur est bien démarré
   - Que la base de données MySQL est accessible
   - Que les variables d'environnement dans `.env` sont correctes (notamment `JWT_SECRET`)
   - Que le token est bien présent dans le header `Authorization` avec le format `Bearer TOKEN`

