from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema.document import Document
from langchain.document_loaders import UnstructuredURLLoader
from utils.text_utils import split_documents
from utils.text_utils import clean_text

def build_vectorstore_from_urls(url_list):
    loader = UnstructuredURLLoader(urls=url_list)
    raw_docs = loader.load()

    cleaned_docs = []
    for doc in raw_docs:
        cleaned_content = clean_text(doc.page_content)
        cleaned_docs.append(Document(page_content=cleaned_content, metadata=doc.metadata))

    chunked_docs = split_documents(cleaned_docs)

    embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return FAISS.from_documents(chunked_docs, embedding)