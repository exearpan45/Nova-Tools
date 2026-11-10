import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, X, Star, ArrowRight, Sparkles, Zap, Lightbulb, Compass, Filter
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { TOOLS_DATA } from '../data/toolsData';
import { SUITES_DATA } from '../data/suitesData';
import { ToolDefinition } from '../types';

export const GlobalSearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, navigate, favorites, recentTools } = useNova();
  const [query, setQuery] = useState<string>('');
  const [selectedSuite, setSelectedSuite] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery('');
      setSelectedSuite('all');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  // Natural Language Intent Recognizer
  const smartAssistantMatch = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 3) return null;

    if (q.includes('loan') || q.includes('mortgage') || q.includes('emi') || q.includes('monthly payment')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'emi-calculator');
      if (tool) return { tool, reason: 'Calculates monthly equated installments & loan amortization schedules.' };
    }
    if (q.includes('gst') || q.includes('tax') || q.includes('cgst') || q.includes('sgst')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'gst-calculator');
      if (tool) return { tool, reason: 'Calculates GST amounts with inclusive/exclusive pricing & tax splits.' };
    }
    if (q.includes('shrink') || q.includes('compress photo') || q.includes('reduce image size') || q.includes('smaller image')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'image-compressor');
      if (tool) return { tool, reason: 'Compresses JPEG, PNG, and WebP files locally with zero quality loss.' };
    }
    if (q.includes('contrast') || q.includes('wcag') || q.includes('color blindness') || q.includes('accessible')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'hex-color-tools' || t.slug === 'contrast-checker' || t.slug === 'accessibility-checker');
      if (tool) return { tool, reason: 'Audits foreground/background contrast compliance for WCAG standards.' };
    }
    if (q.includes('secret') || q.includes('encrypt') || q.includes('decrypt') || q.includes('aes') || q.includes('password protect')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'text-encrypt-decrypt');
      if (tool) return { tool, reason: 'Client-side PBKDF2 & AES-GCM 256-bit military grade text encryption.' };
    }
    if (q.includes('combine pdf') || q.includes('merge pdf') || q.includes('join pdf')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'pdf-merger');
      if (tool) return { tool, reason: 'Merges multiple PDF documents locally into a single clean file.' };
    }
    if (q.includes('compare') || q.includes('diff') || q.includes('difference between text')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'text-diff');
      if (tool) return { tool, reason: 'Computes line-by-line visual differences and changes between two text blocks.' };
    }
    if (q.includes('qr') || q.includes('barcode') || q.includes('wifi qr')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'qr-generator');
      if (tool) return { tool, reason: 'Generates scannable QR codes for links, text, WiFi, and contacts.' };
    }
    if (q.includes('format json') || q.includes('beautify json') || q.includes('pretty json')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'json-formatter');
      if (tool) return { tool, reason: 'Validates, formats, and minifies JSON trees with syntax highlighting.' };
    }
    return null;
  }, [query]);

  // Filter tools based on query and suite
  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    let baseList = TOOLS_DATA;

    if (selectedSuite !== 'all') {
      baseList = baseList.filter((t) => t.suite === selectedSuite);
    }

    if (!q) {
      const recents = recentTools.map((r) => TOOLS_DATA.find((t) => t.slug === r.slug)).filter(Boolean) as ToolDefinition[];
      const populars = baseList.filter((t) => t.popular).slice(0, 10);
      return Array.from(new Set([...recents, ...populars])).slice(0, 12);
    }

    const matches = baseList.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchSuite = tool.suite.toLowerCase().includes(q);
      const matchKeyword = tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchSuite || matchKeyword;
    });

    // Bring smart match to the top if present
    if (smartAssistantMatch) {
      const withoutSmart = matches.filter((t) => t.slug !== smartAssistantMatch.tool.slug);
      return [smartAssistantMatch.tool, ...withoutSmart].slice(0, 16);
    }

    return matches.slice(0, 16);
  }, [query, selectedSuite, recentTools, smartAssistantMatch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        openTool(filteredTools[selectedIndex].slug);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  const openTool = (slug: string) => {
    setSearchOpen(false);
    navigate(`/tools/${slug}`);
  };

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col sm:items-start sm:justify-center sm:pt-16 sm:px-4 bg-slate-950/75 backdrop-blur-md animate-page-enter"
      onClick={() => setSearchOpen(false)}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        className="w-full sm:max-w-2xl sm:mx-auto h-full sm:h-auto sm:max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 sm:rounded-3xl sm:border sm:border-slate-200 sm:dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center px-4 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools or ask: 'how to calculate loan', 'shrink photo'..."
            className="w-full text-base sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            aria-label="Smart search"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 rounded-lg shrink-0"
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        {/* Suite Category Tabs */}
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs shrink-0">
          <button
            onClick={() => setSelectedSuite('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              selectedSuite === 'all'
                ? 'bg-violet-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Suites
          </button>
          {['calculators', 'image', 'developer', 'pdf', 'security', 'student', 'web', 'design'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSuite(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all shrink-0 ${
                selectedSuite === s
                  ? 'bg-violet-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Smart Assistant Natural Language Highlight Card */}
        {smartAssistantMatch && (
          <div className="mx-3 my-2 p-3 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-transparent flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Smart Suggestion
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {smartAssistantMatch.tool.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {smartAssistantMatch.reason}
              </p>
            </div>
            <button
              onClick={() => openTool(smartAssistantMatch.tool.slug)}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm shrink-0"
            >
              <span>Launch</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 overscroll-contain">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => {
              const suite = SUITES_DATA[tool.suite] || SUITES_DATA.developer;
              const isSelected = idx === selectedIndex;
              const isFav = favorites.includes(tool.slug);

              return (
                <div
                  key={tool.slug}
                  onClick={() => openTool(tool.slug)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors min-h-[48px] active:scale-[0.99] ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold"
                      style={{ backgroundColor: `${suite.accentColor}18`, color: suite.accentColor }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="truncate min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {tool.name}
                        </span>
                        <span
                          className="px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider font-semibold shrink-0"
                          style={{ backgroundColor: `${suite.accentColor}20`, color: suite.accentColor }}
                        >
                          {suite.name}
                        </span>
                        {isFav && <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 pl-2 shrink-0">
                    <ArrowRight className="w-4 h-4 text-cyan-500" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No tools found for "{query}"
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try natural searches like "how to calculate percentage", "convert image", "beautify code".
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts (Desktop only) */}
        <div className="hidden sm:flex p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-4">
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>esc close</span>
          </div>
          <span className="font-semibold text-cyan-600 dark:text-cyan-400">
            {TOOLS_DATA.length} Tools · 100% In-Browser
          </span>
        </div>
      </div>
    </div>
  );
};
