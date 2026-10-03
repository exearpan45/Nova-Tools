import React from 'react';
import {
  Search, ArrowRight, Star, Sparkles, ChevronRight, GitFork
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { SUITE_LIST, SUITES_DATA } from '../data/suitesData';
import { FEATURED_TOOLS, TOOLS_DATA } from '../data/toolsData';

export const HomePage: React.FC = () => {
  const { navigate, setSearchOpen, isFavorite, toggleFavorite } = useNova();

  const quickActions = [
    { name: 'Compress', slug: 'image-compressor', icon: '🗜️' },
    { name: 'Merge PDF', slug: 'pdf-merger', icon: '📑' },
    { name: 'Format JSON', slug: 'json-formatter', icon: '🧩' },
    { name: 'QR Code', slug: 'qr-generator', icon: '📱' },
    { name: 'Password', slug: 'password-generator', icon: '🔒' },
    { name: 'WebP Convert', slug: 'jpg-to-webp', icon: '⚡' },
    { name: 'Resize', slug: 'image-resizer', icon: '📐' },
    { name: 'Study Timer', slug: 'pomodoro-timer', icon: '⏱️' },
    { name: 'Percentage', slug: 'percentage-calculator', icon: '🧮' },
    { name: 'Unit Convert', slug: 'unit-converter', icon: '📏' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-12 animate-page-enter">
      {/* 1. Mobile Search Bar (Directly top on phones) */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 active:scale-[0.99] transition-all text-xs shadow-xs"
          aria-label="Search tools"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="font-medium text-slate-600 dark:text-slate-300">Search tools...</span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shrink-0">
            Search
          </span>
        </button>
      </div>

      {/* 2. Compact Hero Section */}
      <section className="relative pt-1 sm:pt-2 md:pt-6 text-center max-w-4xl mx-auto space-y-2 sm:space-y-3 md:space-y-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] sm:text-xs font-semibold">
          <Sparkles className="w-3 h-3" />
          <span>NOVA TOOLS · 100+ Utilities</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-snug sm:leading-tight text-balance">
          Your tools.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">
            One workspace.
          </span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed px-2">
          100+ fast tools for files, images, developers, students, and everyday work. 100% private in your browser.
        </p>

        {/* Desktop Search Trigger (Visible on md+ screens) */}
        <div className="hidden md:block pt-2 max-w-2xl mx-auto">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  What do you want to do?
                </span>
                <span className="text-xs text-slate-400">
                  Try "compress image", "merge pdf", "percentage", "format json"...
                </span>
              </div>
            </div>
            <kbd className="inline-flex items-center px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>
      </section>

      {/* 3. Quick Actions (Horizontal swipe chips on mobile) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Actions
          </span>
          <span className="text-[10px] text-slate-400 md:hidden">Swipe →</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-0.5 -mx-1 sm:mx-0 sm:flex-wrap sm:justify-center">
          {quickActions.map((qa) => (
            <button
              key={qa.slug}
              onClick={() => navigate(`/tools/${qa.slug}`)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-xs shrink-0 active:scale-95 cursor-pointer"
            >
              <span>{qa.icon}</span>
              <span className="whitespace-nowrap">{qa.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Popular & Featured Tools (2 columns on mobile) */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular Tools
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Frequently used utilities by developers, creators, and students
            </p>
          </div>
          <button
            onClick={() => navigate('/tools')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
          {FEATURED_TOOLS.slice(0, 8).map((tool) => {
            const suite = SUITES_DATA[tool.suite];
            const isFav = isFavorite(tool.slug);

            return (
              <div
                key={tool.slug}
                onClick={() => navigate(`/tools/${tool.slug}`)}
                className="p-3 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/60 hover:border-cyan-500/40 hover:shadow-md cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between"
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
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-1">
                      {tool.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-2 mt-0.5 leading-tight">
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
      </section>

      {/* 5. Tool Suites (2 columns on mobile) */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Tool Suites
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              12 curated workspaces grouped by task type
            </p>
          </div>
          <button
            onClick={() => navigate('/tools')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>All Tools</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
          {SUITE_LIST.map((suite) => {
            const count = TOOLS_DATA.filter((t) => t.suite === suite.id).length;

            return (
              <div
                key={suite.id}
                onClick={() => navigate(`/tools?suite=${suite.id}`)}
                className="p-3 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/50 hover:border-cyan-500/40 hover:shadow-md cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold"
                      style={{ backgroundColor: `${suite.accentColor}18`, color: suite.accentColor }}
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {count}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors truncate">
                      {suite.name}
                    </h3>
                    <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 leading-relaxed">
                      {suite.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px] sm:text-xs text-slate-400">
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{count} tools</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Workflows Banner */}
      <section className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-500/10 via-violet-600/10 to-pink-500/10 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            <GitFork className="w-3.5 h-3.5" />
            <span>Multi-Tool Pipelines</span>
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white">
            Sequential Automated Workflows
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
            Run chained tool operations (Resize → WebP → Compress) sequentially in memory with one download.
          </p>
        </div>

        <button
          onClick={() => navigate('/workflows')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all shrink-0 text-center active:scale-95"
        >
          Explore
        </button>
      </section>
    </div>
  );
};
