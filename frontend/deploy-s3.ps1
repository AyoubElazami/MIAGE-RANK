# Script PowerShell pour déployer le frontend sur S3

Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Uploading to S3..." -ForegroundColor Cyan
aws s3 sync dist/ s3://miagerank-frontend --delete

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Upload failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Deployment successful!" -ForegroundColor Green

# Optionnel: Invalider le cache CloudFront
# Write-Host "🔄 Invalidating CloudFront cache..." -ForegroundColor Cyan
# aws cloudfront create-invalidation `
#   --distribution-id YOUR_DISTRIBUTION_ID `
#   --paths "/*"

Write-Host "🎉 Done!" -ForegroundColor Green

