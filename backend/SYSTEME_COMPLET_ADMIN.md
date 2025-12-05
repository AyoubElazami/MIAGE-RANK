# 🎯 Système Complet - Admins et Défis

## 📋 Vue d'ensemble

Chaque admin peut créer ses propres défis et ne reçoit que les participations à SES défis pour les noter.

---

## 🔐 Système Multi-Admins

### Principe

1. **Plusieurs admins** (20 par exemple)
2. **Chaque admin crée 1-2 défis**
3. **Chaque admin reçoit uniquement les participations de SES défis**
4. **Chaque admin note les participations de SES défis**

---

## 📊 Structure

### Modèle Challenge

- ✅ Nouveau champ `createdBy` : ID de l'admin créateur
- ✅ Relation avec User (creator)

### Modèle Score

- ✅ Nouveau champ `workSubmission` : Lien vers le travail (GitHub, Drive, etc.)
- ✅ Nouveau champ `workFiles` : URLs des fichiers (pour futur upload)

---

## 🔄 Processus Complet

### 1. Admin Crée un Défi

```
Admin se connecte
  ↓
Va sur "Mes défis" → "Créer un défi"
  ↓
Remplit le formulaire :
  - Titre
  - Description
  - Catégorie
  - Difficulté
  - Points
  - Dates
  ↓
Défi créé avec createdBy = ID de l'admin
```

### 2. Équipe Participe

```
Équipe voit le défi actif
  ↓
Réalise le travail
  ↓
Va sur "Soumettre un Score"
  ↓
Remplit :
  - Défi sélectionné
  - Équipe
  - Lien vers le travail (GitHub, Drive, etc.)
  - Points mérités
  - Notes explicatives
  ↓
Score créé avec status = "pending"
```

### 3. Admin Reçoit la Participation

```
Admin se connecte
  ↓
Va sur "Participations à mes défis"
  ↓
Voit uniquement les participations à SES défis
  ↓
Voir le travail soumis (lien cliquable)
  ↓
Peut noter et valider/rejeter
```

### 4. Admin Note et Valide

```
Admin clique sur une participation
  ↓
Voit :
  - Le travail (lien)
  - Les notes de l'équipe
  - Les points proposés
  ↓
Peut ajuster les points
  ↓
Valide ou Rejette
  ↓
Points ajoutés à l'équipe si validé
```

---

## 🎯 Fonctionnalités

### Pour les Admins

✅ **Créer des défis**
- Interface dédiée
- Défi assigné automatiquement à l'admin

✅ **Voir ses défis**
- Liste de tous ses défis
- Nombre de participations par défi
- Nombre en attente

✅ **Voir les participations**
- Uniquement pour SES défis
- Filtre par statut
- Filtre par défi

✅ **Noter les participations**
- Voir le travail soumis (lien)
- Ajuster les points
- Ajouter bonus
- Valider ou Rejeter

### Pour les Équipes

✅ **Voir tous les défis actifs**
- De tous les admins
- Filtres par catégorie/difficulté

✅ **Participer à un défi**
- Soumettre le travail (lien)
- Indiquer les points mérités
- Ajouter des notes

✅ **Suivre les participations**
- Voir le statut (en attente/validé/rejeté)
- Voir les notes de l'admin

---

## 📡 API Endpoints

### Pour les Admins

```bash
# Créer un défi
POST /api/challenges
Body: { title, description, category, points, difficulty, ... }
→ Défi créé avec createdBy = admin.id

# Voir mes défis
GET /api/challenges/admin/my-challenges
→ Liste des défis créés par l'admin connecté

# Voir les participations à mes défis
GET /api/scores/admin/my-participations?status=pending&challengeId=1
→ Liste des scores pour les défis créés par l'admin
```

### Pour les Équipes

```bash
# Soumettre une participation
POST /api/scores/submit
Body: {
  challengeId: 1,
  teamId: 2,
  points: 300,
  bonus: 50,
  workSubmission: "https://github.com/...",
  notes: "..."
}
```

---

## 🔐 Sécurité

✅ **Isolation des admins**
- Chaque admin ne voit que SES défis
- Chaque admin ne peut valider que SES défis
- Vérification du createdBy lors de la validation

✅ **Permissions**
- Seuls les admins peuvent créer des défis
- Seul le créateur peut valider ses défis
- Les équipes ne peuvent soumettre qu'une fois par défi

---

## 📊 Exemple

### Admin "Marie" (ID: 5)

**Créé 2 défis :**
1. "API REST" (ID: 10)
2. "Design UI" (ID: 15)

**Reçoit uniquement :**
- Participations pour le défi 10
- Participations pour le défi 15

**Ne voit PAS :**
- Participations pour les défis d'autres admins

---

## 🚀 Utilisation

### Script pour Ajouter 20 Admins

```bash
cd backend
node scripts/addAdminsAndChallenges.js
```

Ce script crée :
- 20 admins avec emails uniques
- 1-2 défis par admin
- Défis variés dans toutes les catégories

### Connexion Admin

Chaque admin peut se connecter avec :
- Email : `admin.technique1@miagerank.fr`
- Password : `Admin123!`

---

**Le système est complet et prêt ! 🎉**

