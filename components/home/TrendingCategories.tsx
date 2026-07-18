"use client";

import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import { useRouter } from "next/navigation";

export function TrendingCategories() {
  const router = useRouter();
  // Get 12 trending categories
  const trending = CATEGORIES.slice(0, 12);

  return (
    <section className="py-6 bg-background border-b border-border/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          
          {/* Label Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-wider flex-shrink-0">
            <Flame className="h-3.5 w-3.5 fill-orange-500 animate-pulse" />
            <span>Trending</span>
          </div>

          {/* Horizontally scrollable list */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 flex-1">
            {trending.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => router.push(`/category/${cat.slug}`)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap",
                  "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20",
                  "transition-all duration-200 cursor-pointer select-none"
                )}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
