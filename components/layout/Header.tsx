"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sun, Moon, Monitor, X, Menu, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/",         label: "Home" },
  { href: "/category", label: "Categories" },
  { href: "/models",   label: "AI Models" },
  { href: "/search",   label: "Search" },
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
        "bg-secondary text-muted-foreground",
        "hover:bg-accent hover:text-foreground",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
          animate={{ scale: 1,   opacity: 1, rotate: 0 }}
          exit={{   scale: 0.6, opacity: 0, rotate: 15 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
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
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={() => router.push("/search")}
      aria-label="Search prompts"
      className={cn(
        "hidden lg:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl w-64 xl:w-80",
        "bg-secondary border border-border",
        "text-left text-sm text-muted-foreground",
        "hover:border-primary/40 hover:bg-accent",
        "transition-all duration-200 group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground/70 group-hover:text-primary transition-colors duration-200" />
      <span className="flex-1 truncate">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={idx}
            className="block"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {placeholder}
          </motion.span>
        </AnimatePresence>
      </span>
      <kbd className="hidden xl:flex items-center text-[10px] bg-background border border-border rounded-md px-1.5 py-0.5 font-mono text-muted-foreground/60 flex-shrink-0">
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

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Press "/" to search
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
      {/* ── Desktop / Tablet Header ── */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "glass border-b border-border shadow-sm shadow-black/5"
            : "bg-background/80 backdrop-blur-sm border-b border-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label={`${SITE_NAME} — Home`}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center",
                "gradient-brand shadow-md",
                "group-hover:scale-105 group-hover:shadow-lg",
                "transition-all duration-200"
              )}>
                <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-[1.05rem] tracking-tight hidden sm:block">
                {SITE_NAME}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-xl bg-primary/8"
                        transition={{ type: "spring", damping: 30, stiffness: 350 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <SearchPill />
              <ThemeToggle />

              {/* Mobile search */}
              <Link
                href="/search"
                aria-label="Search prompts"
                className={cn(
                  "md:hidden w-9 h-9 flex items-center justify-center rounded-xl",
                  "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground",
                  "transition-all duration-200"
                )}
              >
                <Search className="h-[1.1rem] w-[1.1rem]" />
              </Link>

              {/* Hamburger */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className={cn(
                  "md:hidden w-9 h-9 flex items-center justify-center rounded-xl",
                  "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground",
                  "transition-all duration-200"
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 380 }}
              className={cn(
                "fixed top-0 right-0 z-50 h-full w-72 md:hidden",
                "bg-background/95 backdrop-blur-2xl",
                "border-l border-border shadow-2xl",
                "flex flex-col"
              )}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                  <div className="w-7 h-7 rounded-xl gradient-brand flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-bold text-base">{SITE_NAME}</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex-1 p-4 space-y-1" aria-label="Mobile navigation">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.08, type: "spring", damping: 25 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium",
                          "transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        {link.label}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Appearance</span>
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
