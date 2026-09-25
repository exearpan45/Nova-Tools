import React, { useState, useMemo } from 'react';
import { RotateCcw, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

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
    let heightMeters = 0;
    let weightKg = 0;

    if (unitSystem === 'metric') {
      if (!metricHeight.trim() || !metricWeight.trim()) {
        return { valid: false, error: 'Please enter both height and weight.' };
      }
      const h = parseFloat(metricHeight);
      const w = parseFloat(metricWeight);

      if (isNaN(h) || isNaN(w)) {
        return { valid: false, error: 'Please enter valid numerical values.' };
      }
      if (h <= 0 || w <= 0) {
        return { valid: false, error: 'Height and weight must be greater than zero.' };
      }
      if (h < 50 || h > 260) {
        return { valid: false, error: 'Height must be between 50 cm and 260 cm.' };
      }
      if (w < 15 || w > 450) {
        return { valid: false, error: 'Weight must be between 15 kg and 450 kg.' };
      }

      heightMeters = h / 100;
      weightKg = w;
    } else {
      if (!imperialPounds.trim() || (!imperialFeet.trim() && !imperialInches.trim())) {
        return { valid: false, error: 'Please enter height (ft/in) and weight (lbs).' };
      }
      const ft = parseFloat(imperialFeet) || 0;
      const inch = parseFloat(imperialInches) || 0;
      const lbs = parseFloat(imperialPounds);

      if (isNaN(ft) || isNaN(inch) || isNaN(lbs)) {
        return { valid: false, error: 'Please enter valid numerical values.' };
      }
      if (ft < 0 || inch < 0 || lbs <= 0) {
        return { valid: false, error: 'Height and weight cannot be negative, and weight must exceed zero.' };
      }

      const totalInches = ft * 12 + inch;
      if (totalInches < 20 || totalInches > 105) {
        return { valid: false, error: 'Total height must be between 20 inches and 105 inches (1ft 8in – 8ft 9in).' };
      }
      if (lbs < 30 || lbs > 1000) {
        return { valid: false, error: 'Weight must be between 30 lbs and 1,000 lbs.' };
      }

      heightMeters = totalInches * 0.0254;
      weightKg = lbs * 0.45359237;
    }

    const bmiRaw = weightKg / (heightMeters * heightMeters);
    if (!isFinite(bmiRaw) || isNaN(bmiRaw) || bmiRaw <= 0) {
      return { valid: false, error: 'Calculation failed. Please verify inputs.' };
    }

    const bmi = Number(bmiRaw.toFixed(1));

    // Standard WHO adult BMI classification
    let category = '';
    let categoryColor = '';
    let description = '';
    let healthyWeightMin = Number((18.5 * heightMeters * heightMeters).toFixed(1));
    let healthyWeightMax = Number((24.9 * heightMeters * heightMeters).toFixed(1));

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900';
      description = 'Below standard weight guidelines (BMI under 18.5).';
    } else if (bmi < 25.0) {
      category = 'Normal weight (Healthy range)';
      categoryColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
      description = 'Within recommended healthy reference guidelines (BMI 18.5 – 24.9).';
    } else if (bmi < 30.0) {
      category = 'Overweight';
      categoryColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      description = 'Above standard weight guidelines (BMI 25.0 – 29.9).';
    } else if (bmi < 35.0) {
      category = 'Obesity (Class I)';
      categoryColor = 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900';
      description = 'Moderate risk elevation (BMI 30.0 – 34.9).';
    } else if (bmi < 40.0) {
      category = 'Obesity (Class II)';
      categoryColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
      description = 'Substantial risk elevation (BMI 35.0 – 39.9).';
    } else {
      category = 'Severe Obesity (Class III)';
      categoryColor = 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900';
      description = 'High risk elevation (BMI 40.0 or greater).';
    }

    let healthyWeightText = '';
    if (unitSystem === 'metric') {
      healthyWeightText = `${healthyWeightMin} kg – ${healthyWeightMax} kg`;
    } else {
      const minLbs = Number((healthyWeightMin / 0.45359237).toFixed(1));
      const maxLbs = Number((healthyWeightMax / 0.45359237).toFixed(1));
      healthyWeightText = `${minLbs} lbs – ${maxLbs} lbs`;
    }

    return {
      valid: true,
      bmi,
      category,
      categoryColor,
      description,
      healthyWeightText,
      error: null
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
              <label htmlFor="height-cm" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Height (cm)
              </label>
              <input
                id="height-cm"
                type="number"
                min="50"
                max="260"
                step="any"
                value={metricHeight}
                onChange={(e) => setMetricHeight(e.target.value)}
                placeholder="175"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="weight-kg" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Weight (kg)
              </label>
              <input
                id="weight-kg"
                type="number"
                min="15"
                max="450"
                step="any"
                value={metricWeight}
                onChange={(e) => setMetricWeight(e.target.value)}
                placeholder="70"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Height
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    step="any"
                    value={imperialFeet}
                    onChange={(e) => setImperialFeet(e.target.value)}
                    placeholder="Feet"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">ft</span>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="11.9"
                    step="any"
                    value={imperialInches}
                    onChange={(e) => setImperialInches(e.target.value)}
                    placeholder="Inches"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">in</span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="weight-lbs" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Weight (lbs)
              </label>
              <input
                id="weight-lbs"
                type="number"
                min="30"
                max="1000"
                step="any"
                value={imperialPounds}
                onChange={(e) => setImperialPounds(e.target.value)}
                placeholder="155"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>

      {/* Validation Message */}
      {!bmiData.valid && (
        <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{bmiData.error}</span>
        </div>
      )}

      {/* Result Display */}
      {bmiData.valid && (
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center space-y-3 animate-result-in">
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
            Calculated Body Mass Index (BMI)
          </span>
          <div
            data-action="output"
            className="text-5xl font-mono font-bold text-neutral-900 dark:text-neutral-100 tracking-tight"
          >
            {bmiData.bmi}
          </div>
          <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold border" tabIndex={0}>
            <span className={bmiData.categoryColor}>{bmiData.category}</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            {bmiData.description}
          </p>

          <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-300">
            Normal BMI weight range for this height: <strong>{bmiData.healthyWeightText}</strong>
          </div>
        </div>
      )}

      {/* Required Clinical Screening & Adult-Only Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200/90 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-300/90">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950 dark:text-amber-200">
            Adult Screening Tool Notice (Ages 20+)
          </p>
          <p>
            Standard adult BMI is a population-level screening ratio defined by the World Health Organization (WHO). It is not a clinical medical diagnosis and does not measure body fat percentage directly. These standard adult categories do <strong>not</strong> apply to children, adolescents, pregnant individuals, or muscular athletes. Consult a healthcare professional for clinical health assessments.
          </p>
        </div>
      </div>
    </div>
  );
};
