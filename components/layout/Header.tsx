"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sun, Moon, Monitor, X, Menu, Sparkles, Compass, Cpu, ChevronDown, ChevronRight, ExternalLink, Heart, BookOpen, HeartHandshake, User, FolderHeart, LogOut, ShieldCheck } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

/* ── Custom PV Monogram Brand Logo ────────────────── */
export function PVLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.55 0.19 185)" />
          <stop offset="50%" stopColor="oklch(0.65 0.18 200)" />
          <stop offset="100%" stopColor="oklch(0.780 0.170 65)" />
        </linearGradient>
        <clipPath id="logo-cut">
          <rect width="100" height="100" rx="28" />
        </clipPath>
      </defs>
      <g clipPath="url(#logo-cut)">
        {/* Glowing Background */}
        <rect width="100" height="100" fill="url(#logo-grad)" />
        {/* Subtle mesh background grid */}
        <circle cx="10" cy="10" r="40" fill="white" opacity="0.08" />
        <circle cx="90" cy="90" r="50" fill="white" opacity="0.05" />

        {/* Monogram P stem */}
        <rect x="28" y="24" width="9" height="52" rx="4.5" fill="white" />
        {/* Monogram P loop */}
        <path d="M37 24H52C58.627 24 64 29.373 64 36C64 42.627 58.627 48 52 48H37V24Z" fill="white" />
        {/* Inner loop cut */}
        <path d="M37 32H52C54.209 32 56 33.791 56 36C56 38.209 54.209 40 52 40H37V32Z" fill="url(#logo-grad)" />

        {/* Intersecting V tail */}
        <path d="M50 76 L70 34.5 C70.9 32.5 73.3 31.6 75.3 32.5 C77.3 33.4 78.2 35.8 77.3 37.8 L55.5 79.5 C54.2 82 50.8 82 49.5 79.5 L36.5 54.5 C35.6 52.5 36.5 50.1 38.5 49.2 C40.5 48.3 42.9 49.2 43.8 51.2 L50 63 L50 76 Z" fill="white" opacity="0.9" style={{ mixBlendMode: "overlay" }} />
        {/* Main solid V top overlay */}
        <path d="M52 72 L70 35 C70.8 33.3 72.8 32.5 74.5 33.3 C76.2 34.1 77 36.1 76.2 37.8 L56 79 C55 81 53 81.5 51.5 80 L52 72 Z" fill="white" />
      </g>
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/",         label: "Discover",   icon: Compass },
  { href: "/category", label: "Categories", icon: Sparkles },
  { href: "/models",   label: "AI Models",  icon: Cpu },
  { href: "/saved",    label: "Saved Prompts", icon: Heart },
  { href: "/search",   label: "Search Box",   icon: Search },
];

const EXPLORE_CATEGORIES = [
  { slug: "portrait", name: "Portrait", desc: "Studio human portraiture", icon: "👤" },
  { slug: "cinematic", name: "Cinematic", desc: "Dramatic movie styling", icon: "🎬" },
  { slug: "anime", name: "Anime & Manga", desc: "Japan illustrated art", icon: "🌸" },
  { slug: "product-photography", name: "Product", desc: "Commercial display shots", icon: "📦" },
];

const EXPLORE_MODELS = [
  { slug: "midjourney", name: "Midjourney", desc: "Unmatched artistic images", icon: "🎨" },
  { slug: "flux", name: "Flux", desc: "Fast & photorealistic details", icon: "⚡" },
  { slug: "chatgpt", name: "ChatGPT", desc: "Context & copy templates", icon: "💬" },
  { slug: "claude", name: "Claude", desc: "Nuanced logic & instructions", icon: "🤖" },
];

const MORE_LINKS = [
  { href: "/saved", label: "Saved Prompts", desc: "View bookmarked templates", icon: Heart },
  { href: "/blog", label: "Blog & Guides", desc: "Tips, tutorials & news", icon: BookOpen },
  { href: "/sponsor", label: "Sponsor Us", desc: "Promote your brand to creators", icon: HeartHandshake },
];

/* ── Theme Toggle ─────────────────────────────── */
function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const current = theme === "light" ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";

  const icons = {
    light:  <Sun  className="h-[1.1rem] w-[1.1rem]" />,
    dark:   <Moon className="h-[1.1rem] w-[1.1rem]" />,
  };

  return (
    <button
      id="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className={cn(
        "relative w-9 h-9 flex items-center justify-center rounded-xl",
        "bg-secondary/40 text-muted-foreground border border-border/20",
        "hover:bg-accent hover:text-foreground",
        "transition-all duration-300 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
          animate={{ scale: 1,   opacity: 1, rotate: 0 }}
          exit={{   scale: 0.6, opacity: 0, rotate: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {icons[current]}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

/* ── Search Pill ──────────────────────────────── */
const SEARCH_PLACEHOLDERS = [
  "cinematic portrait with golden hour…",
  "ghibli forest spirit art…",
  "cyberpunk city at night…",
  "product photography on marble…",
  "minimal logo design…",
  "vintage film photography…",
];

function SearchPill() {
  const router = useRouter();
  const [placeholder, setPlaceholder] = useState(SEARCH_PLACEHOLDERS[0]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % SEARCH_PLACEHOLDERS.length;
        setPlaceholder(SEARCH_PLACEHOLDERS[next]);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={() => router.push("/search")}
      aria-label="Search prompts"
      className={cn(
        "hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl w-44 xl:w-56",
        "bg-secondary/30 border border-border/40 backdrop-blur-md",
        "text-left text-xs text-muted-foreground/80",
        "hover:border-primary/40 hover:bg-secondary/70 hover:shadow-[0_0_12px_rgba(97,0,220,0.05)]",
        "transition-all duration-300 group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
      <span className="flex-1 truncate select-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={idx}
            className="block text-muted-foreground/50"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {placeholder}
          </motion.span>
        </AnimatePresence>
      </span>
      <kbd className="hidden xl:flex items-center text-[9px] bg-background/50 border border-border/30 rounded px-1.5 py-0.5 font-mono text-muted-foreground/40 flex-shrink-0">
        /
      </kbd>
    </button>
  );
}

/* ── Main Header ──────────────────────────────── */
export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { data: session } = useSession();
  const user = session?.user;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const [exploreOpen, setExploreOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const exploreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleExploreEnter = () => {
    if (exploreTimeoutRef.current) clearTimeout(exploreTimeoutRef.current);
    setExploreOpen(true);
    setMoreOpen(false);
  };
  const handleExploreLeave = () => {
    exploreTimeoutRef.current = setTimeout(() => setExploreOpen(false), 200);
  };

  const handleMoreEnter = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    setMoreOpen(true);
    setExploreOpen(false);
  };
  const handleMoreLeave = () => {
    moreTimeoutRef.current = setTimeout(() => setMoreOpen(false), 200);
  };

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) setMobileOpen(false);
    }, 0);
    return () => {
      active = false;
    };
  }, [pathname]);

  // Collapsing scroll trigger
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      e.key === "/" &&
      !(e.target instanceof HTMLInputElement) &&
      !(e.target instanceof HTMLTextAreaElement)
    ) {
      e.preventDefault();
      window.location.href = "/search";
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <header
        style={{ top: "var(--banner-height, 0px)" }}
        className={cn(
          "sticky z-50 w-full transition-all duration-500",
          isScrolled
            ? "py-3 bg-transparent"
            : "py-4 bg-background/50 backdrop-blur-lg border-b border-border/10"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex h-14 items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-500 relative overflow-hidden",
              isScrolled
                ? "mx-auto max-w-5xl rounded-2xl border border-primary/10 bg-card/60 backdrop-blur-xl shadow-[0_16px_40px_-15px_rgba(0,0,0,0.7)]"
                : "w-full"
            )}
          >
            {/* V3.1 Animated Aurora Glow Overlay (Subtle, slow 18s GPU transitions) */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40 dark:opacity-65 rounded-[inherit]">
              <div className="absolute -top-1/2 -left-1/4 w-[85%] h-[200%] bg-gradient-to-r from-violet-600/15 via-indigo-600/15 to-blue-500/10 rounded-full blur-[45px] animate-aurora-slow" />
              <div className="absolute -top-1/2 -right-1/4 w-[85%] h-[200%] bg-gradient-to-r from-cyan-500/10 via-blue-500/15 to-indigo-600/15 rounded-full blur-[45px] animate-aurora-reverse" />
            </div>
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
              aria-label={`${SITE_NAME} — Home`}
            >
              <div className="w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.04]">
                <PVLogo className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(20,184,166,0.35)]" />
              </div>
              <span className="font-extrabold text-[1.1rem] tracking-tight hidden sm:flex items-center gap-1.5 select-none">
                {SITE_NAME}
                {Boolean(user) && (
                  <span className="relative flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" title="Verified Account">
                    <svg className="w-2 h-2 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </span>
                )}
                {((user as any)?.membership === "PRO" || (user as any)?.role === "ADMIN") && (
                  <span className="text-[9px] font-black uppercase tracking-wider text-gold px-2 py-0.5 rounded-lg bg-gold/10 border border-gold/15 shadow-[0_2px_8px_rgba(245,158,11,0.15)]">PRO</span>
                )}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Main navigation">
              <Link
                href="/"
                className={cn(
                  "relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 select-none",
                  pathname === "/"
                    ? "text-primary bg-primary/[0.02]"
                    : "text-muted-foreground/80 hover:text-foreground hover:bg-secondary/40"
                )}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Discover</span>
                {pathname === "/" && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-primary/[0.03] border border-primary/15 shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                    transition={{ type: "spring", damping: 30, stiffness: 380 }}
                  />
                )}
              </Link>

              {/* Explore Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={handleExploreEnter}
                onMouseLeave={handleExploreLeave}
              >
                <button
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 select-none outline-none",
                    exploreOpen || pathname.startsWith("/category") || pathname.startsWith("/models")
                      ? "text-primary bg-primary/[0.02]"
                      : "text-muted-foreground/80 hover:text-foreground hover:bg-secondary/40"
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", exploreOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {exploreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-1/2 -translate-x-[40%] mt-2 w-[540px] bg-card/95 border border-[#23203c]/20 rounded-2xl shadow-[0_24px_60px_-8px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-5 z-50 grid grid-cols-2 gap-6"
                    >
                      {/* Categories Column */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Popular Categories</span>
                        <div className="space-y-1">
                          {EXPLORE_CATEGORIES.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/category/${cat.slug}`}
                              onClick={() => setExploreOpen(false)}
                              className="group flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors"
                            >
                              <span className="text-base select-none leading-none pt-0.5">{cat.icon}</span>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                                <span className="text-[10px] text-muted-foreground/60 leading-none">{cat.desc}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* AI Models Column */}
                      <div className="space-y-3 border-l border-border/10 pl-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gold">AI Models</span>
                        <div className="space-y-1">
                          {EXPLORE_MODELS.map((model) => (
                            <Link
                              key={model.slug}
                              href={`/models/${model.slug}`}
                              onClick={() => setExploreOpen(false)}
                              className="group flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors"
                            >
                              <span className="text-base select-none leading-none pt-0.5">{model.icon}</span>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{model.name}</span>
                                <span className="text-[10px] text-muted-foreground/60 leading-none">{model.desc}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* More Dropdown Trigger */}
              <div
                className="relative"
                onMouseEnter={handleMoreEnter}
                onMouseLeave={handleMoreLeave}
              >
                <button
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 select-none outline-none",
                    moreOpen || pathname === "/saved" || pathname === "/blog" || pathname === "/sponsor"
                      ? "text-primary bg-primary/[0.02]"
                      : "text-muted-foreground/80 hover:text-foreground hover:bg-secondary/40"
                  )}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>More</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", moreOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 bg-card/95 border border-[#23203c]/20 rounded-2xl shadow-[0_24px_60px_-8px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-2.5 z-50 flex flex-col gap-1"
                    >
                      {MORE_LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMoreOpen(false)}
                            className="group flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                          >
                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-0.5 shrink-0" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{link.label}</span>
                              <span className="text-[10px] text-muted-foreground/60 leading-tight">{link.desc}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right Side Control Pills */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Show Upgrade button ONLY for Free users & Guests */}
              {!((user as any)?.membership === "PRO" || (user as any)?.role === "ADMIN") && (
                <Link
                  href="/pricing"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade</span>
                </Link>
              )}

              {user ? (
                <div className="relative group/avatar z-50">
                  <Link 
                    href="/profile"
                    className="hidden md:flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full bg-secondary/40 border border-border/10 hover:bg-secondary/60 transition-all"
                  >
                    <img 
                      src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`} 
                      alt="Avatar" 
                      className="w-[32px] h-[32px] rounded-full object-cover ring-2 ring-white/10" 
                    />
                    <span className="text-xs font-bold text-foreground max-w-[85px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60 group-hover/avatar:rotate-180 transition-transform duration-200" />
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-[120%] w-60 rounded-2xl bg-[#09090b]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible group-hover/avatar:translate-y-2 transition-all duration-300 overflow-hidden flex flex-col p-1.5 pt-2">
                    <div className="px-3 pb-2.5 border-b border-white/5 mb-1 flex items-center justify-between">
                      <div className="flex flex-col truncate pr-2">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] font-medium text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0",
                        (user as any)?.role === "ADMIN" 
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : (user as any)?.membership === "PRO"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-neutral-800 text-neutral-400"
                      )}>
                        {(user as any)?.role === "ADMIN" ? "Admin" : (user as any)?.membership === "PRO" ? "PRO" : "FREE"}
                      </span>
                    </div>
                    
                    <div className="py-1 flex flex-col gap-0.5">
                      {(user as any)?.role === "ADMIN" && (
                        <Link 
                          href="/admin/upload" 
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition-colors text-left"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                          Admin Upload Console
                        </Link>
                      )}
                      <Link 
                        href="/profile" 
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                      >
                        <User className="w-3.5 h-3.5 text-brand" />
                        Profile & Dashboard
                      </Link>
                      <Link 
                        href="/profile?tab=collections" 
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
                      >
                        <FolderHeart className="w-3.5 h-3.5 text-brand" />
                        My Collections
                      </Link>
                    </div>

                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="hidden md:flex items-center px-4 py-1.5 rounded-full bg-foreground text-background text-xs font-bold hover:bg-white/90 transition-colors shadow-sm"
                >
                  Sign In
                </Link>
              )}
              <SearchPill />
              <ThemeToggle />

              {/* Mobile Search Button */}
              <Link
                href="/search"
                aria-label="Search prompts"
                className={cn(
                  "md:hidden w-9 h-9 flex items-center justify-center rounded-xl",
                  "bg-secondary/40 text-muted-foreground border border-border/20",
                  "hover:bg-accent hover:text-foreground",
                  "transition-all duration-300"
                )}
              >
                <Search className="h-[1.1rem] w-[1.1rem]" />
              </Link>

              {/* Mobile Drawer Trigger (Hidden on Desktop) */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className={cn(
                  "md:hidden w-9 h-9 flex items-center justify-center rounded-xl",
                  "bg-secondary/40 text-muted-foreground border border-border/20",
                  "hover:bg-accent hover:text-foreground",
                  "transition-all duration-300 active:scale-95"
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mobileOpen ? "close" : "open"}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1,   opacity: 1 }}
                    exit={{   scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X className="h-[1.1rem] w-[1.1rem]" /> : <Menu className="h-[1.1rem] w-[1.1rem]" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer (Portaled to root to guarantee fixed viewport positioning) ── */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[100] bg-[#000000] flex flex-col md:hidden overflow-hidden"
            >
              {/* Header inside mobile menu */}
              <div className="flex items-center justify-between px-5 h-[64px]">
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-bold text-white tracking-tight">{SITE_NAME}</span>
                </div>
                <div className="flex items-center gap-5">
                  <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-white hover:text-gray-300 transition-colors">
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setMobileOpen(false)} className="text-white hover:text-gray-300 transition-colors p-1 -mr-1">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
                
                {/* Profile Card */}
                {user ? (
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-4 bg-[#111113] p-4 rounded-[20px] transition-transform active:scale-[0.98]">
                    <img 
                      src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`} 
                      alt="Avatar" 
                      className="w-[46px] h-[46px] rounded-full object-cover" 
                    />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="text-[14px] font-bold text-white uppercase tracking-wider truncate">{user.name}</span>
                      <span className="text-[13px] text-muted-foreground mt-0.5">View Profile &rarr;</span>
                    </div>
                  </Link>
                ) : (
                  <Link href="/auth" onClick={() => setMobileOpen(false)} className="w-full bg-[#111113] p-5 rounded-[20px] flex items-center justify-center transition-transform active:scale-[0.98]">
                    <span className="text-[15px] font-bold text-white uppercase tracking-wide">Sign In / Create Account</span>
                  </Link>
                )}

                {/* Navigation Links */}
                <nav className="flex flex-col w-full mt-2">
                  {NAV_LINKS.map((link, idx) => {
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between py-4 border-b border-white/[0.04] active:bg-white/[0.02]"
                      >
                        <span className={cn(
                          "text-[15px] font-semibold",
                          isActive ? "text-white" : "text-white/80"
                        )}>
                          {link.label}
                        </span>
                        <ChevronRight className="w-[18px] h-[18px] text-white/30" strokeWidth={2.5} />
                      </Link>
                    );
                  })}
                  
                  {/* Fake Extra Links to match image layout */}
                  <div className="flex items-center justify-between py-4 border-b border-white/[0.04] active:bg-white/[0.02]">
                    <span className="text-[15px] font-semibold text-white/80">Explore</span>
                    <ChevronDown className="w-[18px] h-[18px] text-white/30" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-white/[0.04] active:bg-white/[0.02]">
                    <span className="text-[15px] font-semibold text-white/80">Tools</span>
                    <ExternalLink className="w-[16px] h-[16px] text-white/30" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-white/[0.04] active:bg-white/[0.02]">
                    <span className="text-[15px] font-semibold text-white/80">More</span>
                    <ChevronDown className="w-[18px] h-[18px] text-white/30" strokeWidth={2.5} />
                  </div>
                </nav>

                <div className="flex-1" /> {/* Spacer */}

                {/* Sign Out Button */}
                {user && (
                  <div className="pb-8 pt-4 w-full">
                    <button 
                      onClick={() => { handleSignOut(); setMobileOpen(false); }} 
                      className="w-full py-3.5 rounded-full border border-white/[0.12] text-white font-medium text-[15px] active:bg-white/5 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      , document.body)}
    </>
  );
}
