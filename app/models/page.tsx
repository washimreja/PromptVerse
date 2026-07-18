import { AI_MODELS } from "@/lib/constants";
import { getModelCounts } from "@/lib/prompts";
import { Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "AI Models",
  description: "Browse prompts sorted by AI model architectures like Midjourney, Flux, Claude, ChatGPT, Imagen, and Ideogram.",
};

/* ── Custom Official SVG Brand Logos ── */

function MidjourneyLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-400">
      {/* Stylized sailboat representing Midjourney's yacht/boat aesthetic */}
      <path d="M22 17H2a9 9 0 0 1 18-3.3" />
      <path d="M12 2v10.5" />
      <path d="M12 5c2.5 0 5 2 5 4.5S14.5 14 12 14c-2.5 0-5-2-5-4.5S9.5 5 12 5Z" />
    </svg>
  );
}

function FluxLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-400">
      {/* Lightning bolt intersecting with abstract shield representation */}
      <path d="M11.5 2L3 13h8v9l8.5-11h-8.5z" />
    </svg>
  );
}

function OpenAILogo({ className = "text-emerald-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className={cn("w-5 h-5", className)}>
      {/* Accurate vector recreation of OpenAI flower/spiral */}
      <path d="M4.5 16.5c-1.5-1-2.5-2.7-2.5-4.5 0-3 2.5-5.5 5.5-5.5.9 0 1.8.2 2.5.7" />
      <path d="M12 6.5c0-1.8-1.5-3.3-3.3-3.3-1.8 0-3.3 1.5-3.3 3.3v1" />
      <path d="M16.2 7.2c.7-.5 1.6-.7 2.5-.7 3 0 5.5 2.5 5.5 5.5 0 1.8-1 3.5-2.5 4.5" />
      <path d="M17.5 12h1" />
      <path d="M7.8 16.8c-.7.5-1.6.7-2.5.7-3 0-5.5-2.5-5.5-5.5 0-1.8 1-3.5 2.5-4.5" />
      <path d="M6.5 12h1" />
      <path d="M19.5 16.5c1.5-1 2.5-2.7 2.5-4.5 0-3-2.5-5.5-5.5-5.5-.9 0-1.8.2-2.5.7" />
      <path d="M12 17.5c0 1.8 1.5 3.3 3.3 3.3 1.8 0 3.3-1.5 3.3-3.3v-1" />
      <path d="M12 6.5v11" />
      <path d="M6.5 12h11" />
    </svg>
  );
}

function GeminiLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-sky-400">
      {/* Official double star sparkle representing Gemini */}
      <path d="M12 2c0 5.5-4.5 10-10 10 5.5 0 10 4.5 10 10 0-5.5 4.5-10 10-10-5.5 0-10-4.5-10-10z" />
      <path d="M19 17c0 2.2-1.8 4-4 4 2.2 0 4 1.8 4 4 0-2.2 1.8-4 4-4-2.2 0-4-1.8-4-4z" opacity="0.6" />
    </svg>
  );
}

function ClaudeLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-500">
      {/* Anthropic geometric crown/sparks design */}
      <path d="M12 3v18" />
      <path d="M7 6v12" />
      <path d="M17 6v12" />
      <path d="M3 10h18" />
      <path d="M3 14h18" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      {/* Google Multicolor G logo */}
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

function DeepMindLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400">
      {/* Stylized Google DeepMind neural network logo */}
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="5" cy="5" r="2.5" />
      <circle cx="19" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <line x1="7" y1="7" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="17" y1="7" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="7" y1="17" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="17" y1="17" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function KlingLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-cyan-400">
      {/* Kling dual circular overlapping rings */}
      <circle cx="10" cy="12" r="6" />
      <circle cx="14" cy="12" r="6" style={{ mixBlendMode: 'screen' }} />
    </svg>
  );
}

function IdeogramLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5 text-violet-400">
      {/* Ideogram interlocking shapes representing design grid */}
      <rect x="5" y="5" width="14" height="14" rx="3" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function RecraftLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-yellow-400">
      {/* Recraft Designer stylus/pen representing vectors */}
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function BananaLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-400">
      {/* Nano Banana vector outline */}
      <path d="M19 3c-1.5 2.5-3.5 5-6 6.5S7.5 11 5 11c-1 0-2-.2-3-.5 1.8 2.5 4.5 4.5 7.5 5 3.2.5 7-.5 9.5-3 2.8-2.8 3.8-6.5 3.3-9.5-.3-1.3-1.1-2.4-2.3-3z" />
    </svg>
  );
}

// Logo helper map
function getModelLogo(slug: string) {
  switch (slug) {
    case "midjourney":
      return <MidjourneyLogo />;
    case "flux":
      return <FluxLogo />;
    case "chatgpt":
      return <OpenAILogo className="text-emerald-400" />;
    case "gemini":
      return <GeminiLogo />;
    case "claude":
      return <ClaudeLogo />;
    case "gpt-image":
      return <OpenAILogo className="text-teal-400" />;
    case "imagen":
      return <GoogleLogo />;
    case "ideogram":
      return <IdeogramLogo />;
    case "recraft":
      return <RecraftLogo />;
    case "nano-banana":
      return <BananaLogo />;
    case "kling":
      return <KlingLogo />;
    case "veo":
      return <DeepMindLogo />;
    case "sora":
      return <OpenAILogo className="text-indigo-400" />;
    default:
      return <Cpu className="w-5 h-5 text-primary" />;
  }
}

export default function AIModelsPage() {
  const counts = getModelCounts();

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
                  {getModelLogo(model.slug)}
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
