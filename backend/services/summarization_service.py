from models.summarizer_model import get_summarizer 
from utils.text_utils import clean_text

# Au début, le modèle n’est pas encore chargé
summarizer = None

def get_or_load_summarizer():
    global summarizer
    if summarizer is None:
        summarizer = get_summarizer()  # Se charge une seule fois au premier appel
    return summarizer

def summarize_text(text: str) -> str:
    clean = clean_text(text)
    summarizer_model = get_or_load_summarizer()
    result = summarizer_model(clean, max_length=60, min_length=20, do_sample=False)
    return result[0]['summary_text']
