import React, { useState } from 'react';
import type { Page, User, AgroClass, AgroProfessional } from '../types.ts';
import { Logo } from './Logo.tsx';
import { 
  Sprout, CloudRain, Sun, Wind, Droplets, Thermometer, AlertTriangle, 
  Phone, Search, Calculator, ShieldCheck, CheckCircle2, ArrowRight, 
  Zap, RefreshCw, ChevronRight, FileText, Sparkles, Bot, Award, 
  TrendingUp, TrendingDown, HelpCircle, Layers, Check, Compass, Users
} from 'lucide-react';

interface FarmerDashboardProps {
  currentUser?: User;
  onNavigate: (page: Page) => void;
  onSwitchRole?: (role: any) => void;
  agroClasses?: AgroClass[];
  agroProfessionals?: AgroProfessional[];
}

interface MandiCrop {
  id: string;
  nameHi: string;
  nameEn: string;
  variety: string;
  mandi: string;
  price: number;
  change: number;
  isUp: boolean;
  arrivalBags: number;
  trend: string;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentUser,
  onNavigate,
  onSwitchRole,
  agroClasses = [],
  agroProfessionals = [],
}) => {
  // Mandi Filter & Search State
  const [mandiSearch, setMandiSearch] = useState('');
  const [selectedCropCategory, setSelectedCropCategory] = useState<'all' | 'grain' | 'oilseed' | 'cash' | 'vegetable'>('all');

  // Fertilizer Calculator State
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [acreCount, setAcreCount] = useState<number>(2);

  // Weather active tab
  const [selectedWeatherDay, setSelectedWeatherDay] = useState(0);

  const mandiCrops: MandiCrop[] = [
    { id: '1', nameHi: 'गेहूं (Wheat)', nameEn: 'Wheat', variety: 'लोकवन / शरबती', mandi: 'इंदौर मंडी (MP)', price: 2460, change: 45, isUp: true, arrivalBags: 8400, trend: 'मजबूत मांग' },
    { id: '2', nameHi: 'सोयाबीन (Soybean)', nameEn: 'Soybean', variety: 'पीला सोना (JS-9560)', mandi: 'उज्जैन मंडी (MP)', price: 4890, change: 70, isUp: true, arrivalBags: 12500, trend: 'तेजी जारी' },
    { id: '3', nameHi: 'सरसों (Mustard)', nameEn: 'Mustard', variety: 'काली देशी 42% तेल', mandi: 'भरतपुर मंडी (RJ)', price: 5740, change: 50, isUp: true, arrivalBags: 4200, trend: 'स्थिर भाव' },
    { id: '4', nameHi: 'कपास (Cotton)', nameEn: 'Cotton', variety: 'मध्यम रेशा (BT)', mandi: 'राजकोट मंडी (GJ)', price: 7420, change: 120, isUp: true, arrivalBags: 3100, trend: 'निर्यात मांग' },
    { id: '5', nameHi: 'चना (Gram/Chana)', nameEn: 'Gram', variety: 'कांटा / विशाल', mandi: 'विदिशा मंडी (MP)', price: 6120, change: 40, isUp: true, arrivalBags: 5200, trend: 'अच्छी मांग' },
    { id: '6', nameHi: 'मक्का (Maize)', nameEn: 'Maize', variety: 'पीली संकर', mandi: 'छिंदवाड़ा मंडी (MP)', price: 2180, change: -15, isUp: false, arrivalBags: 6400, trend: 'सामान्य' },
    { id: '7', nameHi: 'लहसुन (Garlic)', nameEn: 'Garlic', variety: 'ऊटी / रियावन', mandi: 'मंदसौर मंडी (MP)', price: 11600, change: 350, isUp: true, arrivalBags: 2800, trend: 'भारी तेजी' },
    { id: '8', nameHi: 'प्याज (Onion)', nameEn: 'Onion', variety: 'नासिक / लाल', mandi: 'लासलगांव (MH)', price: 2150, change: 30, isUp: true, arrivalBags: 16000, trend: 'स्थिर' },
    { id: '9', nameHi: 'धान / चावल (Paddy)', nameEn: 'Paddy', variety: '1121 बासमती', mandi: 'करनाल मंडी (HR)', price: 3880, change: 85, isUp: true, arrivalBags: 9200, trend: 'तेजी' },
  ];

  const filteredMandi = mandiCrops.filter(crop => {
    const matchesSearch = crop.nameHi.toLowerCase().includes(mandiSearch.toLowerCase()) || 
                          crop.nameEn.toLowerCase().includes(mandiSearch.toLowerCase()) ||
                          crop.mandi.toLowerCase().includes(mandiSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCropCategory === 'grain') return ['1', '5', '6', '9'].includes(crop.id);
    if (selectedCropCategory === 'oilseed') return ['2', '3'].includes(crop.id);
    if (selectedCropCategory === 'cash') return ['4'].includes(crop.id);
    if (selectedCropCategory === 'vegetable') return ['7', '8'].includes(crop.id);
    return true;
  });

  // Fertilizer recommendations per acre
  const cropFertilizerData: Record<string, { urea: number; dap: number; mop: number; zinc: number; advice: string }> = {
    wheat: { urea: 1.5, dap: 1.0, mop: 0.5, zinc: 5, advice: 'बुवाई के समय पूरा डीएपी व पोटाश दें। यूरिया की पहली खुराक पहले पानी (21 दिन) पर दें।' },
    soybean: { urea: 0.5, dap: 1.25, mop: 0.5, zinc: 8, advice: 'सोयाबीन दलहनी फसल है, नाइट्रोजन की कम आवश्यकता होती है। सल्फर का प्रयोग अवश्य करें।' },
    cotton: { urea: 2.0, dap: 1.5, mop: 1.0, zinc: 10, advice: 'फूल और गूलर बनते समय पोटाश और मैग्नीशियम सल्फेट का छिड़काव अत्यधिक लाभकारी है।' },
    mustard: { urea: 1.25, dap: 1.0, mop: 0.5, zinc: 5, advice: 'सरसों में तेल की मात्रा बढ़ाने के लिए 10-15 किग्रा बेंटोनाइट सल्फर का प्रयोग जरूर करें।' },
    gram: { urea: 0.25, dap: 1.0, mop: 0.5, zinc: 5, advice: 'राइजोबियम कल्चर से बीज उपचार करें। फूल आते समय सिंचाई न करें।' },
  };

  const currentFertilizer = cropFertilizerData[selectedCrop] || cropFertilizerData.wheat;

  const weatherForecast = [
    { day: 'आज (Today)', temp: '29°C', condition: 'धूप / आंशिक बादल', rainChance: '15%', humidity: '58%', wind: '12 km/h', sprayStatus: '✅ अनुकूल (Safe to Spray)' },
    { day: 'कल (Tomorrow)', temp: '31°C', condition: 'साफ मौसम', rainChance: '10%', humidity: '52%', wind: '10 km/h', sprayStatus: '✅ सर्वोत्तम (Ideal)' },
    { day: 'गुरुवार (Thu)', temp: '28°C', condition: 'हल्के बादल', rainChance: '25%', humidity: '65%', wind: '14 km/h', sprayStatus: '⚠️ सुबह करें (Morning only)' },
    { day: 'शुक्रवार (Fri)', temp: '26°C', condition: 'हल्की वर्षा की संभावना', rainChance: '60%', humidity: '78%', wind: '18 km/h', sprayStatus: '❌ छिड़काव न करें (Do not spray)' },
    { day: 'शनिवार (Sat)', temp: '27°C', condition: 'बूंदाबांदी', rainChance: '45%', humidity: '72%', wind: '15 km/h', sprayStatus: '⚠️ मौसम देखकर करें' },
  ];

  return (
    <div className="space-y-8 md:space-y-10 pb-20 font-sans text-slate-100">
      
      {/* 1. KISAN IDENTITY & AGRO STATUS BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#061e14] via-[#092318] to-[#04100b] border border-emerald-500/35 p-6 md:p-8 shadow-[0_15px_40px_rgba(6,30,20,0.8)] backdrop-blur-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-600/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/15 blur-3xl rounded-full pointer-events-none"></div>

        {/* 🌟 APP LOGO, FUTURE LEGACY & BUILD YOUR LEGACY DISPLAY */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center pb-6 mb-6 border-b border-white/10">
          <div className="relative mb-3 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-3.5 bg-slate-950/90 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl flex items-center justify-center">
              <Logo size="lg" isAnimated={true} />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 drop-shadow-[0_4px_25px_rgba(16,185,129,0.6)]">
            Future Legacy
          </h2>

          <div className="mt-2.5 flex items-center justify-center gap-3">
            <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-emerald-400/60"></span>
            <p className="text-xs sm:text-sm md:text-base font-black uppercase tracking-[0.35em] sm:tracking-[0.45em] text-emerald-300 drop-shadow-[0_2px_10px_rgba(16,185,129,0.5)] font-mono flex items-center gap-2">
              <span>✨</span>
              <span>Build Your Legacy</span>
              <span>✨</span>
            </p>
            <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-emerald-400/60"></span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl p-[2px] shadow-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400">
                <img 
                  src={currentUser?.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=KisanMitra&backgroundColor=059669,10b981`} 
                  alt="Kisan Mitra"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse shadow-sm" title="Online Active"></span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight font-montserrat">
                  राम-राम, {currentUser?.name || 'किसान मित्र (Kisan Mitr)'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  🌾 अन्नदाता / Kisan Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <CheckCircle2 size={11} /> KVK Verified
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-emerald-200">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 font-bold flex items-center gap-1">
                  📍 इंदौर परिक्षेत्र (मध्य प्रदेश)
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-teal-950/80 border border-teal-500/30 text-teal-200 font-bold">
                  🌱 फसल चक्र: खरीफ / रबी
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-950/80 border border-amber-500/30 text-amber-200 font-bold flex items-center gap-1">
                  ☀️ तापमान: 29°C (अनुकूल)
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                अखिल भारतीय स्मार्ट कृषि एवं किसान कल्याण केंद्र • एआई फसल डॉक्टर, दैनिक मंडी भाव, मौसम व उर्वरक सलाहकार
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => onNavigate('Agro Future')}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <Bot size={16} />
              <span>AgriBot AI Doctor</span>
            </button>
            {onSwitchRole && (
              <button
                onClick={() => onSwitchRole('role-selection')}
                className="px-3 py-2 bg-slate-900/90 hover:bg-slate-800 border border-white/10 rounded-xl text-slate-300 hover:text-white text-[10px] font-bold uppercase transition-all"
                title="Switch User Role"
              >
                ⇄ Switch Role
              </button>
            )}
          </div>
        </div>

        {/* KISAN FAST METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5 pt-5 border-t border-white/10">
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">मृदा नमी (Soil Moisture)</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">68% <span className="text-xs text-emerald-400 font-normal">उत्तम</span></span>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">कीटनाशक छिड़काव</span>
            <span className="text-xl sm:text-2xl font-black text-teal-300 font-mono">अनुकूल <span className="text-xs font-normal">आज 10 AM तक</span></span>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">सोयाबीन मंडी भाव</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">₹4,890 <span className="text-xs text-emerald-400 font-normal">▲ +₹70</span></span>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">किसान हेल्पलाइन</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">1800-180-1551</span>
          </div>
        </div>
      </section>

      {/* 2. FOUR KISAN CORE ENGINES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <Sparkles size={16} />
              <span>Krishi Innovation Engines</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-montserrat">
              किसान मुख्य सुविधाएं एवं एआई टूल्स
            </h3>
            <p className="text-xs text-slate-400">फसल रोग निदान, सटीक मौसम पूर्वानुमान, खाद गणना और मंडी भाव विश्लेषण</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: AgriBot AI Crop Doctor */}
          <div 
            onClick={() => onNavigate('Agro Future')}
            className="p-5 rounded-3xl bg-gradient-to-b from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 cursor-pointer group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Bot size={26} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AI Leaf Scanner
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-base text-white font-montserrat flex items-center gap-1.5">
                <span>AgriBot AI Crop Doctor</span>
              </h4>
              <p className="text-xs font-semibold text-emerald-300">फसल रोग व कीट पहचान</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                पत्ती या तने की फोटो खींचें। एआई तुरंत रोग की पहचान कर जैविक व रासायनिक कीटनाशक दवा बताएगा।
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300 border-t border-white/5">
              <span>फोटो स्कैन करें</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: 7-Day Weather Forecast */}
          <div 
            onClick={() => {
              const el = document.getElementById('weather-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-5 rounded-3xl bg-gradient-to-b from-blue-950/60 via-slate-900 to-slate-950 border border-blue-500/40 hover:border-blue-400 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 cursor-pointer group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <CloudRain size={26} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                7 Days Live
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-base text-white font-montserrat flex items-center gap-1.5">
                <span>सटीक मौसम व छिड़काव</span>
              </h4>
              <p className="text-xs font-semibold text-blue-300">वर्षा, हवा की दिशा व आर्द्रता</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                बारिश से पहले अलर्ट पाएं। कीटनाशक व खाद छिड़काव के लिए अनुकूल समय की पूर्व सूचना।
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300 border-t border-white/5">
              <span>मौसम पूर्वानुमान देखें</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Fertilizer Calculator */}
          <div 
            onClick={() => {
              const el = document.getElementById('fertilizer-calc-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-5 rounded-3xl bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/40 hover:border-amber-400 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 cursor-pointer group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Calculator size={26} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                NPK Ratio
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-base text-white font-montserrat flex items-center gap-1.5">
                <span>खाद व पोषण कैलकुलेटर</span>
              </h4>
              <p className="text-xs font-semibold text-amber-300">यूरिया, डीएपी, पोटाश मात्रा</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                एकड़ के अनुसार सही रासायनिक व जैविक खाद की गणना करें, जिससे लागत घटे और पैदावार बढ़े।
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300 border-t border-white/5">
              <span>खाद गणना करें</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Precision Agriculture & Schemes */}
          <div 
            onClick={() => onNavigate('Agro Future')}
            className="p-5 rounded-3xl bg-gradient-to-b from-teal-950/60 via-slate-900 to-slate-950 border border-teal-500/40 hover:border-teal-400 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 cursor-pointer group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <Sprout size={26} />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Agro Future
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-base text-white font-montserrat flex items-center gap-1.5">
                <span>आधुनिक खेती व मास्टरक्लास</span>
              </h4>
              <p className="text-xs font-semibold text-teal-300">ड्रिप सिंचाई, हाइड्रोपोनिक्स</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                कृषि वैज्ञानिक मार्गदर्शन, जैविक प्रमाणन, कम पानी में अधिक उत्पादन और विशेषज्ञ सलाह।
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300 border-t border-white/5">
              <span>Agro Hub खोलें</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE MANDI RATES (आज के प्रमुख कृषि उपज मंडी भाव) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <TrendingUp size={16} />
              <span>Real-Time APMC Mandi Bhav</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-montserrat">
              आज के प्रमुख कृषि मंडी भाव (Live Rates)
            </h3>
            <p className="text-xs text-slate-400">मध्य प्रदेश, राजस्थान, गुजरात और हरियाणा की प्रमुख मंडियों के ताज़ा भाव</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={mandiSearch}
                onChange={(e) => setMandiSearch(e.target.value)}
                placeholder="फसल या मंडी खोजें..."
                className="bg-slate-900 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'सभी फसलें (All)' },
            { id: 'grain', label: 'अनाज (Grains)' },
            { id: 'oilseed', label: 'तिलहन (Oilseeds)' },
            { id: 'cash', label: 'नकदी फसल (Cash Crops)' },
            { id: 'vegetable', label: 'सब्जियां (Lahsun / Pyaz)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCropCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCropCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mandi Rates Grid / Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredMandi.map((crop) => (
            <div 
              key={crop.id}
              className="bg-slate-900/80 border border-white/10 hover:border-amber-500/40 rounded-2xl p-4 transition-all shadow-md flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors font-montserrat">
                    {crop.nameHi}
                  </h4>
                  <p className="text-[11px] text-slate-400">{crop.variety}</p>
                  <p className="text-[10px] text-emerald-400 font-medium mt-0.5">📍 {crop.mandi}</p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-white font-mono">
                    ₹{crop.price.toLocaleString('en-IN')}
                    <span className="text-[10px] text-slate-400 font-normal"> /क्विंटल</span>
                  </div>
                  <div className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                    crop.isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {crop.isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    <span>{crop.isUp ? `+₹${crop.change}` : `-₹${Math.abs(crop.change)}`}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>दैनिक आवक: <strong className="text-slate-200">{crop.arrivalBags.toLocaleString()} बोरी</strong></span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                  {crop.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 7-DAY WEATHER & SPRAY ADVISORY */}
      <section id="weather-section" className="bg-gradient-to-br from-slate-900/90 via-slate-950 to-black border border-blue-500/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-wider">
              <CloudRain size={16} />
              <span>Mausam & Krishi Advisory</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-montserrat">
              7-दिवसीय मौसम एवं छिड़काव परामर्श
            </h3>
            <p className="text-xs text-slate-400">कीटनाशक और खाद छिड़काव के लिए सटीक समय का चयन करें</p>
          </div>

          <div className="px-3.5 py-1.5 bg-blue-500/15 border border-blue-500/30 rounded-xl text-blue-300 text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
            <Thermometer size={16} className="text-blue-400" />
            <span>लाइव मौसम केंद्र: इंदौर</span>
          </div>
        </div>

        {/* Weather Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {weatherForecast.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedWeatherDay(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedWeatherDay === idx
                  ? 'bg-blue-950/80 border-blue-400 shadow-lg scale-105'
                  : 'bg-slate-900/60 hover:bg-slate-850 border-white/10'
              }`}
            >
              <p className="text-xs font-bold text-slate-300">{item.day}</p>
              <p className="text-xl font-black text-white font-mono my-1">{item.temp}</p>
              <p className="text-[10px] text-blue-300 truncate">{item.condition}</p>
              <div className="mt-2 pt-2 border-t border-white/5 space-y-0.5 text-[9px] text-slate-400">
                <p>वर्षा: <strong className="text-slate-200">{item.rainChance}</strong></p>
                <p>हवा: <strong className="text-slate-200">{item.wind}</strong></p>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Day Advisory Box */}
        <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
              चयनित दिवस सलाह ({weatherForecast[selectedWeatherDay].day})
            </span>
            <p className="text-sm font-bold text-white">
              कीटनाशक छिड़काव स्थिति: <span className="text-emerald-400">{weatherForecast[selectedWeatherDay].sprayStatus}</span>
            </p>
            <p className="text-xs text-slate-300">
              हवा की गति 15 किमी/घंटा से कम होने पर ही छिड़काव करें। तेज धूप में दोपहर 12 से 3 बजे के बीच छिड़काव से बचें।
            </p>
          </div>
          <button 
            onClick={() => onNavigate('Agro Future')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl self-start sm:self-auto flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <span>एआई सलाह लें</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>

      {/* 5. FERTILIZER & NPK CALCULATOR */}
      <section id="fertilizer-calc-section" className="bg-gradient-to-br from-slate-900/90 via-slate-950 to-black border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Calculator size={16} />
              <span>Scientific Nutrition Planning</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-montserrat">
              खाद एवं उर्वरक कैलकुलेटर (NPK Dosing)
            </h3>
            <p className="text-xs text-slate-400">अपनी फसल और खेत का रकबा (एकड़) चुनें, संतुलित खाद की मात्रा जानें</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">फसल का चयन करें (Crop):</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: 'wheat', label: 'गेहूं (Wheat)' },
                { id: 'soybean', label: 'सोयाबीन' },
                { id: 'cotton', label: 'कपास' },
                { id: 'mustard', label: 'सरसों' },
                { id: 'gram', label: 'चना' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCrop === c.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">खेत का रकबा (एकड़ / Acres):</label>
            <div className="flex items-center gap-3">
              {[1, 2, 5, 10, 15].map((ac) => (
                <button
                  key={ac}
                  onClick={() => setAcreCount(ac)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    acreCount === ac
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10'
                  }`}
                >
                  {ac} एकड़
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Result Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">यूरिया (Urea 46% N)</span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
              {(currentFertilizer.urea * acreCount).toFixed(1)} <span className="text-xs font-normal text-slate-300">बोरी (45kg)</span>
            </span>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">डीएपी (DAP 18-46-0)</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              {(currentFertilizer.dap * acreCount).toFixed(1)} <span className="text-xs font-normal text-slate-300">बोरी (50kg)</span>
            </span>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">पोटाश (MOP 60% K)</span>
            <span className="text-2xl font-black text-blue-400 font-mono mt-1 block">
              {(currentFertilizer.mop * acreCount).toFixed(1)} <span className="text-xs font-normal text-slate-300">बोरी (50kg)</span>
            </span>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">जिंक सल्फेट (Zinc 33%)</span>
            <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">
              {currentFertilizer.zinc * acreCount} <span className="text-xs font-normal text-slate-300">किलोग्राम</span>
            </span>
          </div>
        </div>

        {/* Expert Advice Note */}
        <div className="p-3.5 bg-amber-950/30 border border-amber-500/25 rounded-2xl text-xs text-amber-200">
          <strong>विशेषज्ञ कृषि सलाह:</strong> {currentFertilizer.advice} रासायनिक खादों के साथ 2 ट्रॉली प्रति एकड़ सड़ी हुई गोबर की खाद या केंचुआ खाद जरूर मिलाएं।
        </div>
      </section>

      {/* 6. GOVERNMENT SCHEMES & SUBSIDIES (सरकारी योजनाएं) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>Government Welfare Portal</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-montserrat">
              किसान कल्याणकारी सरकारी योजनाएं
            </h3>
            <p className="text-xs text-slate-400">केंद्र व राज्य सरकार की प्रत्यक्ष लाभ अंतरण (DBT) एवं सब्सिडी योजनाएं</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'PM किसान सम्मान निधि',
              desc: '₹6,000 प्रति वर्ष 3 किस्तों में सीधे बैंक खाते में। 17वीं किस्त जारी, eKYC अनिवार्य।',
              badge: '₹6,000/Yr DBT',
              border: 'border-emerald-500/40',
              gradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
              btn: 'लाभार्थी स्थिति देखें'
            },
            {
              title: 'प्रधानमंत्री फसल बीमा योजना',
              desc: 'बेमौसम बारिश, ओला, बाढ़ व कीट प्रकोप से फसल क्षति पर 100% तक बीमा दावा।',
              badge: '2% खरीफ / 1.5% रबी',
              border: 'border-blue-500/40',
              gradient: 'from-blue-950/40 via-slate-900 to-slate-950',
              btn: 'क्लेम व पॉलिसी जांचें'
            },
            {
              title: 'किसान क्रेडिट कार्ड (KCC)',
              desc: 'समय पर भुगतान पर मात्र 4% रियायती ब्याज दर पर ₹3 लाख तक का कृषि ऋण।',
              badge: '4% ब्याज दर',
              border: 'border-amber-500/40',
              gradient: 'from-amber-950/40 via-slate-900 to-slate-950',
              btn: 'KCC विवरण देखें'
            },
            {
              title: 'PM कुसुम सोलर पंप योजना',
              desc: 'खेतों में सोलर सिंचाई पंप लगाने पर 60% सरकारी अनुदान व 30% बैंक लोन सहायता।',
              badge: '90% तक सब्सिडी',
              border: 'border-teal-500/40',
              gradient: 'from-teal-950/40 via-slate-900 to-slate-950',
              btn: 'सोलर पंप आवेदन'
            },
          ].map((sch, i) => (
            <div 
              key={i}
              className={`p-5 rounded-3xl bg-gradient-to-b ${sch.gradient} border ${sch.border} shadow-xl flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/10 text-white border border-white/10">
                  {sch.badge}
                </span>
                <h4 className="font-bold text-base text-white font-montserrat">{sch.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{sch.desc}</p>
              </div>

              <button 
                onClick={() => onNavigate('Agro Future')}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{sch.btn}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. KISAN 24x7 TOLL-FREE HELPLINE BAR */}
      <section className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg animate-pulse">
            <Phone size={28} />
          </div>
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-black text-white uppercase font-montserrat flex items-center gap-2 justify-center sm:justify-start">
              <span>राष्ट्रीय किसान कॉल सेंटर (Kisan Call Center 24x7)</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">निःशुल्क / Toll Free</span>
            </h4>
            <p className="text-xs text-slate-300">
              टोल-फ्री नंबर <strong>1800-180-1551</strong> • सुबह 6:00 बजे से रात 10:00 बजे तक सभी भारतीय भाषाओं में कृषि वैज्ञानिकों से सीधी बात
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="tel:18001801551"
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer active:scale-95 flex items-center gap-2 border border-white/20"
          >
            <Phone size={16} />
            <span>1800-180-1551 डायल करें</span>
          </a>
          <button
            onClick={() => onNavigate('Chat')}
            className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            <span>विशेषज्ञ चैट</span>
          </button>
        </div>
      </section>

    </div>
  );
};

export default FarmerDashboard;
