import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SimpleConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: string;
}

const SimpleConfirmationModal: React.FC<SimpleConfirmationModalProps> = ({
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmColor = 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20'
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center space-y-6">
           <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
              <AlertTriangle size={32} />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">{title}</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{message}</p>
           </div>
           
           <div className="flex gap-3 pt-2">
              <button 
                onClick={onClose} 
                className="flex-1 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest"
              >
                 Abort
              </button>
              <button 
                onClick={onConfirm} 
                className={`flex-1 py-4 text-white font-black rounded-2xl transition-all shadow-xl uppercase text-[10px] tracking-widest ${confirmColor}`}
              >
                 {confirmText}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleConfirmationModal;