import React, { useState } from 'react';
import { Copy, Check, Trash2, CheckCircle2, AlertCircle, Download, FileJson } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

export const JsonFormatterTool: React.FC = () => {
  const { showToast } = useToast();
  const [jsonInput, setJsonInput] = useState<string>(
    '{\n  "product": "NOVA TOOLS",\n  "status": "production",\n  "features": ["fast", "clean", "browser-based"],\n  "year": 2026\n}'
  );
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab'>('2');
  const [validationStatus, setValidationStatus] = useState<{
    valid: boolean;
    message?: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

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
      showToast('JSON formatted successfully', 'success');
      addScratchpadItem('json-formatter', formatted.slice(0, 100) + '...', 'Formatted JSON');
    } catch (err: any) {
      setValidationStatus({
        valid: false,
        message: err.message || 'Invalid JSON syntax'
      });
      showToast('Invalid JSON syntax', 'error');
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
      showToast('JSON minified to a single line', 'success');
      addScratchpadItem('json-formatter', minified.slice(0, 100) + '...', 'Minified JSON');
    } catch (err: any) {
      setValidationStatus({
        valid: false,
        message: err.message || 'Invalid JSON syntax'
      });
      showToast('Invalid JSON syntax', 'error');
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
      showToast('JSON syntax is valid', 'success');
    } catch (err: any) {
      setValidationStatus({
        valid: false,
        message: err.message || 'Invalid JSON syntax'
      });
      showToast('Invalid JSON syntax', 'error');
    }
  };

  const handleCopyAll = async () => {
    if (!jsonInput.trim()) return;
    const ok = await copyToClipboard(jsonInput);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
      showToast('Copied all JSON content to clipboard', 'success');
      addScratchpadItem('json-formatter', jsonInput.slice(0, 80) + '...', 'Complete JSON');
    }
  };

  const handleCopy = async () => {
    if (!jsonInput) return;
    const ok = await copyToClipboard(jsonInput);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('JSON copied to clipboard', 'success');
    }
  };

  const handleDownload = () => {
    if (!jsonInput.trim()) return;
    const blob = new Blob([jsonInput], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded JSON file', 'success');
  };

  const handleClear = () => {
    setJsonInput('');
    setValidationStatus(null);
    showToast('JSON editor cleared', 'info');
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
          {jsonInput && (
            <>
              <button
                type="button"
                data-action="primary"
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
                title="Copy all formatted or minified JSON results"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'All JSON Copied' : 'Copy All Results'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Download formatted JSON file"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            type="button"
            data-action="reset"
            onClick={handleClear}
            className="text-xs text-neutral-400 hover:text-red-500 p-1.5 rounded cursor-pointer"
            title="Clear editor (Esc)"
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
