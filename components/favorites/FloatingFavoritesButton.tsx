"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  const [isVisible, setIsVisible] = useState(true);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to start/reset the 5-second auto-hide timer
  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setIsVisible(true);

    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // Auto-hide after 5 seconds
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Whenever totalCount changes or component mounts with favorites > 0, trigger bump & reset 5s timer
  useEffect(() => {
    if (!mounted) return;

    if (totalCount > 0) {
      if (totalCount !== prevCount) {
        setBump(true);
        const t = setTimeout(() => setBump(false), 500);
        setPrevCount(totalCount);
        resetHideTimer();
        return () => clearTimeout(t);
      }
      resetHideTimer();
    } else {
      setIsVisible(false);
    }
    setPrevCount(totalCount);
  }, [totalCount, mounted, prevCount, resetHideTimer]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!mounted) return null;
  if (totalCount === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onMouseEnter={() => {
            // Keep visible on hover
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            setIsVisible(true);
          }}
          onMouseLeave={resetHideTimer}
          onClick={() => router.push("/favorites")}
          aria-label={`View ${totalCount} saved favorites`}
          className={cn(
            "fixed z-50 flex items-center gap-2 px-4 py-2.5 rounded-full",
            // Position: bottom-left on mobile (above mobile nav), bottom-right on desktop
            "left-4 bottom-24 md:left-auto md:right-[5.5rem] md:bottom-10",
            "bg-card/90 border border-rose-500/30 backdrop-blur-xl",
            "shadow-[0_8px_30px_rgba(244,63,94,0.3)]",
            "text-sm font-bold text-rose-400",
            "transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(244,63,94,0.5)]"
          )}
        >
          <motion.div
            animate={bump ? { scale: [1, 1.5, 0.85, 1.15, 1] } : {}}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
            {/* Pulse ring animation on count bump */}
            {bump && (
              <motion.span
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full bg-rose-500/50"
              />
            )}
          </motion.div>

          {/* Animated counter */}
          <AnimatePresence mode="wait">
            <motion.span
              key={totalCount}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="tabular-nums font-extrabold"
            >
              {totalCount}
            </motion.span>
          </AnimatePresence>

          <span className="text-xs text-rose-400/90 font-semibold hidden sm:inline">
            saved
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
