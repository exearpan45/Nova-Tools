import React, { useState, useMemo } from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';

export const BmiCalculatorTool: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  // Metric state
  const [metricHeight, setMetricHeight] = useState<string>('175'); // cm
  const [metricWeight, setMetricWeight] = useState<string>('70'); // kg

  // Imperial state
  const [imperialFeet, setImperialFeet] = useState<string>('5');
  const [imperialInches, setImperialInches] = useState<string>('9');
  const [imperialPounds, setImperialPounds] = useState<string>('155');

  const bmiData = useMemo(() => {
    let bmi = 0;
    if (unitSystem === 'metric') {
      const hCm = parseFloat(metricHeight);
      const wKg = parseFloat(metricWeight);
      if (hCm > 0 && wKg > 0) {
        const hMeters = hCm / 100;
        bmi = wKg / (hMeters * hMeters);
      }
    } else {
      const ft = parseFloat(imperialFeet) || 0;
      const inch = parseFloat(imperialInches) || 0;
      const totalInches = ft * 12 + inch;
      const lbs = parseFloat(imperialPounds);
      if (totalInches > 0 && lbs > 0) {
        bmi = (lbs * 703) / (totalInches * totalInches);
      }
    }

    if (bmi <= 0 || isNaN(bmi) || !isFinite(bmi)) return null;

    let category = '';
    let categoryColor = '';
    let description = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900';
      description = 'Below standard weight guidelines (BMI under 18.5).';
    } else if (bmi < 25) {
      category = 'Normal weight';
      categoryColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
      description = 'Within healthy reference range (BMI 18.5 – 24.9).';
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      description = 'Above standard weight guidelines (BMI 25 – 29.9).';
    } else {
      category = 'Obese';
      categoryColor = 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900';
      description = 'Significantly elevated BMI (BMI 30 or greater).';
    }

    return {
      bmi: Number(bmi.toFixed(1)),
      category,
      categoryColor,
      description
    };
  }, [unitSystem, metricHeight, metricWeight, imperialFeet, imperialInches, imperialPounds]);

  const handleReset = () => {
    if (unitSystem === 'metric') {
      setMetricHeight('175');
      setMetricWeight('70');
    } else {
      setImperialFeet('5');
      setImperialInches('9');
      setImperialPounds('155');
    }
  };

  return (
    <div className="space-y-6">
      {/* Unit System Toggle */}
      <div className="flex items-center justify-between">
        <div className="inline-flex p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/60">
          <button
            type="button"
            onClick={() => setUnitSystem('metric')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              unitSystem === 'metric'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Metric (cm, kg)
          </button>
          <button
            type="button"
            onClick={() => setUnitSystem('imperial')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              unitSystem === 'imperial'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Imperial (ft/in, lbs)
          </button>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {unitSystem === 'metric' ? (
          <>
            <div>
              <label htmlFor="height-cm" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Height (cm)
              </label>
              <input
                id="height-cm"
                type="number"
                min="50"
                max="260"
                value={metricHeight}
                onChange={(e) => setMetricHeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="weight-kg" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Weight (kg)
              </label>
              <input
                id="weight-kg"
                type="number"
                min="20"
                max="300"
                value={metricWeight}
                onChange={(e) => setMetricWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Height
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={imperialFeet}
                    onChange={(e) => setImperialFeet(e.target.value)}
                    placeholder="Feet"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">ft</span>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={imperialInches}
                    onChange={(e) => setImperialInches(e.target.value)}
                    placeholder="Inches"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">in</span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="weight-lbs" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Weight (lbs)
              </label>
              <input
                id="weight-lbs"
                type="number"
                min="40"
                max="600"
                value={imperialPounds}
                onChange={(e) => setImperialPounds(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>

      {/* Result Display */}
      {bmiData && (
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
            Calculated BMI
          </span>
          <div className="text-4xl font-mono font-semibold text-neutral-900 dark:text-neutral-100 mt-2">
            {bmiData.bmi}
          </div>
          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border" tabIndex={0}>
            <span className={bmiData.categoryColor}>{bmiData.category}</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {bmiData.description}
          </p>
        </div>
      )}

      {/* Informational Disclaimer as mandated by PRD */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/20 text-xs text-neutral-500 dark:text-neutral-400">
        <AlertCircle className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Informational Notice:</strong> BMI is a standard mathematical screening ratio based on World Health Organization guidelines. It does not measure body fat directly and is not medical diagnosis or advice.
        </p>
      </div>
    </div>
  );
};
