"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";

export function MobileSearchPill() {
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
    <div className="flex md:hidden flex-col w-full px-4 py-4 z-20 relative max-w-md mx-auto" ref={containerRef}>
      {/* ── Compact Pill Design with Floating Glass Effect ── */}
      <div className="relative flex items-center p-1.5 rounded-full bg-[#090a0f]/95 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] focus-within:border-cyan-500/50 backdrop-blur-xl">
        <Search className="w-4 h-4 text-cyan-400 ml-3 shrink-0" />
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
          placeholder="Search 10,000+ prompts & models..."
          className="w-full bg-transparent border-0 px-3 py-1.5 text-xs text-white placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0"
        />

        {query && (
          <button
            onClick={() => {
              handleQueryChange("");
              setShowSuggestions(false);
            }}
            className="p-1 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors mr-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => executeSearch(query)}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-brand text-white text-[11px] font-bold shrink-0 shadow-md active:scale-95 transition-transform"
        >
          Search
        </button>
      </div>

      {/* Floating Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && query.trim() && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-4 right-4 top-14 z-50 rounded-2xl bg-[#090a0f]/95 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl text-left p-1.5"
          >
            {suggestions.map((s) => (
              <button
                key={s}
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeSearch(s);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/5 font-medium"
              >
                <span>{s}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
