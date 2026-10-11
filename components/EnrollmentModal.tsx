

import React, { useState } from 'react';
import type { SkillClass } from '../types.ts';
import PaymentModal from './PaymentModal.tsx';
import { X, CreditCard, Clock, Star, Zap } from 'lucide-react';

// Removed unused declare global for renderMathInElement and katex

interface EnrollmentModalProps {
  skillClass: SkillClass;
  onClose: () => void;
  onConfirm: (classId: number) => void;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ skillClass, onClose, onConfirm }) => {
  const pricingTiers = [
    { duration: 1, price: 599, label: 'Monthly Sync' },
    { duration: 12, price: 3999, label: 'Academic Year' },
    { duration: 0, price: 9999, label: 'Sovereign Lifetime' }
  ];

  const [selectedTier, setSelectedTier] = useState<any>(pricingTiers[0]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleProceedToPayment = () => {
    if (selectedTier) {
      if (selectedTier.price > 0) {
        setIsPaymentModalOpen(true);
      } else {
        handlePaymentSuccess();
      }
    }
  };

  const handlePaymentSuccess = () => {
    onConfirm(skillClass.id);
    setIsPaymentModalOpen(false);
    onClose();
  };
  
  const itemName = `${skillClass.title} (${selectedTier?.duration === 0 ? 'Lifetime' : `${selectedTier?.duration} Month`} Access)`;

  return (
    <>
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden relative">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Academic Uplink</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Syllabus Authorization</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><X size={20} /></button>
        </header>

        <div className="p-8 space-y-6">
            <div className="flex items-center gap-5">
                <img src={skillClass.imageUrl} className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/10" />
                <div>
                   <h4 className="font-bold text-white text-sm leading-tight">{skillClass.title}</h4>
                   <div className="flex items-center gap-2 mt-1">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{skillClass.rating} Expert Rating</span>
                   </div>
                </div>
            </div>

            <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subscription Matrix</p>
                {pricingTiers.map((tier) => (
                    <button 
                        key={tier.duration} 
                        onClick={() => setSelectedTier(tier)} 
                        className={`w-full text-left p-5 border-2 rounded-2xl transition-all flex items-center justify-between group ${selectedTier?.duration === tier.duration ? 'border-violet-500 bg-violet-600/10' : 'border-white/5 bg-slate-800/20 hover:border-white/10'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedTier?.duration === tier.duration ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                               <Clock size={18} />
                            </div>
                            <div>
                                <span className="block font-black text-white text-[10px] uppercase tracking-widest leading-none mb-1">{tier.label}</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{tier.duration === 0 ? 'Unlimited Access' : `${tier.duration} Month Duration`}</span>
                            </div>
                        </div>
                        <span className={`font-black ${selectedTier?.duration === tier.duration ? 'text-violet-400' : 'text-slate-400'}`}>₹{tier.price}</span>
                    </button>
                ))}
            </div>
        </div>

        <footer className="p-8 bg-slate-900 border-t border-white/5 flex flex-col gap-4">
            <button
              onClick={handleProceedToPayment}
              disabled={!selectedTier}
              className="w-full py-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-2xl active:scale-95 transition-all shadow-xl shadow-violet-900/30 uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
            >
              <CreditCard size={18} />
              <span>Enroll & Pay (₹{selectedTier ? selectedTier.price : 599})</span>
            </button>
        </footer>
      </div>
    </div>
    {isPaymentModalOpen && selectedTier && (
        <PaymentModal 
            itemName={itemName}
            amount={selectedTier.price}
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={handlePaymentSuccess}
        />
    )}
    </>
  );
};

export default EnrollmentModal;