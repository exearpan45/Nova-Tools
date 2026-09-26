import React, { useState } from 'react';
import { RotateCcw, AlertCircle, Info, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';
import { getSavedPreference, savePreference } from '../utils/storage';

const ABSOLUTE_ZERO_C = -273.15;
const ABSOLUTE_ZERO_F = -459.67;
const ABSOLUTE_ZERO_K = 0;

function cleanRound(num: number): string {
  if (isNaN(num)) return '';
  const rounded = Math.round(num * 1e4) / 1e4;
  return rounded.toString();
}

export const TemperatureConverterTool: React.FC = () => {
  const { showToast } = useToast();
  const [activeScale, setActiveScale] = useState<'celsius' | 'fahrenheit' | 'kelvin'>(() => {
    const saved = getSavedPreference<'celsius' | 'fahrenheit' | 'kelvin'>('temp-scale', 'celsius');
    return saved === 'fahrenheit' || saved === 'kelvin' ? saved : 'celsius';
  });

  const [celsius, setCelsius] = useState<string>('25');
  const [fahrenheit, setFahrenheit] = useState<string>('77');
  const [kelvin, setKelvin] = useState<string>('298.15');
  const [error, setError] = useState<string | null>(null);
  const [copiedScale, setCopiedScale] = useState<string | null>(null);

  const handleScaleSelect = (scale: 'celsius' | 'fahrenheit' | 'kelvin') => {
    setActiveScale(scale);
    savePreference('temp-scale', scale);
  };

  const updateFromCelsius = (val: string) => {
    setCelsius(val);
    if (!val.trim()) {
      setFahrenheit('');
      setKelvin('');
      setError(null);
      return;
    }

    const c = parseFloat(val);
    if (isNaN(c)) {
      setFahrenheit('');
      setKelvin('');
      setError('Please enter a valid numeric temperature.');
      return;
    }

    if (c < ABSOLUTE_ZERO_C) {
      setError(`Temperature cannot be below absolute zero (-273.15°C / 0 K).`);
      setFahrenheit('');
      setKelvin('');
      return;
    }

    setError(null);
    const f = (c * 9) / 5 + 32;
    const k = c + 273.15;
    setFahrenheit(cleanRound(f));
    setKelvin(cleanRound(k));
  };

  const updateFromFahrenheit = (val: string) => {
    setFahrenheit(val);
    if (!val.trim()) {
      setCelsius('');
      setKelvin('');
      setError(null);
      return;
    }

    const f = parseFloat(val);
    if (isNaN(f)) {
      setCelsius('');
      setKelvin('');
      setError('Please enter a valid numeric temperature.');
      return;
    }

    if (f < ABSOLUTE_ZERO_F) {
      setError(`Temperature cannot be below absolute zero (-459.67°F / 0 K).`);
      setCelsius('');
      setKelvin('');
      return;
    }

    setError(null);
    const c = ((f - 32) * 5) / 9;
    const k = c + 273.15;
    setCelsius(cleanRound(c));
    setKelvin(cleanRound(k));
  };

  const updateFromKelvin = (val: string) => {
    setKelvin(val);
    if (!val.trim()) {
      setCelsius('');
      setFahrenheit('');
      setError(null);
      return;
    }

    const k = parseFloat(val);
    if (isNaN(k)) {
      setCelsius('');
      setFahrenheit('');
      setError('Please enter a valid numeric temperature.');
      return;
    }

    if (k < ABSOLUTE_ZERO_K) {
      setError(`Kelvin temperature cannot be negative. Absolute zero is 0 K.`);
      setCelsius('');
      setFahrenheit('');
      return;
    }

    setError(null);
    const c = k - 273.15;
    const f = (c * 9) / 5 + 32;
    setCelsius(cleanRound(c));
    setFahrenheit(cleanRound(f));
  };

  const setPreset = (cVal: number, label: string) => {
    updateFromCelsius(cVal.toString());
    showToast(`Set to ${label}`, 'info');
  };

  const handleReset = () => {
    updateFromCelsius('0');
    showToast('Reset to 0°C', 'info');
  };

  const handleCopy = async (val: string, scale: string) => {
    if (!val) return;
    const text = `${val}°${scale}`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedScale(scale);
      setTimeout(() => setCopiedScale(null), 1500);
      showToast(`Copied ${text}`, 'success');
      addScratchpadItem('temperature-converter', text);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls & presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-neutral-400 font-medium">Presets:</span>
          <button
            type="button"
            onClick={() => setPreset(-273.15, 'Absolute Zero')}
            className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            Absolute Zero (0 K)
          </button>
          <button
            type="button"
            onClick={() => setPreset(0, 'Freezing Point')}
            className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            Water Freezes (0°C)
          </button>
          <button
            type="button"
            onClick={() => setPreset(37, 'Human Body')}
            className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            Body Temp (37°C)
          </button>
          <button
            type="button"
            onClick={() => setPreset(100, 'Boiling Point')}
            className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            Water Boils (100°C)
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Temperature Input Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Celsius */}
        <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="temp-celsius" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Celsius (°C)
            </label>
            {celsius && !error && (
              <button
                type="button"
                onClick={() => handleCopy(celsius, 'C')}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                title="Copy Celsius"
              >
                {copiedScale === 'C' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          <input
            id="temp-celsius"
            type="number"
            step="any"
            value={celsius}
            onChange={(e) => updateFromCelsius(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-lg font-mono font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="text-[11px] text-neutral-400 pt-1">
            Freezes: 0°C | Boils: 100°C
          </div>
        </div>

        {/* Fahrenheit */}
        <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="temp-fahrenheit" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Fahrenheit (°F)
            </label>
            {fahrenheit && !error && (
              <button
                type="button"
                onClick={() => handleCopy(fahrenheit, 'F')}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                title="Copy Fahrenheit"
              >
                {copiedScale === 'F' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          <input
            id="temp-fahrenheit"
            type="number"
            step="any"
            value={fahrenheit}
            onChange={(e) => updateFromFahrenheit(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-lg font-mono font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="text-[11px] text-neutral-400 pt-1">
            Freezes: 32°F | Boils: 212°F
          </div>
        </div>

        {/* Kelvin */}
        <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="temp-kelvin" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Kelvin (K)
            </label>
            {kelvin && !error && (
              <button
                type="button"
                onClick={() => handleCopy(kelvin, 'K')}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                title="Copy Kelvin"
              >
                {copiedScale === 'K' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          <input
            id="temp-kelvin"
            type="number"
            step="any"
            value={kelvin}
            onChange={(e) => updateFromKelvin(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-lg font-mono font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="text-[11px] text-neutral-400 pt-1">
            Absolute Zero: 0 K (-273.15°C)
          </div>
        </div>
      </div>
    </div>
  );
};
