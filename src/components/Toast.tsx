import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      id="toast-notification"
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 px-4 py-2.5 rounded-lg shadow-sm text-sm font-medium transition-all"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};
