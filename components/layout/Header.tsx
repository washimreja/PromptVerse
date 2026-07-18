"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sun, Moon, Monitor, X, Menu, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/category", label: "Categories" },
  { href: "/models", label: "AI Models" },
  { href: "/search", label: "Search" },
];

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-muted animate-pulse" />
    );
  }

  const cycles = ["light", "dark", "system"] as const;
  const current = (theme as typeof cycles[number]) || "system";
  const next = cycles[(cycles.indexOf(current) + 1) % cycles.length];

  const icons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  };

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-xl",
        "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <motion.div
        key={resolvedTheme}
        initial={{ scale: 0.7, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {icons[current]}
      </motion.div>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Handle scroll shadow
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Press "/" keyboard shortcut → focus search
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      e.key === "/" &&
      !(e.target instanceof HTMLInputElement) &&
      !(e.target instanceof HTMLTextAreaElement)
    ) {
      e.preventDefault();
      const searchInput = document.getElementById("header-search-input");
      if (searchInput) {
        searchInput.focus();
      } else {
        window.location.href = "/search";
      }
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
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border-border shadow-sm"
            : "bg-background/60 backdrop-blur-md border-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 flex-shrink-0 group"
            >
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">
                {SITE_NAME}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Search (compact) */}
            <Link
              href="/search"
              className={cn(
                "hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl",
                "bg-muted hover:bg-accent border border-border",
                "text-muted-foreground hover:text-foreground",
                "text-sm transition-all duration-200 min-w-[200px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label="Search prompts"
            >
              <Search className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">Search prompts…</span>
              <kbd className="hidden xl:flex items-center gap-0.5 text-[10px] bg-background border border-border rounded px-1.5 py-0.5 font-mono text-muted-foreground">
                /
              </kbd>
            </Link>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Mobile search icon */}
              <Link
                href="/search"
                aria-label="Search"
                className={cn(
                  "md:hidden w-9 h-9 flex items-center justify-center rounded-xl",
                  "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground",
                  "transition-all duration-200"
                )}
              >
                <Search className="h-4 w-4" />
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className={cn(
                  "md:hidden w-9 h-9 flex items-center justify-center rounded-xl",
                  "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground",
                  "transition-all duration-200"
                )}
              >
                {mobileOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className={cn(
                "fixed top-0 right-0 z-50 h-full w-72 md:hidden",
                "bg-background/95 backdrop-blur-xl border-l border-border",
                "shadow-2xl flex flex-col"
              )}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-base">{SITE_NAME}</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex-1 p-4 space-y-1" aria-label="Mobile navigation">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                        "transition-all duration-200",
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
