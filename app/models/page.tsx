import { AI_MODELS } from "@/lib/constants";
import { ModelCard } from "@/components/models/ModelCard";
import { getModelCounts } from "@/lib/prompts";
import { Cpu } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Models",
  description: "Browse prompts sorted by AI model architectures like Midjourney, Flux, Claude, ChatGPT, Imagen, and Ideogram.",
};

export default function AIModelsPage() {
  const counts = getModelCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <Cpu className="h-3.5 w-3.5" />
          <span>Model Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
          Browse by AI Model
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
          Select an AI architecture to view prompts fine-tuned specifically for its instruction-following and aesthetic traits.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {AI_MODELS.map((model, idx) => (
          <ModelCard key={model.slug} model={model} index={idx} />
        ))}
      </div>

    </div>
  );
}
