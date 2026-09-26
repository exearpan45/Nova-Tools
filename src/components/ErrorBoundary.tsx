import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  inline?: boolean;
  toolName?: string;
  onResetTool?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onResetTool) {
      this.props.onResetTool();
    } else {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: undefined });
    const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
    window.location.href = base;
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.inline) {
        return (
          <div className="w-full p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-[#18181b]/50 text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {this.props.toolName ? `${this.props.toolName} encountered an error` : 'This tool encountered an error'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                An unexpected calculation or render state occurred. You can reset this tool to its clean initial state.
              </p>
            </div>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Tool</span>
            </button>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-[#121214] text-neutral-900 dark:text-neutral-100">
          <div className="max-w-md w-full text-center space-y-5 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#18181b]/50 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Something went wrong.
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                An unexpected issue occurred while rendering this view. Your saved preferences remain intact.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try again</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#18181b] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
