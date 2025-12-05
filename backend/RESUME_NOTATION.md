# 📊 Résumé - Comment les Équipes sont Notées

## 🎯 Le Système en 3 Étapes

### 1️⃣ SOUMISSION (Par l'équipe)

Un **membre de l'équipe** soumet un score :

```
✅ Réalise un défi
   ↓
✅ Va sur la page "Soumettre un Score"
   ↓
✅ Remplit le formulaire :
   - Sélectionne le défi
   - Indique les points mérités
   - Ajoute des bonus (optionnel)
   - Ajoute des notes explicatives
   ↓
✅ Score créé avec statut "EN ATTENTE"
```

**⚠️ L'équipe ne gagne PAS encore les points !**

---

### 2️⃣ VALIDATION (Par un Admin)

Un **administrateur** valide ou rejette :

```
📧 Admin reçoit une notification
   ↓
👀 Admin examine la réalisation
   ↓
✅ Admin décide :
   - VALIDER → Équipe gagne les points
   - REJETER → Aucun point attribué
   ↓
💬 Admin ajoute des notes (optionnel)
```

**✅ Seulement après validation, l'équipe gagne les points !**

---

### 3️⃣ CALCUL AUTOMATIQUE

Le système calcule automatiquement :

```
📊 Pour chaque équipe :
   totalScore = Somme de TOUS les scores validés
   
🏆 Classement :
   - Trier toutes les équipes par totalScore décroissant
   - Assigner les rangs (1er, 2ème, 3ème...)
   - En cas d'égalité → ID plus petit gagne
```

**🔄 Tout est automatique et en temps réel !**

---

## 📝 Exemple Concret

### Scénario : Équipe "Les Champions"

**Lundi** :
- Soumet le défi "API REST" : 300 points + 50 bonus = **350 points total**
- Statut : ⏳ **EN ATTENTE**
- totalScore de l'équipe : **0** (pas encore validé)

**Mardi** :
- Admin valide le score ✅
- Statut : ✅ **VALIDÉ**
- totalScore de l'équipe : **350 points**
- Rang : **5ème**

**Mercredi** :
- Soumet le défi "Optimisation Web" : 200 points
- Admin valide rapidement ✅
- totalScore de l'équipe : **350 + 200 = 550 points**
- Rang : **3ème** (grâce aux nouveaux points)

---

## 🎯 Types de Points

### Points de Base
Chaque défi a des points de base selon sa difficulté :
- **Facile** : 50-100 points
- **Moyen** : 200-450 points
- **Difficile** : 500-900 points
- **Expert** : 1000 points

### Points Bonus
L'équipe ou l'admin peut ajouter des bonus pour :
- ✨ Qualité exceptionnelle
- 🚀 Innovation
- 📚 Documentation complète
- ⚡ Délai respecté

### Total
```
Points totaux = Points de base + Bonus
```

---

## 🔐 Qui peut faire quoi ?

| Action | Membre d'équipe | Admin |
|--------|----------------|-------|
| Soumettre un score | ✅ OUI | ❌ Non |
| Voir ses scores | ✅ OUI | ✅ OUI |
| Valider un score | ❌ Non | ✅ OUI |
| Rejeter un score | ❌ Non | ✅ OUI |

---

## ⚙️ Règles Importantes

✅ **Un seul score par équipe et par défi**
- Si vous avez déjà soumis pour ce défi, vous ne pouvez pas en soumettre un autre
- Vous pouvez modifier avant validation si besoin

✅ **Seuls les scores validés comptent**
- Les scores en attente ne comptent pas
- Les scores rejetés ne comptent pas

✅ **Le classement est automatique**
- Mis à jour après chaque validation
- Visible en temps réel par tous

✅ **La validation est définitive**
- Une fois validé, le score ne peut plus être modifié
- L'admin peut ajouter des notes pour expliquer

---

## 📊 Interface Utilisateur

### Pour les Équipes

**Page "Soumettre un Score"** :
```
┌─────────────────────────────────────┐
│  Défi : [Sélectionner défi ▼]      │
│  Points : [200]                     │
│  Bonus : [50]                       │
│  Notes : [Détails de la réalisation]│
│                                     │
│  [Soumettre le Score]               │
└─────────────────────────────────────┘
```

**Page "Mon Équipe"** :
```
📊 Scores de l'équipe :
  ✅ API REST - 350 pts (Validé)
  ⏳ Optimisation Web - 200 pts (En attente)
  ✅ Logo Design - 75 pts (Validé)
  
Total : 425 points
Rang : 3ème
```

### Pour les Admins

**Dashboard Admin** :
```
⏳ Scores en attente de validation :
  - Équipe "Les Champions" : Défi "API REST" (350 pts)
  - Équipe "Tech Masters" : Défi "Logo Design" (75 pts)
  
[Voir détails] [Valider] [Rejeter]
```

---

## 🚀 Avantages du Système

✅ **Équitable** : Tous les scores sont vérifiés par un admin
✅ **Transparent** : Chaque équipe voit l'état de ses scores
✅ **Automatique** : Le classement se met à jour seul
✅ **Temps réel** : Mises à jour instantanées via WebSocket
✅ **Flexible** : Possibilité d'ajouter des bonus

---

## 📞 Besoin d'aide ?

- **Pour soumettre** : Allez sur la page "Soumettre un Score"
- **Pour voir vos scores** : Consultez la page de votre équipe
- **Pour valider** (admin) : Utilisez le dashboard admin

---

**Le système est simple, équitable et automatique ! 🎯**

