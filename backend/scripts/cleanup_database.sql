-- Script de nettoyage pour corriger les problèmes d'index
-- À utiliser si vous avez l'erreur "Trop de clefs sont définies"

-- 1. Voir tous les index de chaque table
SHOW INDEX FROM Teams;
SHOW INDEX FROM Users;
SHOW INDEX FROM Challenges;
SHOW INDEX FROM Scores;
SHOW INDEX FROM TeamMembers;

-- 2. Si Teams a trop d'index, vous pouvez :
-- Option A: Supprimer les index non essentiels manuellement
-- Option B: Supprimer et recréer la table (ATTENTION: perte de données)

-- Option B (si vous n'avez pas de données importantes dans Teams):
-- DROP TABLE IF EXISTS TeamMembers;
-- DROP TABLE IF EXISTS Scores;
-- DROP TABLE IF EXISTS Teams;
-- Puis redémarrez le serveur

-- 3. Vérifier le nombre d'index
SELECT 
    TABLE_NAME,
    COUNT(*) as INDEX_COUNT
FROM 
    INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = 'MIAGERANK'
    AND TABLE_NAME = 'Teams'
GROUP BY 
    TABLE_NAME;

