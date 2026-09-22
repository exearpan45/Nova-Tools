import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check } from 'lucide-react';

export const CharacterCounterTool: React.FC = () => {
  const [text, setText] = useState<string>('Simple tools. Done well. Built with care.');
  const [copied, setCopied] = useState<boolean>(false);

  const breakdown = useMemo(() => {
    const totalChars = text.length;
    const letters = (text.match(/\p{L}/gu) || []).length;
    const digits = (text.match(/\d/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const lines = text.length > 0 ? text.split('\n').length : 0;
    const symbols = totalChars - letters - digits - spaces;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

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

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="char-counter-area" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Enter or paste text
          </label>
          {text && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => setText('')}
                className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>

        <textarea
          id="char-counter-area"
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
