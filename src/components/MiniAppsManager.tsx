import React, { useState, useEffect, useRef } from 'react';
import {
  X, Minus, Maximize2, Minimize2, Calculator, StickyNote, Clock,
  Palette, ArrowLeftRight, Copy, Check, Play, Pause, RotateCcw, Pipette
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { MiniAppId } from '../types';
import { evaluateSafeMath } from '../utils/safeMath';
import { copyToClipboard } from '../utils/clipboard';

interface WindowState {
  x: number;
  y: number;
  minimized: boolean;
  maximized: boolean;
}

const MINI_APP_META: Record<MiniAppId, { title: string; icon: React.ElementType; accent: string }> = {
  calculator: { title: 'Mini Calculator', icon: Calculator, accent: '#06b6d4' },
  notes: { title: 'Quick Notes', icon: StickyNote, accent: '#8b5cf6' },
  timer: { title: 'Mini Timer', icon: Clock, accent: '#ec4899' },
  color: { title: 'Color Inspector', icon: Palette, accent: '#10b981' },
  converter: { title: 'Unit Converter', icon: ArrowLeftRight, accent: '#f59e0b' },
};

const MiniCalculatorBody: React.FC = () => {
  const { triggerSound } = useNova();
  const [expr, setExpr] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [copied, setCopied] = useState<boolean>(false);

  const evaluate = (nextExpr: string) => {
    setExpr(nextExpr);
    if (!nextExpr.trim()) {
      setResult('0');
      return;
    }
    const res = evaluateSafeMath(nextExpr);
    if (res.result !== undefined && Number.isFinite(res.result)) {
      setResult(Number.isInteger(res.result) ? String(res.result) : String(Number(res.result.toFixed(8))));
    }
  };

  const keys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '(', ')', '+'];

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
        <input
          type="text"
          value={expr}
          onChange={(e) => evaluate(e.target.value)}
          placeholder="e.g. (128 * 1.18) + 40"
          className="w-full bg-transparent text-xs font-mono text-slate-600 dark:text-slate-300 focus:outline-none"
          aria-label="Calculator expression"
        />
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-200/70 dark:border-slate-800">
          <span className="text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white truncate">
            {result}
          </span>
          <button
            type="button"
            onClick={async () => {
              const ok = await copyToClipboard(result);
              if (ok) {
                setCopied(true);
                triggerSound('click');
                setTimeout(() => setCopied(false), 1200);
              }
            }}
            className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              triggerSound('click');
              evaluate(expr + k);
            }}
            className="py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500/50 text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
          >
            {k}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            evaluate(expr.slice(0, -1));
          }}
          className="py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
        >
          DEL
        </button>
        <button
          type="button"
          onClick={() => {
            setExpr('');
            setResult('0');
          }}
          className="py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400"
        >
          CLR
        </button>
        <button
          type="button"
          onClick={() => {
            const res = evaluateSafeMath(expr);
            if (res.result !== undefined && Number.isFinite(res.result)) {
              const formatted = Number.isInteger(res.result) ? String(res.result) : String(Number(res.result.toFixed(8)));
              setExpr(formatted);
              setResult(formatted);
              triggerSound('success');
            }
          }}
          className="py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
        >
          =
        </button>
      </div>
    </div>
  );
};

const MiniNotesBody: React.FC = () => {
  const [note, setNote] = useState<string>(() => {
    try {
      return localStorage.getItem('nova_workspace_note') || '';
    } catch {
      return '';
    }
  });
  const [copied, setCopied] = useState<boolean>(false);

  const handleChange = (val: string) => {
    setNote(val);
    try {
      localStorage.setItem('nova_workspace_note', val);
    } catch {}
  };

  return (
    <div className="space-y-2.5">
      <textarea
        value={note}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Jot down quick notes (automatically synced with NOVA Workspace)..."
        rows={6}
        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 text-slate-800 dark:text-slate-200 resize-none focus:outline-none"
      />
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>{note.length} chars · Saved locally</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              const ok = await copyToClipboard(note);
              if (ok) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }
            }}
            className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={() => handleChange('')}
            className="text-rose-500 font-semibold hover:underline"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

const MiniTimerBody: React.FC = () => {
  const { triggerSound } = useNova();
  const [durationSec, setDurationSec] = useState<number>(300);
  const [remainingSec, setRemainingSec] = useState<number>(300);
  const [running, setRunning] = useState<boolean>(false);
  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    endTimeRef.current = Date.now() + remainingSec * 1000;
    const id = window.setInterval(() => {
      if (!endTimeRef.current) return;
      const left = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setRemainingSec(left);
      if (left <= 0) {
        setRunning(false);
        endTimeRef.current = null;
        triggerSound('chime');
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const mins = String(Math.floor(remainingSec / 60)).padStart(2, '0');
  const secs = String(remainingSec % 60).padStart(2, '0');

  const selectPreset = (sec: number) => {
    setRunning(false);
    endTimeRef.current = null;
    setDurationSec(sec);
    setRemainingSec(sec);
  };

  return (
    <div className="space-y-3 text-center">
      <div className="py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
        <div className="text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
          {mins}:{secs}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {remainingSec === 0 ? 'Time elapsed!' : running ? 'Running...' : 'Paused'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {[60, 300, 600, 1500].map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => selectPreset(sec)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
              durationSec === sec
                ? 'bg-pink-500 text-white border-pink-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {sec / 60}m
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (remainingSec === 0) setRemainingSec(durationSec);
            setRunning((r) => !r);
          }}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5"
        >
          {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          onClick={() => selectPreset(durationSec)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

function hexToRgbAndHsl(hex: string) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) || 0;
  const g = parseInt(clean.slice(2, 4), 16) || 0;
  const b = parseInt(clean.slice(4, 6), 16) || 0;

  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h /= 6;
  }

  return {
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
  };
}

const MiniColorBody: React.FC = () => {
  const [hex, setHex] = useState<string>('#06b6d4');
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [eyeDropperSupported] = useState<boolean>(() => typeof window !== 'undefined' && 'EyeDropper' in window);
  const { rgb, hsl } = hexToRgbAndHsl(hex);

  const pickFromScreen = async () => {
    try {
      const EyeDropperCtor = (window as any).EyeDropper;
      if (!EyeDropperCtor) return;
      const dropper = new EyeDropperCtor();
      const result = await dropper.open();
      if (result?.sRGBHex) setHex(result.sRGBHex);
    } catch {}
  };

  const copyFmt = async (label: string, val: string) => {
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(label);
      setTimeout(() => setCopiedKey(''), 1200);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="w-12 h-12 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 shrink-0"
          aria-label="Choose color"
        />
        <div className="flex-1 space-y-1">
          <div className="h-8 rounded-lg border border-slate-200 dark:border-slate-700" style={{ backgroundColor: hex }} />
          {eyeDropperSupported && (
            <button
              type="button"
              onClick={pickFromScreen}
              className="w-full py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 inline-flex items-center justify-center gap-1"
            >
              <Pipette className="w-3 h-3" /> Eyedropper
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        {[
          { label: 'HEX', val: hex.toUpperCase() },
          { label: 'RGB', val: rgb },
          { label: 'HSL', val: hsl },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60"
          >
            <span className="font-mono text-[11px] text-slate-700 dark:text-slate-200 truncate">
              <strong className="text-slate-400 mr-1.5">{item.label}</strong>
              {item.val}
            </span>
            <button
              type="button"
              onClick={() => copyFmt(item.label, item.val)}
              className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 shrink-0 ml-2"
            >
              {copiedKey === item.label ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const UNIT_GROUPS = {
  length: {
    label: 'Length',
    units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 },
  },
  weight: {
    label: 'Weight',
    units: { kg: 1, g: 0.001, lb: 0.45359237, oz: 0.02834952 },
  },
  temp: {
    label: 'Temperature',
    units: { C: 1, F: 1, K: 1 },
  },
};

const MiniConverterBody: React.FC = () => {
  const [group, setGroup] = useState<'length' | 'weight' | 'temp'>('length');
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('km');
  const [toUnit, setToUnit] = useState<string>('ft');

  const unitNames = Object.keys(UNIT_GROUPS[group].units);

  const handleGroupChange = (nextGroup: 'length' | 'weight' | 'temp') => {
    setGroup(nextGroup);
    const keys = Object.keys(UNIT_GROUPS[nextGroup].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  const num = parseFloat(value);
  let output = '—';
  if (!Number.isNaN(num)) {
    if (group === 'temp') {
      let celsius = num;
      if (fromUnit === 'F') celsius = (num - 32) * (5 / 9);
      if (fromUnit === 'K') celsius = num - 273.15;
      let res = celsius;
      if (toUnit === 'F') res = celsius * (9 / 5) + 32;
      if (toUnit === 'K') res = celsius + 273.15;
      output = `${Number(res.toFixed(4))} °${toUnit}`;
    } else {
      const table = UNIT_GROUPS[group].units as Record<string, number>;
      const base = num * (table[fromUnit] || 1);
      const converted = base / (table[toUnit] || 1);
      output = `${Number(converted.toFixed(6))} ${toUnit}`;
    }
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="flex gap-1">
        {(['length', 'weight', 'temp'] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => handleGroupChange(g)}
            className={`flex-1 py-1.5 rounded-lg font-bold capitalize border ${
              group === g
                ? 'bg-amber-500 text-white border-amber-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {UNIT_GROUPS[g].label}
          </button>
        ))}
      </div>

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 font-mono text-sm"
        aria-label="Value to convert"
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
          aria-label="From unit"
        >
          {unitNames.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
          aria-label="To unit"
        >
          {unitNames.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-center font-mono font-bold text-sm text-slate-900 dark:text-white">
        {output}
      </div>
    </div>
  );
};

export const MiniAppsManager: React.FC = () => {
  const { openMiniApps, openMiniApp, closeMiniApp } = useNova();
  const [windows, setWindows] = useState<Partial<Record<MiniAppId, WindowState>>>({});
  const dragRef = useRef<{
    id: MiniAppId;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  useEffect(() => {
    setWindows((prev) => {
      const next = { ...prev };
      openMiniApps.forEach((id, idx) => {
        if (!next[id]) {
          const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
          const baseX = Math.max(16, vw - 356 - idx * 24);
          const baseY = 84 + idx * 28;
          next[id] = { x: baseX, y: baseY, minimized: false, maximized: false };
        }
      });
      return next;
    });
  }, [openMiniApps]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const nextX = Math.min(Math.max(8, drag.origX + (e.clientX - drag.startX)), Math.max(8, vw - 330));
      const nextY = Math.min(Math.max(8, drag.origY + (e.clientY - drag.startY)), Math.max(8, vh - 120));
      setWindows((prev) => ({
        ...prev,
        [drag.id]: {
          ...(prev[drag.id] || { x: 24, y: 84, minimized: false, maximized: false }),
          x: nextX,
          y: nextY,
        },
      }));
    };
    const onPointerUp = () => {
      dragRef.current = null;
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  if (openMiniApps.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {openMiniApps.map((id, stackIdx) => {
        const meta = MINI_APP_META[id];
        const Icon = meta.icon;
        const win = windows[id] || { x: 32, y: 84, minimized: false, maximized: false };

        const renderBody = () => {
          switch (id) {
            case 'calculator':
              return <MiniCalculatorBody />;
            case 'notes':
              return <MiniNotesBody />;
            case 'timer':
              return <MiniTimerBody />;
            case 'color':
              return <MiniColorBody />;
            case 'converter':
              return <MiniConverterBody />;
          }
        };

        return (
          <div
            key={id}
            onPointerDown={() => openMiniApp(id)}
            style={
              win.maximized
                ? { zIndex: 45 + stackIdx }
                : {
                    zIndex: 45 + stackIdx,
                    ['--win-x' as any]: `${win.x}px`,
                    ['--win-y' as any]: `${win.y}px`,
                  }
            }
            className={`pointer-events-auto shadow-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col transition-shadow ${
              win.maximized
                ? 'fixed inset-4 sm:inset-auto sm:top-20 sm:right-6 sm:w-[460px]'
                : 'fixed bottom-20 left-3 right-3 sm:bottom-auto sm:right-auto sm:w-[330px] sm:[left:var(--win-x)] sm:[top:var(--win-y)]'
            }`}
          >
            {/* Draggable Window Titlebar */}
            <div
              onPointerDown={(e) => {
                if (window.innerWidth < 640 || win.maximized) return;
                if ((e.target as HTMLElement).closest('button')) return;
                dragRef.current = {
                  id,
                  startX: e.clientX,
                  startY: e.clientY,
                  origX: win.x,
                  origY: win.y,
                };
              }}
              className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 flex items-center justify-between gap-2 sm:cursor-move select-none"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${meta.accent}20`, color: meta.accent }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{meta.title}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      [id]: { ...win, minimized: !win.minimized },
                    }))
                  }
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800"
                  aria-label={win.minimized ? 'Restore mini app' : 'Minimize mini app'}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      [id]: { ...win, maximized: !win.maximized, minimized: false },
                    }))
                  }
                  className="hidden sm:inline-flex p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800"
                  aria-label={win.maximized ? 'Restore size' : 'Expand mini app'}
                >
                  {win.maximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => closeMiniApp(id)}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                  aria-label={`Close ${meta.title}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!win.minimized && <div className="p-3.5">{renderBody()}</div>}
          </div>
        );
      })}
    </div>
  );
};
