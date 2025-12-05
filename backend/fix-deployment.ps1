# Script pour corriger le déploiement sur EC2
# À exécuter si le déploiement initial a échoué

$EC2_IP = "52.47.70.112"
$EC2_USER = "ec2-user"
$SSH_KEY = "C:\Users\mahdi\Downloads\paireCle.pem"

Write-Host "`n=== CORRECTION DU DEPLOIEMENT ===" -ForegroundColor Cyan

# Script de correction à exécuter sur l'instance
$fixScript = @"
#!/bin/bash
set -e

echo "=== Vérification de Node.js ==="
if ! command -v node &> /dev/null; then
    echo "Installation de Node.js 20..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

echo "`n=== Installation de PM2 ==="
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

echo "PM2 version: $(pm2 --version)"

echo "`n=== Vérification du répertoire ==="
cd /var/www/miagerank
pwd
ls -la

echo "`n=== Installation des dépendances ==="
if [ -f "package.json" ]; then
    npm install --production
else
    echo "❌ package.json non trouvé!"
    exit 1
fi

echo "`n=== Vérification du fichier .env ==="
if [ -f ".env" ]; then
    echo "✅ Fichier .env trouvé"
    cat .env | grep -v PASSWORD
else
    echo "❌ Fichier .env non trouvé!"
    exit 1
fi

echo "`n=== Démarrage de l'application ==="
# Arrêter l'ancienne instance si elle existe
pm2 stop miagerank-backend 2>/dev/null || true
pm2 delete miagerank-backend 2>/dev/null || true

# Démarrer l'application
pm2 start app.js --name miagerank-backend
pm2 save

echo "`n=== Statut ==="
pm2 status

echo "`n=== Logs récents ==="
sleep 2
pm2 logs miagerank-backend --lines 30 --nostream

echo "`n=== Test de l'API ==="
sleep 2
curl -s http://localhost:8080 || echo "❌ L'API ne répond pas"
"@

# Sauvegarder le script avec des fins de ligne Unix (LF)
$fixScript -replace "`r`n", "`n" | Out-File -FilePath "fix-remote.sh" -Encoding ASCII -NoNewline

Write-Host "`nTransfert et exécution du script de correction..." -ForegroundColor Yellow

# Transférer le script
scp -i $SSH_KEY fix-remote.sh ${EC2_USER}@${EC2_IP}:/tmp/fix.sh

# Exécuter le script
ssh -i $SSH_KEY ${EC2_USER}@${EC2_IP} "chmod +x /tmp/fix.sh && /tmp/fix.sh"

Write-Host "`n=== Correction terminée ===" -ForegroundColor Green
Write-Host "`nVérifiez l'application sur:" -ForegroundColor Cyan
Write-Host "  http://$EC2_IP:8080" -ForegroundColor Green

# Nettoyer
Remove-Item fix-remote.sh -ErrorAction SilentlyContinue

