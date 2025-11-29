import React from "react";
import { Sparkles } from "lucide-react";

const Header = () => (
  <div className="bg-slate-950 p-4 border-b border-slate-700 flex items-center gap-3 shadow-md">
    <div className="bg-indigo-600 p-2 rounded-lg">
      <Sparkles className="w-6 h-6 text-white" />
    </div>
    <div>
      <h1 className="text-xl font-bold text-white tracking-tight">Assistente GPT</h1>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      </div>
    </div>
  </div>
);

export default Header;
