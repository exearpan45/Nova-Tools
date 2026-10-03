import React from 'react';
import {
  Search, Sun, Moon, Download, Menu
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { NovaLogo } from './NovaLogo';

export const Navbar: React.FC = () => {
  const {
    settings,
    updateSettings,
    setSearchOpen,
    pwaInstallPrompt,
    installPwa,
    navigate
  } = useNova();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header
      className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="h-14 sm:h-16 px-3 sm:px-6 md:px-8 flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        {/* Left: Compact Mobile Logo (< md screens) */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <button
            onClick={() => navigate('/')}
            className="focus:outline-none flex items-center text-left"
            aria-label="NOVA TOOLS Home"
          >
            <NovaLogo size="xs" showText={true} />
          </button>
        </div>

        {/* Center: Desktop Search Bar (md+ screens) */}
        <div className="hidden md:flex flex-1 max-w-md">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800/90 bg-slate-100/70 dark:bg-slate-900/70 text-slate-400 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all text-xs shadow-inner group"
            aria-label="Search tools"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors shrink-0" />
              <span className="truncate text-slate-500 dark:text-slate-400">Search 100+ tools or jump to suite...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 shrink-0 ml-2">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls: [Theme] [Menu] (Clean, compact, touch-friendly) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PWA Install Button (desktop/tablet) */}
          {pwaInstallPrompt && (
            <button
              onClick={installPwa}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-xs transition-all"
              aria-label="Install App"
              title="Install NOVA TOOLS"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Install</span>
            </button>
          )}

          {/* Theme Mode Button (Dark / Light toggle) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800/80 hover:border-cyan-500/50 active:scale-95 transition-all shrink-0 cursor-pointer shadow-xs"
            aria-label={settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600 dark:text-cyan-400 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Menu / Settings Button */}
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800/80 hover:border-cyan-500/50 active:scale-95 transition-all shrink-0 cursor-pointer shadow-xs"
            aria-label="Menu & Settings"
            title="Menu & Settings"
          >
            <Menu className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
