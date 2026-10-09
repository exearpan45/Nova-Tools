import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight, Clock, Dice5, Shuffle, Binary, Hash, Check, Copy, RefreshCw
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface UtilityProps {
  toolSlug: string;
}

// Unit conversion factors relative to base SI unit
const UNIT_CATEGORIES: Record<string, {
  name: string;
  baseUnit: string;
  units: Record<string, { name: string; toBase: number }>;
}> = {
  length: {
    name: 'Length',
    baseUnit: 'm',
    units: {
      km: { name: 'Kilometers (km)', toBase: 1000 },
      m: { name: 'Meters (m)', toBase: 1 },
      cm: { name: 'Centimeters (cm)', toBase: 0.01 },
      mm: { name: 'Millimeters (mm)', toBase: 0.001 },
      mi: { name: 'Miles (mi)', toBase: 1609.344 },
      yd: { name: 'Yards (yd)', toBase: 0.9144 },
      ft: { name: 'Feet (ft)', toBase: 0.3048 },
      in: { name: 'Inches (in)', toBase: 0.0254 }
    }
  },
  weight: {
    name: 'Weight & Mass',
    baseUnit: 'kg',
    units: {
      t: { name: 'Metric Tons (t)', toBase: 1000 },
      kg: { name: 'Kilograms (kg)', toBase: 1 },
      g: { name: 'Grams (g)', toBase: 0.001 },
      mg: { name: 'Milligrams (mg)', toBase: 0.000001 },
      lb: { name: 'Pounds (lb)', toBase: 0.45359237 },
      oz: { name: 'Ounces (oz)', toBase: 0.0283495231 }
    }
  },
  area: {
    name: 'Area',
    baseUnit: 'sqm',
    units: {
      sqkm: { name: 'Square Kilometers (km²)', toBase: 1000000 },
      sqm: { name: 'Square Meters (m²)', toBase: 1 },
      sqft: { name: 'Square Feet (ft²)', toBase: 0.092903 },
      sqmi: { name: 'Square Miles (mi²)', toBase: 2589988.11 },
      acre: { name: 'Acres', toBase: 4046.85642 },
      ha: { name: 'Hectares (ha)', toBase: 10000 }
    }
  },
  volume: {
    name: 'Volume',
    baseUnit: 'l',
    units: {
      cum: { name: 'Cubic Meters (m³)', toBase: 1000 },
      l: { name: 'Liters (L)', toBase: 1 },
      ml: { name: 'Milliliters (mL)', toBase: 0.001 },
      gal: { name: 'US Gallons (gal)', toBase: 3.78541 },
      qt: { name: 'US Quarts (qt)', toBase: 0.946353 },
      cup: { name: 'US Cups', toBase: 0.236588 },
      floz: { name: 'US Fluid Ounces (fl oz)', toBase: 0.0295735 }
    }
  },
  speed: {
    name: 'Speed',
    baseUnit: 'mps',
    units: {
      kmh: { name: 'Kilometers per hour (km/h)', toBase: 0.277778 },
      mph: { name: 'Miles per hour (mph)', toBase: 0.44704 },
      mps: { name: 'Meters per second (m/s)', toBase: 1 },
      knot: { name: 'Knots (kn)', toBase: 0.514444 }
    }
  }
};

export const UtilityTools: React.FC<UtilityProps> = ({ toolSlug }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ================= 1. UNIT CONVERTER STATES =================
  const [activeCategory, setActiveCategory] = useState<string>('length');
  const [unitFrom, setUnitFrom] = useState<string>('km');
  const [unitTo, setUnitTo] = useState<string>('mi');
  const [unitVal, setUnitVal] = useState<number>(10);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const unitKeys = Object.keys(UNIT_CATEGORIES[cat].units);
    setUnitFrom(unitKeys[0]);
    setUnitTo(unitKeys[1] || unitKeys[0]);
  };

  const handleSwapUnits = () => {
    setUnitFrom(unitTo);
    setUnitTo(unitFrom);
  };

  const convertedResult = useMemo(() => {
    const cat = UNIT_CATEGORIES[activeCategory];
    if (!cat) return 0;
    const fromInfo = cat.units[unitFrom];
    const toInfo = cat.units[unitTo];
    if (!fromInfo || !toInfo) return 0;
    const baseVal = unitVal * fromInfo.toBase;
    const out = baseVal / toInfo.toBase;
    return Math.round((out + Number.EPSILON) * 1e6) / 1e6;
  }, [activeCategory, unitFrom, unitTo, unitVal]);

  // ================= 2. TIME CONVERTER STATES =================
  const [timeSeconds, setTimeSeconds] = useState<number>(3600);

  const timeBreakdown = useMemo(() => {
    const s = timeSeconds;
    const ms = s * 1000;
    const min = parseFloat((s / 60).toFixed(4));
    const hours = parseFloat((s / 3600).toFixed(4));
    const days = parseFloat((s / 86400).toFixed(4));
    const weeks = parseFloat((s / 604800).toFixed(4));
    const months = parseFloat((s / 2629746).toFixed(4));
    const years = parseFloat((s / 31556952).toFixed(4));
    return { ms, s, min, hours, days, weeks, months, years };
  }, [timeSeconds]);

  // ================= 3. RANDOM NUMBER & CHOICE =================
  const [randMin, setRandMin] = useState<number>(1);
  const [randMax, setRandMax] = useState<number>(100);
  const [randCount, setRandCount] = useState<number>(5);
  const [randResults, setRandResults] = useState<number[]>([14, 42, 77, 89, 93]);

  const [choiceItems, setChoiceItems] = useState<string>(
    'Pizza\nSushi\nTacos\nBurger\nSalad\nThai Curry'
  );
  const [pickedChoice, setPickedChoice] = useState<string | null>(null);

  const handleGenerateRand = () => {
    const list: number[] = [];
    const min = Math.min(randMin, randMax);
    const max = Math.max(randMin, randMax);
    for (let i = 0; i < randCount; i++) {
      list.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    setRandResults(list);
  };

  const handlePickChoice = () => {
    const arr = choiceItems.split('\n').map((s) => s.trim()).filter(Boolean);
    if (!arr.length) return;
    setPickedChoice(arr[Math.floor(Math.random() * arr.length)]);
  };

  // ================= 4. NUMBER BASE CONVERTER =================
  const [decInput, setDecInput] = useState<string>('255');
  const baseOutputs = useMemo(() => {
    const n = parseInt(decInput, 10);
    if (isNaN(n)) return { bin: 'Invalid', oct: 'Invalid', hex: 'Invalid' };
    return {
      bin: n.toString(2),
      oct: n.toString(8),
      hex: n.toString(16).toUpperCase()
    };
  }, [decInput]);

  return (
    <div className="space-y-6">
      {/* 1. UNIT CONVERTER */}
      {(toolSlug === 'unit-converter' || toolSlug.includes('converter-student')) && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          {/* Categories Tab Selector */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(UNIT_CATEGORIES).map(([catKey, cat]) => (
              <button
                key={catKey}
                onClick={() => handleCategoryChange(catKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === catKey
                    ? 'bg-[#7657FF] text-white shadow-md'
                    : 'bg-slate-100 dark:bg-[#16213A] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1f2d4e]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* Value & Source Unit */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-400 block">From Value</label>
              <input
                type="number"
                value={unitVal}
                onChange={(e) => setUnitVal(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
              <select
                value={unitFrom}
                onChange={(e) => setUnitFrom(e.target.value)}
                className="w-full px-3 py-2 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16213A] text-slate-700 dark:text-slate-200 text-xs font-medium"
              >
                {Object.entries(UNIT_CATEGORIES[activeCategory]?.units || {}).map(([k, u]) => (
                  <option key={k} value={k}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:col-span-1 pt-2">
              <button
                onClick={handleSwapUnits}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#16213A] text-slate-600 dark:text-slate-300 hover:text-[#00D9FF] hover:border-[#00D9FF]/40 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Swap Units"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Target Unit & Result */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-400 block">Target Value</label>
              <div className="w-full px-4 py-2.5 rounded-xl border border-[#7657FF]/30 bg-[#7657FF]/10 text-[#00D9FF] font-mono font-bold text-lg truncate flex items-center justify-between">
                <span>{convertedResult}</span>
                <button
                  onClick={() => handleCopy(String(convertedResult))}
                  className="p-1 hover:text-white transition-colors"
                  title="Copy result"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <select
                value={unitTo}
                onChange={(e) => setUnitTo(e.target.value)}
                className="w-full px-3 py-2 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#16213A] text-slate-700 dark:text-slate-200 text-xs font-medium"
              >
                {Object.entries(UNIT_CATEGORIES[activeCategory]?.units || {}).map(([k, u]) => (
                  <option key={k} value={k}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 2. TIME CONVERTER */}
      {toolSlug === 'time-converter' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Input Duration in Seconds
            </label>
            <input
              type="number"
              value={timeSeconds}
              onChange={(e) => setTimeSeconds(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono text-lg"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Milliseconds', val: timeBreakdown.ms.toLocaleString(), unit: 'ms' },
              { label: 'Minutes', val: timeBreakdown.min, unit: 'min' },
              { label: 'Hours', val: timeBreakdown.hours, unit: 'hrs' },
              { label: 'Days', val: timeBreakdown.days, unit: 'days' },
              { label: 'Weeks', val: timeBreakdown.weeks, unit: 'wks' },
              { label: 'Months (avg)', val: timeBreakdown.months, unit: 'mo' },
              { label: 'Years', val: timeBreakdown.years, unit: 'yrs' },
              { label: 'Raw Seconds', val: timeBreakdown.s.toLocaleString(), unit: 'sec' },
            ].map((t) => (
              <div
                key={t.label}
                onClick={() => handleCopy(String(t.val))}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 hover:border-[#00D9FF]/40 cursor-pointer transition-all group"
                title="Click to copy"
              >
                <span className="text-[11px] text-slate-400 block">{t.label}</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white group-hover:text-[#00D9FF] truncate block">
                  {t.val} <span className="text-xs font-normal text-slate-400">{t.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RANDOM NUMBER GENERATOR */}
      {toolSlug === 'random-number' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Minimum</label>
              <input
                type="number"
                value={randMin}
                onChange={(e) => setRandMin(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Maximum</label>
              <input
                type="number"
                value={randMax}
                onChange={(e) => setRandMax(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Count</label>
              <input
                type="number"
                value={randCount}
                onChange={(e) => setRandCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateRand}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7657FF] to-[#00D9FF] text-white font-semibold text-xs transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Random Numbers</span>
          </button>

          <div className="flex flex-wrap gap-2 pt-2">
            {randResults.map((n, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#16213A] text-slate-900 dark:text-[#00D9FF] border border-slate-200 dark:border-slate-700 font-mono font-bold text-lg"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. RANDOM CHOICE PICKER */}
      {toolSlug === 'random-choice' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Enter Choices (One per line)
            </label>
            <textarea
              rows={5}
              value={choiceItems}
              onChange={(e) => setChoiceItems(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white text-xs font-mono"
            />
          </div>

          <button
            onClick={handlePickChoice}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7657FF] to-[#FF4FC8] text-white font-semibold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            <span>Pick a Random Item</span>
          </button>

          {pickedChoice && (
            <div className="p-6 rounded-2xl bg-[#7657FF]/15 border border-[#7657FF]/30 text-center space-y-1 animate-result-in">
              <span className="text-xs font-semibold uppercase text-slate-400">Selected Choice:</span>
              <div className="text-3xl font-extrabold text-[#00D9FF] font-mono">{pickedChoice}</div>
            </div>
          )}
        </div>
      )}

      {/* 5. NUMBER BASE CONVERTER */}
      {toolSlug === 'number-base-converter' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-[rgba(170,190,255,0.15)] bg-white dark:bg-[#10182B] space-y-6">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Decimal Input (Base 10)</label>
            <input
              type="number"
              value={decInput}
              onChange={(e) => setDecInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16213A] text-slate-900 dark:text-white font-mono text-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">Binary (Base 2)</span>
              <span className="text-lg font-bold font-mono text-[#00D9FF] break-all">{baseOutputs.bin}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">Octal (Base 8)</span>
              <span className="text-lg font-bold font-mono text-[#7657FF] break-all">{baseOutputs.oct}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16213A] border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">Hexadecimal (Base 16)</span>
              <span className="text-lg font-bold font-mono text-[#FF4FC8] break-all">0x{baseOutputs.hex}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
