import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPromptsByCategory, getCategoryCounts } from "@/lib/prompts";

export const dynamic = "force-dynamic";
import { CATEGORIES } from "@/lib/constants";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { Grid3X3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};

  return {
    title: `${category.name} Prompts`,
    description: `${category.description}. Copy premium, hand-tested ${category.name.toLowerCase()} prompts instantly.`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const prompts = await getPromptsByCategory(slug, "newest");
  const count = prompts.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb / Back Link */}
      <Link
        href="/category"
        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary mb-8 group transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span>Back to categories</span>
      </Link>

      {/* Category Hero Header */}
      <div className="relative border border-border bg-card rounded-3xl p-6 sm:p-10 mb-10 overflow-hidden shadow-sm">
        {/* Glow backdrop styling */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: category.color }}
        />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl select-none">{category.icon}</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{category.name}</h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="inline-flex flex-col items-center justify-center bg-secondary border border-border/60 rounded-2xl px-6 py-3 min-w-[120px]">
              <span className="text-xl font-black text-foreground">{count}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Prompts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad slot leaderboard */}
      <div className="mb-10">
        <AdSlot format="leaderboard" />
      </div>

      {/* Prompt grid list */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            All {category.name} Prompts
          </h2>
        </div>
        <PromptGrid
          prompts={prompts}
          emptyMessage={`No prompts available in ${category.name} category yet. Check back soon!`}
        />
      </div>

    </div>
  );
}
