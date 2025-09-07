## ATS Resume Scorer (FastAPI + React)

Full-stack app to parse resumes, check ATS-friendly formatting, compare against a job description, and produce an ATS score and suggestions.

### Tech Stack
- Backend: FastAPI (Python), pdfplumber, docx2txt
- Frontend: React + Vite + TailwindCSS
- Docker and docker-compose
- Kubernetes manifests (Deployments, Services, Ingress)
- Jenkins CI/CD
- Free hosting options: GitHub Pages/Render/Fly.io; AWS free tier via EKS/ECR/EC2

### Local Development
1) Backend
```
cd backend
python -m venv .venv && . .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

2) Frontend
```
cd frontend
npm install
VITE_API_BASE=http://localhost:8000 npm run dev
```

Open http://localhost:5173

### Docker
```
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:8000/health

### Kubernetes (local with kind or minikube)
```
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```
Update image references `ghcr.io/youruser/...` to your registry and set Ingress host.

### Jenkins CI/CD
- Create a GitHub repo and push.
- In Jenkins, create credentials `ghcr-pat` (GitHub Personal Access Token with `write:packages`).
- Ensure Jenkins agent has Docker and kubectl configured.
- Pipeline stages: build images -> push to GHCR -> kubectl apply manifests.

### Free Hosting Options
- Frontend (static): GitHub Pages, Cloudflare Pages, Netlify (free tiers)
- Full stack containers: Render free, Fly.io free (usage-capped), or AWS Free Tier

### AWS Free Tier Guide (cost-aware)
Option A: EC2 + Docker Compose (simplest)
1. Create t2.micro EC2 (free tier), Amazon Linux 2023
2. Install Docker and docker-compose
3. `git clone` your repo, set `VITE_API_BASE` to your EC2 public DNS
4. `docker compose up -d --build`
5. Open security group for ports 80 and 8000; set up Nginx on frontend container (already) and access via `http://EC2_PUBLIC_DNS`

Option B: ECR + ECS Fargate (serverless) – free tier credits available
1. Build and push images to ECR
2. Create ECS Fargate service for backend and frontend behind an ALB
3. Set env `VITE_API_BASE` to the backend service URL

Option C: EKS (Kubernetes)
1. Use `eksctl` to create a small EKS cluster (t2.micro nodes)
2. Push images to ECR/GHCR
3. Update `k8s/*.yaml` images and Ingress host; install AWS Load Balancer Controller
4. `kubectl apply -f k8s/` and map Route53 or use the ALB DNS

Note: Keep usage within free tier limits to avoid charges. Consider sleep schedules or low replicas.

### Project Structure
```
backend/
  app/
    ats_scoring.py
    main.py
    models.py
  Dockerfile
  requirements.txt
frontend/
  src/
    App.tsx
    main.tsx
    styles.css
  Dockerfile
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  tsconfig.json
  vite.config.ts
  nginx.conf
k8s/
  backend-deployment.yaml
  frontend-deployment.yaml
  ingress.yaml
docker-compose.yml
Jenkinsfile
README.md
```

### API
- POST `/api/score` multipart form: `file`, `job_description`
- Response: `{ ats_score, breakdown, suggestions, extracted }`


