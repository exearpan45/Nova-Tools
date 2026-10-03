import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getToolRating, setToolRating } from '../utils/storage';
import { useToast } from '../context/ToastContext';

interface ToolRatingProps {
  slug: string;
  toolName?: string;
}

export const ToolRating: React.FC<ToolRatingProps> = ({ slug, toolName }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const { showToast } = useToast();

  useEffect(() => {
    setRating(getToolRating(slug));
  }, [slug]);

  const handleRate = (star: number) => {
    const newRating = rating === star ? 0 : star;
    setToolRating(slug, newRating);
    setRating(newRating);
    if (newRating > 0) {
      showToast(`Rated ${newRating} star${newRating > 1 ? 's' : ''}`, 'success');
    }
  };

  return (
    <div className="flex items-center gap-1" title={toolName ? `Rate ${toolName}` : 'Rate this tool'}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="p-0.5 rounded hover:scale-110 transition-transform focus:outline-none"
          aria-label={`Rate ${star} star`}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              (hoverRating || rating) >= star
                ? 'fill-amber-400 text-amber-400'
                : 'text-neutral-300 dark:text-neutral-700'
            }`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="text-[11px] font-mono font-medium text-neutral-500 dark:text-neutral-400 ml-1">
          {rating}.0
        </span>
      )}
    </div>
  );
};
