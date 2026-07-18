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
  { icon: "✨", label: "AI Image Prompts", count: "80+ templates", href: "/category/photography", color: "from-indigo-500/20 to-purple-500/20" },
  { icon: "💬", label: "ChatGPT Prompts", count: "45+ prompts", href: "/category/productivity", color: "from-emerald-500/20 to-teal-500/20" },
  { icon: "🎬", label: "Video Prompts", count: "30+ prompts", href: "/category/cinematic", color: "from-pink-500/20 to-rose-500/20" },
  { icon: "🎨", label: "Midjourney Style", count: "55+ templates", href: "/models/midjourney", color: "from-blue-500/20 to-cyan-500/20" },
  { icon: "📷", label: "Product Photo", count: "25+ prompts", href: "/category/product-photography", color: "from-amber-500/20 to-orange-500/20" },
  { icon: "📱", label: "Instagram Content", count: "35+ prompts", href: "/category/instagram", color: "from-purple-500/20 to-pink-500/20" },
  { icon: "⚡", label: "Viral Reels Ideas", count: "40+ prompts", href: "/category/reels", color: "from-red-500/20 to-yellow-500/20" },
  { icon: "🧠", label: "Productivity Hacks", count: "50+ prompts", href: "/category/productivity", color: "from-teal-500/20 to-blue-500/20" },
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
                "bg-card/40 border border-border/25 backdrop-blur-md",
                "text-center transition-all duration-300",
                "hover:scale-[1.03] hover:border-foreground/20 hover:bg-card/75",
                "focus:outline-none focus:ring-1 focus:ring-primary/40",
                "shine overflow-hidden"
              )}
            >
              {/* Backside glow */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10",
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
