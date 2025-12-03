import React, { useState, useRef, useEffect } from "react";
import { Bot, Loader2, AlertCircle } from "lucide-react";
import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import { fetchRespostaAssistente } from "./services/api";
import "./App.css";

export default function App() {
  const [historico, setHistorico] = useState([
    {
      tipo: "bot",
      texto: "Olá! Eu sou o Assistente GPT. O que você está estudando hoje?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historico, loading]);

  const handleSend = async (textoPergunta) => {
    setErro(null);
    setLoading(true);
    setHistorico((prev) => [...prev, { tipo: "user", texto: textoPergunta }]);

    try {
      const data = await fetchRespostaAssistente(textoPergunta);
      setHistorico((prev) => [...prev, { tipo: "bot", texto: data.resposta }]);
    } catch (err) {
      console.error(err);
      setErro("Erro de conexão. Verifique se o Backend (Docker) está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 text-slate-100 font-sans flex items-center justify-center">
      <div className="w-full md:w-[90%] max-w-5xl bg-slate-800 md:rounded-2xl shadow-2xl overflow-hidden border-0 md:border border-slate-700 flex flex-col h-full md:h-[85vh]">
        <Header />

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth min-h-0">
          {historico.map((msg, index) => (
            <ChatMessage key={index} tipo={msg.tipo} texto={msg.texto} />
          ))}

          {loading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div className="bg-slate-700 rounded-2xl rounded-tl-none p-4 border border-slate-600 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-sm text-slate-400">
                  Processando sua pergunta...
                </span>
              </div>
            </div>
          )}

          {erro && (
            <div className="flex justify-center">
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {erro}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}
