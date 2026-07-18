"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Grid3X3 } from "lucide-react";

export function BrowseByCategory() {
  // Show first 12 categories on homepage
  const featuredCategories = CATEGORIES.slice(0, 12);

  return (
    <section className="py-12 bg-background border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Grid3X3 className="h-5.5 w-5.5 text-primary" />
              <span>Browse by Category</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Discover prompts tailored for various artistic styles, formats, and channels
            </p>
          </div>
          
          <Link
            href="/category"
            className="text-xs font-bold text-primary hover:underline underline-offset-4"
          >
            View All ({CATEGORIES.length})
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredCategories.map((category, idx) => (
            <CategoryCard key={category.slug} category={category} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
