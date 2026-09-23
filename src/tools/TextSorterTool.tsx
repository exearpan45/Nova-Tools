import React, { useState } from 'react';
import { Copy, Check, Download, RotateCcw, ArrowUpDown, ListFilter, Shuffle } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

export const TextSorterTool: React.FC = () => {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState<string>(
    `Banana\nApple\nOrange\nApple\n10. Mango\n2. Grape\n1. Pineapple\nWatermelon\n  Papaya  `
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Compute live statistics
  const rawLines = inputText.split(/\r?\n/);
  const totalLines = rawLines.length;
  const nonEmptyLines = rawLines.filter((l) => l.trim().length > 0);
  const uniqueCount = new Set(nonEmptyLines).size;
  const duplicateCount = Math.max(0, nonEmptyLines.length - uniqueCount);

  const applySort = (sorter: (lines: string[]) => string[]) => {
    const lines = inputText.split(/\r?\n/);
    const sorted = sorter(lines);
    const result = sorted.join('\n');
    setInputText(result);
    showToast('Text sorted', 'info');
  };

  const sortAz = () => applySort((lines) => [...lines].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })));
  const sortZa = () => applySort((lines) => [...lines].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' })));
  const sortNatural = () => applySort((lines) => [...lines].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })));
  const sortLengthAsc = () => applySort((lines) => [...lines].sort((a, b) => a.length - b.length || a.localeCompare(b)));
  const sortLengthDesc = () => applySort((lines) => [...lines].sort((a, b) => b.length - a.length || a.localeCompare(b)));
  const reverseLines = () => applySort((lines) => [...lines].reverse());
  
  const shuffleLines = () => {
    applySort((lines) => {
      const arr = [...lines];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  };

  const removeDuplicates = () => {
    const lines = inputText.split(/\r?\n/);
    const seen = new Set<string>();
    const deduplicated: string[] = [];
    for (const line of lines) {
      if (!seen.has(line)) {
        seen.add(line);
        deduplicated.push(line);
      }
    }
    setInputText(deduplicated.join('\n'));
    showToast(`Removed duplicates (${duplicateCount} found)`, 'success');
  };

  const trimWhitespace = () => {
    const lines = inputText.split(/\r?\n/).map((l) => l.trim());
    setInputText(lines.join('\n'));
    showToast('Trimmed leading/trailing spaces', 'info');
  };

  const removeEmptyLines = () => {
    const lines = inputText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    setInputText(lines.join('\n'));
    showToast('Removed blank lines', 'info');
  };

  const handleCopy = async () => {
    if (!inputText) return;
    const success = await copyToClipboard(inputText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Text copied to clipboard', 'success');
      addScratchpadItem('text-sorter', `${totalLines} lines (${uniqueCount} unique)`, 'Sorted List');
    }
  };

  const handleDownload = () => {
    if (!inputText) return;
    const blob = new Blob([inputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sorted-text-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded sorted text', 'success');
  };

  const handleClear = () => {
    setInputText('');
    showToast('Text cleared', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Live Counter Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-[#18181b] border border-neutral-200/90 dark:border-neutral-800/90 text-center">
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Total Lines</span>
          <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">{totalLines}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#18181b] border border-neutral-200/90 dark:border-neutral-800/90 text-center">
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Unique Lines</span>
          <span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">{uniqueCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#18181b] border border-neutral-200/90 dark:border-neutral-800/90 text-center">
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Duplicates</span>
          <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">{duplicateCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#18181b] border border-neutral-200/90 dark:border-neutral-800/90 text-center">
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Characters</span>
          <span className="text-lg font-bold font-mono text-neutral-700 dark:text-neutral-300">{inputText.length}</span>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="bg-white dark:bg-[#18181b] p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
            <ListFilter className="w-3.5 h-3.5 text-blue-500" />
            Lines Input & Editor
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-action="primary"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
              title="Copy all sorted results"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'All Lines Copied' : 'Copy All Results'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Download text file"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              data-action="reset"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Clear all text (Esc)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          data-action="output"
          rows={10}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type lines here..."
          className="w-full p-3 font-mono text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-neutral-900 dark:text-neutral-100 resize-y"
        />
      </div>

      {/* Action Buttons Toolbar */}
      <div className="bg-white dark:bg-[#18181b] p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 space-y-3">
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Sort Operations
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={sortAz}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
          >
            A → Z
          </button>
          <button
            type="button"
            onClick={sortZa}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
          >
            Z → A
          </button>
          <button
            type="button"
            onClick={sortNatural}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
            title="Natural numerical sort (1, 2, 10 instead of 1, 10, 2)"
          >
            Natural Sort (1, 2, 10)
          </button>
          <button
            type="button"
            onClick={sortLengthAsc}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
          >
            Shortest First
          </button>
          <button
            type="button"
            onClick={sortLengthDesc}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
          >
            Longest First
          </button>
          <button
            type="button"
            onClick={reverseLines}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
          >
            Reverse Lines
          </button>
          <button
            type="button"
            onClick={shuffleLines}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <Shuffle className="w-3 h-3" />
            <span>Shuffle</span>
          </button>
        </div>

        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider pt-2 border-t border-neutral-100 dark:border-neutral-800">
          Clean & Filter
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={removeDuplicates}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300 font-medium hover:bg-amber-100 transition-colors cursor-pointer"
          >
            Remove Duplicates ({duplicateCount})
          </button>
          <button
            type="button"
            onClick={trimWhitespace}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium transition-colors cursor-pointer"
          >
            Trim Spaces
          </button>
          <button
            type="button"
            onClick={removeEmptyLines}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium transition-colors cursor-pointer"
          >
            Remove Blank Lines
          </button>
        </div>
      </div>
    </div>
  );
};
