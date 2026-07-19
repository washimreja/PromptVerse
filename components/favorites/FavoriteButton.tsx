"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFavorites } from "./FavoritesContext";
import { SaveToCollectionModal } from "./SaveToCollectionModal";

interface FavoriteButtonProps {
  promptId: string;
  promptTitle?: string;
  /** "icon" = icon-only rounded button | "pill" = with text */
  variant?: "icon" | "pill";
  className?: string;
  showCollectionOnAdd?: boolean;
}

export function FavoriteButton({
  promptId,
  promptTitle = "",
  variant = "icon",
  className,
  showCollectionOnAdd = false,
}: FavoriteButtonProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const [showModal, setShowModal] = useState(false);
  const [animating, setAnimating] = useState(false);
  const faved = isFavorited(promptId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);

    if (showCollectionOnAdd && !faved) {
      setShowModal(true);
    } else {
      toggleFavorite(promptId, promptTitle);
    }
  };

  if (variant === "pill") {
    return (
      <>
        <button
          onClick={handleClick}
          aria-label={faved ? "Remove from favorites" : "Save to favorites"}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold",
            "transition-all duration-200 active:scale-95 border",
            faved
              ? "bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25"
              : "bg-secondary/50 border-border/20 text-foreground hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20",
            className
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={faved ? "faved" : "unfaved"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  faved && "fill-rose-500 text-rose-500"
                )}
              />
            </motion.span>
          </AnimatePresence>
          {faved ? "Saved" : "Save"}
        </button>
        {showModal && (
          <SaveToCollectionModal
            promptId={promptId}
            promptTitle={promptTitle}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={faved ? "Remove from favorites" : "Save to favorites"}
        className={cn(
          "w-7 h-7 flex items-center justify-center rounded-full",
          "backdrop-blur-md border transition-all duration-200",
          faved
            ? "bg-rose-500/25 border-rose-500/40"
            : "bg-black/40 border-white/10 hover:bg-black/60",
          className
        )}
      >
        <motion.div
          animate={animating ? { scale: [1, 1.4, 0.85, 1.1, 1] } : {}}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-all duration-200",
              faved ? "fill-rose-500 text-rose-500" : "text-white/80"
            )}
          />
        </motion.div>
      </button>
      {showModal && (
        <SaveToCollectionModal
          promptId={promptId}
          promptTitle={promptTitle}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
