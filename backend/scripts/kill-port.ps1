# Script PowerShell pour arrêter tous les processus utilisant le port 4000
$port = 4000
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "Processus utilisant le port $port :"
    foreach ($process in $processes) {
        $pid = $process.OwningProcess
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "  PID: $pid - Nom: $($proc.ProcessName)"
            Stop-Process -Id $pid -Force
            Write-Host "  ✅ Processus $pid arrêté"
        }
    }
} else {
    Write-Host "Aucun processus n'utilise le port $port"
}

