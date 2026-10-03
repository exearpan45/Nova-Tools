import React from 'react';
import {
  Palette, Sliders, Shield, Eye, Info, Check, RefreshCw, Trash2, Heart, Moon, Sun
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { ThemeId, ToolSuite } from '../types';
import { SUITE_LIST } from '../data/suitesData';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, clearRecent } = useNova();

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

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-page-enter">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize theme, accent color, privacy controls, and accessibility
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

        {/* 2-Theme Grid (Dark & Light Only) */}
        <div className="space-y-2.5">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Theme Mode</span>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {themes.map((t) => {
              const isSelected = settings.theme === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
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

        {/* Accent Color Picker */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accent Color</span>
          <div className="flex flex-wrap items-center gap-3">
            {accentColors.map((color) => (
              <button
                key={color.hex}
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
              />
            </div>
          </div>
        </div>

        {/* Compact Mode & Animations */}
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
              <span className="text-[11px] text-slate-400">Show a confirmation prompt before clearing history or favorites</span>
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
            <p className="text-[11px] sm:text-xs text-slate-400">Production-Ready Workspace</p>
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
          <button
            onClick={() => {
              if (settings.confirmBeforeClearing) {
                if (!window.confirm('Are you sure you want to reset all local preferences and saved history?')) {
                  return;
                }
              }
              clearRecent();
              localStorage.removeItem('nova_v2_favorites');
              localStorage.removeItem('nova_v2_settings');
              window.location.reload();
            }}
            className="text-xs text-rose-500 hover:underline flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset All Local Preferences & History
          </button>
        </div>
      </section>
    </div>
  );
};
