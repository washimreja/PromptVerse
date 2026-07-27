import { AI_MODELS } from "@/lib/constants";
import { getModelCounts } from "@/lib/prompts";
import { Cpu } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
          <span>Model Architecture Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Browse by AI Model
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
          Select an AI model architecture to discover prompts optimized for its aesthetics and instruction-following.
        </p>
      </div>

      {/* Responsive 3-column mobile grid (3 items per line) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3.5">
        {AI_MODELS.map((model) => {
          const promptCount = counts[model.slug] || 0;
          return (
            <Link
              key={model.slug}
              href={`/models/${model.slug}`}
              className={cn(
                "group relative flex flex-col items-center justify-center text-center p-2.5 sm:p-3 rounded-2xl h-full transition-all duration-300 ease-out",
                "bg-[#090a0f]/90 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md",
                "hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]"
              )}
            >
              {/* Subtle backglow matching model colors */}
              <div
                className="absolute -top-6 -right-6 w-14 h-14 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: model.color || "#06b6d4" }}
              />

              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center bg-white/[0.05] border border-white/10 mb-1.5 transition-transform duration-300 group-hover:scale-105 shrink-0">
                <ModelLogo slug={model.slug} />
              </div>

              <span className="font-extrabold text-xs tracking-tight text-white line-clamp-1 group-hover:text-cyan-300 transition-colors w-full">
                {model.name}
              </span>

              <span className="text-[9px] font-extrabold text-cyan-400/90 mt-0.5">
                {promptCount} {promptCount === 1 ? 'prompt' : 'prompts'}
              </span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
