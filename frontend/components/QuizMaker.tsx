import React, { useState } from 'react';
import { generateQuiz } from '../services/api';
import type { QuizQuestion } from '../types.ts';
import { Loader2, Target, ShieldCheck, Zap, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-20 space-y-8 animate-in fade-in">
    <div className="relative">
      <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse rounded-full"></div>
      <Loader2 className="animate-spin text-blue-500 relative z-10" size={100} />
    </div>
    <div className="text-center space-y-2">
        <p className="text-[14px] font-black text-white uppercase tracking-[0.5em]">Establishing Simulation Node</p>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Cross-referencing NCERT PYQ Grids</p>
    </div>
  </div>
);

const QuizMaker: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleCreate = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        setIsSubmitted(false);
        setAnswers({});
        try {
            const res = await generateQuiz(topic);
            setQuestions(res);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const score = questions.reduce((acc, q, i) => answers[i] === q.correctAnswer ? acc + 1 : acc, 0);

    return (
        <div className="flex flex-col h-full space-y-12 max-w-5xl mx-auto">
            <div className="bg-zinc-900/80 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/5 flex flex-col md:flex-row gap-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] items-center">
                <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 flex-shrink-0 shadow-inner">
                    <Target size={40} />
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter font-montserrat leading-none">Ranker PYQ Matrix</h3>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Initialize Precision Benchmark Simulation</p>
                </div>
                <div className="flex w-full md:w-auto gap-4">
                    <input 
                        value={topic} 
                        onChange={e => setTopic(e.target.value)} 
                        placeholder="Define Target Concept..." 
                        className="flex-1 md:w-80 bg-slate-800 border border-white/10 rounded-[1.5rem] px-8 py-5 text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner" 
                    />
                    <button 
                        onClick={handleCreate} 
                        disabled={isLoading || !topic.trim()} 
                        className="px-10 py-5 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-blue-500 transition-all shadow-2xl uppercase text-[12px] tracking-widest disabled:opacity-50 active:scale-95"
                    >
                        Deploy
                    </button>
                </div>
            </div>

            <div className="flex-1 space-y-10">
                {isLoading ? <LoadingSpinner /> : (
                    <>
                        {isSubmitted && (
                            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-12 rounded-[3.5rem] flex items-center justify-between shadow-2xl animate-in slide-in-from-top-6 duration-700 border border-white/10">
                                <div>
                                    <p className="text-[12px] font-black text-blue-200 uppercase tracking-[0.5em] mb-2">Performance Resolution</p>
                                    <h4 className="text-5xl font-black text-white uppercase font-montserrat tracking-tighter leading-none">Score: {score} / {questions.length}</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-[12px] font-black text-blue-200 uppercase tracking-[0.5em] mb-2">Percentile Index</p>
                                    <h4 className="text-5xl font-black text-white uppercase font-montserrat tracking-tighter leading-none">{Math.round((score/questions.length)*100)}%</h4>
                                </div>
                            </div>
                        )}
                        
                        {questions.map((q, i) => (
                            <div key={i} className={`bg-zinc-900/60 border transition-all duration-1000 rounded-[4rem] p-12 space-y-12 animate-in slide-in-from-bottom-12 shadow-2xl ${isSubmitted ? (answers[i] === q.correctAnswer ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5') : 'border-white/5 hover:border-white/10'}`}>
                                <div className="flex items-start gap-8">
                                    <span className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-2xl ${isSubmitted ? (answers[i] === q.correctAnswer ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white') : 'bg-slate-800 text-blue-400 border border-white/5'}`}>
                                        {i+1}
                                    </span>
                                    <h4 className="text-3xl font-black text-white uppercase tracking-tight font-montserrat leading-[1.1]">{q.question}</h4>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {q.options.map((opt, optIdx) => {
                                        const isSelected = answers[i] === opt;
                                        const isCorrect = q.correctAnswer === opt;
                                        let btnStyle = "bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-white";
                                        
                                        if (isSubmitted) {
                                            if (isCorrect) btnStyle = "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_40px_rgba(16,185,129,0.3)] scale-[1.02] z-10";
                                            else if (isSelected) btnStyle = "bg-rose-600 border-rose-400 text-white shadow-[0_0_40px_rgba(244,63,94,0.3)]";
                                            else btnStyle = "bg-slate-900/50 border-white/5 text-slate-700 opacity-40 grayscale";
                                        } else if (isSelected) {
                                            btnStyle = "bg-blue-600 border-blue-400 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] scale-[1.02]";
                                        }

                                        return (
                                            <button key={opt} onClick={() => !isSubmitted && setAnswers(p => ({...p, [i]: opt}))} className={`p-8 rounded-[2rem] border text-left text-base font-bold transition-all flex items-center gap-6 group relative overflow-hidden ${btnStyle}`}>
                                                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[12px] font-black border transition-all ${isSelected ? 'bg-white text-blue-600 border-white' : 'bg-zinc-950 border-white/10 group-hover:border-white/30'}`}>
                                                    {String.fromCharCode(65 + optIdx)}
                                                </span>
                                                <span className="relative z-10">{opt}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {isSubmitted && (
                                    <div className={`p-10 rounded-[3rem] border animate-in zoom-in-95 flex gap-8 ${answers[i] === q.correctAnswer ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                        <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                                            {answers[i] === q.correctAnswer ? <ShieldCheck size={32} /> : <AlertCircle size={32} />}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-black uppercase tracking-[0.3em] text-[12px]">{answers[i] === q.correctAnswer ? 'Benchmark Secured' : 'Correction Node Protocol'}</p>
                                            <p className="text-lg font-medium leading-relaxed italic opacity-90">"{q.explanation}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {questions.length > 0 && !isSubmitted && (
                            <button 
                                onClick={() => setIsSubmitted(true)} 
                                disabled={Object.keys(answers).length < questions.length}
                                className="w-full py-10 bg-white text-slate-950 font-black rounded-[3.5rem] hover:scale-[1.01] active:scale-95 transition-all shadow-[0_40px_80px_rgba(255,255,255,0.15)] uppercase text-base tracking-[0.6em] flex items-center justify-center gap-5 disabled:opacity-20"
                            >
                                <Zap size={28} fill="currentColor" /> Final Submission Protocol
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizMaker;