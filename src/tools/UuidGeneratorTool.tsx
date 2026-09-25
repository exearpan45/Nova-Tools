import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check, Download, RotateCcw, Fingerprint } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

function generateSingleUuid(uppercase: boolean, withHyphens: boolean, withBraces: boolean): string {
  let uuid: string;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    uuid = crypto.randomUUID();
  } else {
    // Cryptographic fallback using crypto.getRandomValues
    const buf = new Uint8Array(16);
    window.crypto.getRandomValues(buf);
    buf[6] = (buf[6] & 0x0f) | 0x40; // Version 4
    buf[8] = (buf[8] & 0x3f) | 0x80; // Variant 10
    const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
    uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }

  if (!withHyphens) {
    uuid = uuid.replace(/-/g, '');
  }

  if (uppercase) {
    uuid = uuid.toUpperCase();
  }

  if (withBraces) {
    uuid = `{${uuid}}`;
  }

  return uuid;
}

export const UuidGeneratorTool: React.FC = () => {
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [withHyphens, setWithHyphens] = useState<boolean>(true);
  const [withBraces, setWithBraces] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const handleGenerate = () => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      list.push(generateSingleUuid(uppercase, withHyphens, withBraces));
    }
    setUuids(list);
    if (list.length > 0) {
      addScratchpadItem('uuid-generator', list[0], `${quantity} UUID(s)`);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [quantity, uppercase, withHyphens, withBraces]);

  const handleCopySingle = async (val: string, index: number) => {
    const success = await copyToClipboard(val);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
      showToast('UUID copied to clipboard', 'success');
      addScratchpadItem('uuid-generator', val);
    }
  };

  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    const text = uuids.join('\n');
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
      showToast(`Copied ${uuids.length} UUIDs to clipboard`, 'success');
    }
  };

  const handleDownload = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded UUID text file', 'success');
  };

  const handleReset = () => {
    setQuantity(5);
    setUppercase(false);
    setWithHyphens(true);
    setWithBraces(false);
    handleGenerate();
    showToast('Reset to default UUID settings', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Controls & Options Bar */}
      <div className="bg-white dark:bg-[#18181b] p-4 sm:p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
              Quantity:
            </span>
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
              {[1, 5, 10, 25, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuantity(num)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    quantity === num
                      ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-action="primary"
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
            <button
              type="button"
              data-action="reset"
              onClick={handleReset}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Reset options (Esc)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <label className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Uppercase</span>
          </label>
          <label className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={withHyphens}
              onChange={(e) => setWithHyphens(e.target.checked)}
              className="rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Include Hyphens</span>
          </label>
          <label className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={withBraces}
              onChange={(e) => setWithBraces(e.target.checked)}
              className="rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Enclose in Braces &#123;...&#125;</span>
          </label>
        </div>
      </div>

      {/* UUID List Display */}
      <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 overflow-hidden animate-result-in">
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-blue-500" />
            Generated Version 4 UUIDs ({uuids.length})
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied All' : 'Copy All'}</span>
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 max-h-[360px] overflow-y-auto">
          {uuids.map((id, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50 group transition-colors"
            >
              <span className="font-mono text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 select-all break-all">
                {id}
              </span>
              <button
                type="button"
                onClick={() => handleCopySingle(id, index)}
                className="ml-3 p-1.5 rounded-md text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                title="Copy single UUID"
              >
                {copiedIndex === index ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
