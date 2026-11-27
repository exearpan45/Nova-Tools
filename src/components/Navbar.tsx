import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Sun, Moon, Monitor, Download, Menu, AppWindow, Bell, Keyboard,
  Calculator, StickyNote, Clock, Palette, ArrowLeftRight
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { NovaLogo } from './NovaLogo';
import { ScrollProgressBar } from './ScrollProgressBar';
import { MiniAppId } from '../types';

export const Navbar: React.FC = () => {
  const {
    settings,
    updateSettings,
    setSearchOpen,
    pwaInstallPrompt,
    installPwa,
    navigate,
    notifications,
    setNotificationsOpen,
    setShortcutsOpen,
    openMiniApp,
    openMiniApps,
  } = useNova();

  const [miniMenuOpen, setMiniMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMiniMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const miniAppOptions: { id: MiniAppId; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'calculator', label: 'Calculator', icon: Calculator, color: 'text-cyan-500' },
    { id: 'notes', label: 'Quick Notes', icon: StickyNote, color: 'text-violet-500' },
    { id: 'timer', label: 'Mini Timer', icon: Clock, color: 'text-pink-500' },
    { id: 'color', label: 'Color Inspector', icon: Palette, color: 'text-emerald-500' },
    { id: 'converter', label: 'Unit Converter', icon: ArrowLeftRight, color: 'text-amber-500' },
  ];

  return (
    <header
      className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors relative"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="h-14 sm:h-16 px-3 sm:px-6 md:px-8 flex items-center justify-between gap-2 sm:gap-3 max-w-7xl mx-auto w-full">
        {/* Left: Compact Mobile Logo (< md screens) */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="focus:outline-none flex items-center text-left"
            aria-label="NOVA Tools Home"
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
              <span className="truncate text-slate-500 dark:text-slate-400">
                Search tools, studios, workflows...
              </span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 shrink-0 ml-2">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PWA Install Button (desktop/tablet) */}
          {pwaInstallPrompt && (
            <button
              type="button"
              onClick={installPwa}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-xs transition-all"
              aria-label="Install App"
              title="Install NOVA Tools"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Install</span>
            </button>
          )}

          {/* Floating Mini Apps Launcher */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMiniMenuOpen((o) => !o)}
              className={`h-9 px-2.5 flex items-center gap-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer shadow-xs ${
                openMiniApps.length > 0
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-cyan-500/50'
              }`}
              aria-label="Open Mini Apps launcher"
              title="Floating Mini Apps"
            >
              <AppWindow className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">Mini Apps</span>
            </button>

            {miniMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-1.5 z-50 animate-page-enter">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Floating Utilities
                </div>
                {miniAppOptions.map((opt) => {
                  const Icon = opt.icon;
                  const active = openMiniApps.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        openMiniApp(opt.id);
                        setMiniMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                        <span>{opt.label}</span>
                      </span>
                      {active && (
                        <span className="text-[10px] font-bold text-cyan-500">Open</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notification Center */}
          <button
            type="button"
            onClick={() => setNotificationsOpen(true)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-cyan-500/50 active:scale-95 transition-all shrink-0 cursor-pointer shadow-xs"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Keyboard Shortcuts (Desktop) */}
          <button
            type="button"
            onClick={() => setShortcutsOpen(true)}
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-cyan-500/50 active:scale-95 transition-all shrink-0 cursor-pointer shadow-xs"
            aria-label="Keyboard Shortcuts"
            title="Keyboard Shortcuts (⌘/)"
          >
            <Keyboard className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Theme Mode Button (Dark / Light toggle) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800/80 hover:border-cyan-500/50 active:scale-95 transition-all shrink-0 cursor-pointer shadow-xs"
            aria-label={settings.theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
            title={settings.theme === 'dark' ? 'Use light mode' : settings.theme === 'system' ? 'System theme active · choose dark mode' : 'Use dark mode'}
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

      {/* Scroll-linked progress bar */}
      <ScrollProgressBar />
    </header>
  );
};
