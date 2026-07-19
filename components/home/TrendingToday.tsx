"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import type { Prompt } from "@/types";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { ScrollCarousel } from "@/components/ui/ScrollCarousel";

export function TrendingToday({ prompts }: { prompts: Prompt[] }) {
  return (
    <section className="py-12 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div className="space-y-1.5">
            <span className="section-label">What&apos;s Hot</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              Trending Prompts
            </h2>
            <p className="text-xs text-muted-foreground/60">Top AI prompts this week</p>
          </div>
          <Link
            href="/search?sort=trending"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline underline-offset-3"
          >
            See all Trending Prompts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ScrollCarousel gap={12}>
          <PromptGrid prompts={prompts} variant="carousel" />
        </ScrollCarousel>

        <div className="mt-5 sm:hidden text-center">
          <Link href="/search?sort=trending" className="text-xs font-bold text-primary flex items-center justify-center gap-1">
            See all Trending Prompts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
