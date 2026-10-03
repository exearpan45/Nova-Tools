import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Grid, List, Star, Filter, ArrowRight, Sparkles, Check
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { TOOLS_DATA } from '../data/toolsData';
import { SUITE_LIST, SUITES_DATA } from '../data/suitesData';
import { ToolSuite } from '../types';

export const ToolsPage: React.FC = () => {
  const { currentPath, navigate, isFavorite, toggleFavorite, settings } = useNova();

  // Parse URL query parameter from currentPath
  const currentSuiteParam = useMemo(() => {
    try {
      const search = currentPath.includes('?') ? currentPath.split('?')[1] : '';
      const params = new URLSearchParams(search);
      const s = params.get('suite') as ToolSuite | null;
      if (s && SUITES_DATA[s]) return s;
      return null;
    } catch {
      return null;
    }
  }, [currentPath]);

  const [selectedSuite, setSelectedSuite] = useState<ToolSuite | 'all'>(() => {
    if (currentSuiteParam) return currentSuiteParam;
    if (settings.defaultSuite && settings.defaultSuite !== 'all') return settings.defaultSuite;
    return 'all';
  });

  useEffect(() => {
    if (currentSuiteParam) {
      setSelectedSuite(currentSuiteParam);
    } else if (!currentPath.includes('suite=')) {
      setSelectedSuite(settings.defaultSuite && settings.defaultSuite !== 'all' ? settings.defaultSuite : 'all');
    }
  }, [currentSuiteParam, currentPath, settings.defaultSuite]);

  const handleSelectSuite = (suiteId: ToolSuite | 'all') => {
    setSelectedSuite(suiteId);
    if (suiteId === 'all') {
      navigate('/tools');
    } else {
      navigate(`/tools?suite=${suiteId}`);
    }
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter tools
  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      const matchSuite = selectedSuite === 'all' || tool.suite === selectedSuite;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchSuite && matchSearch;
    });
  }, [selectedSuite, searchQuery]);

  return (
    <div className="space-y-8 animate-page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Tools Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse all {TOOLS_DATA.length} client-side utilities across 12 suites
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1 sm:mx-0">
        <button
          onClick={() => handleSelectSuite('all')}
          className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedSuite === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50'
          }`}
        >
          All Tools ({TOOLS_DATA.length})
        </button>
        {SUITE_LIST.map((suite) => {
          const count = TOOLS_DATA.filter((t) => t.suite === suite.id).length;
          const isSelected = selectedSuite === suite.id;

          return (
            <button
              key={suite.id}
              onClick={() => handleSelectSuite(suite.id)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50'
              }`}
              style={isSelected ? { backgroundColor: suite.accentColor } : {}}
            >
              <span>{suite.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Filter ${selectedSuite === 'all' ? 'all' : SUITES_DATA[selectedSuite].name} tools...`}
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Tools Content: Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
          {filteredTools.map((tool) => {
            const suite = SUITES_DATA[tool.suite];
            const isFav = isFavorite(tool.slug);

            return (
              <div
                key={tool.slug}
                onClick={() => navigate(`/tools/${tool.slug}`)}
                className="p-3 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/50 hover:border-cyan-500/40 hover:shadow-lg dark:hover:shadow-cyan-950/20 cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between"
              >
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider truncate max-w-[80px] sm:max-w-none"
                      style={{ backgroundColor: `${suite.accentColor}18`, color: suite.accentColor }}
                    >
                      {suite.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.slug);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-1">
                      {tool.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-2 mt-0.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Local</span>
                  <span className="group-hover:text-cyan-500 font-semibold flex items-center gap-0.5">
                    Open <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTools.map((tool) => {
            const suite = SUITES_DATA[tool.suite];
            const isFav = isFavorite(tool.slug);

            return (
              <div
                key={tool.slug}
                onClick={() => navigate(`/tools/${tool.slug}`)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold"
                    style={{ backgroundColor: `${suite.accentColor}18`, color: suite.accentColor }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                        {tool.name}
                      </span>
                      <span
                        className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold"
                        style={{ backgroundColor: `${suite.accentColor}18`, color: suite.accentColor }}
                      >
                        {suite.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-xl">{tool.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tool.slug);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-amber-500"
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
