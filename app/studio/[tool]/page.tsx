import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PromptStudioWorkbench, StudioToolId } from "@/components/studio/PromptStudioWorkbench";

interface Props {
  params: Promise<{ tool: string }>;
}

const TOOL_META: Record<
  string,
  { title: string; subtitle: string; toolId: StudioToolId; badge: string }
> = {
  "smart-shot": {
    title: "Smart Shot AI Studio",
    subtitle: "Cinematic portraiture, editorial fashion, facial expressions, and character generation.",
    toolId: "smart-shot",
    badge: "Portrait Mode",
  },
  relight: {
    title: "Relight Scene AI Studio",
    subtitle: "Atmospheric illumination, god rays, golden hour, and dramatic neon lighting prompts.",
    toolId: "relight",
    badge: "Lighting Engine",
  },
  "replace-bg": {
    title: "Replace BG Scene AI Studio",
    subtitle: "Architectural backdrops, vast landscape vistas, and cyberpunk environment styling.",
    toolId: "replace-bg",
    badge: "Environment Mode",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const meta = TOOL_META[tool] || {
    title: "PromptVerse Studio Tool",
    subtitle: "AI prompt engineering and generation tool",
  };

  return {
    title: `${meta.title} | PromptVerse`,
    description: meta.subtitle,
  };
}

export default async function StudioToolPage({ params }: Props) {
  const { tool } = await params;
  const toolConfig = TOOL_META[tool] || {
    title: "AI Studio Workbench",
    subtitle: "Craft, fine-tune, and optimize high-end prompts for Midjourney, FLUX, and LLMs.",
    toolId: "universal" as StudioToolId,
    badge: "Workbench",
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      {/* Top Banner */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-start mb-4">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-cyan-400 transition-colors py-1.5 px-3 rounded-lg bg-white/5 border border-white/10"
          >
            <ArrowLeft size={13} />
            <span>All Studio Tools</span>
          </Link>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles size={13} />
          {toolConfig.badge}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          {toolConfig.title}
        </h1>
        <p className="text-white/60 text-sm md:text-base max-w-2xl">
          {toolConfig.subtitle}
        </p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <PromptStudioWorkbench initialTool={toolConfig.toolId} />
      </div>
    </div>
  );
}
