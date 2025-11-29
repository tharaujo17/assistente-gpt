import React from "react";
import { User, Bot } from "lucide-react";

const ChatMessage = ({ tipo, texto }) => {
  const isUser = tipo === "user";
  return (
    <div
      className={`flex gap-4 ${
        isUser ? "flex-row-reverse" : ""
      } animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
          isUser ? "bg-indigo-600" : "bg-emerald-600"
        }`}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl p-4 shadow-sm leading-relaxed text-sm md:text-base text-justify ${
          isUser
            ? "bg-indigo-600 text-white rounded-tr-none"
            : "bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600"
        }`}
      >
        <p className="whitespace-pre-wrap">{texto}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
