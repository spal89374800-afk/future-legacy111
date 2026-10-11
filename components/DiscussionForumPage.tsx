import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { ForumPost, ForumReply } from '../types.ts';
import MarkdownRenderer from './MarkdownRenderer.tsx';
import { 
  Users, MessageSquare, Search, 
  Plus, Send, ChevronLeft, X, Sparkles, TrendingUp
} from 'lucide-react';

declare global {
  interface Window {
    marked: { parse: (markdown: string, options?: object) => string; };
    // renderMathInElement and katex are no longer used
  }
}

const timeSince = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const intervals: { [key: string]: number } = { y: 31536000, mo: 2592000, d: 86400, h: 3600, m: 60 };
    for (const key in intervals) {
        const interval = Math.floor(seconds / intervals[key]);
        if (interval >= 1) return `${interval}${key} ago`;
    }
    return Math.floor(seconds) + "s ago";
};

const NewPostModal: React.FC<{
    onClose: () => void;
    onSave: (data: { title: string; content: string }) => void;
}> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && content.trim()) {
            onSave({ title, content });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Start New Discussion</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Student & Educator Community Forum</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><X size={20} /></button>
                </header>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Discussion Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="What would you like to discuss or ask?..." 
                            required 
                            className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Question or Topic Details</label>
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Write your question, doubt or conceptual explanation in detail..." 
                            rows={8} 
                            required 
                            className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[200px]"
                        ></textarea>
                    </div>
                    <div className="pt-4 space-y-4">
                        <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 cursor-pointer">
                            <Send size={18} /> Post Discussion
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PostDetailView: React.FC<{
    post: ForumPost;
    onBack: () => void;
    onAddReply: (postId: number, content: string) => void;
}> = ({ post, onBack, onAddReply }) => {
    const [newReply, setNewReply] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [post.replies]);

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReply.trim()) {
            onAddReply(post.id, newReply);
            setNewReply('');
        }
    };
    
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <button 
                onClick={onBack} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
                <ChevronLeft size={16} /> Back to Directory
            </button>
            
            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                <div className="p-10 border-b border-white/5 bg-slate-900/50">
                    <h2 className="text-3xl font-black text-white font-montserrat tracking-tight leading-tight uppercase mb-4 break-words">{post.title}</h2>
                    <div className="flex items-center gap-4">
                        <img src={post.authorImageUrl} alt={post.author} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10" />
                        <div>
                            <p className="text-sm font-black text-blue-400 uppercase tracking-tight">{post.author}</p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{timeSince(post.timestamp)} • Original Transmission</p>
                        </div>
                    </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                    <div className="bg-slate-800/20 p-8 rounded-[2rem] border border-white/5">
                        <MarkdownRenderer content={post.content} className="prose prose-lg prose-invert text-slate-300 max-w-none" />
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Secure Replies ({post.replies.length})</h3>
                        {post.replies.length > 0 ? post.replies.map(reply => (
                            <div key={reply.id} className="flex items-start gap-4 animate-in slide-in-from-left-2">
                                <img src={reply.authorImageUrl} alt={reply.author} className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/5" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-black text-slate-200 uppercase tracking-tight">{reply.author}</p>
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{timeSince(reply.timestamp)}</p>
                                    </div>
                                    <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 text-sm text-slate-400 leading-relaxed break-words">
                                        <MarkdownRenderer content={reply.content} className="prose prose-sm prose-invert text-slate-400 max-w-none" />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-20">
                                <MessageSquare size={32} className="mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Peer Responses Detected</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-slate-900 border-t border-white/5">
                     <form onSubmit={handleReplySubmit} className="flex gap-4">
                        <textarea 
                            value={newReply} 
                            onChange={(e) => setNewReply(e.target.value)} 
                            placeholder="Input your response to the discourse..." 
                            rows={1} 
                            required 
                            className="flex-1 bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                        ></textarea>
                        <button type="submit" className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                            <Send size={16} /> Transmit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

interface DiscussionForumPageProps {
    posts: ForumPost[];
    onAddPost: (data: { title: string; content: string }) => void;
    onAddReply: (postId: number, content: string) => void;
}

const DiscussionForumPage: React.FC<DiscussionForumPageProps> = ({ posts = [], onAddPost, onAddReply }) => {
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    
    const sortedPosts = useMemo(() => {
        return [...posts]
            .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                const lastReplyA = a.replies[a.replies.length - 1]?.timestamp || a.timestamp;
                const lastReplyB = b.replies[b.replies.length - 1]?.timestamp || b.timestamp;
                return new Date(lastReplyB).getTime() - new Date(lastReplyA).getTime();
            });
    }, [posts, search]);

    const selectedPost = useMemo(() => {
        return posts.find(p => p.id === selectedPostId) || null;
    }, [posts, selectedPostId]);
    
    if (selectedPost) {
        return <PostDetailView post={selectedPost} onBack={() => setSelectedPostId(null)} onAddReply={onAddReply} />
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-24">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[9px] font-black uppercase tracking-widest">
                        <Users size={12} />
                        Discourse Node Network
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-montserrat leading-none">Discussion Forum</h2>
                    <p className="text-slate-500 font-medium max-w-xl">Exchange verified intelligence, collaborate on modular projects, and engage in mentor-guided academic discourse.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-all" size={16} />
                        <input 
                            type="text" 
                            placeholder="Query discourse archives..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-900 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all w-full md:w-64"
                        />
                    </div>
                    <button 
                        onClick={() => setIsNewPostModalOpen(true)} 
                        className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20"
                    >
                        <Plus size={18} />
                        Initialize Thread
                    </button>
                </div>
            </header>
            
            <div className="grid grid-cols-1 gap-4">
                {sortedPosts.length > 0 ? sortedPosts.map(post => (
                    <button 
                        key={post.id} 
                        onClick={() => setSelectedPostId(post.id)} 
                        className="w-full text-left bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 hover:bg-slate-900 transition-all flex items-center gap-8 group shadow-2xl"
                    >
                         <div className="flex-shrink-0 w-24 text-center border-r border-white/5 pr-8">
                            <p className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors leading-none mb-1">{post.replies.length}</p>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Responses</p>
                        </div>
                        <div className="flex-grow min-w-0">
                            <h3 className="font-black text-xl text-white uppercase tracking-tight font-montserrat truncate mb-2 group-hover:whitespace-normal group-hover:break-words">{post.title}</h3>
                            <div className="flex items-center gap-3">
                                <img src={post.authorImageUrl} className="w-5 h-5 rounded-md object-cover opacity-60" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Author: <span className="text-slate-300">{post.author}</span> • {timeSince(post.timestamp)}
                                </p>
                            </div>
                        </div>
                         <div className="text-right flex-shrink-0 hidden sm:block pl-8 border-l border-white/5">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Temporal Sync</p>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-tight">{timeSince(post.replies[post.replies.length - 1]?.timestamp || post.timestamp)}</p>
                        </div>
                    </button>
                )) : (
                    <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-slate-700 shadow-inner">
                            <MessageSquare size={48} />
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h4 className="text-xl font-black text-slate-400 uppercase tracking-tight">Archives Idle</h4>
                            <p className="text-slate-600 text-sm font-medium">No active discourse threads detected matching your query parameters.</p>
                        </div>
                    </div>
                )}
            </div>

            {isNewPostModalOpen && (
                <NewPostModal 
                    onClose={() => setIsNewPostModalOpen(false)} 
                    onSave={(data) => {
                        onAddPost(data);
                        setIsNewPostModalOpen(false);
                    }} 
                />
            )}
        </div>
    );
};

export default DiscussionForumPage;