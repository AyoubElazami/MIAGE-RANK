# 📊 Guide du Système de Notation - MiageRank

## 🎯 Vue d'ensemble

Le système de notation MiageRank fonctionne en **3 étapes principales** :

1. **Soumission** : Les équipes soumettent leurs réalisations
2. **Validation** : Les admins valident ou rejettent les scores
3. **Classement** : Les points validés sont ajoutés au total de l'équipe

---

## 📝 Processus de Notation

### Étape 1 : Soumission de Score

Un **membre d'une équipe** peut soumettre un score pour un défi :

```json
POST /api/scores/submit
{
  "challengeId": 1,
  "teamId": 2,
  "points": 300,
  "bonus": 50,
  "notes": "Notre équipe a créé une API complète avec documentation"
}
```

**Résultat** :
- Le score est créé avec le statut `"pending"` (en attente)
- `totalPoints = points + bonus` (300 + 50 = 350 points)
- L'équipe ne gagne **PAS encore** les points

---

### Étape 2 : Validation par un Admin

Seul un **administrateur** peut valider ou rejeter un score :

```json
PUT /api/scores/:id/validate
{
  "status": "validated",  // ou "rejected"
  "notes": "Excellent travail ! API bien documentée."
}
```

**Si validé** :
- Le score passe au statut `"validated"`
- Les points sont **ajoutés au total de l'équipe**
- Le classement est **automatiquement mis à jour**
- Notification WebSocket envoyée à tous

**Si rejeté** :
- Le score passe au statut `"rejected"`
- Aucun point n'est ajouté
- L'admin peut expliquer pourquoi dans les notes

---

### Étape 3 : Calcul du Classement

**Automatiquement après chaque validation** :

1. **Calcul du total de l'équipe** :
   ```javascript
   totalScore = SUM(tous les totalPoints des scores validés)
   ```

2. **Mise à jour du rang** :
   - Les équipes sont triées par `totalScore` décroissant
   - Le rang 1 = la meilleure équipe
   - En cas d'égalité, c'est l'ID le plus petit qui gagne

---

## 🎯 Composants d'un Score

Un score comprend :

| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `points` | Integer | Points de base | 300 |
| `bonus` | Integer (optionnel) | Points bonus | 50 |
| `totalPoints` | Integer | **points + bonus** | 350 |
| `status` | Enum | `pending`, `validated`, `rejected` | `pending` |
| `notes` | Text | Commentaires | "Excellent travail !" |
| `validatedBy` | Integer | ID de l'admin qui a validé | 1 |
| `validatedAt` | Date | Date de validation | 2024-01-15 |

---

## 📊 Exemple Concret

### Scénario : Équipe "Les Champions"

1. **Soumission** :
   - Défi : "API REST Créative" (200 points de base)
   - L'équipe soumet : `points: 200`, `bonus: 50`
   - `totalPoints = 250`
   - Statut : `pending`

2. **Validation Admin** :
   - Admin vérifie la réalisation
   - Valide avec `status: "validated"`
   - Notes : "API excellente, documentation complète"

3. **Résultat** :
   - L'équipe gagne **250 points**
   - `totalScore` de l'équipe = 250
   - Rang mis à jour automatiquement
   - Classement actualisé en temps réel

---

## ✅ Règles de Notation

### Règles de Soumission

- ✅ Un membre doit appartenir à l'équipe pour soumettre
- ✅ Un seul score par équipe et par défi
- ✅ Le défi doit être actif
- ✅ Les points peuvent être supérieurs aux points de base du défi (bonus)

### Règles de Validation

- ✅ Seuls les admins peuvent valider
- ✅ Un score ne peut être validé qu'une fois
- ✅ L'admin peut ajouter des notes explicatives
- ✅ Les points sont ajoutés seulement si validés

### Règles de Calcul

- ✅ Seuls les scores **validés** comptent
- ✅ Les scores **rejetés** ou **en attente** ne comptent pas
- ✅ Le total est la **somme de tous les scores validés**
- ✅ Le classement est mis à jour automatiquement

---

## 🎨 Interface Utilisateur

### Pour les Équipes

1. **Page Scores** (`/scores`) :
   - Formulaire pour soumettre un score
   - Sélection du défi
   - Indication des points de base
   - Champ bonus optionnel
   - Notes explicatives

2. **Page Équipe** (`/teams/:id`) :
   - Liste de tous les scores de l'équipe
   - Statut de chaque score (pending/validated/rejected)
   - Total des points de l'équipe

### Pour les Admins

1. **Dashboard Admin** (`/admin/dashboard`) :
   - Liste des scores en attente de validation
   - Statistiques des scores

2. **Page de Validation** (à créer) :
   - Détails du score soumis
   - Voir la réalisation de l'équipe
   - Boutons Valider/Rejeter
   - Champ pour notes

---

## 🔄 Mises à Jour Temps Réel

Grâce à **WebSocket** :

- ✅ Le classement se met à jour instantanément
- ✅ Tous les utilisateurs voient les changements en direct
- ✅ Notifications automatiques lors des validations
- ✅ Mise à jour du total de l'équipe en temps réel

---

## 📈 Système de Points

### Points de Base

Chaque défi a des **points de base** :
- **Facile** : 50-100 points
- **Moyen** : 200-450 points
- **Difficile** : 500-900 points
- **Expert** : 1000 points

### Points Bonus

Les admins peuvent attribuer des **points bonus** pour :
- Qualité exceptionnelle
- Innovation
- Documentation complète
- Présentation remarquable
- Délai respecté ou anticipé

### Total des Points

```
totalPoints = points (de base) + bonus (optionnel)
```

**Exemple** :
- Défi : 200 points de base
- Bonus : 50 points pour qualité
- **Total : 250 points**

---

## 🔐 Sécurité

- ✅ Seuls les membres peuvent soumettre pour leur équipe
- ✅ Seuls les admins peuvent valider
- ✅ Un score ne peut être modifié après soumission
- ✅ Historique complet (qui a validé, quand)

---

## 📊 API Endpoints

### Pour les Équipes

```bash
# Soumettre un score
POST /api/scores/submit
Authorization: Bearer <token>
{
  "challengeId": 1,
  "teamId": 2,
  "points": 300,
  "bonus": 50,
  "notes": "..."
}

# Voir tous les scores
GET /api/scores?teamId=2
GET /api/scores?challengeId=1
GET /api/scores?status=pending
```

### Pour les Admins

```bash
# Valider un score
PUT /api/scores/:id/validate
Authorization: Bearer <admin_token>
{
  "status": "validated",
  "notes": "Excellent !"
}

# Rejeter un score
PUT /api/scores/:id/validate
{
  "status": "rejected",
  "notes": "Manque de documentation"
}

# Voir tous les scores en attente
GET /api/scores?status=pending
```

---

## 🎯 Bonnes Pratiques

### Pour les Équipes

1. **Lisez bien le défi** avant de soumettre
2. **Respectez les requirements** du défi
3. **Documentez votre travail** (screenshots, liens, etc.)
4. **Ajoutez des notes** explicatives dans la soumission
5. **Soyez honnêtes** sur les points mérités

### Pour les Admins

1. **Vérifiez attentivement** chaque soumission
2. **Consultez la réalisation** (code, vidéo, etc.)
3. **Validez rapidement** pour motiver les équipes
4. **Ajoutez des notes** constructives
5. **Soyez équitables** dans les validations

---

## 💡 FAQ

**Q : Qui peut soumettre un score ?**  
R : Tout membre d'une équipe peut soumettre un score pour son équipe.

**Q : Combien de scores par défi ?**  
R : Un seul score par équipe et par défi.

**Q : Les points bonus sont-ils obligatoires ?**  
R : Non, c'est optionnel. Les admins peuvent en donner pour récompenser l'excellence.

**Q : Que se passe-t-il si un score est rejeté ?**  
R : L'équipe ne gagne aucun point, mais peut soumettre à nouveau après correction.

**Q : Le classement est-il automatique ?**  
R : Oui, le classement se met à jour automatiquement après chaque validation.

---

## 📞 Support

Pour toute question sur le système de notation, contactez un administrateur.

---

**Bon courage et que le meilleur gagne ! 🏆**

