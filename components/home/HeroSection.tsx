"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, X, Clock, Trash2, TrendingUp, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { useSearch } from "@/hooks/useSearch";
import { QuickActionCards } from "./QuickActionCards";

const PLACEHOLDERS = [
  "cinematic portrait of a wizard...",
  "cyberpunk street rain at night...",
  "Studio Ghibli retro forest...",
  "3D character design of astronaut...",
  "hyper-realistic product photography...",
  "viral Instagram reel hooks...",
];

export function HeroSection() {
  const router = useRouter();
  const {
    query,
    suggestions,
    didYouMean,
    history,
    popularSearches,
    handleQueryChange,
    saveToHistory,
    removeFromHistory,
    clearHistory,
  } = useSearch();

  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const [idx, setIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycling placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % PLACEHOLDERS.length;
        setPlaceholder(PLACEHOLDERS[next]);
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, selectedQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = selectedQuery || query;
    if (finalQuery.trim()) {
      saveToHistory(finalQuery.trim());
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(finalQuery.trim())}`);
    } else {
      router.push(`/search`);
    }
  };

  const handleSuggestionClick = (val: string) => {
    handleQueryChange(val);
    handleSearchSubmit(undefined, val);
  };

  return (
    <section className="relative w-full overflow-hidden bg-background py-16 sm:py-24 dot-grid border-b border-border/10 noise-overlay">
      
      {/* Premium V3 Animated Mesh Glow Backgrounds */}
      <div className="mesh-gradient-bg">
        <div className="mesh-glow-1" />
        <div className="mesh-glow-2" />
      </div>

      <div className="mx-auto max-w-7xl px-4 text-center relative z-10">
        
        {/* Animated v3 Release Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-wider mb-6 border border-gold/20"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>PromptVerse v3.0 Evolution is live</span>
        </motion.div>

        {/* Brand Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance leading-[1.05] mb-5"
        >
          Discover. Copy. <span className="gradient-text">Create.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-xs sm:text-sm text-muted-foreground/80 max-w-xl mx-auto leading-relaxed mb-10 text-pretty"
        >
          The absolute easiest place on the internet to discover, explore, and copy premium AI prompts. Instant copy, optimized for visual artists and content creators.
        </motion.p>

        {/* Glassmorphic Search Bar with Dynamic Suggestions Dropdown */}
        <div ref={dropdownRef} className="relative max-w-2xl mx-auto mb-10">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            onSubmit={(e) => handleSearchSubmit(e)}
            className="relative"
          >
            <div className={cn(
              "flex items-center gap-2 p-2 rounded-2xl",
              "bg-card/60 border backdrop-blur-xl transition-all duration-500",
              isFocused 
                ? "border-primary/50 shadow-[0_0_30px_rgba(97,0,220,0.15)] bg-card/90" 
                : "border-border/40 shadow-lg"
            )}>
              <div className="flex-1 relative flex items-center pl-3">
                <Search className={cn(
                  "absolute left-0 h-4.5 w-4.5 transition-colors duration-300",
                  isFocused ? "text-primary" : "text-muted-foreground/50"
                )} />
                
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder=""
                  className="w-full bg-transparent border-0 py-2.5 pl-8 pr-10 text-xs text-foreground placeholder-transparent focus:outline-none focus:ring-0"
                />

                {/* Cycling placeholder when input is empty */}
                {query.length === 0 && (
                  <div className="absolute left-8 pointer-events-none text-xs text-muted-foreground/45 select-none overflow-hidden h-5">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={idx}
                        className="block"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {placeholder}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}

                {/* Clear query button */}
                {query.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      handleQueryChange("");
                      inputRef.current?.focus();
                    }}
                    className="absolute right-2 p-1 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="bg-primary text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-primary/95 transition-all duration-300 active:scale-[0.98] select-none cursor-pointer"
              >
                Search
              </button>
            </div>
          </motion.form>

          {/* Premium V3 Suggestions Dropdown */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={cn(
                  "absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl",
                  "border border-border/30 bg-card/95 backdrop-blur-2xl shadow-2xl",
                  "text-left overflow-hidden p-4 space-y-4 glow-brand"
                )}
              >
                {/* 1. Real-time Fuzzy suggestions if user started typing */}
                {query.trim().length >= 2 && suggestions.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-primary/70 px-2.5">
                      Suggested Queries
                    </div>
                    <div className="grid grid-cols-1 gap-0.5">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-primary/5 hover:text-primary transition-all duration-200"
                        >
                          <Search className="h-3.5 w-3.5 text-muted-foreground/50" />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Zero-Results did you mean fallback */}
                {query.trim().length >= 2 && suggestions.length === 0 && didYouMean && (
                  <div className="px-3 py-2 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                    <span className="text-xs text-muted-foreground/80">Did you mean: </span>
                    <button
                      onClick={() => handleSuggestionClick(didYouMean)}
                      className="text-xs font-extrabold text-gold hover:underline"
                    >
                      {didYouMean}
                    </button>
                  </div>
                )}

                {/* 3. Recent Search History */}
                {history.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>Recent Searches</span>
                      </div>
                      <button
                        onClick={clearHistory}
                        className="text-[9px] font-bold text-muted-foreground/45 hover:text-red-500 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Clear All</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-0.5">
                      {history.slice(0, 4).map((histItem) => (
                        <div
                          key={histItem}
                          className="flex items-center justify-between rounded-xl hover:bg-secondary/40 px-3 py-1.5 transition-all duration-200"
                        >
                          <button
                            onClick={() => handleSuggestionClick(histItem)}
                            className="flex-1 text-left text-xs font-semibold text-foreground/85 flex items-center gap-2"
                          >
                            <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
                            <span>{histItem}</span>
                          </button>
                          <button
                            onClick={() => removeFromHistory(histItem)}
                            className="p-1 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
                            title="Remove from history"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Popular Queries (with trending badges) */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-gold flex items-center gap-1.5 px-2.5">
                    <TrendingUp className="h-3 w-3" />
                    <span>Popular Queries</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {popularSearches.slice(0, 6).map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSuggestionClick(search)}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-secondary/60 text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all duration-200 border border-border/10"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Actions Panel */}
        <QuickActionCards />

      </div>
    </section>
  );
}
