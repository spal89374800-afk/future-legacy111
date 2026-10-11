import React, { useState, useEffect, useRef } from 'react';
import type { StudyMessage, User } from '../types.ts';
import MarkdownRenderer from './MarkdownRenderer.tsx';
import { 
    X, Send, Bot, Mic, Volume2, VolumeX, 
    Sparkles, Info, ExternalLink, Loader2, ArrowLeft 
} from 'lucide-react';

// Add SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionResult {
  [index: number]: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
    marked: { parse: (markdown: string, options?: object) => string; };
  }
}

interface AIStudyChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    messages: StudyMessage[];
    isAiThinking: boolean;
    onSendMessage: (msg: string) => void;
    embedded?: boolean;
}

const AIStudyChatModal: React.FC<AIStudyChatModalProps> = ({ isOpen, onClose, currentUser, messages, isAiThinking, onSendMessage, embedded }) => {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isTtsEnabled, setIsTtsEnabled] = useState(false); // Default false for professional feel
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isSpeechSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => textareaRef.current?.focus(), 100);
            if (isSpeechSupported && !recognitionRef.current) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'en-IN';
                recognition.onresult = (event) => {
                    const transcript = Array.from(event.results).map(result => result[0].transcript).join('');
                    setInput(transcript);
                };
                recognition.onend = () => setIsListening(false);
                recognition.onerror = () => setIsListening(false);
                recognitionRef.current = recognition;
            }
        }
        return () => {
            window.speechSynthesis.cancel();
            recognitionRef.current?.stop();
        };
    }, [isOpen, isSpeechSupported]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isAiThinking]);

    const handleSend = () => {
        if (input.trim() && !isAiThinking) {
            onSendMessage(input);
            setInput('');
        }
    };

    const toggleListen = () => {
        if (!recognitionRef.current) return;
        if (isListening) recognitionRef.current.stop();
        else recognitionRef.current.start();
        setIsListening(!isListening);
    };

    if (!isOpen) return null;

    const Content = (
        <div className={`flex flex-col h-full bg-[#0c0c0e] ${embedded ? '' : 'bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden relative animate-in zoom-in-95'}`}>
            {!embedded && (
                <header className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/50 flex-shrink-0">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={onClose}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return
                        </button>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg"><Bot size={20} /></div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat leading-none">Cognitive Uplink</h3>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Status: SECURE</p>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                        <div className={`flex gap-6 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <img src={msg.role === 'user' ? currentUser.imageUrl : 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Legacy'} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 ring-1 ring-white/5 shadow-xl" />
                            <div className={`p-6 rounded-[1.5rem] text-sm leading-relaxed shadow-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-900/20' : 'bg-zinc-900 border border-white/5 text-zinc-200 rounded-tl-none'}`}>
                                <MarkdownRenderer 
                                  content={msg.parts[0].text || ''} 
                                  className="prose prose-chat" 
                                />
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                                        {msg.sources.map((s, si) => (
                                            <a key={si} href={s.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-white transition-all"><ExternalLink size={10} /> {s.title || 'Source'}</a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isAiThinking && (
                    <div className="flex gap-4 animate-pulse">
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 flex items-center justify-center text-indigo-400 text-[10px] font-black uppercase tracking-widest gap-3">
                            <Loader2 className="animate-spin" size={14} />
                            Thinking...
                        </div>
                    </div>
                )}
                {/* Visual buffer for long messages to prevent being trapped under input area */}
                <div className="h-20 w-full" />
            </div>

            <div className="p-8 bg-[#09090b]/80 backdrop-blur-xl border-t border-white/5 relative flex-shrink-0">
                {isListening && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4 px-6 py-2 bg-indigo-600 text-white rounded-full text-[0.6rem] font-black uppercase tracking-[0.2em] shadow-xl animate-bounce">
                       Listening Node Active
                    </div>
                )}
                <div className="max-w-4xl mx-auto flex gap-3">
                    <div className="flex-1 relative group">
                        <textarea 
                            ref={textareaRef}
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} 
                            placeholder={isListening ? "Awaiting vocal command..." : "Inject cognitive query..."} 
                            className="w-full bg-zinc-900 border border-white/5 rounded-[1.5rem] p-5 pr-14 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none max-h-32 shadow-inner" 
                            rows={1}
                        />
                        {isSpeechSupported && (
                            <button 
                                onClick={toggleListen}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-rose-600 text-white' : 'text-zinc-600 hover:text-indigo-400'}`}
                            >
                                <Mic size={18} />
                            </button>
                        )}
                    </div>
                    <button onClick={handleSend} disabled={!input.trim() || isAiThinking} className="p-5 bg-indigo-600 text-white rounded-[1.5rem] hover:bg-indigo-500 transition-all shadow-xl active:scale-95 disabled:opacity-30"><Send size={22} /></button>
                </div>
            </div>
        </div>
    );

    if (embedded) return Content;

    return (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {Content}
        </div>
    );
};

export default AIStudyChatModal;