# Resume Parser Deployment Script
Write-Host "🚀 Resume Parser Deployment Status" -ForegroundColor Green
Write-Host ""

Write-Host "✅ FRONTEND DEPLOYED!" -ForegroundColor Green
Write-Host "URL: https://resume-parser-ndxfedkjj-pratyushpaps-gmailcoms-projects.vercel.app" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 BACKEND DEPLOYMENT INSTRUCTIONS:" -ForegroundColor Yellow
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
Write-Host "6. Add Environment Variable: FRONTEND_URL = https://resume-parser-ndxfedkjj-pratyushpaps-gmailcoms-projects.vercel.app" -ForegroundColor Gray
Write-Host "7. Click 'Create Web Service'" -ForegroundColor White
Write-Host ""

Write-Host "🔄 AFTER BACKEND DEPLOYMENT:" -ForegroundColor Yellow
Write-Host "1. Get your backend URL from Render (e.g., https://resume-parser-backend.onrender.com)" -ForegroundColor White
Write-Host "2. Run: vercel env add VITE_API_BASE" -ForegroundColor White
Write-Host "3. Enter your backend URL when prompted" -ForegroundColor White
Write-Host "4. Run: vercel --prod" -ForegroundColor White
Write-Host ""

Write-Host "✨ Setup complete! Follow the instructions above to complete deployment." -ForegroundColor Green
