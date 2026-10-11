
import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, ShieldAlert, Loader2, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    // renderMathInElement and katex are no longer used
  }
}

interface CameraModalProps {
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1080 } }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (err) {
        setError('Camera access denied. Please verify hardware permissions.');
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;
        
        context.drawImage(video, startX, startY, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-10 space-y-8 text-center">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight uppercase font-montserrat">Identity Capture</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Protocol V4 - Biometric Verification</p>
          </div>

          <div className="relative aspect-square bg-slate-800 rounded-[2rem] overflow-hidden border border-white/5 ring-1 ring-white/10 shadow-inner">
            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-rose-500 gap-4">
                <ShieldAlert size={48} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-700 ${isStreaming ? 'opacity-100' : 'opacity-0'}`}
                />
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                  </div>
                )}
                <div className="absolute inset-0 border-[20px] border-slate-900 pointer-events-none opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full pointer-events-none border-dashed animate-[spin_15s_linear_infinite]"></div>
              </>
            )}
          </div>

          <div className="flex items-center justify-center">
            <button 
              onClick={handleCapture}
              disabled={!isStreaming}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all group disabled:opacity-50"
            >
              <div className="w-16 h-16 border-2 border-slate-900 rounded-full flex items-center justify-center group-hover:bg-slate-100 transition-all">
                <Camera size={32} className="text-slate-900" />
              </div>
            </button>
          </div>
          
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Neural Scanning Active</p>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraModal;