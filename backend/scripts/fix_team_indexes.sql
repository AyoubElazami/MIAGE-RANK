-- Script pour corriger les index en trop dans la table Teams
-- Exécutez ce script dans MySQL si vous avez l'erreur "Trop de clefs sont définies"

-- Voir tous les index de la table Teams
SHOW INDEX FROM Teams;

-- Supprimer les index en double (si nécessaire)
-- ATTENTION: Ne supprimez que les index en double, pas les index nécessaires

-- Exemple pour supprimer un index spécifique (remplacez 'index_name' par le nom réel)
-- DROP INDEX index_name ON Teams;

-- Recréer uniquement les index nécessaires
-- L'index unique sur 'name' est créé automatiquement par Sequelize
-- Les autres index sont définis dans le modèle

-- Si vous avez trop d'index, vous pouvez supprimer la table et la recréer
-- ATTENTION: Cela supprimera toutes les données !
-- DROP TABLE IF EXISTS Teams;
-- Puis redémarrez le serveur pour que Sequelize recrée la table

