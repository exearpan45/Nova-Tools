import React, { useState, useMemo } from 'react';
import { Calendar, Cake, Clock, RotateCcw } from 'lucide-react';

export const AgeCalculatorTool: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(todayStr);

  const calculation = useMemo(() => {
    if (!birthDate) return { error: 'Please choose your date of birth.' };

    const birth = new Date(birthDate + 'T00:00:00');
    const target = new Date(targetDate + 'T00:00:00');

    if (isNaN(birth.getTime())) return { error: 'Invalid birth date entered.' };
    if (isNaN(target.getTime())) return { error: 'Invalid reference date entered.' };

    if (birth > target) {
      return { error: 'Birth date cannot be in the future relative to the reference date.' };
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in the previous month of target
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total stats
    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday calculation
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilNextBday = Math.ceil(
      (nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
    );
    const nextBdayDayName = nextBday.toLocaleDateString(undefined, { weekday: 'long' });

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysUntilNextBday,
      nextBdayDayName,
      error: null
    };
  }, [birthDate, targetDate]);

  const handleReset = () => {
    setBirthDate('2000-01-01');
    setTargetDate(todayStr);
  };

  return (
    <div className="space-y-6">
      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dob-input" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Date of Birth
          </label>
          <input
            id="dob-input"
            type="date"
            max={targetDate}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="ref-date-input" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Calculate Age As Of
          </label>
          <input
            id="ref-date-input"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {calculation.error ? (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs">
          {calculation.error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Hero Result */}
          <div className="p-6 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/50 text-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
              Current Chronological Age
            </span>
            <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 mt-2 font-mono">
              <div>
                <span className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {calculation.years}
                </span>
                <span className="ml-1 text-sm text-neutral-500 font-sans">years</span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {calculation.months}
                </span>
                <span className="ml-1 text-sm text-neutral-500 font-sans">months</span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {calculation.days}
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
                {calculation.daysUntilNextBday === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400">Happy Birthday today! 🎂</span>
                ) : (
                  <span>
                    In <span className="font-mono">{calculation.daysUntilNextBday}</span> days
                  </span>
                )}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Occurs on a {calculation.nextBdayDayName}
              </p>
            </div>

            {/* Lifetime totals */}
            <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-800/40">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Lifetime Totals</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {calculation.totalDays?.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-sans">days</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {calculation.totalWeeks?.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-sans">weeks</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {calculation.totalHours?.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-sans">hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={handleReset}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
