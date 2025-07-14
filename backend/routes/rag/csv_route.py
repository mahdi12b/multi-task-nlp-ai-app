from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import pandas as pd
from services.rag.csv_service import process_csv_question
import traceback

router = APIRouter()

@router.post("/analyze-csv/")
async def analyze_csv(file: UploadFile = File(...), question: str = Form(...)):
    try:
        df = pd.read_csv(file.file)
        result = process_csv_question(df, question)
        print(result)
        return {
            "answer": result["answer"],
            "sources": result["source_documents"]
        }
    except Exception as e:
        print("🚨 ERREUR :", traceback.format_exc())
        return JSONResponse(status_code=500, content={"error": str(e)})
