@echo off
echo Recherche des processus utilisant le port 4000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do (
    echo Arrêt du processus PID: %%a
    taskkill /PID %%a /F
)
echo Terminé!

