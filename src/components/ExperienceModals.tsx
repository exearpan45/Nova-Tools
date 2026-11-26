import React, { useState } from 'react';
import {
  X, Bell, CheckCheck, Trash2, Keyboard, Sparkles, ArrowRight,
  Search, Layers, ShieldCheck, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { useNova } from '../context/NovaContext';

export const ExperienceModals: React.FC = () => {
  const {
    notifications,
    notificationsOpen,
    setNotificationsOpen,
    markAllNotificationsRead,
    dismissNotification,
    clearNotifications,
    shortcutsOpen,
    setShortcutsOpen,
    tourOpen,
    setTourOpen,
    navigate,
    openMiniApp,
    setSearchOpen,
  } = useNova();

  const [tourStep, setTourStep] = useState<number>(0);

  const tourSteps = [
    {
      title: 'Instant Command Search (Ctrl / Cmd + K)',
      subtitle: 'Find tools, categories, workflows, or reference cards in milliseconds',
      icon: Search,
      accent: 'from-cyan-500 to-blue-600',
      description:
        'Press Ctrl+K (or Cmd+K on Mac) from any screen to search across all 107 browser tools, 12 suites, saved pipelines, Learning Hub references, and studio workbenches.',
      ctaLabel: 'Try Command Search',
      ctaAction: () => {
        setTourOpen(false);
        setSearchOpen(true);
      },
    },
    {
      title: 'Specialized Ecosystem Studios',
      subtitle: 'Focused pro-grade workbenches beyond single-tool pages',
      icon: Layers,
      accent: 'from-violet-500 to-indigo-600',
      description:
        'Use File Studio for batch image/file processing + ZIP exports, Developer Lab for multi-tab code/JSON/JWT/file inspection, Design Studio for CSS UI kits, QR Studio, and NOVA Flow pipelines.',
      ctaLabel: 'Open File Studio',
      ctaAction: () => {
        setTourOpen(false);
        navigate('/file-studio');
      },
    },
    {
      title: 'Workspace, Snippets Vault & Floating Mini Apps',
      subtitle: 'Stay productive without losing your current screen',
      icon: Sparkles,
      accent: 'from-pink-500 to-rose-600',
      description:
        'Pin floating Mini Apps (Calculator, Quick Notes, Mini Timer, Color Picker, Unit Converter) from the top navbar, customize dashboard widgets, and store reusable snippets in your Clipboard Vault.',
      ctaLabel: 'Open NOVA Workspace',
      ctaAction: () => {
        setTourOpen(false);
        navigate('/workspace');
      },
    },
    {
      title: '100% Client-Side & Portable JSON Backups',
      subtitle: 'Zero mandatory accounts · Zero server file uploads',
      icon: ShieldCheck,
      accent: 'from-emerald-500 to-teal-600',
      description:
        'Everything stays in your browser memory and LocalStorage. Export your favorites, custom collections, snippets, workflows, and preferences to a single JSON file anytime inside Settings.',
      ctaLabel: 'Visit Privacy & Settings',
      ctaAction: () => {
        setTourOpen(false);
        navigate('/settings');
      },
    },
  ];

  const shortcuts = [
    { keys: 'Ctrl / ⌘ + K', desc: 'Open Global Command Search across tools, workflows, and studios' },
    { keys: 'Ctrl / ⌘ + /', desc: 'Toggle Keyboard Shortcuts Reference modal' },
    { keys: '↑ / ↓', desc: 'Move selection inside Global Search results' },
    { keys: 'Enter', desc: 'Launch currently highlighted search result' },
    { keys: 'Esc', desc: 'Close active modal, search overlay, or notification drawer' },
  ];

  return (
    <>
      {/* 1. Notification Center Drawer */}
      {notificationsOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex justify-end"
          onClick={() => setNotificationsOpen(false)}
        >
          <aside
            className="w-full max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-page-enter"
            onClick={(e) => e.stopPropagation()}
            aria-label="Notification Center"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-500" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white">Notifications</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {notifications.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="inline-flex items-center gap-1 font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="inline-flex items-center gap-1 font-semibold text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear all
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No notifications yet. Activity alerts from batch exports, workflows, and backups appear here.
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.type === 'success' ? CheckCircle2 : n.type === 'error' ? AlertCircle : Info;
                  const iconColor =
                    n.type === 'success' ? 'text-emerald-500' : n.type === 'error' ? 'text-rose-500' : 'text-cyan-500';
                  return (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                        n.read
                          ? 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40'
                          : 'border-cyan-500/30 bg-cyan-500/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
                          <span>{n.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => dismissNotification(n.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          aria-label="Dismiss notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{n.message}</p>
                      <div className="text-[10px] text-slate-400">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </div>
      )}

      {/* 2. Keyboard Shortcuts Modal */}
      {shortcutsOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShortcutsOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-5 animate-page-enter"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">Keyboard Shortcuts</h2>
                  <p className="text-xs text-slate-400">Navigate NOVA TOOLS rapidly</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShortcutsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                aria-label="Close shortcuts"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div
                  key={s.keys}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-xs"
                >
                  <span className="text-slate-600 dark:text-slate-300">{s.desc}</span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 shrink-0">
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShortcutsOpen(false);
                  setTourStep(0);
                  setTourOpen(true);
                }}
                className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Start Guided Walkthrough
              </button>
              <button
                type="button"
                onClick={() => {
                  setShortcutsOpen(false);
                  openMiniApp('calculator');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
              >
                Launch Mini Calculator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Interactive Onboarding Tour Modal (Manually triggered only) */}
      {tourOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setTourOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-page-enter"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="NOVA Tools Guided Tour"
          >
            {(() => {
              const step = tourSteps[tourStep] || tourSteps[0];
              const StepIcon = step.icon;
              return (
                <>
                  <div className={`p-6 bg-gradient-to-r ${step.accent} text-white flex items-start justify-between gap-4`}>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                          Step {tourStep + 1} of {tourSteps.length}
                        </span>
                        <h2 className="text-lg font-black leading-snug">{step.title}</h2>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTourOpen(false)}
                      className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                      aria-label="Close guided tour"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    <div>
                      <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{step.subtitle}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tourSteps.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTourStep(idx)}
                          className={`h-2 rounded-full transition-all ${
                            idx === tourStep ? 'w-7 bg-cyan-500' : 'w-2 bg-slate-200 dark:bg-slate-700'
                          }`}
                          aria-label={`Go to step ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={step.ctaAction}
                        className="px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        <span>{step.ctaLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        {tourStep > 0 && (
                          <button
                            type="button"
                            onClick={() => setTourStep((s) => s - 1)}
                            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                          >
                            Back
                          </button>
                        )}
                        {tourStep < tourSteps.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => setTourStep((s) => s + 1)}
                            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
                          >
                            Next
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setTourOpen(false)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                          >
                            Finish Tour
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};
