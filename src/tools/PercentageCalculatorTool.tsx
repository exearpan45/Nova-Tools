import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export const PercentageCalculatorTool: React.FC = () => {
  // Scenario 1: What is X% of Y?
  const [p1X, setP1X] = useState<string>('15');
  const [p1Y, setP1Y] = useState<string>('200');

  // Scenario 2: What % is X of Y?
  const [p2X, setP2X] = useState<string>('25');
  const [p2Y, setP2Y] = useState<string>('100');

  // Scenario 3: Percentage Increase / Decrease from X to Y
  const [p3Initial, setP3Initial] = useState<string>('50');
  const [p3Final, setP3Final] = useState<string>('75');

  // Scenario 4: Percentage Difference between X and Y
  const [p4A, setP4A] = useState<string>('80');
  const [p4B, setP4B] = useState<string>('100');

  // Calculation 1
  const calc1Result = React.useMemo(() => {
    const x = parseFloat(p1X);
    const y = parseFloat(p1Y);
    if (isNaN(x) || isNaN(y)) return null;
    return (x / 100) * y;
  }, [p1X, p1Y]);

  // Calculation 2
  const calc2Result = React.useMemo(() => {
    const x = parseFloat(p2X);
    const y = parseFloat(p2Y);
    if (isNaN(x) || isNaN(y) || y === 0) return null;
    return (x / y) * 100;
  }, [p2X, p2Y]);

  // Calculation 3
  const calc3Result = React.useMemo(() => {
    const init = parseFloat(p3Initial);
    const fin = parseFloat(p3Final);
    if (isNaN(init) || isNaN(fin) || init === 0) return null;
    const diff = fin - init;
    const pct = (diff / Math.abs(init)) * 100;
    return {
      percent: Math.abs(pct),
      isIncrease: diff >= 0,
      diff
    };
  }, [p3Initial, p3Final]);

  // Calculation 4
  const calc4Result = React.useMemo(() => {
    const a = parseFloat(p4A);
    const b = parseFloat(p4B);
    if (isNaN(a) || isNaN(b)) return null;
    const avg = (a + b) / 2;
    if (avg === 0) return 0;
    return (Math.abs(a - b) / Math.abs(avg)) * 100;
  }, [p4A, p4B]);

  const handleReset = () => {
    setP1X('');
    setP1Y('');
    setP2X('');
    setP2Y('');
    setP3Initial('');
    setP3Final('');
    setP4A('');
    setP4B('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario 1: What is X% of Y? */}
        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            What is X% of Y?
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">What is</span>
            <div className="relative inline-block w-24">
              <input
                type="number"
                value={p1X}
                onChange={(e) => setP1X(e.target.value)}
                placeholder="15"
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="absolute right-2 top-2 text-xs text-neutral-400">%</span>
            </div>
            <span className="text-neutral-600 dark:text-neutral-400">of</span>
            <input
              type="number"
              value={p1Y}
              onChange={(e) => setP1Y(e.target.value)}
              placeholder="200"
              className="w-28 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-neutral-600 dark:text-neutral-400">?</span>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Result</span>
            <span className="text-lg font-semibold font-mono text-blue-600 dark:text-blue-400">
              {calc1Result !== null ? Number(calc1Result.toFixed(4)) : '—'}
            </span>
          </div>
        </div>

        {/* Scenario 2: What % is X of Y? */}
        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            What % is X of Y?
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <input
              type="number"
              value={p2X}
              onChange={(e) => setP2X(e.target.value)}
              placeholder="25"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-neutral-600 dark:text-neutral-400">is what % of</span>
            <input
              type="number"
              value={p2Y}
              onChange={(e) => setP2Y(e.target.value)}
              placeholder="100"
              className="w-28 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-neutral-600 dark:text-neutral-400">?</span>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Result</span>
            <span className="text-lg font-semibold font-mono text-blue-600 dark:text-blue-400">
              {calc2Result !== null ? `${Number(calc2Result.toFixed(2))}%` : '—'}
            </span>
          </div>
        </div>

        {/* Scenario 3: Percentage Increase or Decrease */}
        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            Percentage Increase / Decrease
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">From</span>
            <input
              type="number"
              value={p3Initial}
              onChange={(e) => setP3Initial(e.target.value)}
              placeholder="50"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-neutral-600 dark:text-neutral-400">to</span>
            <input
              type="number"
              value={p3Final}
              onChange={(e) => setP3Final(e.target.value)}
              placeholder="75"
              className="w-28 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Change</span>
            <span
              className={`text-lg font-semibold font-mono ${
                calc3Result
                  ? calc3Result.isIncrease
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                  : 'text-neutral-400'
              }`}
            >
              {calc3Result !== null
                ? `${calc3Result.isIncrease ? '+' : '-'}${Number(calc3Result.percent.toFixed(2))}% (${calc3Result.isIncrease ? 'Increase' : 'Decrease'})`
                : '—'}
            </span>
          </div>
        </div>

        {/* Scenario 4: Percentage Difference */}
        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            Percentage Difference
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Difference between</span>
            <input
              type="number"
              value={p4A}
              onChange={(e) => setP4A(e.target.value)}
              placeholder="80"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-neutral-600 dark:text-neutral-400">and</span>
            <input
              type="number"
              value={p4B}
              onChange={(e) => setP4B(e.target.value)}
              placeholder="100"
              className="w-28 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Difference</span>
            <span className="text-lg font-semibold font-mono text-blue-600 dark:text-blue-400">
              {calc4Result !== null ? `${Number(calc4Result.toFixed(2))}%` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
