"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, RefreshCcw, Focus } from "lucide-react";

const SUITE_FEATURES = [
  {
    id: "smart-shot",
    titlePrefix: "Smart ",
    titleAccent: "Shot",
    description: "Cinematic portrait & photo generation",
    image: "/images/tools/smart_shot.png",
    icon: Focus,
    color: "from-cyan-500/20 via-brand/10 to-transparent",
  },
  {
    id: "relight",
    titlePrefix: "Relight ",
    titleAccent: "Scene",
    description: "Adjust atmospheric lighting & mood",
    image: "/images/tools/relight.png",
    icon: Sparkles,
    color: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "replace-bg",
    titlePrefix: "Replace ",
    titleAccent: "BG",
    description: "Swap background scene seamlessly",
    image: "/images/tools/replace_bg.png",
    icon: RefreshCcw,
    color: "from-purple-500/20 via-brand/10 to-transparent",
  },
];

export function FeatureCards() {
  return (
    <section className="w-full py-6 md:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
          AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand">Suite</span>
        </h2>
        <Link
          href="/studio"
          className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-white transition-colors group"
        >
          <span>Explore</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ── 3-Column Grid (Exactly 3 items in 1 line) ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {SUITE_FEATURES.map((feature) => (
          <Link
            key={feature.id}
            href={`/studio/${feature.id}`}
            className="group relative rounded-2xl p-[1px] overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]"
          >
            {/* Glow Border */}
            <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300 border border-white/10 rounded-2xl`} />

            {/* Inner Card */}
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start p-2.5 sm:p-3.5 rounded-2xl bg-[#090a0f]/90 border border-white/10 backdrop-blur-xl h-full transition-colors group-hover:border-cyan-500/40 text-center sm:text-left">
              
              {/* Thumbnail Container */}
              <div className="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 mb-1.5 sm:mb-0">
                <Image
                  src={feature.image}
                  alt={feature.titlePrefix + feature.titleAccent}
                  fill
                  sizes="48px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0.5 left-0.5 bg-black/70 backdrop-blur-md p-0.5 rounded border border-white/10">
                  <feature.icon size={10} className="text-cyan-400" />
                </div>
              </div>

              {/* Text Information */}
              <div className="flex flex-col justify-center sm:ml-3 min-w-0 overflow-hidden w-full">
                <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-tight truncate">
                  {feature.titlePrefix}
                  <span className="text-cyan-400">{feature.titleAccent}</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground/75 leading-tight line-clamp-1 mt-0.5 hidden sm:block">
                  {feature.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
