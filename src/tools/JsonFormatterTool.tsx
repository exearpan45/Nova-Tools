import React, { useState } from 'react';
import { Copy, Check, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const JsonFormatterTool: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(
    '{\n  "product": "NOVA TOOLS",\n  "status": "production",\n  "features": ["fast", "clean", "browser-based"],\n  "year": 2026\n}'
  );
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab'>('2');
  const [validationStatus, setValidationStatus] = useState<{
    valid: boolean;
    message?: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const getIndent = () => {
    if (indentSize === '4') return 4;
    if (indentSize === 'tab') return '\t';
    return 2;
  };

  const handleFormat = () => {
    if (!jsonInput.trim()) {
      setValidationStatus(null);
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, getIndent());
      setJsonInput(formatted);
      setValidationStatus({ valid: true, message: 'Valid JSON formatted successfully.' });
    } catch (err: any) {
      setValidationStatus({
        valid: false,
        message: err.message || 'Invalid JSON syntax'
      });
    }
  };

  const handleMinify = () => {
    if (!jsonInput.trim()) {
      setValidationStatus(null);
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      setValidationStatus({ valid: true, message: 'Valid JSON minified successfully.' });
    } catch (err: any) {
      setValidationStatus({
        valid: false,
        message: err.message || 'Invalid JSON syntax'
      });
    }
  };

  const handleValidate = () => {
    if (!jsonInput.trim()) {
      setValidationStatus(null);
      return;
    }
    try {
      JSON.parse(jsonInput);
      setValidationStatus({ valid: true, message: 'JSON syntax is 100% valid.' });
    } catch (err: any) {
      setValidationStatus({
        valid: false,
        message: err.message || 'Invalid JSON syntax'
      });
    }
  };

  const handleCopy = () => {
    if (!jsonInput) return;
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setJsonInput('');
    setValidationStatus(null);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Format / Beautify
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Minify
          </button>
          <button
            type="button"
            onClick={handleValidate}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Validate
          </button>

          <div className="flex items-center gap-1.5 ml-2 text-xs text-neutral-500">
            <span>Indent:</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(e.target.value as any)}
              className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-neutral-400 hover:text-red-500 p-1.5 rounded cursor-pointer"
            title="Clear editor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status banner */}
      {validationStatus && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium border ${
            validationStatus.valid
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300'
          }`}
        >
          {validationStatus.valid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
          <span className="font-mono">{validationStatus.message}</span>
        </div>
      )}

      {/* Editor Box */}
      <div className="relative">
        <textarea
          id="json-textarea"
          rows={14}
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            if (validationStatus) setValidationStatus(null);
          }}
          placeholder="Paste raw JSON here..."
          className="w-full p-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-[#121214] font-mono text-xs leading-relaxed text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
