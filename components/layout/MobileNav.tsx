"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Sparkles, Cpu, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/",         label: "Discover",   icon: Compass },
  { href: "/category", label: "Categories", icon: Sparkles },
  { href: "/models",   label: "AI Models",  icon: Cpu },
  { href: "/search",   label: "Search",     icon: Search },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
      <div className="flex h-14 items-center justify-around rounded-2xl border border-border/30 bg-background/65 backdrop-blur-xl px-2 shadow-[0_8px_30px_rgb(0,0,0,0.5)] glow-brand">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-300 active:scale-90"
            >
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive 
                      ? "text-primary scale-110" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold tracking-tight transition-all duration-300",
                    isActive ? "text-primary opacity-100" : "text-muted-foreground/60 opacity-80"
                  )}
                >
                  {item.label}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute inset-0 rounded-xl bg-primary/8 border border-primary/10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MobileNav;
