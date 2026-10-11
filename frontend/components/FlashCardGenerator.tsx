import React, { useState } from 'react';
import { generateFlashCards } from '../services/api';
import type { FlashCard } from '../types.ts';
import { Loader2, Sparkles, ChevronLeft, ChevronRight, RefreshCw, Layers, Zap, BookOpen } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer.tsx';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-20 space-y-10">
        <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse rounded-full"></div>
            <Loader2 className="animate-spin text-blue-500 relative z-10" size={100} />
        </div>
        <p className="text-[14px] font-black text-slate-500 uppercase tracking-[0.5em]">Synthesizing Atomic Recall Nodes...</p>
    </div>
);

const FlashCardDisplay: React.FC<{ card: FlashCard }> = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    
    const colorThemes = {
        sky: { glow: 'shadow-[0_0_60px_-15px_rgba(14,165,233,0.4)]', border: 'border-sky-500/40', text: 'text-sky-400', bg: 'bg-sky-500/5' },
        amber: { glow: 'shadow-[0_0_60px_-15px_rgba(245,158,11,0.4)]', border: 'border-amber-500/40', text: 'text-amber-400', bg: 'bg-amber-500/5' },
        emerald: { glow: 'shadow-[0_0_60px_-15px_rgba(16,185,129,0.4)]', border: 'border-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-500/5' },
        indigo: { glow: 'shadow-[0_0_60px_-15px_rgba(99,102,241,0.4)]', border: 'border-indigo-500/40', text: 'text-indigo-400', bg: 'bg-indigo-500/5' },
        rose: { glow: 'shadow-[0_0_60px_-15px_rgba(244,63,94,0.4)]', border: 'border-rose-500/40', text: 'text-rose-400', bg: 'bg-rose-500/5' },
    };
    
    const theme = colorThemes[card.color || 'sky'];
    
    return (
        <div className="w-full h-[500px] perspective-3000" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full transition-all duration-[1000ms] transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180 scale-105' : 'hover:scale-[1.01]'} transform ${theme.glow} rounded-[4rem]`}>
                {/* Front Side */}
                <div className={`absolute w-full h-full bg-zinc-950 border-4 ${theme.border} rounded-[4rem] p-12 flex flex-col justify-center items-center text-center backface-hidden overflow-hidden shadow-2xl`}>
                    <div className={`absolute inset-0 ${theme.bg} opacity-50`}></div>
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150">
                        <Zap size={250} />
                    </div>
                    
                    <div className="relative z-10 space-y-8">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <Layers size={32} className={theme.text} />
                        </div>
                        <h3 className="text-5xl md:text-6xl font-black text-white uppercase font-montserrat tracking-tighter leading-tight drop-shadow-2xl">{card.term}</h3>
                        <div className="flex items-center justify-center gap-4 px-8 py-3 bg-white/5 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-12">
                            <RefreshCw size={14} className="animate-spin-slow" /> Tap to Decrypt
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div className={`absolute w-full h-full bg-[#0c0c0e] border-4 border-white/10 rounded-[4rem] p-16 flex flex-col justify-center backface-hidden rotate-y-180 overflow-hidden shadow-inner`}>
                    <div className="absolute top-0 left-0 p-12 opacity-5 pointer-events-none scale-150 rotate-12">
                        <BookOpen size={250} />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className={`w-2 h-12 rounded-full ${theme.text.replace('text', 'bg')}`}></div>
                            <h4 className={`text-3xl font-black uppercase tracking-tight font-montserrat ${theme.text}`}>{card.term}</h4>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                            <MarkdownRenderer content={card.definition} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FlashCardGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [cards, setCards] = useState<FlashCard[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        setCards([]);
        try {
            const result = await generateFlashCards(topic);
            setCards(result);
            setCurrentIndex(0);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    return (
        <div className="flex flex-col h-full gap-12 max-w-5xl mx-auto">
            <div className="bg-zinc-900/80 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 flex flex-col md:flex-row items-center gap-10 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] relative overflow-hidden">
                <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center text-indigo-400 shadow-inner">
                    <Zap size={40} />
                </div>
                <div className="flex-1 space-y-2 w-full">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Knowledge Core Target</label>
                    <input 
                        type="text" 
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="Define Concept Domain..."
                        className="w-full bg-slate-800/50 border border-white/5 rounded-[1.5rem] p-6 text-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-montserrat font-bold"
                    />
                </div>
                <button 
                    onClick={handleGenerate} 
                    disabled={isLoading || !topic.trim()} 
                    className="w-full md:w-auto px-12 py-6 bg-indigo-600 text-white font-black rounded-[1.5rem] hover:bg-indigo-500 transition-all shadow-xl uppercase text-[12px] tracking-widest disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    Authorize Synthesis
                </button>
            </div>

            <div className="flex-1 min-h-[600px] relative flex flex-col items-center justify-center">
                {isLoading ? <LoadingSpinner /> : (
                    cards.length > 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-700">
                            <div className="w-full max-w-4xl flex items-center gap-10">
                                <button 
                                    onClick={() => setCurrentIndex(p => Math.max(0, p - 1))} 
                                    disabled={currentIndex === 0} 
                                    className="p-6 bg-white/5 border border-white/5 rounded-full text-slate-600 hover:text-white hover:bg-white/10 disabled:opacity-5 transition-all shadow-2xl"
                                >
                                    <ChevronLeft size={48} />
                                </button>
                                
                                <div className="flex-1">
                                    <FlashCardDisplay card={cards[currentIndex]} />
                                </div>

                                <button 
                                    onClick={() => setCurrentIndex(p => Math.min(cards.length - 1, p + 1))} 
                                    disabled={currentIndex === cards.length - 1} 
                                    className="p-6 bg-white/5 border border-white/5 rounded-full text-slate-600 hover:text-white hover:bg-white/10 disabled:opacity-5 transition-all shadow-2xl"
                                >
                                    <ChevronRight size={48} />
                                </button>
                            </div>
                            
                            <div className="mt-16 flex flex-col items-center gap-4">
                                <div className="flex gap-2.5">
                                    {cards.map((_, idx) => (
                                        <div key={idx} className={`h-2 rounded-full transition-all duration-700 ${idx === currentIndex ? 'w-12 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'w-3 bg-zinc-800'}`}></div>
                                    ))}
                                </div>
                                <span className="text-[12px] font-black text-slate-600 uppercase tracking-[0.6em] mt-2">{currentIndex + 1} / {cards.length} NODE RESOLUTION</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-800 space-y-8 animate-in fade-in">
                            <div className="w-32 h-32 bg-zinc-900 border border-white/5 rounded-[3.5rem] flex items-center justify-center text-slate-900 mx-auto shadow-inner">
                                <RefreshCw size={64} className="opacity-20" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black text-slate-600 uppercase tracking-widest font-montserrat">Recall System Offline</h4>
                                <p className="text-sm font-medium text-slate-700 max-w-sm mx-auto leading-relaxed">Initialize a new cognitive deck by specifying a domain node in the tactical input above.</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default FlashCardGenerator;