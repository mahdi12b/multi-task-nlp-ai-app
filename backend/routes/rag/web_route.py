from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from services.rag.web_service import process_web_question

router = APIRouter()

class URLItem(BaseModel):
    url: str
    title: str

class WebRequest(BaseModel):
    question: str
    urls: List[URLItem]

@router.post("/web-analyze/")
def web_analyze(request: WebRequest):
    result = process_web_question([url.dict() for url in request.urls], request.question)
    return {
        "answer": result["answer"],
        "sources": [doc.metadata.get("source", "") for doc in result["source_documents"]]
    }