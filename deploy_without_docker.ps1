Write-Host "=== SOPWriter Manual Deployment Script ===" -ForegroundColor Cyan

# 1. Backend Setup
Write-Host "`n[1/4] Setting up Backend..." -ForegroundColor Yellow
Set-Location "sopwriter-backend"
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..."
    npm ci --silent
}
Write-Host "Building backend..."
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Backend build failed"; exit 1 }
Set-Location ".."

# 2. Frontend Setup
Write-Host "`n[2/4] Setting up Frontend..." -ForegroundColor Yellow
Set-Location "sopwriter-frontend"
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..."
    npm ci --silent
}
Write-Host "Building frontend..."
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed"; exit 1 }
Set-Location ".."

Write-Host "`n=== Build Complete! ===" -ForegroundColor Green
Write-Host "`nTo RUN the application manually, verify your .env file in sopwriter-backend has MONGO_URI set (e.g. mongodb://127.0.0.1:27017/sopwriter) and then open TWO separate terminals:" -ForegroundColor White
Write-Host "`nTerminal 1 (Backend):" -ForegroundColor Cyan
Write-Host "  cd sopwriter-backend"
Write-Host "  npm start"
Write-Host "`nTerminal 2 (Frontend):" -ForegroundColor Cyan
Write-Host "  cd sopwriter-frontend"
Write-Host "  npx serve -s dist -l 8080"
Write-Host "`nThen access the app at http://localhost:8080" -ForegroundColor Green
