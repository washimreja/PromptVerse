"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCopy } from "@/hooks/useCopy";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  onCopySuccess?: () => void;
}

export function CopyButton({
  textToCopy,
  className,
  onCopySuccess,
}: CopyButtonProps) {
  const { copied, copy } = useCopy({ successMessage: "Prompt copied to clipboard!" });
  const [animating, setAnimating] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAnimating(true);
    await copy(textToCopy);
    if (onCopySuccess) onCopySuccess();
    
    // Scale animation duration is 400ms
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy prompt text"}
      className={cn(
        "relative flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold w-full overflow-hidden transition-all duration-300 active:scale-[0.97] select-none",
        copied
          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400/20"
          : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_4px_15px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.45)] border border-white/10 hover:brightness-105",
        animating && "animate-copy-pop",
        className
      )}
    >
      {/* Sparkles glow lines overlay */}
      <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {copied ? (
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
