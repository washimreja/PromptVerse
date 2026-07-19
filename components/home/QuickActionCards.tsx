"use client";

import Link from "next/link";
import { Search, Compass, Cpu, Library, BookOpen, ArrowRight, Sparkles, Image, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const EXPLORE_ITEMS = [
  {
    href: "/search",
    icon: Search,
    title: "Browse All Prompts",
    desc: "250+ AI prompts across all styles",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    href: "/category",
    icon: Compass,
    title: "Explore Categories",
    desc: "40+ themed prompt collections",
    color: "text-gold",
    bg: "bg-gold/10",
  },
  {
    href: "/models",
    icon: Cpu,
    title: "Browse AI Models",
    desc: "13 AI tools, one library",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    href: "/saved",
    icon: Heart,
    title: "Saved Prompts",
    desc: "Your bookmarked collection",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  {
    href: "/search?sort=newest",
    icon: Sparkles,
    title: "Newest Prompts",
    desc: "Fresh additions daily",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    href: "/search?sort=most-copied",
    icon: Library,
    title: "Most Popular",
    desc: "Community favorites",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

export function QuickActionCards() {
  return (
    <section className="py-12 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="space-y-1.5 mb-7">
          <span className="section-label">Quick Access</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Explore More</h2>
          <p className="text-xs text-muted-foreground/60">Everything you need for AI prompt creation</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXPLORE_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-4 p-4 rounded-xl",
                    "bg-card border border-border/[0.08]",
                    "hover:border-border/25 hover:shadow-md hover:-translate-y-0.5",
                    "transition-all duration-300"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", item.bg)}>
                    <Icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
