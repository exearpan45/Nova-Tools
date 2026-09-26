import React, { useState, useMemo } from 'react';
import { Copy, Check, Trash2, ArrowDown } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';

export const Base64Tool: React.FC = () => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('Hello, World! 🚀');
  const [copied, setCopied] = useState<boolean>(false);

  // UTF-8 safe Base64 encoder/decoder
  const resultData = useMemo(() => {
    if (!input) return { text: '', error: null };

    if (mode === 'encode') {
      try {
        const bytes = new TextEncoder().encode(input);
        let binString = '';
        bytes.forEach((b) => (binString += String.fromCharCode(b)));
        const encoded = btoa(binString);
        return { text: encoded, error: null };
      } catch (err: any) {
        return { text: '', error: 'Failed to encode input.' };
      }
    } else {
      // Decode
      try {
        const cleaned = input.trim();
        const binString = atob(cleaned);
        const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
        const decoded = new TextDecoder().decode(bytes);
        return { text: decoded, error: null };
      } catch (err: any) {
        return {
          text: '',
          error: 'The input is not a valid Base64 string. Please check the characters and padding.'
        };
      }
    }
  }, [input, mode]);

  const handleCopy = async () => {
    if (!resultData.text) return;
    const ok = await copyToClipboard(resultData.text);
    if (ok) {
      setCopied(true);
      showToast('✓ Copied to clipboard', 'copied');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Copy unavailable', 'error');
    }
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="inline-flex p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/60">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'encode'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Encode to Base64
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'decode'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Decode from Base64
          </button>
        </div>

        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Input Field */}
      <div>
        <label htmlFor="base64-input" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
          {mode === 'encode' ? 'Text to Encode' : 'Base64 String to Decode'}
        </label>
        <textarea
          id="base64-input"
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Type or paste plain text here...' : 'Paste valid Base64 string here...'}
          className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-center">
        <div className="p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* Output Field */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="base64-output" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {mode === 'encode' ? 'Base64 Output' : 'Decoded Text Output'}
          </label>
          {resultData.text && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        {resultData.error ? (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-300">
            {resultData.error}
          </div>
        ) : (
          <div key={resultData.text} className="animate-result-in">
            <textarea
              id="base64-output"
              readOnly
              rows={5}
              value={resultData.text}
              placeholder="Result will appear here..."
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none select-all"
            />
          </div>
        )}
      </div>
    </div>
  );
};
