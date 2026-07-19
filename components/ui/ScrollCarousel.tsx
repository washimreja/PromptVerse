"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollCarouselProps {
  children: React.ReactNode;
  className?: string;
  gap?: number; // gap between items in px
  leftSidebar?: React.ReactNode; // optional left sidebar (like FeaturedPrompts)
}

export function ScrollCarousel({
  children,
  className,
  gap = 16,
  leftSidebar,
}: ScrollCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    // Scroll by 80% of the visible width
    const amount = el.clientWidth * 0.8 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      {leftSidebar ? (
        <div className="flex gap-0">
          {/* Left Sidebar */}
          <div className="hidden lg:flex flex-col justify-center flex-shrink-0 w-52 xl:w-64 pr-6">
            {leftSidebar}
          </div>
          {/* Carousel + Arrows Wrapper */}
          <div className="relative flex-1 min-w-0">
            <CarouselTrack
              ref={trackRef}
              gap={gap}
              canScrollLeft={canScrollLeft}
              canScrollRight={canScrollRight}
              onScrollLeft={() => scrollBy(-1)}
              onScrollRight={() => scrollBy(1)}
            >
              {children}
            </CarouselTrack>
          </div>
        </div>
      ) : (
        <CarouselTrack
          ref={trackRef}
          gap={gap}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={() => scrollBy(-1)}
          onScrollRight={() => scrollBy(1)}
        >
          {children}
        </CarouselTrack>
      )}
    </div>
  );
}

/* ── Inner carousel track with arrows ─────── */
interface CarouselTrackProps {
  children: React.ReactNode;
  gap: number;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const CarouselTrack = ({
  ref,
  children,
  gap,
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}: CarouselTrackProps & { ref: React.Ref<HTMLDivElement> }) => {
  return (
    <div className="relative group/carousel">
      {/* Left Arrow */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            key="left-arrow"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.15 }}
            onClick={onScrollLeft}
            aria-label="Scroll left"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-20",
              "-translate-x-4",
              "w-9 h-9 rounded-full flex items-center justify-center",
              "bg-card/90 border border-border/30 backdrop-blur-md",
              "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
              "shadow-lg transition-all duration-200",
              "opacity-0 group-hover/carousel:opacity-100"
            )}
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Right Arrow */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            key="right-arrow"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            onClick={onScrollRight}
            aria-label="Scroll right"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-20",
              "translate-x-4",
              "w-9 h-9 rounded-full flex items-center justify-center",
              "bg-card/90 border border-border/30 backdrop-blur-md",
              "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
              "shadow-lg transition-all duration-200",
              "opacity-0 group-hover/carousel:opacity-100"
            )}
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fade edge masks */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />
      )}

      {/* Scrollable Track */}
      <div
        ref={ref}
        className="carousel-track"
        style={{ gap: `${gap}px` }}
      >
        {children}
      </div>
    </div>
  );
};
