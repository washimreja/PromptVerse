"use client";

import type { Prompt } from "@/types";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { Calendar } from "lucide-react";

export function NewestPrompts({ prompts }: { prompts: Prompt[] }) {
  return (
    <section className="py-14 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* V3 Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-widest text-primary bg-primary/15 border border-primary/20 px-2.5 py-0.5 rounded-md uppercase">
                Pillar 05
              </span>
              <span className="text-muted-foreground/30 font-mono text-[10px]">// Fresh Horizon</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <Calendar className="h-5.5 w-5.5 text-primary" />
              <span>Newest Additions</span>
            </h2>
            <p className="text-xs text-muted-foreground/75 leading-relaxed max-w-xl">
              Fresh drops: stay on top of the absolute latest creative prompts added to our global library.
            </p>
          </div>
        </div>

        {/* Prompts Grid */}
        <PromptGrid prompts={prompts} />

      </div>
    </section>
  );
}
