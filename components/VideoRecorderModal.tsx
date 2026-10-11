
import React, { useEffect, useRef } from 'react';
import useMediaRecorder from '../hooks/useMediaRecorder.ts';
import { X, Video, ShieldCheck, Square, Play, Loader2 } from 'lucide-react';

interface VideoRecorderModalProps {
  onClose: () => void;
  onCapture: (blob: Blob) => void;
}

const VideoRecorderModal: React.FC<VideoRecorderModalProps> = ({ onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorder = useMediaRecorder({ audio: true, video: true });

  useEffect(() => {
    if (recorder.previewStream && videoRef.current) {
      videoRef.current.srcObject = recorder.previewStream;
    }
  }, [recorder.previewStream]);

  const handleUseVideo = () => {
    if (recorder.mediaBlob) {
      onCapture(recorder.mediaBlob);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <header className="p-8 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
            <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight font-montserrat">Stream Capture</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Live Asset Ingestion Node</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><X size={20} /></button>
        </header>

        <div className="p-10 space-y-8">
            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-950 border border-white/5 shadow-inner group">
              {recorder.mediaBlobUrl ? (
                  <video src={recorder.mediaBlobUrl} controls autoPlay className="w-full h-full object-cover"></video>
              ) : (
                  <>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100"></video>
                      {recorder.isRecording && (
                          <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-rose-600 rounded-lg text-white font-black text-[9px] uppercase tracking-widest animate-pulse shadow-xl">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              Recording Live Node
                          </div>
                      )}
                      {!recorder.previewStream && !recorder.isRecording && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-20">
                             <Video size={64} className="text-slate-600" />
                             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Uplink</p>
                          </div>
                      )}
                  </>
              )}
            </div>

            <div className="flex gap-4">
                {recorder.mediaBlobUrl ? (
                    <>
                        <button onClick={recorder.clearMedia} className="flex-1 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest">Abort & Retry</button>
                        <button onClick={handleUseVideo} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                           <ShieldCheck size={18} /> Establish Link
                        </button>
                    </>
                ) : (
                    <>
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl hover:text-white transition-all uppercase text-[10px] tracking-widest">Disconnect</button>
                        <button
                            onClick={recorder.isRecording ? recorder.stopRecording : recorder.startRecording}
                            className={`flex-[2] py-4 font-black rounded-2xl text-white transition-all shadow-xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 ${recorder.isRecording ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'}`}
                        >
                            {recorder.isRecording ? (
                                <>
                                    <Square size={18} fill="currentColor" /> Terminate Capture
                                </>
                            ) : (
                                <>
                                    <Play size={18} fill="currentColor" /> Initialize Capture
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecorderModal;
