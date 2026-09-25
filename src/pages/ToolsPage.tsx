import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { TOOLS_DATA, TOOL_CATEGORIES } from '../data/toolsData';
import { ToolCard } from '../components/ToolCard';
import { ToolCategory } from '../types';
import { getFavoriteToolSlugs, toggleFavoriteToolSlug, getAllToolRatings } from '../utils/storage';
import { useToast } from '../context/ToastContext';

interface ToolsPageProps {
  onNavigate: (path: string) => void;
}

type SortOption = 'popular' | 'alpha' | 'category' | 'rating';

export const ToolsPage: React.FC<ToolsPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
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

  const handleToggleFavorite = (slug: string) => {
    const { isFavorite, favorites } = toggleFavoriteToolSlug(slug);
    setFavoriteSlugs(favorites);
    showToast(isFavorite ? 'Added to favorites' : 'Removed from favorites', 'info');
  };

  const filtered = TOOLS_DATA.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const q = search.trim().toLowerCase();
    if (!q) return matchesCategory;

    const matchesName = tool.name.toLowerCase().includes(q);
    const matchesDesc = tool.description.toLowerCase().includes(q);
    const matchesKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));

    return matchesCategory && (matchesName || matchesDesc || matchesKeywords);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'alpha') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    }
    if (sortBy === 'rating') {
      const scoreA = ratings[a.slug] || 0;
      const scoreB = ratings[b.slug] || 0;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return a.name.localeCompare(b.name);
    }
    // 'popular'
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return 0;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            All Tools
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Explore our collection of fast, private browser-based utilities.
          </p>
        </div>
        <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {sorted.length} {sorted.length === 1 ? 'tool' : 'tools'} available
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            id="tools-page-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools by name, description, or keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#18181b] text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Sort:</span>
          <select
            id="tools-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs bg-white dark:bg-[#18181b] border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="popular">Popular first</option>
            <option value="rating">Highest Rated</option>
            <option value="alpha">A–Z</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
        {['All', ...TOOL_CATEGORIES].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === category
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((tool) => (
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
        <div className="py-16 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            No tools found
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            No tools matched "{search}".
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
