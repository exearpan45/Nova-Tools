import React, { useState, useMemo } from 'react';
import {
  Calculator, Tag, TrendingUp, Activity, CalendarRange, Clock4,
  Gauge, Thermometer, Ruler, Scale, Square, Box, Receipt, DollarSign, Fuel
} from 'lucide-react';

interface CalcProps {
  toolSlug: string;
}

export const CalculatorTools: React.FC<CalcProps> = ({ toolSlug }) => {
  // Discount states
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [taxPercent, setTaxPercent] = useState<number>(8);

  // Profit / Loss states
  const [costPrice, setCostPrice] = useState<number>(80);
  const [sellingPrice, setSellingPrice] = useState<number>(115);

  // BMI states
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175); // cm or inches

  // Date Diff states
  const [date1, setDate1] = useState<string>(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Time Diff states
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:30');

  // Speed Distance Time states
  const [sdtDistance, setSdtDistance] = useState<number>(120);
  const [sdtTime, setSdtTime] = useState<number>(2); // hours

  // Loan EMI states
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [loanInterest, setLoanInterest] = useState<number>(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(3);

  // Tip Calculator
  const [billAmount, setBillAmount] = useState<number>(85);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [peopleCount, setPeopleCount] = useState<number>(2);

  // Fuel Cost Calculator
  const [tripDistance, setTripDistance] = useState<number>(350);
  const [fuelEconomy, setFuelEconomy] = useState<number>(12); // km per liter
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<number>(1.5);

  // Unit Converters generic state
  const [convertVal, setConvertVal] = useState<number>(100);

  // Calculations
  const discountCalc = useMemo(() => {
    const discountAmount = (originalPrice * discountPercent) / 100;
    const discountedPrice = originalPrice - discountAmount;
    const taxAmount = (discountedPrice * taxPercent) / 100;
    const finalTotal = discountedPrice + taxAmount;
    return { discountAmount, discountedPrice, taxAmount, finalTotal };
  }, [originalPrice, discountPercent, taxPercent]);

  const profitCalc = useMemo(() => {
    const diff = sellingPrice - costPrice;
    const isProfit = diff >= 0;
    const margin = costPrice > 0 ? (diff / costPrice) * 100 : 0;
    return { diff, isProfit, margin };
  }, [costPrice, sellingPrice]);

  const bmiCalc = useMemo(() => {
    let bmi = 0;
    if (bmiUnit === 'metric') {
      const hMeters = height / 100;
      bmi = hMeters > 0 ? weight / (hMeters * hMeters) : 0;
    } else {
      bmi = height > 0 ? (weight / (height * height)) * 703 : 0;
    }
    let cat = 'Normal Weight';
    let color = 'text-emerald-500';
    if (bmi < 18.5) { cat = 'Underweight'; color = 'text-amber-500'; }
    else if (bmi >= 25 && bmi < 30) { cat = 'Overweight'; color = 'text-orange-500'; }
    else if (bmi >= 30) { cat = 'Obese'; color = 'text-rose-500'; }
    return { bmi: bmi.toFixed(1), category: cat, color };
  }, [weight, height, bmiUnit]);

  const dateDiff = useMemo(() => {
    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();
    const diffMs = Math.abs(d2 - d1);
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const weeks = (days / 7).toFixed(1);
    const months = (days / 30.4375).toFixed(1);
    return { days, weeks, months };
  }, [date1, date2]);

  const loanCalc = useMemo(() => {
    const p = loanAmount;
    const r = loanInterest / (12 * 100);
    const n = loanTenureYears * 12;
    if (r === 0) return { emi: (p / n).toFixed(2), totalInterest: 0, totalPayment: p };
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    return {
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    };
  }, [loanAmount, loanInterest, loanTenureYears]);

  return (
    <div className="space-y-6">
      {/* Discount Calculator */}
      {toolSlug === 'discount-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Original Price ($)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Discount (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Sales Tax (%)</label>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400 block mb-1">You Save</span>
              <span className="text-2xl font-bold font-mono text-emerald-500">
                ${discountCalc.discountAmount.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400 block mb-1">Tax Amount</span>
              <span className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">
                ${discountCalc.taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
              <span className="text-xs text-blue-500 font-semibold block mb-1">Final Price</span>
              <span className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                ${discountCalc.finalTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* BMI Calculator */}
      {toolSlug === 'bmi-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="flex gap-2">
            {(['metric', 'imperial'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setBmiUnit(unit)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize ${
                  bmiUnit === unit ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {unit === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, in)'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Weight ({bmiUnit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Height ({bmiUnit === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center space-y-2">
            <span className="text-xs text-blue-500 font-semibold uppercase tracking-wider block">
              Body Mass Index (BMI)
            </span>
            <span className="text-5xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
              {bmiCalc.bmi}
            </span>
            <span className={`text-sm font-bold block ${bmiCalc.color}`}>
              {bmiCalc.category}
            </span>
          </div>
        </div>
      )}

      {/* Loan EMI Calculator */}
      {toolSlug === 'loan-emi-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Loan Amount ($)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={loanInterest}
                onChange={(e) => setLoanInterest(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Tenure (Years)</label>
              <input
                type="number"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
              <span className="text-xs text-blue-500 font-semibold block mb-1">Monthly EMI</span>
              <span className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                ${loanCalc.emi}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400 block mb-1">Total Interest</span>
              <span className="text-2xl font-bold font-mono text-amber-500">
                ${loanCalc.totalInterest}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-400 block mb-1">Total Payment</span>
              <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200">
                ${loanCalc.totalPayment}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Date Difference Calculator */}
      {toolSlug === 'date-difference-calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Start Date</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">End Date</label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-xs text-blue-500 font-semibold block mb-1">Total Days</span>
              <span className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                {dateDiff.days}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Weeks</span>
              <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200">
                {dateDiff.weeks}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">Months</span>
              <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200">
                {dateDiff.months}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Temperature & Generic Unit Converters */}
      {(toolSlug === 'temperature-converter' || toolSlug.includes('-converter')) && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Input Value</label>
            <input
              type="number"
              value={convertVal}
              onChange={(e) => setConvertVal(Number(e.target.value))}
              className="w-full px-4 py-2.5 text-lg font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {toolSlug === 'temperature-converter' ? (
              <>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Celsius (°C)</span>
                  <span className="text-2xl font-bold font-mono text-blue-500">{convertVal}°C</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Fahrenheit (°F)</span>
                  <span className="text-2xl font-bold font-mono text-blue-500">
                    {((convertVal * 9) / 5 + 32).toFixed(1)}°F
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Kelvin (K)</span>
                  <span className="text-2xl font-bold font-mono text-blue-500">
                    {(convertVal + 273.15).toFixed(2)} K
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Metric</span>
                  <span className="text-2xl font-bold font-mono text-blue-500">
                    {(convertVal * 1.609).toFixed(2)} km
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Imperial</span>
                  <span className="text-2xl font-bold font-mono text-blue-500">
                    {(convertVal * 0.621).toFixed(2)} miles
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Feet</span>
                  <span className="text-2xl font-bold font-mono text-blue-500">
                    {(convertVal * 3280.84).toFixed(0)} ft
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
