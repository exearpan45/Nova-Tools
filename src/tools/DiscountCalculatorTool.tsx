import React, { useState, useId } from 'react';
import { Copy, RotateCcw, Check, Percent, DollarSign, Tag, ArrowRight } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

export const DiscountCalculatorTool: React.FC = () => {
  const { showToast } = useToast();
  const [originalPrice, setOriginalPrice] = useState<string>('80');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<string>('25');
  const [taxPercent, setTaxPercent] = useState<string>('0');
  const [copied, setCopied] = useState<boolean>(false);

  const priceInputId = useId();
  const discountInputId = useId();
  const taxInputId = useId();

  const priceNum = parseFloat(originalPrice) || 0;
  const discountNum = parseFloat(discountValue) || 0;
  const taxNum = parseFloat(taxPercent) || 0;

  // Calculation
  let savings = 0;
  if (discountType === 'percent') {
    savings = (priceNum * Math.min(100, Math.max(0, discountNum))) / 100;
  } else {
    savings = Math.min(priceNum, Math.max(0, discountNum));
  }

  const priceAfterDiscount = Math.max(0, priceNum - savings);
  const taxAmount = (priceAfterDiscount * Math.max(0, taxNum)) / 100;
  const finalPrice = priceAfterDiscount + taxAmount;
  const totalSavingsPercent = priceNum > 0 ? (savings / priceNum) * 100 : 0;

  const handlePreset = (pct: number) => {
    setDiscountType('percent');
    setDiscountValue(pct.toString());
  };

  const handleReset = () => {
    setOriginalPrice('');
    setDiscountValue('');
    setTaxPercent('0');
    showToast('Values reset', 'info');
  };

  const handleCopySummary = async () => {
    const summary = `Original Price: $${priceNum.toFixed(2)} | Discount: ${discountType === 'percent' ? `${discountNum}%` : `$${discountNum.toFixed(2)}`} | You Save: $${savings.toFixed(2)} | Final Price: $${finalPrice.toFixed(2)}${taxNum > 0 ? ` (inc. $${taxAmount.toFixed(2)} tax)` : ''}`;
    const success = await copyToClipboard(summary);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Calculation copied to clipboard', 'success');
      addScratchpadItem('discount-calculator', `$${finalPrice.toFixed(2)} (Save $${savings.toFixed(2)})`, `Orig $${priceNum.toFixed(2)}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Input Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Original Price */}
        <div className="bg-white dark:bg-[#18181b] p-4 rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-2">
          <label htmlFor={priceInputId} className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            Original Price ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm">
              $
            </span>
            <input
              id={priceInputId}
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Discount Value & Type */}
        <div className="bg-white dark:bg-[#18181b] p-4 rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={discountInputId} className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Discount
            </label>
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setDiscountType('percent')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  discountType === 'percent'
                    ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                % Off
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  discountType === 'fixed'
                    ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                $ Off
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              id={discountInputId}
              type="number"
              min="0"
              step="any"
              placeholder={discountType === 'percent' ? '25' : '10.00'}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-neutral-900 dark:text-neutral-100"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">
              {discountType === 'percent' ? '%' : '$'}
            </span>
          </div>
        </div>

        {/* Sales Tax (Optional) */}
        <div className="bg-white dark:bg-[#18181b] p-4 rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-2">
          <label htmlFor={taxInputId} className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            Sales Tax (%) <span className="text-[10px] text-neutral-400 font-normal">Optional</span>
          </label>
          <div className="relative">
            <input
              id={taxInputId}
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-neutral-900 dark:text-neutral-100"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">
              %
            </span>
          </div>
        </div>
      </div>

      {/* Quick Discount Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-neutral-400 font-medium">Quick %:</span>
        {[10, 15, 20, 25, 30, 40, 50, 70].map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => handlePreset(pct)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
              discountType === 'percent' && discountValue === pct.toString()
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold'
                : 'bg-white dark:bg-[#18181b] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            {pct}%
          </button>
        ))}
      </div>

      {/* Prominent Results Summary */}
      <div className="bg-gradient-to-br from-blue-500/5 via-neutral-50 to-neutral-50 dark:from-blue-950/20 dark:via-[#18181b] dark:to-[#18181b] p-6 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Final Discounted Price</span>
            </div>
            <div
              data-action="output"
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-mono"
            >
              ${finalPrice.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-action="primary"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>
            <button
              type="button"
              data-action="reset"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium text-xs transition-colors cursor-pointer"
              title="Reset values (Esc)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
          <div className="p-3 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/60">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">You Save</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              ${savings.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/60">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Savings %</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {totalSavingsPercent.toFixed(1)}%
            </span>
          </div>
          <div className="p-3 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/60">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Price Before Tax</span>
            <span className="text-base font-bold text-neutral-800 dark:text-neutral-200 font-mono">
              ${priceAfterDiscount.toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/60">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Tax Added</span>
            <span className="text-base font-bold text-neutral-800 dark:text-neutral-200 font-mono">
              ${taxAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
