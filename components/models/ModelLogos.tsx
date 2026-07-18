"use client";

import { cn } from "@/lib/utils";

export function MidjourneyLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-400">
      {/* Premium yacht monogram lettermark M for Midjourney */}
      <path d="M4 20V8l8 7 8-7v12" />
      <path d="M2 21h20" opacity="0.3" />
    </svg>
  );
}

export function FluxLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-400">
      {/* Crisp, clean, geometric lightning bolt representing Flux/BFL */}
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

export function OpenAILogo({ className = "text-emerald-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className={cn("w-5 h-5", className)}>
      {/* Perfectly aligned symmetric vector representing OpenAI flower */}
      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.1" />
      <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" opacity="0.6" />
    </svg>
  );
}

export function GeminiLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5 text-sky-400">
      {/* Curved four-pointed star representing Gemini */}
      <path d="M12 3c0 4.5 3.5 8 8 8-4.5 0-8 3.5-8 8 0-4.5-3.5-8-8-8 4.5 0 8-3.5 8-8z" fill="currentColor" fillOpacity="0.1" />
    </svg>
  );
}

export function ClaudeLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-500">
      {/* Crisp Anthropic lettermark A crown */}
      <path d="M6 20L12 4l6 16" />
      <path d="M9 13h6" />
    </svg>
  );
}

export function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

export function DeepMindLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-400">
      {/* DeepMind neural spark nodes */}
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12 2v20M2 12h20" opacity="0.5" />
    </svg>
  );
}

export function KlingLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-cyan-400">
      {/* Kling dual circular infinity orbits */}
      <path d="M8 12a4 4 0 1 0 8 0c0-2.2-1.8-4-4-4s-4 1.8-4 4z" fill="currentColor" fillOpacity="0.1" />
      <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
    </svg>
  );
}

export function IdeogramLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-violet-400">
      {/* Clean typographic iris logo */}
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.1" />
    </svg>
  );
}

export function RecraftLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-yellow-500">
      {/* Designer Recraft vector cube */}
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

export function BananaLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-yellow-400">
      {/* Dynamic Nano Banana vector monogram */}
      <path d="M12 2a10 10 0 0 0-7 3c-3 3-3 8 0 11a10 10 0 0 0 14 0c3-3 3-8 0-11a10 10 0 0 0-7-3z" fill="currentColor" fillOpacity="0.1" />
      <path d="M8 6c2 0 5 2 6 5s1 6-2 7" />
    </svg>
  );
}

export function ModelLogo({ slug, className }: { slug: string; className?: string }) {
  switch (slug) {
    case "midjourney":
      return <MidjourneyLogo />;
    case "flux":
      return <FluxLogo />;
    case "chatgpt":
      return <OpenAILogo className={className} />;
    case "gemini":
      return <GeminiLogo />;
    case "claude":
      return <ClaudeLogo />;
    case "gpt-image":
      return <OpenAILogo className={className} />;
    case "imagen":
      return <GoogleLogo />;
    case "veo":
      return <DeepMindLogo />;
    case "kling":
      return <KlingLogo />;
    case "ideogram":
      return <IdeogramLogo />;
    case "recraft":
      return <RecraftLogo />;
    case "nano-banana":
      return <BananaLogo />;
    default:
      return <span>🤖</span>;
  }
}
