"use client";

import Link from "next/link";
import { Eye, Copy, Check, Lock } from "lucide-react";
import { cn, formatCopyCount } from "@/lib/utils";
import type { Prompt } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, AI_MODELS } from "@/lib/constants";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { useSession } from "next-auth/react";
import { useUpgradeModal } from "@/components/modals/UpgradeToProModal";

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
  /** "grid" = normal grid card | "carousel" = wider card for horizontal carousels */
  variant?: "grid" | "carousel";
}

/* ── Rich SVG Thumbnail ──────────────────────── */
export function SvgThumbnail({ prompt }: { prompt: Prompt }) {
  const colors = prompt.colorPalette || ["#6366F1", "#8B5CF6", "#EC4899"];
  const c1 = colors[0];
  const c2 = colors[1] || colors[0];
  const c3 = colors[2] || colors[0];
  const id = prompt.id;

  const seed = prompt.title.charCodeAt(0) + prompt.title.charCodeAt(prompt.title.length - 1);
  const shape = seed % 4;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`bg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#050508" />
            <stop offset="100%" stopColor="#100d20" />
          </linearGradient>
          <linearGradient id={`mesh-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="50%" stopColor={c2} />
            <stop offset="100%" stopColor={c3} />
          </linearGradient>
          <pattern id={`dot-${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="white" fillOpacity="0.055" />
          </pattern>
          <filter id={`blur-${id}`}>
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill={`url(#bg-${id})`} />
        <rect width="100%" height="100%" fill={`url(#dot-${id})`} />

        {/* Glow orb */}
        <ellipse
          cx="50%"
          cy="42%"
          rx="60%"
          ry="60%"
          fill={c1}
          fillOpacity="0.22"
          filter={`url(#blur-${id})`}
        />

        {/* Shape */}
        {shape === 0 && (
          <path d="M-20 60 C 40 10, 90 90, 150 30 C 210 -10, 250 80, 320 20 L 320 200 L -20 200 Z"
            fill={`url(#mesh-${id})`} opacity="0.75" />
        )}
        {shape === 1 && (
          <polygon points="-40,160 160,-40 340,120 120,340"
            fill={`url(#mesh-${id})`} opacity="0.7" />
        )}
        {shape === 2 && (
          <>
            <circle cx="50%" cy="45%" r="110" fill={`url(#mesh-${id})`} opacity="0.75" />
            <circle cx="75%" cy="20%" r="70" fill={c3} opacity="0.20" />
          </>
        )}
        {shape === 3 && (
          <path d="M-10,30 Q80,0 150,80 T300,90 L300,200 L-10,200 Z"
            fill={`url(#mesh-${id})`} opacity="0.75" />
        )}
      </svg>

      {/* Hover zoom effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent group-hover:from-black/5 transition-all duration-500" />
    </div>
  );
}

/* ── Copy Button ─────────────────────────────── */
function CardCopyButton({ text, isPro }: { text: string; isPro?: boolean }) {
  const { data: session } = useSession();
  const { openUpgradeModal } = useUpgradeModal();
  const user = session?.user as any;
  const userIsPro = user?.membership === "PRO" || user?.role === "ADMIN";

  const isLocked = isPro && !userIsPro;
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLocked) {
      toast("PromptVerse Pro", {
        description: "Subscribe to unlock premium PRO prompts!",
        icon: "🔒",
        duration: 3000,
      });
      openUpgradeModal();
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Prompt copied!", { duration: 1500 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.9 }}
      suppressHydrationWarning
      aria-label={isLocked ? "Unlock Pro Prompt" : copied ? "Copied" : "Copy prompt"}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold",
        "backdrop-blur-md border transition-all duration-200 shadow-sm",
        isLocked
          ? "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
          : copied
          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 glow-brand shadow-emerald-500/20"
          : "bg-black/30 border-white/10 text-white hover:bg-black/60 hover:border-white/25 hover:text-white"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isLocked ? "lock" : copied ? "check" : "copy"}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {isLocked ? <Lock className="h-3 w-3 text-amber-400" /> : copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </motion.span>
      </AnimatePresence>
      {isLocked ? "Unlock" : copied ? "Copied!" : "Copy"}
    </motion.button>
  );
}

/* FavoriteButton is now imported from @/components/favorites/FavoriteButton */

/* ── Main Prompt Card ────────────────────────── */
export function PromptCard({ prompt, index = 0, variant = "grid" }: PromptCardProps) {
  const model = AI_MODELS.find((m) => m.slug === prompt.model);

  const cardWidth = variant === "carousel"
    ? "w-44 sm:w-52 md:w-56 flex-shrink-0"
    : "w-full";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cardWidth}
    >
      <Link
        href={`/prompts/${prompt.id}`}
        className="block group relative rounded-xl overflow-hidden bg-card border border-border/[0.07] premium-card"
        style={{ aspectRatio: "3/4" }}
        aria-label={`View prompt: ${prompt.title}`}
      >
        {/* ── Thumbnail ── */}
        {prompt.previewImage && !prompt.previewImage.endsWith(".svg") ? (
          <img
            src={prompt.previewImage}
            alt={prompt.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <SvgThumbnail prompt={prompt} />
        )}

        {/* ── Hover scale overlay ── */}
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03] pointer-events-none" />

        {/* ── Bottom gradient vignette ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

        {/* ── TOP-LEFT: Title pill ── */}
        <div className="absolute top-3 left-3 right-16 flex items-start z-10 pointer-events-none">
          <span
            className={cn(
              "text-[11px] font-black text-white/95 tracking-wide leading-tight",
              "drop-shadow-md line-clamp-2 text-balance"
            )}
          >
            {prompt.title}
          </span>
        </div>

        {/* ── TOP-RIGHT: Favorite & PRO Badge ── */}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5 z-10">
          <div className="flex items-center gap-1.5">
            {prompt.isPro && (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-gold text-black shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
                PRO
              </span>
            )}
            <FavoriteButton promptId={prompt.id} promptTitle={prompt.title} />
          </div>
          {/* View count chip */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10">
            <Eye className="h-2.5 w-2.5 text-white/70" />
            <span className="text-[9px] font-semibold text-white/80">{formatCopyCount(prompt.copyCount)}</span>
          </div>
        </div>

        {/* ── BOTTOM overlays ── */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 flex items-end justify-between gap-2 z-10">
          {/* Copy button + Model badge */}
          <div className="flex flex-col gap-1.5 items-start">
            {/* AI Model badge */}
            {model && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/15 shadow-sm">
                <span className="text-[9px] leading-none drop-shadow-md">{model.icon}</span>
                <span className="text-[9px] font-black text-white/90 tracking-wider uppercase">{model.name}</span>
              </div>
            )}
            {/* Copy button */}
            <CardCopyButton text={prompt.prompt} isPro={prompt.isPro} />
          </div>

          {/* Creator badge */}
          <div className="text-[8px] font-semibold text-white/35 self-end pb-0.5 tracking-wide">
            by PromptVerse
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
