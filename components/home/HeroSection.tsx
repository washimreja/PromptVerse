"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, Trash2, TrendingUp, ArrowRight, Sparkles, Cpu } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import { useSearch } from "@/hooks/useSearch";

const PLACEHOLDERS = [
  "cinematic portrait of a wizard...",
  "cyberpunk street rain at night...",
  "Studio Ghibli retro forest...",
  "3D character design of astronaut...",
  "hyper-realistic product photography...",
  "viral Instagram reel hooks...",
];

const TRENDING_IMAGES = [
  { src: "/images/trending_1.png", label: "Short Film" },
  { src: "/images/trending_2.png", label: "Music Video" },
  { src: "/images/trending_3.png", label: "Product Ads" },
  { src: "/images/trending_4.png", label: "Cyberpunk City" },
];

/* ── Hero Mosaic images (SVG-based rich thumbnails) ───────── */
const MOSAIC_ITEMS = [
  {
    label: "CINEMATIC",
    colors: ["#0f2027", "#203a43", "#2c5364"],
    accent: "#00d4ff",
    shape: "wave",
  },
  {
    label: "PORTRAIT",
    colors: ["#1a0533", "#3d0066", "#6600cc"],
    accent: "#c084fc",
    shape: "circle",
  },
  {
    label: "FASHION",
    colors: ["#1f0a00", "#4a1500", "#ff6b00"],
    accent: "#fbbf24",
    shape: "polygon",
  },
  {
    label: "CYBERPUNK",
    colors: ["#001f0f", "#004d1a", "#00ff66"],
    accent: "#00ff66",
    shape: "grid",
  },
  {
    label: "ANIME",
    colors: ["#1a0020", "#3d0050", "#cc0099"],
    accent: "#f0abfc",
    shape: "wave",
  },
  {
    label: "MINIMAL",
    colors: ["#0a0a0a", "#1a1a2e", "#16213e"],
    accent: "#38bdf8",
    shape: "circle",
  },
];

function MosaicTile({
  item,
  index,
}: {
  item: (typeof MOSAIC_ITEMS)[0];
  index: number;
}) {
  const id = `mosaic-${index}`;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: 0.3 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative overflow-hidden rounded-xl group cursor-pointer"
      style={{ aspectRatio: "3/4" }}
    >
      {/* SVG rich background */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={item.colors[0]} />
            <stop offset="50%" stopColor={item.colors[1]} />
            <stop offset="100%" stopColor={item.colors[2]} />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={item.accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={item.accent} stopOpacity="0" />
          </radialGradient>
          <pattern id={`${id}-dots`} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.75" fill="white" fillOpacity="0.06" />
          </pattern>
          <filter id={`${id}-blur`}>
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        {/* Base gradient */}
        <rect width="100%" height="100%" fill={`url(#${id}-bg)`} />
        {/* Dot texture */}
        <rect width="100%" height="100%" fill={`url(#${id}-dots)`} />
        {/* Glow orb */}
        <ellipse
          cx="50%"
          cy="45%"
          rx="55%"
          ry="55%"
          fill={`url(#${id}-glow)`}
          filter={`url(#${id}-blur)`}
        />
        {/* Shape element */}
        {item.shape === "wave" && (
          <path
            d="M-20,180 C60,130 140,230 220,170 L220,300 L-20,300 Z"
            fill={item.accent}
            fillOpacity="0.12"
          />
        )}
        {item.shape === "circle" && (
          <>
            <circle cx="60%" cy="30%" r="80" fill={item.accent} fillOpacity="0.08" />
            <circle cx="25%" cy="75%" r="50" fill={item.accent} fillOpacity="0.06" />
          </>
        )}
        {item.shape === "polygon" && (
          <polygon
            points="-20,220 120,-20 260,160 180,300 0,300"
            fill={item.accent}
            fillOpacity="0.10"
          />
        )}
        {item.shape === "grid" && (
          <>
            <line x1="0" y1="33%" x2="100%" y2="33%" stroke={item.accent} strokeOpacity="0.12" strokeWidth="1" />
            <line x1="0" y1="66%" x2="100%" y2="66%" stroke={item.accent} strokeOpacity="0.12" strokeWidth="1" />
            <line x1="33%" y1="0" x2="33%" y2="100%" stroke={item.accent} strokeOpacity="0.12" strokeWidth="1" />
            <line x1="66%" y1="0" x2="66%" y2="100%" stroke={item.accent} strokeOpacity="0.12" strokeWidth="1" />
          </>
        )}
      </svg>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Label */}
      <div className="absolute bottom-2 left-2 right-2">
        <span
          className="text-[9px] font-black tracking-widest uppercase text-white/90"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
        >
          {item.label}
        </span>
      </div>

      {/* Accent dot top-right */}
      <div
        className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: item.accent, opacity: 0.8 }}
      />
    </motion.div>
  );
}

/* ── Stats Bar ───────────────────────────────── */
const STATS = [
  { value: "250+", label: "AI Prompts" },
  { value: "13", label: "AI Models" },
  { value: "40+", label: "Categories" },
  { value: "Free", label: "No Signup" },
];

/* ── Main Hero Section ───────────────────────── */
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

  // Close dropdown on outside click
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

  const showDropdown =
    isFocused &&
    (suggestions.length > 0 || history.length > 0 || popularSearches.length > 0);

  return (
    <section className="relative w-full overflow-hidden bg-background border-b border-border/10 noise-overlay">
      {/* Aurora Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-brand-glow blur-[120px] animate-aurora-slow" />
        <div className="absolute top-[30%] -right-[10%] w-[60%] h-[80%] rounded-full bg-gold-glow blur-[140px] animate-aurora-reverse" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[60%] rounded-full bg-primary/20 blur-[100px] animate-orb-1" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── LEFT COLUMN: Text + Search ── */}
          <div className="flex flex-col gap-7">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex"
            >
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-secondary/50 border border-primary/15 backdrop-blur-sm shadow-sm select-none">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase text-primary/90">
                  Premium AI Prompt Library
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-balance">
                <span className="text-foreground drop-shadow-md">Free AI Prompts</span>
                <br />
                <span className="gradient-text-gold drop-shadow-lg">
                  for Every Creator
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg"
            >
              Browse 250+ curated AI prompts for Midjourney, Flux, ChatGPT, Gemini, and more.
              Copy top-rated prompts and create stunning AI content instantly — no signup required.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              ref={dropdownRef}
              className="relative"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div
                  className={cn(
                    "relative flex items-center rounded-2xl border transition-all duration-300 overflow-visible",
                    isFocused
                      ? "border-primary/50 shadow-[0_0_0_3px_oklch(0.58_0.19_185_/_0.12)]"
                      : "border-border/30 hover:border-border/50"
                  )}
                >
                  <Search className="absolute left-4 h-4 w-4 text-muted-foreground/60 pointer-events-none z-10" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder={placeholder}
                    aria-label="Search AI prompts"
                    className={cn(
                      "flex-1 pl-11 pr-4 py-3.5 text-sm bg-secondary/30 backdrop-blur-md rounded-2xl",
                      "placeholder:text-muted-foreground/40 text-foreground",
                      "focus:outline-none focus:bg-secondary/50",
                      "transition-all duration-300"
                    )}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => handleQueryChange("")}
                      className="absolute right-[4.5rem] text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className={cn(
                      "absolute right-2 px-4 py-2 rounded-xl text-xs font-bold",
                      "bg-primary text-primary-foreground",
                      "hover:opacity-90 transition-all duration-200 active:scale-95",
                      "shadow-[0_2px_12px_oklch(0.58_0.19_185_/_0.35)]"
                    )}
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Search Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className={cn(
                      "absolute left-0 right-0 top-[calc(100%+8px)] z-50",
                      "bg-card/95 border border-border/20 rounded-2xl",
                      "shadow-[0_24px_60px_-8px_rgba(0,0,0,0.6)] backdrop-blur-2xl",
                      "overflow-hidden"
                    )}
                  >
                    {/* Suggestions (when typing) */}
                    {suggestions.length > 0 && (
                      <div className="p-2">
                        {didYouMean && (
                          <div className="flex items-center gap-2 px-3 py-1.5">
                            <span className="text-[10px] text-muted-foreground/50">Did you mean:</span>
                            <button
                              onClick={() => handleSuggestionClick(didYouMean)}
                              className="text-[11px] font-semibold text-primary underline underline-offset-2"
                            >
                              {didYouMean}
                            </button>
                          </div>
                        )}
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSuggestionClick(s)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs text-foreground hover:bg-secondary/40 transition-colors text-left"
                          >
                            <Search className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Recent & Popular (when empty query) */}
                    {!query && (
                      <div className="p-2">
                        {history.length > 0 && (
                          <div className="mb-1">
                            <div className="flex items-center justify-between px-3 py-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Recent</span>
                              <button
                                onClick={clearHistory}
                                className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                Clear
                              </button>
                            </div>
                            {history.slice(0, 4).map((h) => (
                              <div key={h} className="flex items-center">
                                <button
                                  onClick={() => handleSuggestionClick(h)}
                                  className="flex-1 flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-secondary/40 transition-colors text-left"
                                >
                                  <Clock className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
                                  <span>{h}</span>
                                </button>
                                <button
                                  onClick={() => removeFromHistory(h)}
                                  className="mr-2 p-1.5 text-muted-foreground/30 hover:text-muted-foreground transition-colors rounded-lg"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="border-t border-border/10 pt-1 mt-1">
                          <div className="px-3 py-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Popular</span>
                          </div>
                          <div className="px-3 py-1.5 flex flex-wrap gap-1.5">
                            {popularSearches.slice(0, 8).map((s) => (
                              <button
                                key={s}
                                onClick={() => handleSuggestionClick(s)}
                                className={cn(
                                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold",
                                  "bg-secondary/50 border border-border/20 text-muted-foreground",
                                  "hover:bg-primary/10 hover:text-primary hover:border-primary/20",
                                  "transition-all duration-200"
                                )}
                              >
                                <TrendingUp className="h-2.5 w-2.5" />
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/search"
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold",
                  "bg-foreground text-background",
                  "hover:opacity-90 transition-all duration-200 active:scale-95",
                  "shadow-md"
                )}
              >
                Browse the Library
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/models"
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold",
                  "bg-secondary/50 border border-border/30 text-foreground",
                  "hover:bg-secondary/80 hover:border-primary/20 transition-all duration-200 active:scale-95"
                )}
              >
                <Cpu className="h-4 w-4 text-primary" />
                AI Models
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Image Mosaic ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            {/* Live badge */}
            <div className="flex items-center justify-end mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/40 border border-border/20 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-80" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                  Live · 250+ Prompts
                </span>
              </div>
            </div>

            {/* 3×2 Mosaic Grid */}
            <div className="grid grid-cols-3 gap-3">
              {MOSAIC_ITEMS.map((item, i) => (
                <MosaicTile key={i} item={item} index={i} />
              ))}
            </div>

            {/* Bottom caption */}
            <p className="text-center text-[10px] text-muted-foreground/40 mt-4 tracking-wider uppercase">
              40+ Categories · Updated daily
            </p>
          </motion.div>
        </div>

        {/* ── TRENDING IMAGES MARQUEE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-14 pt-8 border-t border-border/10 overflow-hidden relative"
        >
          {/* Gradient Edges for seamless scroll fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-[#020204] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-[#020204] to-transparent z-10 pointer-events-none" />
          
          <div className="flex flex-col gap-4">
            {/* Header / Title */}
            <div className="flex items-center justify-between px-2">
              <span className="text-[14px] font-extrabold tracking-tight text-white">
                Vibe Direct Now
              </span>
              <Link href="/category" className="text-[11px] font-semibold text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
                More <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="flex overflow-hidden w-full pt-1 pb-4">
              <motion.div
                className="flex whitespace-nowrap gap-4 sm:gap-6 pl-2"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 25,
                }}
              >
                {[...TRENDING_IMAGES, ...TRENDING_IMAGES].map((item, i) => (
                  <div 
                    key={i} 
                    className="relative shrink-0 w-[180px] h-[120px] rounded-[20px] overflow-hidden group cursor-pointer border border-white/5 shadow-md"
                  >
                    <img 
                      src={item.src} 
                      alt={item.label} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold text-white shadow-sm">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
