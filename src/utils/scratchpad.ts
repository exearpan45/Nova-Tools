// Ephemeral in-memory Session Scratchpad for active tools
// Zero server communication, wiped on session end or tab close

export interface ScratchpadItem {
  id: string;
  slug: string;
  result: string;
  label?: string;
  timestamp: number;
}

const memoryStore: Record<string, ScratchpadItem[]> = {};

export function addScratchpadItem(slug: string, result: string, label?: string): void {
  if (!result || !result.trim()) return;
  const cleanResult = result.trim();
  
  if (!memoryStore[slug]) {
    memoryStore[slug] = [];
  }

  // Avoid consecutive duplicates
  if (memoryStore[slug].length > 0 && memoryStore[slug][0].result === cleanResult) {
    return;
  }

  const newItem: ScratchpadItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    slug,
    result: cleanResult,
    label: label?.trim() || undefined,
    timestamp: Date.now()
  };

  // Keep up to 6 recent entries per tool
  memoryStore[slug] = [newItem, ...memoryStore[slug]].slice(0, 6);

  window.dispatchEvent(new CustomEvent('nova:scratchpad:update', { detail: { slug } }));
}

export function getScratchpadItems(slug: string): ScratchpadItem[] {
  return memoryStore[slug] || [];
}

export function clearScratchpad(slug: string): void {
  delete memoryStore[slug];
  window.dispatchEvent(new CustomEvent('nova:scratchpad:update', { detail: { slug } }));
}
