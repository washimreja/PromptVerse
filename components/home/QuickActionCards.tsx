"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickActionItem {
  icon: string;
  label: string;
  count: string;
  href: string;
  color: string; // for custom border/shadow gradients
}

const QUICK_ACTIONS: QuickActionItem[] = [
  { icon: "✨", label: "AI Image Prompts", count: "80+ templates", href: "/category/photography", color: "from-[#22C55E]/10 to-[#34D399]/10" },
  { icon: "💬", label: "ChatGPT Prompts", count: "45+ prompts", href: "/category/productivity", color: "from-[#22C55E]/10 to-[#34D399]/10" },
  { icon: "🎬", label: "Video Prompts", count: "30+ prompts", href: "/category/cinematic", color: "from-[#22C55E]/10 to-[#34D399]/10" },
  { icon: "🎨", label: "Midjourney Style", count: "55+ templates", href: "/models/midjourney", color: "from-[#22C55E]/10 to-[#34D399]/10" },
  { icon: "📷", label: "Product Photo", count: "25+ prompts", href: "/category/product-photography", color: "from-[#22C55E]/10 to-[#34D399]/10" },
  { icon: "📱", label: "Instagram Content", count: "35+ prompts", href: "/category/instagram", color: "from-[#22C55E]/10 to-[#34D399]/10" },
  { icon: "⚡", label: "Viral Reels Ideas", count: "40+ prompts", href: "/category/reels", color: "from-[#22C55E]/10 to-[#34D399]/10" },
  { icon: "🧠", label: "Productivity Hacks", count: "50+ prompts", href: "/category/productivity", color: "from-[#22C55E]/10 to-[#34D399]/10" },
];

export function QuickActionCards() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 20 } },
  };

  return (
    <div className="w-full py-8">
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
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 max-w-7xl mx-auto px-4"
      >
        {QUICK_ACTIONS.map((item) => (
          <motion.div key={item.label} variants={itemVariants}>
            <Link
              href={item.href}
              className={cn(
                "group relative flex flex-col items-center justify-between p-3.5 h-28 rounded-2xl",
                "bg-card/45 border border-border/10 backdrop-blur-md",
                "text-center transition-all duration-300",
                "hover:scale-[1.03] hover:border-border/10 hover:bg-card/70",
                "focus:outline-none focus:ring-1 focus:ring-[#22C55E]/40",
                "shine overflow-hidden"
              )}
            >
              {/* V3.2 Corner Accent Soft Glow Background */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden -z-10">
                {/* Top Left Glow */}
                <div className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-gradient-to-br from-[#22C55E]/20 to-[#34D399]/0 rounded-full blur-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Top Right Glow */}
                <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-gradient-to-bl from-[#22C55E]/20 to-[#34D399]/0 rounded-full blur-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Bottom Left Glow */}
                <div className="absolute -bottom-2.5 -left-2.5 w-6 h-6 bg-gradient-to-tr from-[#22C55E]/20 to-[#34D399]/0 rounded-full blur-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Bottom Right Glow */}
                <div className="absolute -bottom-2.5 -right-2.5 w-6 h-6 bg-gradient-to-tl from-[#22C55E]/20 to-[#34D399]/0 rounded-full blur-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* V3.2 Corner Accent Borders */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none">
                {/* Top Left Corner */}
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-[1.5px] border-l-[1.5px] border-[#22C55E]/20 group-hover:border-[#34D399]/70 rounded-tl-2xl transition-colors duration-300" />
                {/* Top Right Corner */}
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-[1.5px] border-r-[1.5px] border-[#22C55E]/20 group-hover:border-[#34D399]/70 rounded-tr-2xl transition-colors duration-300" />
                {/* Bottom Left Corner */}
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-[1.5px] border-l-[1.5px] border-[#22C55E]/20 group-hover:border-[#34D399]/70 rounded-bl-2xl transition-colors duration-300" />
                {/* Bottom Right Corner */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-[1.5px] border-r-[1.5px] border-[#22C55E]/20 group-hover:border-[#34D399]/70 rounded-br-2xl transition-colors duration-300" />
              </div>

              {/* Backside soft centered glow */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-20",
                item.color
              )} />

              <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300 select-none">
                {item.icon}
              </span>
              
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-extrabold tracking-tight text-foreground line-clamp-1 leading-snug">
                  {item.label}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground/60 group-hover:text-primary transition-colors">
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
