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

export function DesktopHero() {
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
    <div className="hidden md:flex flex-col items-center text-center max-w-5xl mx-auto z-10 relative">
      {/* ── Badge Pill ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-white/80 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md hover:border-cyan-500/30 transition-all cursor-default"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>The World's Most Advanced AI Prompt Engine</span>
      </motion.div>

      {/* ── Large Headline ── */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6 max-w-4xl"
      >
        Discover & Copy{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand to-blue-500">
          Premium AI Prompts
        </span>
      </motion.h1>

      {/* ── Subtitle ── */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-base lg:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-9 font-medium leading-relaxed"
      >
        10,000+ hand-crafted prompts for Midjourney, Flux, Stable Diffusion, and ChatGPT. Ready to copy in one click.
      </motion.p>

      {/* ── CTAs ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-center gap-4 mb-10"
      >
        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-brand to-blue-600 text-white text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.03] active:scale-95"
        >
          <span>Explore Prompts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/category"
          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-xs font-bold hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.03] active:scale-95 backdrop-blur-md"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Browse Categories</span>
        </Link>
      </motion.div>

      {/* ── Search Experience ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        ref={containerRef}
        className="relative w-full max-w-3xl mx-auto"
      >
        <div className="relative flex items-center p-2 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.7)] focus-within:border-cyan-500/50 focus-within:shadow-[0_0_35px_rgba(6,182,212,0.25)] transition-all backdrop-blur-xl">
          <Search className="w-5 h-5 text-muted-foreground/60 ml-4 shrink-0" />
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
            placeholder="Search prompts, categories, style, AI models..."
            className="w-full bg-transparent border-0 px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0"
          />

          {query && (
            <button
              onClick={() => {
                handleQueryChange("");
                setShowSuggestions(false);
              }}
              className="p-1.5 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white transition-colors mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => executeSearch(query)}
            className="px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black text-cyan-400 text-xs font-bold transition-all shrink-0 shadow-sm"
          >
            Search
          </button>
        </div>

        {/* Instant Suggestions */}
        <AnimatePresence>
          {showSuggestions && query.trim() && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 right-0 mt-2 z-50 rounded-2xl bg-[#090a0f]/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl text-left p-2"
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    executeSearch(s);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors font-medium group"
                >
                  <span>{s}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trending Chips */}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-4">
          <span className="text-xs font-semibold text-muted-foreground/60 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Trending:
          </span>
          {TRENDING_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => executeSearch(chip)}
              className="px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 text-xs font-medium text-white/70 hover:text-white transition-all hover:scale-105"
            >
              {chip}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
