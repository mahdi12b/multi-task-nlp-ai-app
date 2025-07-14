from typing import List
from models.rag.postgresDB.llm import get_db_chain

def process_db_question(question: str):
    response=get_db_chain(question)
    return response