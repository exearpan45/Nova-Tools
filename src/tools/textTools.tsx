import React, { useState, useMemo } from 'react';
import {
  Copy, Check, RefreshCw, Trash2, ArrowUpDown, AlignLeft,
  Search, CaseSensitive, GitCompare, Sparkles, FileText
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface TextProps {
  toolSlug: string;
}

export const TextTools: React.FC<TextProps> = ({ toolSlug }) => {
  const [inputText, setInputText] = useState<string>(
    'NOVA TOOLS is an all-in-one productivity suite engineered for speed, privacy, and precision.'
  );
  const [secondaryText, setSecondaryText] = useState<string>(
    'NOVA TOOLS is a premium productivity suite engineered for speed, local privacy, and high precision.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Find & Replace
  const [findStr, setFindStr] = useState<string>('');
  const [replaceStr, setReplaceStr] = useState<string>('');
  const [useRegex, setUseRegex] = useState<boolean>(false);

  // Sorting options
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | 'length' | 'shuffle'>('asc');

  // Lorem Ipsum options
  const [loremCount, setLoremCount] = useState<number>(3);
  const [loremType, setLoremType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');

  // Text Stats
  const stats = useMemo(() => {
    const text = inputText;
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const nonEmptyLines = text ? text.split(/\r\n|\r|\n/).filter((l) => l.trim().length > 0).length : 0;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed]).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length : 0;
    const readingTimeMinutes = Math.ceil(words / 200);
    const speakingTimeMinutes = Math.ceil(words / 130);

    return {
      words,
      characters,
      charactersNoSpaces,
      lines,
      nonEmptyLines,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [inputText]);

  // Derived output text based on toolSlug
  const transformedText = useMemo(() => {
    if (!inputText) return '';

    switch (toolSlug) {
      case 'uppercase-converter':
        return inputText.toUpperCase();
      case 'lowercase-converter':
        return inputText.toLowerCase();
      case 'title-case-converter':
        return inputText.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      case 'case-converter':
        return inputText; // Will show multi-format selector
      case 'remove-duplicate-lines': {
        const lines = inputText.split(/\r\n|\r|\n/);
        return Array.from(new Set(lines)).join('\n');
      }
      case 'remove-extra-spaces': {
        return inputText
          .split('\n')
          .map((line) => line.replace(/[ \t]+/g, ' ').trim())
          .join('\n')
          .replace(/\n{3,}/g, '\n\n');
      }
      case 'text-sorter': {
        const lines = inputText.split(/\r\n|\r|\n/);
        if (sortDirection === 'asc') return [...lines].sort((a, b) => a.localeCompare(b)).join('\n');
        if (sortDirection === 'desc') return [...lines].sort((a, b) => b.localeCompare(a)).join('\n');
        if (sortDirection === 'length') return [...lines].sort((a, b) => a.length - b.length).join('\n');
        if (sortDirection === 'shuffle') return [...lines].sort(() => Math.random() - 0.5).join('\n');
        return inputText;
      }
      case 'text-reverser': {
        return inputText.split('').reverse().join('');
      }
      case 'text-cleaner': {
        // Strip HTML, normalize quotes and dashes
        return inputText
          .replace(/<[^>]*>/g, '')
          .replace(/[“”]/g, '"')
          .replace(/[‘’]/g, "'")
          .replace(/[—–]/g, '-')
          .trim();
      }
      case 'find-and-replace': {
        if (!findStr) return inputText;
        try {
          if (useRegex) {
            const re = new RegExp(findStr, 'g');
            return inputText.replace(re, replaceStr);
          }
          return inputText.split(findStr).join(replaceStr);
        } catch {
          return inputText;
        }
      }
      default:
        return inputText;
    }
  }, [inputText, toolSlug, sortDirection, findStr, replaceStr, useRegex]);

  // Lorem Ipsum Generator Logic
  const generateLorem = () => {
    const wordsPool = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
      'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis',
      'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat',
      'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt'
    ];

    if (loremType === 'words') {
      const generated = Array.from({ length: loremCount }, () =>
        wordsPool[Math.floor(Math.random() * wordsPool.length)]
      ).join(' ');
      setInputText(generated.charAt(0).toUpperCase() + generated.slice(1) + '.');
    } else if (loremType === 'sentences') {
      const sentencesArr = Array.from({ length: loremCount }, () => {
        const len = 6 + Math.floor(Math.random() * 8);
        const s = Array.from({ length: len }, () =>
          wordsPool[Math.floor(Math.random() * wordsPool.length)]
        ).join(' ');
        return s.charAt(0).toUpperCase() + s.slice(1) + '.';
      });
      setInputText(sentencesArr.join(' '));
    } else {
      const paragraphsArr = Array.from({ length: loremCount }, () => {
        const sCount = 3 + Math.floor(Math.random() * 3);
        const s = Array.from({ length: sCount }, () => {
          const len = 7 + Math.floor(Math.random() * 8);
          const words = Array.from({ length: len }, () =>
            wordsPool[Math.floor(Math.random() * wordsPool.length)]
          ).join(' ');
          return words.charAt(0).toUpperCase() + words.slice(1) + '.';
        }).join(' ');
        return s;
      });
      setInputText(paragraphsArr.join('\n\n'));
    }
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Text Statistics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Words</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {stats.words.toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Characters</span>
          <span className="text-xl font-bold font-mono text-amber-500">
            {stats.characters.toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">No Spaces</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {stats.charactersNoSpaces.toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Lines</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {stats.lines}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Sentences</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {stats.sentences}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Read Time</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            ~{stats.readingTimeMinutes}m
          </span>
        </div>
      </div>

      {/* Special Tool Specific Options Bar */}
      {toolSlug === 'lorem-ipsum-generator' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Count:</span>
            <input
              type="number"
              min="1"
              max="50"
              value={loremCount}
              onChange={(e) => setLoremCount(Number(e.target.value))}
              className="w-16 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-1">
            {(['paragraphs', 'sentences', 'words'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLoremType(type)}
                className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                  loremType === type
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button
            onClick={generateLorem}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate Lorem
          </button>
        </div>
      )}

      {toolSlug === 'text-sorter' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 mr-2">Sort Mode:</span>
          {(['asc', 'desc', 'length', 'shuffle'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => setSortDirection(dir)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors ${
                sortDirection === dir
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {dir === 'asc' ? 'A to Z' : dir === 'desc' ? 'Z to A' : dir === 'length' ? 'By Length' : 'Randomize'}
            </button>
          ))}
        </div>
      )}

      {toolSlug === 'find-and-replace' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Find</label>
              <input
                type="text"
                value={findStr}
                onChange={(e) => setFindStr(e.target.value)}
                placeholder="Word or pattern to search..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Replace With</label>
              <input
                type="text"
                value={replaceStr}
                onChange={(e) => setReplaceStr(e.target.value)}
                placeholder="Replacement text..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
              className="rounded text-amber-500"
            />
            Use Regular Expressions (Regex)
          </label>
        </div>
      )}

      {/* Main Text Editor Workspace */}
      {toolSlug === 'text-diff' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Original Text</span>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-80 p-4 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Modified Text</span>
            <textarea
              value={secondaryText}
              onChange={(e) => setSecondaryText(e.target.value)}
              className="w-full h-80 p-4 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Input Text</span>
              <button
                onClick={() => setInputText('')}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full h-80 p-4 text-xs font-sans rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Processed Output</span>
              <button
                onClick={() => handleCopy(transformedText)}
                className="text-xs flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:underline font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Result'}
              </button>
            </div>
            <textarea
              readOnly
              value={transformedText}
              className="w-full h-80 p-4 text-xs font-sans rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 shadow-inner"
            />
          </div>
        </div>
      )}

      {/* Case Converter Quick Preset Strip */}
      {toolSlug === 'case-converter' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Quick One-Click Transformations
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'UPPERCASE', fn: () => setInputText(inputText.toUpperCase()) },
              { label: 'lowercase', fn: () => setInputText(inputText.toLowerCase()) },
              {
                label: 'Title Case',
                fn: () =>
                  setInputText(
                    inputText.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())
                  ),
              },
              {
                label: 'camelCase',
                fn: () =>
                  setInputText(
                    inputText
                      .toLowerCase()
                      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
                  ),
              },
              {
                label: 'snake_case',
                fn: () =>
                  setInputText(
                    inputText
                      .toLowerCase()
                      .replace(/\s+/g, '_')
                      .replace(/[^a-zA-Z0-9_]/g, '')
                  ),
              },
              {
                label: 'kebab-case',
                fn: () =>
                  setInputText(
                    inputText
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-zA-Z0-9-]/g, '')
                  ),
              },
            ].map((preset, i) => (
              <button
                key={i}
                onClick={preset.fn}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
