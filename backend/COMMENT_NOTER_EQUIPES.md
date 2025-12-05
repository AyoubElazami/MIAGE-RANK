# 🎯 Comment les Équipes sont Notées - Guide Simplifié

## 📊 Le Système en 3 Étapes

```
┌─────────────────────────────────────────────────────────────┐
│                     PROCESSUS DE NOTATION                     │
└─────────────────────────────────────────────────────────────┘

1️⃣  L'ÉQUIPE SOUMET UN SCORE
    │
    ├─ Réalise un défi
    ├─ Va sur "Soumettre un Score"
    ├─ Remplit le formulaire :
    │  • Sélectionne le défi
    │  • Indique les points mérités (ex: 300)
    │  • Ajoute bonus optionnel (ex: 50)
    │  • Ajoute des notes explicatives
    │
    └─ Score créé avec statut "EN ATTENTE"
    
    ⚠️ L'équipe ne gagne PAS encore les points !


2️⃣  L'ADMIN VALIDE OU REJETTE
    │
    ├─ Admin reçoit notification
    ├─ Admin examine la réalisation
    ├─ Admin décide :
    │  • ✅ VALIDER → Équipe gagne les points
    │  • ❌ REJETER → Aucun point attribué
    │
    └─ Admin ajoute notes (optionnel)
    
    ✅ Seulement après validation, l'équipe gagne les points !


3️⃣  CALCUL AUTOMATIQUE
    │
    ├─ Le système calcule automatiquement :
    │  • totalScore = Somme de TOUS les scores validés
    │
    ├─ Le classement est mis à jour :
    │  • Trier par totalScore décroissant
    │  • Assigner les rangs (1er, 2ème, 3ème...)
    │
    └─ Tout est visible en temps réel !
    
    🔄 Tout est automatique et instantané !
```

---

## 📝 Exemple Concret

### Scénario : Équipe "Les Champions"

**Lundi 10h** :
- ✅ Réalise le défi "API REST Créative" (200 pts de base)
- ✅ Soumet : 200 points + 50 bonus = **250 points total**
- ⏳ Statut : **EN ATTENTE**
- 📊 totalScore actuel : **0** (pas encore validé)

**Mardi 14h** :
- ✅ Admin valide le score
- ✅ Statut : **VALIDÉ**
- ✅ totalScore mis à jour : **250 points**
- 🏆 Rang : **5ème**

**Mercredi 16h** :
- ✅ Réalise le défi "Optimisation Web" (350 pts)
- ✅ Soumet : 350 points
- ✅ Admin valide rapidement
- ✅ totalScore mis à jour : **250 + 350 = 600 points**
- 🏆 Rang : **3ème** (grâce aux nouveaux points)

---

## 🎯 Types de Points

### 1. Points de Base

Chaque défi a des points de base selon sa difficulté :

| Difficulté | Points |
|------------|--------|
| **Facile** | 50-100 pts |
| **Moyen** | 200-450 pts |
| **Difficile** | 500-900 pts |
| **Expert** | 1000 pts |

### 2. Points Bonus (Optionnel)

L'équipe ou l'admin peut ajouter des bonus pour :
- ✨ **Qualité exceptionnelle**
- 🚀 **Innovation**
- 📚 **Documentation complète**
- ⚡ **Délai respecté**

### 3. Total

```
Points totaux = Points de base + Bonus
```

**Exemple** :
- Défi : 200 points de base
- Bonus : 50 points pour qualité
- **Total : 250 points**

---

## 🔐 Qui peut faire quoi ?

| Action | Membre d'équipe | Admin |
|--------|----------------|-------|
| Soumettre un score | ✅ OUI | ❌ Non |
| Voir les scores | ✅ OUI | ✅ OUI |
| Valider un score | ❌ Non | ✅ OUI |
| Rejeter un score | ❌ Non | ✅ OUI |

---

## ⚙️ Règles Importantes

✅ **Un seul score par équipe et par défi**
- Si vous avez déjà soumis pour ce défi, vous ne pouvez pas en soumettre un autre
- Vous pouvez corriger avant validation si besoin

✅ **Seuls les scores validés comptent**
- Les scores en attente ⏳ ne comptent pas
- Les scores rejetés ❌ ne comptent pas
- Seuls les scores validés ✅ comptent

✅ **Le classement est automatique**
- Mis à jour après chaque validation
- Visible en temps réel par tous
- Pas besoin d'action manuelle

✅ **La validation est définitive**
- Une fois validé, le score ne peut plus être modifié
- L'admin peut ajouter des notes pour expliquer

---

## 📊 Comment ça marche dans l'Interface

### Pour les Équipes

**Page "Soumettre un Score"** :
```
┌──────────────────────────────────────┐
│  📝 Soumettre un Score               │
│                                      │
│  Défi : [Sélectionner défi ▼]       │
│  Points de base : 200                │
│                                      │
│  Points mérités : [200]              │
│  Bonus : [50]                        │
│                                      │
│  Notes :                             │
│  [API REST créée avec documentation  │
│   Swagger complète et tests...]      │
│                                      │
│  [Soumettre le Score]                │
└──────────────────────────────────────┘
```

**Page "Mon Équipe"** :
```
┌──────────────────────────────────────┐
│  🏆 Les Champions                    │
│                                      │
│  📊 Scores :                         │
│  ✅ API REST - 250 pts (Validé)      │
│  ⏳ Optimisation Web - 350 pts       │
│      (En attente de validation)      │
│  ✅ Logo Design - 75 pts (Validé)    │
│                                      │
│  Total : 325 points                  │
│  Rang : 3ème                         │
└──────────────────────────────────────┘
```

### Pour les Admins

**Dashboard Admin** :
```
┌──────────────────────────────────────┐
│  ⏳ Scores en attente (3)            │
│                                      │
│  📋 Équipe "Les Champions"           │
│     Défi : "API REST Créative"       │
│     Points : 250                     │
│     Notes : "API avec Swagger..."    │
│                                      │
│     [Voir détails] [✅ Valider]      │
│     [❌ Rejeter]                     │
└──────────────────────────────────────┘
```

---

## 🚀 Avantages du Système

✅ **Équitable** : Tous les scores sont vérifiés par un admin
✅ **Transparent** : Chaque équipe voit l'état de ses scores
✅ **Automatique** : Le classement se met à jour seul
✅ **Temps réel** : Mises à jour instantanées
✅ **Flexible** : Possibilité d'ajouter des bonus

---

## 📞 FAQ

**Q : Qui peut soumettre un score ?**  
R : Tout membre d'une équipe peut soumettre un score pour son équipe.

**Q : Combien de scores par défi ?**  
R : Un seul score par équipe et par défi.

**Q : Les points bonus sont-ils obligatoires ?**  
R : Non, c'est optionnel. L'équipe ou l'admin peut en ajouter.

**Q : Que se passe-t-il si un score est rejeté ?**  
R : L'équipe ne gagne aucun point, mais peut soumettre à nouveau après correction.

**Q : Le classement est-il automatique ?**  
R : Oui, le classement se met à jour automatiquement après chaque validation.

---

## 🎯 En Résumé

1. **L'équipe soumet** → Score en attente
2. **L'admin valide** → Points ajoutés
3. **Le système calcule** → Classement mis à jour

**C'est simple, équitable et automatique ! 🏆**

---

Pour plus de détails, consultez :
- `GUIDE_SYSTEME_NOTATION.md` - Guide complet
- `SCHEMA_NOTATION.md` - Schéma technique

