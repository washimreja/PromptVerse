"use client";

import Link from "next/link";
import { Eye, Copy, Check, Lock, Crown } from "lucide-react";
import { cn, formatCopyCount } from "@/lib/utils";
import type { Prompt } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AI_MODELS } from "@/lib/constants";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { useSession } from "next-auth/react";
import { useUpgradeModal } from "@/components/modals/UpgradeToProModal";
import { copyProPromptAction } from "@/app/actions/user";
import { useRouter } from "next/navigation";

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
    </div>
  );
}

/* ── Copy Button ─────────────────────────────── */
/**
 * For FREE prompts: copies `text` directly (always populated from listing data).
 * For PRO prompts: calls copyProPromptAction(promptId) server action — membership
 * is verified on the SERVER from the DB before any text is returned.
 * The `text` prop is intentionally empty ("") for PRO prompts on listing pages.
 */
function CardCopyButton({
  promptId,
  text,
  accessLevel,
}: {
  promptId: string;
  text: string;
  accessLevel: "FREE" | "PRO";
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPro = accessLevel === "PRO";

  const isUserPro =
    (session?.user as any)?.membership === "PRO" ||
    (session?.user as any)?.membership === "LIFETIME" ||
    (session?.user as any)?.role === "ADMIN";

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Case 1: PRO prompt, FREE user → redirect to pricing
    if (isPro && !isUserPro) {
      router.push("/pricing");
      return;
    }

    // Case 2: PRO prompt, PRO user → call server action for text
    if (isPro && isUserPro) {
      setLoading(true);
      try {
        const result = await copyProPromptAction(promptId);
        if (!result.success) {
          // Server denied — shouldn't happen for valid PRO user, but handle gracefully
          if (result.error === "UNAUTHENTICATED") {
            toast.error("Please sign in to copy this prompt.");
          } else {
            toast.error("PRO subscription required.");
            router.push('/pricing');
          }
          return;
        }
        await navigator.clipboard.writeText(result.text);
        setCopied(true);
        toast.success("Prompt copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Case 3: FREE prompt → copy directly (text is already in listing data)
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={loading}
      className={cn(
        "relative flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 z-20",
        isPro && !isUserPro
          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
          : copied
          ? "bg-emerald-500/90 text-white shadow-emerald-500/20"
          : "bg-black/60 hover:bg-brand hover:text-brand-foreground text-white border border-white/10 backdrop-blur-md"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span key="loading" className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          </motion.span>
        ) : copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1"
          >
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Copied!</span>
          </motion.span>
        ) : isPro && !isUserPro ? (
          <motion.span key="pro" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Pro Prompt</span>
          </motion.span>
        ) : (
          <motion.span key="copy" className="flex items-center gap-1">
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function PromptCard({ prompt, index = 0, variant = "grid" }: PromptCardProps) {
  const { data: session } = useSession();
  const model = AI_MODELS.find((m) => m.slug === prompt.model);
  const cardWidth = variant === "carousel" ? "w-[240px] sm:w-[280px] flex-shrink-0" : "w-full";

  const isPro = prompt.accessLevel === "PRO";
  const isUserPro =
    (session?.user as any)?.membership === "PRO" ||
    (session?.user as any)?.membership === "LIFETIME" ||
    (session?.user as any)?.role === "ADMIN";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.04, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cardWidth}
    >
      <Link
        href={`/prompts/${prompt.id}`}
        className="block group relative rounded-2xl overflow-hidden bg-[#090a0f] border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
        style={{ aspectRatio: "3/4" }}
        aria-label={`View prompt: ${prompt.title}`}
      >
        {/* ── Thumbnail Image ── */}
        {prompt.previewImage && !prompt.previewImage.endsWith(".svg") ? (
          <img
            src={prompt.previewImage}
            alt={prompt.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <SvgThumbnail prompt={prompt} />
        )}

        {/* ── Vignette Overlays ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none group-hover:from-black/90 transition-colors duration-300" />

        {/* ── TOP BADGES ── */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            {isPro && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 text-black shadow-md border border-amber-200 shrink-0">
                {isUserPro ? (
                  <Crown className="w-2.5 h-2.5 fill-black shrink-0" />
                ) : (
                  <Lock className="w-2.5 h-2.5 fill-black shrink-0" />
                )}
                <span className="whitespace-nowrap">{isUserPro ? "PRO" : "LOCKED"}</span>
              </span>
            )}
            {isPro && !isUserPro && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-black/60 text-amber-400 border border-amber-500/30 backdrop-blur-md shrink-0">
                <span>⭐ Premium</span>
              </span>
            )}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 text-[10px] font-semibold shrink-0">
              <Eye className="h-3 w-3 text-cyan-400 shrink-0" />
              <span className="whitespace-nowrap">{formatCopyCount(prompt.copyCount)}</span>
            </div>
          </div>

          <div className="pointer-events-auto">
            <FavoriteButton promptId={prompt.id} promptTitle={prompt.title} />
          </div>
        </div>

        {/* ── BOTTOM CONTENT ── */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2.5 z-10">
          <h3 className="text-xs font-bold text-white leading-snug line-clamp-2 drop-shadow-md group-hover:text-cyan-300 transition-colors">
            {prompt.title}
          </h3>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
            {/* Model Badge */}
            {model && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
                <span className="text-[10px]">{model.icon}</span>
                <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">{model.name}</span>
              </div>
            )}

            {/* Copy Button */}
            <CardCopyButton
              promptId={prompt.id}
              text={prompt.prompt}
              accessLevel={prompt.accessLevel}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
