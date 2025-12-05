#!/bin/bash
# Script d'initialisation de la base de données après déploiement
# Ce script s'exécute automatiquement après chaque déploiement

cd /var/app/current

# Attendre que la base de données soit prête
echo "Attente de la connexion à la base de données..."
sleep 10

# Exécuter les scripts d'initialisation si nécessaire
# Décommentez les lignes suivantes si vous voulez initialiser automatiquement
# node scripts/addCreatedByColumn.js
# node scripts/addWorkSubmissionColumn.js

echo "Initialisation de la base de données terminée"

