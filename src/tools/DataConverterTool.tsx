import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, Info, ArrowRight } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

interface DataUnitOption {
  id: string;
  name: string;
  abbr: string;
  bytes: number; // multiplier to bytes
  standard: 'Basic' | 'Binary (IEC 1024)' | 'Decimal (SI 1000)';
}

const ALL_DATA_UNITS: DataUnitOption[] = [
  // Basic
  { id: 'bit', name: 'Bits', abbr: 'b', bytes: 0.125, standard: 'Basic' },
  { id: 'b', name: 'Bytes', abbr: 'B', bytes: 1, standard: 'Basic' },

  // Binary IEC (1024)
  { id: 'kib', name: 'Kibibytes (IEC)', abbr: 'KiB', bytes: 1024, standard: 'Binary (IEC 1024)' },
  { id: 'mib', name: 'Mebibytes (IEC)', abbr: 'MiB', bytes: 1024 ** 2, standard: 'Binary (IEC 1024)' },
  { id: 'gib', name: 'Gibibytes (IEC)', abbr: 'GiB', bytes: 1024 ** 3, standard: 'Binary (IEC 1024)' },
  { id: 'tib', name: 'Tebibytes (IEC)', abbr: 'TiB', bytes: 1024 ** 4, standard: 'Binary (IEC 1024)' },
  { id: 'pib', name: 'Pebibytes (IEC)', abbr: 'PiB', bytes: 1024 ** 5, standard: 'Binary (IEC 1024)' },

  // Decimal SI (1000)
  { id: 'kb', name: 'Kilobytes (SI)', abbr: 'kB', bytes: 1000, standard: 'Decimal (SI 1000)' },
  { id: 'mb', name: 'Megabytes (SI)', abbr: 'MB', bytes: 1000 ** 2, standard: 'Decimal (SI 1000)' },
  { id: 'gb', name: 'Gigabytes (SI)', abbr: 'GB', bytes: 1000 ** 3, standard: 'Decimal (SI 1000)' },
  { id: 'tb', name: 'Terabytes (SI)', abbr: 'TB', bytes: 1000 ** 4, standard: 'Decimal (SI 1000)' },
  { id: 'pb', name: 'Petabytes (SI)', abbr: 'PB', bytes: 1000 ** 5, standard: 'Decimal (SI 1000)' },
];

function formatDataValue(val: number): string {
  if (val === 0) return '0';
  const abs = Math.abs(val);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-4)) {
    return val.toExponential(4);
  }
  // Up to 6 clean decimal places
  const rounded = Math.round(val * 1e6) / 1e6;
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

export const DataConverterTool: React.FC = () => {
  const { showToast } = useToast();
  const [value, setValue] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<string>('gib');
  const [filterMode, setFilterMode] = useState<'all' | 'binary' | 'decimal'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const numInput = parseFloat(value);
  const isValid = !isNaN(numInput) && value.trim() !== '' && numInput >= 0;

  const currentUnitDef = ALL_DATA_UNITS.find((u) => u.id === sourceUnit) || ALL_DATA_UNITS[4];

  // Calculate total bytes
  const totalBytes = isValid ? numInput * currentUnitDef.bytes : 0;

  const conversions = useMemo(() => {
    if (!isValid) return [];

    let filtered = ALL_DATA_UNITS;
    if (filterMode === 'binary') {
      filtered = ALL_DATA_UNITS.filter((u) => u.standard === 'Basic' || u.standard === 'Binary (IEC 1024)');
    } else if (filterMode === 'decimal') {
      filtered = ALL_DATA_UNITS.filter((u) => u.standard === 'Basic' || u.standard === 'Decimal (SI 1000)');
    }

    return filtered.map((unit) => {
      const converted = totalBytes / unit.bytes;
      return {
        ...unit,
        formatted: formatDataValue(converted),
        raw: converted,
      };
    });
  }, [totalBytes, isValid, filterMode]);

  const handleCopy = async (formattedVal: string, id: string, name: string) => {
    const ok = await copyToClipboard(formattedVal);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
      showToast(`Copied ${formattedVal} ${id.toUpperCase()}`, 'success');
      addScratchpadItem('data-converter', `${formattedVal} ${id.toUpperCase()}`, name);
    }
  };

  const handleReset = () => {
    setValue('1');
    setSourceUnit('gib');
    setFilterMode('all');
    showToast('Reset to 1 GiB default', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Input Configuration */}
      <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Input & Unit */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="w-36">
              <label htmlFor="data-amount-input" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Value
              </label>
              <input
                id="data-amount-input"
                type="number"
                min="0"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Amount"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="data-unit-select" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Input Unit
              </label>
              <select
                id="data-unit-select"
                value={sourceUnit}
                onChange={(e) => setSourceUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {ALL_DATA_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.abbr})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Standards Filter Toggle */}
          <div className="space-y-1">
            <span className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Show Units:
            </span>
            <div className="inline-flex p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/60">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                All Units
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('binary')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterMode === 'binary'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Binary standards based on powers of 1024 (KiB, MiB, GiB)"
              >
                Binary (1024)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('decimal')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  filterMode === 'decimal'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Decimal standards based on powers of 1000 (kB, MB, GB)"
              >
                Decimal (1000)
              </button>
            </div>
          </div>
        </div>

        {/* Informational Standard Explainer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-xs text-neutral-600 dark:text-neutral-400">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Standard Terminology Notice:</strong> <em>Binary units</em> (KiB, MiB, GiB, TiB) use base <strong>1024</strong> (defined by IEC 60027-2, standard in RAM and OS file sizing). <em>Decimal units</em> (kB, MB, GB, TB) use base <strong>1000</strong> (defined by SI, standard in hard drive & SSD marketing and networking).
          </div>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-[#18181b] animate-result-in">
        {!isValid ? (
          <div className="p-6 text-center text-xs text-neutral-400 italic">
            Enter a valid positive number to view storage conversions.
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
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      <span className="text-xs font-mono text-neutral-400">({item.abbr})</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      {item.standard}
                    </span>
                  </div>
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

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
