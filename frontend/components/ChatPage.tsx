

import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import type { Mentor, ChatMessage, Group, User, UserRole } from '../types.ts';
import SimpleConfirmationModal from './SimpleConfirmationModal.tsx';
import NewChatModal from './NewChatModal.tsx';
import MarkdownRenderer from './MarkdownRenderer.tsx';
import { 
  Search, Plus, MoreVertical, Send, Paperclip, 
  Trash2, ShieldCheck, Clock, Check, CheckCheck,
  User as UserIcon, Users, Hash, MessageSquare,
  ArrowLeft, Bold, Italic, List, Smile, Sparkles,
  ChevronLeft, Info, FileText, Image as ImageIcon,
  Video, Music, Filter
} from 'lucide-react';

declare global {
  interface Window {
    // renderMathInElement and katex are no longer used
  }
}

// --- TYPE DEFINITIONS ---
interface EnrichedConversation {
  id: string;
  type: 'direct' | 'group' | 'student';
  name: string;
  imageUrl: string;
  lastMessage: ChatMessage;
  unreadCount: number;
}

interface MessageOptionsMenuProps {
  message: ChatMessage;
  anchorEl: HTMLElement;
  onClose: () => void;
  onDelete: (messageId: number, deleteType: 'me' | 'everyone') => void;
  isCurrentUser: boolean;
}

type ChatFilter = 'all' | 'unread' | 'mentors' | 'groups' | 'students';

// --- HELPER COMPONENTS & FUNCTIONS ---
const MessageOptionsMenu: React.FC<MessageOptionsMenuProps> = ({ message, anchorEl, onClose, onDelete, isCurrentUser }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useLayoutEffect(() => {
    if (!anchorEl || !menuRef.current) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const menuHeight = menuRef.current.offsetHeight;
    const menuWidth = 200;
    const PADDING = 8;

    let newStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 100,
    };

    let top = anchorRect.top - menuHeight;
    if (top < PADDING) top = anchorRect.bottom;
    if (top + menuHeight > window.innerHeight - PADDING) top = window.innerHeight - menuHeight - PADDING;
    newStyle.top = `${top}px`;

    if (isCurrentUser) {
        let left = anchorRect.right - menuWidth;
        if (left < PADDING) left = PADDING;
        newStyle.left = `${left}px`;
    } else {
        let left = anchorRect.left;
        if (left + menuWidth > window.innerWidth - PADDING) left = window.innerWidth - menuWidth - PADDING;
        newStyle.left = `${left}px`;
    }
    
    setStyle({...newStyle, opacity: 1});
  }, [anchorEl, isCurrentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={style}
      className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-[200px] overflow-hidden transition-all animate-in zoom-in-95 duration-150"
    >
      <div className="py-1">
        <button 
          onClick={() => { onDelete(message.id, 'me'); onClose(); }} 
          className="w-full text-left px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
        >
          <Trash2 size={14} className="text-slate-500" /> Purge for Me
        </button>
        {isCurrentUser && (
            <button 
              onClick={() => { onDelete(message.id, 'everyone'); onClose(); }} 
              className="w-full text-left px-4 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-3"
            >
              <ShieldCheck size={14} /> Purge for Global
            </button>
        )}
      </div>
    </div>
  );
};

const timeSince = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const intervals: { [key: string]: number } = { y: 31536000, mo: 2592000, d: 86400, h: 3600, m: 60 };
    for (const key in intervals) {
        const interval = Math.floor(seconds / intervals[key]);
        if (interval >= 1) return `${interval}${key}`;
    }
    return Math.floor(seconds) + "s";
};

const formatMessageTime = (date: string): string => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const renderLastMessagePreview = (message: ChatMessage) => {
    if (message.isDeleted) return 'Transmission purged';
    const { type, text, fileName } = message.content;
    switch(type) {
        case 'text': return text || '';
        case 'image': return 'Visual data attached';
        case 'video': return 'Stream data attached';
        case 'audio': return 'Vocal data attached';
        case 'file': return `Asset: ${fileName || 'Resource'}`;
        case 'system': return text || 'Node update';
        default: return '';
    }
};

// --- SUB-COMPONENTS ---

interface ConversationListProps {
  activeConversationId: string | null;
  conversations: EnrichedConversation[];
  onSelectChat: (id: string) => void;
  onAddNewChat: () => void;
  onDeleteConversation: (conv: EnrichedConversation) => void;
  typingIndicators: Record<string, { userId: string; name: string; } | null>;
  currentUserId: string;
  chatFilter: ChatFilter;
  onFilterChange: (filter: ChatFilter) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
    activeConversationId, conversations, onSelectChat, onAddNewChat, 
    onDeleteConversation, typingIndicators, currentUserId, chatFilter, onFilterChange 
}) => {
  const [search, setSearch] = useState('');

  const filteredConversations = useMemo(() => {
    return conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [conversations, search]);

  return (
    <div className={`w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col bg-slate-900/50 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat">Nodes</h2>
              <button 
                onClick={onAddNewChat} 
                className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-90"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-all" size={16} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Query nodes..." 
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {(['all', 'unread', 'mentors', 'groups', 'students'] as ChatFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => onFilterChange(f)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${chatFilter === f ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-slate-800 text-slate-500 border-white/5 hover:text-slate-300'}`}
                >
                  {f}
                </button>
              ))}
            </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-1">
            {filteredConversations.length === 0 ? (
                <div className="text-center py-20 px-6 opacity-30">
                    <MessageSquare size={48} className="mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">No Active Channels</p>
                </div>
            ) : (
              filteredConversations.map(conv => {
                 const typingInfo = typingIndicators[conv.id];
                 const isSomeoneElseTyping = typingInfo && typingInfo.userId !== currentUserId;
                 const isActive = activeConversationId === conv.id;
                 
                 return (
                    <button 
                        key={conv.id} 
                        onClick={() => onSelectChat(conv.id)}
                        className={`w-full p-4 flex items-center gap-4 rounded-[1.5rem] transition-all relative group text-left ${isActive ? 'bg-blue-600/10 border border-blue-500/20 shadow-xl shadow-blue-900/10' : 'border border-transparent hover:bg-white/5'}`}
                    >
                        <div className="relative flex-shrink-0">
                          <img src={conv.imageUrl} className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/10" />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-slate-900 ${conv.type === 'group' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <div className="flex justify-between items-center mb-0.5">
                                <p className={`font-bold text-sm truncate transition-colors ${isActive ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>{conv.name}</p>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{timeSince(conv.lastMessage.timestamp)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                {isSomeoneElseTyping ? (
                                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest animate-pulse">Syncing Input...</p>
                                ) : (
                                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-slate-300 font-bold' : 'text-slate-500 font-medium'}`}>{renderLastMessagePreview(conv.lastMessage)}</p>
                                )}
                                {conv.unreadCount > 0 && !isSomeoneElseTyping && (
                                   <div className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md min-w-[1.25rem] text-center shadow-lg shadow-blue-900/40">{conv.unreadCount}</div>
                                )}
                            </div>
                        </div>
                    </button>
                 );
              })
            )}
        </div>
    </div>
  );
};

interface ChatViewProps {
  activeConversationDetails: (EnrichedConversation & { messages: ChatMessage[] }) | null;
  activeConversationId: string | null;
  currentUserId: string;
  userRole: UserRole;
  userMap: Map<string, User>;
  typingIndicator: { userId: string, name: string } | null;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onOpenOptionsMenu: (message: ChatMessage, anchorEl: HTMLElement) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ 
    activeConversationDetails, activeConversationId, currentUserId, userRole, userMap, typingIndicator,
    newMessage, onNewMessageChange, onSendMessage, onFileSelect, onBack, onOpenOptionsMenu
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConversationDetails?.messages, typingIndicator]);
    
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
        }
    }, [newMessage]);

    if (!activeConversationDetails) {
      return (
        <div className="flex-1 items-center justify-center text-center hidden md:flex bg-slate-950/20">
            <div className="space-y-6">
                <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-slate-700 shadow-inner mx-auto ring-1 ring-white/5">
                   <Hash size={48} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Select Access Node</h3>
                   <p className="text-slate-600 text-sm max-w-xs mx-auto mt-2 font-medium">Initialize a peer-to-peer or group uplink from the directory to begin protocol exchange.</p>
                </div>
            </div>
        </div>
      );
    }
    
    return (
        <div className={`flex-1 flex flex-col bg-slate-950/20 ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
            {/* Elite Chat Header */}
            <header className="h-20 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-8 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="md:hidden p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="relative">
                      <img src={activeConversationDetails.imageUrl} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10" />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-4 border-slate-900" />
                    </div>
                    <div>
                        <h4 className="font-black text-white tracking-tight uppercase font-montserrat">{activeConversationDetails.name}</h4>
                        <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{activeConversationDetails.type === 'group' ? `${activeConversationDetails.messages.length} Members` : 'Active Uplink Secured'}</p>
                        </div>
                    </div>
                </div>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                    <Info size={20} />
                </button>
            </header>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {activeConversationDetails.messages.map((msg, i) => {
                    const sender = userMap.get(msg.senderId);
                    const isMe = msg.senderId === currentUserId;
                    
                    if(msg.content.type === 'system') {
                        return (
                          <div key={msg.id} className="flex justify-center py-4">
                            <div className="px-4 py-1.5 bg-slate-800/40 border border-white/5 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                {msg.content.text}
                            </div>
                          </div>
                        );
                    }

                    const showAvatar = !isMe && (i === 0 || activeConversationDetails.messages[i-1].senderId !== msg.senderId);

                    return (
                        <div key={msg.id} className={`flex items-end gap-4 ${isMe ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 duration-300`}>
                             {!isMe && (
                               <div className="w-8 flex-shrink-0">
                                 {showAvatar && <img src={sender?.imageUrl} className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10" />}
                               </div>
                             )}
                            
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] md:max-w-[70%]`}>
                                {activeConversationDetails.type === 'group' && !isMe && showAvatar && (
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-tight mb-1">{sender?.name}</p>
                                )}
                                <div className={`p-4 rounded-xl relative shadow-xl ${isMe ? 'bg-blue-600 text-white rounded-br-none shadow-blue-900/10' : 'bg-slate-800/50 backdrop-blur-md border border-white/5 text-slate-200 rounded-bl-none'}`}>
                                     {msg.isDeleted ? (
                                        <p className="text-slate-500 italic text-xs">Transmission purged</p>
                                     ) : (
                                        <>
                                            {msg.content.type === 'text' && (
                                                <MarkdownRenderer content={msg.content.text || ''} className="prose prose-sm prose-invert" />
                                            )}
                                            {msg.content.type === 'image' && msg.content.url && (
                                                <img src={msg.content.url} alt="Attached Visual" className="w-full max-h-48 object-cover rounded-lg" />
                                            )}
                                            {msg.content.type === 'audio' && msg.content.url && (
                                                <audio src={msg.content.url} controls className="w-full accent-blue-600" />
                                            )}
                                            {msg.content.type === 'video' && msg.content.url && (
                                                <video src={msg.content.url} controls className="w-full rounded-lg" />
                                            )}
                                            {msg.content.type === 'file' && msg.content.url && (
                                                <a href={msg.content.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300">
                                                    <FileText size={16} /> {msg.content.fileName || 'Attached File'}
                                                </a>
                                            )}
                                        </>
                                     )}

                                     <span className={`absolute -bottom-1 right-2 text-[8px] font-black text-slate-600 uppercase tracking-widest ${isMe ? 'group-hover:text-white' : ''}`}>
                                        {formatMessageTime(msg.timestamp)} {isMe && (msg.isRead ? <CheckCheck size={10} className="inline-block ml-1 text-blue-300" /> : <Check size={10} className="inline-block ml-1 text-slate-500" />)}
                                     </span>
                                     <button
                                         onClick={(e) => onOpenOptionsMenu(msg, e.currentTarget)}
                                         className={`absolute top-2 ${isMe ? 'left-2' : 'right-2'} p-1 text-slate-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                                     >
                                         <MoreVertical size={14} />
                                     </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
                {typingIndicator && typingIndicator.userId !== currentUserId && (
                    <div className="flex items-center gap-3 animate-pulse px-4 py-2">
                        <img src={userMap.get(typingIndicator.userId)?.imageUrl} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syncing Input ({typingIndicator.name})...</span>
                    </div>
                )}
            </div>

            {/* Input Footer */}
            <footer className="p-8 bg-slate-900 border-t border-white/5">
                <form onSubmit={onSendMessage} className="max-w-4xl mx-auto flex gap-4 items-end">
                    <div className="flex items-center gap-2">
                        <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-4 bg-slate-800 text-slate-500 hover:text-blue-400 hover:bg-blue-600/10 rounded-2xl transition-all">
                            <Paperclip size={20} />
                        </button>
                    </div>

                    <div className="flex-1 relative group">
                        <textarea
                            ref={textareaRef}
                            value={newMessage}
                            onChange={(e) => onNewMessageChange(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSendMessage(e); } }}
                            placeholder="Transmit secured message..."
                            className="w-full bg-slate-800 border border-white/5 rounded-[1.5rem] p-5 pr-14 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none max-h-32"
                            rows={1}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-600">
                           <Bold size={16} />
                           <Italic size={16} />
                           <List size={16} />
                           <Smile size={16} />
                        </div>
                    </div>
                    <button type="submit" disabled={!newMessage.trim()} className="p-5 bg-blue-600 text-white rounded-[1.5rem] hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-30"><Send size={22} /></button>
                </form>
            </footer>
        </div>
    );
};


interface ChatPageProps {
    mentors: Mentor[];
    groups: Group[];
    messages: ChatMessage[];
    allUsers: User[];
    currentUserId: string;
    activeConversationId: string | null;
    onSelectChat: (id: string | null) => void;
    onSendMessage: (conversationId: string, content: ChatMessage['content']) => void;
    onBack: () => void;
    typingIndicators: Record<string, { userId: string, name: string } | null>;
    onDeleteConversation: (conversationId: string) => void;
    onCreateConversation: (name: string | null, memberIds: string[]) => void;
    onDeleteMessage: (messageId: number, deleteType: 'me' | 'everyone') => void;
    userRole: UserRole;
}

// FIX: Define the main ChatPage component and export it as default.
const ChatPage: React.FC<ChatPageProps> = ({
    mentors, groups, messages, allUsers, currentUserId,
    activeConversationId, onSelectChat, onSendMessage,
    onBack, typingIndicators, onDeleteConversation,
    onCreateConversation, onDeleteMessage, userRole
}) => {
    const [newMessage, setNewMessage] = useState('');
    const [chatFilter, setChatFilter] = useState<ChatFilter>('all');
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [messageOptionsMenu, setMessageOptionsMenu] = useState<{ message: ChatMessage, anchorEl: HTMLElement } | null>(null);

    const userMap = useMemo(() => new Map(allUsers.map(u => [u.id, u])), [allUsers]);

    const conversations: EnrichedConversation[] = useMemo(() => {
        const uniqueConversationIds = Array.from(new Set(messages.map(m => m.conversationId)));

        return uniqueConversationIds
            .map(convId => {
                const convMessages = messages
                    .filter(m => m.conversationId === convId && (!m.deletedFor || !m.deletedFor.includes(currentUserId)))
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                if (convMessages.length === 0) return null;

                const lastMessage = convMessages[convMessages.length - 1];
                const unreadCount = convMessages.filter(m => !m.isRead && m.senderId !== currentUserId).length;

                const group = groups.find(g => g.id === convId);
                if (group) {
                    return {
                        id: convId,
                        type: 'group',
                        name: group.name,
                        imageUrl: group.imageUrl,
                        lastMessage,
                        unreadCount,
                    };
                }

                // Direct chat logic
                const participantIds = Array.from(new Set(convMessages.flatMap(m => [m.senderId, ...(userMap.get(m.senderId)?.id ? [userMap.get(m.senderId)?.id!] : [])]))).filter(id => id !== 'system');
                const otherUserId = participantIds.find(id => id !== currentUserId);
                const otherUser = otherUserId ? userMap.get(otherUserId) : undefined;

                if (otherUser) {
                    return {
                        id: convId,
                        type: 'direct',
                        name: otherUser.name,
                        imageUrl: otherUser.imageUrl,
                        lastMessage,
                        unreadCount,
                    };
                }
                return null;
            })
            .filter(Boolean) as EnrichedConversation[];
    }, [messages, groups, currentUserId, userMap]);

    const filteredConversations = useMemo(() => {
        let result = conversations;
        if (chatFilter === 'unread') {
            result = result.filter(c => c.unreadCount > 0);
        } else if (chatFilter === 'mentors') {
            result = result.filter(c => c.type === 'direct' && mentors.some(m => m.name === c.name));
        } else if (chatFilter === 'groups') {
            result = result.filter(c => c.type === 'group');
        } else if (chatFilter === 'students') {
            result = result.filter(c => c.type === 'direct' && !mentors.some(m => m.name === c.name));
        }
        return result.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
    }, [conversations, chatFilter, mentors]);

    const activeConversationDetails = useMemo(() => {
        if (!activeConversationId) return null;
        const conv = conversations.find(c => c.id === activeConversationId);
        if (!conv) return null;
        const convMessages = messages.filter(m => m.conversationId === activeConversationId && (!m.deletedFor || !m.deletedFor.includes(currentUserId)));
        return { ...conv, messages: convMessages };
    }, [activeConversationId, conversations, messages, currentUserId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;
        onSendMessage(activeConversationId, { type: 'text', text: newMessage });
        setNewMessage('');
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeConversationId) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                let contentType: ChatMessage['content']['type'] = 'file';
                if (file.type.startsWith('image/')) contentType = 'image';
                else if (file.type.startsWith('audio/')) contentType = 'audio';
                else if (file.type.startsWith('video/')) contentType = 'video';

                onSendMessage(activeConversationId, {
                    type: contentType,
                    url: event.target.result as string,
                    fileName: file.name,
                    fileSize: file.size,
                });
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex h-[calc(100vh-11rem)] min-h-[580px] w-full border border-white/10 rounded-3xl overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-xl">
            <ConversationList
                activeConversationId={activeConversationId}
                conversations={filteredConversations}
                onSelectChat={onSelectChat}
                onAddNewChat={() => setIsNewChatModalOpen(true)}
                onDeleteConversation={onDeleteConversation}
                typingIndicators={typingIndicators}
                currentUserId={currentUserId}
                chatFilter={chatFilter}
                onFilterChange={setChatFilter}
            />
            <ChatView
                activeConversationDetails={activeConversationDetails}
                activeConversationId={activeConversationId}
                currentUserId={currentUserId}
                userRole={userRole}
                userMap={userMap}
                typingIndicator={activeConversationId ? typingIndicators[activeConversationId] : null}
                newMessage={newMessage}
                onNewMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
                onFileSelect={handleFileSelect}
                onBack={() => onSelectChat(null)}
                onOpenOptionsMenu={(message, anchorEl) => setMessageOptionsMenu({ message, anchorEl })}
            />
            {isNewChatModalOpen && (
                <NewChatModal
                    onClose={() => setIsNewChatModalOpen(false)}
                    allUsers={allUsers}
                    currentUserId={currentUserId}
                    onCreateConversation={(name, memberIds) => {
                        onCreateConversation(name, memberIds);
                        setIsNewChatModalOpen(false);
                    }}
                />
            )}
            {messageOptionsMenu && (
                <MessageOptionsMenu
                    message={messageOptionsMenu.message}
                    anchorEl={messageOptionsMenu.anchorEl}
                    onClose={() => setMessageOptionsMenu(null)}
                    onDelete={onDeleteMessage}
                    isCurrentUser={messageOptionsMenu.message.senderId === currentUserId}
                />
            )}
        </div>
    );
};

export default ChatPage;