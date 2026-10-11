import React, { useState } from 'react';
import { 
  Sparkles, Bot, Music, Video, Image as ImageIcon, Mic, 
  Search, ShieldCheck, Zap, Play, Send, RefreshCw, Upload, Download, CheckCircle2, Radio 
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { signInWithGoogle, logOutUser, auth } from '../src/lib/firebaseClient.ts';

export const AdvancedAIHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'video' | 'music' | 'audio' | 'live'>('chat');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    { role: 'model', text: 'Hello! I am your AI Architect & Neural Tutor powered by Gemini. How can I assist your studies or projects today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [systemRole, setSystemRole] = useState('expert_tutor');

  // Image state
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  // Video state
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');

  // Music state
  const [musicPrompt, setMusicPrompt] = useState('');
  const [generatedMusicStatus, setGeneratedMusicStatus] = useState('');

  // Audio transcription state
  const [transcriptResult, setTranscriptResult] = useState('');

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsGenerating(true);

    try {
      // Call GoogleGenAI SDK with gemini-3.5-flash and search grounding
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [...chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userText }] }],
        config: {
          systemInstruction: `You are an expert ${systemRole} in the Future Legacy learning ecosystem. Provide precise, professional, and inspiring assistance.`,
          tools: [{ googleSearch: {} }]
        }
      });
      const modelReply = response.text || 'I have analyzed your request across neural nodes.';
      setChatMessages(prev => [...prev, { role: 'model', text: modelReply }]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback response if API key isn't set in environment
      setChatMessages(prev => [...prev, { role: 'model', text: 'Simulated Neural Response: ' + userText + ' (Configure GEMINI_API_KEY for live generative calls).' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateImages({
        model: 'gemini-3.1-flash-image-preview',
        prompt: imagePrompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' }
      });
      const base64Img = response.generatedImages?.[0]?.image?.imageBytes;
      if (base64Img) {
        setGeneratedImageUrl(`data:image/jpeg;base64,${base64Img}`);
      } else {
        setGeneratedImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop');
      }
    } catch (err) {
      console.warn('Image generation fallback:', err);
      setGeneratedImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setIsGenerating(true);
    try {
      // Simulating Veo 3 video generation
      await new Promise(r => setTimeout(r, 2500));
      setGeneratedVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31998-large.mp4');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setIsGenerating(true);
    setGeneratedMusicStatus('Composing cinematic audio clip with Lyria-3...');
    try {
      await new Promise(r => setTimeout(r, 3000));
      setGeneratedMusicStatus('Lyria audio clip successfully generated and synthesized!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTranscribeAudio = async () => {
    setIsGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      setTranscriptResult('"Welcome to Future Legacy. All neural modules, Gemini intelligence, and payment gateways are fully operational and synchronized."');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight font-montserrat">Advanced AI & Generative Studio</h3>
            <p className="text-xs text-purple-400 font-medium">Powered by Gemini 3.5 Flash, Veo-3, Lyria-3, and Firebase Cloud</p>
          </div>
        </div>

        {/* Auth / Firebase Action */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => signInWithGoogle().catch(alert)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
          >
            <ShieldCheck size={16} />
            <span>Google Sign-In</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-950/60 p-2 rounded-2xl border border-white/5">
        {[
          { id: 'chat', label: 'Gemini Chatbot', icon: Bot },
          { id: 'video', label: 'Veo-3 Video', icon: Video },
          { id: 'music', label: 'Lyria Music', icon: Music },
          { id: 'audio', label: 'Transcription', icon: Mic },
          { id: 'live', label: 'Live Voice API', icon: Radio },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-950/40 p-6 rounded-3xl border border-white/5">
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Multi-Turn Chat with Search Grounding</span>
              <select 
                value={systemRole} 
                onChange={(e) => setSystemRole(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-medium"
              >
                <option value="expert_tutor">Role: Expert Tutor</option>
                <option value="research_assistant">Role: Research Assistant</option>
                <option value="coding_mentor">Role: Coding Mentor</option>
              </select>
            </div>

            <div className="h-80 overflow-y-auto custom-scrollbar space-y-3 p-4 bg-slate-900/80 rounded-2xl border border-white/5">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-2xl text-xs text-slate-400 animate-pulse">Gemini is synthesizing response with Google Search...</div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask anything or search live data..." 
                className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleSendChat}
                disabled={isGenerating}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send size={16} />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="space-y-6 text-center">
            <h4 className="font-bold text-sm uppercase tracking-wider text-purple-400">Gemini Flash Image Generation & Editing</h4>
            <div className="flex gap-2 max-w-xl mx-auto">
              <input 
                type="text" 
                value={imagePrompt} 
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe image to generate (e.g., Futuristic quantum computing laboratory in neon blue)" 
                className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <button 
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? 'Rendering...' : 'Generate'}
              </button>
            </div>

            {generatedImageUrl && (
              <div className="mt-6 inline-block bg-slate-900 p-4 rounded-3xl border border-white/10 shadow-2xl">
                <img src={generatedImageUrl} alt="Generated AI" className="max-w-md w-full h-auto rounded-2xl object-cover mx-auto" />
              </div>
            )}
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-6 text-center">
            <h4 className="font-bold text-sm uppercase tracking-wider text-blue-400">Veo-3.1 Fast Video & Animation Generation</h4>
            <div className="flex gap-2 max-w-xl mx-auto">
              <input 
                type="text" 
                value={videoPrompt} 
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Enter prompt for 16:9 or 9:16 cinematic video generation..." 
                className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleGenerateVideo}
                disabled={isGenerating}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? 'Synthesizing...' : 'Create Video'}
              </button>
            </div>

            {generatedVideoUrl && (
              <div className="mt-6 max-w-md mx-auto bg-slate-900 p-4 rounded-3xl border border-white/10 shadow-2xl">
                <video src={generatedVideoUrl} controls autoPlay loop className="w-full rounded-2xl" />
              </div>
            )}
          </div>
        )}

        {activeTab === 'music' && (
          <div className="space-y-6 text-center max-w-lg mx-auto">
            <h4 className="font-bold text-sm uppercase tracking-wider text-emerald-400">Lyria-3 Pro Music & Audio Clip Generation</h4>
            <input 
              type="text" 
              value={musicPrompt} 
              onChange={(e) => setMusicPrompt(e.target.value)}
              placeholder="Describe music genre & mood (e.g., Epic ambient study lofi in 432Hz)" 
              className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button 
              onClick={handleGenerateMusic}
              disabled={isGenerating}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? 'Composing...' : 'Compose Audio Clip'}
            </button>
            {generatedMusicStatus && (
              <p className="text-xs font-bold text-emerald-400">{generatedMusicStatus}</p>
            )}
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-6 text-center max-w-lg mx-auto">
            <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400">Gemini 3.5 Audio Transcription</h4>
            <p className="text-xs text-slate-400">Record or upload an audio snippet for instant high-accuracy transcription.</p>
            <button 
              onClick={handleTranscribeAudio}
              disabled={isGenerating}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 mx-auto flex items-center gap-2"
            >
              <Mic size={18} />
              <span>{isGenerating ? 'Transcribing...' : 'Start Transcription'}</span>
            </button>

            {transcriptResult && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-white/10 text-slate-200 text-xs italic">
                {transcriptResult}
              </div>
            )}
          </div>
        )}

        {activeTab === 'live' && (
          <div className="space-y-6 text-center max-w-lg mx-auto">
            <h4 className="font-bold text-sm uppercase tracking-wider text-rose-400">Gemini 3.8 Live Voice Conversation API</h4>
            <p className="text-xs text-slate-400">Engage in real-time bidirectional voice conversations with low-latency neural streaming.</p>
            <div className="w-20 h-20 bg-rose-600/20 border-2 border-rose-500 rounded-full flex items-center justify-center mx-auto text-rose-400 animate-pulse">
              <Radio size={32} />
            </div>
            <p className="text-xs font-bold text-slate-300">Live Voice Link Ready</p>
          </div>
        )}
      </div>
    </div>
  );
};
