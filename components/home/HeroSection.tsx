"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, ArrowRight, Sparkles, Compass } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearch } from "@/hooks/useSearch";

const TRENDING_CHIPS = [
  "Cyberpunk City",
  "Portrait Photography",
  "Midjourney v6",
  "3D Anime Character",
  "Flux Realism",
  "ChatGPT Prompts",
];

export function HeroSection() {
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

  // Click outside listener to hide suggestions
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
    <section className="relative min-h-[45vh] md:min-h-[50vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 overflow-hidden bg-[#040508]">
      {/* ── Subtle Background Mesh Glow ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand/10 blur-[130px] rounded-full mix-blend-screen" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* ── Badge Pill ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/80 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>The World's Most Advanced AI Prompt Engine</span>
        </motion.div>

        {/* ── Compact Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] mb-4"
        >
          Discover & Copy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-cyan-400 to-blue-500">Premium AI Prompts</span>
        </motion.h1>

        {/* ── Supporting Description ── */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm sm:text-base text-muted-foreground/80 max-w-xl mx-auto mb-8 font-medium leading-relaxed"
        >
          10,000+ hand-crafted prompts for Midjourney, Flux, Stable Diffusion, and ChatGPT. Ready to copy in one click.
        </motion.p>

        {/* ── Primary & Secondary CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center justify-center gap-3.5 mb-10 w-full sm:w-auto"
        >
          <Link
            href="/search"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand text-brand-foreground text-xs font-bold hover:bg-brand/90 transition-all shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95"
          >
            <span>Explore Prompts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/category"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Browse Categories</span>
          </Link>
        </motion.div>

        {/* ── Large Premium Search Bar (ChatGPT / OpenArt Style) ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          ref={containerRef}
          className="relative w-full max-w-2xl mx-auto"
        >
          <div className="relative flex items-center p-2 rounded-2xl bg-[#090a0f]/90 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] focus-within:border-brand/50 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-all backdrop-blur-xl">
            <Search className="w-5 h-5 text-muted-foreground/50 ml-3 shrink-0" />
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
              className="w-full bg-transparent border-0 px-3 py-2 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0"
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
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-brand hover:text-brand-foreground text-white text-xs font-bold transition-all shrink-0 border border-white/10"
            >
              Search
            </button>
          </div>

          {/* Instant Suggestions Panel */}
          <AnimatePresence>
            {showSuggestions && query.trim() && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 right-0 mt-2 z-50 rounded-2xl bg-[#090a0f]/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl text-left p-1.5"
              >
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      executeSearch(s);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors font-medium"
                  >
                    <span>{s}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trending Search Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-4">
            <span className="text-[11px] font-semibold text-muted-foreground/60 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-brand" /> Trending:
            </span>
            {TRENDING_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => executeSearch(chip)}
                className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/10 border border-white/5 text-[11px] font-medium text-white/70 hover:text-white transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
