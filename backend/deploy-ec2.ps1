# Script de déploiement sur EC2
# Instance: miagerank-env-new (i-0781a8f7b8ee98381)

$EC2_IP = "52.47.70.112"
$EC2_DNS = "ec2-52-47-70-112.eu-west-3.compute.amazonaws.com"
$EC2_USER = "ec2-user"  # Amazon Linux
$SSH_KEY_NAME = "paireCle"

# Chercher la clé SSH dans plusieurs emplacements
$possiblePaths = @(
    "C:\Users\mahdi\Downloads\paireCle.pem",  # Trouvé ici !
    "C:\Users\mahdi\.ssh\paireCle.pem",
    "C:\Users\mahdi\Desktop\paireCle.pem",
    "$env:USERPROFILE\.ssh\paireCle.pem",
    "$env:USERPROFILE\Downloads\paireCle.pem"
)

$SSH_KEY = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $SSH_KEY = $path
        break
    }
}

# Si la clé n'est pas trouvée, demander le chemin
if (-not $SSH_KEY) {
    Write-Host "`n❌ Clé SSH non trouvée automatiquement" -ForegroundColor Yellow
    Write-Host "`nEmplacements vérifiés:" -ForegroundColor Gray
    foreach ($path in $possiblePaths) {
        Write-Host "  - $path" -ForegroundColor Gray
    }
    Write-Host "`nEntrez le chemin complet de votre clé SSH (.pem):" -ForegroundColor Yellow
    $SSH_KEY = Read-Host "Chemin"
    
    if (-not (Test-Path $SSH_KEY)) {
        Write-Host "`n❌ Clé SSH non trouvée: $SSH_KEY" -ForegroundColor Red
        Write-Host "`nTéléchargez la clé depuis AWS Console:" -ForegroundColor Yellow
        Write-Host "  EC2 → Key Pairs → paireCle → Download" -ForegroundColor Gray
        exit 1
    }
}

# Informations RDS
$DB_HOST = "miagerank-db.c74s2aykmqbd.eu-west-3.rds.amazonaws.com"
$DB_NAME = "miagerank"
$DB_USER = "admin"
$DB_PASSWORD = "Azertyazerty123."  # ⚠️ REMPLACEZ !
$DB_PORT = "3306"

# JWT Secret
$JWT_SECRET = "VywXh9FMY13IR2Hpmx5rl70Eu6S8ZCLBtWbQjfANJksizcqdgOnaKPUvTGDoe4"

# Frontend URL
$FRONTEND_URL = "http://miagerank-frontend-ayoub.s3-website.eu-west-3.amazonaws.com"

Write-Host "`n=== DEPLOIEMENT SUR EC2 ===" -ForegroundColor Cyan
Write-Host "Instance: $EC2_DNS ($EC2_IP)" -ForegroundColor Green
Write-Host "User: $EC2_USER" -ForegroundColor Green
Write-Host "`n⚠️  Assurez-vous d'avoir remplace DB_PASSWORD dans ce script!" -ForegroundColor Yellow
Write-Host "`nAppuyez sur Entree pour continuer..." -ForegroundColor Gray
Read-Host

# Vérifier que la clé SSH existe
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "`n❌ Clé SSH non trouvée: $SSH_KEY" -ForegroundColor Red
    Write-Host "Vérifiez le chemin de la clé SSH!" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n✅ Clé SSH trouvée" -ForegroundColor Green

# Créer le script de déploiement à exécuter sur l'instance
$deployScript = @"
#!/bin/bash
set -e

echo "=== Installation des dépendances ==="
sudo yum update -y
sudo yum install -y git

# Installer Node.js 20 (toujours installer depuis NodeSource pour avoir la dernière version)
echo "Installation de Node.js 20..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Vérifier l'installation
node --version
npm --version

# Installer PM2 globalement
echo "Installation de PM2..."
sudo npm install -g pm2

# Vérifier l'installation de PM2
pm2 --version

# Installer MySQL client (pour tester la connexion)
sudo yum install -y mysql

echo "=== Création du répertoire de l'application ==="
sudo mkdir -p /var/www/miagerank
sudo chown ec2-user:ec2-user /var/www/miagerank
cd /var/www/miagerank

echo "=== Clonage ou copie du code ==="
# Si vous avez un repo Git, utilisez git clone
# git clone https://votre-repo.git .

# Sinon, on va créer un script pour transférer les fichiers
echo "Le code sera transféré via SCP dans l'étape suivante"

echo "=== Configuration des variables d'environnement ==="
cat > .env << EOF
NODE_ENV=production
PORT=8080
DB_HOST=$DB_HOST
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_PORT=$DB_PORT
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=$FRONTEND_URL
EOF

chmod 600 .env

echo "=== Installation des dépendances npm ==="
npm install

echo "=== Initialisation de la base de données ==="
npm run add-createdby || true
npm run add-work-submission || true
npm run add-admins || true

echo "=== Configuration PM2 ==="
pm2 start app.js --name miagerank-backend
pm2 save
pm2 startup

echo "=== Configuration terminée ==="
echo "L'application devrait être accessible sur http://$EC2_IP:8080"
"@

# Sauvegarder le script
$deployScript | Out-File -FilePath "deploy-remote.sh" -Encoding utf8 -NoNewline

Write-Host "`n=== Étape 1: Transfert du code ===" -ForegroundColor Cyan
Write-Host "Transfert des fichiers vers l'instance..." -ForegroundColor Yellow

# Créer une archive du code (sans node_modules)
$excludeDirs = @("node_modules", ".git", ".ebextensions", ".elasticbeanstalk", "*.log")
$tempZip = "miagerank-backend-$(Get-Date -Format 'yyyyMMddHHmmss').zip"

Write-Host "Création de l'archive..." -ForegroundColor Gray
Compress-Archive -Path ".\*" -DestinationPath $tempZip -Force

Write-Host "Transfert de l'archive..." -ForegroundColor Gray
scp -i $SSH_KEY $tempZip ${EC2_USER}@${EC2_IP}:/tmp/miagerank-backend.zip

Write-Host "✅ Code transféré" -ForegroundColor Green

Write-Host "`n=== Étape 2: Exécution du script de déploiement ===" -ForegroundColor Cyan
Write-Host "Connexion SSH et exécution du script..." -ForegroundColor Yellow

# Transférer le script de déploiement
scp -i $SSH_KEY deploy-remote.sh ${EC2_USER}@${EC2_IP}:/tmp/deploy.sh

# Exécuter le script
ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} "chmod +x /tmp/deploy.sh && /tmp/deploy.sh"

Write-Host "`n=== Étape 3: Configuration finale ===" -ForegroundColor Cyan

# Script de configuration finale
$finalConfig = @"
cd /var/www/miagerank
echo "=== Extraction de l'archive ==="
unzip -o /tmp/miagerank-backend.zip -d . 2>&1

echo "=== Installation des dépendances npm ==="
npm install --production

echo "=== Démarrage de l'application avec PM2 ==="
# Arrêter l'ancienne instance si elle existe
pm2 stop miagerank-backend 2>/dev/null || true
pm2 delete miagerank-backend 2>/dev/null || true

# Démarrer l'application
pm2 start app.js --name miagerank-backend
pm2 save
pm2 startup

echo "=== Statut de l'application ==="
pm2 status

echo "=== Logs récents ==="
pm2 logs miagerank-backend --lines 20 --nostream
"@

$finalConfig | ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP}

Write-Host "`n=== Déploiement terminé ===" -ForegroundColor Green
Write-Host "`nL'application devrait être accessible sur:" -ForegroundColor Cyan
Write-Host "  http://$EC2_IP:8080" -ForegroundColor Green
Write-Host "  http://$EC2_DNS:8080" -ForegroundColor Green
Write-Host "`nPour vérifier le statut:" -ForegroundColor Yellow
Write-Host "  ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} 'pm2 status'" -ForegroundColor Gray
Write-Host "`nPour voir les logs:" -ForegroundColor Yellow
Write-Host "  ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} 'pm2 logs miagerank-backend'" -ForegroundColor Gray

# Nettoyer
Remove-Item $tempZip -ErrorAction SilentlyContinue
Remove-Item deploy-remote.sh -ErrorAction SilentlyContinue

