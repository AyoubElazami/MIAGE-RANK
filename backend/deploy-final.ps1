# Script final de déploiement - Transfère le code et configure tout

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

Write-Host "`n=== DEPLOIEMENT FINAL SUR EC2 ===" -ForegroundColor Cyan

# Vérifier la clé SSH
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "`n❌ Clé SSH non trouvée: $SSH_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Clé SSH trouvée" -ForegroundColor Green

# Étape 1: Préparer l'environnement
Write-Host "`n=== Étape 1: Préparation de l'environnement ===" -ForegroundColor Yellow
$step1 = "sudo mkdir -p /var/www/miagerank && sudo chown ec2-user:ec2-user /var/www/miagerank && " +
"echo '=== Installation de Node.js 20 ===' && " +
"if ! command -v node > /dev/null 2>&1 || [ `$(node -v | cut -d'v' -f2 | cut -d'.' -f1)` -lt 20 ]; then curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash - && sudo yum install -y nodejs; fi && " +
"node --version && npm --version && " +
"echo '=== Installation de PM2 ===' && " +
"if ! command -v pm2 > /dev/null 2>&1; then sudo npm install -g pm2; fi && " +
"pm2 --version"

ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} $step1

# Étape 2: Créer l'archive
Write-Host "`n=== Étape 2: Création de l'archive ===" -ForegroundColor Yellow
$tempZip = "miagerank-backend-final.zip"
Write-Host "Création de l'archive..." -ForegroundColor Gray

# Supprimer l'ancienne archive si elle existe
if (Test-Path $tempZip) {
    Remove-Item $tempZip -Force
}

# Dossiers et fichiers à inclure
$includeDirs = @("config", "controllers", "middleware", "models", "routes", "scripts", "services", "utils")
$includeFiles = @("app.js", "package.json", "package-lock.json", "Procfile", ".gitignore", ".ebignore")

# Créer l'archive en préservant la structure
$archiveItems = @()

# Ajouter les fichiers à la racine
foreach ($file in $includeFiles) {
    if (Test-Path $file) {
        $archiveItems += Get-Item $file
    }
}

# Ajouter les dossiers avec leur contenu
foreach ($dir in $includeDirs) {
    if (Test-Path $dir) {
        $archiveItems += Get-ChildItem -Path $dir -Recurse -File | Where-Object {
            # Exclure les fichiers .md, .ps1, .bat, .sql dans scripts
            $_.Extension -notin @(".md", ".ps1", ".bat", ".sql", ".log")
        }
    }
}

# Créer l'archive
if ($archiveItems.Count -gt 0) {
    $archiveItems | Compress-Archive -DestinationPath $tempZip -CompressionLevel Fastest
    Write-Host "✅ Archive créée avec $($archiveItems.Count) fichiers" -ForegroundColor Green
} else {
    Write-Host "❌ Aucun fichier à archiver!" -ForegroundColor Red
    exit 1
}

# Étape 3: Transférer l'archive
Write-Host "`n=== Étape 3: Transfert du code ===" -ForegroundColor Yellow
scp -i $SSH_KEY $tempZip ${EC2_USER}@${EC2_IP}:/tmp/miagerank-backend.zip
Write-Host "✅ Code transféré" -ForegroundColor Green

# Étape 4: Extraire et configurer
Write-Host "`n=== Étape 4: Configuration de l'application ===" -ForegroundColor Yellow
$step4 = "cd /var/www/miagerank && " +
"echo '=== Extraction de l archive ===' && " +
"unzip -o /tmp/miagerank-backend.zip -d . && " +
"ls -la | head -20 && " +
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
"cat .env | grep -v PASSWORD && " +
"echo '' && echo '=== Installation des dependances npm ===' && " +
"npm install --omit=dev && " +
"echo '' && echo '=== Initialisation de la base de donnees ===' && " +
"(npm run add-createdby 2>&1 | head -10 || echo 'Script add-createdby termine') && " +
"(npm run add-work-submission 2>&1 | head -10 || echo 'Script add-work-submission termine') && " +
"(npm run add-admins 2>&1 | head -10 || echo 'Script add-admins termine') && " +
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

