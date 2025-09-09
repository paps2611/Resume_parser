from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .models import ScoreResponse
from .ats_scoring import score_resume_bytes, parse_resume, generate_refined_resume_text, build_docx_from_text

app = FastAPI(title="ATS Resume Scorer", version="1.0.0")

# CORS configuration for production
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://*.vercel.app",  # Vercel frontend domains
]

# Add your production frontend URL here
import os
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
	CORSMiddleware,
	allow_origins=allowed_origins,
	allow_credentials=True,
	allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
	return {"status": "ok"}


@app.post("/api/score", response_model=ScoreResponse)
async def score_resume(
	file: UploadFile = File(...),
	job_description: str = Form("")
):
	try:
		file_bytes = await file.read()
		scored = score_resume_bytes(file_bytes=file_bytes, filename=file.filename or "upload", job_description=job_description)
		return ScoreResponse(**scored)
	except Exception as exc:  # pylint: disable=broad-except
		return JSONResponse(status_code=400, content={"detail": str(exc)})




if __name__ == "__main__":
	import uvicorn
	uvicorn.run(app, host="0.0.0.0", port=8000)


@app.post("/api/refine")
async def refine_resume(
	file: UploadFile = File(...),
	job_description: str = Form("")
):
	file_bytes = await file.read()
	parsed = parse_resume(file_bytes, file.filename or "upload")
	refined_text = generate_refined_resume_text(parsed.text, job_description)
	refined_docx = build_docx_from_text(refined_text)
	from fastapi.responses import StreamingResponse
	return StreamingResponse(iter([refined_docx]), media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={
		"Content-Disposition": "attachment; filename=refined_resume.docx"
	})


