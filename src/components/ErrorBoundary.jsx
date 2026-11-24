import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Robust React Error Boundary to catch render errors gracefully
 * and maintain application resilience under unexpected failures.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      // In development, keep error diagnostic for debugging
      // eslint-disable-next-line no-console
      console.warn('ErrorBoundary captured:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white font-sans"
        >
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-rose-500/30 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              AIRZERO recovered gracefully from an unexpected interface error. Your local environment parameters remain secure.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
