from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from langchain_community.llms import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQAWithSourcesChain, LLMChain, StuffDocumentsChain
import os

def get_csv_qa_chain(vectorstore):
    model_name = "google/flan-t5-base"

    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    pipe = pipeline("text2text-generation", model=model, tokenizer=tokenizer, max_new_tokens=250)

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
Answer the question based only on the context below.
If the context does not contain the answer, say "I don't know".

Context:
{context}

Question: {question}
Answer:"""
    )

    llm_chain = LLMChain(llm=HuggingFacePipeline(pipeline=pipe),prompt=prompt)
    combine_chain = StuffDocumentsChain(llm_chain=llm_chain, document_variable_name="context")
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    return RetrievalQAWithSourcesChain(
        retriever=retriever,
        combine_documents_chain=combine_chain,
        return_source_documents=True
    )
