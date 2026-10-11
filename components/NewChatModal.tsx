
import React, { useState, useMemo } from 'react';
import { X, Search, UserPlus, Users, ShieldCheck, Check } from 'lucide-react';
import { User } from '../types.ts';

interface NewChatModalProps {
  onClose: () => void;
  allUsers: User[];
  currentUserId: string;
  onCreateConversation: (name: string | null, memberIds: string[]) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ onClose, allUsers, currentUserId, onCreateConversation }) => {
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState('');

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => 
      u.id !== currentUserId && 
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [allUsers, currentUserId, search]);

  const toggleUser = (userId: string) => {
    const next = new Set(selectedUsers);
    if (next.has(userId)) next.delete(userId);
    else next.add(userId);
    setSelectedUsers(next);
  };

  const handleCreate = () => {
    if (selectedUsers.size === 0) return;
    const memberIds = Array.from(selectedUsers);
    if (selectedUsers.size === 1) {
      onCreateConversation(null, [currentUserId, ...memberIds]);
    } else {
      onCreateConversation(groupName || 'New Squad', [currentUserId, ...memberIds]);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Establish Uplink</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Initiate Secure Transmission</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </header>

        <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar max-h-[60vh]">
          {selectedUsers.size > 1 && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Group Identifier</label>
              <input 
                type="text" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Define squad name..."
                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-all" size={16} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search global directory..."
              className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Verified Nodes</p>
            <div className="space-y-1">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${selectedUsers.has(user.id) ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-800/30 border-transparent hover:bg-slate-800/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <img src={user.imageUrl} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="text-left">
                      <p className={`text-sm font-bold ${selectedUsers.has(user.id) ? 'text-blue-400' : 'text-slate-200'}`}>{user.name}</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{user.role || 'ASSET'}</p>
                    </div>
                  </div>
                  {selectedUsers.has(user.id) ? (
                    <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <Check size={14} />
                    </div>
                  ) : (
                    <UserPlus size={18} className="text-slate-600 group-hover:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <footer className="p-8 bg-slate-900 border-t border-white/5">
          <button
            onClick={handleCreate}
            disabled={selectedUsers.size === 0}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <ShieldCheck size={20} />
            {selectedUsers.size > 1 ? `Synthesize Squad (${selectedUsers.size})` : 'Initialize Peer Link'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default NewChatModal;
