import React, { useState, useMemo } from 'react';
import {
  Search, ArrowRight, Sparkles, Grid, Star, Layers, ChevronRight
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { SUITE_LIST } from '../data/suitesData';
import { TOOLS_DATA } from '../data/toolsData';
import { trackCategoryViewed } from '../utils/analytics';

export const CategoriesPage: React.FC = () => {
  const { navigate, isFavorite, toggleFavorite } = useNova();
  const [filterText, setFilterText] = useState<string>('');

  const suiteCards = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return SUITE_LIST.map((suite) => {
      const tools = TOOLS_DATA.filter((t) => t.suite === suite.id);
      const featured = tools.filter((t) => t.popular || t.featured).slice(0, 3);
      const picks = featured.length > 0 ? featured : tools.slice(0, 3);
      return { suite, tools, picks };
    }).filter((entry) => {
      if (!q) return true;
      return (
        entry.suite.name.toLowerCase().includes(q) ||
        entry.suite.description.toLowerCase().includes(q) ||
        entry.tools.some((t) => t.name.toLowerCase().includes(q))
      );
    });
  }, [filterText]);

  const handleOpenSuite = (suiteId: string) => {
    trackCategoryViewed(suiteId);
    navigate(`/tools?suite=${suiteId}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
            Category Explorer
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            All 12 Utility Suites
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse {TOOLS_DATA.length} browser-native tools grouped by domain, workflow, and specialty.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter categories or tools..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Category Grid */}
      {suiteCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {suiteCards.map(({ suite, tools, picks }) => (
            <div
              key={suite.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${suite.accentColor}18`, color: suite.accentColor }}
                    >
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {suite.name}
                      </h2>
                      <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        {tools.length} tools · Local browser
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {suite.description}
                </p>

                {/* Highlighted Tools inside this category */}
                <div className="space-y-1.5 pt-1">
                  {picks.map((tool) => {
                    const fav = isFavorite(tool.slug);
                    return (
                      <div
                        key={tool.slug}
                        onClick={() => navigate(`/tools/${tool.slug}`)}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-950/40 hover:border-cyan-500/40 cursor-pointer transition-colors group"
                      >
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-cyan-500 truncate">
                          {tool.name}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(tool.slug);
                            }}
                            className="p-1 text-slate-400 hover:text-amber-500"
                            title={fav ? 'Remove favorite' : 'Add favorite'}
                          >
                            <Star className={`w-3 h-3 ${fav ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenSuite(suite.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                  style={{ color: suite.accentColor }}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Explore {suite.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800 dark:text-white">
            No categories matched "{filterText}"
          </p>
          <button
            type="button"
            onClick={() => setFilterText('')}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
};
