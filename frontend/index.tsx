import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';

// Safe Polyfill: Prevent DOMException when alert/confirm are called inside sandboxed iframes
if (typeof window !== 'undefined') {
  const originalAlert = window.alert;
  window.alert = (msg?: any) => {
    try {
      console.log('[Future Legacy Alert]:', msg);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: String(msg ?? '') }));
    } catch {
      // Ignore any logging errors
    }
  };

  window.confirm = (msg?: any) => {
    try {
      console.log('[Future Legacy Confirm]:', msg);
    } catch {}
    return true; // Auto-confirm safely without throwing iframe DOMException
  };
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleRecover = () => {
    try {
      sessionStorage.clear();
    } catch {}
    this.setState({ hasError: false, error: null });
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-[#121216] border border-red-500/20 rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-red-500/20">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold">Something went wrong</h2>
            <p className="text-xs text-slate-400">
              {this.state.error?.message || "An unexpected error occurred while loading this view."}
            </p>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={this.handleRecover}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Return to Dashboard (वापस जाएं)
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border border-blue-500/30"
              >
                Reload App
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-medium rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/10"
              >
                Clear Cache & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);