import React, { useState, useMemo } from 'react';
import { Calendar, Cake, Clock, RotateCcw, AlertCircle, Info } from 'lucide-react';

function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function getDaysInMonth(y: number, m: number): number {
  if (m === 2) return isLeapYear(y) ? 29 : 28;
  if ([4, 6, 9, 11].includes(m)) return 30;
  return 31;
}

function parseDateOnly(str: string): { y: number; m: number; d: number } | null {
  if (!str) return null;
  const parts = str.split('-').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [y, m, d] = parts;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > getDaysInMonth(y, m)) return null;
  return { y, m, d };
}

export type AgeCalculationResult =
  | { error: string; isLeapBirth?: boolean }
  | {
      error: null;
      years: number;
      months: number;
      days: number;
      totalDays: number;
      totalWeeks: number;
      totalHours: number;
      daysUntilNextBday: number;
      nextBdayDayName: string;
      isLeapBirth: boolean;
    };

export const AgeCalculatorTool: React.FC = () => {
  const getTodayLocalDateStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [birthDateStr, setBirthDateStr] = useState<string>('2000-01-01');
  const [targetDateStr, setTargetDateStr] = useState<string>(getTodayLocalDateStr);
  const [leapPolicy, setLeapPolicy] = useState<'feb28' | 'mar1'>('feb28');

  const calculation: AgeCalculationResult = useMemo(() => {
    if (!birthDateStr.trim()) return { error: 'Please select a date of birth.' };
    if (!targetDateStr.trim()) return { error: 'Please select an as-of reference date.' };

    const b = parseDateOnly(birthDateStr);
    const t = parseDateOnly(targetDateStr);

    if (!b) return { error: 'Invalid birth date entered. Please check year, month, and day.' };
    if (!t) return { error: 'Invalid reference date entered. Please check year, month, and day.' };

    const isLeapBirth = b.m === 2 && b.d === 29;

    // Check if birth is in the future
    const utcBirth = Date.UTC(b.y, b.m - 1, b.d);
    const utcTarget = Date.UTC(t.y, t.m - 1, t.d);

    if (utcBirth > utcTarget) {
      return { error: 'Birth date cannot be in the future relative to the reference date.', isLeapBirth };
    }

    // Chronological Age
    let years = t.y - b.y;
    let months = t.m - b.m;
    let days = t.d - b.d;

    if (days < 0) {
      months -= 1;
      let prevM = t.m - 1;
      let prevY = t.y;
      if (prevM < 1) {
        prevM = 12;
        prevY -= 1;
      }
      days += getDaysInMonth(prevY, prevM);
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Lifetime Totals
    const diffMs = utcTarget - utcBirth;
    const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next Birthday calculation
    const getBdayMonthDay = (targetYear: number): { m: number; d: number } => {
      if (isLeapBirth && !isLeapYear(targetYear)) {
        return leapPolicy === 'feb28' ? { m: 2, d: 28 } : { m: 3, d: 1 };
      }
      return { m: b.m, d: b.d };
    };

    // Candidate birthday this year
    let nextBdayYear = t.y;
    let bdayMD = getBdayMonthDay(nextBdayYear);
    let utcBdayThisYear = Date.UTC(nextBdayYear, bdayMD.m - 1, bdayMD.d);

    if (utcBdayThisYear < utcTarget) {
      nextBdayYear = t.y + 1;
      bdayMD = getBdayMonthDay(nextBdayYear);
      utcBdayThisYear = Date.UTC(nextBdayYear, bdayMD.m - 1, bdayMD.d);
    }

    const daysUntilNextBday = Math.round((utcBdayThisYear - utcTarget) / (1000 * 60 * 60 * 24));
    const nextBdayDateObj = new Date(utcBdayThisYear);
    const nextBdayDayName = nextBdayDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'UTC'
    });

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysUntilNextBday,
      nextBdayDayName,
      isLeapBirth,
      error: null
    };
  }, [birthDateStr, targetDateStr, leapPolicy]);

  const handleReset = () => {
    setBirthDateStr('2000-01-01');
    setTargetDateStr(getTodayLocalDateStr());
    setLeapPolicy('feb28');
  };

  const validCalc = calculation.error === null ? calculation : null;

  return (
    <div className="space-y-6">
      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dob-input" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Date of Birth
          </label>
          <input
            id="dob-input"
            type="date"
            max={targetDateStr}
            value={birthDateStr}
            onChange={(e) => setBirthDateStr(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>

        <div>
          <label htmlFor="ref-date-input" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Calculate Age As Of
          </label>
          <input
            id="ref-date-input"
            type="date"
            value={targetDateStr}
            onChange={(e) => setTargetDateStr(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Leap year policy toggle if born on Feb 29 */}
      {calculation.isLeapBirth && (
        <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>Feb 29 Leap Day Birthday in common years observed on:</span>
          </div>
          <div className="flex items-center bg-white dark:bg-neutral-800 rounded-lg p-0.5 border border-blue-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => setLeapPolicy('feb28')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                leapPolicy === 'feb28'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Feb 28
            </button>
            <button
              type="button"
              onClick={() => setLeapPolicy('mar1')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                leapPolicy === 'mar1'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Mar 1
            </button>
          </div>
        </div>
      )}

      {calculation.error ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{calculation.error}</span>
        </div>
      ) : validCalc ? (
        <div className="space-y-6 animate-result-in">
          {/* Main Hero Result */}
          <div className="p-6 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 text-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
              Chronological Age
            </span>
            <div
              data-action="output"
              className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 mt-2 font-mono"
            >
              <div>
                <span className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {validCalc.years}
                </span>
                <span className="ml-1 text-sm text-neutral-500 font-sans">years</span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {validCalc.months}
                </span>
                <span className="ml-1 text-sm text-neutral-500 font-sans">months</span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {validCalc.days}
                </span>
                <span className="ml-1 text-sm text-neutral-500 font-sans">days</span>
              </div>
            </div>
          </div>

          {/* Next Birthday & Lifetime Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Next Birthday Card */}
            <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-800/40">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Cake className="w-3.5 h-3.5 text-blue-500" />
                <span>Next Birthday</span>
              </div>
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {validCalc.daysUntilNextBday === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Happy Birthday today! 🎂</span>
                ) : validCalc.daysUntilNextBday === 1 ? (
                  <span className="text-blue-600 dark:text-blue-400">Tomorrow! 🎈</span>
                ) : (
                  <span>
                    In <span className="font-mono">{validCalc.daysUntilNextBday}</span> days
                  </span>
                )}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Occurs on a {validCalc.nextBdayDayName}
              </p>
            </div>

            {/* Lifetime totals */}
            <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-800/40">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Total Time Lived</span>
              </div>
              <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-300 font-mono">
                <div>
                  <strong className="text-neutral-900 dark:text-neutral-100">
                    {validCalc.totalDays.toLocaleString()}
                  </strong>{' '}
                  days
                </div>
                <div>
                  <strong className="text-neutral-900 dark:text-neutral-100">
                    {validCalc.totalWeeks.toLocaleString()}
                  </strong>{' '}
                  weeks
                </div>
                <div>
                  <strong className="text-neutral-900 dark:text-neutral-100">
                    {validCalc.totalHours.toLocaleString()}
                  </strong>{' '}
                  hours
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end pt-2">
        <button
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
