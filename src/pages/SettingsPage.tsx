import React, { useState } from 'react';
import {
  Palette, Sliders, Shield, Eye, Trash2, Heart, Moon, Sun, Smartphone,
  Download, Share, Check, Keyboard, Compass, Database, Cpu
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { useToast } from '../context/ToastContext';
import { ThemeId } from '../types';
import { SUITE_LIST } from '../data/suitesData';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    favorites,
    recentTools,
    collections,
    snippets,
    focusSessions,
    recentSearches,
    clearFavorites,
    clearRecent,
    clearSnippets,
    clearFocusSessions,
    clearRecentSearches,
    exportUserData,
    importUserData,
    pwaInstallPrompt,
    installPwa,
    setTourOpen,
    setShortcutsOpen,
    navigate,
  } = useNova();
  const { showToast } = useToast();

  const [pendingClear, setPendingClear] = useState<string | null>(null);

  const themes: { id: ThemeId; name: string; desc: string; icon: React.ElementType }[] = [
    { id: 'dark', name: 'Dark Mode', desc: 'Midnight deep background, easy on the eyes', icon: Moon },
    { id: 'light', name: 'Light Mode', desc: 'Clean, crisp daylight contrast', icon: Sun },
  ];

  const accentColors = [
    { name: 'Cyan Spark', hex: '#06b6d4' },
    { name: 'Electric Blue', hex: '#3b82f6' },
    { name: 'Cyber Violet', hex: '#8b5cf6' },
    { name: 'Neon Magenta', hex: '#ec4899' },
    { name: 'Obsidian Emerald', hex: '#10b981' },
    { name: 'Sunset Amber', hex: '#f59e0b' },
  ];

  const executeClear = (key: string) => {
    switch (key) {
      case 'recent':
        clearRecent();
        showToast('Cleared recent tool history.', 'success');
        break;
      case 'favorites':
        clearFavorites();
        showToast('Cleared pinned favorites.', 'success');
        break;
      case 'snippets':
        clearSnippets();
        showToast('Cleared Clipboard Vault snippets.', 'success');
        break;
      case 'focus':
        clearFocusSessions();
        showToast('Cleared Focus Studio session history.', 'success');
        break;
      case 'searches':
        clearRecentSearches();
        showToast('Cleared recent search history.', 'success');
        break;
      case 'all':
        clearRecent();
        clearFavorites();
        clearSnippets();
        clearFocusSessions();
        clearRecentSearches();
        localStorage.removeItem('nova_v2_favorites');
        localStorage.removeItem('nova_v2_settings');
        localStorage.removeItem('nova_workspace_note');
        localStorage.removeItem('nova_workspace_tasks');
        window.location.reload();
        break;
    }
    setPendingClear(null);
  };

  const requestClear = (key: string) => {
    if (!settings.confirmBeforeClearing) {
      executeClear(key);
      return;
    }
    setPendingClear(key);
  };

  const dataStores = [
    { key: 'favorites', label: 'Pinned Favorites', count: favorites.length },
    { key: 'recent', label: 'Recent Tools', count: recentTools.length },
    { key: 'snippets', label: 'Clipboard Snippets', count: snippets.length },
    { key: 'focus', label: 'Focus Sessions', count: focusSessions.length },
    { key: 'searches', label: 'Search History', count: recentSearches.length },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-page-enter">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings, Privacy & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize theme, accessibility, portable backups, and inspect 100% browser-local storage
        </p>
      </div>

      {/* Appearance Section */}
      <section className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold shrink-0">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Appearance & Theme</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">Choose between dark and light mode and custom accent styling</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Theme Mode</span>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {themes.map((t) => {
              const isSelected = settings.theme === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateSettings({ theme: t.id })}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left flex items-start justify-between gap-2 sm:gap-4 transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/5 ring-1 sm:ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className={`p-2 rounded-lg sm:rounded-xl shrink-0 ${isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">{t.name}</span>
                      <span className="text-[10px] sm:text-xs text-slate-400 block mt-0.5 line-clamp-1">{t.desc}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accent Color</span>
          <div className="flex flex-wrap items-center gap-3">
            {accentColors.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => updateSettings({ accentColor: color.hex })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium hover:scale-105 transition-transform"
              >
                <span className="w-3.5 h-3.5 rounded-full shadow" style={{ backgroundColor: color.hex }} />
                <span>{color.name}</span>
                {settings.accentColor === color.hex && <Check className="w-3 h-3 text-slate-900 dark:text-white" />}
              </button>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-400">Custom Hex:</span>
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => updateSettings({ accentColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer"
                aria-label="Custom accent color"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Compact UI Mode</span>
              <span className="text-[11px] text-slate-400">Tighter margins and padding for high density</span>
            </div>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSettings({ compactMode: e.target.checked })}
              className="rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Smooth Animations</span>
              <span className="text-[11px] text-slate-400">Page entrance and micro-interactions</span>
            </div>
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => updateSettings({ animations: e.target.checked })}
              className="rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>
        </div>
      </section>

      {/* Experience & Shortcuts Section (Feature 16) */}
      <section className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold shrink-0">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Interactive Guide & Shortcuts</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">Launch the platform walkthrough or review keyboard shortcuts anytime</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setTourOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-sm hover:opacity-95"
          >
            <Compass className="w-4 h-4" />
            <span>Start Guided Tour</span>
          </button>
          <button
            type="button"
            onClick={() => setShortcutsOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-cyan-500"
          >
            <Keyboard className="w-4 h-4 text-violet-500" />
            <span>Keyboard Shortcuts (⌘/)</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/browser-utilities')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-cyan-500"
          >
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>Browser Storage Inspector</span>
          </button>
        </div>
      </section>

      {/* Behavior & Default Suite */}
      <section className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold shrink-0">
            <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Workspace Behavior</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">Configure default catalog views and session history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
          <div>
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Default Suite on Launch
            </label>
            <select
              value={settings.defaultSuite}
              onChange={(e) => updateSettings({ defaultSuite: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Tools (Default)</option>
              {SUITE_LIST.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Track Recently Used Tools</span>
              <span className="text-[11px] text-slate-400">Keep private local history on this device</span>
            </div>
            <input
              type="checkbox"
              checked={settings.keepHistory}
              onChange={(e) => updateSettings({ keepHistory: e.target.checked })}
              className="rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 cursor-pointer sm:col-span-2">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Confirm Before Clearing Data</span>
              <span className="text-[11px] text-slate-400">Show an inline confirmation prompt before clearing stored history or favorites</span>
            </div>
            <input
              type="checkbox"
              checked={settings.confirmBeforeClearing}
              onChange={(e) => updateSettings({ confirmBeforeClearing: e.target.checked })}
              className="rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shrink-0">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Accessibility & Motion</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">Respect vestibular comfort and visual contrast</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Reduced Motion Mode</span>
              <span className="text-[11px] text-slate-400">Disables non-essential transitions and transforms</span>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">High Contrast Borders</span>
              <span className="text-[11px] text-slate-400">Reinforces card boundaries and focus outlines</span>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSettings({ highContrast: e.target.checked })}
              className="rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 cursor-pointer sm:col-span-2">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Audio & Tactile Feedback</span>
              <span className="text-[11px] text-slate-400">Zero-KB synthesized Web Audio click & chime feedback for buttons and timer alerts</span>
            </div>
            <input
              type="checkbox"
              checked={!!settings.soundEffects}
              onChange={(e) => updateSettings({ soundEffects: e.target.checked })}
              className="rounded text-cyan-500 focus:ring-cyan-500"
            />
          </label>
        </div>
      </section>

      {/* Feature 10: Privacy & Data Control Center */}
      <section className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Privacy Center & Local Data Backups</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">All user files and settings stay exclusively in your browser memory & LocalStorage</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            NOVA TOOLS never uploads files or personal workspace records to an external database. Export everything ({favorites.length} favorites, {collections.length} collections, {snippets.length} snippets, settings & notes) to JSON for cross-device migration.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={exportUserData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 active:scale-95 transition-all"
            >
              <span>Export Complete Backup (.JSON)</span>
            </button>

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-500 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer active:scale-95 transition-all">
              <span>Import Backup</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result as string;
                    if (text) {
                      const res = importUserData(text);
                      showToast(res.message, res.success ? 'success' : 'error');
                    }
                  };
                  reader.readAsText(file);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>

        {/* Granular Clear Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {dataStores.map((store) => (
            <div
              key={store.key}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{store.label}</span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{store.count}</span>
              </div>

              {pendingClear === store.key ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => executeClear(store.key)}
                    className="flex-1 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingClear(null)}
                    className="flex-1 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-[11px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={store.count === 0}
                  onClick={() => requestClear(store.key)}
                  className="text-left text-[11px] font-semibold text-rose-500 hover:underline disabled:opacity-40 disabled:no-underline inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear {store.label}
                </button>
              )}
            </div>
          ))}

          <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Database className="w-3 h-3" /> Storage Architecture
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">100% Browser Local-Only</span>
          </div>
        </div>
      </section>

      {/* Installable PWA App Section */}
      <section className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold shrink-0">
            <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Install App (Offline PWA)</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">Run NOVA TOOLS as a standalone desktop or mobile app</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3 text-xs">
          {pwaInstallPrompt ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-slate-600 dark:text-slate-300">
                Your browser supports one-click installation for offline-ready access.
              </p>
              <button
                type="button"
                onClick={installPwa}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-sm shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Install NOVA TOOLS</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1.5 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Share className="w-3.5 h-3.5 text-cyan-500" />
                <span>How to install on your device:</span>
              </p>
              <p>
                On iPhone or iPad Safari, tap the <strong className="text-slate-800 dark:text-slate-200">Share</strong> button and choose <strong className="text-slate-800 dark:text-slate-200">Add to Home Screen</strong>. On desktop Chrome or Edge, click the install icon in the address bar.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About & Production Credits */}
      <section className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold shrink-0">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">About NOVA TOOLS</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">One Space. Infinite Possibilities.</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Created by <span className="text-cyan-500 font-bold">Arpan Goswami</span>
          </p>
          <p className="text-slate-500 leading-relaxed">
            NOVA TOOLS is an all-in-one workstation where every utility runs directly in your browser. All calculations, image transformations, and PDF edits happen in memory on your device without server latency.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            © 2026 Copyright Arpan Goswami. All rights reserved.
          </div>
        </div>

        <div className="flex justify-end pt-1">
          {pendingClear === 'all' ? (
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Reset all local data, favorites & history?</span>
              <button
                type="button"
                onClick={() => executeClear('all')}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold"
              >
                Confirm Full Reset
              </button>
              <button
                type="button"
                onClick={() => setPendingClear(null)}
                className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => requestClear('all')}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset All Local Preferences & Data
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
