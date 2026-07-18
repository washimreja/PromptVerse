"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickActionItem {
  icon: string;
  label: string;
  count: string;
  href: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  // Row 1
  { icon: "✨", label: "AI Image Prompts", count: "80+ templates", href: "/category/photography" },
  { icon: "💬", label: "ChatGPT Prompts", count: "45+ prompts", href: "/category/productivity" },
  { icon: "🎬", label: "Video Prompts", count: "30+ prompts", href: "/category/cinematic" },
  // Row 2
  { icon: "🎨", label: "Midjourney Style", count: "55+ templates", href: "/models/midjourney" },
  { icon: "📷", label: "Product Photo", count: "25+ prompts", href: "/category/product-photography" },
  { icon: "📱", label: "Instagram Content", count: "35+ prompts", href: "/category/instagram" },
  // Row 3 (Balanced with 3 items)
  { icon: "⚡", label: "Viral Reels Ideas", count: "40+ prompts", href: "/category/reels" },
  { icon: "🧠", label: "Productivity Hacks", count: "50+ prompts", href: "/category/productivity" },
  { icon: "🎯", label: "Logo Design", count: "20+ templates", href: "/category/logo" },
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
          <motion.div key={item.label} variants={itemVariants}>
            <Link
              href={item.href}
              className={cn(
                "group relative flex items-center gap-4 p-4 rounded-2xl",
                "bg-card/45 border border-border/10 backdrop-blur-md",
                "transition-all duration-300",
                "hover:scale-[1.015] hover:bg-card/65",
                "focus:outline-none focus:ring-1 focus:ring-[#22C55E]/30"
              )}
            >
              {/* V3.2 Corner Accent Lighting Borders (Sharp, Premium corner lights) */}
              {/* Top Left */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-[1.75px] border-l-[1.75px] border-[#22C55E]/20 group-hover:border-[#34D399]/85 group-hover:shadow-[0_0_6px_rgba(52,211,153,0.3)] rounded-tl-2xl transition-all duration-300 pointer-events-none" />
              {/* Top Right */}
              <div className="absolute top-0 right-0 w-4 h-4 border-t-[1.75px] border-r-[1.75px] border-[#22C55E]/20 group-hover:border-[#34D399]/85 group-hover:shadow-[0_0_6px_rgba(52,211,153,0.3)] rounded-tr-2xl transition-all duration-300 pointer-events-none" />
              {/* Bottom Left */}
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[1.75px] border-l-[1.75px] border-[#22C55E]/20 group-hover:border-[#34D399]/85 group-hover:shadow-[0_0_6px_rgba(52,211,153,0.3)] rounded-bl-2xl transition-all duration-300 pointer-events-none" />
              {/* Bottom Right */}
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[1.75px] border-r-[1.75px] border-[#22C55E]/20 group-hover:border-[#34D399]/85 group-hover:shadow-[0_0_6px_rgba(52,211,153,0.3)] rounded-br-2xl transition-all duration-300 pointer-events-none" />

              {/* V3.2 Soft localized corner glows */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden -z-10">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#22C55E]/15 rounded-full blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#22C55E]/15 rounded-full blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#22C55E]/15 rounded-full blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#22C55E]/15 rounded-full blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Icon avatar frame */}
              <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-xl select-none transition-transform duration-300 group-hover:scale-105 flex-shrink-0 border border-border/10">
                {item.icon}
              </div>

              {/* Title & info text block */}
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-extrabold tracking-tight text-foreground leading-normal">
                  {item.label}
                </span>
                <span className="text-[9.5px] font-bold text-muted-foreground/60 group-hover:text-primary transition-colors">
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
