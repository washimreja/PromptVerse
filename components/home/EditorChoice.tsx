"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { Prompt } from "@/types";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { ScrollCarousel } from "@/components/ui/ScrollCarousel";

export function EditorChoice({ prompts }: { prompts: Prompt[] }) {
  return (
    <section className="py-12 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-6">
          <div className="space-y-1.5">
            <span className="section-label">Editor&apos;s Picks</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Star className="h-5 w-5 text-gold fill-gold/30" />
              Hand-Picked Excellence
            </h2>
            <p className="text-xs text-muted-foreground/60">Curated by our team of prompt engineers</p>
          </div>
          <Link
            href="/search?sort=most-popular"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline underline-offset-3"
          >
            See all Editor&apos;s Picks <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ScrollCarousel gap={12}>
          <PromptGrid prompts={prompts} variant="carousel" />
        </ScrollCarousel>

      </div>
    </section>
  );
}
