"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, ArrowRight, Sparkles, Compass } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";

const TRENDING_CHIPS = [
  "Cyberpunk City",
  "Portrait Photography",
  "Midjourney v6",
  "3D Anime Character",
  "Flux Realism",
  "ChatGPT Prompts",
];

export function MobileHero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    query,
    suggestions,
    handleQueryChange,
    saveToHistory,
  } = useSearch();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const executeSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setShowSuggestions(false);
    saveToHistory(searchTerm);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch(query);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="flex md:hidden flex-col items-center text-center w-full px-2 z-10 relative">
      {/* ── Mobile Badge Pill ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/80 text-[11px] font-medium mb-4 shadow-sm backdrop-blur-md"
      >
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Next-Gen AI Prompt Engine</span>
      </motion.div>

      {/* ── Mobile Headline ── */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-3xl font-black tracking-tight text-white leading-tight mb-3"
      >
        Discover & Copy <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand to-blue-500">
          Premium AI Prompts
        </span>
      </motion.h1>

      {/* ── Mobile Subtitle ── */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xs text-muted-foreground/80 max-w-xs mx-auto mb-6 leading-relaxed"
      >
        10,000+ hand-crafted prompts for Midjourney, Flux, and ChatGPT. Ready to copy in one click.
      </motion.p>

      {/* ── Mobile CTAs (Thumb-friendly Stacked) ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-col gap-2.5 w-full max-w-xs mb-6"
      >
        <Link
          href="/search"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-brand to-blue-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95 transition-all"
        >
          <span>Explore Prompts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/category"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-semibold active:scale-95 transition-all backdrop-blur-md"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Browse Categories</span>
        </Link>
      </motion.div>

      {/* ── Mobile Search Experience ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        ref={containerRef}
        className="relative w-full max-w-sm"
      >
        <div className="relative flex items-center p-1.5 rounded-xl bg-[#090a0f]/95 border border-white/10 shadow-lg focus-within:border-cyan-500/50 backdrop-blur-xl">
          <Search className="w-4 h-4 text-muted-foreground/60 ml-2.5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setShowSuggestions(true);
              handleQueryChange(e.target.value);
            }}
            onFocus={() => {
              if (query.trim()) setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search prompts & AI models..."
            className="w-full bg-transparent border-0 px-2 py-1.5 text-xs text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0"
          />

          {query && (
            <button
              onClick={() => {
                handleQueryChange("");
                setShowSuggestions(false);
              }}
              className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => executeSearch(query)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-[11px] font-bold shrink-0"
          >
            Search
          </button>
        </div>

        {/* Mobile Instant Suggestions */}
        <AnimatePresence>
          {showSuggestions && query.trim() && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute left-0 right-0 mt-1.5 z-50 rounded-xl bg-[#090a0f]/95 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl text-left p-1"
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    executeSearch(s);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-white/80 hover:text-white hover:bg-white/5 font-medium"
                >
                  <span>{s}</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Horizontally Scrollable Chips */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar py-1 text-left px-0.5">
          <span className="text-[10px] font-medium text-muted-foreground/60 shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-cyan-400" /> Trending:
          </span>
          {TRENDING_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => executeSearch(chip)}
              className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-medium text-white/70 whitespace-nowrap shrink-0 active:bg-cyan-500/20"
            >
              {chip}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
