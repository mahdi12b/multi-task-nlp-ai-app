from transformers import pipeline
from config import MODEL_NAME_SUMMARIZER

def get_summarizer():
    summarizer = pipeline("summarization", model=MODEL_NAME_SUMMARIZER)
    return summarizer