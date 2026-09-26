// Unicode-aware Text Metrics using Intl.Segmenter with reliable fallback

export function countGraphemes(text: string): number {
  if (!text) return 0;
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' });
      let count = 0;
      for (const _ of segmenter.segment(text)) {
        count++;
      }
      return count;
    } catch {
      // Fallback to surrogate pair expansion
    }
  }
  return Array.from(text).length;
}

export function countWordsUnicode(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as any).Segmenter(undefined, { granularity: 'word' });
      let count = 0;
      for (const segment of segmenter.segment(trimmed)) {
        if (segment.isWordLike) {
          count++;
        }
      }
      return count;
    } catch {
      // Fallback
    }
  }
  return trimmed.split(/\s+/).filter(Boolean).length;
}
