export const fetchRespostaAssistente = async (pergunta) => {
  // Tenta pegar a URL do backend via variável de ambiente do Vite ou usa localhost como fallback
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const response = await fetch(`${baseUrl}/api/v1/assistente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta }),
  });

  if (!response.ok) throw new Error(`Erro ${response.status}: Falha ao contatar servidor`);
  
  return await response.json();
};