from models.text_generation import get_text_generation
from utils.text_utils import clean_text

text_gen_model = None  # 👈 modèle pas encore chargé

def get_or_load_text_generator():
    global text_gen_model
    if text_gen_model is None:
        print("🔁 Chargement du modèle de génération de texte...")
        text_gen_model = get_text_generation()
    return text_gen_model

def text_generator(text: str) -> str:
    clean = clean_text(text)
    generator = get_or_load_text_generator()
    result = generator(clean)
    print(result)
    return result
