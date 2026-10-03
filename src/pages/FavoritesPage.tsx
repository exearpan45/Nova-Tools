import React, { useState, useMemo } from 'react';
import { Star, Search, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { TOOLS_DATA } from '../data/toolsData';
import { SUITES_DATA } from '../data/suitesData';

export const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite, navigate } = useNova();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const favoritedTools = useMemo(() => {
    return favorites
      .map((slug) => TOOLS_DATA.find((t) => t.slug === slug))
      .filter(Boolean)
      .filter((tool) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          tool!.name.toLowerCase().includes(q) ||
          tool!.description.toLowerCase().includes(q) ||
          tool!.suite.toLowerCase().includes(q)
        );
      }) as typeof TOOLS_DATA;
  }, [favorites, searchQuery]);

  return (
    <div className="space-y-8 animate-page-enter">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Favorite Tools
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Your pinned quick-access workspace ({favorites.length} saved)
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved favorites..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>
        )}
      </div>

      {favoritedTools.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
          {favoritedTools.map((tool) => {
            const suite = SUITES_DATA[tool.suite];

            return (
              <div
                key={tool.slug}
                onClick={() => navigate(`/tools/${tool.slug}`)}
                className="p-3 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/50 hover:border-cyan-500/40 hover:shadow-md cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between"
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
                      className="p-1 rounded text-amber-500 hover:text-slate-400 transition-colors"
                      title="Remove from favorites"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
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
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No favorite tools saved yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the star icon on any tool card or detail header to save your most used utilities here for instant access.
          </p>
          <button
            onClick={() => navigate('/tools')}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            Explore Tools Directory
          </button>
        </div>
      )}
    </div>
  );
};
