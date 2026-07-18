"use client";

import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Flame, Compass } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function TrendingCategories() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Get 12 trending categories
  const trending = CATEGORIES.slice(0, 12);

  return (
    <section className="py-5 bg-background border-b border-border/10 overflow-hidden relative">
      {/* Scroll indicator fades */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          
          {/* Label Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-wider flex-shrink-0 border border-orange-500/10 shadow-[0_0_12px_rgba(249,115,22,0.1)]">
            <Flame className="h-3.5 w-3.5 fill-orange-500 animate-pulse" />
            <span>Trending</span>
          </div>

          {/* Horizontally scrollable list */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 flex-1 scroll-smooth snap-x snap-mandatory">
            {/* "All" chip */}
            <button
              onClick={() => router.push("/category")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap snap-align-start",
                "bg-secondary/40 text-muted-foreground/80 hover:bg-primary/10 hover:text-primary border border-border/10",
                "transition-all duration-300 cursor-pointer select-none hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(97,0,220,0.05)]",
                pathname === "/category" && "bg-primary text-primary-foreground border-primary/20 shadow-md glow-brand"
              )}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>All Categories</span>
            </button>

            {trending.map((cat) => {
              const activeSlug = `/category/${cat.slug}`;
              const isActive = pathname === activeSlug;

              return (
                <button
                  key={cat.slug}
                  onClick={() => router.push(activeSlug)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap snap-align-start relative transition-all duration-300 cursor-pointer select-none",
                    isActive
                      ? "text-primary-foreground bg-primary border-primary/20 shadow-md glow-brand font-extrabold"
                      : "bg-secondary/40 text-muted-foreground/80 hover:bg-primary/10 hover:text-primary border border-border/10 hover:scale-[1.02]"
                  )}
                >
                  <span className="select-none">{cat.icon}</span>
                  <span>{cat.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="active-chip-glow"
                      className="absolute inset-0 rounded-xl bg-primary-foreground/5"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
