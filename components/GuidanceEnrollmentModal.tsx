
import React, { useState } from 'react';
import type { GuidanceClass } from '../types.ts';
import PaymentModal from './PaymentModal.tsx';
import { X, Zap, ShieldCheck } from 'lucide-react';

interface GuidanceEnrollmentModalProps {
  guidanceClass: GuidanceClass;
  onClose: () => void;
  onConfirm: (classId: number) => void;
}

const GuidanceEnrollmentModal: React.FC<GuidanceEnrollmentModalProps> = ({ guidanceClass, onClose, onConfirm }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const price = (guidanceClass.price && guidanceClass.price > 0) ? guidanceClass.price : 499;

  const handleProceedToPayment = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    onConfirm(guidanceClass.id);
    setIsPaymentModalOpen(false);
    onClose();
  };

  return (
    <>
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Strategy Uplink</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Mentor Enrollment Authorization</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><X size={20} /></button>
        </header>

        <div className="p-8 space-y-6">
            <div className="flex items-center gap-5 p-5 bg-slate-800/30 rounded-3xl border border-white/5">
                <img src={guidanceClass.imageUrl} className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/10" alt={guidanceClass.title} />
                <div>
                   <h4 className="font-bold text-white text-sm leading-tight">{guidanceClass.title}</h4>
                   <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mt-1">{guidanceClass.instructor}</p>
                </div>
            </div>

            <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Access Protocol Fee</p>
                   <p className="text-2xl font-black text-emerald-400 font-mono">₹{price}</p>
                </div>
                <div className="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-500">
                   <ShieldCheck size={24} />
                </div>
            </div>
        </div>

        <footer className="p-8 bg-slate-900 border-t border-white/5">
            <button
              onClick={handleProceedToPayment}
              className="w-full py-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-2xl active:scale-95 transition-all shadow-xl shadow-violet-900/30 uppercase text-xs tracking-widest flex items-center justify-center gap-3 cursor-pointer"
            >
              <Zap size={20} />
              <span>Enroll & Pay (₹{price})</span>
            </button>
        </footer>
      </div>
    </div>
    {isPaymentModalOpen && (
        <PaymentModal 
            itemName={`Guidance Session: ${guidanceClass.title}`}
            amount={price}
            category="Guidance Mentorship Pass"
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={handlePaymentSuccess}
        />
    )}
    </>
  );
};

export default GuidanceEnrollmentModal;
