from fastapi import APIRouter
from pydantic import BaseModel
from services.ner_service import extract_entities

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/")
def ner(request: TextRequest):
    entities = extract_entities(request.text)
    return {"entities": entities}