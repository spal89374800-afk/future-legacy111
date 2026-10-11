
import React, { useMemo } from 'react';

interface Props { content: string; className?: string; }

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const elements = useMemo(() => {
    if (!content) return null;
    
    // Auto-wrap segments into beautiful premium box wrappers BEFORE general sanitization
    let processedStr = content;
    
    // Map English and fallback markers to high fidelity boxes
    processedStr = processedStr.replace(/### 🚨 (?:Where the Mistake Happened|Where was the mistake|Kaha Galati Hui\?|Kaha Galati Hui)([\s\S]*?)(?=###|$)/gi, (match, inner) => {
      return `\n[TRAP ALERT]\n${inner.trim()}\n[/TRAP ALERT]\n`;
    });
    processedStr = processedStr.replace(/### 🧠 (?:Why the Mistake Was Made|Why was the mistake made|Kyu Galati Hui\?|Kyu Galati Hui)([\s\S]*?)(?=###|$)/gi, (match, inner) => {
      return `\n[MNEMONIC NODE]\n${inner.trim()}\n[/MNEMONIC NODE]\n`;
    });
    processedStr = processedStr.replace(/### 🛠️ (?:How to Correct It|How to correct it|Kaise Sahi Karein\?|Kaise Sahi Karein)([\s\S]*?)(?=###|$)/gi, (match, inner) => {
      return `\n[TOPPER SECRET]\n${inner.trim()}\n[/TOPPER SECRET]\n`;
    });
    processedStr = processedStr.replace(/### 📘 (?:NCERT Reference Highlight|NCERT Reference|NCERT Rule Book)([\s\S]*?)(?=###|$)/gi, (match, inner) => {
      return `\n[SACRED NCERT]\n${inner.trim()}\n[/SACRED NCERT]\n`;
    });

    // 0. Grandmaster Sanitization
    let processed = processedStr
        .replace(/\$/g, '') 
        .replace(/(^|\n)#+\s/g, '$1') 
        .replace(/\*/g, '') 
        .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '$1 / $2'); 

    // 0.1 High-Fidelity Table Engine (V41 Grandmaster)
    processed = processed.replace(/\[TABLE\]([\s\S]*?)\[\/TABLE\]/g, (match, tableContent) => {
        const rows = tableContent.trim().split('\n').filter(r => r.trim() !== '');
        const headerRow = rows[0].split('|').map(h => h.trim());
        const dataRows = rows.slice(1).map(r => r.split('|').map(d => d.trim()));

        return `
            <div class="my-8 overflow-x-auto shadow-2xl rounded-[2rem] border-[2px] border-slate-900 no-scrollbar bg-white ring-4 ring-slate-100/40">
                <table class="w-full border-collapse min-w-[500px]">
                    <thead>
                        <tr class="bg-[#020617] text-white">
                            ${headerRow.map(h => `<th class="p-4 text-left text-[11px] font-black uppercase tracking-[0.2em] border-r border-white/10 last:border-0 font-montserrat">${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${dataRows.map(row => `
                            <tr class="border-b border-slate-100 last:border-0 hover:bg-blue-50/50 transition-all">
                                ${row.map(cell => `<td class="p-4 text-[13px] font-extrabold text-[#020617] border-r border-slate-50 last:border-0 leading-relaxed font-inter">${cell}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });

    // 0.2 SVG Diagram Engine (V41 - STRICT SINGLE-SCREEN)
    processed = processed.replace(/\[SVG_DIAGRAM\]([\s\S]*?)\[\/SVG_DIAGRAM\]/g, (match, svgContent) => `
        <div class="my-6 flex flex-col items-center bg-white border-[3px] border-slate-100 rounded-[2.5rem] shadow-2xl relative group overflow-hidden max-w-full">
            <div class="w-full flex justify-center p-5 filter drop-shadow-3xl overflow-hidden" style="max-height: 350px;">
                <div class="w-full h-full flex items-center justify-center">
                    ${svgContent.replace(/<svg/, '<svg style="width: 100%; height: auto; max-height: 330px;" preserveAspectRatio="xMidYMid meet"')}
                </div>
            </div>
            <div class="w-full bg-[#020617] px-8 py-3 flex items-center justify-between border-t border-white/10">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse"></div>
                    <p class="text-[9px] font-black text-white uppercase tracking-[0.4em] font-montserrat">V41 INFINITE SYNC</p>
                </div>
                <span class="text-[8px] font-black text-blue-400 uppercase tracking-widest px-3 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">SINGLE_FRAME_VIEW</span>
            </div>
        </div>
    `);

    // 0.3 Formula Node (V41 Pro Unicode)
    processed = processed.replace(/\[FORMULA_NODE\]([\s\S]*?)\[\/FORMULA_NODE\]/g, (match, formula) => `
        <div class="my-6 p-6 bg-[#020617] rounded-[2rem] border-l-[8px] border-[#2563eb] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center gap-2">
            <div class="absolute top-0 right-0 p-3 opacity-5 text-white pointer-events-none font-black text-[5rem]">Σ</div>
            <p class="text-[7px] font-black text-blue-400 uppercase tracking-[0.6em] mb-1 opacity-60">MASTER_LEDGER_FORMULA</p>
            <p class="text-xl md:text-2xl font-black text-white font-mono tracking-tighter text-center leading-relaxed px-4 drop-shadow-[0_0_10px_rgba(37,99,235,0.6)]">${formula.trim()}</p>
        </div>
    `);

    // 1. V41 Chromatic Matrix (WhatsApp Ink)
    const colorMap: Record<string, string> = {
        blue: '#2563eb', red: '#e11d48', green: '#059669', purple: '#7c3aed', 
        orange: '#ea580c', gold: '#d97706', teal: '#0d9488', pink: '#db2777'
    };

    Object.entries(colorMap).forEach(([tag, hex]) => {
        const regex = new RegExp(`<${tag}>(.*?)<\\/${tag}>`, 'g');
        processed = processed.replace(regex, `<span style="color: ${hex}; font-weight: 900; background-color: ${hex}10; padding: 1px 4px; border-radius: 4px; border-bottom: 3px solid ${hex}44;">$1</span>`);
    });

    // 2. V41 Master Box Protocol (Zero-Escape Aesthetics)
    const boxThemes = [
      { type: 'KAHANI BOX', bg: '#dcf8c6', border: '#128c7e', icon: '🎭', title: 'SUNO BHAI' },
      { type: 'SACRED NCERT', bg: '#f0f9ff', border: '#0ea5e9', icon: '📖', title: 'SACRED NCERT' },
      { type: 'MNEMONIC NODE', bg: '#fdf2f8', border: '#ec4899', icon: '🧠', title: 'CONCEPT CORE' },
      { type: 'TRAP ALERT', bg: '#fff1f2', border: '#e11d48', icon: '⚠️', title: 'TRAP ALERT' },
      { type: 'PYQ HEATMAP', bg: '#fffbeb', border: '#d97706', icon: '🎯', title: 'PYQ HEATMAP' },
      { type: 'TOPPER SECRET', bg: '#f0fdf4', border: '#22c55e', icon: '⚡', title: 'TOPPER GUIDELINE' },
      { type: 'DESI EXAMPLE', bg: '#fff7ed', border: '#f97316', icon: '💡', title: 'CONCEPT LOGIC' },
      { type: 'RANKER DEEP-DIVE', bg: '#faf5ff', border: '#9333ea', icon: '🔮', title: 'EXTRA-NCERT DEPTH' }
    ];

    boxThemes.forEach(theme => {
        const bracketRegex = new RegExp(`\\[${theme.type}\\]([\\s\\S]*?)\\[\\/${theme.type}\\]`, 'g');
        processed = processed.replace(bracketRegex, (match, inner) => {
            let innerText = inner.trim().replace(/\n/g, '<br/>');
            
            // Sub-highlight inside specific boxes for extra emphasis
            if (theme.type === 'SACRED NCERT') {
                innerText = innerText.replace(/(NCERT Line:|NCERT Reference:)/gi, '<strong style="color: #0369a1; font-weight: 900; border-bottom: 2px dashed #0ea5e9; padding-bottom: 1px;">$1</strong>');
            } else if (theme.type === 'TRAP ALERT') {
                innerText = innerText.replace(/(Trap Alert:|Pitfall:)/gi, '<strong style="color: #be123c; font-weight: 900;">$1</strong>');
            }

            return `
                <div class="sovereign-box w-full relative select-all border" style="background: ${theme.bg}; border-color: ${theme.border}1a; border-left: 10px solid ${theme.border}; border-radius: 1.5rem; margin: 1.75rem 0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
                    <div style="background: ${theme.border}; padding: 6px 14px; display: inline-flex; align-items: center; gap: 8px; position: absolute; top: -14px; left: 20px; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.12); z-index: 10;">
                        <span style="font-size: 1rem; color: #fff;">${theme.icon}</span>
                        <span style="color: #fff; font-weight: 900; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; font-family: 'Montserrat', sans-serif;">${theme.title}</span>
                    </div>
                    <div style="padding: 2.25rem 1.5rem 1.5rem 1.75rem; font-size: 0.85rem; line-height: 1.5rem; color: #1e293b; font-weight: 600;">
                        ${innerText}
                    </div>
                </div>
            `;
        });
    });

    return <div 
        className="prose prose-slate max-w-none w-full"
        style={{ 
            fontSize: '0.85rem', 
            fontFamily: "'Inter', sans-serif",
            lineHeight: '1.45rem',
            color: '#cbd5e1',
            fontWeight: '500',
            letterSpacing: '-0.015em',
            paddingTop: '0.1rem',
        }} 
        dangerouslySetInnerHTML={{ __html: processed }} 
    />;
  }, [content]);

  return <div className="w-full overflow-hidden">{elements}</div>;
};

export default MarkdownRenderer;
