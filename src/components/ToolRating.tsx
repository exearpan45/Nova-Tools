import React, { useState, useEffect } from 'react';
import { Star, RotateCcw } from 'lucide-react';
import { getToolRating, setToolRating } from '../utils/storage';
import { useToast } from '../context/ToastContext';

interface ToolRatingProps {
  slug: string;
  toolName: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export const ToolRating: React.FC<ToolRatingProps> = ({
  slug,
  toolName,
  size = 'md',
  showLabel = true,
}) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  useEffect(() => {
    setRating(getToolRating(slug));
    setHoverRating(0);
  }, [slug]);

  const handleRate = (starValue: number) => {
    // If clicking the current rating, allow clearing it
    if (rating === starValue) {
      setToolRating(slug, 0);
      setRating(0);
      showToast(`Rating cleared for ${toolName}`, 'info');
      return;
    }

    const { rating: newScore } = setToolRating(slug, starValue);
    setRating(newScore);
    const label = RATING_LABELS[newScore] || '';
    showToast(`Rated ${newScore}/5 stars (${label}). Thank you!`, 'copied');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setToolRating(slug, 0);
    setRating(0);
    showToast('Rating cleared', 'info');
  };

  const activeScore = hoverRating > 0 ? hoverRating : rating;
  const starIconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 sm:w-4.5 sm:h-4.5';

  return (
    <div
      className="inline-flex flex-wrap items-center gap-2 py-1"
      role="radiogroup"
      aria-label={`Rating for ${toolName}`}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= activeScore;
          return (
            <button
              key={starValue}
              type="button"
              id={`rate-${slug}-star-${starValue}`}
              role="radio"
              aria-checked={rating === starValue}
              aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''} - ${RATING_LABELS[starValue]}`}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRate(starValue)}
              className="p-1 rounded-md transition-transform hover:scale-115 focus:outline-none focus:ring-2 focus:ring-amber-400/30 cursor-pointer"
            >
              <Star
                className={`${starIconSize} transition-colors ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                    : 'text-neutral-300 dark:text-neutral-700 hover:text-amber-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showLabel && (
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          {activeScore > 0 ? (
            <>
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                {activeScore}/5
              </span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {RATING_LABELS[activeScore]}
              </span>
              {rating > 0 && hoverRating === 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear your rating"
                  className="ml-1 text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              )}
            </>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-500">
              Rate this tool
            </span>
          )}
        </div>
      )}
    </div>
  );
};
