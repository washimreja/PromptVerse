"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Crown, Copy, TrendingUp } from "lucide-react";
import { Prompt } from "@/types";
import { SvgThumbnail } from "@/components/prompts/PromptCard";

interface PromptCarouselProps {
  prompts: Prompt[];
}

export function PromptCarousel({ prompts }: PromptCarouselProps) {
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  if (!prompts || prompts.length === 0) return null;

  // Duplicate prompt list for continuous marquee looping
  const carouselItems = [...prompts, ...prompts];

  return (
    <section className="relative py-6 sm:py-8 bg-[#040508] overflow-hidden select-none">
      {/* ── Section Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand">Prompt Showcase</span>
          </h2>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-white transition-colors group"
        >
          <span>Explore All</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* ── Continuous Horizontal Carousel Container ── */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left & Right Shadow Gradients for seamless edge blending */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#040508] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#040508] to-transparent z-20 pointer-events-none" />

        {/* Ticker Track */}
        <div className="flex gap-3 sm:gap-4 animate-marquee hover:[animation-play-state:paused] w-max">
          {carouselItems.map((item, idx) => {
            const isPro = item.accessLevel === "PRO";
            const formattedCopies = item.copyCount > 1000 
              ? `${(item.copyCount / 1000).toFixed(1)}k` 
              : item.copyCount || "1.2k";
            
            const itemKey = `${item.id}-${idx}`;
            const hasError = imageError[itemKey];

            return (
              <Link
                key={itemKey}
                href={`/prompts/${item.id}`}
                className="relative group flex-shrink-0 w-44 sm:w-56 h-48 sm:h-60 rounded-xl overflow-hidden border border-white/10 bg-[#090a0f] hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer block"
              >
                {/* ── Image Component with Fallback ── */}
                <div className="relative w-full h-full">
                  {item.previewImage && !hasError && !item.previewImage.endsWith(".svg") ? (
                    <img
                      src={item.previewImage}
                      alt=""
                      onError={() => setImageError((prev) => ({ ...prev, [itemKey]: true }))}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <SvgThumbnail prompt={item} />
                  )}

                  {/* Vignette Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040508] via-[#040508]/30 to-black/20" />

                  {/* ── Top Badges ── */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white/90 uppercase tracking-wide truncate max-w-[90px]">
                      {item.model}
                    </span>

                    {isPro ? (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold text-amber-300 backdrop-blur-md shadow-sm">
                        <Crown className="w-2.5 h-2.5 text-amber-400" />
                        <span>PRO</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[8px] font-bold text-emerald-300 backdrop-blur-md">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* ── Center PRO Lock Indicator ── */}
                  {isPro && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="p-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 mb-1">
                        <Lock className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-200">Unlock Pro</span>
                    </div>
                  )}

                  {/* ── Bottom Content Block ── */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-semibold">
                      <TrendingUp className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate max-w-[80px]">{item.category}</span>
                      <span className="text-white/30">•</span>
                      <span className="flex items-center gap-0.5 text-white/60 shrink-0">
                        <Copy className="w-2.5 h-2.5 text-white/40" />
                        {formattedCopies}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
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
