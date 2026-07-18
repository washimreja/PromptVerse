"use client";

import { AI_MODELS } from "@/lib/constants";
import { ModelCard } from "@/components/models/ModelCard";
import { Cpu } from "lucide-react";

export function BrowseByModel() {
  return (
    <section className="py-14 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* V3 Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-widest text-primary bg-primary/15 border border-primary/20 px-2.5 py-0.5 rounded-md uppercase">
                Pillar 06
              </span>
              <span className="text-muted-foreground/30 font-mono text-[10px]">// Model Optimization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <Cpu className="h-6 w-6 text-primary" />
              <span>Optimized AI Engines</span>
            </h2>
            <p className="text-xs text-muted-foreground/75 leading-relaxed max-w-xl">
              Explore prompts optimized for specific image, text, and video models to get the best out of each AI platform.
            </p>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {AI_MODELS.map((model, idx) => (
            <ModelCard key={model.slug} model={model} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
