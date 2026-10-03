import React, { useState, useEffect, useRef } from 'react';
import {
  Search, X, Star, ArrowRight, Sparkles
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { TOOLS_DATA } from '../data/toolsData';
import { SUITES_DATA } from '../data/suitesData';
import { ToolDefinition } from '../types';

export const GlobalSearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, navigate, favorites, recentTools } = useNova();
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery('');
      setSelectedIndex(0);
      // Prevent background scrolling while modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  // Filter tools based on query
  const filteredTools = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // If query is empty, show recent tools followed by popular ones
      const recents = recentTools.map((r) => TOOLS_DATA.find((t) => t.slug === r.slug)).filter(Boolean) as ToolDefinition[];
      const populars = TOOLS_DATA.filter((t) => t.popular).slice(0, 10);
      return Array.from(new Set([...recents, ...populars])).slice(0, 10);
    }

    return TOOLS_DATA.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchSuite = tool.suite.toLowerCase().includes(q);
      const matchKeyword = tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchSuite || matchKeyword;
    }).slice(0, 15);
  }, [query, recentTools]);

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
      className="fixed inset-0 z-50 flex flex-col sm:items-start sm:justify-center sm:pt-20 sm:px-4 bg-slate-950/70 sm:backdrop-blur-md animate-page-enter"
      onClick={() => setSearchOpen(false)}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        className="w-full sm:max-w-2xl sm:mx-auto h-full sm:h-auto sm:max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 sm:rounded-2xl sm:border sm:border-slate-200 sm:dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center px-4 py-3 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3 shrink-0">
          <Search className="w-5 h-5 text-cyan-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="w-full text-base sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            aria-label="Search tools"
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
            Cancel
          </button>
        </div>

        {/* Quick Filter Tag Suggestions */}
        {!query && (
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs text-slate-400 shrink-0">
            <span className="font-semibold uppercase tracking-wider text-[10px] shrink-0">Quick:</span>
            {['compress image', 'merge pdf', 'percentage', 'format json', 'qr generator', 'password'].map((hint) => (
              <button
                key={hint}
                onClick={() => setQuery(hint)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 active:scale-95 text-xs whitespace-nowrap shrink-0"
              >
                {hint}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 overscroll-contain">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => {
              const suite = SUITES_DATA[tool.suite];
              const isSelected = idx === selectedIndex;
              const isFav = favorites.includes(tool.slug);

              return (
                <div
                  key={tool.slug}
                  onClick={() => openTool(tool.slug)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors min-h-[48px] active:scale-[0.99] ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
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
                Try searching by action like "compress", "calculate", "convert", or explore suites.
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
            {TOOLS_DATA.length} Tools
          </span>
        </div>
      </div>
    </div>
  );
};
