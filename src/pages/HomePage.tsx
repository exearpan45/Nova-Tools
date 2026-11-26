import React from 'react';
import {
  Search, ArrowRight, Star, Sparkles, ChevronRight, GitFork, LayoutDashboard,
  Layers, Code2, Palette, QrCode, Timer, BookOpen, Cpu, Clipboard, ShieldCheck, History
} from 'lucide-react';
import { useNova } from '../context/NovaContext';
import { SUITE_LIST, SUITES_DATA } from '../data/suitesData';
import { FEATURED_TOOLS, TOOLS_BY_SLUG, TOOLS_DATA } from '../data/toolsData';

export const HomePage: React.FC = () => {
  const { navigate, setSearchOpen, isFavorite, toggleFavorite, recentTools, favorites } = useNova();

  // Keep every shortcut aligned with a real tool slug in toolsData.
  const quickActions = [
    { name: 'Calculator', slug: 'calculator', icon: '🧮' },
    { name: 'Percentage', slug: 'percentage-calculator', icon: '％' },
    { name: 'Unit Convert', slug: 'unit-converter', icon: '📏' },
    { name: 'Temperature', slug: 'temperature-converter', icon: '🌡️' },
    { name: 'Format JSON', slug: 'json-formatter', icon: '🧩' },
    { name: 'QR Code', slug: 'qr-generator', icon: '📱' },
    { name: 'Password', slug: 'password-generator', icon: '🔒' },
    { name: 'Word Counter', slug: 'word-counter', icon: '📝' },
    { name: 'Base64', slug: 'base64', icon: '🔡' },
    { name: 'UUID', slug: 'uuid-generator', icon: '🆔' },
  ];

  const ecosystemStudios = [
    { title: 'File Studio', desc: 'Magic-byte inspection, batch image conversion & ZIP downloads', path: '/file-studio', icon: Layers, accent: '#3b82f6' },
    { title: 'Developer Lab', desc: 'Multi-tab Code Playground, JSON, Regex, JWT & File Inspector', path: '/developer-lab', icon: Code2, accent: '#10b981' },
    { title: 'Design Studio', desc: 'Palettes, WCAG Contrast, Gradients, Favicon & SVG Optimizer', path: '/design-studio', icon: Palette, accent: '#ec4899' },
    { title: 'QR Studio', desc: 'Logo QR, Wi-Fi, vCard, Code 128 Barcode & Camera Scanner', path: '/qr-studio', icon: QrCode, accent: '#f59e0b' },
    { title: 'Focus Studio', desc: 'Timestamp-accurate Pomodoro, Countdown presets & Zen Mode', path: '/focus', icon: Timer, accent: '#f43f5e' },
    { title: 'Learning Hub', desc: 'Searchable references for HTML, CSS, JS, Python & Math', path: '/learning-hub', icon: BookOpen, accent: '#0ea5e9' },
    { title: 'Snippets Vault', desc: 'Store reusable code blocks, links, prompts & templates', path: '/clipboard-vault', icon: Clipboard, accent: '#8b5cf6' },
    { title: 'Browser Utilities', desc: 'Viewport DPR monitor, Storage Inspector & Key/Mouse tests', path: '/browser-utilities', icon: Cpu, accent: '#14b8a6' },
  ];

  const recentPreview = recentTools
    .slice(0, 4)
    .map((r) => TOOLS_BY_SLUG.get(r.slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-12 animate-page-enter min-w-0">
      {/* 1. Mobile Search Bar */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 active:scale-[0.99] transition-all text-xs shadow-xs"
          aria-label="Search tools"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="font-medium text-slate-600 dark:text-slate-300">Search tools, studios, workflows...</span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shrink-0">
            Search
          </span>
        </button>
      </div>

      {/* 2. Hero Section */}
      <section className="relative isolate overflow-hidden pt-6 pb-6 px-4 sm:px-6 md:pt-12 md:pb-10 text-left max-w-full mx-0 space-y-4 sm:space-y-5 md:space-y-6 nova-home-hero rounded-[1.75rem] border border-violet-500/20 bg-gradient-to-br from-white via-violet-50/70 to-cyan-50/70 dark:from-[#090E1D] dark:via-[#10132A] dark:to-[#071B2A] shadow-2xl shadow-violet-950/5 dark:shadow-black/20">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-0 -z-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-[10px] sm:text-xs font-bold tracking-wide">
          <Sparkles className="w-3 h-3" />
          <span>NOVA TOOLS 2.0 · ONE SPACE. INFINITE POSSIBILITIES.</span>
        </div>

        <h1 className="text-[2.2rem] min-[390px]:text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.03] text-balance max-w-4xl">
          Everything You Need.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">
            One Powerful Space.
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Discover, create, organize and transform with a powerful collection of {TOOLS_DATA.length} browser-native utilities, 8 focused studios, and automated local workflows designed to make everyday work simpler.
        </p>

        <div className="flex flex-col min-[420px]:flex-row flex-wrap items-stretch min-[420px]:items-center justify-start gap-2.5 sm:gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/tools')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" /> Explore All Tools <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/workspace')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-300"
          >
            <LayoutDashboard className="h-4 w-4" /> Open Workspace
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/80 bg-white/70 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:border-violet-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
          >
            <Search className="h-4 w-4" /> Smart Search
          </button>
        </div>

        {/* Desktop Search Trigger */}
        <div className="hidden md:block pt-3 max-w-3xl">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  What do you want to accomplish?
                </span>
                <span className="text-xs text-slate-400">
                  Try "compress image", "file studio", "developer lab", "qr studio", "format json"...
                </span>
              </div>
            </div>
            <kbd className="inline-flex items-center px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>
      </section>

      {/* 3. Quick Actions Strip */}
      <section className="rounded-2xl border border-slate-200/80 dark:border-violet-400/20 bg-white/70 dark:bg-slate-950/40 p-3 sm:p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Launch
          </span>
          <span className="text-[10px] text-slate-400">{TOOLS_DATA.length} local tools · {favorites.length} pinned</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {quickActions.map((qa) => (
            <button
              key={qa.slug}
              type="button"
              onClick={() => navigate(`/tools/${qa.slug}`)}
              className="inline-flex items-center gap-2 px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-xs active:scale-[0.98] cursor-pointer text-left"
            >
              <span>{qa.icon}</span>
              <span className="whitespace-nowrap">{qa.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Ecosystem Studios Showcase */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              NOVA Ecosystem Studios
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unified workbenches built for batch processing, deep creation, and organized productivity
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {ecosystemStudios.map((studio) => {
            const Icon = studio.icon;
            return (
              <button
                key={studio.path}
                type="button"
                onClick={() => navigate(studio.path)}
                className="nova-tool-card p-4 rounded-2xl border border-slate-200/90 dark:border-violet-400/20 bg-white dark:bg-gradient-to-br dark:from-[#141D35] dark:to-[#090F20] shadow-sm hover:border-cyan-500/60 hover:shadow-lg cursor-pointer transition-all text-left flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${studio.accent}18`, color: studio.accent }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                      {studio.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {studio.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px]">
                  <span className="font-semibold" style={{ color: studio.accent }}>Launch Studio</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Recent History Strip (only when user has history) */}
      {recentPreview.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-500" />
              <span>Continue Where You Left Off</span>
            </h2>
            <button
              type="button"
              onClick={() => navigate('/recent')}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              View History <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentPreview.map((tool) => {
              const suite = SUITES_DATA[tool.suite];
              return (
                <button
                  key={tool.slug}
                  type="button"
                  onClick={() => navigate(`/tools/${tool.slug}`)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-cyan-500/50 text-left flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: suite.accentColor }}>
                      {suite.name}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">{tool.name}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Popular & Featured Tools */}
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
            type="button"
            onClick={() => navigate('/tools')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>All {TOOLS_DATA.length} Tools</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {FEATURED_TOOLS.slice(0, 8).map((tool) => {
            const suite = SUITES_DATA[tool.suite];
            const isFav = isFavorite(tool.slug);

            return (
              <div
                key={tool.slug}
                onClick={() => navigate(`/tools/${tool.slug}`)}
                className="nova-tool-card p-3 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-violet-400/20 bg-white dark:bg-gradient-to-br dark:from-[#141D35] dark:to-[#090F20] shadow-sm hover:border-cyan-500/60 hover:shadow-lg cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between"
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
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.slug);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-amber-500 transition-colors"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
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

      {/* 7. 12 Tool Suites */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Category Explorer
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              12 curated workspaces grouped by task type
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>Explore Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
          {SUITE_LIST.map((suite) => {
            const count = TOOLS_DATA.filter((t) => t.suite === suite.id).length;

            return (
              <div
                key={suite.id}
                onClick={() => navigate(`/tools?suite=${suite.id}`)}
                className="nova-suite-card p-3 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-violet-400/20 bg-white dark:bg-gradient-to-br dark:from-[#111B32] dark:to-[#090F20] shadow-sm hover:border-violet-400/60 hover:shadow-lg cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between"
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

      {/* 8. NOVA Flow & Privacy Architecture Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="nova-workflow-banner p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-violet-600/10 to-pink-500/10 border border-cyan-500/25 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              <GitFork className="w-3.5 h-3.5" />
              <span>NOVA Flow Pipelines</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Sequential Automated Workflows
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Chain PDF, image, JSON, CSV, and text transformations with step retry, JSON export/import, and local outputs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/workflows')}
            className="self-start px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-sm"
          >
            Open NOVA Flow
          </button>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Server Uploads</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Private By Architecture
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your documents, images, snippets, and calculations stay strictly in your browser. Inspect local storage or export a portable JSON backup anytime.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="self-start px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-white/80 dark:bg-slate-900/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs"
          >
            Privacy Center
          </button>
        </div>
      </section>
    </div>
  );
};
