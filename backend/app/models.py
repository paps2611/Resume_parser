from typing import List, Dict, Optional
from pydantic import BaseModel


class ScoreBreakdown(BaseModel):
	keyword_match: int
	formatting: int
	sections: int
	contact: int
	length: int


class ScoreResponse(BaseModel):
	ats_score: int
	breakdown: ScoreBreakdown
	suggestions: List[str]
	extracted: Optional[Dict[str, str]] = None


