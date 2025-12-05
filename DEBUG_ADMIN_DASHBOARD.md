# 🔍 Débogage - Admin Dashboard

## Problème : La page `/admin/dashboard` ne s'affiche pas

## ✅ Corrections Apportées

### 1. Gestion d'Erreur Améliorée

Le composant `AdminDashboard` a été amélioré pour :
- ✅ Afficher un message d'erreur si l'API échoue
- ✅ Afficher un message si aucune donnée n'est disponible
- ✅ Bouton pour réessayer

### 2. Vérifications à Faire

#### ✅ Vérifier que vous êtes connecté en tant qu'admin

1. Ouvrez la console du navigateur (F12)
2. Vérifiez que vous avez un token dans `localStorage`
3. Vérifiez que `user.role === 'admin'`

#### ✅ Vérifier que le backend fonctionne

1. Ouvrez `http://localhost:4000/api/admin/dashboard` dans le navigateur
2. Vous devriez voir une erreur 401 (non authentifié) ou les données JSON

#### ✅ Vérifier la console du navigateur

Ouvrez la console (F12) et regardez :
- Erreurs JavaScript
- Erreurs de requête API
- Messages de chargement

---

## 🚀 Test Rapide

### 1. Se Connecter en tant qu'Admin

```bash
Email: admin.technique1@miagerank.fr
Password: Admin123!
```

### 2. Vérifier dans la Console

Ouvrez la console (F12) et vérifiez :
- Pas d'erreurs rouges
- Requête vers `/api/admin/dashboard` réussie (200)
- Données reçues

### 3. Vérifier le Backend

Dans le terminal backend, vous devriez voir :
```
GET /api/admin/dashboard
```

---

## 🔧 Solutions Possibles

### Problème 1 : Erreur 401 (Non authentifié)

**Solution :**
- Vérifiez que vous êtes bien connecté
- Vérifiez que le token est présent dans localStorage
- Reconnectez-vous

### Problème 2 : Erreur 403 (Accès refusé)

**Solution :**
- Vérifiez que votre compte a le rôle `admin`
- Vérifiez dans la base de données : `SELECT * FROM Users WHERE email = 'votre_email'`

### Problème 3 : Erreur 500 (Erreur serveur)

**Solution :**
- Vérifiez les logs du backend
- Vérifiez que la base de données est accessible
- Vérifiez que les modèles sont synchronisés

### Problème 4 : Page blanche

**Solution :**
- Ouvrez la console (F12)
- Regardez les erreurs
- Vérifiez que tous les composants sont importés correctement

---

## 📝 Checklist

- [ ] Backend démarré sur le port 4000
- [ ] Frontend démarré sur le port 3000
- [ ] Connecté en tant qu'admin
- [ ] Token présent dans localStorage
- [ ] Console du navigateur sans erreurs
- [ ] Requête API réussie (200)

---

## 🎯 Test Manuel

1. Ouvrez `http://localhost:3000/admin/dashboard`
2. Ouvrez la console (F12)
3. Regardez l'onglet "Network"
4. Cherchez la requête vers `/api/admin/dashboard`
5. Vérifiez le statut (200 = OK, 401 = Non authentifié, 500 = Erreur serveur)

---

**Si le problème persiste, vérifiez la console du navigateur pour plus de détails !**

