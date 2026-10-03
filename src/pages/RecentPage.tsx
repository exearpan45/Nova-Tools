import React from 'react';
import { History, Trash2, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { SUITES_DATA } from '../data/suitesData';

export const RecentPage: React.FC = () => {
  const { recentTools, clearRecent, navigate, settings } = useNova();

  const handleClear = () => {
    if (settings.confirmBeforeClearing) {
      if (!window.confirm('Clear all recently used tools history?')) {
        return;
      }
    }
    clearRecent();
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="space-y-8 animate-page-enter">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Recently Used
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Locally stored session history of your recently opened tools
          </p>
        </div>

        {recentTools.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        )}
      </div>

      {recentTools.length > 0 ? (
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900/50 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          {recentTools.map((item) => {
            const suite = SUITES_DATA[item.suite];

            return (
              <div
                key={item.slug}
                onClick={() => navigate(`/tools/${item.slug}`)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3.5 truncate">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold"
                    style={{ backgroundColor: `${suite.accentColor}18`, color: suite.accentColor }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors block truncate">
                      {item.name}
                    </span>
                    <span
                      className="text-[10px] uppercase font-bold tracking-wider"
                      style={{ color: suite.accentColor }}
                    >
                      {suite.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-slate-400 text-xs">
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimeAgo(item.lastUsed)}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No recently opened tools
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            As you use tools, they will automatically appear here with timestamps for quick return.
          </p>
          <button
            onClick={() => navigate('/tools')}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            Open First Tool
          </button>
        </div>
      )}
    </div>
  );
};
