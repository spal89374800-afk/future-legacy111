import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, Star, ShieldCheck, 
  Clock, User, CheckCircle2, MessageSquare, Edit3, X, Award
} from 'lucide-react';
import type { OneToOneDoubtCallBooking } from '../types.ts';

interface OneToOneDoubtCallModalProps {
  booking: OneToOneDoubtCallBooking;
  isTeacher: boolean;
  onClose: () => void;
  onCallCompleted: (bookingId: string, rating?: number, feedback?: string) => void;
}

export const OneToOneDoubtCallModal: React.FC<OneToOneDoubtCallModalProps> = ({
  booking,
  isTeacher,
  onClose,
  onCallCompleted
}) => {
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended' | 'feedback'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(booking.mode === 'audio');
  const [callDuration, setCallDuration] = useState(0);
  const [streamActive, setStreamActive] = useState(false);

  // Feedback state
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera/mic or mock stream
  useEffect(() => {
    let timer: number;
    const connectTimer = window.setTimeout(() => {
      setCallState('connected');
    }, 1500);

    // Attempt real user webcam/mic
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && booking.mode === 'video') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          setStreamActive(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera permission fallback
          setStreamActive(false);
        });
    }

    return () => {
      clearTimeout(connectTimer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [booking.mode]);

  // Duration timer
  useEffect(() => {
    let interval: number;
    if (callState === 'connected') {
      interval = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const toggleMic = () => {
    setIsMuted(prev => !prev);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // toggling
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(prev => !prev);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff; // toggling
      });
    }
  };

  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCallState('feedback');
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    onCallCompleted(booking.id, rating, feedback);
    onClose();
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[250] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4">
      {callState !== 'feedback' ? (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] w-full max-w-4xl p-6 sm:p-8 shadow-2xl flex flex-col space-y-6 max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Top header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Video size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white font-montserrat uppercase tracking-tight">
                    1-to-1 Live Doubt Resolution
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Encrypted Session
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {isTeacher ? `Student: ${booking.studentName}` : `Faculty: ${booking.teacherName}`} • <span className="text-indigo-400 font-semibold">{booking.subject}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-emerald-400">{formatTimer(callDuration)}</span>
                <span className="text-[10px] text-slate-400">/ 15m slot</span>
              </div>
              <button 
                onClick={handleEndCall}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white"
                title="End Call"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Doubt topic bar */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Topic to Resolve:</span>
            <span className="font-bold text-amber-300 truncate max-w-md">{booking.topic}</span>
            <span className="text-[10px] text-slate-500">{booking.timeSlot}</span>
          </div>

          {/* Video Streams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[320px]">
            {/* Teacher Stream */}
            <div className="relative rounded-3xl bg-slate-950 border border-white/10 overflow-hidden shadow-inner flex items-center justify-center group">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" 
                alt="Teacher"
                className="w-full h-full object-cover opacity-60" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Faculty: {booking.teacherName}</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 size={13} /> Active Doubt Explainer
                </span>
                <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded-md">HD 1080p</span>
              </div>
            </div>

            {/* Student Stream */}
            <div className="relative rounded-3xl bg-slate-950 border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
              {streamActive && !isVideoOff ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform -scale-x-100" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 text-slate-500">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <User size={32} />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">{booking.studentName}</p>
                  <p className="text-[10px] text-slate-500">{isVideoOff ? 'Camera Off' : 'Connecting Local Video...'}</p>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Student: {booking.studentName} (You)</span>
              </div>
              {isMuted && (
                <div className="absolute top-4 right-4 bg-rose-600/90 text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                  <MicOff size={12} /> Muted
                </div>
              )}
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={toggleMic}
              className={`p-4 rounded-2xl transition-all cursor-pointer shadow-lg active:scale-95 ${
                isMuted 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-2xl transition-all cursor-pointer shadow-lg active:scale-95 ${
                isVideoOff 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
              }`}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
            </button>

            <button
              onClick={handleEndCall}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-900/50 cursor-pointer transition-all flex items-center gap-2 active:scale-95"
            >
              <PhoneOff size={18} />
              <span>End Call</span>
            </button>
          </div>
        </div>
      ) : (
        /* Post Call Rating & Feedback Form */
        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl space-y-6 animate-scale-up">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-black text-white font-montserrat uppercase tracking-tight">
              1-to-1 Doubt Call Completed!
            </h3>
            <p className="text-xs text-slate-300">
              Call Duration: <strong className="text-emerald-400 font-mono">{formatTimer(callDuration)}</strong> with {booking.teacherName}
            </p>
          </div>

          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2 text-center">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                How well was your doubt cleared?
              </label>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star 
                      size={28} 
                      className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-400 block">
                {rating === 5 ? 'Excellent & Crystal Clear (5/5)' : rating === 4 ? 'Very Helpful (4/5)' : rating === 3 ? 'Satisfactory (3/5)' : 'Needs Improvement'}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                Faculty Feedback & Comments (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Share your experience: did teacher explain step-by-step, formulas, derivations..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Skip
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
              >
                Submit Rating & Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
