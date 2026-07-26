import { AI_MODELS } from "@/lib/constants";
import { getModelCounts } from "@/lib/prompts";
import { Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

import { ModelLogo } from "@/components/models/ModelLogos";

export const metadata: Metadata = {
  title: "AI Models",
  description: "Browse prompts sorted by AI model architectures like Midjourney, Flux, Claude, ChatGPT, Imagen, and Ideogram.",
};

export const dynamic = "force-dynamic";

export default async function AIModelsPage() {
  const counts = await getModelCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 noise-overlay">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 animate-fade-up">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-4 border border-primary/15 shadow-[0_0_12px_rgba(97,0,220,0.05)]">
          <Cpu className="h-3.5 w-3.5 text-primary" />
          <span>Optimized AI Engines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Browse by AI Model
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed text-pretty font-semibold">
          Select an AI model architecture to discover prompts optimized specifically for its training set, aesthetics, and instruction-following.
        </p>
      </div>

      {/* Grid: 4 columns on large desktop, 3 on md/lg, 2 on sm, 1 on xs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-scale-in">
        {AI_MODELS.map((model, idx) => {
          const promptCount = counts[model.slug] || 0;
          return (
            <Link
              key={model.slug}
              href={`/models/${model.slug}`}
              className={cn(
                "group relative flex items-center justify-between p-4.5 rounded-2xl transition-all duration-500",
                "bg-card/45 border border-border/30 backdrop-blur-md",
                "tilt-card noise-overlay shine"
              )}
            >
              {/* Subtle backglow matching model primary colors */}
              <div
                className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: model.color || "var(--color-primary)" }}
              />

              <div className="flex items-center gap-3.5 relative z-10">
                {/* Brand Logo Container */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/50 border border-border/20 transition-transform duration-300 group-hover:scale-105"
                >
                  <ModelLogo slug={model.slug} />
                </div>
                
                <div className="flex flex-col gap-0.5 max-w-[160px] sm:max-w-[180px]">
                  <span className="font-extrabold text-[0.88rem] tracking-tight group-hover:text-primary transition-colors duration-300">
                    {model.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground/75 font-semibold line-clamp-1 leading-normal">
                    {model.description}
                  </span>
                </div>
              </div>

              {/* Counts Badge */}
              <div className="flex items-center gap-1.5 flex-shrink-0 relative z-10">
                <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-lg bg-secondary/70 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300 border border-border/10">
                  {promptCount}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/35 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
