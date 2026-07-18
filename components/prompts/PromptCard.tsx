"use client";

import Link from "next/link";
import { Sparkles, Copy, Share2, Eye, Clock, Check } from "lucide-react";
import { cn, formatCopyCount, getReadingTime } from "@/lib/utils";
import type { Prompt } from "@/types";
import { CopyButton } from "./CopyButton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

/** Generates a beautiful, responsive, organic SVG abstract background for V2 thumbnails.
 * Light/Dark responsive mesh and fluid shapes based on prompt color palette.
 */
export function SvgThumbnail({ prompt }: { prompt: Prompt }) {
  const colors = prompt.colorPalette || ["#6366F1", "#8B5CF6", "#EC4899"];
  const c1 = colors[0];
  const c2 = colors[1] || colors[0];
  const c3 = colors[2] || colors[0];

  // Dynamic geometric path based on title characters for unique visual fingerprint per card
  const seedVal = prompt.title.charCodeAt(0) + prompt.title.charCodeAt(prompt.title.length - 1);
  const pathType = seedVal % 4;

  let pathElement = null;

  if (pathType === 0) {
    // Wave paths
    pathElement = (
      <path
        d="M-20 60 C 40 20, 80 80, 140 40 C 200 0, 240 60, 300 30 L 300 200 L -20 200 Z"
        fill={`url(#grad-mesh-${prompt.id})`}
        opacity="0.85"
      />
    );
  } else if (pathType === 1) {
    // Diagonal shards
    pathElement = (
      <polygon
        points="-40,180 180,-40 320,100 100,320"
        fill={`url(#grad-mesh-${prompt.id})`}
        opacity="0.8"
      />
    );
  } else if (pathType === 2) {
    // Intersecting spheres
    pathElement = (
      <>
        <circle cx="80" cy="120" r="90" fill={`url(#grad-mesh-${prompt.id})`} opacity="0.85" />
        <circle cx="220" cy="60" r="70" fill={c3} opacity="0.3" style={{ mixBlendMode: 'screen' }} />
      </>
    );
  } else {
    // Blob meshes
    pathElement = (
      <path
        d="M-10,40 Q60,10 130,70 T280,100 L280,200 L-10,200 Z"
        fill={`url(#grad-mesh-${prompt.id})`}
        opacity="0.85"
      />
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center select-none group-hover:scale-[1.02] transition-transform duration-500">
      {/* Background base mesh */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-bg-${prompt.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#090A0F" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
          <linearGradient id={`grad-mesh-${prompt.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="50%" stopColor={c2} />
            <stop offset="100%" stopColor={c3} />
          </linearGradient>
          <pattern id={`dot-pat-${prompt.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.08" />
          </pattern>
        </defs>

        {/* Base dark gradient */}
        <rect width="100%" height="100%" fill={`url(#grad-bg-${prompt.id})`} />

        {/* Dot patterns */}
        <rect width="100%" height="100%" fill={`url(#dot-pat-${prompt.id})`} />

        {/* Dynamic mesh shape */}
        {pathElement}

        {/* Gloss highlight */}
        <path d="M-10,-10 L300,100 L300,-10 Z" fill="white" fillOpacity="0.03" />
      </svg>

      {/* Model overlay watermark */}
      <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase text-white/80">
        {prompt.model}
      </div>

      {/* Aesthetic layout icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg flex items-center justify-center opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
        <Sparkles className="h-5 w-5 text-white/40 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}

export function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  const [copyAnim, setCopyAnim] = useState(false);

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
        // Ignored or fallback
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!", { duration: 1500 });
    }
  };

  const difficultyStars = Array.from({ length: 3 }).map((_, i) => (
    <span
      key={i}
      className={cn(
        "w-1.5 h-1.5 rounded-full transition-all duration-200",
        i < prompt.difficulty
          ? "bg-primary shadow-[0_0_6px_var(--color-primary)]"
          : "bg-muted-foreground/30"
      )}
    />
  ));

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4), ease: "easeOut" }}
      className="group relative flex flex-col w-full h-[400px] rounded-3xl bg-card border border-border shadow-sm overflow-hidden card-hover"
    >
      {/* ── Image/Preview container ── */}
      <Link
        href={`/prompts/${prompt.id}`}
        className="relative block h-[180px] w-full overflow-hidden border-b border-border flex-shrink-0"
      >
        <SvgThumbnail prompt={prompt} />
      </Link>

      {/* ── Info Container ── */}
      <div className="flex flex-col flex-grow p-5 justify-between">
        
        {/* Badges/Category */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <Badge
            variant="outline"
            className="rounded-lg text-[10px] uppercase font-semibold px-2 py-0.5 tracking-wider border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            {prompt.category}
          </Badge>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
            <Clock className="h-3.5 w-3.5" />
            <span>{getReadingTime(prompt.prompt)}</span>
          </div>
        </div>

        {/* Title & Desc */}
        <div className="flex-grow flex flex-col justify-start">
          <Link href={`/prompts/${prompt.id}`} className="block group/title">
            <h3 className="font-bold text-[1.05rem] leading-snug tracking-tight line-clamp-1 group-hover/title:text-primary transition-colors">
              {prompt.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
            {prompt.description}
          </p>
        </div>

        {/* Details row (Difficulty, Copies) */}
        <div className="flex items-center justify-between py-2.5 border-t border-border/40 mt-3 text-xs flex-shrink-0">
          {/* Difficulty dots */}
          <div className="flex items-center gap-1.5" title={`Difficulty: ${prompt.difficulty}/3`}>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Diff</span>
            <div className="flex gap-1">{difficultyStars}</div>
          </div>

          {/* Copies count */}
          <div className="flex items-center gap-1" title="Copies count">
            <Eye className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="font-medium text-muted-foreground/80">
              {formatCopyCount(prompt.copyCount)} copies
            </span>
          </div>
        </div>

        {/* Action Bottom Row */}
        <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3 flex-shrink-0">
          <CopyButton textToCopy={prompt.prompt} className="flex-1 py-2.5 rounded-xl shadow-sm text-xs font-bold" />
          
          <button
            onClick={handleShare}
            aria-label="Share prompt link"
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-xl",
              "bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-accent",
              "transition-all duration-200"
            )}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
