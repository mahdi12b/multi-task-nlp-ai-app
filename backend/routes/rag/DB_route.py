from fastapi import APIRouter
from pydantic import BaseModel
from services.rag.DB_service import process_db_question

router = APIRouter()

# Modèle Pydantic pour valider la payload
class QuestionPayload(BaseModel):
    question: str

@router.post("/db-analyze")
def process_rag_db(payload: QuestionPayload):
    rag_db = process_db_question(payload.question)
    print("rag_db",rag_db)
    return rag_db