import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, DollarSign, CreditCard, ShieldCheck, QrCode, BarChart3, ArrowUpRight, RefreshCw } from 'lucide-react';

interface DailyVolumeData {
  date: string;
  amount: number;
  transactions: number;
}

interface GatewayDistributionData {
  name: string;
  value: number;
  color: string;
}

const sampleDailyVolumes: DailyVolumeData[] = [
  { date: 'Sep 16', amount: 12400, transactions: 8 },
  { date: 'Sep 17', amount: 18900, transactions: 12 },
  { date: 'Sep 18', amount: 24500, transactions: 16 },
  { date: 'Sep 19', amount: 19200, transactions: 11 },
  { date: 'Sep 20', amount: 32000, transactions: 22 },
  { date: 'Sep 21', amount: 41500, transactions: 28 },
  { date: 'Sep 22', amount: 48900, transactions: 34 },
];

const sampleGatewayDistribution: GatewayDistributionData[] = [
  { name: 'Razorpay', value: 58000, color: '#3b82f6' },
  { name: 'Stripe', value: 42000, color: '#6366f1' },
  { name: 'Direct UPI', value: 36400, color: '#10b981' },
];

export const AdminFinancialDashboard: React.FC = () => {
  const [dailyData, setDailyData] = useState<DailyVolumeData[]>(sampleDailyVolumes);
  const [gatewayData, setGatewayData] = useState<GatewayDistributionData[]>(sampleGatewayDistribution);
  const [totalRevenue, setTotalRevenue] = useState<number>(136400);

  useEffect(() => {
    // Check localStorage for any recorded transactions and aggregate
    try {
      let aggregatedAmount = 136400;
      let rzpTotal = 58000;
      let stripeTotal = 42000;
      let upiTotal = 36400;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('future_legacy_transactions_')) {
          const items = JSON.parse(localStorage.getItem(key) || '[]');
          items.forEach((txn: any) => {
            if (txn.status === 'SUCCESS') {
              aggregatedAmount += txn.amount || 0;
              if (txn.gateway?.includes('Stripe')) stripeTotal += txn.amount || 0;
              else if (txn.gateway?.includes('UPI') || txn.gateway?.includes('QR')) upiTotal += txn.amount || 0;
              else rzpTotal += txn.amount || 0;
            }
          });
        }
      }
      setTotalRevenue(aggregatedAmount);
      setGatewayData([
        { name: 'Razorpay', value: rzpTotal, color: '#3b82f6' },
        { name: 'Stripe', value: stripeTotal, color: '#6366f1' },
        { name: 'Direct UPI', value: upiTotal, color: '#10b981' },
      ]);
    } catch (err) {
      console.warn('Failed to aggregate local transaction ledger:', err);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d1527] to-slate-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BarChart3 size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Admin Financial Analytics</h3>
            <p className="text-xs text-indigo-400 font-medium">Real-time payment volumes, gateway distributions & revenue reports</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-bold text-xs uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Gateway Sync</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-widest">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><DollarSign size={18} /></div>
          </div>
          <p className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            <TrendingUp size={12} /><span>+18.4% vs last week</span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-widest">Razorpay Volume</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><CreditCard size={18} /></div>
          </div>
          <p className="text-2xl font-black text-white">₹{gatewayData.find(g => g.name === 'Razorpay')?.value.toLocaleString('en-IN')}</p>
          <div className="text-[10px] font-bold text-blue-400">Active Live API / Sandbox</div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-widest">Stripe International</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><ShieldCheck size={18} /></div>
          </div>
          <p className="text-2xl font-black text-white">₹{gatewayData.find(g => g.name === 'Stripe')?.value.toLocaleString('en-IN')}</p>
          <div className="text-[10px] font-bold text-indigo-400">Global Processing</div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-widest">Direct UPI & QR</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><QrCode size={18} /></div>
          </div>
          <p className="text-2xl font-black text-white">₹{gatewayData.find(g => g.name === 'Direct UPI')?.value.toLocaleString('en-IN')}</p>
          <div className="text-[10px] font-bold text-emerald-400">Zero Gateway Fee</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Volume Line Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-tight font-montserrat">Daily Payment Volumes</h4>
              <p className="text-[10px] text-slate-400">Trend of incoming payments over the last 7 days</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">INR (₹)</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Volume']}
                />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gateway Distribution Pie Chart */}
        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-tight font-montserrat">Gateway Distribution</h4>
            <p className="text-[10px] text-slate-400">Percentage share between Razorpay, Stripe, and UPI</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gatewayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {gatewayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            {gatewayData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300 font-bold">{item.name}</span>
                </div>
                <span className="text-white font-mono font-bold">₹{item.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
