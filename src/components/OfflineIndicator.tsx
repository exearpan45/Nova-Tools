import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 sm:bottom-6 left-4 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-semibold shadow-2xl shadow-amber-950/40 border border-amber-400/30 backdrop-blur-md animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
      <span>Offline Mode — All loaded tools work locally without internet</span>
    </div>
  );
};
