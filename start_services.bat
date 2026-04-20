@echo off
REM Start AI-MedLab Services Script

echo.
echo ========================================
echo  AI-MedLab Services Startup
echo ========================================
echo.

REM Check if models service is running
echo [1/3] Checking model service on port 5002...
netstat -ano | findstr :5002 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Port 5002 is in use (model service may already be running)
) else (
    echo ✗ Port 5002 is free
)

REM Check if backend is running
echo [2/3] Checking backend on port 5000...
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Port 5000 is in use (backend may already be running)
) else (
    echo ✗ Port 5000 is free
)

REM Check if frontend is running
echo [3/3] Checking frontend on port 5173...
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Port 5173 is in use (frontend may already be running)
) else (
    echo ✗ Port 5173 is free
)

echo.
echo ========================================
echo  Starting Services...
echo ========================================
echo.

REM Start model service
echo Starting Model Prediction Service (port 5002)...
start "Model Service" cmd /k "cd models && python app.py"
timeout /t 3 /nobreak

REM Start backend
echo Starting Backend API (port 5000)...
start "Backend API" cmd /k "cd backend && python app.py"
timeout /t 3 /nobreak

REM Start frontend
echo Starting Frontend (port 5173)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  Services Started!
echo ========================================
echo.
echo Access the application at:
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:5000
echo   Model API: http://localhost:5002
echo.
echo Close any terminal to stop that service.
echo.
pause
