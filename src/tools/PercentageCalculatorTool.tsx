import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export const PercentageCalculatorTool: React.FC = () => {
  // Scenario 1: What is X% of Y?
  const [p1X, setP1X] = useState<string>('20');
  const [p1Y, setP1Y] = useState<string>('500');

  // Scenario 2: What % is X of Y?
  const [p2X, setP2X] = useState<string>('100');
  const [p2Y, setP2Y] = useState<string>('500');

  // Scenario 3: Percentage Increase / Decrease from X to Y
  const [p3Initial, setP3Initial] = useState<string>('500');
  const [p3Final, setP3Final] = useState<string>('600');

  // Scenario 4: Percentage Difference between X and Y
  const [p4A, setP4A] = useState<string>('80');
  const [p4B, setP4B] = useState<string>('100');

  // Scenario 5: Find Original Value (X is Y% of what?)
  const [p5Val, setP5Val] = useState<string>('100');
  const [p5Pct, setP5Pct] = useState<string>('20');

  // Calculation 1: What is X% of Y?
  const calc1Result = React.useMemo(() => {
    if (!p1X.trim() || !p1Y.trim()) return { val: null, error: null };
    const x = parseFloat(p1X);
    const y = parseFloat(p1Y);
    if (isNaN(x) || isNaN(y)) return { val: null, error: 'Please enter valid numbers' };
    const res = (x / 100) * y;
    return { val: Number(res.toFixed(6)), error: null };
  }, [p1X, p1Y]);

  // Calculation 2: What % is X of Y?
  const calc2Result = React.useMemo(() => {
    if (!p2X.trim() || !p2Y.trim()) return { val: null, error: null };
    const x = parseFloat(p2X);
    const y = parseFloat(p2Y);
    if (isNaN(x) || isNaN(y)) return { val: null, error: 'Please enter valid numbers' };
    if (y === 0) return { val: null, error: 'Base value (Y) cannot be zero (division by zero)' };
    const res = (x / y) * 100;
    return { val: Number(res.toFixed(6)), error: null };
  }, [p2X, p2Y]);

  // Calculation 3: Percentage Increase / Decrease from X to Y
  const calc3Result = React.useMemo(() => {
    if (!p3Initial.trim() || !p3Final.trim()) return { val: null, error: null, changeType: '' };
    const init = parseFloat(p3Initial);
    const fin = parseFloat(p3Final);
    if (isNaN(init) || isNaN(fin)) return { val: null, error: 'Please enter valid numbers', changeType: '' };
    if (init === 0) return { val: null, error: 'Initial starting value cannot be zero (undefined percentage change)', changeType: '' };

    const diff = fin - init;
    if (diff === 0) {
      return { val: 0, error: null, changeType: 'No change (0%)' };
    }
    const pct = (diff / Math.abs(init)) * 100;
    const isIncrease = diff > 0;
    return {
      val: Math.abs(Number(pct.toFixed(6))),
      error: null,
      changeType: isIncrease ? 'Increase' : 'Decrease',
      isIncrease
    };
  }, [p3Initial, p3Final]);

  // Calculation 4: Percentage Difference between X and Y
  const calc4Result = React.useMemo(() => {
    if (!p4A.trim() || !p4B.trim()) return { val: null, error: null };
    const a = parseFloat(p4A);
    const b = parseFloat(p4B);
    if (isNaN(a) || isNaN(b)) return { val: null, error: 'Please enter valid numbers' };
    const avg = (a + b) / 2;
    if (avg === 0) {
      if (a === 0 && b === 0) return { val: 0, error: null };
      return { val: null, error: 'Average of values is zero (undefined percentage difference)' };
    }
    const res = (Math.abs(a - b) / Math.abs(avg)) * 100;
    return { val: Number(res.toFixed(6)), error: null };
  }, [p4A, p4B]);

  // Calculation 5: Original value from percentage
  const calc5Result = React.useMemo(() => {
    if (!p5Val.trim() || !p5Pct.trim()) return { val: null, error: null };
    const val = parseFloat(p5Val);
    const pct = parseFloat(p5Pct);
    if (isNaN(val) || isNaN(pct)) return { val: null, error: 'Please enter valid numbers' };
    if (pct === 0) return { val: null, error: 'Percentage cannot be 0% when finding original value' };
    const original = val / (pct / 100);
    return { val: Number(original.toFixed(6)), error: null };
  }, [p5Val, p5Pct]);

  const handleReset = () => {
    setP1X('');
    setP1Y('');
    setP2X('');
    setP2Y('');
    setP3Initial('');
    setP3Final('');
    setP4A('');
    setP4B('');
    setP5Val('');
    setP5Pct('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Fast, accurate percentage calculations with zero division protection.
        </p>
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
            1. Percentage of a Number
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">What is</span>
            <div className="relative inline-block w-24">
              <input
                type="number"
                step="any"
                value={p1X}
                onChange={(e) => setP1X(e.target.value)}
                placeholder="20"
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
              <span className="absolute right-2 top-2 text-xs text-neutral-400">%</span>
            </div>
            <span className="text-neutral-600 dark:text-neutral-400">of</span>
            <input
              type="number"
              step="any"
              value={p1Y}
              onChange={(e) => setP1Y(e.target.value)}
              placeholder="500"
              className="w-28 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <span className="text-neutral-600 dark:text-neutral-400">?</span>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Result</span>
            {calc1Result.error ? (
              <span className="text-xs text-red-500 font-medium">{calc1Result.error}</span>
            ) : (
              <span className="text-lg font-semibold font-mono text-blue-600 dark:text-blue-400 animate-result-in">
                {calc1Result.val !== null ? calc1Result.val : '—'}
              </span>
            )}
          </div>
        </div>

        {/* Scenario 2: What % is X of Y? */}
        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            2. Percentage Proportion
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <input
              type="number"
              step="any"
              value={p2X}
              onChange={(e) => setP2X(e.target.value)}
              placeholder="100"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <span className="text-neutral-600 dark:text-neutral-400">is what % of</span>
            <input
              type="number"
              step="any"
              value={p2Y}
              onChange={(e) => setP2Y(e.target.value)}
              placeholder="500"
              className="w-28 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <span className="text-neutral-600 dark:text-neutral-400">?</span>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Result</span>
            {calc2Result.error ? (
              <span className="text-xs text-red-500 font-medium">{calc2Result.error}</span>
            ) : (
              <span className="text-lg font-semibold font-mono text-blue-600 dark:text-blue-400 animate-result-in">
                {calc2Result.val !== null ? `${calc2Result.val}%` : '—'}
              </span>
            )}
          </div>
        </div>

        {/* Scenario 3: Percentage Increase or Decrease */}
        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            3. Percentage Increase / Decrease
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">From</span>
            <input
              type="number"
              step="any"
              value={p3Initial}
              onChange={(e) => setP3Initial(e.target.value)}
              placeholder="500"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <span className="text-neutral-600 dark:text-neutral-400">to</span>
            <input
              type="number"
              step="any"
              value={p3Final}
              onChange={(e) => setP3Final(e.target.value)}
              placeholder="600"
              className="w-28 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Change</span>
            {calc3Result.error ? (
              <span className="text-xs text-red-500 font-medium">{calc3Result.error}</span>
            ) : calc3Result.val !== null ? (
              <span
                className={`text-lg font-semibold font-mono animate-result-in ${
                  calc3Result.val === 0
                    ? 'text-neutral-500'
                    : calc3Result.isIncrease
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {calc3Result.val === 0
                  ? '0% (No change)'
                  : `${calc3Result.isIncrease ? '+' : '-'}${calc3Result.val}% (${calc3Result.changeType})`}
              </span>
            ) : (
              <span className="text-neutral-400 font-mono">—</span>
            )}
          </div>
        </div>

        {/* Scenario 4: Percentage Difference */}
        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            4. Percentage Difference
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Difference between</span>
            <input
              type="number"
              step="any"
              value={p4A}
              onChange={(e) => setP4A(e.target.value)}
              placeholder="80"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <span className="text-neutral-600 dark:text-neutral-400">and</span>
            <input
              type="number"
              step="any"
              value={p4B}
              onChange={(e) => setP4B(e.target.value)}
              placeholder="100"
              className="w-28 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Difference</span>
            {calc4Result.error ? (
              <span className="text-xs text-red-500 font-medium">{calc4Result.error}</span>
            ) : (
              <span className="text-lg font-semibold font-mono text-blue-600 dark:text-blue-400 animate-result-in">
                {calc4Result.val !== null ? `${calc4Result.val}%` : '—'}
              </span>
            )}
          </div>
        </div>

        {/* Scenario 5: Find Original Value From Percentage */}
        <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 md:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            5. Find Original Value From Percentage (X is Y% of what?)
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">If</span>
            <input
              type="number"
              step="any"
              value={p5Val}
              onChange={(e) => setP5Val(e.target.value)}
              placeholder="100"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <span className="text-neutral-600 dark:text-neutral-400">is</span>
            <div className="relative inline-block w-24">
              <input
                type="number"
                step="any"
                value={p5Pct}
                onChange={(e) => setP5Pct(e.target.value)}
                placeholder="20"
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
              <span className="absolute right-2 top-2 text-xs text-neutral-400">%</span>
            </div>
            <span className="text-neutral-600 dark:text-neutral-400">of an original number, what is that number?</span>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Original Value</span>
            {calc5Result.error ? (
              <span className="text-xs text-red-500 font-medium">{calc5Result.error}</span>
            ) : (
              <span className="text-lg font-semibold font-mono text-emerald-600 dark:text-emerald-400 animate-result-in">
                {calc5Result.val !== null ? calc5Result.val : '—'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
