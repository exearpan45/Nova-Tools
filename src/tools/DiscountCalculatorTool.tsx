import React, { useState, useId } from 'react';
import { Copy, RotateCcw, Check, Percent, DollarSign, Tag, ArrowRight, AlertCircle } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

export type DiscountValidationResult =
  | { valid: false; error: string }
  | {
      valid: true;
      price: number;
      discount: number;
      tax: number;
      savings: number;
      priceAfterDiscount: number;
      taxAmount: number;
      finalPrice: number;
      effectiveDiscountPercent: number;
      warning: string | null;
      error: null;
    };

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

  // Validate inputs
  const parseValidation: DiscountValidationResult = React.useMemo(() => {
    if (!originalPrice.trim()) {
      return { valid: false, error: 'Please enter the original price.' };
    }
    const price = parseFloat(originalPrice);
    if (isNaN(price)) {
      return { valid: false, error: 'Original price must be a valid number.' };
    }
    if (price < 0) {
      return { valid: false, error: 'Original price cannot be negative.' };
    }

    if (!discountValue.trim()) {
      return { valid: false, error: 'Please enter the discount value.' };
    }
    const discount = parseFloat(discountValue);
    if (isNaN(discount)) {
      return { valid: false, error: 'Discount must be a valid number.' };
    }
    if (discount < 0) {
      return { valid: false, error: 'Discount value cannot be negative.' };
    }
    if (discountType === 'percent' && discount > 100) {
      return { valid: false, error: 'Discount percentage cannot exceed 100%.' };
    }

    let tax = 0;
    if (taxPercent.trim()) {
      tax = parseFloat(taxPercent);
      if (isNaN(tax)) {
        return { valid: false, error: 'Sales tax must be a valid number.' };
      }
      if (tax < 0) {
        return { valid: false, error: 'Sales tax cannot be negative.' };
      }
      if (tax > 100) {
        return { valid: false, error: 'Sales tax cannot exceed 100%.' };
      }
    }

    // Mathematical calculations
    let savings = 0;
    let warning: string | null = null;
    if (discountType === 'percent') {
      savings = (price * discount) / 100;
    } else {
      if (discount > price) {
        savings = price;
        warning = 'Fixed discount exceeds the original price. The item is effectively free ($0.00).';
      } else {
        savings = discount;
      }
    }

    const priceAfterDiscount = Math.max(0, price - savings);
    const taxAmount = (priceAfterDiscount * tax) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;
    const effectiveDiscountPercent = price > 0 ? (savings / price) * 100 : 0;

    return {
      valid: true,
      price,
      discount,
      tax,
      savings,
      priceAfterDiscount,
      taxAmount,
      finalPrice,
      effectiveDiscountPercent,
      warning,
      error: null
    };
  }, [originalPrice, discountType, discountValue, taxPercent]);

  const handlePreset = (pct: number) => {
    setDiscountType('percent');
    setDiscountValue(pct.toString());
  };

  const handleReset = () => {
    setOriginalPrice('80');
    setDiscountType('percent');
    setDiscountValue('25');
    setTaxPercent('0');
    showToast('Values reset to defaults', 'info');
  };

  const handleCopySummary = async () => {
    if (!parseValidation.valid) return;
    const { price, discount, savings, finalPrice, tax, taxAmount } = parseValidation;
    const summary = `Original Price: $${price.toFixed(2)} | Discount: ${discountType === 'percent' ? `${discount}%` : `$${discount.toFixed(2)}`} | You Save: $${savings.toFixed(2)} | Final Price: $${finalPrice.toFixed(2)}${tax > 0 ? ` (inc. $${taxAmount.toFixed(2)} tax)` : ''}`;
    const success = await copyToClipboard(summary);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Calculation copied to clipboard', 'success');
      addScratchpadItem('discount-calculator', `$${finalPrice.toFixed(2)} (Save $${savings.toFixed(2)})`, `Orig $${price.toFixed(2)}`);
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
              max="100"
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-neutral-400 font-medium">Quick %:</span>
          {[5, 10, 15, 20, 25, 30, 40, 50, 70, 75].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handlePreset(pct)}
              className="px-2.5 py-1 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              {pct}%
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Validation Error Banner */}
      {!parseValidation.valid && (
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{parseValidation.error}</span>
        </div>
      )}

      {/* Warning Notice if fixed discount exceeds price */}
      {parseValidation.valid && parseValidation.warning && (
        <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{parseValidation.warning}</span>
        </div>
      )}

      {/* Result Cards Display */}
      {parseValidation.valid && (
        <div className="space-y-4 animate-result-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Final Price Card */}
            <div className="bg-neutral-900 text-white dark:bg-[#18181b] dark:border dark:border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Final Price to Pay
                </span>
                <div
                  data-action="output"
                  className="text-4xl sm:text-5xl font-mono font-bold text-emerald-400 mt-2 tracking-tight"
                >
                  ${parseValidation.finalPrice.toFixed(2)}
                </div>
              </div>
              <div className="text-xs text-neutral-400 mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span>Original: ${parseValidation.price.toFixed(2)}</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  {parseValidation.effectiveDiscountPercent.toFixed(1)}% total savings
                </span>
              </div>
            </div>

            {/* Savings Card */}
            <div className="bg-white dark:bg-[#18181b] border border-neutral-200/90 dark:border-neutral-800/90 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
                  You Save
                </span>
                <div className="text-4xl sm:text-5xl font-mono font-bold text-blue-600 dark:text-blue-400 mt-2 tracking-tight">
                  ${parseValidation.savings.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-500">
                  {discountType === 'percent' ? `${parseValidation.discount}% off regular price` : `$${parseValidation.discount.toFixed(2)} instant discount`}
                </span>
                <button
                  type="button"
                  data-action="primary"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Breakdown'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Consistency Breakdown Table */}
          <div className="bg-white dark:bg-[#18181b] rounded-xl border border-neutral-200/80 dark:border-neutral-800 p-4 space-y-2 text-xs">
            <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[11px] mb-2">
              Mathematical Verification Breakdown
            </h4>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-500">Original Price:</span>
              <span className="font-mono font-medium">${parseValidation.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-500">
                Discount ({discountType === 'percent' ? `${parseValidation.discount}%` : `$${parseValidation.discount.toFixed(2)}`}):
              </span>
              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                -${parseValidation.savings.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-500">Subtotal after discount:</span>
              <span className="font-mono font-medium">${parseValidation.priceAfterDiscount.toFixed(2)}</span>
            </div>
            {parseValidation.tax > 0 && (
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Sales Tax ({parseValidation.tax}%):</span>
                <span className="font-mono font-medium">+${parseValidation.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 font-semibold text-neutral-900 dark:text-neutral-100">
              <span>Final Total Price:</span>
              <span className="font-mono text-sm">${parseValidation.finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
