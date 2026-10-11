
import React from 'react';
import { FileText, Download, Zap, ClipboardList, BookOpen, ShieldCheck } from 'lucide-react';
import type { ClassResource, ClassTest } from '../types.ts';

interface CourseMaterialsProps {
  notes?: ClassResource[];
  dpps?: ClassResource[];
  tests?: ClassTest[];
}

export const CourseMaterials: React.FC<CourseMaterialsProps> = ({ notes = [], dpps = [], tests = [] }) => {
  if (notes.length === 0 && dpps.length === 0 && tests.length === 0) return null;

  const AssetSection: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    items: (ClassResource | ClassTest)[]; 
    color: string 
  }> = ({ title, icon, items, color }) => (
    <div className="space-y-4">
        <p className={`text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2`}>
            <span className={`text-${color}-500`}>{icon}</span>
            {title}
        </p>
        <div className="space-y-2">
            {items.length > 0 ? items.map((n, idx) => (
                <a 
                    key={n.id || idx} 
                    href={n.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`flex items-center justify-between p-4 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-${color}-500/30 hover:bg-slate-800 transition-all group shadow-sm`}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 flex items-center justify-center text-${color}-400 group-hover:bg-${color}-500 group-hover:text-white transition-all`}>
                          <FileText size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-200 truncate group-hover:text-white transition-colors">{n.title}</span>
                          {'type' in n && (
                             <span className={`text-[8px] font-black text-${color}-500 uppercase tracking-widest`}>{n.type}</span>
                          )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-all border border-white/5">
                          <Download size={14} />
                        </div>
                    </div>
                </a>
            )) : (
                <div className="py-6 border-2 border-dashed border-white/5 rounded-2xl text-center flex flex-col items-center gap-2 opacity-30 grayscale">
                    <ShieldCheck size={20} />
                    <p className="text-[9px] font-black uppercase tracking-widest">Node Empty</p>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="p-8 bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl space-y-10 animate-in fade-in slide-in-from-bottom-2">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
              <Zap size={20} className="fill-current" />
            </div>
            <div>
              <h5 className="text-sm font-black text-white uppercase tracking-[0.2em]">Academic Repository</h5>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Asset Deployment V2.4</p>
            </div>
        </div>
        <div className="flex gap-1.5 p-2 bg-slate-800 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse delay-150"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AssetSection title="Transcripts" icon={<BookOpen size={16} />} items={notes} color="blue" />
        <AssetSection title="Execution Quotas" icon={<ClipboardList size={16} />} items={dpps} color="emerald" />
        <AssetSection title="Benchmarks" icon={<Zap size={16} />} items={tests} color="violet" />
      </div>
      
      <footer className="pt-6 border-t border-white/5 flex items-center justify-center gap-6 opacity-20 group pointer-events-none">
         <span className="text-[8px] font-black uppercase tracking-[0.5em] group-hover:tracking-[0.6em] transition-all">Proprietary Legacy Architecture</span>
      </footer>
    </div>
  );
};
