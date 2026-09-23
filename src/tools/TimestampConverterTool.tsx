import React, { useState, useEffect } from 'react';
import { Copy, Clock, Play, Pause, Check, ArrowRight, RotateCcw, Calendar } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

export const TimestampConverterTool: React.FC = () => {
  const { showToast } = useToast();
  const [nowSec, setNowSec] = useState<number>(Math.floor(Date.now() / 1000));
  const [isTicking, setIsTicking] = useState<boolean>(true);

  // Timestamp -> Human Date
  const [inputTs, setInputTs] = useState<string>(Math.floor(Date.now() / 1000).toString());
  // Human Date -> Timestamp
  const [inputDate, setInputDate] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
  const parsedTsNum = parseFloat(inputTs.trim());
  let dateFromTs: Date | null = null;
  let isTsValid = false;

  if (!isNaN(parsedTsNum) && parsedTsNum > 0) {
    // If length >= 12 digits, assume milliseconds, else seconds
    const ms = inputTs.trim().length >= 12 ? parsedTsNum : parsedTsNum * 1000;
    dateFromTs = new Date(ms);
    if (!isNaN(dateFromTs.getTime())) {
      isTsValid = true;
    }
  }

  // Parse Date -> Timestamp
  let tsFromDateSec: number | null = null;
  let tsFromDateMs: number | null = null;
  if (inputDate) {
    const d = new Date(inputDate);
    if (!isNaN(d.getTime())) {
      tsFromDateMs = d.getTime();
      tsFromDateSec = Math.floor(tsFromDateMs / 1000);
    }
  }

  const handleSetToCurrent = () => {
    const current = Math.floor(Date.now() / 1000).toString();
    setInputTs(current);
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setInputDate(d.toISOString().slice(0, 16));
    showToast('Updated to current time', 'info');
  };

  const getRelativeTime = (d: Date): string => {
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHr / 24);

    if (Math.abs(diffSec) < 45) return 'just now';
    if (diffSec > 0) {
      if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
      if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
      return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
    } else {
      const absMin = Math.abs(diffMin);
      const absHr = Math.abs(diffHr);
      const absDay = Math.abs(diffDay);
      if (absMin < 60) return `in ${absMin} minute${absMin === 1 ? '' : 's'}`;
      if (absHr < 24) return `in ${absHr} hour${absHr === 1 ? '' : 's'}`;
      return `in ${absDay} day${absDay === 1 ? '' : 's'}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Current Epoch Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-neutral-900 text-white dark:bg-[#18181b] dark:border dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Current Unix Epoch Timestamp</span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-blue-400">
            {nowSec}
          </div>
          <div className="text-xs text-neutral-400 mt-1 font-mono">
            {new Date(nowSec * 1000).toUTCString()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => copyWithFeedback(nowSec.toString(), 'current-epoch', 'Current Epoch')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            {copiedKey === 'current-epoch' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Converter 1: Timestamp to Human Date */}
        <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>Timestamp to Human Date</span>
            </h3>
            <button
              type="button"
              onClick={handleSetToCurrent}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
            >
              Set to Now
            </button>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Unix Timestamp (seconds or milliseconds)
            </label>
            <input
              type="text"
              value={inputTs}
              onChange={(e) => setInputTs(e.target.value)}
              placeholder="e.g. 1774345200"
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-neutral-900 dark:text-neutral-100"
            />
          </div>

          {isTsValid && dateFromTs ? (
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              {/* UTC */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px]">UTC Time</span>
                  <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                    {dateFromTs.toUTCString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyWithFeedback(dateFromTs!.toUTCString(), 'utc', 'UTC Time')}
                  className="p-1 rounded text-neutral-400 hover:text-blue-600 cursor-pointer"
                  title="Copy UTC string"
                >
                  {copiedKey === 'utc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Local */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px]">Local Time</span>
                  <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                    {dateFromTs.toString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyWithFeedback(dateFromTs!.toString(), 'local', 'Local Time')}
                  className="p-1 rounded text-neutral-400 hover:text-blue-600 cursor-pointer"
                  title="Copy Local string"
                >
                  {copiedKey === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* ISO 8601 */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px]">ISO 8601</span>
                  <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                    {dateFromTs.toISOString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyWithFeedback(dateFromTs!.toISOString(), 'iso', 'ISO 8601')}
                  className="p-1 rounded text-neutral-400 hover:text-blue-600 cursor-pointer"
                  title="Copy ISO string"
                >
                  {copiedKey === 'iso' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Relative */}
              <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 text-xs flex items-center justify-between">
                <span className="text-blue-600 dark:text-blue-400 font-medium">Relative</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {getRelativeTime(dateFromTs)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic">Enter a valid Unix timestamp number.</p>
          )}
        </div>

        {/* Converter 2: Human Date to Timestamp */}
        <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>Human Date to Timestamp</span>
            </h3>
            <button
              type="button"
              onClick={handleSetToCurrent}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
            >
              Set to Now
            </button>
          </div>

          <div>
            <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Select Date & Time (Local)
            </label>
            <input
              type="datetime-local"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-neutral-900 dark:text-neutral-100"
            />
          </div>

          {tsFromDateSec !== null && tsFromDateMs !== null ? (
            <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              {/* Seconds */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">
                    Epoch Seconds (10 digits)
                  </span>
                  <span
                    data-action="output"
                    className="text-lg font-bold font-mono text-neutral-900 dark:text-white"
                  >
                    {tsFromDateSec}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyWithFeedback(tsFromDateSec!.toString(), 'sec', 'Seconds')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  {copiedKey === 'sec' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>

              {/* Milliseconds */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">
                    Epoch Milliseconds (13 digits)
                  </span>
                  <span className="text-sm font-bold font-mono text-neutral-700 dark:text-neutral-300">
                    {tsFromDateMs}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyWithFeedback(tsFromDateMs!.toString(), 'ms', 'Milliseconds')}
                  className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer"
                  title="Copy milliseconds"
                >
                  {copiedKey === 'ms' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic">Select a valid date and time.</p>
          )}
        </div>
      </div>
    </div>
  );
};
