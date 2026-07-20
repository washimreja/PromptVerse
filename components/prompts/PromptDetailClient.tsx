"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { SaveToCollectionModal } from "@/components/favorites/SaveToCollectionModal";
import type { Prompt } from "@/types";

interface PromptDetailClientProps {
  prompt: Prompt;
  isPremium: boolean;
}

export function PromptDetailClient({ prompt, isPremium }: PromptDetailClientProps) {
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: prompt.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!", { icon: "🔗", duration: 1800 });
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // user cancelled share
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center gap-3 flex-wrap"
      >
        {/* Save to favorites pill button */}
        <FavoriteButton
          promptId={prompt.id}
          promptTitle={prompt.title}
          variant="pill"
          showCollectionOnAdd
        />

        {/* Save to collection button */}
        <button
          onClick={() => setShowCollectionModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-secondary/40 border border-border/15 text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all duration-200 active:scale-95"
        >
          📁 Save to Collection
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 border",
            copied
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : "bg-secondary/40 border-border/15 text-muted-foreground hover:text-foreground hover:bg-secondary/70"
          )}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Share
            </>
          )}
        </button>

        {/* Stats */}
        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground/60 font-semibold">
          <span className="flex items-center gap-1">
            👁 {prompt.copyCount.toLocaleString()} views
          </span>
          {isPremium && (
            <span className="flex items-center gap-1.5 text-amber-400/80">
              🔒 PRO
            </span>
          )}
        </div>
      </motion.div>

      {showCollectionModal && (
        <SaveToCollectionModal
          promptId={prompt.id}
          promptTitle={prompt.title}
          isOpen={showCollectionModal}
          onClose={() => setShowCollectionModal(false)}
        />
      )}
    </>
  );
}
