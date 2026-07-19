"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFavorites } from "./FavoritesContext";

export function FloatingFavoritesButton() {
  const router = useRouter();
  const { totalCount } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (totalCount > prevCount) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 500);
      setPrevCount(totalCount);
      return () => clearTimeout(t);
    }
    setPrevCount(totalCount);
  }, [totalCount, mounted, prevCount]);

  if (!mounted) return null;
  // Only show when there are favorites
  if (totalCount === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => router.push("/favorites")}
      aria-label={`View ${totalCount} saved favorites`}
      className={cn(
        "fixed z-50 flex items-center gap-2 px-4 py-2.5 rounded-full",
        // Position: above mobile nav on mobile, bottom-right on desktop
        "left-4 bottom-24 md:left-auto md:right-[5.5rem] md:bottom-10",
        "bg-card/90 border border-rose-500/25 backdrop-blur-xl",
        "shadow-[0_8px_30px_rgba(244,63,94,0.25)]",
        "text-sm font-bold text-rose-400",
        "transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(244,63,94,0.40)]"
      )}
    >
      <motion.div
        animate={bump ? { scale: [1, 1.5, 0.85, 1.15, 1] } : {}}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative"
      >
        <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
        {/* Pulse ring on bump */}
        {bump && (
          <motion.span
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full bg-rose-500/50"
          />
        )}
      </motion.div>

      {/* Count badge with animation */}
      <AnimatePresence mode="wait">
        <motion.span
          key={totalCount}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="tabular-nums"
        >
          {totalCount}
        </motion.span>
      </AnimatePresence>

      <span className="text-xs text-rose-400/80 hidden sm:inline">saved</span>
    </motion.button>
  );
}
