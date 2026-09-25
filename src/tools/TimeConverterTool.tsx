import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, Info, Clock } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

interface TimeUnitDef {
  id: string;
  name: string;
  abbr: string;
  seconds: number;
  type: 'exact' | 'approx';
  note?: string;
}

const TIME_UNITS: TimeUnitDef[] = [
  { id: 'ns', name: 'Nanoseconds', abbr: 'ns', seconds: 1e-9, type: 'exact' },
  { id: 'us', name: 'Microseconds', abbr: 'µs', seconds: 1e-6, type: 'exact' },
  { id: 'ms', name: 'Milliseconds', abbr: 'ms', seconds: 0.001, type: 'exact' },
  { id: 's', name: 'Seconds', abbr: 's', seconds: 1, type: 'exact' },
  { id: 'min', name: 'Minutes', abbr: 'min', seconds: 60, type: 'exact' },
  { id: 'hr', name: 'Hours', abbr: 'hr', seconds: 3600, type: 'exact' },
  { id: 'day', name: 'Days', abbr: 'd', seconds: 86400, type: 'exact' },
  { id: 'wk', name: 'Weeks', abbr: 'wk', seconds: 604800, type: 'exact' },
  {
    id: 'mo',
    name: 'Months (approx. average)',
    abbr: 'mo',
    seconds: 2629800, // 30.4375 days (365.25 / 12)
    type: 'approx',
    note: 'Mean duration (~30.4375 days). Calendar months vary (28–31 days).'
  },
  {
    id: 'yr_julian',
    name: 'Years (Julian / Astronomical)',
    abbr: 'yr',
    seconds: 31557600, // 365.25 days
    type: 'approx',
    note: 'Based on 365.25 days (accounting for leap years).'
  },
  {
    id: 'yr_common',
    name: 'Years (Common calendar)',
    abbr: 'yr (365d)',
    seconds: 31536000, // 365 days exactly
    type: 'approx',
    note: 'Standard 365-day non-leap year.'
  },
];

function formatTimeNumber(num: number): string {
  if (num === 0) return '0';
  const abs = Math.abs(num);
  if (abs >= 1e12 || abs < 1e-5) {
    return num.toExponential(4);
  }
  const rounded = Math.round(num * 1e6) / 1e6;
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

export const TimeConverterTool: React.FC = () => {
  const { showToast } = useToast();
  const [value, setValue] = useState<string>('24');
  const [sourceUnit, setSourceUnit] = useState<string>('hr');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const numVal = parseFloat(value);
  const isValid = !isNaN(numVal) && value.trim() !== '' && numVal >= 0;

  const conversions = useMemo(() => {
    if (!isValid) return [];

    const src = TIME_UNITS.find((u) => u.id === sourceUnit);
    if (!src) return [];

    const totalSeconds = numVal * src.seconds;

    return TIME_UNITS.map((unit) => {
      const converted = totalSeconds / unit.seconds;
      return {
        ...unit,
        formatted: formatTimeNumber(converted),
        raw: converted,
      };
    });
  }, [value, sourceUnit, isValid, numVal]);

  const handleCopy = async (formattedVal: string, id: string, name: string) => {
    const ok = await copyToClipboard(formattedVal);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
      showToast(`Copied ${formattedVal} ${id}`, 'success');
      addScratchpadItem('time-converter', `${formattedVal} ${id}`, name);
    }
  };

  const handleReset = () => {
    setValue('24');
    setSourceUnit('hr');
    showToast('Reset to 24 hours', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Input Configuration */}
      <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="w-36">
              <label htmlFor="time-amount-input" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Value
              </label>
              <input
                id="time-amount-input"
                type="number"
                min="0"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="24"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="time-unit-select" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Time Unit
              </label>
              <select
                id="time-unit-select"
                value={sourceUnit}
                onChange={(e) => setSourceUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {TIME_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.abbr})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Calendar vs Duration Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-xs text-neutral-600 dark:text-neutral-400">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Fixed Duration vs. Calendar Notice:</strong> Seconds, minutes, hours, days, and weeks are exact, uniform SI durations. Months (~30.4375 days) and years (365.25 days) are average estimations for duration conversions, as individual calendar months and leap years vary in length.
          </div>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-[#18181b] animate-result-in">
        {!isValid ? (
          <div className="p-6 text-center text-xs text-neutral-400 italic">
            Please enter a valid positive time number.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {conversions.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 sm:px-5 text-xs sm:text-sm transition-colors ${
                  item.id === sourceUnit
                    ? 'bg-blue-50/70 dark:bg-blue-950/30'
                    : 'hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40'
                }`}
              >
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <span className="text-xs font-mono text-neutral-400">({item.abbr})</span>
                    {item.type === 'approx' && (
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                        Approx
                      </span>
                    )}
                  </div>
                  {item.note && (
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {item.note}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    data-action={item.id === sourceUnit ? 'output' : undefined}
                    className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 select-all"
                  >
                    {item.formatted}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.formatted, item.id, item.name)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    title={`Copy ${item.formatted} ${item.abbr}`}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
