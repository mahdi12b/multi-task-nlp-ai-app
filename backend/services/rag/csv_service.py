from models.rag.csv.llm import get_csv_qa_chain
from models.rag.csv.vectorstore import build_vectorstore_from_dataframe

def process_csv_question(df, question):
    # Étape 1: transformer CSV en documents + embeddings
    vectorstore = build_vectorstore_from_dataframe(df)

    # Étape 2: récupérer la chaîne QA
    qa_chain = get_csv_qa_chain(vectorstore)

    # Étape 3: répondre à la question
    return qa_chain({"question": question})
