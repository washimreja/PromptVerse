"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sun, Moon, Monitor, X, Menu, Sparkles, Compass, Cpu, Bookmark, HelpCircle } from "lucide-react";
import { useTheme } from "next-themes";
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
          <stop offset="0%" stopColor="oklch(0.610 0.220 274)" />
          <stop offset="50%" stopColor="oklch(0.700 0.160 310)" />
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
  { href: "/",         label: "Discover", icon: Compass },
  { href: "/category", label: "Categories", icon: Sparkles },
  { href: "/models",   label: "AI Models", icon: Cpu },
  { href: "/search",   label: "Search", icon: Search },
];

/* ── Theme Toggle ─────────────────────────────── */
function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9 rounded-xl skeleton" />;

  const cycles = ["light", "dark", "system"] as const;
  type ThemeCycle = typeof cycles[number];
  const current = (theme as ThemeCycle) || "system";
  const next = cycles[(cycles.indexOf(current) + 1) % cycles.length];

  const icons: Record<ThemeCycle, React.ReactNode> = {
    light:  <Sun  className="h-[1.1rem] w-[1.1rem]" />,
    dark:   <Moon className="h-[1.1rem] w-[1.1rem]" />,
    system: <Monitor className="h-[1.1rem] w-[1.1rem]" />,
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
        "hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-xl w-64 xl:w-72",
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Collapsing scroll trigger
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          isScrolled
            ? "py-3 bg-transparent"
            : "py-4 bg-background/70 backdrop-blur-md border-b border-border/10"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex h-14 items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-500",
              isScrolled
                ? "mx-auto max-w-5xl rounded-2xl border border-border/30 bg-background/65 backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] glow-brand"
                : "w-full"
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
              aria-label={`${SITE_NAME} — Home`}
            >
              <div className="w-8 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <PVLogo className="w-8 h-8" />
              </div>
              <span className="font-extrabold text-[1.1rem] tracking-tight hidden sm:block">
                {SITE_NAME}
                <span className="text-[10px] ml-1.5 font-bold uppercase tracking-wider text-gold px-1.5 py-0.5 rounded-md bg-gold/10 border border-gold/10">v3.0</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 select-none",
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl bg-primary/8 border border-primary/10 shadow-[0_0_12px_rgba(97,0,220,0.08)]"
                        transition={{ type: "spring", damping: 28, stiffness: 350 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Control Pills */}
            <div className="flex items-center gap-2">
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

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className={cn(
                "fixed top-0 right-0 z-50 h-full w-72 md:hidden",
                "bg-card/95 backdrop-blur-2xl noise-overlay",
                "border-l border-border/20 shadow-2xl",
                "flex flex-col"
              )}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/10">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                  <PVLogo className="w-7 h-7" />
                  <span className="font-extrabold text-base tracking-tight">{SITE_NAME}</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all duration-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex-1 p-5 space-y-1" aria-label="Mobile navigation">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.05, type: "spring", damping: 25 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold",
                          "transition-all duration-300",
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/10 shadow-[0_0_12px_rgba(97,0,220,0.05)]"
                            : "text-foreground hover:bg-secondary/40 hover:text-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span>{link.label}</span>
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-border/10">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground/80">
                  <span>Theme Mode</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
