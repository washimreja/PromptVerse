"use client";

import Link from "next/link";
import { Sparkles, Copy, Share2, Eye, Clock, Check } from "lucide-react";
import { cn, formatCopyCount, getReadingTime } from "@/lib/utils";
import type { Prompt } from "@/types";
import { CopyButton } from "./CopyButton";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

/** Generates a premium, highly tactile SVG animated thumbnail with noise and organic patterns. */
export function SvgThumbnail({ prompt }: { prompt: Prompt }) {
  const colors = prompt.colorPalette || ["#6366F1", "#8B5CF6", "#EC4899"];
  const c1 = colors[0];
  const c2 = colors[1] || colors[0];
  const c3 = colors[2] || colors[0];

  // Fingerprint calculation for uniquely generated shapes per prompt
  const seedVal = prompt.title.charCodeAt(0) + prompt.title.charCodeAt(prompt.title.length - 1);
  const pathType = seedVal % 4;

  let pathElement = null;

  if (pathType === 0) {
    pathElement = (
      <path
        d="M-20 60 C 40 10, 90 90, 150 30 C 210 -10, 250 80, 320 20 L 320 200 L -20 200 Z"
        fill={`url(#grad-mesh-${prompt.id})`}
        opacity="0.85"
      />
    );
  } else if (pathType === 1) {
    pathElement = (
      <polygon
        points="-40,160 160,-40 340,120 120,340"
        fill={`url(#grad-mesh-${prompt.id})`}
        opacity="0.8"
      />
    );
  } else if (pathType === 2) {
    pathElement = (
      <>
        <circle cx="90" cy="110" r="100" fill={`url(#grad-mesh-${prompt.id})`} opacity="0.85" />
        <circle cx="210" cy="50" r="80" fill={c3} opacity="0.25" style={{ mixBlendMode: 'screen' }} />
      </>
    );
  } else {
    pathElement = (
      <path
        d="M-10,30 Q80,0 150,80 T300,90 L300,200 L-10,200 Z"
        fill={`url(#grad-mesh-${prompt.id})`}
        opacity="0.85"
      />
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center select-none group-hover:scale-[1.03] transition-transform duration-700">
      {/* Background base mesh */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-bg-${prompt.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#050508" />
            <stop offset="100%" stopColor="#110F24" />
          </linearGradient>
          <linearGradient id={`grad-mesh-${prompt.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="50%" stopColor={c2} />
            <stop offset="100%" stopColor={c3} />
          </linearGradient>
          <pattern id={`dot-pat-${prompt.id}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#ffffff" fillOpacity="0.06" />
          </pattern>
        </defs>

        {/* Base dark gradient */}
        <rect width="100%" height="100%" fill={`url(#grad-bg-${prompt.id})`} />

        {/* Dot patterns */}
        <rect width="100%" height="100%" fill={`url(#dot-pat-${prompt.id})`} />

        {/* Dynamic mesh shape */}
        {pathElement}

        {/* Overlay mesh glow */}
        <circle cx="150" cy="100" r="120" fill="url(#logo-grad)" opacity="0.05" filter="blur(40px)" />
      </svg>

      {/* Model Overlay watermark badge */}
      <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-xl border border-white/10 rounded-lg px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest uppercase text-white/95 shadow-lg">
        {prompt.model}
      </div>

      {/* Aesthetic float icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
        <Sparkles className="h-4.5 w-4.5 text-white/40 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}

export function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse hover 3D tilt tracking variables
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateX = (yc - y) / 18; // Max 10 deg tilt
    const rotateY = (x - xc) / 18;
    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/prompts/${prompt.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: prompt.description,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Prompt share link copied to clipboard!", { duration: 1500 });
    }
  };

  // Find Category color for active chip glow
  const categoryObject = CATEGORIES.find(
    (c) => c.slug === prompt.category.toLowerCase() || c.name.toLowerCase() === prompt.category.toLowerCase()
  );
  const categoryColor = categoryObject?.color || "var(--color-primary)";

  const difficultyStars = Array.from({ length: 3 }).map((_, i) => (
    <span
      key={i}
      className={cn(
        "w-1.5 h-1.5 rounded-full transition-all duration-300",
        i < prompt.difficulty
          ? "bg-primary shadow-[0_0_8px_var(--color-primary)]"
          : "bg-muted-foreground/20"
      )}
    />
  ));

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.35), ease: "easeOut" }}
      className="perspective-container w-full h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
        }}
        className={cn(
          "tilt-card relative flex flex-col w-full h-full rounded-[20px]",
          "bg-card/45 border border-border/30 shadow-md overflow-hidden backdrop-blur-md",
          "noise-overlay select-none"
        )}
      >
        {/* ── Image/Preview container with Dynamic Aspect Ratio ── */}
        <Link
          href={`/prompts/${prompt.id}`}
          className="relative block w-full overflow-hidden border-b border-border/20 flex-shrink-0 bg-slate-950/60"
          style={{
            aspectRatio: prompt.aspectRatio ? prompt.aspectRatio.replace(":", "/") : "16/9"
          }}
        >
          {prompt.previewImage && (prompt.previewImage.startsWith("http") || !prompt.previewImage.endsWith(".svg")) ? (
            <img
              src={prompt.previewImage}
              alt={prompt.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <SvgThumbnail prompt={prompt} />
          )}

          {/* V3.5 Free/Pro badge overlay */}
          <div className="absolute top-3 right-3 z-20 pointer-events-none select-none">
            {prompt.isPro ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-gold/15 text-gold border border-gold/30 shadow-[0_2px_8px_rgba(245,158,11,0.25)] backdrop-blur-md">
                🔒 Pro
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 backdrop-blur-md">
                ✓ Free
              </span>
            )}
          </div>
        </Link>

        {/* ── Info Content Area ── */}
        <div className="flex flex-col flex-grow p-4.5 justify-between gap-4">
          
          {/* Badge & Time info */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              style={{
                borderColor: `${categoryColor}30`,
                color: categoryColor,
                backgroundColor: `${categoryColor}08`
              }}
              className="text-[9px] uppercase font-black px-2 py-0.5 rounded-lg border tracking-widest leading-none"
            >
              {prompt.category}
            </span>
            
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60">
              <Clock className="h-3.5 w-3.5" />
              <span>{getReadingTime(prompt.prompt)}</span>
            </div>
          </div>

          {/* Title & Desc */}
          <div className="flex-grow flex flex-col justify-start">
            <Link href={`/prompts/${prompt.id}`} className="block group/title">
              <h3 className="font-extrabold text-[0.98rem] leading-snug tracking-tight line-clamp-1 group-hover/title:text-primary transition-colors duration-300">
                {prompt.title}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground/70 line-clamp-2 mt-1.5 leading-relaxed font-semibold">
              {prompt.description}
            </p>
          </div>

          {/* Details row (Difficulty, Copies) */}
          <div className="flex items-center justify-between py-2 border-t border-border/10 text-[10px] font-bold flex-shrink-0">
            {/* Difficulty stars */}
            <div className="flex items-center gap-1.5" title={`Complexity: ${prompt.difficulty}/3`}>
              <span className="uppercase tracking-widest text-muted-foreground/50">Complexity</span>
              <div className="flex gap-1">{difficultyStars}</div>
            </div>

            {/* Copies count */}
            <div className="flex items-center gap-1 text-muted-foreground/75" title="Copies count">
              <Eye className="h-3.5 w-3.5 text-muted-foreground/45" />
              <span className="font-extrabold">
                {formatCopyCount(prompt.copyCount)} copies
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 border-t border-border/10 pt-3 flex-shrink-0">
            <CopyButton textToCopy={prompt.prompt} isPro={prompt.isPro} className="flex-1 text-[11px] font-extrabold" />
            
            <button
              onClick={handleShare}
              aria-label="Share prompt link"
              suppressHydrationWarning
              className={cn(
                "w-9.5 h-9.5 flex items-center justify-center rounded-xl",
                "bg-secondary/40 border border-border/20 text-muted-foreground hover:text-foreground hover:bg-secondary",
                "transition-all duration-300 active:scale-95"
              )}
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
