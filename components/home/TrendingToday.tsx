"use client";

import type { Prompt } from "@/types";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { Flame } from "lucide-react";

export function TrendingToday({ prompts }: { prompts: Prompt[] }) {
  return (
    <section className="py-14 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* V3 Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-widest text-primary bg-primary/15 border border-primary/20 px-2.5 py-0.5 rounded-md uppercase">
                Pillar 02
              </span>
              <span className="text-muted-foreground/30 font-mono text-[10px]">// Speed & Momentum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <Flame className="h-6 w-6 text-orange-500 fill-orange-500/15" />
              <span>Trending Today</span>
            </h2>
            <p className="text-xs text-muted-foreground/75 leading-relaxed max-w-xl">
              Real-time activity spikes: prompts getting the most copies and views over the last 24 hours.
            </p>
          </div>
        </div>

        {/* Prompts Grid */}
        <PromptGrid prompts={prompts} />

      </div>
    </section>
  );
}
