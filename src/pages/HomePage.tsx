import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  EyeOff,
  Lock,
  Heart,
  Clock,
  RotateCcw,
  KeyRound,
  QrCode,
  FileCode2,
  ArrowLeftRight,
  Percent,
  X
} from 'lucide-react';
import { TOOLS_DATA, TOOL_CATEGORIES } from '../data/toolsData';
import { ToolCard } from '../components/ToolCard';
import { ToolDefinition, ToolCategory } from '../types';
import {
  getRecentToolSlugs,
  removeRecentToolSlug,
  clearRecentTools,
  getFavoriteToolSlugs,
  toggleFavoriteToolSlug,
  getAllToolRatings,
  isReturningUser,
  markUserVisited
} from '../utils/storage';
import { useToast } from '../context/ToastContext';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inlineQuery, setInlineQuery] = useState<string>('');
  const [isReturning] = useState<boolean>(() => {
    try {
      return isReturningUser();
    } catch {
      return false;
    }
  });
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => {
    try {
      return getRecentToolSlugs();
    } catch {
      return [];
    }
  });
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>(() => {
    try {
      return getFavoriteToolSlugs();
    } catch {
      return [];
    }
  });
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    try {
      return getAllToolRatings();
    } catch {
      return {};
    }
  });

  useEffect(() => {
    markUserVisited();
  }, []);

  const handleToggleFavorite = (slug: string) => {
    const { isFavorite, favorites } = toggleFavoriteToolSlug(slug);
    setFavoriteSlugs(favorites);
    showToast(isFavorite ? 'Added to favorites' : 'Removed from favorites', 'info');
  };

  const handleRemoveRecent = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeRecentToolSlug(slug);
    setRecentSlugs(updated);
    showToast('Removed from recent', 'info');
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
        {isReturning && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/40 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Welcome back</span>
          </div>
        )}

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
        </div>
      </section>

      {/* Quick Actions (Compact & Visually Clean) */}
      {!inlineQuery && (
        <section id="quick-actions-section" className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <button
              onClick={() => onNavigate('/tools/password-generator')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all text-left cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">Generate Password</div>
                <div className="text-[10px] text-neutral-400 truncate">Secure & custom</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('/tools/qr-generator')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all text-left cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">Create QR</div>
                <div className="text-[10px] text-neutral-400 truncate">PNG & SVG vector</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('/tools/json-formatter')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all text-left cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileCode2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">Format JSON</div>
                <div className="text-[10px] text-neutral-400 truncate">Validate & format</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('/tools/unit-converter')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all text-left cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">Convert Units</div>
                <div className="text-[10px] text-neutral-400 truncate">10 categories</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('/tools/percentage-calculator')}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all text-left cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Percent className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">Calculate Percentage</div>
                <div className="text-[10px] text-neutral-400 truncate">Increase & margin</div>
              </div>
            </button>
          </div>
        </section>
      )}

      {/* Favorites Section (Item 3) - Only displayed if favorites exist */}
      {!inlineQuery && favoriteTools.length > 0 && (
        <section id="favorites-section" className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              Your Favorites ({favoriteTools.length})
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
                rating={ratings[tool.slug] || 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently Used Tools Section (Item 2) - Only displayed if recents exist */}
      {!inlineQuery && recentTools.length > 0 && (
        <section id="recent-tools-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                Recently Used
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
              <div key={`recent-${tool.slug}`} className="relative group/recent">
                <ToolCard
                  tool={tool}
                  onClick={() => onNavigate(`/tools/${tool.slug}`)}
                  isFavorite={favoriteSlugs.includes(tool.slug)}
                  onToggleFavorite={handleToggleFavorite}
                  rating={ratings[tool.slug] || 0}
                />
                <button
                  type="button"
                  onClick={(e) => handleRemoveRecent(tool.slug, e)}
                  title="Remove from recent"
                  aria-label={`Remove ${tool.name} from recent tools`}
                  className="absolute top-2.5 right-10 p-1 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 opacity-0 group-hover/recent:opacity-100 transition-opacity cursor-pointer z-10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
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
                rating={ratings[tool.slug] || 0}
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
                rating={ratings[tool.slug] || 0}
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

      {/* Short NOVA TOOLS introduction */}
      <section id="about-intro-section" className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800">
        <div className="rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-[#18181b] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              About NOVA TOOLS
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              NOVA TOOLS is a collection of simple browser-based utilities for calculations, conversions, text processing, developer tasks and everyday digital work. The tools are designed to be quick to use, easy to understand and, where practical, processed directly in your browser.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('/about')}
              className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors text-center cursor-pointer"
            >
              Learn More
            </button>
            <button
              onClick={() => onNavigate('/privacy-policy')}
              className="px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-medium transition-colors text-center cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
