import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const ChatInput = ({ onSend, loading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="bg-slate-950 p-4 border-t border-slate-700">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2 max-w-4xl mx-auto"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua dúvida sobre a matéria..."
          disabled={loading}
          className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-xl py-4 pl-4 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg transition-colors duration-200 shadow-lg disabled:shadow-none"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
      <p className="text-center text-xs text-slate-600 mt-2">
        Powered by Gemini 2.5 Flash • Cloud Computing Project
      </p>
    </div>
  );
};

export default ChatInput;
