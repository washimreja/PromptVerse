// PromptVerse — Fuse.js Fuzzy Search Engine
// Powers instant, typo-tolerant search across all prompts

import Fuse, { type FuseResult } from "fuse.js";
import type { Prompt } from "@/types";
import promptsData from "@/data/prompts.json";

const ALL_PROMPTS: Prompt[] = promptsData as Prompt[];

// Fuse.js configuration — tuned for prompt search
const fuse = new Fuse(ALL_PROMPTS, {
  // Fields to search in (weighted)
  keys: [
    { name: "title",       weight: 0.40 },
    { name: "description", weight: 0.20 },
    { name: "tags",        weight: 0.20 },
    { name: "category",    weight: 0.10 },
    { name: "model",       weight: 0.05 },
    { name: "style",       weight: 0.05 },
  ],
  // Fuzzy matching settings
  threshold:       0.35,   // 0=exact, 1=anything (0.35 = tolerant but precise)
  distance:        200,    // Max distance for character matching
  minMatchCharLength: 2,   // Min characters before searching
  includeScore:    true,   // Include relevance score
  includeMatches:  false,  // Skip match data for performance
  ignoreLocation:  true,   // Search anywhere in the string
  useExtendedSearch: false,
  shouldSort:      true,
});

export interface SearchResultItem {
  prompt: Prompt;
  score: number; // 0 = perfect match, 1 = no match
}

/** Full-text fuzzy search */
export function searchPrompts(query: string, limit = 48): SearchResultItem[] {
  if (!query.trim() || query.trim().length < 2) return [];

  const results: FuseResult<Prompt>[] = fuse.search(query.trim(), { limit });

  return results.map((r) => ({
    prompt: r.item,
    score: r.score ?? 1,
  }));
}

/** Get search suggestions based on partial query */
export function getSearchSuggestions(query: string, limit = 5): string[] {
  if (!query.trim() || query.trim().length < 1) return [];

  const results = fuse.search(query.trim(), { limit: limit * 2 });

  // Extract unique category + title suggestions
  const suggestions = new Set<string>();
  for (const r of results) {
    suggestions.add(r.item.title);
    if (suggestions.size >= limit) break;
  }

  return Array.from(suggestions).slice(0, limit);
}

/** "Did you mean?" — returns closest alternative when no results found */
export function getDidYouMean(query: string): string | null {
  const lenient = new Fuse(ALL_PROMPTS, {
    keys: ["title", "tags", "category"],
    threshold: 0.6,
    includeScore: true,
    ignoreLocation: true,
  });

  const results = lenient.search(query.trim(), { limit: 1 });
  if (results.length === 0 || (results[0].score ?? 1) > 0.55) return null;

  return results[0].item.title;
}

/** Get prompts that match a tag exactly */
export function searchByTag(tag: string, limit = 24): Prompt[] {
  return ALL_PROMPTS.filter((p) =>
    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  ).slice(0, limit);
}
