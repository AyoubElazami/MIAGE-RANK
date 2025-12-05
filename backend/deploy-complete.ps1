# Script complet de déploiement sur EC2
# Crée le répertoire, transfère le code, installe et démarre

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

Write-Host "`n=== DEPLOIEMENT COMPLET SUR EC2 ===" -ForegroundColor Cyan

# Vérifier la clé SSH
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "`n❌ Clé SSH non trouvée: $SSH_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Clé SSH trouvée" -ForegroundColor Green

# Étape 1: Créer le répertoire et installer les dépendances système
Write-Host "`n=== Étape 1: Préparation de l'environnement ===" -ForegroundColor Yellow
$step1 = "sudo mkdir -p /var/www/miagerank && sudo chown ec2-user:ec2-user /var/www/miagerank && " +
"echo '=== Installation de Node.js 20 ===' && " +
"if ! command -v node > /dev/null 2>&1; then curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash - && sudo yum install -y nodejs; fi && " +
"node --version && npm --version && " +
"echo '=== Installation de PM2 ===' && " +
"if ! command -v pm2 > /dev/null 2>&1; then sudo npm install -g pm2; fi && " +
"pm2 --version"

ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} $step1

# Étape 2: Créer l'archive du code
Write-Host "`n=== Étape 2: Création de l'archive ===" -ForegroundColor Yellow
$tempZip = "miagerank-backend-$(Get-Date -Format 'yyyyMMddHHmmss').zip"
Write-Host "Création de l'archive: $tempZip" -ForegroundColor Gray

# Exclure certains fichiers
$exclude = @("node_modules", ".git", ".ebextensions", ".elasticbeanstalk", "*.log", "*.zip")
Get-ChildItem -Path . -Exclude $exclude | Compress-Archive -DestinationPath $tempZip -Force

Write-Host "✅ Archive créée" -ForegroundColor Green

# Étape 3: Transférer l'archive
Write-Host "`n=== Étape 3: Transfert du code ===" -ForegroundColor Yellow
scp -i $SSH_KEY $tempZip ${EC2_USER}@${EC2_IP}:/tmp/miagerank-backend.zip
Write-Host "✅ Code transféré" -ForegroundColor Green

# Étape 4: Extraire et configurer
Write-Host "`n=== Étape 4: Configuration de l'application ===" -ForegroundColor Yellow
$step4 = "cd /var/www/miagerank && " +
"echo '=== Extraction de l archive ===' && " +
"unzip -o /tmp/miagerank-backend.zip -d . && " +
"echo '=== Configuration du fichier .env ===' && " +
"cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=8080
DB_HOST=$DB_HOST
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_PORT=$DB_PORT
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=$FRONTEND_URL
ENVEOF
" +
"chmod 600 .env && " +
"echo '=== Installation des dependances npm ===' && " +
"npm install --production && " +
"echo '=== Initialisation de la base de donnees ===' && " +
"(npm run add-createdby || true) && " +
"(npm run add-work-submission || true) && " +
"(npm run add-admins || true) && " +
"echo '=== Demarrage de l application ===' && " +
"pm2 stop miagerank-backend 2>/dev/null || true && " +
"pm2 delete miagerank-backend 2>/dev/null || true && " +
"pm2 start app.js --name miagerank-backend && " +
"pm2 save && " +
"echo '' && echo '=== Statut ===' && " +
"pm2 status && " +
"echo '' && echo '=== Logs recents ===' && " +
"sleep 3 && " +
"pm2 logs miagerank-backend --lines 30 --nostream"

ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} $step4

# Nettoyer
Remove-Item $tempZip -ErrorAction SilentlyContinue

Write-Host "`n=== Déploiement terminé ===" -ForegroundColor Green
Write-Host "`nL'application devrait être accessible sur:" -ForegroundColor Cyan
Write-Host "  http://$EC2_IP:8080" -ForegroundColor Green
Write-Host "`nPour vérifier le statut:" -ForegroundColor Yellow
Write-Host "  ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} 'pm2 status'" -ForegroundColor Gray
Write-Host "`nPour voir les logs:" -ForegroundColor Yellow
Write-Host "  ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} 'pm2 logs miagerank-backend'" -ForegroundColor Gray

