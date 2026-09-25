import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Clock, Play, Pause, Check, ArrowRight, RotateCcw, Calendar, Info, AlertCircle } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

export type TimestampUnit = 'auto' | 's' | 'ms' | 'us' | 'ns';

export type TimestampAnalysis =
  | { valid: false; error: string; autoNote?: string | null }
  | {
      valid: true;
      date: Date;
      effectiveUnit: 's' | 'ms' | 'us' | 'ns';
      autoNote: string | null;
      utcString: string;
      isoString: string;
      localString: string;
      relative: string;
      error: null;
    };

export const TimestampConverterTool: React.FC = () => {
  const { showToast } = useToast();
  const [nowSec, setNowSec] = useState<number>(Math.floor(Date.now() / 1000));
  const [isTicking, setIsTicking] = useState<boolean>(true);

  // Timestamp -> Human Date
  const [inputTs, setInputTs] = useState<string>(() => Math.floor(Date.now() / 1000).toString());
  const [selectedUnit, setSelectedUnit] = useState<TimestampUnit>('auto');

  // Human Date -> Timestamp
  const [inputDate, setInputDate] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live timer tick
  useEffect(() => {
    if (!isTicking) return;
    const interval = setInterval(() => {
      setNowSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTicking]);

  const copyWithFeedback = async (val: string, key: string, label?: string) => {
    const success = await copyToClipboard(val);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
      showToast(`Copied ${label || val}`, 'success');
      addScratchpadItem('timestamp-converter', val, label);
    }
  };

  // Parse Timestamp -> Human
  const parsedTsAnalysis: TimestampAnalysis = useMemo(() => {
    const raw = inputTs.trim();
    if (!raw) return { valid: false, error: 'Please enter a timestamp.' };

    const num = parseFloat(raw);
    if (isNaN(num)) return { valid: false, error: 'Timestamp must be a valid number.' };

    let effectiveUnit: 's' | 'ms' | 'us' | 'ns' = 's';
    let autoNote: string | null = null;

    if (selectedUnit === 'auto') {
      const cleanDigits = raw.replace(/[-.]/g, '');
      const len = cleanDigits.length;
      if (len <= 11) {
        effectiveUnit = 's';
        autoNote = `Auto-detected: Seconds (${len} digits)`;
      } else if (len <= 14) {
        effectiveUnit = 'ms';
        autoNote = `Auto-detected: Milliseconds (${len} digits)`;
      } else if (len <= 17) {
        effectiveUnit = 'us';
        autoNote = `Auto-detected: Microseconds (${len} digits)`;
      } else {
        effectiveUnit = 'ns';
        autoNote = `Auto-detected: Nanoseconds (${len} digits)`;
      }
    } else {
      effectiveUnit = selectedUnit;
    }

    let ms = 0;
    if (effectiveUnit === 's') {
      ms = num * 1000;
    } else if (effectiveUnit === 'ms') {
      ms = num;
    } else if (effectiveUnit === 'us') {
      ms = num / 1000;
    } else if (effectiveUnit === 'ns') {
      ms = num / 1000000;
    }

    const d = new Date(ms);
    if (isNaN(d.getTime())) {
      return { valid: false, error: 'Value produces an invalid or out-of-range date.' };
    }

    // Relative calculation
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHr / 24);

    let relative = '';
    if (Math.abs(diffSec) < 30) relative = 'just now';
    else if (diffSec > 0) {
      if (diffMin < 60) relative = `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
      else if (diffHr < 24) relative = `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
      else if (diffDay < 365) relative = `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
      else relative = `${Math.round(diffDay / 365.25)} years ago`;
    } else {
      const absMin = Math.abs(diffMin);
      const absHr = Math.abs(diffHr);
      const absDay = Math.abs(diffDay);
      if (absMin < 60) relative = `in ${absMin} minute${absMin === 1 ? '' : 's'}`;
      else if (absHr < 24) relative = `in ${absHr} hour${absHr === 1 ? '' : 's'}`;
      else if (absDay < 365) relative = `in ${absDay} day${absDay === 1 ? '' : 's'}`;
      else relative = `in ${Math.round(absDay / 365.25)} years`;
    }

    return {
      valid: true,
      date: d,
      effectiveUnit,
      autoNote,
      utcString: d.toUTCString(),
      isoString: d.toISOString(),
      localString: d.toLocaleString(undefined, {
        dateStyle: 'full',
        timeStyle: 'long',
      }),
      relative,
      error: null
    };
  }, [inputTs, selectedUnit]);

  // Parse Date -> Timestamp
  const humanDateAnalysis = useMemo(() => {
    if (!inputDate) return null;
    const d = new Date(inputDate);
    if (isNaN(d.getTime())) return null;

    const ms = d.getTime();
    const sec = Math.floor(ms / 1000);
    const us = ms * 1000;
    const ns = ms * 1000000;

    return {
      sec: sec.toString(),
      ms: ms.toString(),
      us: us.toString(),
      ns: ns.toString(),
      utcString: d.toUTCString(),
      isoString: d.toISOString(),
    };
  }, [inputDate]);

  const handleSetToCurrent = () => {
    const cur = Math.floor(Date.now() / 1000).toString();
    setInputTs(cur);
    setSelectedUnit('auto');
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setInputDate(d.toISOString().slice(0, 16));
    showToast('Updated to current time', 'info');
  };

  const handleSetEpoch = () => {
    setInputTs('0');
    setSelectedUnit('s');
    setInputDate('1970-01-01T00:00');
    showToast('Set to Unix Epoch (Jan 1, 1970)', 'info');
  };

  const handleSetYear2038 = () => {
    setInputTs('2147483647');
    setSelectedUnit('s');
    setInputDate('2038-01-19T03:14');
    showToast('Set to Year 2038 32-bit limit', 'info');
  };

  const validTs = parsedTsAnalysis.valid ? parsedTsAnalysis : null;

  return (
    <div className="space-y-6">
      {/* Live Current Epoch Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900 text-white dark:bg-[#18181b] dark:border dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Current Unix Epoch Timestamp (Seconds)</span>
          </div>
          <div
            data-action="output"
            className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-blue-400"
          >
            {nowSec}
          </div>
          <div className="text-xs text-neutral-400 mt-1 font-mono">
            {new Date(nowSec * 1000).toUTCString()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-action="primary"
            onClick={() => copyWithFeedback(nowSec.toString(), 'current-epoch', 'Current Epoch')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            {copiedKey === 'current-epoch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'current-epoch' ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsTicking(!isTicking)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
            title={isTicking ? 'Pause timer' : 'Resume timer'}
          >
            {isTicking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isTicking ? 'Pause' : 'Resume'}</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons Bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-neutral-400 font-medium">Quick Presets:</span>
        <button
          type="button"
          onClick={handleSetToCurrent}
          className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
        >
          Now
        </button>
        <button
          type="button"
          onClick={handleSetEpoch}
          className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
        >
          Unix Epoch (1970-01-01)
        </button>
        <button
          type="button"
          onClick={handleSetYear2038}
          className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
        >
          Year 2038 (32-bit Max)
        </button>
      </div>

      {/* Converters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Converter 1: Timestamp to Human Date */}
        <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>Timestamp to Human Date</span>
            </h3>
            <span className="text-xs text-neutral-400 font-mono">Epoch &rarr; UTC / Local</span>
          </div>

          {/* Unit selector & Timestamp Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="ts-input" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Timestamp Value:
              </label>
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
                {(['auto', 's', 'ms', 'us', 'ns'] as TimestampUnit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setSelectedUnit(u)}
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${
                      selectedUnit === u
                        ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {u === 'auto' ? 'Auto' : u}
                  </button>
                ))}
              </div>
            </div>

            <input
              id="ts-input"
              type="text"
              value={inputTs}
              onChange={(e) => setInputTs(e.target.value)}
              placeholder="e.g. 1774000000 or 0 or -1000000"
              className="w-full px-3.5 py-2.5 text-base font-mono bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Auto-detect info notice */}
          {parsedTsAnalysis.autoNote && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{parsedTsAnalysis.autoNote}. Use the unit selector above to override.</span>
            </div>
          )}

          {/* Validation error */}
          {!parsedTsAnalysis.valid && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{parsedTsAnalysis.error}</span>
            </div>
          )}

          {/* Output Details */}
          {validTs && (
            <div className="space-y-3 pt-2 animate-result-in">
              {/* UTC Time */}
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    UTC Time (Universal Time Coordinated)
                  </div>
                  <div className="text-sm font-mono font-medium text-neutral-900 dark:text-neutral-100 select-all">
                    {validTs.utcString}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyWithFeedback(validTs.utcString, 'utc', 'UTC Time')}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  title="Copy UTC string"
                >
                  {copiedKey === 'utc' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Local Time */}
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Local Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                  </div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 select-all">
                    {validTs.localString}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyWithFeedback(validTs.localString, 'local', 'Local Time')}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  title="Copy Local string"
                >
                  {copiedKey === 'local' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* ISO 8601 & Relative */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    ISO 8601
                  </div>
                  <div className="text-xs font-mono text-neutral-800 dark:text-neutral-200 truncate select-all mt-0.5">
                    {validTs.isoString}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Relative Time
                  </div>
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                    {validTs.relative}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Converter 2: Human Date to Timestamp */}
        <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>Human Date to Timestamp</span>
            </h3>
            <span className="text-xs text-neutral-400 font-mono">Date &rarr; Epoch</span>
          </div>

          <div>
            <label htmlFor="human-date-input" className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
              Select Local Date & Time:
            </label>
            <input
              id="human-date-input"
              type="datetime-local"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-mono bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {humanDateAnalysis && (
            <div className="space-y-2 pt-2 animate-result-in">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Seconds (Unix timestamp)
                  </div>
                  <div className="text-base font-mono font-bold text-blue-600 dark:text-blue-400 select-all">
                    {humanDateAnalysis.sec}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyWithFeedback(humanDateAnalysis.sec, 'gen-sec', 'Seconds')}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  title="Copy seconds"
                >
                  {copiedKey === 'gen-sec' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Milliseconds (JavaScript)
                  </div>
                  <div className="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200 select-all">
                    {humanDateAnalysis.ms}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyWithFeedback(humanDateAnalysis.ms, 'gen-ms', 'Milliseconds')}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  title="Copy milliseconds"
                >
                  {copiedKey === 'gen-ms' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Microseconds (µs)
                  </div>
                  <div className="text-xs font-mono text-neutral-700 dark:text-neutral-300 select-all">
                    {humanDateAnalysis.us}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyWithFeedback(humanDateAnalysis.us, 'gen-us', 'Microseconds')}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  title="Copy microseconds"
                >
                  {copiedKey === 'gen-us' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
