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
    <div className="flex flex-col gap-5 w-full border border-border/20 rounded-3xl p-6 bg-card/45 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.4)] noise-overlay">
      {/* ── Sort & Filters Row ── */}
      <div className="flex flex-wrap items-center justify-between gap-5">
        
        {/* Sort options */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 select-none">Sort By</label>
          <div className="flex flex-wrap gap-1.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 border",
                  filters.sort === opt.value
                    ? "bg-primary/10 text-primary border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                    : "bg-[#181724]/40 text-muted-foreground/80 border-[#262438] hover:text-foreground hover:bg-[#1a1928]/60 hover:border-primary/20"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty filter */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 select-none">Difficulty</label>
          <div className="flex gap-1.5">
            {(["all", "easy", "medium", "expert"] as DifficultyFilter[]).map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-300 active:scale-95 border",
                  filters.difficulty === level
                    ? "bg-primary/10 text-primary border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                    : "bg-[#181724]/40 text-muted-foreground/80 border-[#262438] hover:text-foreground hover:bg-[#1a1928]/60 hover:border-primary/20"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Length filter */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 select-none">Length</label>
          <div className="flex gap-1.5">
            {(["all", "short", "medium", "long"] as LengthFilter[]).map((len) => (
              <button
                key={len}
                onClick={() => handleLengthChange(len)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-300 active:scale-95 border",
                  filters.length === len
                    ? "bg-primary/10 text-primary border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                    : "bg-[#181724]/40 text-muted-foreground/80 border-[#262438] hover:text-foreground hover:bg-[#1a1928]/60 hover:border-primary/20"
                )}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Models filter (horizontal scroll) ── */}
      <div className="flex flex-col gap-2 border-t border-border/10 pt-5">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 select-none">AI Model</label>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
          <button
            onClick={() => handleModelChange("all")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 active:scale-95 border",
              filters.model === "all"
                ? "bg-primary/10 text-primary border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                : "bg-[#181724]/40 text-muted-foreground/80 border-[#262438] hover:text-foreground hover:bg-[#1a1928]/60 hover:border-primary/20"
            )}
          >
            All Models
          </button>
          {AI_MODELS.map((model) => (
            <button
              key={model.slug}
              onClick={() => handleModelChange(model.slug)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 active:scale-95 border",
                filters.model === model.slug
                  ? "bg-primary/10 text-primary border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                  : "bg-[#181724]/40 text-muted-foreground/80 border-[#262438] hover:text-foreground hover:bg-[#1a1928]/60 hover:border-primary/20"
              )}
            >
              <span className="text-sm leading-none">{model.icon}</span>
              <span>{model.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Category filter (horizontal scroll) ── */}
      <div className="flex flex-col gap-2 border-t border-border/10 pt-5">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 select-none">Category</label>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
          <button
            onClick={() => handleCategoryChange("all")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 active:scale-95 border",
              filters.category === "all"
                ? "bg-primary/10 text-primary border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                : "bg-[#181724]/40 text-muted-foreground/80 border-[#262438] hover:text-foreground hover:bg-[#1a1928]/60 hover:border-primary/20"
            )}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 active:scale-95 border",
                filters.category === cat.slug
                  ? "bg-primary/10 text-primary border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                  : "bg-[#181724]/40 text-muted-foreground/80 border-[#262438] hover:text-foreground hover:bg-[#1a1928]/60 hover:border-primary/20"
              )}
            >
              <span className="text-sm leading-none">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
