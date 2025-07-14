from fastapi import APIRouter
from pydantic import BaseModel
from services.summarization_service import summarize_text

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/")
def summarize(request: TextRequest):
    print(request.text)
    summary = summarize_text(request.text)
    return {"summary": summary}