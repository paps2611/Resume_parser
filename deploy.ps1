# Resume Parser Deployment Script
# This script will deploy both frontend and backend

Write-Host "🚀 Starting Resume Parser Deployment..." -ForegroundColor Green

# Get the current frontend URL from Vercel
Write-Host "📱 Frontend URL: https://resume-parser-ndxfedkjj-pratyushpaps-gmailcoms-projects.vercel.app" -ForegroundColor Cyan

# Set the frontend URL for the backend
$frontendUrl = "https://resume-parser-ndxfedkjj-pratyushpaps-gmailcoms-projects.vercel.app"

Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow

# Create environment file for backend
$envContent = @"
FRONTEND_URL=$frontendUrl
PORT=10000
PYTHON_VERSION=3.11.0
"@

$envContent | Out-File -FilePath "backend\.env" -Encoding UTF8

Write-Host "✅ Environment file created" -ForegroundColor Green

# Deploy backend to Render using the CLI
Write-Host "🐍 Deploying backend to Render..." -ForegroundColor Yellow

# Create a simple deployment script for Render
$renderScript = @"
#!/bin/bash
pip install -r requirements.txt
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:`$PORT
"@

$renderScript | Out-File -FilePath "backend/deploy.sh" -Encoding UTF8

Write-Host "📋 Deployment instructions:" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com" -ForegroundColor White
Write-Host "2. Sign up/Login with GitHub" -ForegroundColor White
Write-Host "3. Click 'New +' -> 'Web Service'" -ForegroundColor White
Write-Host "4. Connect your GitHub repository" -ForegroundColor White
Write-Host "5. Use these settings:" -ForegroundColor White
Write-Host "   - Name: resume-parser-backend" -ForegroundColor Gray
Write-Host "   - Environment: Python 3" -ForegroundColor Gray
Write-Host "   - Root Directory: backend" -ForegroundColor Gray
Write-Host "   - Build Command: pip install -r requirements.txt" -ForegroundColor Gray
Write-Host "   - Start Command: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:`$PORT" -ForegroundColor Gray
Write-Host "6. Add Environment Variable: FRONTEND_URL = $frontendUrl" -ForegroundColor Gray
Write-Host "7. Click 'Create Web Service'" -ForegroundColor White

Write-Host "`n🎉 Frontend is already deployed!" -ForegroundColor Green
Write-Host "Frontend URL: https://resume-parser-ndxfedkjj-pratyushpaps-gmailcoms-projects.vercel.app" -ForegroundColor Cyan

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Deploy backend using the instructions above" -ForegroundColor White
Write-Host "2. Get your backend URL from Render" -ForegroundColor White
Write-Host "3. Update Vercel environment variable VITE_API_BASE with your backend URL" -ForegroundColor White
Write-Host "4. Redeploy frontend: vercel --prod" -ForegroundColor White

Write-Host "`n✨ Deployment setup complete!" -ForegroundColor Green
