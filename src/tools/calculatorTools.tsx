import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calculator as CalcIcon, Percent, Calendar, Activity, Tag, Thermometer,
  RotateCcw, Copy, Check, Clock, TrendingUp, Sparkles, Delete, ArrowRight
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { evaluateMathExpression } from '../utils/mathExpression';

interface CalcProps {
  toolSlug: string;
}

export const CalculatorTools: React.FC<CalcProps> = ({ toolSlug }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ================= 1. STANDARD & SCIENTIFIC ARITHMETIC CALCULATOR =================
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [calcHistory, setCalcHistory] = useState<{ expr: string; res: string }[]>([]);

  const handleCalcInput = useCallback((char: string) => {
    setCalcDisplay((prev) => {
      if (prev === '0' && !['+', '-', '*', '/', '.', '%'].includes(char)) {
        return char;
      }
      return prev + char;
    });
  }, []);

  const handleCalcClear = useCallback(() => {
    setCalcDisplay('0');
  }, []);

  const handleCalcBackspace = useCallback(() => {
    setCalcDisplay((prev) => {
      if (prev.length <= 1 || prev === 'Error') return '0';
      return prev.slice(0, -1);
    });
  }, []);

  const handleCalcEquals = useCallback(() => {
    setCalcDisplay((prev) => {
      const res = evaluateMathExpression(prev);
      if (res.success) {
        const out = String(res.result);
        setCalcHistory((h) => [{ expr: prev, res: out }, ...h.slice(0, 9)]);
        return out;
      }
      return 'Error';
    });
  }, []);

  // Keyboard navigation for calculator
  useEffect(() => {
    if (toolSlug !== 'calculator') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '(', ')', '%'].includes(e.key)) {
        e.preventDefault();
        handleCalcInput(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalcEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleCalcBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCalcClear();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toolSlug, handleCalcInput, handleCalcEquals, handleCalcBackspace, handleCalcClear]);

  // ================= 2. PERCENTAGE CALCULATOR STATES =================
  const [pctMode, setPctMode] = useState<'of' | 'isWhat' | 'change' | 'diff'>('of');
  const [pctX, setPctX] = useState<number>(20);
  const [pctY, setPctY] = useState<number>(150);

  const percentageResult = useMemo(() => {
    if (pctMode === 'of') {
      const ans = (pctX / 100) * pctY;
      return { label: `${pctX}% of ${pctY}`, value: `${ans}`, note: `Formula: (${pctX} ÷ 100) × ${pctY} = ${ans}` };
    }
    if (pctMode === 'isWhat') {
      if (pctY === 0) return { label: 'Cannot divide by zero', value: 'N/A', note: '' };
      const ans = (pctX / pctY) * 100;
      return { label: `${pctX} as a percentage of ${pctY}`, value: `${ans.toFixed(2)}%`, note: `Formula: (${pctX} ÷ ${pctY}) × 100 = ${ans.toFixed(2)}%` };
    }
    if (pctMode === 'change') {
      if (pctX === 0) return { label: 'Initial value cannot be zero', value: 'N/A', note: '' };
      const delta = pctY - pctX;
      const change = (delta / Math.abs(pctX)) * 100;
      const isUp = change >= 0;
      return {
        label: `${isUp ? 'Increase' : 'Decrease'} from ${pctX} to ${pctY}`,
        value: `${isUp ? '+' : ''}${change.toFixed(2)}% (${delta >= 0 ? '+' : ''}${delta})`,
        note: `Change = ((${pctY} - ${pctX}) ÷ |${pctX}|) × 100`,
        isUp
      };
    }
    // diff
    const avg = (Math.abs(pctX) + Math.abs(pctY)) / 2;
    if (avg === 0) return { label: 'Values cannot both be zero', value: '0%', note: '' };
    const diff = (Math.abs(pctX - pctY) / avg) * 100;
    return { label: `Difference between ${pctX} and ${pctY}`, value: `${diff.toFixed(2)}%`, note: `Formula: (|${pctX} - ${pctY}| ÷ Average) × 100` };
  }, [pctMode, pctX, pctY]);

  // ================= 3. AGE CALCULATOR STATES =================
  const [dob, setDob] = useState<string>('2000-01-15');
  const [asOfDate, setAsOfDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const ageData = useMemo(() => {
    const birth = new Date(dob);
    const target = new Date(asOfDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || target < birth) {
      return null;
    }
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next birthday calculation
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const daysUntilBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    const dayOfWeek = birth.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      years, months, days, totalDays, totalHours, totalMinutes, daysUntilBday, dayOfWeek
    };
  }, [dob, asOfDate]);

  // ================= 4. BMI CALCULATOR STATES =================
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmiWeight, setBmiWeight] = useState<number>(70);
  const [bmiHeight, setBmiHeight] = useState<number>(175);

  const bmiCalc = useMemo(() => {
    let bmi = 0;
    if (bmiUnit === 'metric') {
      const hM = bmiHeight / 100;
      bmi = hM > 0 ? bmiWeight / (hM * hM) : 0;
    } else {
      bmi = bmiHeight > 0 ? (bmiWeight / (bmiHeight * bmiHeight)) * 703 : 0;
    }
    let cat = 'Normal Weight';
    let color = 'text-emerald-500';
    let badgeColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    if (bmi < 18.5) {
      cat = 'Underweight';
      color = 'text-sky-400';
      badgeColor = 'bg-sky-500/10 border-sky-500/20 text-sky-400';
    } else if (bmi >= 25 && bmi < 30) {
      cat = 'Overweight';
      color = 'text-amber-400';
      badgeColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    } else if (bmi >= 30) {
      cat = 'Obese';
      color = 'text-rose-400';
      badgeColor = 'bg-rose-500/10 border-rose-500/20 text-rose-400';
    }
    return { bmi: bmi.toFixed(1), category: cat, color, badgeColor };
  }, [bmiWeight, bmiHeight, bmiUnit]);

  // ================= 5. DISCOUNT CALCULATOR =================
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [taxPercent, setTaxPercent] = useState<number>(8);

  const discountCalc = useMemo(() => {
    const discountAmount = (originalPrice * discountPercent) / 100;
    const discountedPrice = originalPrice - discountAmount;
    const taxAmount = (discountedPrice * taxPercent) / 100;
    const finalTotal = discountedPrice + taxAmount;
    return { discountAmount, discountedPrice, taxAmount, finalTotal };
  }, [originalPrice, discountPercent, taxPercent]);

  // ================= 6. TEMPERATURE CONVERTER =================
  const [celsius, setCelsius] = useState<number>(25);

  const tempValues = useMemo(() => {
    const fahrenheit = (celsius * 9) / 5 + 32;
    const kelvin = celsius + 273.15;
    return {
      c: celsius,
      f: parseFloat(fahrenheit.toFixed(2)),
      k: parseFloat(kelvin.toFixed(2))
    };
  }, [celsius]);

  // ================= 7. GST CALCULATOR =================
  const [gstAmount, setGstAmount] = useState<number>(5000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  const gstCalc = useMemo(() => {
    const rate = Math.max(0, gstRate);
    const amount = Math.max(0, gstAmount);
    if (gstType === 'exclusive') {
      const gstVal = (amount * rate) / 100;
      const total = amount + gstVal;
      return {
        netAmount: amount,
        gstAmount: gstVal,
        cgst: gstVal / 2,
        sgst: gstVal / 2,
        totalAmount: total,
      };
    } else {
      const net = amount / (1 + rate / 100);
      const gstVal = amount - net;
      return {
        netAmount: net,
        gstAmount: gstVal,
        cgst: gstVal / 2,
        sgst: gstVal / 2,
        totalAmount: amount,
      };
    }
  }, [gstAmount, gstRate, gstType]);

  // ================= 8. EMI CALCULATOR =================
  const [emiPrincipal, setEmiPrincipal] = useState<number>(100000);
  const [emiRate, setEmiRate] = useState<number>(8.5);
  const [emiTenureMonths, setEmiTenureMonths] = useState<number>(24);

  const emiCalc = useMemo(() => {
    const p = Math.max(0, emiPrincipal);
    const r = (Math.max(0, emiRate) / 12) / 100;
    const n = Math.max(1, emiTenureMonths);
    if (r === 0) {
      const emi = p / n;
      return { monthlyEmi: emi, totalInterest: 0, totalPayment: p };
    }
    const factor = Math.pow(1 + r, n);
    const monthlyEmi = (p * r * factor) / (factor - 1);
    const totalPayment = monthlyEmi * n;
    const totalInterest = totalPayment - p;
    return { monthlyEmi, totalInterest, totalPayment };
  }, [emiPrincipal, emiRate, emiTenureMonths]);

  // ================= 9. DATE DIFFERENCE CALCULATOR =================
  const [dateStart, setDateStart] = useState<string>('2026-01-01');
  const [dateEnd, setDateEnd] = useState<string>(new Date().toISOString().split('T')[0]);

  const dateDiffCalc = useMemo(() => {
    const d1 = new Date(dateStart);
    const d2 = new Date(dateEnd);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return null;
    }
    const [early, late] = d1 < d2 ? [d1, d2] : [d2, d1];
    const diffTime = late.getTime() - early.getTime();
    const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Count business days
    let businessDays = 0;
    const cur = new Date(early);
    while (cur < late) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) businessDays++;
      cur.setDate(cur.getDate() + 1);
    }

    return { totalDays, weeks, remainingDays, businessDays, isSame: totalDays === 0 };
  }, [dateStart, dateEnd]);

  // ================= 10. ROMAN NUMERAL CONVERTER =================
  const [romanInput, setRomanInput] = useState<string>('2026');
  const romanOutput = useMemo(() => {
    const str = romanInput.trim().toUpperCase();
    if (!str) return '';

    // If numeric, convert to Roman
    if (/^\d+$/.test(str)) {
      let num = parseInt(str, 10);
      if (num <= 0 || num > 3999) return 'Enter a number between 1 and 3999';
      const map: [number, string][] = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
      ];
      let res = '';
      for (const [val, roman] of map) {
        while (num >= val) {
          res += roman;
          num -= val;
        }
      }
      return res;
    }

    // Convert Roman to Integer
    const romanMap: Record<string, number> = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
    };
    if (!/^[IVXLCDM]+$/.test(str)) return 'Invalid Roman numeral characters';
    let total = 0;
    for (let i = 0; i < str.length; i++) {
      const cur = romanMap[str[i]] || 0;
      const next = romanMap[str[i + 1]] || 0;
      if (cur < next) {
        total -= cur;
      } else {
        total += cur;
      }
    }
    return String(total);
  }, [romanInput]);

  return (
    <div className="space-y-6">
      {/* 1. INTERACTIVE ARITHMETIC / EXPRESSION CALCULATOR */}
      {toolSlug === 'calculator' && (
        <div className="max-w-md mx-auto p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] shadow-xl space-y-4">
          {/* Display screen */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-right space-y-1 text-white overflow-hidden shadow-inner">
            <div className="text-xs text-slate-400 font-mono tracking-wider h-5 truncate select-none">
              {calcHistory[0] ? `${calcHistory[0].expr} =` : 'Standard Expression'}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#00D9FF] truncate select-all">
              {calcDisplay}
            </div>
          </div>

          {/* Calculator Keypad */}
          <div className="grid grid-cols-4 gap-2 font-mono text-sm">
            <button
              onClick={handleCalcClear}
              className="p-3.5 rounded-xl font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 border border-rose-500/30 transition-all active:scale-95"
            >
              AC
            </button>
            <button
              onClick={() => handleCalcInput('(')}
              className="p-3.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all active:scale-95"
            >
              (
            </button>
            <button
              onClick={() => handleCalcInput(')')}
              className="p-3.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all active:scale-95"
            >
              )
            </button>
            <button
              onClick={() => handleCalcInput('/')}
              className="p-3.5 rounded-xl font-bold bg-[#7657FF]/15 hover:bg-[#7657FF]/25 text-[#7657FF] border border-[#7657FF]/30 transition-all active:scale-95"
            >
              ÷
            </button>

            {['7', '8', '9'].map((n) => (
              <button
                key={n}
                onClick={() => handleCalcInput(n)}
                className="p-3.5 rounded-xl font-semibold bg-white dark:bg-[#16213A] hover:bg-slate-100 dark:hover:bg-[#1c2a4a] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 transition-all active:scale-95"
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => handleCalcInput('*')}
              className="p-3.5 rounded-xl font-bold bg-[#7657FF]/15 hover:bg-[#7657FF]/25 text-[#7657FF] border border-[#7657FF]/30 transition-all active:scale-95"
            >
              ×
            </button>

            {['4', '5', '6'].map((n) => (
              <button
                key={n}
                onClick={() => handleCalcInput(n)}
                className="p-3.5 rounded-xl font-semibold bg-white dark:bg-[#16213A] hover:bg-slate-100 dark:hover:bg-[#1c2a4a] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 transition-all active:scale-95"
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => handleCalcInput('-')}
              className="p-3.5 rounded-xl font-bold bg-[#7657FF]/15 hover:bg-[#7657FF]/25 text-[#7657FF] border border-[#7657FF]/30 transition-all active:scale-95"
            >
              -
            </button>

            {['1', '2', '3'].map((n) => (
              <button
                key={n}
                onClick={() => handleCalcInput(n)}
                className="p-3.5 rounded-xl font-semibold bg-white dark:bg-[#16213A] hover:bg-slate-100 dark:hover:bg-[#1c2a4a] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 transition-all active:scale-95"
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => handleCalcInput('+')}
              className="p-3.5 rounded-xl font-bold bg-[#7657FF]/15 hover:bg-[#7657FF]/25 text-[#7657FF] border border-[#7657FF]/30 transition-all active:scale-95"
            >
              +
            </button>

            <button
              onClick={() => handleCalcInput('0')}
              className="p-3.5 rounded-xl font-semibold bg-white dark:bg-[#16213A] hover:bg-slate-100 dark:hover:bg-[#1c2a4a] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 transition-all active:scale-95"
            >
              0
            </button>
            <button
              onClick={() => handleCalcInput('.')}
              className="p-3.5 rounded-xl font-semibold bg-white dark:bg-[#16213A] hover:bg-slate-100 dark:hover:bg-[#1c2a4a] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 transition-all active:scale-95"
            >
              .
            </button>
            <button
              onClick={handleCalcBackspace}
              className="p-3.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all active:scale-95"
              title="Backspace"
            >
              ⌫
            </button>
            <button
              onClick={handleCalcEquals}
              className="p-3.5 rounded-xl font-bold bg-gradient-to-r from-[#7657FF] to-[#00D9FF] text-white shadow-md hover:opacity-95 transition-all active:scale-95"
            >
              =
            </button>
          </div>

          {/* Quick history strip */}
          {calcHistory.length > 0 && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Recent Calculations (Click to recall):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {calcHistory.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCalcDisplay(item.res)}
                    className="px-2 py-1 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-[#00D9FF] border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {item.expr} = <strong className="text-[#00D9FF]">{item.res}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PERCENTAGE CALCULATOR */}
      {toolSlug === 'percentage-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          {/* Mode Switcher */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'of', label: 'What is X% of Y?' },
              { id: 'isWhat', label: 'X is what % of Y?' },
              { id: 'change', label: '% Increase / Decrease' },
              { id: 'diff', label: '% Difference' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setPctMode(m.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  pctMode === m.id
                    ? 'bg-[#7657FF] text-white shadow-md'
                    : 'bg-slate-100 dark:bg-[#16213A] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1f2d4e]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {pctMode === 'of' ? 'Percentage (X %)' : 'Value X'}
              </label>
              <input
                type="number"
                value={pctX}
                onChange={(e) => setPctX(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {pctMode === 'of' ? 'Of Number (Y)' : 'Value Y'}
              </label>
              <input
                type="number"
                value={pctY}
                onChange={(e) => setPctY(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Result card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#7657FF]/10 via-[#00D9FF]/10 to-transparent border border-[#7657FF]/25 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              {percentageResult.label}
            </span>
            <div className="flex items-center justify-between gap-4">
              <span className="text-4xl font-extrabold font-mono text-[#00D9FF]">
                {percentageResult.value}
              </span>
              <button
                onClick={() => handleCopy(percentageResult.value)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#16213A] border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#00D9FF] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            {percentageResult.note && (
              <p className="text-xs font-mono text-slate-400 pt-1">
                {percentageResult.note}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3. AGE CALCULATOR */}
      {toolSlug === 'age-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Age as of Date
              </label>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {ageData ? (
            <div className="space-y-4">
              {/* Primary Age Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#7657FF]/15 via-[#00D9FF]/10 to-transparent border border-[#7657FF]/30 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#00D9FF] block">
                  Exact Chronological Age
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {ageData.years} <span className="text-sm font-sans font-normal text-slate-400">years</span>,{' '}
                  {ageData.months} <span className="text-sm font-sans font-normal text-slate-400">months</span>,{' '}
                  {ageData.days} <span className="text-sm font-sans font-normal text-slate-400">days</span>
                </div>
                <div className="text-xs text-slate-400">
                  Born on a <strong>{ageData.dayOfWeek}</strong> · {ageData.daysUntilBday} days until next birthday!
                </div>
              </div>

              {/* Statistics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Total Days</span>
                  <span className="text-xl font-bold font-mono text-[#00D9FF]">{ageData.totalDays.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Total Hours</span>
                  <span className="text-xl font-bold font-mono text-[#7657FF]">{ageData.totalHours.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Total Minutes</span>
                  <span className="text-xl font-bold font-mono text-[#FF4FC8]">{ageData.totalMinutes.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block mb-1">Next Birthday</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">{ageData.daysUntilBday} days</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-rose-400 font-medium">Please enter a valid birth date that occurs before the target date.</p>
          )}
        </div>
      )}

      {/* 4. BMI CALCULATOR */}
      {toolSlug === 'bmi-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div className="flex gap-2">
            {(['metric', 'imperial'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setBmiUnit(unit)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  bmiUnit === unit
                    ? 'bg-[#7657FF] text-white shadow-md'
                    : 'bg-slate-100 dark:bg-[#16213A] text-slate-600 dark:text-slate-300'
                }`}
              >
                {unit === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, in)'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Weight ({bmiUnit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={bmiWeight}
                onChange={(e) => setBmiWeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Height ({bmiUnit === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                value={bmiHeight}
                onChange={(e) => setBmiHeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#7657FF]/10 via-[#00D9FF]/10 to-transparent border border-[#7657FF]/25 text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Body Mass Index Score
            </span>
            <span className="text-5xl font-extrabold font-mono text-[#00D9FF]">
              {bmiCalc.bmi}
            </span>
            <div className="pt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${bmiCalc.badgeColor}`}>
                {bmiCalc.category}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. DISCOUNT CALCULATOR */}
      {toolSlug === 'discount-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Original Price ($)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Discount (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Sales Tax (%)</label>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs text-emerald-400 block mb-1 font-semibold">Total Savings</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                ${discountCalc.discountAmount.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">Tax Amount</span>
              <span className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">
                ${discountCalc.taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#7657FF]/15 border border-[#7657FF]/30 text-center">
              <span className="text-xs text-[#00D9FF] font-semibold block mb-1">Final Price</span>
              <span className="text-3xl font-extrabold font-mono text-[#00D9FF]">
                ${discountCalc.finalTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 6. TEMPERATURE CONVERTER */}
      {toolSlug === 'temperature-converter' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">Celsius (°C)</label>
              <input
                type="number"
                value={tempValues.c}
                onChange={(e) => setCelsius(Number(e.target.value))}
                className="w-full text-2xl font-bold font-mono bg-transparent text-[#00D9FF] focus:outline-none"
              />
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">Fahrenheit (°F)</label>
              <input
                type="number"
                value={tempValues.f}
                onChange={(e) => setCelsius(((Number(e.target.value) - 32) * 5) / 9)}
                className="w-full text-2xl font-bold font-mono bg-transparent text-[#7657FF] focus:outline-none"
              />
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">Kelvin (K)</label>
              <input
                type="number"
                value={tempValues.k}
                onChange={(e) => setCelsius(Number(e.target.value) - 273.15)}
                className="w-full text-2xl font-bold font-mono bg-transparent text-[#FF4FC8] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Common Benchmarks:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Freezing Point', val: 0 },
                { label: 'Room Temp', val: 21 },
                { label: 'Human Body', val: 37 },
                { label: 'Boiling Point', val: 100 }
              ].map((bm) => (
                <button
                  key={bm.label}
                  onClick={() => setCelsius(bm.val)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-100 dark:bg-[#16213A] hover:bg-slate-200 dark:hover:bg-[#1f2d4e] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {bm.label} ({bm.val}°C)
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* 7. GST CALCULATOR */}
      {toolSlug === 'gst-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => setGstType('exclusive')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                gstType === 'exclusive'
                  ? 'bg-[#7657FF] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-[#16213A] text-slate-600 dark:text-slate-300'
              }`}
            >
              Add GST (Exclusive)
            </button>
            <button
              onClick={() => setGstType('inclusive')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                gstType === 'inclusive'
                  ? 'bg-[#7657FF] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-[#16213A] text-slate-600 dark:text-slate-300'
              }`}
            >
              Remove GST (Inclusive)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {gstType === 'exclusive' ? 'Base Amount ($)' : 'Total Amount ($)'}
              </label>
              <input
                type="number"
                value={gstAmount}
                onChange={(e) => setGstAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">GST Rate (%)</label>
              <div className="flex gap-1.5 mb-1.5">
                {[5, 12, 18, 28].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setGstRate(rate)}
                    className={`flex-1 py-1 text-xs font-semibold rounded-lg ${
                      gstRate === rate
                        ? 'bg-[#00D9FF] text-slate-950 font-bold'
                        : 'bg-slate-100 dark:bg-[#16213A] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Net Amount</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                ${gstCalc.netAmount.toFixed(2)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">CGST ({gstRate / 2}%)</span>
              <span className="text-base font-bold font-mono text-[#7657FF]">
                ${gstCalc.cgst.toFixed(2)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">SGST ({gstRate / 2}%)</span>
              <span className="text-base font-bold font-mono text-[#7657FF]">
                ${gstCalc.sgst.toFixed(2)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-center">
              <span className="text-[11px] text-[#00D9FF] font-semibold block mb-0.5">Total Amount</span>
              <span className="text-xl font-extrabold font-mono text-[#00D9FF]">
                ${gstCalc.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 8. EMI LOAN CALCULATOR */}
      {toolSlug === 'emi-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Loan Amount ($)</label>
              <input
                type="number"
                value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={emiRate}
                onChange={(e) => setEmiRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Tenure (Months)</label>
              <input
                type="number"
                value={emiTenureMonths}
                onChange={(e) => setEmiTenureMonths(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#7657FF]/15 to-[#00D9FF]/15 border border-[#7657FF]/30 text-center space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Monthly EMI
              </span>
              <span className="text-3xl font-extrabold font-mono text-[#00D9FF]">
                ${emiCalc.monthlyEmi.toFixed(2)}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Interest Payable
              </span>
              <span className="text-2xl font-bold font-mono text-amber-500">
                ${emiCalc.totalInterest.toFixed(2)}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Payment (Principal + Interest)
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                ${emiCalc.totalPayment.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 9. DATE DIFFERENCE CALCULATOR */}
      {toolSlug === 'date-difference-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Start Date</label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">End Date</label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {dateDiffCalc && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Total Days</span>
                <span className="text-2xl font-bold font-mono text-[#00D9FF]">
                  {dateDiffCalc.totalDays.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Weeks & Days</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {dateDiffCalc.weeks}w {dateDiffCalc.remainingDays}d
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Business Days</span>
                <span className="text-2xl font-bold font-mono text-emerald-500">
                  {dateDiffCalc.businessDays.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Weekend Days</span>
                <span className="text-2xl font-bold font-mono text-purple-400">
                  {(dateDiffCalc.totalDays - dateDiffCalc.businessDays).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. ROMAN NUMERAL CONVERTER */}
      {toolSlug === 'roman-numeral-converter' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Enter Integer (1 - 3999) OR Roman Numeral (e.g. MMXXVI)
            </label>
            <input
              type="text"
              value={romanInput}
              onChange={(e) => setRomanInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono uppercase text-lg"
            />
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#7657FF]/10 to-[#00D9FF]/10 border border-[#7657FF]/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Converted Output
              </span>
              <span className="text-3xl font-extrabold font-mono text-[#00D9FF]">
                {romanOutput}
              </span>
            </div>
            <button
              onClick={() => handleCopy(romanOutput)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#16213A] hover:text-[#00D9FF] text-slate-700 dark:text-slate-300 transition-colors"
              title="Copy Result"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
