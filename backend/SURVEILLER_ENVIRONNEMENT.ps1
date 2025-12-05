# Script pour surveiller automatiquement le statut de l'environnement EB
# Continue jusqu'à ce que l'environnement soit prêt

param(
    [string]$EnvName = "miagerank-env-20251205061513"
)

Write-Host "`n=== SURVEILLANCE DE L'ENVIRONNEMENT ===" -ForegroundColor Cyan
Write-Host "Environnement: $EnvName" -ForegroundColor Green
Write-Host "`nVérification toutes les 30 secondes..." -ForegroundColor Yellow
Write-Host "Appuyez sur Ctrl+C pour arrêter`n" -ForegroundColor Gray

$maxAttempts = 30  # Maximum 30 tentatives (15 minutes)
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts -and -not $ready) {
    $attempt++
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "`n[$timestamp] Tentative $attempt/$maxAttempts..." -ForegroundColor Cyan
    
    try {
        # Basculer vers l'environnement
        eb use $EnvName 2>&1 | Out-Null
        
        # Récupérer le statut
        $statusOutput = eb status 2>&1 | Out-String
        
        # Extraire le statut
        $status = "Unknown"
        $health = "Unknown"
        $cname = "UNKNOWN"
        
        if ($statusOutput -match "Status:\s+(\w+)") {
            $status = $matches[1]
        }
        
        if ($statusOutput -match "Health:\s+(\w+)") {
            $health = $matches[1]
        }
        
        if ($statusOutput -match "CNAME:\s+([^\s]+)") {
            $cname = $matches[1]
        }
        
        # Afficher le statut
        $statusColor = if ($status -eq "Ready") { "Green" } else { "Yellow" }
        $healthColor = if ($health -eq "Green") { "Green" } else { "Yellow" }
        
        Write-Host "  Status: $status" -ForegroundColor $statusColor
        Write-Host "  Health: $health" -ForegroundColor $healthColor
        if ($cname -ne "UNKNOWN") {
            Write-Host "  CNAME: $cname" -ForegroundColor Green
        }
        
        # Vérifier si l'environnement est prêt
        if ($status -eq "Ready" -and $health -eq "Green") {
            Write-Host "`n✅ ENVIRONNEMENT PRÊT !" -ForegroundColor Green
            Write-Host "`n=== PROCHAINES ÉTAPES ===" -ForegroundColor Cyan
            Write-Host "`n1. Configurer les variables d'environnement:" -ForegroundColor White
            Write-Host "   .\COMMANDES_CONFIGURATION.ps1" -ForegroundColor Gray
            Write-Host "`n2. Déployer le code:" -ForegroundColor White
            Write-Host "   eb deploy" -ForegroundColor Gray
            Write-Host "`n3. Vérifier le déploiement:" -ForegroundColor White
            Write-Host "   eb status" -ForegroundColor Gray
            Write-Host "   eb open" -ForegroundColor Gray
            $ready = $true
            break
        }
        
        # Si ce n'est pas prêt, attendre
        if ($attempt -lt $maxAttempts -and -not $ready) {
            Write-Host "`n⏳ Attente de 30 secondes..." -ForegroundColor Gray
            Start-Sleep -Seconds 30
        }
        
    } catch {
        Write-Host "Erreur lors de la vérification: $_" -ForegroundColor Red
        Start-Sleep -Seconds 30
    }
}

if (-not $ready) {
    Write-Host "`n⚠️  Maximum de tentatives atteint." -ForegroundColor Yellow
    Write-Host "L'environnement prend plus de temps que prévu." -ForegroundColor Yellow
    Write-Host "`nVérifiez manuellement avec:" -ForegroundColor Cyan
    Write-Host "  eb use $EnvName" -ForegroundColor Gray
    Write-Host "  eb status" -ForegroundColor Gray
    Write-Host "`nOu vérifiez dans AWS Console:" -ForegroundColor Cyan
    Write-Host "  https://console.aws.amazon.com/elasticbeanstalk" -ForegroundColor Gray
}

