from typing import List
from models.rag.web.vectorStore import build_vectorstore_from_urls
from models.rag.web.llm import get_web_qa_chain

def process_web_question(urls: List[dict], question: str):
    url_list = [url["url"] for url in urls]
    vectorstore = build_vectorstore_from_urls(url_list)
    qa_chain = get_web_qa_chain(vectorstore)
    return qa_chain({"question": question})