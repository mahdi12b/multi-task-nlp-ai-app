import os
from langchain_community.llms import LlamaCpp
from langchain.prompts import PromptTemplate
from langchain_experimental.sql import SQLDatabaseChain
from langchain_community.utilities import SQLDatabase

# 1. Chargement du modèle local Mistral 7B (GGUF format)
llm = LlamaCpp(
    model_path=r"C:\Users\user\.cache\huggingface\hub\models--TheBloke--Mistral-7B-Instruct-v0.1-GGUF\snapshots\731a9fc8f06f5f5e2db8a0cf9d256197eb6e05d1\mistral-7b-instruct-v0.1.Q4_K_M.gguf",
    temperature=0.1,
    max_tokens=512,
    top_p=0.95,
    n_gpu_layers=35,        # RTX 3050 - ajuste si nécessaire
    n_batch=128,
    n_ctx=2048,             # pour contexte long
    verbose=True)

# 2. Connexion à la base de données PostgreSQL
import os
from dotenv import load_dotenv
from langchain_community.llms import LlamaCpp
from langchain.prompts import PromptTemplate
from langchain_experimental.sql import SQLDatabaseChain
from langchain_community.utilities import SQLDatabase

# 1. Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# 2. Récupérer les informations de connexion
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# 3. Construire l'URI de connexion
DB_URI = f"postgresql+psycopg2://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

db = SQLDatabase.from_uri(DB_URI)

# 3. Prompt SQL personnalisé
sql_prompt = PromptTemplate(
    input_variables=["input", "table_info", "top_k"],
    template="""
You are an expert SQL developer. Your task is to:
- Write only ONE valid SQL query using the provided tables.
- Use the format: Question → SQLQuery → SQLResult → Answer.
- Do not guess or repeat questions.
- If any column or value is not in the schema, say "Not found in schema".
- When the question involves a quantity or number of items available, use SUM(column) over stock columns like `stock_quantity`, not COUNT(*).

Tables available:
{table_info}

Use LIMIT {top_k} only if needed.
Never use SELECT *.
Wrap column names in backticks if needed.
Return only the necessary fields.

Question: {input}
SQLQuery:
"""
)

# 4. Création de la chaîne LangChain pour SQL
db_chain = SQLDatabaseChain.from_llm(
    llm=llm,
    db=db,
    prompt=sql_prompt,
    verbose=True
)

# Function to run the chain
def get_db_chain(question):
    # Récupérer les informations des tables
    table_info = db.get_table_info()
    
    # Exécuter la chaîne pour obtenir la requête SQL
    result = db_chain.invoke({
        "query": question,
        "table_info": table_info,
        "top_k": 5
    })
    
    # Extraire la requête SQL générée
    sql_query = result["result"].strip()
    
    # Exécuter la requête SQL pour obtenir le résultat
    try:
        sql_result = db.run(sql_query)
        # Convertir le résultat en une liste de tuples pour correspondre au format attendu
        sql_result = eval(sql_result) if sql_result else []
        # Extraire la valeur numérique pour l'Answer
        total_stock = sql_result[0][0] if sql_result else "Aucun résultat"
        
        # Formater la sortie
        formatted_result = {
            "question": question,
            "sql_query": sql_query,
            "sql_result": sql_result,
            "answer": f"Il y a {total_stock} t-shirts disponibles."
        }
        
        # Afficher le résultat formaté
        print(f"""
Question: {formatted_result['question']}
SQLQuery: {formatted_result['sql_query']}
SQLResult: {formatted_result['sql_result']}
Answer: {formatted_result['answer']}
""")
        
        return formatted_result
    except Exception as e:
        error_message = f"Erreur lors de l'exécution de la requête SQL : {e}"
        print(error_message)
        return {"error": error_message}

# Exemple d'exécution
