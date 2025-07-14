from fastapi import APIRouter
from pydantic import BaseModel
from services.text_classification_service import classification_text

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/")
def text_classification(request: TextRequest):
    classification = classification_text(request.text)
    return {"classification": classification}