
import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Download, Image, Music, Video, ExternalLink, PlayCircle } from 'lucide-react';
import type { AppNotification as Notification, PlayableMedia } from '../types.ts';

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onOpenModal?: () => void;
  onPlayMedia?: (media: PlayableMedia) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onMarkAsRead, onOpenModal, onPlayMedia }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const timeSince = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  const MediaPreview: React.FC<{ notification: Notification }> = ({ notification }) => {
    if (!notification.mediaUrl || !notification.mediaType) return null;

    const handleMediaClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onPlayMedia?.({ type: notification.mediaType!, url: notification.mediaUrl! });
    };
    
    switch (notification.mediaType) {
        case 'image':
            return (
                <div className="mt-3 relative group cursor-pointer rounded-xl overflow-hidden border border-white/5" onClick={handleMediaClick}>
                    <img src={notification.mediaUrl} alt="Attachment" className="w-full h-auto max-h-32 object-cover opacity-80 group-hover:opacity-100 transition-all" />
                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <PlayCircle size={24} className="text-white" />
                    </div>
                </div>
            );
        case 'audio':
            return (
                <button onClick={handleMediaClick} className="mt-3 w-full p-2 bg-slate-800 border border-white/5 rounded-xl flex items-center gap-3 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-slate-700 transition-all">
                    <Music size={14} /> Play Transmission
                </button>
            );
        case 'video':
             return (
                <button onClick={handleMediaClick} className="mt-3 w-full p-2 bg-slate-800 border border-white/5 rounded-xl flex items-center gap-3 text-[10px] font-black text-rose-400 uppercase tracking-widest hover:bg-slate-700 transition-all">
                    <Video size={14} /> Stream Asset
                </button>
            );
        default: return null;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2.5 bg-slate-900 border border-white/5 rounded-xl hover:bg-slate-800 transition-all group">
        <Bell size={20} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-[9px] font-black rounded-full flex items-center justify-center border-2 border-slate-950">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="p-6 bg-slate-900/50 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Alerts</h3>
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-black rounded-md">{unreadCount} New</span>
          </div>
          
          <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <div 
                    key={n.id} 
                    onClick={() => !n.read && onMarkAsRead(n.id)} 
                    className={`p-6 border-b border-white/5 flex gap-4 transition-all cursor-pointer ${!n.read ? 'bg-blue-600/5 hover:bg-blue-600/10' : 'hover:bg-white/5 opacity-60'}`}
                >
                    <div className="flex-grow">
                        <p className="text-xs font-medium text-slate-200 leading-relaxed">{n.message}</p>
                        <MediaPreview notification={n} />
                        <p className="text-[8px] font-black text-slate-600 mt-3 uppercase tracking-widest">{timeSince(n.timestamp)}</p>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-3 opacity-20">
                <Bell size={40} className="mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Quiet Channel</p>
              </div>
            )}
          </div>

          {onOpenModal && (
            <div className="p-4 bg-slate-900 border-t border-white/5">
                <button onClick={() => { onOpenModal(); setIsOpen(false); }} className="w-full py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-[9px] font-black rounded-xl transition-all uppercase tracking-widest">Broadcast Alert</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
