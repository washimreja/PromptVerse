// AdSlot — Google AdSense ready component
// Reserved height prevents CLS (Cumulative Layout Shift = 0)
// Replace data-ad-* attributes with your real AdSense values

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type AdFormat = "leaderboard" | "rectangle" | "native";

interface AdSlotProps {
  format?: AdFormat;
  className?: string;
  adSlot?: string; // Your AdSense ad slot ID
  adClient?: string; // Your AdSense client ID (ca-pub-XXXXXXXX)
}

const FORMAT_HEIGHTS: Record<AdFormat, number> = {
  leaderboard: 90,
  rectangle: 250,
  native: 100,
};

export function AdSlot({
  format = "rectangle",
  className,
  adSlot,
  adClient,
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const minHeight = FORMAT_HEIGHTS[format];

  useEffect(() => {
    // Push ad only in production with real AdSense credentials
    if (process.env.NODE_ENV === "production" && adSlot && adClient) {
      try {
        // @ts-expect-error — adsbygoogle global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Silently ignore if AdSense not loaded
      }
    }
  }, [adSlot, adClient]);

  // Dev / no credentials — render reserved placeholder only
  if (!adSlot || !adClient || process.env.NODE_ENV !== "production") {
    return (
      <div
        className={cn(
          "w-full flex items-center justify-center",
          "bg-muted/40 border border-dashed border-border/60 rounded-xl",
          "text-xs text-muted-foreground/50 select-none",
          className
        )}
        style={{ minHeight }}
        aria-hidden="true"
      >
        {/* Ad slot placeholder — hidden from users, preserves layout */}
      </div>
    );
  }

  return (
    // Reserved height wrapper — CLS = 0
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{ minHeight }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
