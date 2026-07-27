// PromptVerse — Data Access Layer
// Data fetching goes through Supabase database calls using Prisma client with automatic fallback to static prompt data if database is unreachable.

import type { Prompt, FilterState, SortOption } from "@/types";
import { db } from "@/lib/db";
import staticPrompts from "@/data/prompts.json";

// Helper to map DB prompt to UI Prompt type
function mapPrompt(p: any): Prompt {
  const isPro = p.accessLevel === "PRO";
  return {
    ...p,
    accessLevel: (p.accessLevel ?? "FREE") as "FREE" | "PRO",
    prompt: isPro ? "" : p.prompt,
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
      return [...prompts].sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || (b.copyCount || 0) - (a.copyCount || 0));
    case "most-copied":
    case "most-popular":
      return [...prompts].sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0));
    default:
      return prompts;
  }
}

// Fallback static prompts loader
function getFallbackPrompts(): Prompt[] {
  return (staticPrompts as any[]).map(mapPrompt);
}

/* ── Public API ────────────────────────────────── */

/** Get all prompts with optional filtering and sorting */
export async function getPrompts(filters?: Partial<FilterState>): Promise<Prompt[]> {
  try {
    const dbPrompts = await db.prompt.findMany();
    let results = dbPrompts.length > 0 ? dbPrompts.map(mapPrompt) : getFallbackPrompts();

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
        const words = (p.prompt || "").trim().split(/\s+/).length;
        if (filters.length === "short")  return words < 30;
        if (filters.length === "medium") return words >= 30 && words < 80;
        if (filters.length === "long")   return words >= 80;
        return true;
      });
    }

    return sortPrompts(results, filters?.sort ?? "newest");
  } catch (error) {
    console.warn("DB unreachable, using fallback prompts:", (error as any)?.message || error);
    let results = getFallbackPrompts();
    if (filters?.category && filters.category !== "all") {
      results = results.filter((p) => p.category === filters.category);
    }
    if (filters?.model && filters.model !== "all") {
      results = results.filter((p) => p.model === filters.model);
    }
    return sortPrompts(results, filters?.sort ?? "newest");
  }
}

/** Get a single prompt by ID */
export async function getPromptById(id: string): Promise<Prompt | null> {
  try {
    const p = await db.prompt.findUnique({
      where: { id }
    });
    if (p) return mapPrompt(p);
  } catch (error) {
    console.warn("DB unreachable for prompt ID, using fallback:", id);
  }

  const fallback = getFallbackPrompts().find((p) => p.id === id);
  return fallback || null;
}

/** Get a single prompt by slug */
export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  try {
    const p = await db.prompt.findUnique({
      where: { slug }
    });
    if (p) return mapPrompt(p);
  } catch (error) {
    console.warn("DB unreachable for prompt slug, using fallback:", slug);
  }

  const fallback = getFallbackPrompts().find((p) => p.slug === slug);
  return fallback || null;
}

/** Get prompts by category slug */
export async function getPromptsByCategory(
  category: string,
  sort: SortOption = "newest"
): Promise<Prompt[]> {
  try {
    const dbPrompts = await db.prompt.findMany({
      where: { category }
    });
    if (dbPrompts.length > 0) {
      return sortPrompts(dbPrompts.map(mapPrompt), sort);
    }
  } catch (error) {
    console.warn("DB unreachable for category, using fallback:", category);
  }

  const fallbacks = getFallbackPrompts().filter((p) => p.category === category);
  return sortPrompts(fallbacks, sort);
}

/** Get prompts by AI model slug */
export async function getPromptsByModel(
  model: string,
  sort: SortOption = "newest"
): Promise<Prompt[]> {
  try {
    const dbPrompts = await db.prompt.findMany({
      where: { model }
    });
    if (dbPrompts.length > 0) {
      return sortPrompts(dbPrompts.map(mapPrompt), sort);
    }
  } catch (error) {
    console.warn("DB unreachable for model, using fallback:", model);
  }

  const fallbacks = getFallbackPrompts().filter((p) => p.model === model);
  return sortPrompts(fallbacks, sort);
}

/** Get featured prompts */
export async function getFeaturedPrompts(limit = 6): Promise<Prompt[]> {
  try {
    const dbPrompts = await db.prompt.findMany({
      where: { isFeatured: true },
      take: limit
    });
    if (dbPrompts.length > 0) {
      return dbPrompts.map(mapPrompt);
    }
  } catch (error) {
    console.warn("DB unreachable for featured prompts, using fallback");
  }

  return getFallbackPrompts().filter((p) => p.isFeatured).slice(0, limit);
}

/** Get trending prompts */
export async function getTrendingPrompts(limit = 8): Promise<Prompt[]> {
  try {
    const dbPrompts = await db.prompt.findMany({
      where: { isTrending: true },
      orderBy: { copyCount: 'desc' },
      take: limit
    });
    if (dbPrompts.length > 0) {
      return dbPrompts.map(mapPrompt);
    }
  } catch (error) {
    console.warn("DB unreachable for trending prompts, using fallback");
  }

  return getFallbackPrompts()
    .filter((p) => p.isTrending)
    .sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0))
    .slice(0, limit);
}

/** Get most copied prompts */
export async function getMostCopiedPrompts(limit = 8): Promise<Prompt[]> {
  try {
    const dbPrompts = await db.prompt.findMany({
      orderBy: { copyCount: 'desc' },
      take: limit
    });
    if (dbPrompts.length > 0) {
      return dbPrompts.map(mapPrompt);
    }
  } catch (error) {
    console.warn("DB unreachable for most copied prompts, using fallback");
  }

  return getFallbackPrompts()
    .sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0))
    .slice(0, limit);
}

/** Get latest prompts */
export async function getLatestPrompts(limit = 8): Promise<Prompt[]> {
  try {
    const dbPrompts = await db.prompt.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    if (dbPrompts.length > 0) {
      return dbPrompts.map(mapPrompt);
    }
  } catch (error) {
    console.warn("DB unreachable for latest prompts, using fallback");
  }

  return getFallbackPrompts()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/** Get editor's choice prompts */
export async function getEditorChoicePrompts(limit = 6): Promise<Prompt[]> {
  try {
    const dbPrompts = await db.prompt.findMany({
      where: { isFeatured: true, quality: { gte: 4 } },
      take: limit
    });
    if (dbPrompts.length > 0) {
      return dbPrompts.map(mapPrompt);
    }
  } catch (error) {
    console.warn("DB unreachable for editor choice prompts, using fallback");
  }

  return getFallbackPrompts()
    .filter((p) => p.isFeatured && (p.quality || 0) >= 4)
    .slice(0, limit);
}

/** Get related prompts (same category, excluding current) */
export async function getRelatedPrompts(
  currentId: string,
  category: string,
  limit = 4
): Promise<Prompt[]> {
  try {
    const dbPrompts = await db.prompt.findMany({
      where: {
        category,
        id: { not: currentId }
      },
      orderBy: { copyCount: 'desc' },
      take: limit
    });
    if (dbPrompts.length > 0) {
      return dbPrompts.map(mapPrompt);
    }
  } catch (error) {
    console.warn("DB unreachable for related prompts, using fallback");
  }

  return getFallbackPrompts()
    .filter((p) => p.category === category && p.id !== currentId)
    .sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0))
    .slice(0, limit);
}

/** Get a random prompt */
export async function getRandomPrompt(): Promise<Prompt | null> {
  try {
    const count = await db.prompt.count();
    if (count > 0) {
      const skip = Math.floor(Math.random() * count);
      const p = await db.prompt.findFirst({ skip });
      if (p) return mapPrompt(p);
    }
  } catch (error) {
    console.warn("DB unreachable for random prompt, using fallback");
  }

  const all = getFallbackPrompts();
  if (all.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * all.length);
  return all[randomIndex];
}

/** Get all prompts as static params (for generateStaticParams) */
export async function getAllPromptSlugs(): Promise<{ id: string }[]> {
  try {
    const dbPrompts = await db.prompt.findMany({
      select: { id: true }
    });
    if (dbPrompts.length > 0) return dbPrompts;
  } catch (error) {
    console.warn("DB unreachable for prompt slugs, using fallback");
  }

  return getFallbackPrompts().map((p) => ({ id: p.id }));
}

/** Get category counts */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  try {
    const dbPrompts = await db.prompt.findMany({
      select: { category: true }
    });
    if (dbPrompts.length > 0) {
      for (const p of dbPrompts) {
        counts[p.category] = (counts[p.category] ?? 0) + 1;
      }
      return counts;
    }
  } catch (error) {
    console.warn("DB unreachable for category counts, using fallback");
  }

  for (const p of getFallbackPrompts()) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}

/** Get model counts */
export async function getModelCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  try {
    const dbPrompts = await db.prompt.findMany({
      select: { model: true }
    });
    if (dbPrompts.length > 0) {
      for (const p of dbPrompts) {
        counts[p.model] = (counts[p.model] ?? 0) + 1;
      }
      return counts;
    }
  } catch (error) {
    console.warn("DB unreachable for model counts, using fallback");
  }

  for (const p of getFallbackPrompts()) {
    counts[p.model] = (counts[p.model] ?? 0) + 1;
  }
  return counts;
}

/** Total static prompts count helper */
export const TOTAL_PROMPTS = 250;
