import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, Download, FileText } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';
import { countGraphemes, countWordsUnicode } from '../utils/textMetrics';

export const CharacterCounterTool: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState<string>('Simple tools. Done well. Built with care.');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const breakdown = useMemo(() => {
    const totalChars = countGraphemes(text);
    const letters = (text.match(/\p{L}/gu) || []).length;
    const digits = (text.match(/\d/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const lines = text.length > 0 ? text.split('\n').length : 0;
    const symbols = Math.max(0, totalChars - letters - digits - spaces);
    const words = countWordsUnicode(text);

    return {
      totalChars,
      letters,
      digits,
      spaces,
      symbols,
      lines,
      words
    };
  }, [text]);

  const fullReport = useMemo(() => {
    return [
      `--- CHARACTER ANALYSIS BREAKDOWN ---`,
      `Total Characters: ${breakdown.totalChars.toLocaleString()}`,
      `Letters: ${breakdown.letters.toLocaleString()}`,
      `Digits: ${breakdown.digits.toLocaleString()}`,
      `Spaces & Whitespace: ${breakdown.spaces.toLocaleString()}`,
      `Symbols & Punctuation: ${breakdown.symbols.toLocaleString()}`,
      `Words: ${breakdown.words.toLocaleString()}`,
      `Lines: ${breakdown.lines.toLocaleString()}`,
      `\n--- SOURCE TEXT ---`,
      text
    ].join('\n');
  }, [breakdown, text]);

  const handleCopyText = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Text copied to clipboard', 'success');
      addScratchpadItem('character-counter', text.slice(0, 80));
    }
  };

  const handleCopyAllResults = async () => {
    if (!text) return;
    const ok = await copyToClipboard(fullReport);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
      showToast('All character metrics and text copied to clipboard', 'success');
      addScratchpadItem('character-counter', `${breakdown.totalChars} characters breakdown`, 'Character Report');
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([fullReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `character-count-report-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded character count report', 'success');
  };

  const handleClear = () => {
    setText('');
    showToast('Input cleared', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-result-in">
        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <div className="text-2xl font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {breakdown.totalChars}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium">Total Characters</div>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <div className="text-2xl font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {breakdown.letters}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium">Letters</div>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <div className="text-2xl font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {breakdown.digits}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium">Digits</div>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <div className="text-2xl font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {breakdown.spaces}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium">Whitespace & Spaces</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-600 dark:text-neutral-400 px-1">
        <div>
          Symbols & Punctuation: <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">{breakdown.symbols}</span>
        </div>
        <div>
          Lines: <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">{breakdown.lines}</span>
        </div>
        <div>
          Words: <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">{breakdown.words}</span>
        </div>
      </div>

      {/* Text Area */}
      <div>
        <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
          <label htmlFor="char-counter-area" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Enter or paste text
          </label>
          {text && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-action="primary"
                onClick={handleCopyAllResults}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
                title="Copy all character statistics and text"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'All Results Copied' : 'Copy All Results'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Copy text only"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Download full character report"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                type="button"
                data-action="reset"
                onClick={handleClear}
                className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1 cursor-pointer py-1.5 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Clear input (Esc)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>

        <textarea
          id="char-counter-area"
          data-action="output"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or write text to count characters..."
          className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed font-sans"
        />
      </div>
    </div>
  );
};
