"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickActionItem {
  icon: string;
  titleFirst: string;
  titleHighlight: string;
  count: string;
  href: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  // Row 1
  { icon: "✨", titleFirst: "AI Image", titleHighlight: "Prompts", count: "80+ templates", href: "/category/photography" },
  { icon: "💬", titleFirst: "ChatGPT", titleHighlight: "Prompts", count: "45+ prompts", href: "/category/productivity" },
  { icon: "🎬", titleFirst: "Video", titleHighlight: "Prompts", count: "30+ prompts", href: "/category/cinematic" },
  // Row 2
  { icon: "🎨", titleFirst: "Midjourney", titleHighlight: "Style", count: "55+ templates", href: "/models/midjourney" },
  { icon: "📷", titleFirst: "Product", titleHighlight: "Photo", count: "25+ prompts", href: "/category/product-photography" },
  { icon: "📱", titleFirst: "Instagram", titleHighlight: "Content", count: "35+ prompts", href: "/category/instagram" },
  // Row 3
  { icon: "⚡", titleFirst: "Viral Reels", titleHighlight: "Ideas", count: "40+ prompts", href: "/category/reels" },
  { icon: "🧠", titleFirst: "Productivity", titleHighlight: "Hacks", count: "50+ prompts", href: "/category/productivity" },
  { icon: "🎯", titleFirst: "Logo", titleHighlight: "Design", count: "20+ templates", href: "/category/logo" },
];

export function QuickActionCards() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 22 } },
  };

  return (
    <div className="w-full py-6">
      {/* Label header */}
      <div className="text-center mb-6">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold bg-gold/10 border border-gold/10 px-2.5 py-1 rounded-full">
          Quick Launchpad
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto px-4"
      >
        {QUICK_ACTIONS.map((item) => (
          <motion.div key={item.titleFirst + item.titleHighlight} variants={itemVariants}>
            <Link
              href={item.href}
              className={cn(
                "group relative flex items-center gap-4 p-4 rounded-2xl",
                "bg-[#12131A]/95 border border-[#1a1b24] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.55)]",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-[2.5px] hover:bg-[#15161E]",
                "focus:outline-none focus:ring-1 focus:ring-[#22C55E]/30 overflow-hidden"
              )}
            >
              {/* V3.4 Premium Masked Corner Accents (Top-Right and Bottom-Left only) */}
              <div
                className="absolute inset-0 rounded-2xl border-[1.5px] border-[#22C55E]/20 group-hover:border-[#34D399]/65 transition-colors duration-300 pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(circle at top right, black 15%, transparent 60%)',
                  WebkitMaskImage: 'radial-gradient(circle at top right, black 15%, transparent 60%)'
                }}
              />
              <div
                className="absolute inset-0 rounded-2xl border-[1.5px] border-[#22C55E]/20 group-hover:border-[#34D399]/65 transition-colors duration-300 pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(circle at bottom left, black 15%, transparent 60%)',
                  WebkitMaskImage: 'radial-gradient(circle at bottom left, black 15%, transparent 60%)'
                }}
              />

              {/* V3.4 Soft Blurred Corner Glows (Top-Right and Bottom-Left only) */}
              <div className="absolute -top-7 -right-7 w-14 h-14 bg-[#22C55E]/10 group-hover:bg-[#22C55E]/22 rounded-full blur-[14px] transition-all duration-300 pointer-events-none -z-10" />
              <div className="absolute -bottom-7 -left-7 w-14 h-14 bg-[#22C55E]/10 group-hover:bg-[#22C55E]/22 rounded-full blur-[14px] transition-all duration-300 pointer-events-none -z-10" />

              {/* Icon frame */}
              <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center text-xl select-none transition-transform duration-300 group-hover:scale-105 flex-shrink-0 border border-border/10">
                {item.icon}
              </div>

              {/* Title & info text block (Mint Green Highlights) */}
              <div className="flex flex-col text-left">
                <span className="text-[12.5px] font-extrabold tracking-tight text-white/95 leading-normal">
                  {item.titleFirst}{" "}
                  <span className="text-[#34D399] font-black">{item.titleHighlight}</span>
                </span>
                <span className="text-[9.5px] font-bold text-muted-foreground/60 transition-colors">
                  {item.count}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
export default QuickActionCards;
