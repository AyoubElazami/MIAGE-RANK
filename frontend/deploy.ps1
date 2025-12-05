# Script PowerShell complet pour déployer le frontend sur S3

param(
    [string]$BucketName = "miagerank-frontend",
    [string]$Region = "eu-west-3"
)

Write-Host "🚀 Déploiement du frontend MiageRank sur AWS S3" -ForegroundColor Cyan
Write-Host ""

# Vérifier AWS CLI
Write-Host "📋 Vérification d'AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version
    Write-Host "✅ AWS CLI installé: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI n'est pas installé ou configuré!" -ForegroundColor Red
    Write-Host "   Installez-le depuis: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Vérifier que le bucket existe
Write-Host ""
Write-Host "📦 Vérification du bucket S3..." -ForegroundColor Yellow
$bucketExists = aws s3 ls "s3://$BucketName" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Le bucket '$BucketName' n'existe pas!" -ForegroundColor Yellow
    Write-Host "   Création du bucket..." -ForegroundColor Yellow
    aws s3 mb "s3://$BucketName" --region $Region
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Impossible de créer le bucket. Vérifiez votre configuration AWS." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Bucket créé avec succès!" -ForegroundColor Green
} else {
    Write-Host "✅ Bucket trouvé: $BucketName" -ForegroundColor Green
}

# Vérifier .env.production
Write-Host ""
Write-Host "📝 Vérification de .env.production..." -ForegroundColor Yellow
if (-not (Test-Path ".env.production")) {
    Write-Host "⚠️  Fichier .env.production non trouvé!" -ForegroundColor Yellow
    if (Test-Path "env.production.example") {
        Write-Host "   Création depuis env.production.example..." -ForegroundColor Yellow
        Copy-Item "env.production.example" ".env.production"
        Write-Host "   ⚠️  N'oubliez pas d'éditer .env.production avec votre URL backend!" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Fichier env.production.example non trouvé!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Fichier .env.production trouvé" -ForegroundColor Green
}

# Build
Write-Host ""
Write-Host "🔨 Building du frontend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build échoué!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build réussi!" -ForegroundColor Green

# Vérifier que dist/ existe
if (-not (Test-Path "dist")) {
    Write-Host "❌ Le dossier dist/ n'existe pas après le build!" -ForegroundColor Red
    exit 1
}

# Upload
Write-Host ""
Write-Host "📤 Upload des fichiers sur S3..." -ForegroundColor Yellow
aws s3 sync dist/ "s3://$BucketName" --delete --region $Region

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Upload échoué!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Upload réussi!" -ForegroundColor Green

# Afficher l'URL
Write-Host ""
Write-Host "🎉 Déploiement terminé avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URL de votre site:" -ForegroundColor Cyan
$websiteUrl = "http://$BucketName.s3-website-$Region.amazonaws.com"
Write-Host "   $websiteUrl" -ForegroundColor White
Write-Host ""
Write-Host "💡 Pour voir l'URL dans la console AWS:" -ForegroundColor Yellow
Write-Host "   S3 → $BucketName → Properties → Static website hosting" -ForegroundColor White
Write-Host ""

