import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
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

origins = [
    "http://localhost:5173",  # Porta padrão do Vite
    "http://localhost:3000",  # Porta padrão do React CRA
    "http://127.0.0.1:5173",
]

# --- ESTRATÉGIA PARA AWS / PRODUÇÃO ---
# Lê a URL do frontend da variável de ambiente.
# Na AWS, você configurará a variável FRONTEND_URL com o link do seu site (S3/CloudFront)
aws_frontend_url = os.getenv("FRONTEND_URL")

if aws_frontend_url:
    origins.append(aws_frontend_url)
    print(f"Adicionando origem permitida da AWS: {aws_frontend_url}")
else:
    # Fallback inseguro apenas para garantir que funcione se esquecerem a config
    # Em um projeto real "sério", você removeria esta linha abaixo.
    origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoints
@app.get("/")
async def health_check():
    return {"status": "ok", "message": "Rodando a API do AssistenteGPT"}

@app.get("/teste-log")
def test_log():
    print("TESTANDO LOGS NO CLOUDWATCH!!!")
    return {"status": "ok"}

@app.post("/api/v1/assistente", response_model=AssistenteResponse)
async def gerar_resposta_assistente(request: AssistenteRequest):
    try:
        # Verifica se a chave existe antes de chamar
        if not api_key:
            raise HTTPException(
                status_code=500, detail="Chave de API não configurada no servidor."
            )
        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = f"""Responda à seguinte pergunta: {request.pergunta}

        Diretrizes de estilo:
        1. NÃO use negrito (**texto**) ou tags (ex: <strong>) em nenhuma parte da resposta.
        2. Evite listas ou tópicos (bullet points).
        3. Priorize o uso de texto corrido, parágrafos bem estruturados e explicações fluídas.
        4. Seja claro e direto.
        """
        response = await model.generate_content_async(prompt)

        return AssistenteResponse(resposta=response.text)

    except Exception as e:
        print(f"Erro ao chamar a API do Gemini: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ocorreu um erro interno ao processar sua solicitação: {str(e)}",
        )
