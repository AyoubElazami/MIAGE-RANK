# 📚 Guide d'Utilisation Complet - Système Multi-Admins

## ✅ SYSTÈME COMPLET CRÉÉ !

J'ai créé un système professionnel où chaque admin gère ses défis et reçoit uniquement les participations à ses défis.

---

## 🚀 Démarrage Rapide

### Étape 1 : Ajouter les Admins et Défis

```bash
cd backend
npm run add-admins
```

**Cela créera :**
- ✅ 20 admins avec emails uniques
- ✅ ~30 défis (1-2 par admin)
- ✅ Chaque défi assigné à son créateur

---

### Étape 2 : Se Connecter en tant qu'Admin

**Exemples de comptes créés :**

| Email | Password |
|-------|----------|
| `admin.technique1@miagerank.fr` | `Admin123!` |
| `admin.creativite1@miagerank.fr` | `Admin123!` |
| `admin.innovation1@miagerank.fr` | `Admin123!` |

Voir `backend/scripts/README_ADMINS.md` pour la liste complète.

---

## 👨‍💼 Utilisation pour les Admins

### 1. Voir Mes Défis

```
URL : /admin/my-challenges

Affiche :
- Liste de tous les défis créés par vous
- Nombre de participations par défi
- Nombre en attente de validation
- Bouton pour créer un nouveau défi
```

### 2. Créer un Défi

```
URL : /admin/challenges/create

Formulaire avec :
- Titre *
- Description *
- Catégorie *
- Difficulté *
- Points *
- Date de début *
- Date de fin (optionnel)
- Équipes max (optionnel)
- Défi actif (checkbox)
```

**Le défi est automatiquement assigné à vous !**

### 3. Voir les Participations

```
URL : /admin/participations

Affiche :
- Liste des participations à VOS défis uniquement
- Filtre par statut (en attente/validé/rejeté)
- Filtre par défi
- Badge avec nombre en attente
```

### 4. Noter une Participation

```
Cliquer sur une participation
  ↓
Voir :
- Le travail soumis (lien cliquable) 🔗
- Les notes de l'équipe
- Les points proposés
  ↓
Vous pouvez :
- Ajuster les points
- Ajouter un bonus
- Valider ou Rejeter
- Ajouter des notes
```

---

## 👥 Utilisation pour les Équipes

### 1. Voir les Défis

```
URL : /challenges

Affiche :
- Tous les défis actifs
- Filtres par catégorie et difficulté
- Défis de tous les admins
```

### 2. Participer à un Défi

```
URL : /scores

Formulaire avec :
- Sélection du défi *
- Sélection de l'équipe *
- Lien vers le travail * (GitHub, Drive, etc.)
- Points mérités *
- Bonus (optionnel)
- Notes explicatives (optionnel)
```

**⚠️ Important :** Vous devez fournir un lien vers votre travail !

### 3. Suivre les Participations

```
URL : /scores/all

Affiche :
- Tous vos scores soumis
- Statut de chaque participation
- Liens vers les détails
```

---

## 🔄 Exemple Complet

### Scénario 1 : Admin "Marie"

**Étape 1 : Créer un Défi**
- Se connecte avec `admin.technique1@miagerank.fr`
- Va sur "Mes défis" → "Créer un défi"
- Crée "API REST Avancée" (300 pts)
- Défi assigné automatiquement à Marie

**Étape 2 : Recevoir une Participation**
- Équipe "Les Champions" participe
- Soumet : lien GitHub + notes
- Marie voit dans "Participations à mes défis"

**Étape 3 : Noter**
- Clique sur la participation
- Voit le lien GitHub (cliquable)
- Ajuste les points : 300 + 50 bonus = 350
- Valide
- Équipe gagne 350 points

### Scénario 2 : Équipe "Les Champions"

**Étape 1 : Participer**
- Voir le défi "API REST Avancée"
- Réaliser le travail
- Aller sur "Soumettre un Score"
- Remplir :
  - Défi : "API REST Avancée"
  - Lien : `https://github.com/team/api-rest`
  - Points : 300
  - Notes : "API complète avec tests"

**Étape 2 : Attendre**
- Score créé avec statut "en attente"
- Attendre la validation de l'admin créateur

**Étape 3 : Recevoir les Points**
- Admin valide
- 350 points ajoutés au total
- Classement mis à jour

---

## 🔐 Sécurité et Isolation

### ✅ Isolation des Admins

**Chaque admin voit uniquement :**
- ✅ SES défis créés
- ✅ Les participations à SES défis
- ❌ PAS les défis d'autres admins
- ❌ PAS les participations aux défis d'autres admins

### ✅ Vérifications

**Backend vérifie automatiquement :**
- ✅ Seul le créateur peut valider son défi
- ✅ Filtrage automatique par `createdBy`
- ✅ Impossible de modifier les défis d'autres admins

---

## 📊 Routes Disponibles

### Admin

| Route | Description |
|-------|-------------|
| `/admin/my-challenges` | Mes défis créés |
| `/admin/challenges/create` | Créer un défi |
| `/admin/participations` | Participations à mes défis |
| `/admin/participations/:id/validate` | Noter une participation |

### Équipe

| Route | Description |
|-------|-------------|
| `/challenges` | Voir tous les défis |
| `/scores` | Soumettre une participation |
| `/scores/all` | Voir toutes les participations |

---

## 🎯 Fonctionnalités Clés

### ✅ Pour les Admins

- Créer des défis et les gérer
- Voir uniquement ses défis
- Recevoir uniquement ses participations
- Voir le travail soumis (lien)
- Noter et valider/rejeter
- Ajuster les points si besoin

### ✅ Pour les Équipes

- Voir tous les défis actifs
- Participer à n'importe quel défi
- Soumettre le travail (lien)
- Suivre le statut de la participation
- Recevoir les points si validé

---

## 📝 Checklist d'Utilisation

### Admin

- [ ] Se connecter avec un compte admin
- [ ] Créer un défi (ou utiliser ceux créés par le script)
- [ ] Voir "Mes défis"
- [ ] Voir "Participations à mes défis"
- [ ] Noter une participation
- [ ] Valider avec points ajustés

### Équipe

- [ ] Se connecter
- [ ] Créer ou rejoindre une équipe
- [ ] Voir les défis actifs
- [ ] Participer à un défi
- [ ] Soumettre le travail (lien)
- [ ] Suivre le statut

---

## 🎉 Résultat

**Système complet et professionnel** avec :
- ✅ Isolation des admins
- ✅ Gestion des défis par admin
- ✅ Soumission de travail (lien)
- ✅ Notation et validation
- ✅ Design moderne et accessible

---

**Tout est prêt ! Testez le système maintenant ! 🚀**

