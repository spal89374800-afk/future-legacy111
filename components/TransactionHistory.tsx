import React, { useState, useEffect } from 'react';
import { History, CheckCircle2, Clock, ShieldCheck, ArrowUpRight, Receipt, Download, RefreshCw } from 'lucide-react';

export interface TransactionRecord {
  id: string;
  userId: string;
  itemName: string;
  amount: number;
  currency: string;
  gateway: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  timestamp: string;
  transactionRef: string;
}

interface TransactionHistoryProps {
  userId: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userId }) => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTransactions = () => {
    setIsLoading(true);
    try {
      const storageKey = `future_legacy_transactions_${userId || 'default'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setTransactions(JSON.parse(saved));
      } else {
        // Sample initial transaction if none exist
        const initialSample: TransactionRecord[] = [
          {
            id: 'txn_' + Date.now(),
            userId: userId || 'u_student_1',
            itemName: 'NEET/JEE Advance Masterclass & PYQ Access',
            amount: 1499,
            currency: 'INR',
            gateway: 'Razorpay / UPI QR',
            status: 'SUCCESS',
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            transactionRef: 'pay_ref_' + Math.random().toString(36).substring(7).toUpperCase()
          }
        ];
        localStorage.setItem(storageKey, JSON.stringify(initialSample));
        setTransactions(initialSample);
      }
    } catch (err) {
      console.error('Failed to load transaction history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [userId]);

  return (
    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <History size={20} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-tight font-montserrat">Transaction & Payment Ledger</h4>
            <p className="text-[10px] text-slate-400">Track status, amount, and secure timestamps of all course purchases</p>
          </div>
        </div>
        <button 
          onClick={loadTransactions}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          title="Refresh Ledger"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500 text-xs">Loading ledger records...</div>
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center bg-slate-950/40 rounded-2xl border border-white/5 space-y-2">
          <Receipt size={32} className="mx-auto text-slate-600" />
          <p className="text-xs font-bold text-slate-400 uppercase">No payment transactions recorded yet</p>
          <p className="text-[10px] text-slate-500">Enroll in any course or live masterclass to generate verified ledger records.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((txn) => (
            <div 
              key={txn.id}
              className="bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${txn.status === 'SUCCESS' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                  {txn.status === 'SUCCESS' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-white text-xs sm:text-sm tracking-tight">{txn.itemName}</h5>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${txn.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                      {txn.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                    <span>Gateway: <strong className="text-slate-300">{txn.gateway}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-[9px] text-slate-500">Ref: {txn.transactionRef}</span>
                    <span>•</span>
                    <span>{new Date(txn.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="text-left sm:text-right">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Paid Amount</span>
                  <p className="text-base font-black text-emerald-400">₹{txn.amount.toLocaleString('en-IN')}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 flex items-center justify-center transition-all text-slate-400">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
