import React, { useState } from 'react';
import { explainDiagram } from '../services/api.ts';
import MarkdownRenderer from './MarkdownRenderer.tsx';
import { Upload, X, Bot, Loader2, Sparkles, Send, Image as ImageIcon, ShieldCheck, Zap } from 'lucide-react';

const fileToBase64 = (file: File): Promise<{ data: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      if (result && result.includes(',')) {
        resolve({ data: result.split(',')[1], mimeType: result.split(',')[0].split(':')[1].split(';')[0] });
      } else {
        reject(new Error("Uplink encoding failed."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-20 space-y-8 animate-in fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse rounded-full"></div>
        <Loader2 className="animate-spin text-blue-500 relative z-10" size={80} />
      </div>
      <div className="text-center">
        <p className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Visual Intelligence Sync</p>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2">Deconstructing Schematic Geometry</p>
      </div>
    </div>
);

const DiagramExplainer: React.FC = () => {
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage({ file, preview: URL.createObjectURL(file) });
    }
  };
  
  const handleExplain = async () => {
    if (!image || !question.trim()) return;
    setIsLoading(true);
    setError('');
    setExplanation('');
    try {
        const { data, mimeType } = await fileToBase64(image.file);
        const imagePart = {
            inlineData: { data, mimeType }
        };
        const result = await explainDiagram(imagePart, question);
        setExplanation(result);
    } catch (err) {
        setError('Neural link synchronization failure.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Visual Input Node</h4>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inject Schematic for AI Synthesis</p>
                    </div>
                </div>
                
                <div 
                    className={`relative aspect-video rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden group shadow-2xl ${image ? 'border-blue-500/30 bg-zinc-950/50' : 'border-zinc-800 bg-zinc-900/40 hover:border-blue-500/30 hover:bg-zinc-800/60'}`}
                    onClick={() => document.getElementById('diagram-upload')?.click()}
                >
                    {image ? (
                        <>
                            <img src={image.preview} className="w-full h-full object-contain p-4" alt="Diagram preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                onClick={(e) => { e.stopPropagation(); setImage(null); }}
                                className="p-4 bg-rose-600 text-white rounded-2xl shadow-2xl hover:bg-rose-500 active:scale-95 transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-6 text-slate-600 group-hover:text-blue-400 transition-all duration-500">
                            <div className="w-20 h-20 bg-zinc-950 rounded-[2rem] border border-white/5 flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
                                <Upload size={32} />
                            </div>
                            <div className="space-y-1">
                                <p className="font-black text-sm uppercase tracking-[0.3em]">Authorize Asset Upload</p>
                                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Supports PNG, JPEG, WEBP</p>
                            </div>
                        </div>
                    )}
                    <input type="file" id="diagram-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
            </div>

            <div className="space-y-6 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Inquiry Parameters</h4>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Specify Analytical Focus</p>
                    </div>
                </div>

                <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 flex flex-col gap-8 shadow-2xl flex-1">
                    <textarea 
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        placeholder="Define your cognitive query regarding the schematic..."
                        className="flex-grow w-full bg-slate-800/50 border border-white/5 rounded-[2rem] p-8 text-base text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none placeholder:text-slate-700 shadow-inner"
                    />
                    <button 
                        onClick={handleExplain} 
                        disabled={isLoading || !image || !question.trim()} 
                        className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-500 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.2)] flex items-center justify-center gap-4 uppercase text-[12px] tracking-[0.3em] disabled:opacity-30 active:scale-95"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="fill-current" />}
                        Execute Synthesis
                    </button>
                </div>
            </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 rounded-[4rem] p-12 min-h-[400px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                <ShieldCheck size={300} />
            </div>
            
            {isLoading ? <LoadingSpinner /> : (
                explanation ? (
                    <div className="animate-in fade-in duration-1000 relative z-10">
                        <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                            <ShieldCheck size={20} className="text-emerald-500" />
                            <h5 className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Verified Neural Output</h5>
                        </div>
                        <div className="max-w-none">
                            <MarkdownRenderer
                                content={explanation}
                                className="prose prose-xl prose-invert prose-p:text-slate-300 prose-strong:text-white leading-relaxed"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-800 h-full flex flex-col justify-center items-center py-20 animate-in fade-in">
                        <div className="w-24 h-24 bg-zinc-950 border border-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-900 mb-8 shadow-inner">
                            <ImageIcon size={48} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-600 uppercase tracking-widest font-montserrat">Studio Protocol Idle</h4>
                        <p className="text-sm font-medium text-slate-700 max-w-xs mt-4 leading-relaxed">Initialize a visual scan by providing a schematic and focal inquiry.</p>
                    </div>
                )
            )}
        </div>
    </div>
  );
};

export default DiagramExplainer;