"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, History, TrendingUp, Sparkles, Cpu, Grid3X3, Copy, ArrowRight, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { CATEGORIES, AI_MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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

  // Handle initial query from URL search parameters
  const urlQuery = searchParams.get("q");
  useEffect(() => {
    if (urlQuery) {
      handleQueryChange(urlQuery);
      saveToHistory(urlQuery);
    }
  }, [urlQuery, handleQueryChange, saveToHistory]);

  // Focus input on mount or slash keypress
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSuggestionClick = (val: string) => {
    handleQueryChange(val);
    saveToHistory(val);
    router.replace(`/search?q=${encodeURIComponent(val)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      saveToHistory(query);
      router.replace(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    handleQueryChange("");
    router.replace("/search");
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      
      {/* ── Search Input Box ── */}
      <div className="relative max-w-3xl mx-auto mb-10">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-2xl",
          "bg-card border border-border/80 shadow-md",
          "focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/20",
          "transition-all duration-300"
        )}>
          <div className="flex-1 relative flex items-center pl-3">
            <Search className="absolute left-0 h-5 w-5 text-muted-foreground/50" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by title, tags, description, model..."
              className="w-full bg-transparent border-0 py-3 pl-8 pr-10 text-sm text-foreground focus:outline-none focus:ring-0"
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
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-[10px] font-bold text-muted-foreground/60 border border-border/40">
            <span>Enter</span>
            <CornerDownLeft className="h-3 w-3" />
          </div>
        </div>

        {/* Suggestion Dropdown */}
        <AnimatePresence>
          {query && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 right-0 mt-2 z-20 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="py-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-5 py-3 text-xs hover:bg-secondary hover:text-primary transition-colors flex items-center justify-between"
                  >
                    <span>{suggestion}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
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
              className="font-bold text-primary hover:underline"
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
              <History className="h-4 w-4" />
              <span>Recent Searches</span>
            </h3>
            {history.length > 0 ? (
              <div className="flex flex-col border border-border rounded-2xl overflow-hidden bg-card">
                {history.map((h) => (
                  <div
                    key={h}
                    className="flex items-center justify-between px-4.5 py-3 hover:bg-secondary group transition-colors"
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
                  className="text-center py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 border-t border-border/40 hover:bg-secondary hover:text-destructive transition-colors"
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
              <TrendingUp className="h-4 w-4" />
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
              <Cpu className="h-4 w-4" />
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
              <Grid3X3 className="h-4 w-4" />
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

      {/* ── Search Results ── */}
      {hasQuery && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
              Search Results ({results.length})
            </h2>
            {isSearching && <span className="text-xs text-muted-foreground animate-pulse">Searching...</span>}
          </div>
          <PromptGrid
            prompts={results}
            emptyMessage={`We couldn't find any prompts matching "${query}". Try searching for categories, styles, or specific keywords.`}
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
