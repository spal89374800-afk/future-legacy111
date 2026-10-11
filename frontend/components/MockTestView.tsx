import React, { useState, useEffect } from 'react';
import type { MockTest, User, BenchmarkQuestion } from '../types.ts';
import { 
  X, Timer, ShieldAlert, ChevronLeft, ChevronRight, 
  Flag, BookOpen, Clock, AlertCircle, CheckCircle2, 
  Lock, Zap, LayoutGrid, Loader2, Sparkles, ShieldCheck
} from 'lucide-react';
import { generateNationalBenchmarkQuestions } from '../services/api.ts';

interface MockTestViewProps {
  test: MockTest;
  currentUser: User;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const MockTestView: React.FC<MockTestViewProps> = ({ test, currentUser, onComplete, onExit }) => {
  const [questions, setQuestions] = useState<BenchmarkQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
        setIsLoading(true);
        try {
            // Fetch specialized questions based on 8-year analysis
            const res = await generateNationalBenchmarkQuestions(test.examCategory, test.subject, test.totalQuestions > 10 ? 10 : test.totalQuestions);
            setQuestions(res);
        } catch (e) {
            console.error("Benchmark sync failed", e);
        } finally {
            setIsLoading(false);
        }
    };
    fetchQuestions();
  }, [test]);

  useEffect(() => {
    if (isLoading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    const score = Object.keys(answers).length * 4; 
    onComplete(score);
  };

  if (isLoading) {
      return (
          <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-[80px] animate-pulse rounded-full"></div>
                  <Loader2 size={100} className="text-blue-500 animate-spin relative z-10" />
              </div>
              <div className="text-center space-y-4">
                  <h2 className="text-2xl font-black text-white uppercase tracking-[0.25em] font-montserrat">Preparing All India Examination Paper</h2>
                  <p className="text-xs font-bold text-slate-400 tracking-wider">Loading verified questions and previous year examination patterns...</p>
                  <div className="flex justify-center gap-2 mt-8">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-200"></div>
                  </div>
              </div>
          </div>
      );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 text-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <header className="h-20 bg-slate-900 border-b border-white/5 flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-6">
           <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg">
              <Timer size={22} className="animate-pulse" />
           </div>
           <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight font-montserrat">{test.title}</h2>
              <p className="text-[10px] font-bold text-emerald-400 tracking-wider">All India Test Series: ACTIVE</p>
           </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
           <div className="flex items-center gap-3 bg-slate-950/70 px-4 sm:px-6 py-2.5 rounded-full border border-white/10 shadow-inner">
              <Clock size={16} className="text-amber-500" />
              <span className="text-base sm:text-xl font-black font-mono tracking-widest text-white">{formatTime(timeLeft)}</span>
           </div>
           
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowExitConfirm(true)} 
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-200 border border-white/10 hover:border-rose-500/40 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
              >
                <ChevronLeft size={16} />
                <span>Back / Exit</span>
              </button>
           </div>
        </div>
      </header>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-montserrat">Leave Examination?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to go back? Your current responses will be evaluated up to this point.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Resume Test
              </button>
              <button
                onClick={onExit}
                className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
              >
                Exit Test
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex min-h-0 bg-slate-950 relative">
        {/* Left Stats Rail */}
        <aside className="w-20 border-r border-white/5 hidden md:flex flex-col items-center py-8 gap-10 bg-slate-900/40">
           <button onClick={() => setIsMatrixOpen(!isMatrixOpen)} className="p-4 bg-blue-600/10 rounded-2xl text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all">
              <LayoutGrid size={24} />
           </button>
           <div className="flex flex-col gap-6">
              <div className="text-center">
                 <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Answered</p>
                 <p className="text-xs font-black text-emerald-500">{Object.keys(answers).length}</p>
              </div>
              <div className="text-center">
                 <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Status</p>
                 <div className="flex justify-center mt-1">
                    <span className={`w-2 h-2 rounded-full ${answers[currentQuestionIndex] !== undefined ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                 </div>
              </div>
           </div>
        </aside>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-16 flex flex-col items-center">
            {currentQuestion && (
                <div className="w-full max-w-4xl space-y-12">
                   <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                         <span className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-xl text-blue-400">
                            {currentQuestionIndex + 1}
                         </span>
                         <div>
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Module Synchronized</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {currentQuestion.tags?.map(t => (
                                    <span key={t} className="text-[7px] font-black px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded uppercase tracking-widest">{t}</span>
                                ))}
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                         {currentQuestion.weightage && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest">
                               <Sparkles size={11} className="text-indigo-400 animate-pulse" />
                               {currentQuestion.weightage}
                            </div>
                         )}
                         <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${currentQuestion.difficulty === 'Advanced' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                            <Zap size={10} />
                            {currentQuestion.difficulty} Node
                         </div>
                      </div>
                   </div>

                   {currentQuestion.isSummaryQuestion && (
                     <div className="w-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 rounded-3xl p-6 md:p-8 flex items-start gap-4 shadow-[0_0_40px_rgba(16,185,129,0.1)] animate-pulse">
                       <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-400 flex-shrink-0">
                         <BookOpen size={22} className="animate-pulse" />
                       </div>
                       <div>
                         <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] block">🔄 MASTER CHAPTER INTEGRATION & SUMMARY</span>
                         <span className="text-[11px] text-zinc-300 leading-relaxed block mt-2 font-medium">
                           This high-yield final question acts as an automatic **Synthesized Summary of the Entire Chapter**. By analyzing this question and its options, you will successfully review and summarize all core principles, definitions, and equations of this topic inside NCERT!
                         </span>
                       </div>
                     </div>
                   )}

                   <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 left-0 p-8 opacity-5">
                        <BookOpen size={100} />
                      </div>
                      <p className="text-2xl font-black text-white leading-relaxed font-montserrat tracking-tight mb-12 relative z-10">
                         {currentQuestion.question}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                        {currentQuestion.options.map((opt, i) => (
                          <button 
                            key={i}
                            onClick={() => setAnswers({...answers, [currentQuestionIndex]: i})}
                            className={`text-left p-6 rounded-[2rem] border transition-all duration-300 flex items-center gap-5 group ${answers[currentQuestionIndex] === i ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_40px_rgba(37,99,235,0.2)]' : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-blue-500/30'}`}
                          >
                             <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${answers[currentQuestionIndex] === i ? 'bg-white text-blue-600' : 'bg-slate-900 text-slate-500 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                {String.fromCharCode(65 + i)}
                             </span>
                             <span className="text-sm font-bold uppercase tracking-tight">{opt}</span>
                          </button>
                        ))}
                      </div>
                   </div>

                   {/* Footer Nav */}
                   <div className="flex items-center justify-between pt-8 border-t border-white/5">
                      <button 
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 border border-white/10 text-slate-400 font-bold rounded-xl hover:text-white hover:bg-slate-800 transition-all text-xs uppercase tracking-wider disabled:opacity-30 cursor-pointer"
                      >
                         <ChevronLeft size={16} /> Previous
                      </button>
                      
                      <button 
                        onClick={() => {
                            if (currentQuestionIndex === questions.length - 1) {
                                handleSubmit();
                            } else {
                                setCurrentQuestionIndex(currentQuestionIndex + 1);
                            }
                        }}
                        className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg uppercase text-xs tracking-wider active:scale-95 cursor-pointer"
                      >
                         {currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Next Question'} <ChevronRight size={16} />
                      </button>
                   </div>
                </div>
            )}
        </div>

        {/* Proctored Sidebar */}
        <aside className="w-72 border-l border-white/5 hidden xl:flex flex-col bg-slate-900/40">
           <div className="p-6 border-b border-white/5">
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/15 shadow-xl relative max-w-[160px] mx-auto">
                 <img src={currentUser.imageUrl} className="w-full h-full object-cover" />
                 <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-md">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-bold text-white uppercase tracking-wider">Candidate</span>
                 </div>
              </div>
              <div className="mt-4 text-center">
                 <h5 className="font-bold text-white uppercase tracking-tight text-sm">{currentUser.name}</h5>
                 <p className="text-[10px] font-medium text-emerald-400 tracking-wider mt-0.5">Identity Status: Verified</p>
              </div>
           </div>

           <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Examination Guidelines</span>
                    <Sparkles size={14} className="text-amber-400" />
                 </div>
                 <div className="bg-slate-950/70 p-4 rounded-xl border border-white/5 space-y-2">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All questions follow latest NTA syllabus and marking schemes. +4 for correct, -1 for incorrect.
                    </p>
                 </div>
              </div>
           </div>

           <div className="p-6 mt-auto border-t border-white/5">
              <button 
                onClick={handleSubmit}
                className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all shadow-lg uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                 <ShieldCheck size={16} /> Submit Examination
              </button>
           </div>
        </aside>

        {/* Matrix Overlay */}
        {isMatrixOpen && (
           <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-xl p-8 sm:p-12 animate-in zoom-in-95 duration-200">
              <div className="max-w-4xl mx-auto space-y-6">
                 <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight font-montserrat">Question Palette</h3>
                    <button onClick={() => setIsMatrixOpen(false)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"><X size={18} /></button>
                 </div>
                 <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                    {questions.map((_, i) => (
                       <button 
                        key={i} 
                        onClick={() => { setCurrentQuestionIndex(i); setIsMatrixOpen(false); }}
                        className={`aspect-square rounded-xl border flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${answers[i] !== undefined ? 'bg-emerald-600 border-emerald-400 text-white shadow-md' : 'bg-slate-900 border-white/10 text-slate-400 hover:border-blue-500 hover:text-white'}`}
                       >
                          {i + 1}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default MockTestView;