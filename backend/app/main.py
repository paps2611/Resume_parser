from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .models import ScoreResponse
from .ats_scoring import score_resume_bytes

app = FastAPI(title="ATS Resume Scorer", version="1.0.0")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
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


