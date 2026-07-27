import { CATEGORIES } from "@/lib/constants";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { getCategoryCounts } from "@/lib/prompts";
import { Grid3X3 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse 40+ premium prompt categories ranging from cinematic portraiture to YouTube thumbnails.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();

  // Populate categories list with dynamic counts
  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    promptCount: counts[cat.slug] ?? 0,
  }));

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
          <Grid3X3 className="h-3.5 w-3.5" />
          <span>Category Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Browse by Category
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
          Explore prompt categories for Midjourney, Flux, Stable Diffusion, ChatGPT, and Gemini.
        </p>
      </div>

      {/* Responsive 3-column mobile grid (3 items per line) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3.5">
        {categoriesWithCounts.map((category, idx) => (
          <CategoryCard key={category.slug} category={category} index={idx} />
        ))}
      </div>

    </div>
  );
}
