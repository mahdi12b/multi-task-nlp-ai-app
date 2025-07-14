from models.ner_model import get_ner
from utils.text_utils import clean_text, clean_ner_output

ner_model = None  # 👈 modèle pas encore chargé

def get_or_load_ner():
    global ner_model
    if ner_model is None:
        print("🔁 Chargement du modèle NER...")
        ner_model = get_ner()
    return ner_model

def extract_entities(text: str) -> list:
    clean = clean_text(text)
    model = get_or_load_ner()
    entities = model(clean)
    cleaned_output = clean_ner_output(entities)
    return cleaned_output
