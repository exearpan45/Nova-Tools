import React, { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState<string>('nova tools simple fast utilities');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Conversion algorithms
  const toUppercase = (str: string) => str.toUpperCase();
  const toLowercase = (str: string) => str.toLowerCase();

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

  const toSentenceCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    const words = str
      .replace(/[^a-zA-Z0-9\s_-]/g, '')
      .split(/[\s_-]+/)
      .filter(Boolean);
    if (!words.length) return '';
    return (
      words[0].toLowerCase() +
      words
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('')
    );
  };

  const toSnakeCase = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[^a-zA-Z0-9\s_-]/g, '')
      .trim()
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase())
      .join('_');
  };

  const toKebabCase = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[^a-zA-Z0-9\s_-]/g, '')
      .trim()
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase())
      .join('-');
  };

  const toConstantCase = (str: string) => {
    return toSnakeCase(str).toUpperCase();
  };

  const cases = [
    { id: 'upper', name: 'UPPERCASE', result: toUppercase(text) },
    { id: 'lower', name: 'lowercase', result: toLowercase(text) },
    { id: 'title', name: 'Title Case', result: toTitleCase(text) },
    { id: 'sentence', name: 'Sentence case', result: toSentenceCase(text) },
    { id: 'camel', name: 'camelCase', result: toCamelCase(text) },
    { id: 'snake', name: 'snake_case', result: toSnakeCase(text) },
    { id: 'kebab', name: 'kebab-case', result: toKebabCase(text) },
    { id: 'constant', name: 'CONSTANT_CASE', result: toConstantCase(text) },
  ];

  const handleCopy = (convertedText: string, id: string) => {
    navigator.clipboard.writeText(convertedText);
    setCopiedFormat(id);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleApplyToInput = (newVal: string) => {
    setText(newVal);
  };

  return (
    <div className="space-y-6">
      {/* Input Text Area */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="case-input" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Source Text
          </label>
          {text && (
            <button
              type="button"
              onClick={() => setText('')}
              className="text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          id="case-input"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Case Options & Instant Copy */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Converted Formats
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cases.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  {c.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleApplyToInput(c.result)}
                    className="text-[11px] text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 px-1.5 py-0.5 rounded hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Load into main input"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(c.result, c.id)}
                    className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    {copiedFormat === c.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-[11px] text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-xs font-mono text-neutral-800 dark:text-neutral-200 truncate bg-white dark:bg-neutral-800 p-2 rounded border border-neutral-200/60 dark:border-neutral-700/60 select-all">
                {c.result || <span className="text-neutral-400 italic">Empty</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
