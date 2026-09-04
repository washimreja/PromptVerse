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
  "3D Anime",
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
    <div className="hidden md:flex flex-col items-center text-center max-w-4xl mx-auto z-10 relative py-5">
      {/* ── Editorial Studio Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/[0.08] border border-cyan-400/25 text-cyan-300 text-[11px] font-semibold tracking-wide mb-4 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.12)] cursor-default"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span>Curated Prompt Library • Hand-tested & Ranked by Creators</span>
      </motion.div>

      {/* ── Human-Crafted Headline ── */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-3xl lg:text-5xl font-black tracking-tight text-white leading-[1.15] mb-3"
      >
        Crafted with Precision.{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-200">
          Ultra-Tested AI Prompts
        </span>
      </motion.h1>

      {/* ── Editorial Subtitle ── */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-xs lg:text-sm text-muted-foreground/80 max-w-xl mx-auto mb-6 font-medium leading-relaxed"
      >
        Curated by senior prompt engineers. 10,000+ battle-tested prompts for Midjourney, Flux, Stable Diffusion & ChatGPT — with zero generic filler.
      </motion.p>

      {/* ── Integrated Ultra Search Experience ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        ref={containerRef}
        className="relative w-full max-w-xl mx-auto"
      >
        <div className="relative flex items-center p-1.5 rounded-2xl bg-[#10131b]/90 border border-white/[0.12] shadow-[0_16px_50px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.1)] focus-within:border-cyan-400/60 focus-within:shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.2)] backdrop-blur-2xl transition-all">
          <Search className="w-4 h-4 text-cyan-400 ml-3.5 shrink-0" />
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
            placeholder="Search prompts, styles, lighting, cameras, models..."
            className="w-full bg-transparent border-0 px-3 py-2 text-xs text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0"
          />

          {query ? (
            <button
              onClick={() => {
                handleQueryChange("");
                setShowSuggestions(false);
              }}
              className="p-1.5 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white transition-colors mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 mr-2 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono text-muted-foreground/70">
              ⌘K
            </span>
          )}

          <button
            onClick={() => executeSearch(query)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-black text-xs font-black transition-all shrink-0 hover:brightness-110 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.35)]"
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
              className="absolute left-0 right-0 mt-2 z-50 rounded-2xl bg-[#10131b]/95 border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden backdrop-blur-2xl text-left p-1.5"
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    executeSearch(s);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors font-medium group"
                >
                  <span>{s}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trending Chips */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 mt-3.5">
          <span className="text-[10px] font-bold text-muted-foreground/70 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-cyan-400" /> Curated:
          </span>
          {TRENDING_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => executeSearch(chip)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-cyan-400/40 text-[10px] font-semibold text-white/80 hover:text-cyan-300 transition-all shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* ── Human Quality & Trust Strip ── */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-medium text-muted-foreground/75">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">✓</span> 10,000+ Tested Prompts
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">★</span> 4.9/5 Creator Rating
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 font-bold">⚡</span> 1-Click Direct Copy
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-purple-400 font-bold">✦</span> 0 Generic AI Filler
          </div>
        </div>
      </motion.div>
    </div>
  );
}
