from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema.document import Document

def build_vectorstore_from_dataframe(df): 
    docs = []
    for i, row in df.iterrows():
        content = row.to_string()
        docs.append(Document(page_content=content, metadata={"row": i}))

    embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = FAISS.from_documents(docs, embedding)
    return vectorstore
