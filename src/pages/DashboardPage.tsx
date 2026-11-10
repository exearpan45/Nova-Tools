import React from 'react';
import {
  LayoutDashboard, Star, History, Sparkles, ArrowRight, ShieldCheck,
  Zap, Wrench, HardDrive, Smartphone, FileText, CheckCircle2, ChevronRight,
  Calculator, Image, Code2, Globe, Cpu, Palette
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { TOOLS_DATA, TOOLS_BY_SLUG } from '../data/toolsData';
import { SUITE_LIST, SUITES_DATA } from '../data/suitesData';

export const DashboardPage: React.FC = () => {
  const {
    favorites,
    recentTools,
    navigate,
    setSearchOpen,
    pwaInstallPrompt,
    installPwa,
    clearRecent
  } = useNova();

  const favoriteTools = favorites
    .map((slug) => TOOLS_BY_SLUG.get(slug))
    .filter(Boolean);

  const recentToolObjs = recentTools
    .map((r) => ({ ...r, tool: TOOLS_BY_SLUG.get(r.slug) }))
    .filter((r) => r.tool);

  // Quick Action Suites
  const suiteHighlights = [
    { title: 'Calculators', count: 15, icon: Calculator, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', suite: 'calculators' },
    { title: 'Image Studio', count: 18, icon: Image, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.25)', suite: 'image' },
    { title: 'Developer Suite', count: 24, icon: Code2, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.25)', suite: 'developer' },
    { title: 'Web & QR', count: 12, icon: Globe, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.25)', suite: 'web' },
    { title: 'Design & CSS', count: 10, icon: Palette, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.25)', suite: 'design' },
    { title: 'Converters & Utilities', count: 24, icon: Cpu, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', suite: 'utility' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-page-enter">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 via-cyan-500/5 to-slate-900/5 dark:from-[#10182B] dark:via-[#090E1D] dark:to-[#080D1C] p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-xs font-bold tracking-wide">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>NOVA COMMAND DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Personalized Utility Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Quick access to your pinned tools, recent operations, and 100% in-browser utilities with zero server data tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Smart Search</span>
            </button>
            <button
              onClick={() => navigate('/workspace')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-cyan-500 font-bold text-xs transition-all"
            >
              <FileText className="w-4 h-4 text-cyan-500" />
              <span>Open Workspace</span>
            </button>
          </div>
        </div>

        {/* Decorative ambient orb */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Arsenal</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {TOOLS_DATA.length}+
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Genuinely functional tools</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pinned Favorites</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {favorites.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Quick-access essentials</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Recent History</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {recentTools.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Saved operations</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Security & Privacy</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-emerald-500">
            100%
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Local client execution</p>
        </div>
      </div>

      {/* Main Grid: Favorites & Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pinned Favorites */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Favorite Tools</h2>
            </div>
            <button
              onClick={() => navigate('/favorites')}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {favoriteTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {favoriteTools.slice(0, 6).map((tool) => (
                <button
                  key={tool!.slug}
                  onClick={() => navigate(`/tools/${tool!.slug}`)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all text-left group"
                >
                  <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{tool!.icon}</span>
                  <div className="min-w-0 flex-1 truncate">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {tool!.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {tool!.description}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <Star className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs">No tools pinned yet. Star tools to add them here.</p>
            </div>
          )}
        </div>

        {/* Recently Used Tools */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-violet-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Tools</h2>
            </div>
            {recentToolObjs.length > 0 && (
              <button
                onClick={clearRecent}
                className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {recentToolObjs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recentToolObjs.slice(0, 6).map((item) => (
                <button
                  key={item.slug}
                  onClick={() => navigate(`/tools/${item.slug}`)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:border-violet-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all text-left group"
                >
                  <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div className="min-w-0 flex-1 truncate">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">
                      Used recently
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-500 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <History className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs">No recent tools yet. Open any utility to track your session.</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Suites Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Explore Toolkit Categories
          </h2>
          <button
            onClick={() => navigate('/tools')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All Tools</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {suiteHighlights.map((suite) => {
            const Icon = suite.icon;
            return (
              <button
                key={suite.title}
                onClick={() => navigate('/tools')}
                className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/60 hover:-translate-y-1 transition-all text-left shadow-xs group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: suite.bg, color: suite.color, border: `1px solid ${suite.border}` }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {suite.title}
                </h3>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {suite.count}+ tools
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
