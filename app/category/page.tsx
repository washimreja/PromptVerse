import { CATEGORIES } from "@/lib/constants";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { getCategoryCounts } from "@/lib/prompts";
import { Grid3X3, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse 40+ premium prompt categories ranging from cinematic portraiture to YouTube thumbnails.",
};

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();

  // Populate categories list with dynamic counts
  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    promptCount: counts[cat.slug] ?? 0,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <Grid3X3 className="h-3.5 w-3.5" />
          <span>Library Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
          Browse by Category
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
          Explore our handpicked prompt categories across image generations, vector designs, copywriting, and cinematic videos.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
        {categoriesWithCounts.map((category, idx) => (
          <CategoryCard key={category.slug} category={category} index={idx} />
        ))}
      </div>

    </div>
  );
}
