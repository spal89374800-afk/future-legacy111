

import React, { useState } from 'react';
import type { AgroClass } from '../types.ts';
import PaymentModal from './PaymentModal.tsx';
import { X, PlayCircle, ShieldCheck, Zap, Video, Award } from 'lucide-react';

// Removed unused declare global for renderMathInElement and katex

interface RecordingPurchaseModalProps {
  agroClass: AgroClass;
  onClose: () => void;
  onConfirm: (classId: number) => void;
}

const RecordingPurchaseModal: React.FC<RecordingPurchaseModalProps> = ({ agroClass, onClose, onConfirm }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePaymentSuccess = () => {
    onConfirm(agroClass.id);
    setIsPaymentModalOpen(false);
    onClose();
  };
  
  const price = agroClass.recorded_price ?? 299;
  const itemName = `Archive Node Retrieval: ${agroClass.title}`;

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
          <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all z-10">
            <X size={20} />
          </button>
          
          <div className="p-10 space-y-8">
            <header className="space-y-4 text-center">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto shadow-inner ring-1 ring-white/5">
                <Video size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat leading-tight">Purchase Recording</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Archive Retrieval Protocol</p>
              </div>
            </header>

            <div className="space-y-6">
                <p className="text-slate-400 text-sm font-medium text-center leading-relaxed">
                    You are authorizing the retrieval of a permanent academic downlink for:
                </p>
                
                <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center gap-4 text-center">
                    <div className="relative">
                        <img src={agroClass.imageUrl} alt={agroClass.title} className="w-24 h-24 rounded-[1.5rem] object-cover border border-white/10 opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle size={32} className="text-white/50" />
                        </div>
                    </div>
                    <div>
                        <p className="font-black text-white uppercase tracking-tight text-lg leading-tight">"{agroClass.title}"</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Directed by {agroClass.instructor}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Version</p>
                        <p className="text-xs font-black text-slate-300">HIGH-DEF STREAM</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Retrieval Fee</p>
                        <p className="text-2xl font-black text-blue-400">₹{price}</p>
                    </div>
                </div>
            </div>

            <div className="pt-4 space-y-6">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-blue-900/20 uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <Zap size={20} className="fill-current" />
                Authorize Retrieval
              </button>
            </div>
          </div>
        </div>
      </div>
      {isPaymentModalOpen && (
          <PaymentModal 
              itemName={itemName}
              amount={price}
              onClose={() => setIsPaymentModalOpen(false)}
              onPaymentSuccess={handlePaymentSuccess}
          />
      )}
    </>
  );
};

export default RecordingPurchaseModal;