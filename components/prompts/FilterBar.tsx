"use client";

import { cn } from "@/lib/utils";
import type { FilterState, SortOption, DifficultyFilter, LengthFilter } from "@/types";
import { SORT_OPTIONS } from "@/lib/constants";
import { CATEGORIES, AI_MODELS } from "@/lib/constants";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const handleSortChange = (sort: SortOption) => {
    onChange({ ...filters, sort });
  };

  const handleCategoryChange = (category: string) => {
    onChange({ ...filters, category });
  };

  const handleModelChange = (model: string) => {
    onChange({ ...filters, model });
  };

  const handleDifficultyChange = (difficulty: DifficultyFilter) => {
    onChange({ ...filters, difficulty });
  };

  const handleLengthChange = (length: LengthFilter) => {
    onChange({ ...filters, length });
  };

  return (
    <div className="flex flex-col gap-4 w-full border border-border rounded-3xl p-5 bg-card shadow-sm">
      {/* ── Sort & Filters Row ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Sort options */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Sort By</label>
          <div className="flex flex-wrap gap-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                  filters.sort === opt.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Difficulty</label>
          <div className="flex gap-1">
            {(["all", "easy", "medium", "expert"] as DifficultyFilter[]).map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200",
                  filters.difficulty === level
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Length filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Length</label>
          <div className="flex gap-1">
            {(["all", "short", "medium", "long"] as LengthFilter[]).map((len) => (
              <button
                key={len}
                onClick={() => handleLengthChange(len)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200",
                  filters.length === len
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Models filter (horizontal scroll) ── */}
      <div className="flex flex-col gap-1.5 border-t border-border/40 pt-4">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">AI Model</label>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
          <button
            onClick={() => handleModelChange("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200",
              filters.model === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            All Models
          </button>
          {AI_MODELS.map((model) => (
            <button
              key={model.slug}
              onClick={() => handleModelChange(model.slug)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200",
                filters.model === model.slug
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <span>{model.icon}</span>
              <span>{model.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Category filter (horizontal scroll) ── */}
      <div className="flex flex-col gap-1.5 border-t border-border/40 pt-4">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Category</label>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
          <button
            onClick={() => handleCategoryChange("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200",
              filters.category === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200",
                filters.category === cat.slug
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
