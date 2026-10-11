import React, { useEffect, useRef } from 'react';
import { Logo } from './Logo.tsx';
import { ArrowRight, Zap } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
  onDirectEnter?: (role?: 'student' | 'teacher' | 'farmer') => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted, onDirectEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-advance to login/role selection after 4 seconds if untouched
  useEffect(() => {
    const timer = setTimeout(() => {
      onGetStarted();
    }, 4500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        onGetStarted();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onGetStarted]);

  // Subtle ambient starlight canvas for luxurious depth
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speed: number;
    }

    const stars: Star[] = [];
    const starCount = Math.min(60, Math.floor((width * height) / 18000));
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.015 + 0.005
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += Math.sin(Date.now() * star.speed) * 0.01;
        const boundedAlpha = Math.max(0.15, Math.min(0.85, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 215, 255, ${boundedAlpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      onClick={onGetStarted}
      role="button"
      tabIndex={0}
      aria-label="Enter Future Legacy"
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#03050e] select-none font-sans z-50 flex flex-col items-center justify-center text-white cursor-pointer outline-none"
    >
      {/* Luxurious ambient radial lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[160px] rounded-full"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#03050e_80%)]"></div>
      </div>

      {/* Ambient starlight canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* MINIMALIST CENTERPIECE: LOGO + FUTURE LEGACY + BUILD YOUR FUTURE */}
      <main className="relative z-20 flex flex-col items-center text-center px-6 max-w-xl space-y-6 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Luminous Emblem */}
        <div className="relative group">
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/25 via-indigo-500/20 to-purple-600/25 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-[2.5rem] bg-slate-950/80 backdrop-blur-3xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex items-center justify-center p-5">
            <Logo size="lg" isAnimated />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-3 pt-2">
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight font-montserrat leading-none">
            FUTURE{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400">
              LEGACY
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 font-light tracking-[0.3em] uppercase font-montserrat">
            Build Your Future
          </p>
        </div>

        {/* Action Buttons: Login / Role Selection vs Instant 1-Click Enter */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full max-w-md mx-auto z-30">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onGetStarted();
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-white/20"
          >
            <span>Login & Choose Role →</span>
          </button>

          {onDirectEnter && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDirectEnter('student');
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-2xl border border-amber-500/40 shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap size={14} className="text-amber-400 fill-amber-400" />
              <span>⚡ Instant 1-Click Enter</span>
            </button>
          )}
        </div>

        {/* Touch/click hint */}
        <div className="pt-2 animate-pulse text-[11px] uppercase tracking-[0.25em] text-slate-500 font-medium">
          Click anywhere to continue to Login
        </div>

      </main>

    </div>
  );
};

export default SplashScreen;
