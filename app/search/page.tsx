"use client";

import { useEffect, useState, useRef, Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, History, TrendingUp, Cpu, Grid3X3, ArrowRight, CornerDownLeft, SlidersHorizontal, Sliders, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { CATEGORIES, AI_MODELS, DIFFICULTY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ASPECT_RATIOS = ["16:9", "1:1", "4:5", "9:16", "21:9"];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    results,
    suggestions,
    didYouMean,
    isSearching,
    hasQuery,
    history,
    popularSearches,
    handleQueryChange,
    saveToHistory,
    removeFromHistory,
    clearHistory,
  } = useSearch();

  // Filters State — initialised from URL params for shareability
  const [modelFilter, setModelFilter] = useState(() => searchParams.get("model") || "all");
  const [aspectFilter, setAspectFilter] = useState(() => searchParams.get("aspect") || "all");
  const [difficultyFilter, setDifficultyFilter] = useState(() => searchParams.get("difficulty") || "all");

  // Sync a single filter param to the URL without clobbering q= or other params
  const syncParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.replace(`/search${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, searchParams]
  );

  const setModel = (v: string) => { setModelFilter(v); syncParam("model", v); };
  const setAspect = (v: string) => { setAspectFilter(v); syncParam("aspect", v); };
  const setDifficulty = (v: string) => { setDifficultyFilter(v); syncParam("difficulty", v); };

  // Reflect URL changes back to state (e.g. browser back/forward)
  useEffect(() => {
    setModelFilter(searchParams.get("model") || "all");
    setAspectFilter(searchParams.get("aspect") || "all");
    setDifficultyFilter(searchParams.get("difficulty") || "all");
  }, [searchParams]);

  // Refs & Dropdown UI States
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Handle initial query from URL search parameters
  const urlQuery = searchParams.get("q");
  useEffect(() => {
    if (urlQuery) {
      handleQueryChange(urlQuery);
      saveToHistory(urlQuery);
    }
  }, [urlQuery, handleQueryChange, saveToHistory]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Click outside listener to close search suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Execute search immediately & hide suggestions panel
  const executeSearch = (val: string) => {
    setShowSuggestions(false);
    setActiveIndex(-1);
    handleQueryChange(val);
    saveToHistory(val);
    inputRef.current?.blur();
    router.replace(`/search?q=${encodeURIComponent(val)}`);
  };

  const handleSuggestionClick = (val: string) => {
    executeSearch(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        executeSearch(query);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        executeSearch(suggestions[activeIndex]);
      } else if (query.trim()) {
        executeSearch(query);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleClear = () => {
    setShowSuggestions(false);
    setActiveIndex(-1);
    handleQueryChange("");
    router.replace("/search");
    inputRef.current?.focus();
  };

  // Reset all filters — also clears URL params
  const resetFilters = () => {
    setModelFilter("all");
    setAspectFilter("all");
    setDifficultyFilter("all");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("model");
    params.delete("aspect");
    params.delete("difficulty");
    const qs = params.toString();
    router.replace(`/search${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const isFilterActive = modelFilter !== "all" || aspectFilter !== "all" || difficultyFilter !== "all";

  // Filtered prompts computed dynamically
  const filteredResults = useMemo(() => {
    return results.filter((p) => {
      if (modelFilter !== "all" && p.model.toLowerCase() !== modelFilter.toLowerCase()) return false;
      if (aspectFilter !== "all" && p.aspectRatio !== aspectFilter) return false;
      if (difficultyFilter !== "all" && String(p.difficulty) !== difficultyFilter) return false;
      return true;
    });
  }, [results, modelFilter, aspectFilter, difficultyFilter]);

  const activeModelName = useMemo(() => {
    if (modelFilter === "all") return "All Models";
    return AI_MODELS.find((m) => m.slug === modelFilter)?.name || modelFilter;
  }, [modelFilter]);

  const activeDifficultyName = useMemo(() => {
    if (difficultyFilter === "all") return "All Levels";
    return DIFFICULTY_LABELS[Number(difficultyFilter)] || difficultyFilter;
  }, [difficultyFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh]">
      
      {/* ── Search Input Box with Focus Glow ── */}
      <div ref={searchContainerRef} className="relative max-w-3xl mx-auto mb-10">
        <div className={cn(
          "flex items-center gap-3 p-1.5 rounded-2xl",
          "bg-[#080713]/60 border border-[#23203c]/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
          "focus-within:border-primary/45 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
          "transition-all duration-300 relative"
        )}>
          <div className="flex-grow relative flex items-center pl-3">
            <Search className="absolute left-0 h-5 w-5 text-muted-foreground/40" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setShowSuggestions(true);
                setActiveIndex(-1);
                handleQueryChange(e.target.value);
              }}
              onFocus={() => {
                if (query.trim() && suggestions.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search by title, tags, description, model..."
              className="w-full bg-transparent border-0 py-3 pl-8 pr-10 text-sm text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground/45"
            />
            {query && (
              <button
                onClick={handleClear}
                aria-label="Clear search query"
                className="absolute right-2 p-1.5 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-[10px] font-bold text-muted-foreground/50 border border-border/40 select-none">
            <span>Enter</span>
            <CornerDownLeft className="h-3 w-3" />
          </div>
        </div>

        {/* Suggestion Dropdown Panel */}
        <AnimatePresence>
          {showSuggestions && query && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 right-0 mt-2.5 z-50 bg-[#080713]/95 border border-[#23203c]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl"
            >
              <div className="py-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={suggestion}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur before click registers
                      handleSuggestionClick(suggestion);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "w-full text-left px-5 py-3 text-xs transition-colors flex items-center justify-between group",
                      activeIndex === idx 
                        ? "bg-[#1a192c] text-white font-bold" 
                        : "text-muted-foreground hover:bg-[#1a192c]/50 hover:text-white"
                    )}
                  >
                    <span>{suggestion}</span>
                    <ArrowRight className={cn(
                      "h-3.5 w-3.5 text-primary transition-opacity",
                      activeIndex === idx ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Did you mean fallback ── */}
      {didYouMean && (
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
          <p className="text-xs text-muted-foreground">
            No exact matches found. Did you mean:{" "}
            <button
              onClick={() => handleSuggestionClick(didYouMean)}
              className="font-extrabold text-primary hover:underline"
            >
              {didYouMean}
            </button>
            ?
          </p>
        </div>
      )}

      {/* ── Default Dashboard (No Query State) ── */}
      {!hasQuery && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto mt-6 animate-fade-in">
          
          {/* Recent Searches */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground/60" />
              <span>Recent Searches</span>
            </h3>
            {history.length > 0 ? (
              <div className="flex flex-col border border-border rounded-2xl overflow-hidden bg-card">
                {history.map((h) => (
                  <div
                    key={h}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-secondary group transition-colors"
                  >
                    <button
                      onClick={() => handleSuggestionClick(h)}
                      className="text-xs text-left text-muted-foreground group-hover:text-primary font-medium flex-1 truncate"
                    >
                      {h}
                    </button>
                    <button
                      onClick={() => removeFromHistory(h)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-card rounded-md text-muted-foreground hover:text-destructive transition-all"
                      aria-label={`Remove ${h} from search history`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={clearHistory}
                  className="text-center py-2.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 border-t border-border/40 hover:bg-secondary hover:text-destructive transition-colors"
                >
                  Clear History
                </button>
              </div>
            ) : (
              <div className="p-8 border border-dashed border-border rounded-2xl text-center bg-card">
                <p className="text-xs text-muted-foreground/60">No search history yet.</p>
              </div>
            )}
          </div>

          {/* Popular Searches */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground/60" />
              <span>Popular Searches</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSuggestionClick(tag)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Models */}
          <div className="space-y-4 md:col-span-2 border-t border-border/40 pt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-muted-foreground/60" />
              <span>Browse by AI Models</span>
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {AI_MODELS.map((model) => (
                <button
                  key={model.slug}
                  onClick={() => router.push(`/models/${model.slug}`)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/20 transition-all card-hover"
                >
                  <span>{model.icon}</span>
                  <span className="text-xs font-bold">{model.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Categories */}
          <div className="space-y-4 md:col-span-2 border-t border-border/40 pt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <Grid3X3 className="h-4 w-4 text-muted-foreground/60" />
              <span>Explore Categories</span>
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.slice(0, 16).map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => router.push(`/category/${cat.slug}`)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/20 transition-all card-hover"
                >
                  <span>{cat.icon}</span>
                  <span className="text-xs font-bold">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Search Results with Premium Filtering Dropdowns ── */}
      {hasQuery && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header & Filter Bar Grid */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
            
            {/* Left Result Metadata */}
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                Search Results
              </h2>
              <p className="text-[11px] text-muted-foreground/60 font-semibold">
                Found {filteredResults.length} {filteredResults.length === 1 ? 'prompt' : 'prompts'} matching &quot;{query}&quot;
                {isFilterActive && " (filters applied)"}
              </p>
            </div>

            {/* Right Interactive Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 relative">
              
              {/* Reset Action */}
              {isFilterActive && (
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold uppercase tracking-wider text-destructive hover:underline px-2.5 py-1.5"
                >
                  Reset Filters
                </button>
              )}

              {/* 1. Model Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "model" ? null : "model")}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all",
                    modelFilter !== "all" 
                      ? "bg-primary/10 text-primary border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.1)]" 
                      : "bg-[#080713]/60 text-muted-foreground/80 border-[#23203c]/20 hover:border-primary/25 hover:text-foreground"
                  )}
                >
                  <span>{activeModelName}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                <AnimatePresence>
                  {openDropdown === "model" && (
                    <>
                       <div className="fixed inset-0 z-20" onClick={() => setOpenDropdown(null)} />
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-48 bg-[#080713]/95 border border-[#23203c]/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-35 py-1.5 overflow-hidden backdrop-blur-md"
                      >
                        <button
                          onClick={() => { setModel("all"); setOpenDropdown(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#1a192c]/50 text-muted-foreground hover:text-white"
                        >
                          <span>All Models</span>
                          {modelFilter === "all" && <Check className="h-3.5 w-3.5 text-primary" />}
                        </button>
                        {AI_MODELS.map((m) => (
                          <button
                            key={m.slug}
                            onClick={() => { setModel(m.slug); setOpenDropdown(null); }}
                            className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#1a192c]/50 text-muted-foreground hover:text-white"
                          >
                            <span>{m.name}</span>
                            {modelFilter === m.slug && <Check className="h-3.5 w-3.5 text-primary" />}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Aspect Ratio Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "aspect" ? null : "aspect")}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all",
                    aspectFilter !== "all" 
                      ? "bg-primary/10 text-primary border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.1)]" 
                      : "bg-[#080713]/60 text-muted-foreground/80 border-[#23203c]/20 hover:border-primary/25 hover:text-foreground"
                  )}
                >
                  <span>{aspectFilter === "all" ? "All Formats" : aspectFilter}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                <AnimatePresence>
                  {openDropdown === "aspect" && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setOpenDropdown(null)} />
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-40 bg-[#080713]/95 border border-[#23203c]/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-35 py-1.5 overflow-hidden backdrop-blur-md"
                      >
                        <button
                          onClick={() => { setAspect("all"); setOpenDropdown(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#1a192c]/50 text-muted-foreground hover:text-white"
                        >
                          <span>All Formats</span>
                          {aspectFilter === "all" && <Check className="h-3.5 w-3.5 text-primary" />}
                        </button>
                        {ASPECT_RATIOS.map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => { setAspect(ratio); setOpenDropdown(null); }}
                            className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#1a192c]/50 text-muted-foreground hover:text-white"
                          >
                            <span>{ratio}</span>
                            {aspectFilter === ratio && <Check className="h-3.5 w-3.5 text-primary" />}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Difficulty Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === "difficulty" ? null : "difficulty")}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all",
                    difficultyFilter !== "all" 
                      ? "bg-primary/10 text-primary border-primary/25 shadow-[0_0_12px_rgba(139,92,246,0.1)]" 
                      : "bg-[#080713]/60 text-muted-foreground/80 border-[#23203c]/20 hover:border-primary/25 hover:text-foreground"
                  )}
                >
                  <span>{activeDifficultyName}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                <AnimatePresence>
                  {openDropdown === "difficulty" && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setOpenDropdown(null)} />
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-44 bg-[#080713]/95 border border-[#23203c]/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-35 py-1.5 overflow-hidden backdrop-blur-md"
                      >
                        <button
                          onClick={() => { setDifficulty("all"); setOpenDropdown(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#1a192c]/50 text-muted-foreground hover:text-white"
                        >
                          <span>All Levels</span>
                          {difficultyFilter === "all" && <Check className="h-3.5 w-3.5 text-primary" />}
                        </button>
                        {Object.entries(DIFFICULTY_LABELS).map(([val, label]) => (
                          <button
                            key={val}
                            onClick={() => { setDifficulty(val); setOpenDropdown(null); }}
                            className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#1a192c]/50 text-muted-foreground hover:text-white"
                          >
                            <span>{label}</span>
                            {difficultyFilter === val && <Check className="h-3.5 w-3.5 text-primary" />}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          <PromptGrid
            prompts={filteredResults}
            emptyMessage={`No prompts matched your specific filters. Try resetting the filters above to browse more results.`}
          />
        </div>
      )}

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh] flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center animate-pulse mb-4">
            <Search className="h-6 w-6" />
          </div>
          <p className="text-xs text-muted-foreground animate-pulse">Loading search module...</p>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
