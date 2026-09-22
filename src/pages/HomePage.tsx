import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Sparkles, ShieldCheck, Cpu, EyeOff, Lock, Heart, Clock, RotateCcw } from 'lucide-react';
import { TOOLS_DATA, TOOL_CATEGORIES } from '../data/toolsData';
import { ToolCard } from '../components/ToolCard';
import { ToolDefinition, ToolCategory } from '../types';
import { getRecentToolSlugs, clearRecentTools, getFavoriteToolSlugs, toggleFavoriteToolSlug } from '../utils/storage';
import { useToast } from '../context/ToastContext';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inlineQuery, setInlineQuery] = useState<string>('');
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    setRecentSlugs(getRecentToolSlugs());
    setFavoriteSlugs(getFavoriteToolSlugs());
  }, []);

  const handleToggleFavorite = (slug: string) => {
    const { isFavorite, favorites } = toggleFavoriteToolSlug(slug);
    setFavoriteSlugs(favorites);
    showToast(isFavorite ? 'Added to favorites' : 'Removed from favorites', 'info');
  };

  const handleClearRecents = () => {
    clearRecentTools();
    setRecentSlugs([]);
    showToast('Recent tools cleared', 'info');
  };

  const recentTools = recentSlugs
    .map((slug) => TOOLS_DATA.find((t) => t.slug === slug))
    .filter((t): t is ToolDefinition => !!t);

  const favoriteTools = favoriteSlugs
    .map((slug) => TOOLS_DATA.find((t) => t.slug === slug))
    .filter((t): t is ToolDefinition => !!t);

  const popularTools = TOOLS_DATA.filter((t) => t.popular);

  const displayedTools = TOOLS_DATA.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const q = inlineQuery.trim().toLowerCase();
    if (!q) return matchesCategory;
    const matchesQuery =
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Simple tools. Done well.
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          Free, fast tools for everyday tasks.
        </p>

        {/* Hero Search Box */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              id="hero-search-input"
              type="text"
              value={inlineQuery}
              onChange={(e) => setInlineQuery(e.target.value)}
              placeholder="Search tools... (Press / or ⌘K)"
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#18181b] text-sm text-neutral-900 dark:text-neutral-100 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-neutral-400"
            />
            {inlineQuery ? (
              <button
                onClick={() => setInlineQuery('')}
                className="absolute right-3 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                Clear
              </button>
            ) : (
              <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded pointer-events-none">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Quick Access Area (Item 3 & Item 28) */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">Quick tools:</span>
            <button
              onClick={() => onNavigate('/tools/calculator')}
              className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer"
            >
              Calculator
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('/tools/qr-generator')}
              className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer"
            >
              QR
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('/tools/password-generator')}
              className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer"
            >
              Password
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('/tools/unit-converter')}
              className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer"
            >
              Unit Converter
            </button>
          </div>
        </div>
      </section>

      {/* Favorites Section (Item 2) - Only displayed if favorites exist */}
      {!inlineQuery && favoriteTools.length > 0 && (
        <section id="favorites-section" className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              Favorites ({favoriteTools.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={`fav-${tool.slug}`}
                tool={tool}
                onClick={() => onNavigate(`/tools/${tool.slug}`)}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently Used Tools Section (Item 1) - Only displayed if recents exist */}
      {!inlineQuery && recentTools.length > 0 && (
        <section id="recent-tools-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                Recent
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClearRecents}
              className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear recent</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentTools.map((tool) => (
              <ToolCard
                key={`recent-${tool.slug}`}
                tool={tool}
                onClick={() => onNavigate(`/tools/${tool.slug}`)}
                isFavorite={favoriteSlugs.includes(tool.slug)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Tools Section (only if not searching) */}
      {!inlineQuery && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Popular Tools
            </h2>
            <button
              onClick={() => onNavigate('/tools')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all {TOOLS_DATA.length} tools</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                onClick={() => onNavigate(`/tools/${tool.slug}`)}
                isFavorite={favoriteSlugs.includes(tool.slug)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Tools Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {inlineQuery ? `Search Results (${displayedTools.length})` : 'All Tools'}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Showing {displayedTools.length} of {TOOLS_DATA.length} free browser tools
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {['All', ...TOOL_CATEGORIES].map((category) => (
              <button
                key={category}
                id={`cat-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {displayedTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                onClick={() => onNavigate(`/tools/${tool.slug}`)}
                isFavorite={favoriteSlugs.includes(tool.slug)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              No tools found
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Try adjusting your search terms or filter.
            </p>
            <button
              onClick={() => {
                setInlineQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* Privacy Guarantee Section */}
      <section id="privacy-guarantee-section" className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800">
        <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 bg-neutral-50/50 dark:bg-[#18181b]/50 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Data Harvesting</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Built with a strict Privacy-First Architecture
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
                Unlike web utilities that log keystrokes, send data to remote servers, or force logins, NOVA TOOLS computes everything in your browser.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/privacy-policy')}
              className="self-start sm:self-center px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              Read Full Privacy Policy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="space-y-1.5 p-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-200/70 dark:border-neutral-800/70">
              <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                100% In-Browser CPU
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Calculations, string conversions, QR encoding, and JSON parsing execute strictly on your device.
              </p>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-200/70 dark:border-neutral-800/70">
              <div className="w-7 h-7 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <EyeOff className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Zero Input Logging
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Your passwords, birth dates, text, and encoded payloads never touch remote databases or APIs.
              </p>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-200/70 dark:border-neutral-800/70">
              <div className="w-7 h-7 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                No Accounts Required
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Instant utility access without entering emails, creating passwords, or submitting phone numbers.
              </p>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-xl bg-white dark:bg-[#121214] border border-neutral-200/70 dark:border-neutral-800/70">
              <div className="w-7 h-7 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Web Crypto Standards
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Passwords leverage the operating system entropy pool via the W3C Web Cryptography standard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
