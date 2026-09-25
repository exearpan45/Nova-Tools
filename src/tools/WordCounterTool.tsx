import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, Download, FileText } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { addScratchpadItem } from '../utils/scratchpad';

export const WordCounterTool: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState<string>(
    'NOVA TOOLS provides clean, fast, and lightweight browser utilities. Everything works locally in your browser with zero bloat and complete privacy.'
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        chars: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: '0 sec',
        speakingTime: '0 sec'
      };
    }

    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    // Sentences count: splitting by ., !, ?
    const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    // Paragraphs count: splitting by double newlines or single newlines with content
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // Reading time at 200 words per minute
    const readMin = words / 200;
    const readingTime = readMin < 1 ? `${Math.ceil(readMin * 60)} sec` : `${Math.ceil(readMin)} min`;

    // Speaking time at 130 words per minute
    const speakMin = words / 130;
    const speakingTime = speakMin < 1 ? `${Math.ceil(speakMin * 60)} sec` : `${Math.ceil(speakMin)} min`;

    return {
      words,
      chars,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime
    };
  }, [text]);

  const formattedResultsReport = useMemo(() => {
    return [
      `--- WORD COUNTER ANALYSIS REPORT ---`,
      `Words: ${stats.words.toLocaleString()}`,
      `Characters (with spaces): ${stats.chars.toLocaleString()}`,
      `Characters (no spaces): ${stats.charsNoSpaces.toLocaleString()}`,
      `Sentences: ${stats.sentences.toLocaleString()}`,
      `Paragraphs: ${stats.paragraphs.toLocaleString()}`,
      `Estimated Reading Time: ${stats.readingTime}`,
      `Estimated Speaking Time: ${stats.speakingTime}`,
      `\n--- PROCESSED TEXT CONTENT ---`,
      text
    ].join('\n');
  }, [stats, text]);

  const handleCopyText = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Text copied to clipboard', 'success');
      addScratchpadItem('word-counter', `${stats.words} words, ${stats.chars} chars`);
    }
  };

  const handleCopyAllResults = async () => {
    if (!text) return;
    const ok = await copyToClipboard(formattedResultsReport);
    if (ok) {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
      showToast('All results & metrics copied to clipboard', 'success');
      addScratchpadItem('word-counter', `${stats.words} words report`, 'Analysis Report');
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([formattedResultsReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `word-count-report-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded text & analysis report', 'success');
  };

  const handleClear = () => {
    setText('');
    showToast('Input cleared', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-result-in">
        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <div className="text-xl sm:text-2xl font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {stats.words.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Words</div>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <div className="text-xl sm:text-2xl font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {stats.chars.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Characters</div>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <div className="text-xl sm:text-2xl font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {stats.charsNoSpaces.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium mt-0.5">No Spaces</div>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <div className="text-xl sm:text-2xl font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {stats.sentences.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Sentences</div>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <div className="text-xl sm:text-2xl font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            {stats.paragraphs.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Paragraphs</div>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-center">
          <div className="text-xl sm:text-2xl font-mono font-semibold text-blue-600 dark:text-blue-400">
            {stats.readingTime}
          </div>
          <div className="text-[11px] text-neutral-500 font-medium mt-0.5">Reading Time</div>
        </div>
      </div>

      {/* Text Area */}
      <div>
        <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
          <label htmlFor="word-counter-area" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Input Text
          </label>
          <div className="flex items-center gap-2">
            {text && (
              <>
                <button
                  type="button"
                  data-action="primary"
                  onClick={handleCopyAllResults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
                  title="Copy all analysis metrics (words, chars, reading time) and text"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'All Results Copied' : 'Copy All Results'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 cursor-pointer py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Copy raw text only"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Download analysis report"
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
              </>
            )}
          </div>
        </div>

        <textarea
          id="word-counter-area"
          data-action="output"
          rows={9}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed font-sans"
        />
      </div>
    </div>
  );
};
