"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCopy } from "@/hooks/useCopy";
import { toast } from "sonner";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  isPro?: boolean;
  onCopySuccess?: () => void;
}

export function CopyButton({
  textToCopy,
  className,
  isPro,
  onCopySuccess,
}: CopyButtonProps) {
  const { copied, copy } = useCopy({ successMessage: "Prompt copied to clipboard!" });
  const [animating, setAnimating] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPro) {
      toast("PromptVerse Pro", {
        description: "Subscribe to unlock premium AI prompts!",
        icon: "🔒",
        duration: 3000,
      });
      return;
    }

    setAnimating(true);
    await copy(textToCopy);
    if (onCopySuccess) onCopySuccess();
    
    // Scale animation duration is 400ms
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={isPro ? "Unlock Pro Prompt" : (copied ? "Copied" : "Copy prompt text")}
      suppressHydrationWarning
      className={cn(
        "relative flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold w-full overflow-hidden transition-all duration-300 active:scale-[0.97] select-none",
        isPro
          ? "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-[0_4px_15px_rgba(245,158,11,0.22)] border border-amber-400/20 hover:brightness-105"
          : (copied
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400/20"
              : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.45)] border border-white/10 hover:brightness-105"),
        animating && "animate-copy-pop",
        className
      )}
    >
      {/* Sparkles glow lines overlay */}
      <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {isPro ? (
        <>
          <span className="text-[11px] tracking-wide flex items-center gap-1.5 font-extrabold uppercase">
            <span>🔒</span> Unlock Pro
          </span>
        </>
      ) : copied ? (
        <>
          <Check className="h-4 w-4 stroke-[3] animate-scale-in" />
          <span className="tracking-wide">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span className="tracking-wide">Copy Prompt</span>
        </>
      )}
    </button>
  );
}
export default CopyButton;
