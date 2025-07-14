from fastapi import APIRouter
from pydantic import BaseModel
from services.text_generation import text_generator

router = APIRouter()

class TextGenerationRequest(BaseModel):
    text: str

@router.post("/")
def text_generation(request: TextGenerationRequest):
    print(request)
    generation = text_generator(request.text)
    return {"generation": generation}