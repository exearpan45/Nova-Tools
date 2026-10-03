import React, { useState, useMemo } from 'react';
import DOMPurify from 'dompurify';
import {
  Edit, Eye, BookOpen, Quote, BookCheck, AlignJustify,
  Pilcrow, Clock, Sparkles, Copy, Check, Download, Bold, Italic, Link, Code
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface WritingProps {
  toolSlug: string;
}

export const WritingTools: React.FC<WritingProps> = ({ toolSlug }) => {
  const [docText, setDocText] = useState<string>(
    `# Exploring NOVA TOOLS\n\nNOVA TOOLS is built from the ground up to empower developers, students, designers, and creators with over 100 fast, private browser utilities.\n\n## Core Advantages\n\n- **Client-side computing**: Files never leave your local device.\n- **Zero-friction workflow**: High-speed pipelines with smart drag-and-drop.\n- **Multi-theme support**: Carefully tuned for modern visual comfort.\n\n> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra\n\nTry running an image compression workflow or format JSON payloads with zero latency.`
  );

  const [copied, setCopied] = useState<boolean>(false);

  // Readability calculation
  const readabilityStats = useMemo(() => {
    const text = docText.trim();
    if (!text) return { score: 100, grade: '5th Grade', level: 'Very Easy' };
    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const wordCount = words.length || 1;
    const sentenceCount = sentences.length || 1;

    // Approximate syllables
    const syllableCount = words.reduce((acc, word) => {
      const w = word.toLowerCase().replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
      const matches = w.match(/[aeiouy]{1,2}/g);
      return acc + (matches ? matches.length : 1);
    }, 0);

    // Flesch Reading Ease Formula: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
    const score = Math.round(
      206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount)
    );
    const clampedScore = Math.max(0, Math.min(100, score));

    let level = 'Standard';
    let grade = '8th - 9th Grade';
    if (clampedScore >= 90) { level = 'Very Easy'; grade = '5th Grade'; }
    else if (clampedScore >= 80) { level = 'Easy'; grade = '6th Grade'; }
    else if (clampedScore >= 70) { level = 'Fairly Easy'; grade = '7th Grade'; }
    else if (clampedScore >= 60) { level = 'Standard'; grade = '8th - 9th Grade'; }
    else if (clampedScore >= 50) { level = 'Fairly Difficult'; grade = '10th - 12th Grade'; }
    else if (clampedScore >= 30) { level = 'Difficult'; grade = 'College'; }
    else { level = 'Very Confusing / Academic'; grade = 'Graduate Degree'; }

    return { score: clampedScore, grade, level };
  }, [docText]);

  // Markdown parsing (lightweight safe regex parser)
  const renderedHtml = useMemo(() => {
    let html = docText
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-sky-500 pl-4 py-1 italic my-4 text-slate-600 dark:text-slate-300">$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sky-500 font-mono text-xs">$1</code>')
      .replace(/\n\n/gim, '</p><p class="my-3 text-slate-700 dark:text-slate-300 leading-relaxed">')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300">$1</li>');

    return `<p class="my-3 text-slate-700 dark:text-slate-300 leading-relaxed">${html}</p>`;
  }, [docText]);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertSnippet = (prefix: string, suffix: string = '') => {
    setDocText((prev) => prev + `\n${prefix}sample${suffix}`);
  };

  return (
    <div className="space-y-6">
      {/* Readability Score Banner for readability-checker */}
      {toolSlug === 'readability-checker' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20">
            <span className="text-xs text-sky-500 font-bold uppercase tracking-wider block mb-1">
              Flesch Reading Ease
            </span>
            <span className="text-4xl font-extrabold font-mono text-sky-600 dark:text-sky-400">
              {readabilityStats.score} / 100
            </span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Reading Grade Level
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {readabilityStats.grade}
            </span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Complexity Assessment
            </span>
            <span className="text-xl font-bold font-mono text-emerald-500">
              {readabilityStats.level}
            </span>
          </div>
        </div>
      )}

      {/* Editor & Preview Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <div className="flex items-center gap-1">
              <button
                onClick={() => insertSnippet('**', '**')}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertSnippet('*', '*')}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertSnippet('> ')}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Blockquote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertSnippet('`', '`')}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Code"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {docText.length} chars · {docText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <textarea
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            className="w-full h-96 p-4 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Formatted Preview
            </span>
            <button
              onClick={() => handleCopy(renderedHtml)}
              className="text-xs flex items-center gap-1.5 text-sky-500 hover:underline font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy HTML'}
            </button>
          </div>

          <div
            className="w-full h-96 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 overflow-y-auto text-xs font-sans shadow-inner"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderedHtml) }}
          />
        </div>
      </div>
    </div>
  );
};
