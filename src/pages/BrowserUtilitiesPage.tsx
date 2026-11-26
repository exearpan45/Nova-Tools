import React, { useState, useEffect } from 'react';
import {
  Monitor, Keyboard, Mouse, Database, Globe, Wifi, Copy, Check, Trash2, ShieldCheck
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';

export const BrowserUtilitiesPage: React.FC = () => {
  const { showToast } = useToast();
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio || 1 });
  const [lastKeyEvent, setLastKeyEvent] = useState<{ key: string; code: string; ctrl: boolean; shift: boolean; alt: boolean; meta: boolean } | null>(null);
  const [mouseState, setMouseState] = useState<{ x: number; y: number; button: string; clicks: number }>({ x: 0, y: 0, button: 'None', clicks: 0 });
  const [storageTab, setStorageTab] = useState<'local' | 'session' | 'cookies'>('local');
  const [storageVersion, setStorageVersion] = useState<number>(0);
  const [confirmClearStorage, setConfirmClearStorage] = useState<boolean>(false);
  const [copiedUa, setCopiedUa] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio || 1 });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navAny = navigator as any;
  const connection = navAny.connection || navAny.mozConnection || navAny.webkitConnection || null;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = navigator.language;

  const storageEntries = React.useMemo(() => {
    void storageVersion;
    try {
      if (storageTab === 'local') {
        return Object.keys(localStorage).map((k) => ({ key: k, value: localStorage.getItem(k) || '' }));
      }
      if (storageTab === 'session') {
        return Object.keys(sessionStorage).map((k) => ({ key: k, value: sessionStorage.getItem(k) || '' }));
      }
      const rawCookies = document.cookie ? document.cookie.split(';').map((c) => c.trim()).filter(Boolean) : [];
      return rawCookies.map((pair) => {
        const idx = pair.indexOf('=');
        return idx === -1 ? { key: pair, value: '' } : { key: pair.slice(0, idx), value: pair.slice(idx + 1) };
      });
    } catch {
      return [];
    }
  }, [storageTab, storageVersion]);

  const deleteStorageKey = (key: string) => {
    if (storageTab === 'local') localStorage.removeItem(key);
    else if (storageTab === 'session') sessionStorage.removeItem(key);
    setStorageVersion((v) => v + 1);
    showToast(`Removed "${key}"`, 'info');
  };

  const clearCurrentStorage = () => {
    if (storageTab === 'local') localStorage.clear();
    else if (storageTab === 'session') sessionStorage.clear();
    setConfirmClearStorage(false);
    setStorageVersion((v) => v + 1);
    showToast(`Cleared ${storageTab} storage`, 'info');
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            NOVA Browser Utilities
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Environment, Input & Storage Inspector
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Inspect viewport metrics, timezone, user agent, keyboard/mouse events, and browser storage locally without transmitting any data.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Strictly client-side · Zero telemetry sent</span>
        </div>
      </div>

      {/* Environment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Monitor className="w-4 h-4 text-blue-500" />
            <span>Viewport & Screen</span>
          </div>
          <div className="text-xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
            {viewport.width} × {viewport.height} px
          </div>
          <p className="text-xs font-mono tabular-nums text-slate-500">
            Screen: {window.screen.width} × {window.screen.height} · DPR {viewport.dpr}x
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Globe className="w-4 h-4 text-cyan-500" />
            <span>Timezone & Locale</span>
          </div>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white truncate">
            {tz}
          </div>
          <p className="text-xs font-mono text-slate-500">
            Locale: {locale} · {navigator.onLine ? 'Online' : 'Offline'}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Wifi className="w-4 h-4 text-emerald-500" />
            <span>Network Information API</span>
          </div>
          {connection ? (
            <>
              <div className="text-xl font-black font-mono uppercase text-slate-900 dark:text-white">
                {connection.effectiveType || 'Available'}
              </div>
              <p className="text-xs font-mono tabular-nums text-slate-500">
                Downlink: ~{connection.downlink ?? '?'} Mbps · RTT: {connection.rtt ?? '?'} ms
              </p>
            </>
          ) : (
            <>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Unsupported in this browser
              </div>
              <p className="text-xs text-slate-500">
                `navigator.connection` is exposed primarily in Chromium browsers, not Firefox or Safari.
              </p>
            </>
          )}
        </div>
      </div>

      {/* User Agent */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">User-Agent String</span>
          <button
            type="button"
            onClick={() => {
              copyToClipboard(navigator.userAgent);
              setCopiedUa(true);
              setTimeout(() => setCopiedUa(false), 1800);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400"
          >
            {copiedUa ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUa ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <p className="font-mono text-xs text-slate-600 dark:text-slate-300 break-all bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          {navigator.userAgent}
        </p>
      </div>

      {/* Keyboard & Mouse Testers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          tabIndex={0}
          onKeyDown={(e) => {
            e.preventDefault();
            setLastKeyEvent({
              key: e.key,
              code: e.code,
              ctrl: e.ctrlKey,
              shift: e.shiftKey,
              alt: e.altKey,
              meta: e.metaKey,
            });
          }}
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:border-blue-500 focus:outline-none space-y-3 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-blue-500" /> Keyboard Event Tester
            </span>
            <span className="text-[11px] text-slate-400">Click box & press any key</span>
          </div>

          {lastKeyEvent ? (
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">event.key</span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400">{lastKeyEvent.key === ' ' ? '(Space)' : lastKeyEvent.key}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">event.code</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{lastKeyEvent.code}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4">Click inside this box and press any key to inspect key codes and modifiers.</p>
          )}
        </div>

        <div
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMouseState((prev) => ({
              ...prev,
              x: Math.round(e.clientX - rect.left),
              y: Math.round(e.clientY - rect.top),
            }));
          }}
          onMouseDown={(e) => {
            const names = ['Left', 'Middle', 'Right', 'Back', 'Forward'];
            setMouseState((prev) => ({
              ...prev,
              button: names[e.button] || `Button ${e.button}`,
              clicks: prev.clicks + 1,
            }));
          }}
          onContextMenu={(e) => e.preventDefault()}
          className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3 select-none cursor-crosshair"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mouse className="w-4 h-4 text-cyan-500" /> Mouse & Pointer Pad
            </span>
            <span className="text-[11px] text-slate-400">Move or click inside</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono tabular-nums pt-1">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Position</span>
              <span className="font-bold text-slate-900 dark:text-white">{mouseState.x}, {mouseState.y}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Last Button</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">{mouseState.button}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Clicks</span>
              <span className="font-bold text-slate-900 dark:text-white">{mouseState.clicks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Storage Inspector */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-violet-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Site Storage & Cookies Inspector</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              {(['local', 'session', 'cookies'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setStorageTab(tab);
                    setConfirmClearStorage(false);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold capitalize ${
                    storageTab === tab ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  {tab === 'cookies' ? 'Document Cookies' : `${tab}Storage`}
                </button>
              ))}
            </div>

            {storageTab !== 'cookies' && storageEntries.length > 0 && (
              confirmClearStorage ? (
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={clearCurrentStorage} className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold">
                    Confirm Clear
                  </button>
                  <button type="button" onClick={() => setConfirmClearStorage(false)} className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClearStorage(true)}
                  className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-500 text-xs font-bold"
                >
                  Clear All
                </button>
              )
            )}
          </div>
        </div>

        {storageEntries.length > 0 ? (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {storageEntries.map((entry) => (
              <div key={entry.key} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-start justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="font-mono font-bold text-slate-900 dark:text-white block">{entry.key}</span>
                  <span className="font-mono text-[11px] text-slate-500 break-all line-clamp-2">{entry.value}</span>
                </div>
                {storageTab !== 'cookies' && (
                  <button
                    type="button"
                    onClick={() => deleteStorageKey(entry.key)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 shrink-0"
                    title="Delete key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">
            {storageTab === 'cookies'
              ? 'No client-accessible cookies found on document.cookie (HttpOnly cookies are hidden by browser security).'
              : `No keys currently stored in ${storageTab}Storage.`}
          </p>
        )}
      </div>
    </div>
  );
};
