"use client";

import Link from "next/link";
import { Search, Compass, Cpu, Sparkles, ArrowRight, Heart, FolderHeart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const QUICK_ACTIONS = [
  {
    href: "/search",
    icon: Search,
    title: "Explore",
    desc: "10,000+ AI prompts",
    color: "text-brand",
    bg: "bg-brand/10 border-brand/20",
  },
  {
    href: "/category",
    icon: Compass,
    title: "Categories",
    desc: "40+ creative genres",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    href: "/models",
    icon: Cpu,
    title: "AI Models",
    desc: "Midjourney, Flux, ChatGPT",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
  },
  {
    href: "/profile?tab=favorites",
    icon: Heart,
    title: "Favorites",
    desc: "Saved prompts library",
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/20",
  },
  {
    href: "/profile?tab=collections",
    icon: FolderHeart,
    title: "Collections",
    desc: "Project folders",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
  {
    href: "/search?sort=newest",
    icon: Sparkles,
    title: "New Prompts",
    desc: "Fresh creative drops",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    href: "/search?sort=most-copied",
    icon: Star,
    title: "Top Rated",
    desc: "Most copied community picks",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
];

export function QuickActionCards() {
  return (
    <section className="py-8 sm:py-12 bg-[#08090d] border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1 block">Quick Access</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Explore PromptVerse Engine</h2>
        </div>

        {/* Grid: 2 columns on mobile, 3-4 on desktop with ~20% reduced height */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {QUICK_ACTIONS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center gap-2.5 p-3.5 rounded-xl bg-[#10131b]/90 border border-white/[0.1] hover:border-cyan-500/40 hover:bg-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", item.bg)}>
                    <Icon className={cn("h-4 w-4", item.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">{item.title}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground/75 truncate leading-tight">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
