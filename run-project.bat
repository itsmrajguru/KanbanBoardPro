@echo off
echo Starting Kanban Board...

start "Kanban Backend" cmd /k "cd backend && npm start"
timeout /t 5
start "Kanban Frontend" cmd /k "cd frontend && npm run dev"

echo Project started!
echo Frontend running at http://localhost:3000 (usually)
echo Backend running at http://localhost:5000
pause
