import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check } from 'lucide-react';

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState<string>(
    'NOVA TOOLS provides clean, fast, and lightweight browser utilities. Everything works locally in your browser with zero bloat and complete privacy.'
  );
  const [copied, setCopied] = useState<boolean>(false);

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

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="word-counter-area" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Input Text
          </label>
          <div className="flex items-center gap-2">
            {text && (
              <>
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
                  onClick={handleClear}
                  className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
