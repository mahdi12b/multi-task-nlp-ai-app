
import re
from typing import List, Dict
from langchain.text_splitter import RecursiveCharacterTextSplitter




def split_documents(documents, chunk_size=1000, chunk_overlap=200):
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return splitter.split_documents(documents)





def clean_ner_output(raw_entities: List[Dict]) -> List[Dict]:
    print(raw_entities)
    results = []
    current_entity = None

    for item in raw_entities:
        word = item["word"].replace("##", "")  # enlever les préfixes
        entity_type = item["entity_group"]
        score = float(item["score"])  # convertir np.float32 -> float

        if current_entity and item["start"] == current_entity["end"]:
            # Suite d'un mot
            current_entity["word"] += word
            current_entity["end"] = item["end"]
            current_entity["score"] = max(current_entity["score"], score)
        else:
            # Nouvelle entité
            current_entity = {
                "entity": entity_type,
                "word": word,
                "start": item["start"],
                "end": item["end"],
                "score": score
            }

            results.append(current_entity)
    print(results)
    return results
def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text
