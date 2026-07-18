"use client";

import type { Prompt } from "@/types";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { Star } from "lucide-react";

export function EditorChoice({ prompts }: { prompts: Prompt[] }) {
  return (
    <section className="py-12 bg-background border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Star className="h-5.5 w-5.5 text-amber-500 fill-amber-500/20" />
              <span>Editor&apos;s Choice</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Highly refined prompts selected by our design team for exceptional output quality
            </p>
          </div>
        </div>

        {/* Prompts Grid */}
        <PromptGrid prompts={prompts} />

      </div>
    </section>
  );
}
