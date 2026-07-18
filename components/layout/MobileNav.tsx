"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, Grid3X3, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/",         label: "Home",       icon: Home },
  { href: "/search",   label: "Search",     icon: Search },
  { href: "/category", label: "Categories", icon: Grid3X3 },
  { href: "/models",   label: "AI Models",  icon: Cpu },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "glass border-t border-border",
        "pb-safe"
      )}
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl",
                "min-w-[64px] min-h-[56px] justify-center",
                "transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active background pill */}
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 bg-primary/10 rounded-2xl"
                  transition={{ type: "spring", damping: 30, stiffness: 380 }}
                />
              )}
              <span className="relative">
                <Icon className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
              </span>
              <span className={cn(
                "relative text-[10px] font-medium tracking-wide leading-none transition-all duration-200",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {tab.label}
              </span>
              {/* Active dot */}
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-dot"
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary"
                  transition={{ type: "spring", damping: 30, stiffness: 380 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
