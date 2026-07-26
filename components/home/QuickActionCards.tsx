"use client";

import Link from "next/link";
import { Search, Compass, Cpu, Library, Sparkles, ArrowRight, Heart, FolderHeart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const QUICK_ACTIONS = [
  {
    href: "/search",
    icon: Search,
    title: "Explore All Prompts",
    desc: "10,000+ AI prompts across all categories",
    color: "text-brand",
    bg: "bg-brand/10 border-brand/20",
  },
  {
    href: "/category",
    icon: Compass,
    title: "Categories",
    desc: "40+ specialized creative genres",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    href: "/models",
    icon: Cpu,
    title: "AI Models",
    desc: "Midjourney, Flux, Stable Diffusion & ChatGPT",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
  },
  {
    href: "/profile?tab=favorites",
    icon: Heart,
    title: "Favorites",
    desc: "Your saved prompts library",
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/20",
  },
  {
    href: "/profile?tab=collections",
    icon: FolderHeart,
    title: "Collections",
    desc: "Organized project folders",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
  {
    href: "/search?sort=newest",
    icon: Sparkles,
    title: "New Prompts",
    desc: "Fresh creative drops added daily",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    href: "/search?sort=most-copied",
    icon: Star,
    title: "Top Rated",
    desc: "Most copied and community verified",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
];

export function QuickActionCards() {
  return (
    <section className="py-16 bg-[#040508] border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-black uppercase tracking-widest text-brand mb-2 block">Quick Access</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Explore PromptVerse Engine</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Direct launchpad to all core creative tools</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center gap-4 p-4.5 rounded-2xl bg-[#090a0f] border border-white/5 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110", item.bg)}>
                    <Icon className={cn("h-6 w-6", item.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{item.title}</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
