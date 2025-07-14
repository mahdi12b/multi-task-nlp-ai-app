from transformers import pipeline
from config import MODEL_NAME_NER

def get_ner():
    ner = pipeline("ner", model=MODEL_NAME_NER, aggregation_strategy="simple")
    print(ner)
    return ner

