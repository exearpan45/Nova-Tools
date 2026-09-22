import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export const TemperatureConverterTool: React.FC = () => {
  const [celsius, setCelsius] = useState<string>('25');
  const [fahrenheit, setFahrenheit] = useState<string>('77');
  const [kelvin, setKelvin] = useState<string>('298.15');

  const updateFromCelsius = (val: string) => {
    setCelsius(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setFahrenheit(((num * 9) / 5 + 32).toFixed(2));
      setKelvin((num + 273.15).toFixed(2));
    } else {
      setFahrenheit('');
      setKelvin('');
    }
  };

  const updateFromFahrenheit = (val: string) => {
    setFahrenheit(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const c = ((num - 32) * 5) / 9;
      setCelsius(c.toFixed(2));
      setKelvin((c + 273.15).toFixed(2));
    } else {
      setCelsius('');
      setKelvin('');
    }
  };

  const updateFromKelvin = (val: string) => {
    setKelvin(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const c = num - 273.15;
      setCelsius(c.toFixed(2));
      setFahrenheit(((c * 9) / 5 + 32).toFixed(2));
    } else {
      setCelsius('');
      setFahrenheit('');
    }
  };

  const handleReset = () => {
    updateFromCelsius('0');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-neutral-500">
          Enter a value in any unit to instantly update all scales.
        </p>
        <button
          onClick={handleReset}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset to 0°C</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Celsius */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <label htmlFor="temp-celsius" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Celsius (°C)
          </label>
          <input
            id="temp-celsius"
            type="number"
            step="any"
            value={celsius}
            onChange={(e) => updateFromCelsius(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-base font-mono font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="text-[11px] text-neutral-400 mt-2">
            Water freezes at 0°C, boils at 100°C
          </div>
        </div>

        {/* Fahrenheit */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <label htmlFor="temp-fahrenheit" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Fahrenheit (°F)
          </label>
          <input
            id="temp-fahrenheit"
            type="number"
            step="any"
            value={fahrenheit}
            onChange={(e) => updateFromFahrenheit(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-base font-mono font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="text-[11px] text-neutral-400 mt-2">
            Water freezes at 32°F, boils at 212°F
          </div>
        </div>

        {/* Kelvin */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
          <label htmlFor="temp-kelvin" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Kelvin (K)
          </label>
          <input
            id="temp-kelvin"
            type="number"
            step="any"
            value={kelvin}
            onChange={(e) => updateFromKelvin(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-base font-mono font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="text-[11px] text-neutral-400 mt-2">
            Absolute zero is 0 K (-273.15°C)
          </div>
        </div>
      </div>
    </div>
  );
};
