# from backend.routes import text_generation
from fastapi import FastAPI
from routes import summarization_routes, ner_routes,text_classification,text_generation
from routes.rag import csv_route,web_route,DB_route
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Backend IA Multi-tâches")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*","http://localhost:4200"],  # ou ["http://localhost:4200"] si tu veux restreindre
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(summarization_routes.router, prefix="/summarization", tags=["Summarization"])
app.include_router(ner_routes.router, prefix="/ner", tags=["NER"])
app.include_router(text_classification.router, prefix="/textClassification", tags=["Classification"])
app.include_router(text_generation.router, prefix="/textGeneration", tags=["Generator"])
app.include_router(csv_route.router, prefix="/rag", tags=["Generator"])
app.include_router(web_route.router, prefix="/rag", tags=["Generator"])
app.include_router(DB_route.router, prefix="/rag", tags=["Generator"])


@app.get("/")
def home():
    return {"message": "Bienvenue sur le backend IA Multi-tâches"}