import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, X, Star, ArrowRight, Sparkles, History, Layers, GitFork, Compass, Trash2
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { TOOLS_DATA } from '../data/toolsData';
import { SUITE_LIST, SUITES_DATA } from '../data/suitesData';
import { trackSearchPerformed } from '../utils/analytics';

interface SearchEntry {
  id: string;
  kind: 'tool' | 'studio' | 'suite' | 'workflow';
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  path: string;
  isFavorite?: boolean;
  score: number;
  suite?: string;
}

const STUDIO_ITEMS = [
  { id: 'studio-workspace', title: 'NOVA Workspace & Dashboard', subtitle: 'Customizable widgets, Clipboard Vault, Notes, Tasks & Collections', path: '/workspace', badge: 'Workspace', color: '#06b6d4', keywords: 'workspace dashboard notes tasks collections widgets vault' },
  { id: 'studio-vault', title: 'Clipboard & Snippets Vault', subtitle: 'Save reusable text, code, links & prompts offline', path: '/clipboard-vault', badge: 'Studio', color: '#8b5cf6', keywords: 'clipboard vault snippets paste templates prompts' },
  { id: 'studio-file', title: 'File Studio (Universal Converter & Batch)', subtitle: 'Multi-file magic-byte detection, image batch & ZIP archive export', path: '/file-studio', badge: 'File Studio', color: '#3b82f6', keywords: 'file studio batch zip convert resize compress webp png' },
  { id: 'studio-dev', title: 'Developer Lab Workbench', subtitle: 'Code playground, JSON, Regex, JWT decoder & File Inspector tabs', path: '/developer-lab', badge: 'Dev Lab', color: '#10b981', keywords: 'developer lab playground html css js json regex jwt inspector' },
  { id: 'studio-design', title: 'Design Studio Workbench', subtitle: 'Gradients, shadows, glassmorphism, contrast checker, palettes & SVG optimizer', path: '/design-studio', badge: 'Design Studio', color: '#ec4899', keywords: 'design studio palette contrast wcag svg favicon typography shadow' },
  { id: 'studio-qr', title: 'QR & Barcode Studio', subtitle: 'URL, Wi-Fi, vCard QR codes with logos, Code 128 barcodes & scanner', path: '/qr-studio', badge: 'QR Studio', color: '#f59e0b', keywords: 'qr studio barcode code128 wifi vcard scanner logo printable' },
  { id: 'studio-flow', title: 'NOVA Flow (Automation Pipelines)', subtitle: 'Multi-step sequential browser processing with export/import', path: '/workflows', badge: 'Workflows', color: '#6366f1', keywords: 'workflows pipelines automation flow multi-step' },
  { id: 'studio-focus', title: 'Focus & Productivity Studio', subtitle: 'Timestamp-accurate Pomodoro, Countdown presets, Stopwatch & Zen mode', path: '/focus', badge: 'Focus', color: '#f43f5e', keywords: 'focus pomodoro timer stopwatch countdown zen' },
  { id: 'studio-learn', title: 'Learning & Reference Hub', subtitle: 'Searchable cheatsheets for HTML, CSS, JS, Python, Math & Units', path: '/learning-hub', badge: 'Reference', color: '#0ea5e9', keywords: 'learning hub reference cheatsheet html css python math formulas' },
  { id: 'studio-browser', title: 'Browser & Device Utilities', subtitle: 'Viewport monitor, Storage inspector, Keyboard & Mouse event testers', path: '/browser-utilities', badge: 'System', color: '#14b8a6', keywords: 'browser utilities viewport dpr storage cookies keyboard mouse tester' },
  { id: 'studio-categories', title: 'Categories Explorer', subtitle: 'Browse all 12 curated tool suites & platform capabilities', path: '/categories', badge: 'Directory', color: '#a855f7', keywords: 'categories suites directory explore' },
];

function computeScore(query: string, fields: string[]): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  let best = 0;

  for (let i = 0; i < fields.length; i++) {
    const f = fields[i].toLowerCase();
    if (!f) continue;
    if (f === q) {
      best = Math.max(best, i === 0 ? 120 : 90);
    } else if (f.startsWith(q)) {
      best = Math.max(best, i === 0 ? 95 : 70);
    } else if (f.includes(q)) {
      best = Math.max(best, i === 0 ? 75 : 50);
    } else if (q.length >= 3) {
      // Ordered character subsequence match for mild typos
      let qi = 0;
      for (let fi = 0; fi < f.length && qi < q.length; fi++) {
        if (f[fi] === q[qi]) qi++;
      }
      if (qi === q.length) {
        best = Math.max(best, i === 0 ? 30 : 18);
      }
    }
  }
  return best;
}

export const GlobalSearchModal: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    navigate,
    favorites,
    recentTools,
    workflows,
    recentSearches,
    recordSearchQuery,
    clearRecentSearches,
  } = useNova();
  const [query, setQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery('');
      setSelectedFilter('all');
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
      const tool = TOOLS_DATA.find((t) => t.slug === 'contrast-checker' || t.slug === 'hex-color-tools');
      if (tool) return { tool, reason: 'Audits foreground/background contrast compliance for WCAG standards.' };
    }
    if (q.includes('secret') || q.includes('encrypt') || q.includes('decrypt') || q.includes('aes')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'text-encrypt-decrypt');
      if (tool) return { tool, reason: 'Client-side PBKDF2 & AES-GCM 256-bit text encryption.' };
    }
    if (q.includes('combine pdf') || q.includes('merge pdf') || q.includes('join pdf')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'pdf-merger');
      if (tool) return { tool, reason: 'Merges multiple PDF documents locally into a single clean file.' };
    }
    if (q.includes('qr') || q.includes('barcode') || q.includes('wifi qr')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'qr-generator');
      if (tool) return { tool, reason: 'Generates scannable QR codes for links, text, Wi-Fi, and contacts.' };
    }
    if (q.includes('format json') || q.includes('beautify json') || q.includes('pretty json')) {
      const tool = TOOLS_DATA.find((t) => t.slug === 'json-formatter');
      if (tool) return { tool, reason: 'Validates, formats, and minifies JSON payloads with formatting checks.' };
    }
    return null;
  }, [query]);

  const results = useMemo<SearchEntry[]>(() => {
    const q = query.trim();
    const entries: SearchEntry[] = [];

    if (!q) {
      if (selectedFilter === 'studios') {
        return STUDIO_ITEMS.map(
          (s): SearchEntry => ({
            id: s.id,
            kind: 'studio',
            title: s.title,
            subtitle: s.subtitle,
            badge: s.badge,
            accentColor: s.color,
            path: s.path,
            score: 100,
          })
        );
      }

      const recents = recentTools
        .map((r) => TOOLS_DATA.find((t) => t.slug === r.slug))
        .filter((t): t is NonNullable<typeof t> => Boolean(t));
      const baseTools =
        selectedFilter === 'all'
          ? TOOLS_DATA
          : TOOLS_DATA.filter((t) => t.suite === selectedFilter);
      const populars = baseTools.filter((t) => t.popular).slice(0, 8);
      const combined = Array.from(new Set([...(selectedFilter === 'all' ? recents : []), ...populars])).slice(0, 10);

      combined.forEach((tool) => {
        const suite = SUITES_DATA[tool.suite] || SUITES_DATA.developer;
        entries.push({
          id: `tool-${tool.slug}`,
          kind: 'tool',
          title: tool.name,
          subtitle: tool.description,
          badge: suite.name,
          accentColor: suite.accentColor,
          path: `/tools/${tool.slug}`,
          isFavorite: favorites.includes(tool.slug),
          score: 50,
          suite: tool.suite,
        });
      });

      if (selectedFilter === 'all') {
        STUDIO_ITEMS.slice(0, 4).forEach((s) => {
          entries.push({
            id: s.id,
            kind: 'studio',
            title: s.title,
            subtitle: s.subtitle,
            badge: s.badge,
            accentColor: s.color,
            path: s.path,
            score: 40,
          });
        });
      }
      return entries;
    }

    // 1. Studios
    if (selectedFilter === 'all' || selectedFilter === 'studios') {
      STUDIO_ITEMS.forEach((s) => {
        const score = computeScore(q, [s.title, s.subtitle, s.keywords, s.badge]);
        if (score > 0) {
          entries.push({
            id: s.id,
            kind: 'studio',
            title: s.title,
            subtitle: s.subtitle,
            badge: s.badge,
            accentColor: s.color,
            path: s.path,
            score: score + 5,
          });
        }
      });

      // Suites
      SUITE_LIST.forEach((suite) => {
        const score = computeScore(q, [suite.name, suite.description, suite.id]);
        if (score > 0) {
          entries.push({
            id: `suite-${suite.id}`,
            kind: 'suite',
            title: `${suite.name} Suite`,
            subtitle: suite.description,
            badge: 'Suite',
            accentColor: suite.accentColor,
            path: `/tools?suite=${suite.id}`,
            score,
          });
        }
      });

      // Workflows
      workflows.forEach((wf) => {
        const score = computeScore(q, [wf.title, wf.description, wf.category]);
        if (score > 0) {
          entries.push({
            id: `wf-${wf.id}`,
            kind: 'workflow',
            title: wf.title,
            subtitle: `${wf.steps.length} automated steps · ${wf.description}`,
            badge: 'NOVA Flow',
            accentColor: '#6366f1',
            path: '/workflows',
            score,
          });
        }
      });
    }

    // 2. All Tools
    if (selectedFilter !== 'studios') {
      const pool = selectedFilter === 'all' ? TOOLS_DATA : TOOLS_DATA.filter((t) => t.suite === selectedFilter);
      pool.forEach((tool) => {
        const suite = SUITES_DATA[tool.suite] || SUITES_DATA.developer;
        const score = computeScore(q, [tool.name, tool.keywords.join(' '), tool.description, suite.name]);
        if (score > 0) {
          entries.push({
            id: `tool-${tool.slug}`,
            kind: 'tool',
            title: tool.name,
            subtitle: tool.description,
            badge: suite.name,
            accentColor: suite.accentColor,
            path: `/tools/${tool.slug}`,
            isFavorite: favorites.includes(tool.slug),
            score: score + (favorites.includes(tool.slug) ? 8 : 0),
            suite: tool.suite,
          });
        }
      });
    }

    entries.sort((a, b) => b.score - a.score);

    if (smartAssistantMatch && selectedFilter === 'all') {
      const smartId = `tool-${smartAssistantMatch.tool.slug}`;
      const withoutSmart = entries.filter((e) => e.id !== smartId);
      const suite = SUITES_DATA[smartAssistantMatch.tool.suite] || SUITES_DATA.developer;
      const smartEntry: SearchEntry = {
        id: smartId,
        kind: 'tool',
        title: smartAssistantMatch.tool.name,
        subtitle: smartAssistantMatch.tool.description,
        badge: suite.name,
        accentColor: suite.accentColor,
        path: `/tools/${smartAssistantMatch.tool.slug}`,
        isFavorite: favorites.includes(smartAssistantMatch.tool.slug),
        score: 999,
      };
      return [smartEntry, ...withoutSmart].slice(0, 18);
    }

    return entries.slice(0, 18);
  }, [query, selectedFilter, recentTools, favorites, workflows, smartAssistantMatch]);

  useEffect(() => {
    if (!query.trim()) return;
    const t = window.setTimeout(() => {
      trackSearchPerformed(results.length, selectedFilter);
    }, 500);
    return () => window.clearTimeout(t);
  }, [query, results.length, selectedFilter]);

  const openPath = (path: string) => {
    if (query.trim().length >= 2) {
      recordSearchQuery(query);
    }
    setSearchOpen(false);
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + Math.max(1, results.length)) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        openPath(results[selectedIndex].path);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col sm:items-start sm:justify-center sm:pt-14 sm:px-4 bg-slate-950/75 backdrop-blur-md animate-page-enter"
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
            placeholder="Search tools, studios, workflows, or ask 'compress photo'..."
            className="w-full text-base sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            aria-label="Universal command search"
          />
          {query && (
            <button
              type="button"
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
            type="button"
            onClick={() => setSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 rounded-lg shrink-0"
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        {/* Scope Filter Pills */}
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs shrink-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'studios', label: 'Studios & Hubs' },
            { id: 'image', label: 'Image' },
            { id: 'pdf', label: 'PDF' },
            { id: 'developer', label: 'Developer' },
            { id: 'calculators', label: 'Calculators' },
            { id: 'design', label: 'Design' },
            { id: 'security', label: 'Security' },
            { id: 'student', label: 'Student' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setSelectedFilter(f.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedFilter === f.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <History className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-500 shrink-0"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={clearRecentSearches}
              className="ml-auto text-[10px] text-slate-400 hover:text-rose-500 inline-flex items-center gap-1 shrink-0"
              title="Clear recent searches"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        )}

        {/* Smart Assistant Natural Language Highlight Card */}
        {smartAssistantMatch && (
          <div className="mx-3 my-2 p-3 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-transparent flex items-start gap-3 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Smart Intent Match
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
              type="button"
              onClick={() => openPath(`/tools/${smartAssistantMatch.tool.slug}`)}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm shrink-0"
            >
              <span>Launch</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 overscroll-contain">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const KindIcon =
                item.kind === 'studio'
                  ? Layers
                  : item.kind === 'workflow'
                  ? GitFork
                  : item.kind === 'suite'
                  ? Compass
                  : Sparkles;

              return (
                <div
                  key={item.id}
                  onClick={() => openPath(item.path)}
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
                      style={{ backgroundColor: `${item.accentColor}18`, color: item.accentColor }}
                    >
                      <KindIcon className="w-4 h-4" />
                    </div>
                    <div className="truncate min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold shrink-0"
                          style={{ backgroundColor: `${item.accentColor}20`, color: item.accentColor }}
                        >
                          {item.badge}
                        </span>
                        {item.isFavorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {item.subtitle}
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
            <div className="p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No matches found for "{query}"
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try popular destinations or natural searches like "compress image" or "qr studio":
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {[
                  { label: 'File Studio', path: '/file-studio' },
                  { label: 'Developer Lab', path: '/developer-lab' },
                  { label: 'QR Studio', path: '/qr-studio' },
                  { label: 'JSON Formatter', path: '/tools/json-formatter' },
                ].map((s) => (
                  <button
                    key={s.path}
                    type="button"
                    onClick={() => openPath(s.path)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:border-cyan-500"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
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
            {TOOLS_DATA.length} Tools · 11 Studios & Hubs
          </span>
        </div>
      </div>
    </div>
  );
};
