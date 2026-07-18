"use client";

import type { Prompt } from "@/types";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { Copy } from "lucide-react";

export function MostCopied({ prompts }: { prompts: Prompt[] }) {
  return (
    <section className="py-14 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* V3 Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-widest text-primary bg-primary/15 border border-primary/20 px-2.5 py-0.5 rounded-md uppercase">
                Pillar 03
              </span>
              <span className="text-muted-foreground/30 font-mono text-[10px]">// Community Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <Copy className="h-5.5 w-5.5 text-primary" />
              <span>Most Copied of All Time</span>
            </h2>
            <p className="text-xs text-muted-foreground/75 leading-relaxed max-w-xl">
              Proven utility: the most copied, reused, and highly-rated templates in our library.
            </p>
          </div>
        </div>

        {/* Prompts Grid */}
        <PromptGrid prompts={prompts} />

      </div>
    </section>
  );
}
