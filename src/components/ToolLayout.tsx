import React, { useState, useEffect, useMemo } from 'react';
import { ToolDefinition } from '../types';
import { TOOLS_DATA } from '../data/toolsData';
import { AdSlot } from './AdSlot';
import { ToolIcon } from './ToolIcon';
import { ToolRating } from './ToolRating';
import {
  ChevronRight,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  Heart,
  Share2,
  ListOrdered,
  Sparkles,
  Lock,
  FileCode,
  Clock,
  Printer,
  History,
  Trash2,
  Copy
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { isToolFavorite, toggleFavoriteToolSlug } from '../utils/storage';
import { copyToClipboard } from '../utils/clipboard';
import { getScratchpadItems, clearScratchpad, ScratchpadItem } from '../utils/scratchpad';

interface ToolLayoutProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  onNavigate,
  children
}) => {
  const { showToast } = useToast();
  const [isFav, setIsFav] = useState<boolean>(() => isToolFavorite(tool.slug));
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [scratchpadList, setScratchpadList] = useState<ScratchpadItem[]>(() => getScratchpadItems(tool.slug));

  useEffect(() => {
    setIsFav(isToolFavorite(tool.slug));
    setScratchpadList(getScratchpadItems(tool.slug));
  }, [tool.slug]);

  // Listen to scratchpad events
  useEffect(() => {
    const handleScratchpadUpdate = (e: any) => {
      if (!e.detail || e.detail.slug === tool.slug) {
        setScratchpadList(getScratchpadItems(tool.slug));
      }
    };
    window.addEventListener('nova:scratchpad:update', handleScratchpadUpdate);
    return () => window.removeEventListener('nova:scratchpad:update', handleScratchpadUpdate);
  }, [tool.slug]);

  // Global Power-User Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc: Reset
      if (e.key === 'Escape') {
        const resetBtn = document.querySelector<HTMLButtonElement>('[data-action="reset"]');
        if (resetBtn) {
          e.preventDefault();
          resetBtn.click();
        }
      }
      // Cmd/Ctrl + Enter: Trigger Primary Action
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const primaryBtn = document.querySelector<HTMLButtonElement>('[data-action="primary"]');
        if (primaryBtn) {
          e.preventDefault();
          primaryBtn.click();
        }
      }
      // Cmd/Ctrl + Shift + C: Quick Copy Output
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        const outputEl = document.querySelector<HTMLElement>('[data-action="output"]');
        if (outputEl) {
          e.preventDefault();
          const textToCopy = outputEl.innerText || (outputEl as HTMLInputElement).value || '';
          if (textToCopy) {
            copyToClipboard(textToCopy);
            showToast('Output copied to clipboard', 'success');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  const handleToggleFav = () => {
    const { isFavorite } = toggleFavoriteToolSlug(tool.slug);
    setIsFav(isFavorite);
    showToast(isFavorite ? 'Saved to Favorites' : 'Removed from Favorites', 'info');
  };

  const handleShare = async () => {
    const toolUrl = window.location.href || `https://novatools.2bd.net/tools/${tool.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} - NOVA TOOLS`,
          text: tool.description,
          url: toolUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        // Fallback to clipboard
      }
    }

    const copied = await copyToClipboard(toolUrl);
    if (copied) {
      showToast('✓ Link copied', 'copied');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyScratchpadItem = async (val: string) => {
    const success = await copyToClipboard(val);
    if (success) {
      showToast('Copied from recent history', 'success');
    }
  };

  const handleClearHistory = () => {
    clearScratchpad(tool.slug);
    setScratchpadList([]);
    showToast('Session history cleared', 'info');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const relatedTools = useMemo(() => {
    return TOOLS_DATA.filter((t) => tool.relatedSlugs.includes(t.slug)).slice(0, 3);
  }, [tool]);

  const readingTimeMinutes = useMemo(() => {
    const parts: string[] = [
      tool.description || '',
      ...(tool.whatItDoes || []),
      ...(tool.howToUse || []),
      tool.example ? `${tool.example.input} ${tool.example.output} ${tool.example.note || ''}` : '',
      tool.howItWorks || '',
      tool.privacyInfo || '',
      ...(tool.faqs || []).map((f) => `${f.question} ${f.answer}`),
    ];
    const totalWords = parts
      .join(' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    // Standard reading speed is ~200 words per minute
    return Math.max(1, Math.ceil(totalWords / 200));
  }, [tool]);

  return (
    <>
      {/* Subtle Horizontal Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[2.5px] bg-neutral-200/30 dark:bg-neutral-800/30 pointer-events-none no-print"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Tool page scroll progress"
      >
        <div
          className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 no-print">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        <button
          onClick={() => onNavigate('/tools')}
          className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Tools
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        <span className="text-neutral-900 dark:text-neutral-200 font-medium truncate">
          {tool.name}
        </span>
      </nav>

      {/* Tool Header */}
      <header className="space-y-3 tool-print-header">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 no-print">
              <ToolIcon name={tool.icon} className="w-4 h-4" />
            </div>
            <div>
              <div className="hidden print:block text-[9pt] uppercase tracking-wider text-blue-700 font-bold mb-1">
                NOVA TOOLS — Client-Side Utility Suite
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                {tool.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              type="button"
              id="tool-fav-btn"
              onClick={handleToggleFav}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                isFav
                  ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFav
                    ? 'fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400'
                    : 'stroke-current'
                }`}
              />
              <span>{isFav ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              type="button"
              id="tool-share-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              type="button"
              id="tool-print-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-medium transition-colors cursor-pointer"
              title="Print or Save as PDF (Ctrl/Cmd+P)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          {tool.description}
        </p>

        {/* 5-Star Rating & Reading Time */}
        <div className="pt-0.5 flex flex-wrap items-center gap-2 sm:gap-3">
          <ToolRating slug={tool.slug} toolName={tool.name} />
          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline" aria-hidden="true">•</span>
          <span
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/70 text-neutral-600 dark:text-neutral-300 text-[11px] font-medium"
            title={`Estimated reading time for description, instructions, and FAQ (${readingTimeMinutes} min)`}
          >
            <Clock className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
            <span>{readingTimeMinutes} min read</span>
          </span>
        </div>

        {/* In-Page Quick Jump Bar */}
        <div className="pt-2 no-print overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 py-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mr-1 select-none">
              Jump:
            </span>
            <button
              type="button"
              onClick={() => scrollToSection(`tool-interface-${tool.slug}`)}
              className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer shrink-0"
            >
              Tool
            </button>
            {tool.whatItDoes && tool.whatItDoes.length > 0 && (
              <button
                type="button"
                onClick={() => scrollToSection('tool-what-it-does')}
                className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer shrink-0"
              >
                What It Does
              </button>
            )}
            {tool.howToUse && tool.howToUse.length > 0 && (
              <button
                type="button"
                onClick={() => scrollToSection('tool-how-to-use')}
                className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer shrink-0"
              >
                How To Use
              </button>
            )}
            {tool.example && (
              <button
                type="button"
                onClick={() => scrollToSection('tool-example')}
                className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer shrink-0"
              >
                Example
              </button>
            )}
            {tool.faqs && tool.faqs.length > 0 && (
              <button
                type="button"
                onClick={() => scrollToSection('tool-faqs')}
                className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer shrink-0"
              >
                FAQ
              </button>
            )}
            {relatedTools.length > 0 && (
              <button
                type="button"
                onClick={() => scrollToSection('tool-related')}
                className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer shrink-0"
              >
                Related
              </button>
            )}
          </div>
        </div>
      </header>

      {/* PRIMARY TOOL INTERFACE */}
      <main id={`tool-interface-${tool.slug}`} className="space-y-3">
        <div className="bg-white dark:bg-[#18181b] border border-neutral-200/90 dark:border-neutral-800/90 rounded-xl p-4 sm:p-6 shadow-2xs print-clean">
          <div key={tool.slug} className="animate-tool-enter">
            {children}
          </div>
        </div>

        {/* Footer Meta & Keyboard Shortcuts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 px-1 no-print">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
            <span>100% Client-Side: Processed entirely on your device.</span>
          </span>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
              <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">Esc</kbd> Reset ·
              <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">⌘/Ctrl ↵</kbd> Run ·
              <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">⌘/Ctrl ⇧ C</kbd> Copy
            </span>
            <span>•</span>
            <button
              onClick={() => onNavigate('/privacy-policy')}
              className="hover:underline hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Privacy details
            </button>
          </div>
        </div>

        {/* Ephemeral Session History / Scratchpad */}
        {scratchpadList.length > 0 && (
          <div className="mt-3 p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-2 no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <History className="w-3.5 h-3.5 text-blue-500" />
                <span>Session History (Click to copy)</span>
              </div>
              <button
                type="button"
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Clear current session history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {scratchpadList.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleCopyScratchpadItem(item.result)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-500 text-xs font-mono text-neutral-800 dark:text-neutral-200 hover:text-blue-600 transition-all cursor-pointer truncate max-w-xs shadow-2xs group"
                  title={`Click to copy: ${item.result}`}
                >
                  {item.label && <span className="text-[10px] text-neutral-400 font-sans font-normal">{item.label}:</span>}
                  <span className="truncate">{item.result}</span>
                  <Copy className="w-2.5 h-2.5 text-neutral-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Ad Placement Slot */}
      <AdSlot id="tool-bottom-ad" />

      {/* What it does */}
      {tool.whatItDoes && tool.whatItDoes.length > 0 && (
        <section id="tool-what-it-does" className="space-y-3 p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] print-clean">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2>What it does</h2>
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {tool.whatItDoes.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {/* How to use */}
      {tool.howToUse && tool.howToUse.length > 0 && (
        <section id="tool-how-to-use" className="space-y-3 p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] print-clean">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            <ListOrdered className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2>How to use</h2>
          </div>
          <ol className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            {tool.howToUse.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Practical Example */}
      {tool.example && (
        <section id="tool-example" className="space-y-3 p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] print-clean">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2>Example</h2>
          </div>
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800/70 p-4 space-y-2 text-xs font-mono">
            <div>
              <span className="text-neutral-400 select-none">Input: </span>
              <span className="text-neutral-800 dark:text-neutral-200">{tool.example.input}</span>
            </div>
            <div>
              <span className="text-neutral-400 select-none">Output: </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{tool.example.output}</span>
            </div>
            {tool.example.note && (
              <div className="pt-2 text-[11px] font-sans text-neutral-500 dark:text-neutral-400 border-t border-neutral-200/50 dark:border-neutral-800/50">
                {tool.example.note}
              </div>
            )}
          </div>
        </section>
      )}

      {/* How it works */}
      {tool.howItWorks && (
        <section id="tool-how-it-works" className="space-y-3 p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] print-clean">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            <FileCode className="w-4 h-4 text-neutral-500" />
            <h2>How it works</h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {tool.howItWorks}
          </p>
        </section>
      )}

      {/* Privacy Information */}
      {tool.privacyInfo && (
        <section id="tool-privacy" className="space-y-3 p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] print-clean">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2>Privacy & Data Handling</h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {tool.privacyInfo}
          </p>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section id="tool-related" className="space-y-3 no-print">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            You might also need
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedTools.map((rel) => (
              <button
                key={rel.slug}
                onClick={() => onNavigate(`/tools/${rel.slug}`)}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-neutral-300 dark:hover:border-neutral-700 text-left transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center flex-shrink-0 transition-colors">
                  <ToolIcon name={rel.icon} className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {rel.name}
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {rel.category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section id="tool-faqs" className="space-y-3 pb-4 print-clean">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            <HelpCircle className="w-4 h-4 text-neutral-500" />
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {tool.faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-[#18181b]"
              >
                <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {faq.question}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Print-Only Verification & Timestamp Footer */}
      <footer className="hidden print:block print-footer-notice">
        <div>
          Generated from <strong>NOVA TOOLS</strong> (https://novatools.2bd.net/tools/{tool.slug})
        </div>
        <div className="mt-1">
          100% Client-Side Execution • No sensitive data sent over network • Confidential document
        </div>
      </footer>
    </div>
    </>
  );
};

