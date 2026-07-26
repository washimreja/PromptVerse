// PromptVerse — Data Access Layer
// All data fetching goes through Supabase database calls using Prisma client.

import type { Prompt, FilterState, SortOption } from "@/types";
import { db } from "@/lib/db";

// Helper to map DB prompt to UI Prompt (e.g. adding isPro calculated property)
function mapPrompt(p: any): Prompt {
  return {
    ...p,
    isPro: p.isTrending && p.copyCount > 1800,
  } as Prompt;
}

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
  const prompts = await db.prompt.findMany();
  let results = prompts.map(mapPrompt);

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
  const p = await db.prompt.findUnique({
    where: { id }
  });
  return p ? mapPrompt(p) : null;
}

/** Get a single prompt by slug */
export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  const p = await db.prompt.findUnique({
    where: { slug }
  });
  return p ? mapPrompt(p) : null;
}

/** Get prompts by category slug */
export async function getPromptsByCategory(
  category: string,
  sort: SortOption = "newest"
): Promise<Prompt[]> {
  const prompts = await db.prompt.findMany({
    where: { category }
  });
  return sortPrompts(prompts.map(mapPrompt), sort);
}

/** Get prompts by AI model slug */
export async function getPromptsByModel(
  model: string,
  sort: SortOption = "newest"
): Promise<Prompt[]> {
  const prompts = await db.prompt.findMany({
    where: { model }
  });
  return sortPrompts(prompts.map(mapPrompt), sort);
}

/** Get featured prompts */
export async function getFeaturedPrompts(limit = 6): Promise<Prompt[]> {
  const prompts = await db.prompt.findMany({
    where: { isFeatured: true },
    take: limit
  });
  return prompts.map(mapPrompt);
}

/** Get trending prompts */
export async function getTrendingPrompts(limit = 8): Promise<Prompt[]> {
  const prompts = await db.prompt.findMany({
    where: { isTrending: true },
    orderBy: { copyCount: 'desc' },
    take: limit
  });
  return prompts.map(mapPrompt);
}

/** Get most copied prompts */
export async function getMostCopiedPrompts(limit = 8): Promise<Prompt[]> {
  const prompts = await db.prompt.findMany({
    orderBy: { copyCount: 'desc' },
    take: limit
  });
  return prompts.map(mapPrompt);
}

/** Get latest prompts */
export async function getLatestPrompts(limit = 8): Promise<Prompt[]> {
  const prompts = await db.prompt.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit
  });
  return prompts.map(mapPrompt);
}

/** Get editor's choice prompts */
export async function getEditorChoicePrompts(limit = 6): Promise<Prompt[]> {
  const prompts = await db.prompt.findMany({
    where: { isFeatured: true, quality: { gte: 4 } },
    take: limit
  });
  return prompts.map(mapPrompt);
}

/** Get related prompts (same category, excluding current) */
export async function getRelatedPrompts(
  currentId: string,
  category: string,
  limit = 4
): Promise<Prompt[]> {
  const prompts = await db.prompt.findMany({
    where: {
      category,
      id: { not: currentId }
    },
    orderBy: { copyCount: 'desc' },
    take: limit
  });
  return prompts.map(mapPrompt);
}

/** Get a random prompt */
export async function getRandomPrompt(): Promise<Prompt> {
  const count = await db.prompt.count();
  if (count === 0) {
    throw new Error("No prompts found in the database.");
  }
  const skip = Math.floor(Math.random() * count);
  const p = await db.prompt.findFirst({
    skip: skip
  });
  return mapPrompt(p);
}

/** Get all prompts as static params (for generateStaticParams) */
export async function getAllPromptSlugs(): Promise<{ id: string }[]> {
  const prompts = await db.prompt.findMany({
    select: { id: true }
  });
  return prompts;
}

/** Get category counts */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  const prompts = await db.prompt.findMany({
    select: { category: true }
  });
  for (const p of prompts) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}

/** Get model counts */
export async function getModelCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  const prompts = await db.prompt.findMany({
    select: { model: true }
  });
  for (const p of prompts) {
    counts[p.model] = (counts[p.model] ?? 0) + 1;
  }
  return counts;
}

/** Total static prompts count helper */
export const TOTAL_PROMPTS = 250;
