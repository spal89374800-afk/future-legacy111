import React, { useState } from 'react';
import { 
    generateQuiz, 
    extractTopicsFromHistory,
} from '../services/api.ts';
import RevisionSuggestionBanner from './RevisionSuggestionBanner.tsx';
import ChapterNotesGenerator from './ChapterNotesGenerator.tsx';
import DiagramExplainer from './DiagramExplainer.tsx';
import FlashCardGenerator from './FlashCardGenerator.tsx';
import MindMapGenerator from './MindMapGenerator.tsx';
import QuizMaker from './QuizMaker.tsx';
import { StudyMessage, QuizQuestion } from '../types.ts';

import { 
    X, Zap, Layers, Target, 
    Clock, Sparkles, BookOpen, 
    Loader2, RefreshCw, ArrowLeft,
    Image as ImageIcon, LayoutDashboard, Copy,
    ChevronUp, ShieldCheck
} from 'lucide-react';

type StudyTool = 'notes' | 'quiz' | 'diagram' | 'flashcards' | 'mindmap' | 'revise';

interface SmartNotesRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (m: string, t?: 'success' | 'error') => void;
  isReviseModeEnabled: boolean;
  onToggleReviseMode: () => void;
  isGeneratingRevision: boolean;
  onGenerateRevisionSuggestion: () => void;
  chatHistory: StudyMessage[];
  revisionSuggestion: string | null;
  onStartRevisionQuiz: (topic: string) => void;
  onDeclineRevisionQuiz: () => void;
  embedded?: boolean;
}

const SmartNotesRevisionModal: React.FC<SmartNotesRevisionModalProps> = ({ 
    isOpen, onClose, showToast, 
    isGeneratingRevision, onGenerateRevisionSuggestion,
    revisionSuggestion, onStartRevisionQuiz, onDeclineRevisionQuiz,
    embedded
}) => {
  const [activeTool, setActiveTool] = useState<StudyTool>('notes');
  const [isChildFullScreen, setIsChildFullScreen] = useState(false);
  
  if (!isOpen) return null;

  const toolMap = [
      { id: 'notes', label: 'Master Notes', icon: <BookOpen size={18} /> },
      { id: 'quiz', label: 'PYQs & Practice', icon: <Target size={18} /> },
      { id: 'flashcards', label: 'Recall Cards', icon: <Copy size={18} /> },
      { id: 'mindmap', label: 'Mind Maps', icon: <LayoutDashboard size={18} /> },
      { id: 'diagram', label: 'Visual Diagrams', icon: <ImageIcon size={18} /> },
      { id: 'revise', label: 'AI Suggest', icon: <Clock size={18} /> }
  ];

  const renderTool = () => {
    switch(activeTool) {
        case 'notes': return <ChapterNotesGenerator onFullScreenChange={setIsChildFullScreen} showToast={showToast} />;
        case 'quiz': return <QuizMaker />;
        case 'diagram': return <DiagramExplainer />;
        case 'flashcards': return <FlashCardGenerator />;
        case 'mindmap': return <MindMapGenerator />;
        case 'revise': return (
            <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-12 animate-in fade-in zoom-in-95 duration-700">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-pulse rounded-full"></div>
                    <div className="w-28 h-28 bg-zinc-950 rounded-[2.5rem] flex items-center justify-center border border-indigo-500/30 shadow-2xl relative z-10">
                        <RefreshCw size={48} className="text-indigo-400 animate-[spin_4s_linear_infinite]" />
                    </div>
                </div>
                <div className="max-w-xl space-y-4">
                    <h3 className="text-3xl font-black text-white tracking-tight uppercase font-montserrat">Smart Revision & Recall</h3>
                    <p className="text-zinc-400 font-medium text-base leading-relaxed">
                        The AI Study Assistant is ready to analyze your learning progress to suggest high-priority revision topics.
                    </p>
                </div>
                {!revisionSuggestion ? (
                    <button 
                        onClick={onGenerateRevisionSuggestion}
                        disabled={isGeneratingRevision}
                        className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-xl flex items-center gap-3 uppercase text-[11px] tracking-widest disabled:opacity-50 active:scale-95 cursor-pointer"
                    >
                        {isGeneratingRevision ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="fill-current" />}
                        {isGeneratingRevision ? 'Analyzing...' : 'Generate Revision Plan'}
                    </button>
                ) : (
                    <div className="w-full max-w-2xl bg-zinc-900/60 backdrop-blur-3xl p-8 rounded-3xl border border-indigo-500/30 shadow-2xl animate-in zoom-in-95 duration-500">
                         <div className="flex items-center gap-2 mb-4 justify-center">
                            <ShieldCheck size={18} className="text-emerald-400" />
                            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Recommended Revision Topic</h4>
                         </div>
                         <p className="text-xl font-bold text-white mb-8">"{revisionSuggestion}"</p>
                         <div className="flex gap-4">
                            <button onClick={() => onStartRevisionQuiz(revisionSuggestion)} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-indigo-500 transition-all cursor-pointer">Start Practice Quiz</button>
                            <button onClick={onDeclineRevisionQuiz} className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-bold rounded-xl text-xs uppercase tracking-wider hover:text-white transition-all cursor-pointer">Later</button>
                         </div>
                    </div>
                )}
            </div>
        );
        default: return null;
    }
  };

  const showHeader = !isChildFullScreen;

  const Content = (
    <div className={`flex flex-col h-full ${isChildFullScreen ? 'w-full h-full' : (embedded ? '' : 'bg-[#0c0c0e] border border-white/5 shadow-2xl w-full flex flex-col overflow-hidden max-w-7xl h-[92vh] rounded-[3rem]')}`}>
        {showHeader && (
          <header className="relative z-20 flex-shrink-0 bg-[#0c0c0e]/80 backdrop-blur-3xl border-b border-white/5 px-8 py-6 shadow-2xl transition-all duration-500">
              <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Layers size={20} />
                      </div>
                      <div>
                          <h2 className="text-xl font-black text-white uppercase tracking-tight font-montserrat leading-none">Smart Notes & Revision Suite</h2>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">NCERT Smart Summaries & AI Study Vault</p>
                      </div>
                  </div>
                  {!embedded && (
                      <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all">
                          <X size={20} />
                      </button>
                  )}
              </div>
              
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {toolMap.map(tool => (
                      <button
                          key={tool.id}
                          onClick={() => setActiveTool(tool.id as StudyTool)}
                          className={`flex-shrink-0 px-6 py-3.5 rounded-2xl border transition-all flex items-center gap-3 ${activeTool === tool.id ? 'bg-white text-black border-white shadow-2xl scale-105' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
                      >
                          <span className={`${activeTool === tool.id ? 'text-indigo-600' : 'text-zinc-600'}`}>{tool.icon}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest leading-none">{tool.label}</span>
                      </button>
                  ))}
              </div>
          </header>
        )}

        <main className={`flex-1 flex flex-col min-h-0 relative ${isChildFullScreen ? '' : "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"}`}>
            <div className={`flex-1 min-h-0 relative z-10 overflow-y-auto custom-scrollbar ${isChildFullScreen ? 'bg-white h-full' : ''}`}>
                <div className={`${isChildFullScreen ? 'w-full h-full' : 'max-w-5xl mx-auto py-8 px-6'} h-full flex flex-col`}>
                    {renderTool()}
                </div>
            </div>
        </main>
    </div>
  );

  if (embedded) return Content;

  return (
    <div className={`fixed inset-0 bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center z-[300] animate-in fade-in duration-500 ${isChildFullScreen ? 'p-0' : 'p-4'}`}>
      {Content}
    </div>
  );
};

export default SmartNotesRevisionModal;