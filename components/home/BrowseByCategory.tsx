"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Grid3X3 } from "lucide-react";

export function BrowseByCategory() {
  // Show first 12 categories on homepage
  const featuredCategories = CATEGORIES.slice(0, 12);

  return (
    <section className="py-14 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* V3 Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-widest text-primary bg-primary/15 border border-primary/20 px-2.5 py-0.5 rounded-md uppercase">
                Pillar 07
              </span>
              <span className="text-muted-foreground/30 font-mono text-[10px]">// Visual Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <Grid3X3 className="h-6 w-6 text-primary" />
              <span>Browse by Category</span>
            </h2>
            <p className="text-xs text-muted-foreground/75 leading-relaxed max-w-xl">
              Discover prompts tailored for various artistic styles, visual layouts, content channels, and vectors.
            </p>
          </div>
          
          <Link
            href="/category"
            className="text-xs font-bold text-primary hover:underline underline-offset-4 flex-shrink-0"
          >
            View All ({CATEGORIES.length})
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {featuredCategories.map((category, idx) => (
            <CategoryCard key={category.slug} category={category} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
