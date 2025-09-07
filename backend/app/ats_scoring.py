from __future__ import annotations

import io
import re
from typing import Dict, List, Tuple

from pydantic import BaseModel

try:
	import docx2txt  # .docx
except Exception:  # pragma: no cover
	docx2txt = None  # type: ignore

try:
	import pdfplumber  # .pdf
except Exception:  # pragma: no cover
	pdfplumber = None  # type: ignore


SECTION_KEYWORDS = [
	"summary",
	"objective",
	"experience",
	"employment",
	"work history",
	"education",
	"skills",
	"projects",
	"certifications",
	"awards",
]


class ParsedResume(BaseModel):
	text: str
	sections_present: Dict[str, bool]
	contact_info: Dict[str, str]
	words: List[str]


def _extract_text_from_pdf(file_bytes: bytes) -> str:
	if pdfplumber is None:
		raise RuntimeError("pdfplumber not installed")
	with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
		pages_text = [page.extract_text() or "" for page in pdf.pages]
	return "\n".join(pages_text)


def _extract_text_from_docx(file_bytes: bytes) -> str:
	if docx2txt is None:
		raise RuntimeError("docx2txt not installed")
	# docx2txt expects a path; use temporary in-memory workaround
	# Fallback: return empty if not supported in environment
	return docx2txt.process(io.BytesIO(file_bytes))  # type: ignore[arg-type]


def extract_text(file_bytes: bytes, filename: str) -> str:
	lower = filename.lower()
	if lower.endswith(".pdf"):
		return _extract_text_from_pdf(file_bytes)
	if lower.endswith(".docx"):
		return _extract_text_from_docx(file_bytes)
	# Plain text fallback
	return file_bytes.decode(errors="ignore")


def parse_resume(file_bytes: bytes, filename: str) -> ParsedResume:
	text = extract_text(file_bytes, filename)
	lower_text = text.lower()
	sections_present = {k: (k in lower_text) for k in SECTION_KEYWORDS}
	words = re.findall(r"[a-zA-Z]+", lower_text)
	contact_info = {}
	# Basic email/phone detection
	email_match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
	phone_match = re.search(r"(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}", text)
	if email_match:
		contact_info["email"] = email_match.group(0)
	if phone_match:
		contact_info["phone"] = phone_match.group(0)
	return ParsedResume(text=text, sections_present=sections_present, contact_info=contact_info, words=words)


def keyword_overlap_score(words: List[str], job_description: str) -> Tuple[int, List[str]]:
	jd_words = re.findall(r"[a-zA-Z]+", job_description.lower())
	if not jd_words:
		return 50, []  # neutral baseline when no JD provided
	jd_set = set(jd_words)
	resume_set = set(words)
	overlap = jd_set & resume_set
	ratio = len(overlap) / max(1, len(jd_set))
	score = int(40 + ratio * 60)  # weight more on overlap
	missing = sorted(list(jd_set - resume_set))[:20]
	return min(score, 100), missing


def formatting_score(text: str) -> int:
	# Penalize images-only or very low text density resumes
	lines = [l for l in text.splitlines() if l.strip()]
	avg_line_len = sum(len(l) for l in lines) / max(1, len(lines))
	if len(lines) < 15:
		return 40
	if avg_line_len < 25:
		return 55
	return 85


def sections_score(sections_present: Dict[str, bool]) -> int:
	present_count = sum(1 for v in sections_present.values() if v)
	return min(100, 50 + present_count * 5)


def contact_score(contact: Dict[str, str]) -> int:
	return 100 if ("email" in contact and "phone" in contact) else 70 if contact else 50


def length_score(text: str) -> int:
	words = len(re.findall(r"\w+", text))
	if words < 200:
		return 60
	if words > 1200:
		return 65
	return 90


def aggregate_score(scores: Dict[str, int]) -> int:
	# Weighted aggregation
	weights = {
		"keyword_match": 0.35,
		"formatting": 0.2,
		"sections": 0.2,
		"contact": 0.1,
		"length": 0.15,
	}
	value = sum(scores[k] * weights[k] for k in weights)
	return int(round(value))


def score_resume_bytes(file_bytes: bytes, filename: str, job_description: str) -> Dict:
	parsed = parse_resume(file_bytes, filename)
	kw_score, missing = keyword_overlap_score(parsed.words, job_description)
	fmt_score = formatting_score(parsed.text)
	sec_score = sections_score(parsed.sections_present)
	con_score = contact_score(parsed.contact_info)
	len_score = length_score(parsed.text)
	breakdown = {
		"keyword_match": kw_score,
		"formatting": fmt_score,
		"sections": sec_score,
		"contact": con_score,
		"length": len_score,
	}
	overall = aggregate_score(breakdown)
	suggestions: List[str] = []
	if kw_score < 75 and missing:
		suggestions.append(
			f"Consider incorporating missing role keywords: {', '.join(missing[:10])}"
		)
	if fmt_score < 70:
		suggestions.append("Increase text density; avoid images/tables; prefer standard headings.")
	if sec_score < 80:
		suggestions.append("Add or improve sections: Summary, Experience, Skills, Education, Projects.")
	if "email" not in parsed.contact_info:
		suggestions.append("Include a professional email address.")
	if "phone" not in parsed.contact_info:
		suggestions.append("Include a reachable phone number with country code.")
	if len_score < 80:
		suggestions.append("Target 1 page (junior) or 1–2 pages (senior) with concise bullets.")
	return {
		"ats_score": overall,
		"breakdown": breakdown,
		"suggestions": suggestions,
		"extracted": {**parsed.contact_info},
	}


