from transformers import pipeline
from config import MODEL_NAME_CLASSIFICATION

def get_text_classification():
    classification = pipeline("text-classification", model=MODEL_NAME_CLASSIFICATION)
    return classification