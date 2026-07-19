"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { FilterState, SortOption, DifficultyFilter, LengthFilter } from "@/types";

const DEFAULT_FILTERS: FilterState = {
  category: "all",
  model: "all",
  sort: "newest",
  difficulty: "all",
  length: "all",
};

const VALID_SORTS: SortOption[] = ["newest", "trending", "most-copied", "most-popular", "recently-added"];
const VALID_DIFFICULTIES: DifficultyFilter[] = ["all", "easy", "medium", "expert"];
const VALID_LENGTHS: LengthFilter[] = ["all", "short", "medium", "long"];

/**
 * Syncs FilterState to/from URL query parameters.
 * - Reads initial state from URL on mount (SSR-safe via useSearchParams)
 * - Writes state changes as shallow URL updates (no full navigation)
 * - Only writes params that differ from defaults (keeps URLs clean)
 * - Returns [filters, setFilters] — drop-in replacement for useState<FilterState>
 */
export function useFilterParams(): [FilterState, (next: FilterState) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read filters from current URL params, falling back to defaults
  const filters = useMemo<FilterState>(() => {
    const rawSort = searchParams.get("sort") as SortOption | null;
    const rawDifficulty = searchParams.get("difficulty") as DifficultyFilter | null;
    const rawLength = searchParams.get("length") as LengthFilter | null;

    return {
      category:   searchParams.get("category")   || DEFAULT_FILTERS.category,
      model:      searchParams.get("model")       || DEFAULT_FILTERS.model,
      sort:       rawSort       && VALID_SORTS.includes(rawSort)             ? rawSort       : DEFAULT_FILTERS.sort,
      difficulty: rawDifficulty && VALID_DIFFICULTIES.includes(rawDifficulty) ? rawDifficulty : DEFAULT_FILTERS.difficulty,
      length:     rawLength     && VALID_LENGTHS.includes(rawLength)          ? rawLength     : DEFAULT_FILTERS.length,
    };
  }, [searchParams]);

  // Write filters back to URL, omitting defaults to keep URLs minimal
  const setFilters = useCallback(
    (next: FilterState) => {
      const params = new URLSearchParams(searchParams.toString());

      // Helper: set or delete a param based on whether it equals default
      const syncParam = (key: string, value: string, defaultVal: string) => {
        if (value === defaultVal) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      };

      // Preserve any existing non-filter params (e.g. q= from search page)
      syncParam("category",   next.category,   DEFAULT_FILTERS.category);
      syncParam("model",      next.model,      DEFAULT_FILTERS.model);
      syncParam("sort",       next.sort,       DEFAULT_FILTERS.sort);
      syncParam("difficulty", next.difficulty, DEFAULT_FILTERS.difficulty);
      syncParam("length",     next.length,     DEFAULT_FILTERS.length);

      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return [filters, setFilters];
}
