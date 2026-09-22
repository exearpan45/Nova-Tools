import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, Download, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'copied' | 'downloaded' | 'success' | 'info' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showCopied: () => void;
  showDownloaded: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]); // Keep at most 3

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1800);
  }, []);

  const showCopied = useCallback(() => {
    showToast('Copied', 'copied');
  }, [showToast]);

  const showDownloaded = useCallback(() => {
    showToast('Downloaded', 'downloaded');
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showCopied, showDownloaded }}>
      {children}
      {/* Toast Container */}
      <div
        id="toast-container"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none transition-all duration-200"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-lg border border-neutral-700/50 dark:border-neutral-200 animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            {toast.type === 'copied' || toast.type === 'success' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
            ) : toast.type === 'downloaded' ? (
              <Download className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600 flex-shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 dark:text-rose-600 flex-shrink-0" />
            ) : (
              <Info className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
