import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';

type UnitCategory = 'Length' | 'Weight' | 'Area' | 'Volume' | 'Speed' | 'Time' | 'Digital Storage';

interface UnitDef {
  id: string;
  name: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const CATEGORY_UNITS: Record<UnitCategory, UnitDef[]> = {
  Length: [
    { id: 'm', name: 'Meters (m)', toBase: (v) => v, fromBase: (v) => v },
    { id: 'km', name: 'Kilometers (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'cm', name: 'Centimeters (cm)', toBase: (v) => v * 0.01, fromBase: (v) => v / 0.01 },
    { id: 'mm', name: 'Millimeters (mm)', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 },
    { id: 'in', name: 'Inches (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { id: 'ft', name: 'Feet (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { id: 'yd', name: 'Yards (yd)', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { id: 'mi', name: 'Miles (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 }
  ],
  Weight: [
    { id: 'kg', name: 'Kilograms (kg)', toBase: (v) => v, fromBase: (v) => v },
    { id: 'g', name: 'Grams (g)', toBase: (v) => v * 0.001, fromBase: (v) => v * 1000 },
    { id: 'mg', name: 'Milligrams (mg)', toBase: (v) => v * 0.000001, fromBase: (v) => v * 1000000 },
    { id: 'lb', name: 'Pounds (lb)', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
    { id: 'oz', name: 'Ounces (oz)', toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
    { id: 't', name: 'Metric Tonnes (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 }
  ],
  Area: [
    { id: 'sq_m', name: 'Square Meters (m²)', toBase: (v) => v, fromBase: (v) => v },
    { id: 'sq_km', name: 'Square Kilometers (km²)', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { id: 'sq_ft', name: 'Square Feet (ft²)', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { id: 'sq_yd', name: 'Square Yards (yd²)', toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
    { id: 'acre', name: 'Acres', toBase: (v) => v * 4046.8564, fromBase: (v) => v / 4046.8564 },
    { id: 'ha', name: 'Hectares (ha)', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 }
  ],
  Volume: [
    { id: 'l', name: 'Liters (L)', toBase: (v) => v, fromBase: (v) => v },
    { id: 'ml', name: 'Milliliters (mL)', toBase: (v) => v * 0.001, fromBase: (v) => v * 1000 },
    { id: 'cu_m', name: 'Cubic Meters (m³)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'gal_us', name: 'US Gallons (gal)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { id: 'qt_us', name: 'US Quarts (qt)', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { id: 'cup_us', name: 'US Cups', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 }
  ],
  Speed: [
    { id: 'm_s', name: 'Meters / sec (m/s)', toBase: (v) => v, fromBase: (v) => v },
    { id: 'km_h', name: 'Kilometers / hour (km/h)', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { id: 'mph', name: 'Miles / hour (mph)', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { id: 'knot', name: 'Knots (kn)', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 }
  ],
  Time: [
    { id: 's', name: 'Seconds (s)', toBase: (v) => v, fromBase: (v) => v },
    { id: 'min', name: 'Minutes (min)', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { id: 'hr', name: 'Hours (hr)', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { id: 'day', name: 'Days (d)', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    { id: 'wk', name: 'Weeks (wk)', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 }
  ],
  'Digital Storage': [
    { id: 'b', name: 'Bytes (B)', toBase: (v) => v, fromBase: (v) => v },
    { id: 'kb', name: 'Kilobytes (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    { id: 'mb', name: 'Megabytes (MB)', toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / 1024 ** 2 },
    { id: 'gb', name: 'Gigabytes (GB)', toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
    { id: 'tb', name: 'Terabytes (TB)', toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 }
  ]
};

export const UnitConverterTool: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('Length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');
  const [copied, setCopied] = useState<boolean>(false);

  const units = CATEGORY_UNITS[category];

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const newUnits = CATEGORY_UNITS[cat];
    setFromUnitId(newUnits[0].id);
    setToUnitId(newUnits[1]?.id || newUnits[0].id);
  };

  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const outputValue = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '';

    const fromDef = units.find((u) => u.id === fromUnitId);
    const toDef = units.find((u) => u.id === toUnitId);

    if (!fromDef || !toDef) return '';

    const baseVal = fromDef.toBase(val);
    const result = toDef.fromBase(baseVal);

    // Format clean representation (up to 8 decimal places if needed)
    return parseFloat(result.toFixed(8)).toString();
  }, [inputValue, fromUnitId, toUnitId, units]);

  const handleCopy = () => {
    if (!outputValue) return;
    navigator.clipboard.writeText(outputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
        {(Object.keys(CATEGORY_UNITS) as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              category === cat
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Conversion Form */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-3">
        {/* From Unit */}
        <div>
          <label htmlFor="from-unit-select" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            From
          </label>
          <div className="space-y-2">
            <select
              id="from-unit-select"
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap units"
            className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Unit */}
        <div>
          <label htmlFor="to-unit-select" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            To
          </label>
          <div className="space-y-2">
            <select
              id="to-unit-select"
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={outputValue}
                placeholder="Result"
                className="w-full px-3 py-2 pr-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 text-sm font-mono font-medium text-blue-600 dark:text-blue-400 focus:outline-none select-all"
              />
              {outputValue && (
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy result"
                  className="absolute right-2 top-2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
