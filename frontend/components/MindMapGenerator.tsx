import React, { useState } from 'react';
import { generateMindMap } from '../services/api';
import { Loader2, Sparkles, Download, LayoutDashboard, ShieldCheck, Zap } from 'lucide-react';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-24 space-y-10">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-pulse rounded-full"></div>
          <Loader2 className="animate-spin text-indigo-500 relative z-10" size={100} />
        </div>
        <div className="text-center space-y-3">
            <p className="text-[14px] font-black text-white uppercase tracking-[0.5em]">Architecting Logic Node Matrix</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Synchronizing Multidimensional Knowledge Paths</p>
        </div>
    </div>
);

const MindMapGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setError('');
    setImageUrl(null);
    try {
      const result = await generateMindMap(topic);
      setImageUrl(result);
    } catch (err: any) {
      setError(err.message || "Archive retrieval failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl || !topic) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `logic-map-${topic.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-full gap-10 max-w-6xl mx-auto">
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 p-10 opacity-5 pointer-events-none">
                <LayoutDashboard size={160} />
            </div>
            <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-400 relative z-10 flex-shrink-0">
                <Zap size={40} className="fill-current" />
            </div>
            <div className="flex-1 space-y-2 relative z-10 w-full">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Logic Node Target</label>
                <input 
                    type="text" 
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g., Central Nervous System Architecture..."
                    className="w-full bg-slate-800/50 border border-white/5 rounded-[1.5rem] p-6 text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                />
            </div>
            <button 
                onClick={handleGenerate} 
                disabled={isLoading || !topic.trim()} 
                className="w-full md:w-auto px-12 py-6 bg-indigo-600 text-white font-black rounded-[1.5rem] hover:bg-indigo-500 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] uppercase text-[12px] tracking-widest disabled:opacity-50 active:scale-95 relative z-10 flex items-center justify-center gap-3"
            >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="fill-current" />}
                Authorize Logic Synthesis
            </button>
        </div>

        <div className="flex-1 bg-zinc-950 border border-white/5 rounded-[4rem] p-10 overflow-y-auto custom-scrollbar flex justify-center items-center shadow-inner relative" aria-live="polite" aria-busy={isLoading}>
            <div className="absolute top-8 left-10 flex items-center gap-3 opacity-30">
                <ShieldCheck size={18} className="text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Workspace Active</span>
            </div>
            
            {isLoading && <LoadingSpinner />}
            {error && <div className="p-10 bg-rose-500/10 border border-rose-500/20 rounded-3xl"><p className="text-rose-400 font-black text-center">{error}</p></div>}
            {!isLoading && !error && (
                imageUrl ? (
                    <div className="animate-in fade-in duration-1000 w-full text-center space-y-10">
                        <div className="relative group mx-auto max-w-4xl">
                            <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                            <img src={imageUrl} alt={`Mind map for ${topic}`} className="w-full h-auto rounded-[2rem] border-4 border-white/5 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] relative z-10 transition-transform duration-700 group-hover:scale-[1.01]" />
                        </div>
                         <button
                            onClick={handleDownload}
                            className="bg-white text-slate-950 font-black py-5 px-12 rounded-[1.5rem] hover:bg-indigo-50 transition-all inline-flex items-center gap-3 shadow-2xl text-[10px] uppercase tracking-[0.3em]"
                        >
                            <Download size={18} />
                            Archive Logic Schematic
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-slate-800 flex flex-col justify-center items-center py-32 animate-in fade-in">
                        <div className="w-24 h-24 bg-zinc-900 border border-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-900 mb-8 shadow-inner">
                            <LayoutDashboard size={48} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-600 uppercase tracking-widest font-montserrat">Strategy Hub Idle</h4>
                        <p className="text-sm font-medium text-slate-700 max-w-sm mt-4 leading-relaxed">Enter a complex academic node to synthesize a visual logic map for high-speed concept navigation.</p>
                    </div>
                )
            )}
        </div>
    </div>
  );
};

export default MindMapGenerator;