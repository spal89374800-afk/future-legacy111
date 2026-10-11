import React, { useState, useMemo } from 'react';
import type { LibraryItem, UserRole, SkillClass, AgroClass } from '../types.ts';
import LibraryFormModal from './LibraryFormModal.tsx';
import PaymentModal from './PaymentModal.tsx';
import { ELibraryReaderModal } from './ELibraryReaderModal.tsx';
import { safeGetItem, safeSetItem } from '../utils/storage.ts';
import { 
  Book, Search, Filter, ArrowUpRight, 
  Download, ShieldCheck, Lock, Plus, 
  BookOpen, Layers, Sparkles, ShoppingBag, Check
} from 'lucide-react';

declare global {
    interface ClipboardItem {
      readonly types: readonly string[];
      readonly presentationStyle: "unspecified" | "inline" | "attachment";
      getType(type: string): Promise<Blob>;
    }
    interface Clipboard {
      write(data: ClipboardItem[]): Promise<void>;
    }
    // renderMathInElement and katex are no longer used
}

interface ELibraryPageProps {
  items: LibraryItem[];
  onSave: (data: Omit<LibraryItem, 'id'>, id?: number) => void;
  userRole: UserRole;
  skillClasses: SkillClass[];
  agroClasses: AgroClass[];
}

const ELibraryPage: React.FC<ELibraryPageProps> = ({ items, onSave, userRole, skillClasses, agroClasses }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | LibraryItem['type']>('all');
    
    // Track purchased books / notes directly
    const [purchasedBookIds, setPurchasedBookIds] = useState<number[]>(() => {
        return safeGetItem<number[]>('purchased_library_items', []);
    });

    // Payment Modal State for direct book/material checkout
    const [checkoutItem, setCheckoutItem] = useState<{ id: number; title: string; price: number; type: string } | null>(null);

    // Fullscreen In-App Book Reader State
    const [readingItem, setReadingItem] = useState<LibraryItem | null>(null);

    const enrolledClassIds = useMemo(() => {
        const skillIds = skillClasses.filter(c => c.isEnrolled).map(c => c.id);
        const agroIds = agroClasses.filter(c => c.isEnrolled).map(c => c.id);
        return { 
            skill: new Set(skillIds), 
            agro: new Set(agroIds) 
        };
    }, [skillClasses, agroClasses]);

    const hasAccess = (item: LibraryItem): boolean => {
        if (userRole === 'admin') return true;
        if (!item.isProtected) return true;
        if (purchasedBookIds.includes(item.id)) return true;
        if (!item.classId || !item.classType) return false;
        return enrolledClassIds[item.classType]?.has(item.classId);
    };

    const handleUnlockItemSuccess = () => {
        if (checkoutItem) {
            const updated = [...purchasedBookIds, checkoutItem.id];
            setPurchasedBookIds(updated);
            safeSetItem('purchased_library_items', updated);
            setCheckoutItem(null);
        }
    };
    
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const lowercasedQuery = searchQuery.toLowerCase();
            const searchMatch = lowercasedQuery === '' ||
                                item.title.toLowerCase().includes(lowercasedQuery) ||
                                item.author.toLowerCase().includes(lowercasedQuery) ||
                                item.description.toLowerCase().includes(lowercasedQuery);
            const typeMatch = typeFilter === 'all' || item.type === typeFilter;
            return searchMatch && typeMatch;
        });
    }, [items, searchQuery, typeFilter]);
    
    const handleSave = (data: Omit<LibraryItem, 'id'>, id?: number) => {
        onSave(data, id);
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const handleEdit = (item: LibraryItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleDownload = async (item: LibraryItem) => {
        try {
          const response = await fetch(item.fileUrl);
          if (!response.ok) throw new Error('Uplink failure.');
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          
          const fileExtension = item.fileUrl.split('.').pop()?.split('?')[0] || 'pdf';
          const fileName = `${item.title.replace(/[^a-zA-Z0-9 ]/g, '')}.${fileExtension}`;
          a.download = fileName;
    
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.warn('Direct blob retrieval restricted, opening resource URL directly:', error);
          const link = document.createElement('a');
          link.href = item.fileUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.download = item.title;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
    };


    const filterTypes: Array<'all' | LibraryItem['type']> = ['all', 'Book', 'Article', 'Research Paper', 'PDF Notes', 'PPT', 'Agriculture Magazine'];

    return (
        <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[9px] font-black uppercase tracking-widest">
                        <Book size={12} />
                        Universal Asset Repository
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-montserrat leading-none">E-Library</h2>
                    <p className="text-slate-500 font-medium max-w-xl">High-fidelity pedagogical resources. Access global archives and exclusive modular curriculum data.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-all" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search archive nodes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-900 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all w-full md:w-64"
                        />
                    </div>
                    {(userRole === 'admin' || userRole === 'teacher') && (
                        <button 
                            onClick={() => { setEditingItem(null); setIsFormOpen(true); }} 
                            className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20"
                        >
                            <Plus size={16} />
                            Ingest Asset
                        </button>
                    )}
                </div>
            </header>

            <section className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3 ml-2">
                    <Filter size={14} className="text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Archive Classification</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {filterTypes.map(f => (
                        <button 
                            key={f} 
                            onClick={() => setTypeFilter(f)} 
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${typeFilter === f ? 'bg-white text-slate-950 border-white shadow-xl' : 'bg-slate-950 text-slate-500 border-white/5 hover:border-white/10 hover:text-white'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {filteredItems.length > 0 ? filteredItems.map(item => {
                    const canAccess = hasAccess(item);
                    const itemPrice = item.price || 199;
                    return (
                        <div key={item.id} className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col group hover:border-blue-500/30 transition-all duration-500 shadow-2xl hover:-translate-y-2">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img src={item.coverImageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent" />
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">{item.type}</span>
                                        <span className="px-2.5 py-1 bg-blue-600/80 backdrop-blur-md rounded-full text-white text-[10px] font-black">₹{itemPrice}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-white font-montserrat tracking-tight leading-tight uppercase group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Author: {item.author}</p>
                                </div>
                                {item.isProtected && (
                                    <div className={`absolute top-6 right-6 p-2.5 rounded-2xl backdrop-blur-xl border ${canAccess ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                        {canAccess ? <ShieldCheck size={18} /> : <Lock size={18} />}
                                    </div>
                                )}
                            </div>
                            <div className="p-8 flex-grow flex flex-col space-y-6">
                                <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-3 italic break-words">"{item.description}"</p>
                                
                                <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        {canAccess ? (
                                            <>
                                                <button 
                                                    onClick={() => setReadingItem(item)} 
                                                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest text-center transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                                    title="Read and study in full-screen reader"
                                                >
                                                    <BookOpen size={15} /> Read Book (पढ़ें)
                                                </button>
                                                <button 
                                                    onClick={() => handleDownload(item)} 
                                                    className="p-4 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-all hover:bg-slate-700 cursor-pointer" 
                                                    title="Download Asset"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="w-full flex flex-col gap-3">
                                                <button
                                                    onClick={() => setCheckoutItem({
                                                        id: item.id,
                                                        title: item.title,
                                                        price: itemPrice,
                                                        type: item.type
                                                    })}
                                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest text-center shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                                >
                                                    <ShoppingBag size={14} /> Buy & Unlock PDF (₹{itemPrice})
                                                </button>
                                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-center">Instant Google Pay, PhonePe, Paytm or Razorpay</p>
                                            </div>
                                        )}
                                    </div>
                                    {(userRole === 'admin' || userRole === 'teacher') && (
                                        <button 
                                            onClick={() => handleEdit(item)} 
                                            className="text-[9px] font-black text-slate-600 hover:text-blue-400 transition-colors uppercase tracking-widest text-center py-2"
                                        >
                                            Modify Node Metadata
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }) : (
                    <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 py-32 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-slate-700 shadow-inner">
                            <BookOpen size={48} />
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h4 className="text-xl font-black text-slate-400 uppercase tracking-tight">Archives Idle</h4>
                            <p className="text-slate-600 text-sm font-medium">No assets matching your query parameters detected in the vault.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Direct Book / Study Material Payment Modal */}
            {checkoutItem && (
                <PaymentModal
                    itemName={checkoutItem.title}
                    amount={checkoutItem.price}
                    category={checkoutItem.type}
                    onClose={() => setCheckoutItem(null)}
                    onPaymentSuccess={handleUnlockItemSuccess}
                />
            )}

            {isFormOpen && (
                <LibraryFormModal 
                    item={editingItem} 
                    onClose={() => setIsFormOpen(false)} 
                    onSave={handleSave} 
                    skillClasses={skillClasses} 
                    agroClasses={agroClasses} 
                />
            )}

            {/* In-App Fullscreen Book / Document Reader */}
            {readingItem && (
                <ELibraryReaderModal
                    item={readingItem}
                    onClose={() => setReadingItem(null)}
                    onDownload={handleDownload}
                />
            )}
        </div>
    );
};

export default ELibraryPage;