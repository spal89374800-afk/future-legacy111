
import React from 'react';
import { Layers, Zap } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  subtitle?: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-700 space-y-12">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full animate-pulse"></div>
        <div className="relative w-40 h-40 bg-slate-900 border border-white/5 rounded-[3rem] flex items-center justify-center text-slate-700 shadow-2xl">
          <Layers size={80} strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="space-y-4 max-w-xl">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter font-montserrat">{title}</h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed">
          {subtitle || "This high-performance node is currently under architecture. Our engineers are synchronizing the next phase of the Future Legacy protocol."}
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-slate-900 border border-white/5 rounded-2xl shadow-xl">
        <Zap size={16} className="text-blue-400" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Node Status: <span className="text-blue-400">Under Architecture</span>
        </p>
      </div>
    </div>
  );
};

export default ComingSoonPage;
