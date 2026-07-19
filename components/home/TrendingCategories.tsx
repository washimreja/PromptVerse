"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

const DISPLAY_CATEGORIES = CATEGORIES.slice(0, 18);

export function TrendingCategories() {
  const [active, setActive] = useState(DISPLAY_CATEGORIES[0].slug);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const activeCategory = DISPLAY_CATEGORIES.find((c) => c.slug === active) ?? DISPLAY_CATEGORIES[0];

  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      updateScrollState();
      el.addEventListener("scroll", updateScrollState, { passive: true });
      window.addEventListener("resize", updateScrollState);
      
      // Delay check in case layout shifts on initial render
      const timer = setTimeout(updateScrollState, 150);
      return () => {
        el.removeEventListener("scroll", updateScrollState);
        window.removeEventListener("resize", updateScrollState);
        clearTimeout(timer);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.6;
      const targetScroll = el.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      el.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (el && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };

  return (
    <section className="py-10 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-1">
            <span className="section-label">Browse by Theme</span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Popular Categories</h2>
          </div>
          <Link
            href="/category"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline underline-offset-3"
          >
            See all categories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Premium Horizontal Slider Wrapper */}
        <div className="relative group">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll Left"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border/30 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll Right"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border/30 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Slider Container */}
          <div
            ref={scrollContainerRef}
            onWheel={handleWheel}
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1 scroll-smooth select-none"
            style={{
              scrollBehavior: "smooth",
            }}
          >
            {DISPLAY_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActive(cat.slug)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold",
                  "transition-all duration-200 border cursor-pointer",
                  active === cat.slug
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_2px_12px_oklch(0.58_0.19_185_/_0.3)]"
                    : "bg-secondary/40 border-border/20 text-muted-foreground hover:bg-secondary/70 hover:text-foreground hover:border-border/40"
                )}
              >
                <span className="text-sm leading-none">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active category info */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeCategory.icon}</span>
            <div>
              <p className="text-sm font-bold">{activeCategory.name}</p>
              <p className="text-xs text-muted-foreground/60">{activeCategory.description}</p>
            </div>
          </div>
          <Link
            href={`/category/${active}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-secondary/50 border border-border/20 text-foreground hover:bg-secondary/80 hover:border-primary/20 hover:text-primary transition-all duration-200"
          >
            Browse {activeCategory.name}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
