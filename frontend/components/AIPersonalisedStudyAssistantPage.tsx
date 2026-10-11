import React, { useState } from 'react';
import type { User, StudyMessage } from '../types.ts';
import AIStudyChatModal from './AIStudyChatModal.tsx';
import SmartNotesRevisionModal from './SmartNotesRevisionModal.tsx';
import { AIStudyAssistantIcon } from './page-icons.tsx';
import { 
    Sparkles, Layers, Clock, Zap, ArrowLeft, Bot, ArrowRight
} from 'lucide-react';

interface AIPersonalisedStudyAssistantPageProps {
  currentUser: User;
  messages: StudyMessage[];
  isAiThinking: boolean;
  onSendMessage: (msg: string) => void;
  showToast: (m: string, t?: 'success' | 'error') => void;
  isReviseModeEnabled: boolean;
  onToggleReviseMode: () => void;
  isGeneratingRevision: boolean;
  onGenerateRevisionSuggestion: () => void;
  revisionSuggestion: string | null;
  onStartRevisionQuiz: (topic: string) => void;
  onDeclineRevisionQuiz: () => void;
}

type ActiveView = 'hub' | 'chat' | 'revision' | 'roadmap';

const AIPersonalisedStudyAssistantPage: React.FC<AIPersonalisedStudyAssistantPageProps> = (props) => {
  const [activeView, setActiveView] = useState<ActiveView>('hub');

  const modules = [
    {
      id: 'chat',
      title: 'AI Study Chat',
      description: 'Ask doubts in clear English with simplified analogies and step-by-step explanations.',
      icon: <Bot size={28} />,
      color: 'indigo',
      action: () => setActiveView('chat')
    },
    {
      id: 'revision',
      title: 'Smart Revision & NCERT Notes',
      description: 'Access color-coded NCERT notes, high-yield formula sheets, mnemonics and revision plans.',
      icon: <Layers size={28} />,
      color: 'emerald',
      action: () => setActiveView('revision')
    },
    {
      id: 'roadmap',
      title: 'Personalized Study Planner',
      description: 'AI-structured daily milestones, syllabus tracking, and chapter completion targets.',
      icon: <Clock size={28} />,
      color: 'amber',
      action: () => props.showToast('Preparing your personalized study plan...')
    }
  ];

  const SubViewHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setActiveView('hub')}
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-zinc-300 hover:text-white rounded-xl border border-white/10 hover:border-white/25 transition-all group cursor-pointer"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-wider">Back</span>
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3">
                <span className="text-indigo-400">{icon}</span>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight font-montserrat">{title}</h3>
            </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold tracking-wider">
            <Zap size={12} className="fill-current" />
            AI Assistant: Online
        </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col font-sans">
      {activeView === 'hub' && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <AIStudyAssistantIcon />
                <span>AI Personalized Tutor</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase font-montserrat leading-none">AI Study Suite</h2>
              <p className="text-slate-300 font-medium max-w-xl text-sm leading-relaxed">
                Your 24/7 Academic Mentor for NEET, JEE & Boards. Clarify doubts instantly, master NCERT chapters, and access high-yield revision flashcards.
              </p>
            </div>
            
            <button 
                onClick={props.onToggleReviseMode}
                className={`px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer ${props.isReviseModeEnabled ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
                <Zap size={16} className={props.isReviseModeEnabled ? 'fill-current text-white' : 'text-amber-400'} />
                {props.isReviseModeEnabled ? 'Deep Focus: ON' : 'Enable Deep Focus'}
            </button>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {modules.map((m, i) => (
                <button 
                   key={m.id} 
                   onClick={m.action}
                   className="bg-slate-900/70 border border-white/10 p-8 rounded-3xl text-left hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-300 group relative overflow-hidden shadow-xl cursor-pointer"
                >
                   <div className="w-14 h-14 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-inner group-hover:scale-105 transition-transform">
                      {m.icon}
                   </div>
                   <h3 className="text-xl font-bold text-white uppercase tracking-tight font-montserrat mb-2">{m.title}</h3>
                   <p className="text-slate-400 font-normal text-xs leading-relaxed mb-6">{m.description}</p>
                   <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      Open Module <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </div>
                </button>
             ))}
          </section>
        </div>
      )}

      {/* RENDER ACTIVE VIEWS */}
      {activeView === 'chat' && (
        <div className="flex-1 flex flex-col h-[calc(100vh-12rem)] min-h-[600px] animate-in slide-in-from-right-8 duration-500">
            <SubViewHeader title="AI Study Chat" icon={<Bot size={20} />} />
            <div className="flex-1 bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
                <AIStudyChatModal 
                    isOpen={true}
                    onClose={() => setActiveView('hub')}
                    currentUser={props.currentUser}
                    messages={props.messages}
                    isAiThinking={props.isAiThinking}
                    onSendMessage={props.onSendMessage}
                    embedded={true}
                />
            </div>
        </div>
      )}

      {activeView === 'revision' && (
        <div className="flex-1 flex flex-col h-[calc(100vh-12rem)] min-h-[600px] animate-in slide-in-from-right-8 duration-500">
            <SubViewHeader title="Smart Revision & NCERT Notes" icon={<Layers size={20} />} />
            <div className="flex-1 bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
                <SmartNotesRevisionModal 
                    isOpen={true}
                    onClose={() => setActiveView('hub')}
                    showToast={props.showToast}
                    isReviseModeEnabled={props.isReviseModeEnabled}
                    onToggleReviseMode={props.onToggleReviseMode}
                    isGeneratingRevision={props.isGeneratingRevision}
                    onGenerateRevisionSuggestion={props.onGenerateRevisionSuggestion}
                    chatHistory={props.messages}
                    revisionSuggestion={props.revisionSuggestion}
                    onStartRevisionQuiz={props.onStartRevisionQuiz}
                    onDeclineRevisionQuiz={props.onDeclineRevisionQuiz}
                    embedded={true}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default AIPersonalisedStudyAssistantPage;