// PromptVerse — Data Access Layer
// All data fetching goes through these functions.
// Replace the JSON imports with Supabase client calls for V2 migration.

import type { Prompt, FilterState, SortOption } from "@/types";
import promptsData from "@/data/prompts.json";

const ALL_PROMPTS: Prompt[] = (promptsData as Prompt[]).map((p) => ({
  ...p,
  isPro: p.isTrending && p.copyCount > 1800,
}));

/* ── Helpers ───────────────────────────────────── */

function sortPrompts(prompts: Prompt[], sort: SortOption): Prompt[] {
  switch (sort) {
    case "newest":
    case "recently-added":
      return [...prompts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "trending":
      return [...prompts].sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.copyCount - a.copyCount);
    case "most-copied":
    case "most-popular":
      return [...prompts].sort((a, b) => b.copyCount - a.copyCount);
    default:
      return prompts;
  }
}

/* ── Public API ────────────────────────────────── */

/** Get all prompts with optional filtering and sorting */
export async function getPrompts(filters?: Partial<FilterState>): Promise<Prompt[]> {
  let results = [...ALL_PROMPTS];

  if (filters?.category && filters.category !== "all") {
    results = results.filter((p) => p.category === filters.category);
  }
  if (filters?.model && filters.model !== "all") {
    results = results.filter((p) => p.model === filters.model);
  }
  if (filters?.difficulty && filters.difficulty !== "all") {
    const diffMap = { easy: 1, medium: 2, expert: 3 } as const;
    const d = diffMap[filters.difficulty as keyof typeof diffMap];
    if (d) results = results.filter((p) => p.difficulty === d);
  }
  if (filters?.length && filters.length !== "all") {
    results = results.filter((p) => {
      const words = p.prompt.trim().split(/\s+/).length;
      if (filters.length === "short")  return words < 30;
      if (filters.length === "medium") return words >= 30 && words < 80;
      if (filters.length === "long")   return words >= 80;
      return true;
    });
  }

  return sortPrompts(results, filters?.sort ?? "newest");
}

/** Get a single prompt by ID */
export async function getPromptById(id: string): Promise<Prompt | null> {
  return ALL_PROMPTS.find((p) => p.id === id) ?? null;
}

/** Get a single prompt by slug */
export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  return ALL_PROMPTS.find((p) => p.slug === slug) ?? null;
}

/** Get prompts by category slug */
export async function getPromptsByCategory(
  category: string,
  sort: SortOption = "newest"
): Promise<Prompt[]> {
  const results = ALL_PROMPTS.filter((p) => p.category === category);
  return sortPrompts(results, sort);
}

/** Get prompts by AI model slug */
export async function getPromptsByModel(
  model: string,
  sort: SortOption = "newest"
): Promise<Prompt[]> {
  const results = ALL_PROMPTS.filter((p) => p.model === model);
  return sortPrompts(results, sort);
}

/** Get featured prompts */
export async function getFeaturedPrompts(limit = 6): Promise<Prompt[]> {
  return ALL_PROMPTS.filter((p) => p.isFeatured).slice(0, limit);
}

/** Get trending prompts */
export async function getTrendingPrompts(limit = 8): Promise<Prompt[]> {
  return ALL_PROMPTS.filter((p) => p.isTrending)
    .sort((a, b) => b.copyCount - a.copyCount)
    .slice(0, limit);
}

/** Get most copied prompts */
export async function getMostCopiedPrompts(limit = 8): Promise<Prompt[]> {
  return [...ALL_PROMPTS]
    .sort((a, b) => b.copyCount - a.copyCount)
    .slice(0, limit);
}

/** Get latest prompts */
export async function getLatestPrompts(limit = 8): Promise<Prompt[]> {
  return [...ALL_PROMPTS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/** Get editor's choice prompts */
export async function getEditorChoicePrompts(limit = 6): Promise<Prompt[]> {
  return ALL_PROMPTS.filter((p) => p.isFeatured && p.quality >= 4).slice(0, limit);
}

/** Get related prompts (same category, excluding current) */
export async function getRelatedPrompts(
  currentId: string,
  category: string,
  limit = 4
): Promise<Prompt[]> {
  return ALL_PROMPTS.filter((p) => p.category === category && p.id !== currentId)
    .sort((a, b) => b.copyCount - a.copyCount)
    .slice(0, limit);
}

/** Get a random prompt */
export async function getRandomPrompt(): Promise<Prompt> {
  const idx = Math.floor(Math.random() * ALL_PROMPTS.length);
  return ALL_PROMPTS[idx];
}

/** Get all prompts as static params (for generateStaticParams) */
export function getAllPromptSlugs(): { id: string }[] {
  return ALL_PROMPTS.map((p) => ({ id: p.id }));
}

/** Get category counts */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of ALL_PROMPTS) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}

/** Get model counts */
export function getModelCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of ALL_PROMPTS) {
    counts[p.model] = (counts[p.model] ?? 0) + 1;
  }
  return counts;
}

/** Total prompts count */
export const TOTAL_PROMPTS = ALL_PROMPTS.length;
