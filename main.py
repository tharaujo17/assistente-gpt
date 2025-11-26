import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

# Classes
class AssistenteRequest(BaseModel):
    """Define o JSON esperado no body da request."""
    pergunta: str

class AssistenteResponse(BaseModel):
    """Define o JSON que vai ser retornado pela API."""
    resposta: str

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY não encontrada no .env")

genai.configure(api_key=api_key)

app = FastAPI(
    title="AssistenteGPT API",
    description="Projeto da disciplina de Cloud Computing.",
)

# Endpoints
@app.get("/")
async def health_check():
    return {"status": "ok", "message": "Rodando a API do AssistenteGPT"}

@app.post("/api/v1/assistente", response_model=AssistenteResponse)
async def gerar_resposta_assistente(request: AssistenteRequest):
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')

        prompt = f"Explique sobre e seja relativamente sucinto, elecando os principais e mais importantes pontos: {request.pergunta}"
        
        response = await model.generate_content_async(prompt)

        return AssistenteResponse(resposta=response.text)

    except Exception as e:
        print(f"Erro ao chamar a API do Gemini: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ocorreu um erro interno ao processar sua solicitação: {str(e)}"
        )