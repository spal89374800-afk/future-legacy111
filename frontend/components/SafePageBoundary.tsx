import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ArrowLeft, RefreshCw, Sparkles, ShieldAlert } from 'lucide-react';

interface SafePageBoundaryProps {
  children: ReactNode;
  pageName?: string;
  onHome?: () => void;
}

interface SafePageBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SafePageBoundary extends Component<SafePageBoundaryProps, SafePageBoundaryState> {
  constructor(props: SafePageBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SafePageBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error caught in page [${this.props.pageName || 'Unknown'}]:`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <ShieldAlert size={28} />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white font-montserrat">
                Smooth Recovery Active (ऑटो रिकवरी मोड)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                इस मॉड्यूल को सुरक्षित रूप से रीसेट कर दिया गया है। आपका डेटा सुरक्षित है।
              </p>
              <p className="text-[11px] font-mono text-slate-500 bg-slate-950 p-2 rounded-xl truncate">
                {this.state.error?.message || "Module auto-protected"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleRetry}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <RefreshCw size={14} /> Re-open Module
              </button>
              {this.props.onHome && (
                <button
                  onClick={this.props.onHome}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  <ArrowLeft size={14} /> Back to Home
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default SafePageBoundary;
