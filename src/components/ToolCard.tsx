import React from 'react';
import { ToolDefinition } from '../types';
import { ToolIcon } from './ToolIcon';
import { ArrowRight, Heart, Star } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
  rating?: number;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onClick,
  isFavorite = false,
  onToggleFavorite,
  rating = 0,
}) => {
  return (
    <div
      id={`tool-card-${tool.slug}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative flex flex-col items-start p-4 rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-[#18181b] hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-xs transition-all text-left cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
    >
      <div className="flex items-center justify-between w-full mb-3">
        <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors">
          <ToolIcon name={tool.icon} className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-1.5">
          {rating > 0 && (
            <span
              title={`You rated this ${rating}/5 stars`}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[10px] font-semibold text-amber-700 dark:text-amber-300"
            >
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </span>
          )}
          {onToggleFavorite && (
            <button
              type="button"
              id={`fav-btn-${tool.slug}`}
              aria-label={isFavorite ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(tool.slug);
              }}
              className="p-1 rounded-md text-neutral-400 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFavorite
                    ? 'fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400'
                    : 'stroke-current'
                }`}
              />
            </button>
          )}
          <ArrowRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {tool.name}
      </h3>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
        {tool.description}
      </p>
    </div>
  );
};

