"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import type { Prompt } from "@/types";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { ScrollCarousel } from "@/components/ui/ScrollCarousel";

export function FeaturedPrompts({ prompts }: { prompts: Prompt[] }) {
  const sidebar = (
    <div className="flex flex-col gap-4">
      <span className="section-label">Premium Spotlight</span>
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight leading-tight">
          Featured<br />Prompts
        </h2>
        <p className="text-xs text-muted-foreground/70 leading-relaxed">
          Hand-crafted AI prompts for stunning, professional results.
        </p>
      </div>
      <Link
        href="/search?sort=most-popular"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline underline-offset-3 transition-colors mt-1"
      >
        See more premium prompts
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );

  return (
    <section className="py-12 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Mobile section header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <div className="space-y-1">
            <span className="section-label">Premium Spotlight</span>
            <h2 className="text-2xl font-extrabold tracking-tight">Featured Prompts</h2>
          </div>
          <Link href="/search?sort=most-popular" className="text-xs font-bold text-primary flex items-center gap-1">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ScrollCarousel leftSidebar={sidebar} gap={12}>
          <PromptGrid prompts={prompts} variant="carousel" />
        </ScrollCarousel>

      </div>
    </section>
  );
}
