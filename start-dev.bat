@echo off
echo Starting Resume Parser Development Environment...

echo.
echo Starting Backend...
start "Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Development servers starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
pause
