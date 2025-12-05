# Script PowerShell pour configurer les variables d'environnement Elastic Beanstalk
# ⚠️ REMPLACEZ LES VALEURS AVANT D'EXECUTER !

# ============================================
# CONFIGURATION
# ============================================

# Informations RDS
$DB_HOST = "miagerank-db.c74s2aykmqbd.eu-west-3.rds.amazonaws.com"
$DB_NAME = "miagerank"
$DB_USER = "admin"
$DB_PASSWORD = "VOTRE_MOT_DE_PASSE_RDS"  # ⚠️ REMPLACEZ !
$DB_PORT = "3306"

# JWT Secret (généré précédemment)
$JWT_SECRET = "VOTRE_JWT_SECRET"  # ⚠️ REMPLACEZ par celui généré !

# Frontend URL
$FRONTEND_URL = "http://miagerank-frontend-ayoub.s3-website.eu-west-3.amazonaws.com"

# Autres
$NODE_ENV = "production"
$PORT = "8080"

# ============================================
# CONFIGURATION DES VARIABLES
# ============================================

Write-Host "`n=== Configuration des variables d'environnement ===" -ForegroundColor Cyan
Write-Host "`n⚠️  Assurez-vous d'avoir remplacé:" -ForegroundColor Yellow
Write-Host "  - DB_PASSWORD" -ForegroundColor White
Write-Host "  - JWT_SECRET" -ForegroundColor White
Write-Host "`nAppuyez sur Entree pour continuer..." -ForegroundColor Gray
Read-Host

Write-Host "`nConfiguration en cours..." -ForegroundColor Yellow

# Configuration en une seule commande
$envCommand = "eb setenv DB_HOST=$DB_HOST DB_NAME=$DB_NAME DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_PORT=$DB_PORT JWT_SECRET=$JWT_SECRET FRONTEND_URL=$FRONTEND_URL NODE_ENV=$NODE_ENV PORT=$PORT"

Write-Host "`nCommande a executer:" -ForegroundColor Cyan
Write-Host $envCommand -ForegroundColor Gray
Write-Host "`nVoulez-vous executer cette commande maintenant? (O/N)" -ForegroundColor Yellow
$confirm = Read-Host

if ($confirm -eq "O" -or $confirm -eq "o" -or $confirm -eq "Y" -or $confirm -eq "y") {
    Invoke-Expression $envCommand
    Write-Host "`n✅ Variables d'environnement configurees!" -ForegroundColor Green
    Write-Host "`nVerification..." -ForegroundColor Cyan
    eb printenv
} else {
    Write-Host "`nCommande annulee. Copiez la commande ci-dessus et executez-la manuellement." -ForegroundColor Yellow
}

