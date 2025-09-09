# Deployment Guide

This guide will help you deploy your Resume Parser application using Vercel (frontend) and Render (backend) for free.

## Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- Git repository with your code

## Frontend Deployment (Vercel)

### 1. Prepare Frontend for Vercel

The frontend is already configured for Vercel deployment. The configuration includes:

- `vercel.json` - Vercel configuration
- Environment variable support for API URL
- Build scripts in `package.json`

### 2. Deploy to Vercel

1. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

2. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Set Environment Variables:**
   - In Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_API_BASE` = `https://your-backend-url.onrender.com`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend

## Backend Deployment (Render)

### 1. Prepare Backend for Render

The backend is configured with:
- `render.yaml` - Render configuration
- `Procfile` - Alternative deployment configuration
- Updated CORS settings for production

### 2. Deploy to Render

1. **Connect your GitHub repository to Render:**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure the service:**
   - **Name:** `resume-parser-backend`
   - **Environment:** `Python 3`
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

3. **Set Environment Variables:**
   - In Render dashboard, go to your service
   - Navigate to "Environment"
   - Add: `FRONTEND_URL` = `https://your-frontend-url.vercel.app`

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Environment Variables

### Frontend (.env.local)
```env
VITE_API_BASE=http://localhost:8000
```

### Backend
- `FRONTEND_URL`: Your production frontend URL (for CORS)

## Post-Deployment Steps

1. **Update CORS in Backend:**
   - After getting your Vercel URL, update the `FRONTEND_URL` environment variable in Render
   - Redeploy the backend service

2. **Update API URL in Frontend:**
   - Update the `VITE_API_BASE` environment variable in Vercel with your Render backend URL

3. **Test the Application:**
   - Visit your Vercel frontend URL
   - Upload a resume to test the full functionality

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure `FRONTEND_URL` is set correctly in Render
   - Check that the frontend URL matches exactly (including https://)

2. **Build Failures:**
   - Check the build logs in Vercel/Render
   - Ensure all dependencies are in requirements.txt/package.json

3. **API Connection Issues:**
   - Verify the `VITE_API_BASE` environment variable is set correctly
   - Check that the backend is running and accessible

### Free Tier Limitations

- **Vercel:** 100GB bandwidth/month, unlimited static sites
- **Render:** 750 hours/month, sleeps after 15 minutes of inactivity

## Monitoring

- **Vercel:** Built-in analytics and performance monitoring
- **Render:** Basic logs and metrics in the dashboard

## Scaling

When you outgrow the free tiers:
- **Vercel Pro:** $20/month for more bandwidth and features
- **Render Paid:** $7/month for always-on services and more resources

## Security Notes

- The current CORS configuration allows all Vercel domains
- For production, consider restricting to specific domains
- Consider adding authentication if handling sensitive data
