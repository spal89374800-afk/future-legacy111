import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const successClasses = 'bg-gradient-to-r from-teal-500 to-emerald-500';
  const errorClasses = 'bg-gradient-to-r from-rose-500 to-red-500';
  const bgColor = type === 'success' ? successClasses : errorClasses;
  
  const icon = type === 'success' ? (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="fixed top-0 left-1/2 z-[100] -translate-x-1/2 mt-6 animate-toast-in-out">
      <div className={`${bgColor} text-white font-bold py-3.5 px-8 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-white/20 backdrop-blur-sm`}>
        <div className="bg-white/20 p-1.5 rounded-full shadow-inner">
          {icon}
        </div>
        <span className="text-sm tracking-tight">{message}</span>
      </div>
    </div>
  );
};

export default Toast;