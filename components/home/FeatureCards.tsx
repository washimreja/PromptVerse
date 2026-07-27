"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Wand2, RefreshCcw, Focus, Zap } from "lucide-react";

const SUITE_FEATURES = [
  {
    id: "smart-shot",
    titlePrefix: "Smart ",
    titleAccent: "Shot",
    description: "Highly detailed cinematic photography and portrait generation",
    image: "/images/tools/smart_shot.png",
    icon: Focus,
    badge: "PRO",
    color: "from-cyan-500/20 via-brand/10 to-transparent",
  },
  {
    id: "relight",
    titlePrefix: "Relight ",
    titleAccent: "Scene",
    description: "Adjust atmospheric lighting to match a reference mood",
    image: "/images/tools/relight.png",
    icon: Sparkles,
    badge: "NEW",
    color: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "replace-bg",
    titlePrefix: "Replace ",
    titleAccent: "Background",
    description: "Swap the scene behind your subject seamlessly",
    image: "/images/tools/replace_bg.png",
    icon: RefreshCcw,
    badge: "POPULAR",
    color: "from-purple-500/20 via-brand/10 to-transparent",
  },
  {
    id: "edit-image",
    titlePrefix: "Edit ",
    titleAccent: "Image",
    description: "Modify details, add elements, or refine specific areas",
    image: "/images/tools/edit_image.png",
    icon: Wand2,
    badge: "FAST",
    color: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
];

export function FeatureCards() {
  return (
    <section className="w-full py-8 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Studio Tools</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            PromptVerse <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand">Suite</span>
          </h2>
        </div>
        <Link
          href="/studio"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-white transition-colors group"
        >
          <span>Explore Suite</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUITE_FEATURES.map((feature) => (
          <Link
            key={feature.id}
            href={`/studio/${feature.id}`}
            className="group relative rounded-2xl p-[1px] overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(6,182,212,0.15)]"
          >
            {/* Animated Glow Border */}
            <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-50 group-hover:opacity-100 transition-opacity duration-500 border border-white/10 rounded-2xl`} />

            {/* Inner Content */}
            <div className="relative flex items-center p-3 sm:p-4 rounded-2xl bg-[#090a0f]/90 border border-white/10 backdrop-blur-xl h-full transition-colors group-hover:border-cyan-500/40">
              
              {/* Thumbnail Container */}
              <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-md">
                <Image
                  src={feature.image}
                  alt={feature.titlePrefix + feature.titleAccent}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/10">
                  <feature.icon size={12} className="text-cyan-400" />
                </div>
              </div>

              {/* Text Information */}
              <div className="flex flex-col justify-center ml-3.5 pr-1 overflow-hidden">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                    {feature.titlePrefix}
                    <span className="text-cyan-400">{feature.titleAccent}</span>
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground/80 leading-snug line-clamp-2">
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
