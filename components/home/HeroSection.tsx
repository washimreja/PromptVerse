"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE_NAME, SITE_TAGLINE, POPULAR_SEARCHES } from "@/lib/constants";

const PLACEHOLDERS = [
  "cinematic portrait of a wizard...",
  "cyberpunk street rain at night...",
  "Studio Ghibli retro forest...",
  "3D character design of astronaut...",
  "write a Python scraper script...",
  "generate Tailwind CSS dark layout...",
  "Pixar animation cute animal...",
];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % PLACEHOLDERS.length;
        setPlaceholder(PLACEHOLDERS[next]);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/search`);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-background py-16 sm:py-24 dot-grid border-b border-border/40">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-orb-1 -z-10" />
      <div className="absolute top-1/3 right-1/10 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl animate-orb-2 -z-10" />

      <div className="mx-auto max-w-4xl px-4 text-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>PromptVerse v2.0 is live</span>
        </motion.div>

        {/* Headlines */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl sm:text-6xl font-black tracking-tight text-balance leading-[1.1] mb-5"
        >
          Discover. Copy. <span className="gradient-text">Create.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 text-pretty"
        >
          The absolute easiest place on the internet to find, customize, and instantly copy premium AI prompts. Elevate your creative workflow.
        </motion.p>

        {/* Glassmorphic Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={handleSearchSubmit}
          className="relative max-w-2xl mx-auto mb-8"
        >
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-2xl",
            "bg-card/75 border border-border/80 backdrop-blur-xl shadow-lg",
            "focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/20",
            "transition-all duration-300"
          )}>
            <div className="flex-1 relative flex items-center pl-3">
              <Search className="absolute left-0 h-5 w-5 text-muted-foreground/60" />
              
              <input
                id="hero-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-0 py-2.5 pl-8 pr-4 text-sm text-foreground placeholder-transparent focus:outline-none focus:ring-0"
              />

              {/* Floating animated placeholder */}
              {query.length === 0 && (
                <div className="absolute left-8 pointer-events-none text-sm text-muted-foreground/50 select-none overflow-hidden h-5">
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
            </div>

            <button
              type="submit"
              className="bg-primary text-primary-foreground font-semibold text-xs px-5 py-3 rounded-xl hover:bg-primary/95 transition-colors cursor-pointer select-none active:scale-[0.98]"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* Popular Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto"
        >
          <span className="text-xs text-muted-foreground/60 mr-1">Try searching:</span>
          {POPULAR_SEARCHES.slice(0, 5).map((search) => (
            <button
              key={search}
              onClick={() => router.push(`/search?q=${encodeURIComponent(search)}`)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              {search}
            </button>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
