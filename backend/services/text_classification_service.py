from models.text_classification_model import get_text_classification
from utils.text_utils import clean_text

classification = None  # 👈 pas encore chargé

def get_or_load_classifier():
    global classification
    if classification is None:
        print("🔁 Chargement du modèle de classification...")
        classification = get_text_classification()
    return classification

def classification_text(text: str) -> str:
    clean = clean_text(text)
    classifier = get_or_load_classifier()
    result = classifier(clean)
    print(result)
    return result
