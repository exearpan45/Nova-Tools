import React, { useState, useMemo } from 'react';
import {
  Sliders, Globe, Clock, Dice5, Shuffle, Timer, Hourglass,
  Calendar, CalendarDays, HardDrive, Binary, Hash, Check, Copy, Play, Pause, RotateCcw
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface UtilityProps {
  toolSlug: string;
}

export const UtilityTools: React.FC<UtilityProps> = ({ toolSlug }) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Random Number Generator states
  const [randMin, setRandMin] = useState<number>(1);
  const [randMax, setRandMax] = useState<number>(100);
  const [randCount, setRandCount] = useState<number>(5);
  const [randResults, setRandResults] = useState<number[]>([14, 42, 77, 89, 93]);

  // Random Choice states
  const [choiceItems, setChoiceItems] = useState<string>(
    'Pizza\nSushi\nTacos\nBurger\nSalad\nThai Curry'
  );
  const [pickedChoice, setPickedChoice] = useState<string | null>(null);

  // Number Base Converter states
  const [decInput, setDecInput] = useState<string>('255');

  // Binary & Hex converter text
  const [textInput, setTextInput] = useState<string>('NOVA TOOLS');

  // Event Countdown Target
  const [countdownTarget, setCountdownTarget] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Timezone world clock time
  const [baseUtcHours, setBaseUtcHours] = useState<number>(12);

  // Generate random numbers
  const handleGenerateRand = () => {
    const list: number[] = [];
    const min = Math.min(randMin, randMax);
    const max = Math.max(randMin, randMax);
    for (let i = 0; i < randCount; i++) {
      const val = Math.floor(Math.random() * (max - min + 1)) + min;
      list.push(val);
    }
    setRandResults(list);
  };

  // Pick random choice
  const handlePickChoice = () => {
    const arr = choiceItems
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (arr.length === 0) return;
    const chosen = arr[Math.floor(Math.random() * arr.length)];
    setPickedChoice(chosen);
  };

  // Number base conversion
  const baseConversions = useMemo(() => {
    const num = parseInt(decInput, 10);
    if (isNaN(num)) {
      return { binary: '0', octal: '0', decimal: '0', hex: '0' };
    }
    return {
      binary: num.toString(2),
      octal: num.toString(8),
      decimal: num.toString(10),
      hex: num.toString(16).toUpperCase(),
    };
  }, [decInput]);

  // Binary text conversion
  const binaryOutput = useMemo(() => {
    return textInput
      .split('')
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  }, [textInput]);

  // Hex text conversion
  const hexOutput = useMemo(() => {
    return textInput
      .split('')
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
  }, [textInput]);

  // Event countdown remaining days
  const daysRemaining = useMemo(() => {
    const diff = new Date(countdownTarget).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [countdownTarget]);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Random Number Generator */}
      {toolSlug === 'random-number' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Minimum Value</label>
              <input
                type="number"
                value={randMin}
                onChange={(e) => setRandMin(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Maximum Value</label>
              <input
                type="number"
                value={randMax}
                onChange={(e) => setRandMax(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Quantity to Generate</label>
              <input
                type="number"
                min="1"
                max="100"
                value={randCount}
                onChange={(e) => setRandCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGenerateRand}
              className="px-6 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Dice5 className="w-4 h-4" /> Generate Random Numbers
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-lime-500/10 border border-lime-500/20 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-lime-400 block">
              Resulting Numbers
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {randResults.map((n, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-lime-500/30 text-2xl font-extrabold font-mono text-lime-600 dark:text-lime-400 shadow-sm"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Random Choice Picker */}
      {toolSlug === 'random-choice' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            List of Options (One per line)
          </label>
          <textarea
            value={choiceItems}
            onChange={(e) => setChoiceItems(e.target.value)}
            className="w-full h-36 p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
          />
          <button
            onClick={handlePickChoice}
            className="px-6 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
          >
            <Shuffle className="w-4 h-4" /> Pick One Randomly
          </button>
          {pickedChoice && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-lime-600/15 to-emerald-600/15 border border-lime-500/30 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-lime-500 block mb-1">
                The Wheel Selected:
              </span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {pickedChoice}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Number Base Converter */}
      {toolSlug === 'number-base-converter' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Decimal Input (Base 10)
            </label>
            <input
              type="number"
              value={decInput}
              onChange={(e) => setDecInput(e.target.value)}
              className="w-full px-4 py-2.5 font-mono text-base rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 font-sans">Binary (Base 2)</span>
              <span className="text-base font-bold text-lime-600 dark:text-lime-400 break-all">
                {baseConversions.binary}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 font-sans">Octal (Base 8)</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {baseConversions.octal}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 font-sans">Decimal (Base 10)</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {baseConversions.decimal}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 font-sans">Hexadecimal (Base 16)</span>
              <span className="text-base font-bold text-lime-600 dark:text-lime-400">
                0x{baseConversions.hex}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Binary & Hex Code Converter */}
      {(toolSlug === 'binary-converter' || toolSlug === 'hex-converter') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Input Text</span>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full h-72 p-4 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {toolSlug === 'binary-converter' ? '8-Bit Binary Code' : 'Hexadecimal Sequence'}
              </span>
              <button
                onClick={() => handleCopy(toolSlug === 'binary-converter' ? binaryOutput : hexOutput)}
                className="text-xs text-lime-500 hover:underline font-medium"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={toolSlug === 'binary-converter' ? binaryOutput : hexOutput}
              className="w-full h-72 p-4 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-lime-600 dark:text-lime-400"
            />
          </div>
        </div>
      )}

      {/* Event Countdown */}
      {toolSlug === 'utility-countdown' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Select Target Milestone Date
            </label>
            <input
              type="date"
              value={countdownTarget}
              onChange={(e) => setCountdownTarget(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
            />
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-r from-lime-600/10 via-emerald-600/10 to-teal-600/10 border border-lime-500/20 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-500 block mb-2">
              Time Remaining
            </span>
            <span className="text-6xl font-extrabold font-mono text-lime-600 dark:text-lime-400">
              {daysRemaining}
            </span>
            <span className="text-sm font-semibold text-slate-500 block mt-2">days until target date</span>
          </div>
        </div>
      )}
    </div>
  );
};
