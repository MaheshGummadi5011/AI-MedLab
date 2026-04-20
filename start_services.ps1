# AI-MedLab Services Startup Script (PowerShell)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI-MedLab Services Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName 127.0.0.1 -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Check port statuses
Write-Host "[1/3] Checking model service on port 5002..." -ForegroundColor Yellow
if (Test-Port 5002) {
    Write-Host "✓ Port 5002 is in use (model service may already be running)" -ForegroundColor Green
} else {
    Write-Host "✗ Port 5002 is free" -ForegroundColor Gray
}

Write-Host "[2/3] Checking backend on port 5000..." -ForegroundColor Yellow
if (Test-Port 5000) {
    Write-Host "✓ Port 5000 is in use (backend may already be running)" -ForegroundColor Green
} else {
    Write-Host "✗ Port 5000 is free" -ForegroundColor Gray
}

Write-Host "[3/3] Checking frontend on port 5173..." -ForegroundColor Yellow
if (Test-Port 5173) {
    Write-Host "✓ Port 5173 is in use (frontend may already be running)" -ForegroundColor Green
} else {
    Write-Host "✗ Port 5173 is free" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start model service
Write-Host "Starting Model Prediction Service (port 5002)..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/k cd models && python app.py" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start backend
Write-Host "Starting Backend API (port 5000)..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/k cd backend && python app.py" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting Frontend (port 5173)..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/k cd frontend && npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Services Started!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Yellow
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:   http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Model API: http://localhost:5002" -ForegroundColor Cyan
Write-Host ""
Write-Host "Close any terminal to stop that service." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue..."
