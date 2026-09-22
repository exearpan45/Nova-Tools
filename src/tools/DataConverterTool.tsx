import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface DataUnit {
  id: string;
  name: string;
  abbr: string;
  power: number;
}

const DATA_UNITS: DataUnit[] = [
  { id: 'b', name: 'Bytes', abbr: 'B', power: 0 },
  { id: 'kb', name: 'Kilobytes', abbr: 'KB', power: 1 },
  { id: 'mb', name: 'Megabytes', abbr: 'MB', power: 2 },
  { id: 'gb', name: 'Gigabytes', abbr: 'GB', power: 3 },
  { id: 'tb', name: 'Terabytes', abbr: 'TB', power: 4 },
  { id: 'pb', name: 'Petabytes', abbr: 'PB', power: 5 },
];

export const DataConverterTool: React.FC = () => {
  const [value, setValue] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<string>('gb');
  const [isBinary, setIsBinary] = useState<boolean>(true); // 1024 vs 1000
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const base = isBinary ? 1024 : 1000;

  const conversions = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return [];

    const src = DATA_UNITS.find((u) => u.id === sourceUnit);
    if (!src) return [];

    // Total in bytes
    const totalBytes = num * Math.pow(base, src.power);

    return DATA_UNITS.map((unit) => {
      const converted = totalBytes / Math.pow(base, unit.power);
      let formatted: string;
      if (converted >= 1e9 || (converted > 0 && converted < 1e-4)) {
        formatted = converted.toExponential(4);
      } else {
        formatted = Number(converted.toFixed(6)).toString();
      }
      return {
        ...unit,
        formatted
      };
    });
  }, [value, sourceUnit, base]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Input & Unit */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Amount"
            className="w-36 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={sourceUnit}
            onChange={(e) => setSourceUnit(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {DATA_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.abbr})
              </option>
            ))}
          </select>
        </div>

        {/* Mode Toggle: 1024 Binary vs 1000 Decimal */}
        <div className="inline-flex p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsBinary(true)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              isBinary
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Binary (1024)
          </button>
          <button
            type="button"
            onClick={() => setIsBinary(false)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              !isBinary
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Decimal (1000)
          </button>
        </div>
      </div>

      {/* Breakdown Table */}
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
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {item.name}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  ({item.abbr})
                </span>
              </div>

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
