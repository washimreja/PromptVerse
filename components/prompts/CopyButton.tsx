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
  const { copied, copy } = useCopy({ successMessage: "Prompt copied successfully!" });
  const [animating, setAnimating] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAnimating(true);
    await copy(textToCopy);
    if (onCopySuccess) onCopySuccess();
    
    // Scale animation duration is 350ms
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy prompt text"}
      className={cn(
        "relative flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold",
        "transition-all duration-200 select-none",
        copied
          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
          : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/10",
        animating && "animate-copy-pop",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
