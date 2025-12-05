-- Script SQL pour créer le premier administrateur
-- À exécuter après avoir créé un utilisateur via l'API /api/auth/register

-- Méthode 1: Modifier un utilisateur existant en admin
-- Remplacez 'admin@miagerank.com' par l'email de votre utilisateur
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@miagerank.com';

-- Vérifier la modification
SELECT id, name, email, role, team_id, created_at 
FROM users 
WHERE email = 'admin@miagerank.com';

-- Méthode 2: Créer directement un admin (si vous préférez)
-- ATTENTION: Le mot de passe doit être hashé avec bcrypt
-- Il est recommandé d'utiliser l'API pour créer des utilisateurs

-- Pour créer un admin directement, utilisez plutôt l'API après avoir créé le premier admin

