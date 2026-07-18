"use client";

import { AI_MODELS } from "@/lib/constants";
import { ModelCard } from "@/components/models/ModelCard";
import { Cpu } from "lucide-react";

export function BrowseByModel() {
  return (
    <section className="py-12 bg-background border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Cpu className="h-5.5 w-5.5 text-primary" />
              <span>Browse by AI Models</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Explore prompts optimized for specific image, text, and video models
            </p>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {AI_MODELS.map((model, idx) => (
            <ModelCard key={model.slug} model={model} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
