# 📊 Schéma du Système de Notation

## 🔄 Flux de Notation

```
┌─────────────────────────────────────────────────────────────┐
│                    PROCESSUS DE NOTATION                     │
└─────────────────────────────────────────────────────────────┘

1️⃣  SOUMISSION
    ├─ Membre d'équipe soumet un score
    ├─ Score créé avec status = "pending"
    └─ totalPoints = points + bonus
    
2️⃣  VALIDATION (Admin uniquement)
    ├─ Admin vérifie la réalisation
    ├─ Admin valide OU rejette
    └─ Si validé → Points ajoutés à l'équipe
    
3️⃣  CALCUL AUTOMATIQUE
    ├─ totalScore équipe = SUM(scores validés)
    ├─ Classement mis à jour
    └─ Notifications temps réel
```

---

## 📋 Structure des Données

### Score

```javascript
{
  id: 1,
  TeamId: 2,              // Équipe qui soumet
  ChallengeId: 5,         // Défi concerné
  points: 300,            // Points de base
  bonus: 50,              // Points bonus (optionnel)
  totalPoints: 350,       // points + bonus
  status: "pending",      // pending | validated | rejected
  notes: "...",           // Commentaires
  validatedBy: null,      // ID admin qui a validé
  validatedAt: null,      // Date de validation
  created_at: "...",
  updated_at: "..."
}
```

### Team

```javascript
{
  id: 2,
  name: "Les Champions",
  totalScore: 1250,       // ✅ Somme des scores validés
  rank: 3,                // ✅ Mis à jour automatiquement
  ...
}
```

---

## 🎯 Calcul du Total

### Formule

```
Team.totalScore = SUM(
  Score.totalPoints 
  WHERE Score.TeamId = Team.id 
  AND Score.status = 'validated'
)
```

### Exemple

Équipe "Les Champions" :
- Score 1 : 250 points (validated) ✅
- Score 2 : 300 points (validated) ✅
- Score 3 : 200 points (pending) ⏳
- Score 4 : 500 points (validated) ✅

**totalScore = 250 + 300 + 500 = 1050 points**

Le score 3 (pending) n'est **pas** comptabilisé.

---

## 📈 Mise à Jour du Classement

### Algorithme

1. Récupérer toutes les équipes actives
2. Trier par `totalScore` décroissant
3. En cas d'égalité, utiliser l'ID (plus petit = meilleur rang)
4. Assigner les rangs (1, 2, 3, ...)

```javascript
// Pseudocode
teams = getAllActiveTeams()
teams.sort((a, b) => {
  if (b.totalScore !== a.totalScore) {
    return b.totalScore - a.totalScore
  }
  return a.id - b.id  // En cas d'égalité
})

teams.forEach((team, index) => {
  team.rank = index + 1
})
```

---

## 🔐 Permissions

| Action | Utilisateur | Admin | Membre Équipe |
|--------|-------------|-------|---------------|
| Soumettre un score | ❌ | ❌ | ✅ |
| Voir ses scores | ✅ | ✅ | ✅ |
| Valider un score | ❌ | ✅ | ❌ |
| Rejeter un score | ❌ | ✅ | ❌ |
| Modifier un score | ❌ | ❌ | ❌ |

---

## 🔄 Événements WebSocket

Lors de la validation d'un score :

1. **ranking:update** → Classement mis à jour
2. **team:update** → Équipe mise à jour
3. **challenge:update** → Défi mis à jour
4. **notification** → Notification générale
5. **ranking:refresh** → Force le refresh du classement

---

## 📊 Exemple Complet

### 1. Soumission

```json
POST /api/scores/submit
{
  "challengeId": 5,
  "teamId": 2,
  "points": 300,
  "bonus": 50,
  "notes": "API REST créée avec documentation Swagger"
}
```

**Résultat** :
- Score créé avec `status: "pending"`
- `totalPoints: 350`
- Équipe totalScore **inchangé** (1050)

### 2. Validation Admin

```json
PUT /api/scores/15/validate
{
  "status": "validated",
  "notes": "Excellent travail !"
}
```

**Résultat** :
- Score `status: "validated"`
- `validatedBy: 1` (ID admin)
- `validatedAt: "2024-01-15T10:30:00"`
- Équipe totalScore **mis à jour** : 1050 + 350 = **1400**
- Rang recalculé
- Classement mis à jour en temps réel

### 3. Résultat Final

```
Équipe "Les Champions" :
- totalScore: 1400 points
- rank: 2 (était 3)
- Scores validés: 4
```

---

**Le système est automatique et équitable ! 🎯**

