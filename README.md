# MiageRank - Système de Gamification

Application web de gestion de compétitions, défis et classements d'équipes avec système multi-admin.__

## Technologies

**Frontend:** React 18, Vite, React Router, Axios, Socket.io Client  
**Backend:** Node.js, Express, Sequelize, MySQL, Socket.io, JWT  
**Infrastructure:** AWS S3 (Frontend), AWS EC2 (Backend), AWS RDS (MySQL)

## Installation env

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run add-createdby
npm run add-work-submission
npm run add-admins
npm start
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Configuration

### Backend (.env)
```
NODE_ENV=production
PORT=8080
DB_HOST=your-rds-endpoint
DB_NAME=miagerank
DB_USER=admin
DB_PASSWORD=your_password
DB_PORT=3306
JWT_SECRET=your_secret_key
FRONTEND_URL=http://your-frontend-url
```

### Frontend (.env)
```
VITE_API_URL=http://your-backend-url:8080/api
VITE_SOCKET_URL=http://your-backend-url:8080
```

## Structure

```
MiageRank/
├── frontend/          # React app
│   ├── src/
│   │   ├── pages/     # Pages (Auth, Dashboard, Teams, Challenges, etc.)
│   │   ├── components/# Composants réutilisables
│   │   ├── services/  # Services API
│   │   └── contexts/ # Context API
│   └── package.json
├── backend/           # Node.js API
│   ├── config/        # Configuration DB
│   ├── controllers/   # Contrôleurs
│   ├── models/        # Modèles Sequelize
│   ├── routes/        # Routes Express
│   ├── middleware/    # Middlewares
│   ├── services/      # Services (Socket.io)
│   ├── scripts/       # Scripts utilitaires
│   └── app.js         # Point d'entrée
└── README.md
```

## Fonctionnalités

### Utilisateurs
- Inscription/Connexion
- Création/Rejoindre équipe
- Participation aux défis
- Soumission de travail (lien)
- Consultation du classement

### Administrateurs
- Dashboard avec statistiques
- Création/Gestion de défis
- Validation des scores
- Gestion des utilisateurs
- Vue isolée de ses défis

## API Principale

**Auth:** `POST /api/auth/register`, `POST /api/auth/login`  
**Teams:** `GET /api/teams`, `POST /api/teams`  
**Challenges:** `GET /api/challenges`, `POST /api/challenges` (Admin)  
**Scores:** `POST /api/scores`, `PUT /api/scores/:id/validate` (Admin)  
**Ranking:** `GET /api/ranking`, `GET /api/ranking/statistics`  
**Admin:** `GET /api/admin/dashboard`, `GET /api/challenges/admin/my-challenges`

## Base de Données

**Tables:** Users, Teams, TeamMembers, Challenges, Scores  
**Relations:** User → TeamMember → Team, User → Challenge (createdBy), Challenge → Score, Team → Score

## Déploiement AWS

**Frontend:** Build → S3 (Static Website Hosting)  
**Backend:** Code → EC2 → PM2  
**Database:** RDS MySQL

Script de déploiement: `backend/deploy-final.ps1`

## Scripts Utiles

```bash
npm run add-createdby          # Ajouter colonne createdBy
npm run add-work-submission    # Ajouter colonne workSubmission
npm run add-admins             # Créer 20 admins et défis
npm run fix-indexes            # Corriger index MySQL
```

## Système Multi-Admin

20 administrateurs peuvent créer et gérer leurs propres défis. Chaque admin ne voit et ne valide que les scores de ses défis.

## Workflow Notation

1. Équipe participe à un défi → Soumet un lien
2. Score créé avec status "pending"
3. Admin valide/rejette avec notes
4. Points ajoutés au total de l'équipe
5. Classement mis à jour en temps réel (Socket.io)
