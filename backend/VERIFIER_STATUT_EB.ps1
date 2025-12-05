# Script pour vérifier le statut de l'environnement Elastic Beanstalk
# Continue à vérifier jusqu'à ce que l'environnement soit prêt

Write-Host "`n=== VERIFICATION DU STATUT ELASTIC BEANSTALK ===" -ForegroundColor Cyan
Write-Host "`nVérification toutes les 30 secondes..." -ForegroundColor Yellow
Write-Host "Appuyez sur Ctrl+C pour arrêter`n" -ForegroundColor Gray

$maxAttempts = 20  # Maximum 20 tentatives (10 minutes)
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    Write-Host "`n[Attempt $attempt/$maxAttempts] Vérification du statut..." -ForegroundColor Cyan
    
    try {
        $statusOutput = eb status 2>&1 | Out-String
        
        if ($statusOutput -match "Status:\s+(\w+)") {
            $status = $matches[1]
            Write-Host "Status: $status" -ForegroundColor $(if ($status -eq "Ready") { "Green" } else { "Yellow" })
        }
        
        if ($statusOutput -match "Health:\s+(\w+)") {
            $health = $matches[1]
            Write-Host "Health: $health" -ForegroundColor $(if ($health -eq "Green") { "Green" } else { "Yellow" })
        }
        
        if ($statusOutput -match "CNAME:\s+([^\s]+)") {
            $cname = $matches[1]
            if ($cname -ne "UNKNOWN") {
                Write-Host "CNAME: $cname" -ForegroundColor Green
            }
        }
        
        # Vérifier si l'environnement est prêt
        if ($statusOutput -match "Status:\s+Ready" -and $statusOutput -match "Health:\s+Green") {
            Write-Host "`n✅ ENVIRONNEMENT PRÊT !" -ForegroundColor Green
            Write-Host "`nVous pouvez maintenant:" -ForegroundColor Cyan
            Write-Host "1. Configurer les variables d'environnement" -ForegroundColor White
            Write-Host "2. Déployer le code (eb deploy)" -ForegroundColor White
            break
        }
        
        if ($attempt -lt $maxAttempts) {
            Write-Host "`n⏳ Attente de 30 secondes avant la prochaine vérification..." -ForegroundColor Gray
            Start-Sleep -Seconds 30
        }
    } catch {
        Write-Host "Erreur lors de la vérification: $_" -ForegroundColor Red
        Start-Sleep -Seconds 30
    }
}

if ($attempt -ge $maxAttempts) {
    Write-Host "`n⚠️  Maximum de tentatives atteint." -ForegroundColor Yellow
    Write-Host "L'environnement prend plus de temps que prévu." -ForegroundColor Yellow
    Write-Host "Vérifiez manuellement avec: eb status" -ForegroundColor Cyan
    Write-Host "Ou vérifiez dans AWS Console: Elastic Beanstalk → miagerank-backend → miagerank-env" -ForegroundColor Cyan
}

