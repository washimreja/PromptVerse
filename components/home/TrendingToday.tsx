"use client";

import type { Prompt } from "@/types";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { Flame } from "lucide-react";

export function TrendingToday({ prompts }: { prompts: Prompt[] }) {
  return (
    <section className="py-12 bg-background border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Flame className="h-5.5 w-5.5 text-orange-500 fill-orange-500/10" />
              <span>Trending Today</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Prompts getting the most views and copies over the last 24 hours
            </p>
          </div>
        </div>

        {/* Prompts Grid */}
        <PromptGrid prompts={prompts} />

      </div>
    </section>
  );
}
