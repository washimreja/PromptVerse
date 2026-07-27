"use client";

import Link from "next/link";
import { Flame, Sparkles, Crown, Compass, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HIGHLIGHT_CARDS = [
  {
    id: "trending",
    title: "Trending Prompts",
    subtitle: "Most copied this week",
    badge: "🔥 HOT",
    icon: Flame,
    href: "/search?sort=trending",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    iconColor: "text-orange-400",
  },
  {
    id: "new",
    title: "New Today",
    subtitle: "Fresh AI prompts added",
    badge: "✨ NEW",
    icon: Sparkles,
    href: "/search?sort=newest",
    gradient: "from-cyan-500/20 via-brand/10 to-transparent",
    iconColor: "text-cyan-400",
  },
  {
    id: "premium",
    title: "Premium Picks",
    subtitle: "Exclusive PRO templates",
    badge: "👑 PRO",
    icon: Crown,
    href: "/pricing",
    gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    iconColor: "text-amber-400",
  },
  {
    id: "explore",
    title: "Browse All",
    subtitle: "Explore 10,000+ library",
    badge: "🎯 TOP",
    icon: Compass,
    href: "/category",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconColor: "text-emerald-400",
  },
];

export function ContentHighlights() {
  return (
    <section className="w-full py-6 md:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Quick Discover</span>
        </h2>
      </div>

      {/* ── 2x2 on Mobile, 4 columns on Desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {HIGHLIGHT_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                href={card.href}
                className="group relative flex items-center p-3 rounded-2xl bg-[#090a0f] border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="relative z-10 flex items-center gap-3 w-full">
                  {/* Icon */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.05] border border-white/10 shrink-0">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor}`} />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {card.title}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground/75 truncate">
                      {card.subtitle}
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
