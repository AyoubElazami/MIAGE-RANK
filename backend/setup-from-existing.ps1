# Script pour configurer depuis le code déjà transféré
# Le fichier zip existe déjà dans /var/www/

$EC2_IP = "52.47.70.112"
$EC2_USER = "ec2-user"
$SSH_KEY = "C:\Users\mahdi\Downloads\paireCle.pem"

# Informations RDS
$DB_HOST = "miagerank-db.c74s2aykmqbd.eu-west-3.rds.amazonaws.com"
$DB_NAME = "miagerank"
$DB_USER = "admin"
$DB_PASSWORD = "Azertyazerty123."
$DB_PORT = "3306"
$JWT_SECRET = "VywXh9FMY13IR2Hpmx5rl70Eu6S8ZCLBtWbQjfANJksizcqdgOnaKPUvTGDoe4"
$FRONTEND_URL = "http://miagerank-frontend-ayoub.s3-website.eu-west-3.amazonaws.com"

Write-Host "`n=== CONFIGURATION DEPUIS LE CODE EXISTANT ===" -ForegroundColor Cyan

# Vérifier la clé SSH
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "`n❌ Clé SSH non trouvée: $SSH_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Clé SSH trouvée" -ForegroundColor Green

# Script complet à exécuter
$setupScript = "sudo mkdir -p /var/www/miagerank && sudo chown ec2-user:ec2-user /var/www/miagerank && " +
"cd /var/www/miagerank && " +
"echo '=== Extraction de l archive existante ===' && " +
"unzip -o /var/www/miagerank-backend.zip -d . 2>&1 | head -20 && " +
"echo '' && echo '=== Installation de Node.js 20 ===' && " +
"if ! command -v node > /dev/null 2>&1; then curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash - && sudo yum install -y nodejs; fi && " +
"node --version && npm --version && " +
"echo '' && echo '=== Installation de PM2 ===' && " +
"if ! command -v pm2 > /dev/null 2>&1; then sudo npm install -g pm2; fi && " +
"pm2 --version && " +
"echo '' && echo '=== Configuration du fichier .env ===' && " +
"echo 'NODE_ENV=production' > .env && " +
"echo 'PORT=8080' >> .env && " +
"echo 'DB_HOST=$DB_HOST' >> .env && " +
"echo 'DB_NAME=$DB_NAME' >> .env && " +
"echo 'DB_USER=$DB_USER' >> .env && " +
"echo 'DB_PASSWORD=$DB_PASSWORD' >> .env && " +
"echo 'DB_PORT=$DB_PORT' >> .env && " +
"echo 'JWT_SECRET=$JWT_SECRET' >> .env && " +
"echo 'FRONTEND_URL=$FRONTEND_URL' >> .env && " +
"chmod 600 .env && " +
"echo 'Fichier .env cree' && " +
"echo '' && echo '=== Installation des dependances npm ===' && " +
"npm install --production && " +
"echo '' && echo '=== Initialisation de la base de donnees ===' && " +
"(npm run add-createdby 2>&1 || echo 'Script add-createdby termine') && " +
"(npm run add-work-submission 2>&1 || echo 'Script add-work-submission termine') && " +
"(npm run add-admins 2>&1 || echo 'Script add-admins termine') && " +
"echo '' && echo '=== Demarrage de l application ===' && " +
"pm2 stop miagerank-backend 2>/dev/null || true && " +
"pm2 delete miagerank-backend 2>/dev/null || true && " +
"pm2 start app.js --name miagerank-backend && " +
"pm2 save && " +
"echo '' && echo '=== Statut ===' && " +
"pm2 status && " +
"echo '' && echo '=== Logs recents (attente 5 secondes) ===' && " +
"sleep 5 && " +
"pm2 logs miagerank-backend --lines 50 --nostream"

Write-Host "`nExécution du script de configuration..." -ForegroundColor Yellow
Write-Host "Cela peut prendre 5-10 minutes..." -ForegroundColor Gray

# Exécuter le script
ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} $setupScript

Write-Host "`n=== Configuration terminée ===" -ForegroundColor Green
Write-Host "`nL'application devrait être accessible sur:" -ForegroundColor Cyan
Write-Host "  http://$EC2_IP:8080" -ForegroundColor Green
Write-Host "`nPour vérifier le statut:" -ForegroundColor Yellow
Write-Host "  ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} 'pm2 status'" -ForegroundColor Gray
Write-Host "`nPour voir les logs:" -ForegroundColor Yellow
Write-Host "  ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} 'pm2 logs miagerank-backend'" -ForegroundColor Gray

