"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Crown, Copy, Sparkles, TrendingUp } from "lucide-react";
import { Prompt } from "@/types";

interface PromptCarouselProps {
  prompts: Prompt[];
}

export function PromptCarousel({ prompts }: PromptCarouselProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!prompts || prompts.length === 0) return null;

  // Duplicate prompt list for seamless continuous infinite looping
  const carouselItems = [...prompts, ...prompts];

  return (
    <section className="relative py-12 bg-[#040508] overflow-hidden select-none">
      {/* ── Section Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand">Prompt Showcase</span>
          </h2>
        </div>
        <Link
          href="/search"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-white transition-colors group"
        >
          <span>Explore All 10,000+</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* ── Continuous Horizontal Carousel Container ── */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Shadow Gradients for seamless edge blending */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#040508] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#040508] to-transparent z-20 pointer-events-none" />

        {/* Ticker Track */}
        <div className="flex gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused] w-max">
          {carouselItems.map((item, idx) => {
            const isPro = item.accessLevel === "PRO";
            const formattedCopies = item.copyCount > 1000 
              ? `${(item.copyCount / 1000).toFixed(1)}k` 
              : item.copyCount || "1.2k";

            return (
              <Link
                key={`${item.id}-${idx}`}
                href={`/prompts/${item.id}`}
                onMouseEnter={() => setHoveredId(`${item.id}-${idx}`)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group flex-shrink-0 w-64 sm:w-80 h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/10 bg-[#090a0f] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* ── Image Component with Fallback & Optimization ── */}
                <div className="relative w-full h-full">
                  <Image
                    src={item.previewImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 256px, 320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040508] via-[#040508]/40 to-transparent" />

                  {/* ── Top Badges ── */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/90 uppercase tracking-wide">
                      {item.model}
                    </span>

                    {isPro ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 backdrop-blur-md shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span>PRO</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-bold text-emerald-300 backdrop-blur-md">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* ── Center PRO Lock Indicator for Locked Prompts ── */}
                  {isPro && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-3 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 mb-2 shadow-lg">
                        <Lock className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-extrabold text-amber-200 tracking-wide">Unlock with PRO</span>
                    </div>
                  )}

                  {/* ── Bottom Content Block ── */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span>{item.category}</span>
                      <span className="text-white/30">•</span>
                      <span className="flex items-center gap-1 text-white/60">
                        <Copy className="w-3 h-3 text-white/40" />
                        {formattedCopies} copies
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
