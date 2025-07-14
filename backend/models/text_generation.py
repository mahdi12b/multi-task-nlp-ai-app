from transformers import pipeline
from config import MODEL_NAME_TEXT_GENERATOR

def get_text_generation():
    textGeneration = pipeline("text-generation", model=MODEL_NAME_TEXT_GENERATOR)
    return textGeneration