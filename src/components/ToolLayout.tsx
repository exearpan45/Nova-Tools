import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../types';
import { TOOLS_DATA } from '../data/toolsData';
import { AdSlot } from './AdSlot';
import { ToolIcon } from './ToolIcon';
import { ArrowLeft, ChevronRight, HelpCircle, BookOpen, ShieldCheck, Heart, Share2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { isToolFavorite, toggleFavoriteToolSlug } from '../utils/storage';
import { copyToClipboard } from '../utils/clipboard';

interface ToolLayoutProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  onNavigate,
  children
}) => {
  const { showToast } = useToast();
  const [isFav, setIsFav] = useState<boolean>(() => isToolFavorite(tool.slug));

  useEffect(() => {
    setIsFav(isToolFavorite(tool.slug));
  }, [tool.slug]);

  const handleToggleFav = () => {
    const { isFavorite } = toggleFavoriteToolSlug(tool.slug);
    setIsFav(isFavorite);
    showToast(isFavorite ? 'Saved to Favorites' : 'Removed from Favorites', 'info');
  };

  const handleShare = async () => {
    const toolUrl = `${window.location.origin}/tools/${tool.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} - NOVA TOOLS`,
          text: tool.description,
          url: toolUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to copy
      }
    }

    const copied = await copyToClipboard(toolUrl);
    if (copied) {
      showToast('Link copied to clipboard', 'copied');
    }
  };

  const relatedTools = TOOLS_DATA.filter((t) => tool.relatedSlugs.includes(t.slug));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        <button
          onClick={() => onNavigate('/tools')}
          className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Tools
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        <span className="text-neutral-900 dark:text-neutral-200 font-medium truncate">
          {tool.name}
        </span>
      </nav>

      {/* Tool Header */}
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <ToolIcon name={tool.icon} className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {tool.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="tool-fav-btn"
              onClick={handleToggleFav}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                isFav
                  ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFav
                    ? 'fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400'
                    : 'stroke-current'
                }`}
              />
              <span>{isFav ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              type="button"
              id="tool-share-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          {tool.description}
        </p>
      </header>

      {/* PRIMARY TOOL INTERFACE */}
      <main id={`tool-interface-${tool.slug}`} className="mb-6">
        <div className="bg-white dark:bg-[#18181b] border border-neutral-200/90 dark:border-neutral-800/90 rounded-xl p-4 sm:p-6 shadow-2xs">
          {children}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 px-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
            <span>100% Client-Side: Your input never leaves your browser.</span>
          </span>
          <button
            onClick={() => onNavigate('/privacy-policy')}
            className="hover:underline hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Privacy details
          </button>
        </div>
      </main>

      {/* Unobtrusive Ad Placement below tool */}
      <AdSlot id="tool-bottom-ad" />

      {/* How it works */}
      {tool.howItWorks && (
        <section className="mb-8 p-5 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-[#18181b]">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            <BookOpen className="w-4 h-4 text-neutral-500" />
            <h2>How it works</h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {tool.howItWorks}
          </p>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedTools.map((rel) => (
              <button
                key={rel.slug}
                onClick={() => onNavigate(`/tools/${rel.slug}`)}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#18181b] hover:border-neutral-300 dark:hover:border-neutral-700 text-left transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center flex-shrink-0 transition-colors">
                  <ToolIcon name={rel.icon} className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {rel.name}
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {rel.category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            <HelpCircle className="w-4 h-4 text-neutral-500" />
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {tool.faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-[#18181b]"
              >
                <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {faq.question}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
