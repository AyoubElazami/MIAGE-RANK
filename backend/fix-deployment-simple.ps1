# Script simplifié pour corriger le déploiement sur EC2
# Version simplifiée qui exécute directement les commandes via SSH

$EC2_IP = "52.47.70.112"
$EC2_USER = "ec2-user"
$SSH_KEY = "C:\Users\mahdi\Downloads\paireCle.pem"

Write-Host "`n=== CORRECTION DU DEPLOIEMENT (Version Simplifiee) ===" -ForegroundColor Cyan

# Vérifier la clé SSH
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "`n❌ Clé SSH non trouvée: $SSH_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Clé SSH trouvée" -ForegroundColor Green

# Commandes à exécuter sur l'instance (sans fins de ligne Windows)
$commands = "cd /var/www/miagerank && " +
"echo '=== Verification de Node.js ===' && " +
"if ! command -v node > /dev/null 2>&1; then curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash - && sudo yum install -y nodejs; fi && " +
"node --version && " +
"npm --version && " +
"echo '' && echo '=== Installation de PM2 ===' && " +
"if ! command -v pm2 > /dev/null 2>&1; then sudo npm install -g pm2; fi && " +
"pm2 --version && " +
"echo '' && echo '=== Installation des dependances ===' && " +
"npm install --production && " +
"echo '' && echo '=== Verification du fichier .env ===' && " +
"if [ -f .env ]; then echo 'Fichier .env trouve'; else echo 'Fichier .env non trouve!'; exit 1; fi && " +
"echo '' && echo '=== Demarrage de l application ===' && " +
"pm2 stop miagerank-backend 2>/dev/null || true && " +
"pm2 delete miagerank-backend 2>/dev/null || true && " +
"pm2 start app.js --name miagerank-backend && " +
"pm2 save && " +
"echo '' && echo '=== Statut ===' && " +
"pm2 status && " +
"echo '' && echo '=== Logs recents ===' && " +
"sleep 3 && " +
"pm2 logs miagerank-backend --lines 30 --nostream"

Write-Host "`nExécution des commandes sur l'instance..." -ForegroundColor Yellow
Write-Host "Cela peut prendre quelques minutes..." -ForegroundColor Gray

# Exécuter les commandes directement via SSH
$commands | ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP}

Write-Host "`n=== Correction terminee ===" -ForegroundColor Green
Write-Host "`nVérifiez l'application sur:" -ForegroundColor Cyan
Write-Host "  http://$EC2_IP:8080" -ForegroundColor Green
Write-Host "`nPour voir les logs en temps reel:" -ForegroundColor Yellow
Write-Host "  ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} 'pm2 logs miagerank-backend'" -ForegroundColor Gray

