import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Copy, Check, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

export type UnitCategory =
  | 'Length'
  | 'Mass / Weight'
  | 'Area'
  | 'Volume'
  | 'Speed'
  | 'Pressure'
  | 'Energy'
  | 'Power'
  | 'Digital Storage'
  | 'Time';

export interface UnitDef {
  id: string;
  name: string;
  abbr: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

export const CATEGORY_UNITS: Record<UnitCategory, UnitDef[]> = {
  Length: [
    { id: 'm', name: 'Meters', abbr: 'm', toBase: (v) => v, fromBase: (v) => v },
    { id: 'km', name: 'Kilometers', abbr: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'cm', name: 'Centimeters', abbr: 'cm', toBase: (v) => v * 0.01, fromBase: (v) => v / 0.01 },
    { id: 'mm', name: 'Millimeters', abbr: 'mm', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 },
    { id: 'in', name: 'Inches', abbr: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { id: 'ft', name: 'Feet', abbr: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { id: 'yd', name: 'Yards', abbr: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { id: 'mi', name: 'Miles', abbr: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { id: 'nmi', name: 'Nautical Miles', abbr: 'nmi', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
  ],
  'Mass / Weight': [
    { id: 'kg', name: 'Kilograms', abbr: 'kg', toBase: (v) => v, fromBase: (v) => v },
    { id: 'g', name: 'Grams', abbr: 'g', toBase: (v) => v * 0.001, fromBase: (v) => v * 1000 },
    { id: 'mg', name: 'Milligrams', abbr: 'mg', toBase: (v) => v * 1e-6, fromBase: (v) => v * 1e6 },
    { id: 'lb', name: 'Pounds', abbr: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
    { id: 'oz', name: 'Ounces', abbr: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
    { id: 't', name: 'Metric Tonnes', abbr: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'st', name: 'Stone', abbr: 'st', toBase: (v) => v * 6.35029318, fromBase: (v) => v / 6.35029318 },
  ],
  Area: [
    { id: 'sq_m', name: 'Square Meters', abbr: 'm²', toBase: (v) => v, fromBase: (v) => v },
    { id: 'sq_km', name: 'Square Kilometers', abbr: 'km²', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { id: 'sq_ft', name: 'Square Feet', abbr: 'ft²', toBase: (v) => v * 0.09290304, fromBase: (v) => v / 0.09290304 },
    { id: 'sq_yd', name: 'Square Yards', abbr: 'yd²', toBase: (v) => v * 0.83612736, fromBase: (v) => v / 0.83612736 },
    { id: 'acre', name: 'Acres', abbr: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 },
    { id: 'ha', name: 'Hectares', abbr: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  ],
  Volume: [
    { id: 'l', name: 'Liters', abbr: 'L', toBase: (v) => v, fromBase: (v) => v },
    { id: 'ml', name: 'Milliliters', abbr: 'mL', toBase: (v) => v * 0.001, fromBase: (v) => v * 1000 },
    { id: 'cu_m', name: 'Cubic Meters', abbr: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'gal_us', name: 'US Gallons', abbr: 'gal', toBase: (v) => v * 3.785411784, fromBase: (v) => v / 3.785411784 },
    { id: 'qt_us', name: 'US Quarts', abbr: 'qt', toBase: (v) => v * 0.946352946, fromBase: (v) => v / 0.946352946 },
    { id: 'pt_us', name: 'US Pints', abbr: 'pt', toBase: (v) => v * 0.473176473, fromBase: (v) => v / 0.473176473 },
    { id: 'cup_us', name: 'US Cups', abbr: 'cup', toBase: (v) => v * 0.2365882365, fromBase: (v) => v / 0.2365882365 },
    { id: 'floz_us', name: 'US Fluid Ounces', abbr: 'fl oz', toBase: (v) => v * 0.0295735295625, fromBase: (v) => v / 0.0295735295625 },
  ],
  Speed: [
    { id: 'm_s', name: 'Meters / second', abbr: 'm/s', toBase: (v) => v, fromBase: (v) => v },
    { id: 'km_h', name: 'Kilometers / hour', abbr: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { id: 'mph', name: 'Miles / hour', abbr: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { id: 'knot', name: 'Knots', abbr: 'kn', toBase: (v) => v * 0.5144444444, fromBase: (v) => v / 0.5144444444 },
    { id: 'ft_s', name: 'Feet / second', abbr: 'ft/s', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
  ],
  Pressure: [
    { id: 'pa', name: 'Pascals', abbr: 'Pa', toBase: (v) => v, fromBase: (v) => v },
    { id: 'kpa', name: 'Kilopascals', abbr: 'kPa', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'bar', name: 'Bar', abbr: 'bar', toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
    { id: 'psi', name: 'Pounds / sq inch', abbr: 'psi', toBase: (v) => v * 6894.757293168, fromBase: (v) => v / 6894.757293168 },
    { id: 'atm', name: 'Standard Atmospheres', abbr: 'atm', toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
    { id: 'torr', name: 'Torr (mmHg)', abbr: 'Torr', toBase: (v) => v * 133.322368421, fromBase: (v) => v / 133.322368421 },
  ],
  Energy: [
    { id: 'j', name: 'Joules', abbr: 'J', toBase: (v) => v, fromBase: (v) => v },
    { id: 'kj', name: 'Kilojoules', abbr: 'kJ', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'cal', name: 'Calories (thermochemical)', abbr: 'cal', toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
    { id: 'kcal', name: 'Kilocalories (Food Cal)', abbr: 'kcal', toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
    { id: 'wh', name: 'Watt-hours', abbr: 'Wh', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { id: 'kwh', name: 'Kilowatt-hours', abbr: 'kWh', toBase: (v) => v * 3.6e6, fromBase: (v) => v / 3.6e6 },
    { id: 'btu', name: 'British Thermal Units', abbr: 'BTU', toBase: (v) => v * 1055.05585, fromBase: (v) => v / 1055.05585 },
  ],
  Power: [
    { id: 'w', name: 'Watts', abbr: 'W', toBase: (v) => v, fromBase: (v) => v },
    { id: 'kw', name: 'Kilowatts', abbr: 'kW', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'mw', name: 'Megawatts', abbr: 'MW', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { id: 'hp', name: 'Mechanical Horsepower', abbr: 'hp', toBase: (v) => v * 745.699872, fromBase: (v) => v / 745.699872 },
    { id: 'ps', name: 'Metric Horsepower', abbr: 'PS', toBase: (v) => v * 735.49875, fromBase: (v) => v / 735.49875 },
  ],
  'Digital Storage': [
    // Bytes & Bits
    { id: 'b', name: 'Bytes', abbr: 'B', toBase: (v) => v, fromBase: (v) => v },
    { id: 'bit', name: 'Bits', abbr: 'bit', toBase: (v) => v * 0.125, fromBase: (v) => v / 0.125 },
    // Binary IEC (1024)
    { id: 'kib', name: 'Kibibytes (binary 1024 B)', abbr: 'KiB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    { id: 'mib', name: 'Mebibytes (binary 1024² B)', abbr: 'MiB', toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / 1024 ** 2 },
    { id: 'gib', name: 'Gibibytes (binary 1024³ B)', abbr: 'GiB', toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
    { id: 'tib', name: 'Tebibytes (binary 1024⁴ B)', abbr: 'TiB', toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
    // Decimal SI (1000)
    { id: 'kb', name: 'Kilobytes (decimal 1000 B)', abbr: 'kB', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'mb', name: 'Megabytes (decimal 1000² B)', abbr: 'MB', toBase: (v) => v * 1000 ** 2, fromBase: (v) => v / 1000 ** 2 },
    { id: 'gb', name: 'Gigabytes (decimal 1000³ B)', abbr: 'GB', toBase: (v) => v * 1000 ** 3, fromBase: (v) => v / 1000 ** 3 },
    { id: 'tb', name: 'Terabytes (decimal 1000⁴ B)', abbr: 'TB', toBase: (v) => v * 1000 ** 4, fromBase: (v) => v / 1000 ** 4 },
  ],
  Time: [
    { id: 'ms', name: 'Milliseconds', abbr: 'ms', toBase: (v) => v * 0.001, fromBase: (v) => v * 1000 },
    { id: 's', name: 'Seconds', abbr: 's', toBase: (v) => v, fromBase: (v) => v },
    { id: 'min', name: 'Minutes', abbr: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { id: 'hr', name: 'Hours', abbr: 'hr', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { id: 'day', name: 'Days', abbr: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    { id: 'wk', name: 'Weeks', abbr: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
  ],
};

function formatResult(num: number): string {
  if (num === 0) return '0';
  const abs = Math.abs(num);
  if (abs >= 1e9 || abs < 1e-5) {
    return num.toExponential(6);
  }
  // Remove floating point rounding artifacts up to 8 decimal places
  const rounded = Math.round(num * 1e8) / 1e8;
  return rounded.toString();
}

export const UnitConverterTool: React.FC = () => {
  const { showToast } = useToast();
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
    if (!inputValue.trim()) return '';
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '';

    const fromDef = units.find((u) => u.id === fromUnitId);
    const toDef = units.find((u) => u.id === toUnitId);

    if (!fromDef || !toDef) return '';

    const baseVal = fromDef.toBase(val);
    const result = toDef.fromBase(baseVal);

    return formatResult(result);
  }, [inputValue, fromUnitId, toUnitId, units]);

  const handleCopy = async () => {
    if (!outputValue) return;
    const ok = await copyToClipboard(outputValue);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Conversion result copied', 'success');
      addScratchpadItem('unit-converter', `${inputValue} ${fromUnitId} = ${outputValue} ${toUnitId}`);
    }
  };

  const handleReset = () => {
    setInputValue('1');
    const u = CATEGORY_UNITS[category];
    setFromUnitId(u[0].id);
    setToUnitId(u[1]?.id || u[0].id);
    showToast('Reset to default units', 'info');
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
                ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Conversion Form */}
      <div className="bg-white dark:bg-[#18181b] p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-3">
          {/* From Unit */}
          <div>
            <label htmlFor="from-unit-select" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              From
            </label>
            <div className="space-y-2">
              <input
                type="number"
                step="any"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <select
                id="from-unit-select"
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.abbr})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2.5 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
              title="Swap units"
              aria-label="Swap units"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To Unit */}
          <div>
            <label htmlFor="to-unit-select" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              To
            </label>
            <div className="space-y-2">
              <div key={outputValue} className="animate-result-in">
                <input
                  type="text"
                  readOnly
                  data-action="output"
                  value={outputValue}
                  placeholder="Result"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/60 text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 focus:outline-none"
                />
              </div>
              <select
                id="to-unit-select"
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.abbr})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {outputValue && (
            <button
              type="button"
              data-action="primary"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Result'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
