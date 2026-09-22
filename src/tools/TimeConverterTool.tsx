import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

interface TimeUnit {
  id: string;
  name: string;
  seconds: number;
}

const TIME_UNITS: TimeUnit[] = [
  { id: 'ms', name: 'Milliseconds', seconds: 0.001 },
  { id: 's', name: 'Seconds', seconds: 1 },
  { id: 'min', name: 'Minutes', seconds: 60 },
  { id: 'hr', name: 'Hours', seconds: 3600 },
  { id: 'day', name: 'Days', seconds: 86400 },
  { id: 'wk', name: 'Weeks', seconds: 604800 },
  { id: 'mo', name: 'Months (average ~30.44 days)', seconds: 2629800 },
  { id: 'yr', name: 'Years (365.25 days)', seconds: 31557600 },
];

export const TimeConverterTool: React.FC = () => {
  const [value, setValue] = useState<string>('24');
  const [sourceUnit, setSourceUnit] = useState<string>('hr');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const conversions = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return [];

    const src = TIME_UNITS.find((u) => u.id === sourceUnit);
    if (!src) return [];

    const totalSeconds = num * src.seconds;

    return TIME_UNITS.map((unit) => {
      const converted = totalSeconds / unit.seconds;
      let formatted: string;
      if (converted >= 1e8 || (converted > 0 && converted < 1e-4)) {
        formatted = converted.toExponential(4);
      } else {
        formatted = Number(converted.toFixed(6)).toString();
      }
      return {
        ...unit,
        formatted
      };
    });
  }, [value, sourceUnit]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Input */}
      <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Time value"
          className="w-full sm:w-36 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={sourceUnit}
          onChange={(e) => setSourceUnit(e.target.value)}
          className="w-full sm:flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {TIME_UNITS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* Breakdown List */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-[#18181b]">
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {conversions.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 sm:px-4 text-xs sm:text-sm transition-colors ${
                item.id === sourceUnit
                  ? 'bg-blue-50/50 dark:bg-blue-950/20'
                  : 'hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40'
              }`}
            >
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {item.name}
              </span>

              <div className="flex items-center gap-3">
                <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                  {item.formatted}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(item.formatted, item.id)}
                  className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  title="Copy value"
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
      </div>
    </div>
  );
};
