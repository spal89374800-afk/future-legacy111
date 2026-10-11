import React from 'react';
import { 
  Users, MessageSquare, Shield, Eraser, 
  Type, MousePointer2, Edit2, Highlighter,
  Undo2, Redo2, Trash2, Send, Mic, Video, Hand, UserCheck
} from 'lucide-react';
import type { LiveClassParticipant, LiveChatMessage, User } from '../types.ts';
import { AttendanceTracker } from './AttendanceTracker.tsx';

interface TeacherLiveControlsProps {
  activeTool: string;
  setActiveTool: (tool: any) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearPage: () => void;
  canUndo: boolean;
  canRedo: boolean;
  participants: LiveClassParticipant[];
  chatMessages: LiveChatMessage[];
  currentUser: User;
  onSendMessage: (msg: LiveChatMessage) => void;
  // Removed highlighterColor and setHighlighterColor props as they are no longer needed
}

const TeacherLiveControls: React.FC<TeacherLiveControlsProps> = ({
  activeTool, setActiveTool, strokeColor, setStrokeColor, 
  strokeWidth, setStrokeWidth, onUndo, onRedo, onClearPage,
  canUndo, canRedo, participants, chatMessages, currentUser, onSendMessage
  // Removed highlighterColor and setHighlighterColor from destructuring
}) => {
  const [chatInput, setChatInput] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'tools' | 'chat' | 'people'>('tools');
  const [showAttendanceModal, setShowAttendanceModal] = React.useState(false);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    onSendMessage({
      id: Date.now().toString(),
      senderName: currentUser.name,
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setChatInput('');
  };

  const ToolButton = ({ tool, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTool(tool)}
      className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border ${activeTool === tool ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-white/5 text-slate-400 hover:text-white'}`}
    >
      <Icon size={20} />
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-white/5 w-80">
      <div className="flex border-b border-white/5">
        {[
          { id: 'tools', icon: <Shield size={18} />, label: 'Tools' },
          { id: 'chat', icon: <MessageSquare size={18} />, label: 'Chat' },
          { id: 'people', icon: <Users size={18} />, label: 'People' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-5 flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab.icon}
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {activeTab === 'tools' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-4">
              <ToolButton tool="select" icon={MousePointer2} label="Select" />
              <ToolButton tool="pen" icon={Edit2} label="Pen" />
              <ToolButton tool="highlighter" icon={Highlighter} label="Glow" />
              <ToolButton tool="eraser" icon={Eraser} label="Purge" />
              <ToolButton tool="text" icon={Type} label="Text" />
              <button onClick={onClearPage} className="p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border bg-slate-800 border-white/5 text-rose-400 hover:bg-rose-500 hover:text-white">
                <Trash2 size={20} />
                <span className="text-[8px] font-black uppercase tracking-widest">Clear</span>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Chromatic Core</p>
              <div className="flex flex-wrap gap-3">
                {['#FFFFFF', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#7B61FF'].map(c => (
                  <button
                    key={c}
                    onClick={() => setStrokeColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${strokeColor === c ? 'border-white scale-125' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              {/* Removed separate highlighter color selection as it's handled by strokeColor */}
            </div>

            <div className="flex gap-4">
              <button onClick={onUndo} disabled={!canUndo} className="flex-1 py-4 bg-slate-800 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white disabled:opacity-30">
                <Undo2 size={16} /> Undo
              </button>
              <button onClick={onRedo} disabled={!canRedo} className="flex-1 py-4 bg-slate-800 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white disabled:opacity-30">
                <Redo2 size={16} /> Redo
              </button>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={() => setShowAttendanceModal(true)}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 transition-all cursor-pointer"
              >
                <UserCheck size={16} />
                View Attendance Report
              </button>
            </div>
          </div>
        )}

        {showAttendanceModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative">
              <button 
                onClick={() => setShowAttendanceModal(false)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer border border-white/20"
              >
                ✕
              </button>
              <AttendanceTracker classId="live_class_101" className="Advanced Neural Architecture Masterclass" />
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            <div className="flex-1 space-y-4 mb-4">
              {chatMessages.map(msg => (
                <div key={msg.id} className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{msg.senderName}</span>
                    <span className="text-[8px] font-black text-slate-600">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-auto relative">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Transmit message..."
                className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 pl-4 pr-12 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
              <button onClick={handleSendChat} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-400">
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {participants.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-white/5 group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={p.imageUrl} className="w-10 h-10 rounded-xl object-cover" />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${p.role === 'teacher' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{p.name}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{p.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><Mic size={14} /></button>
                  <button className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><Video size={14} /></button>
                  {p.handRaised && <Hand size={14} className="text-amber-500 animate-bounce" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherLiveControls;