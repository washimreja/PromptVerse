"use client";

import Link from "next/link";
import { Image as ImageIcon, Video, Megaphone, Code, MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const SIX_CATEGORIES = [
  {
    slug: "image",
    name: "Image Generation",
    description: "Photorealistic portraits, concept art & cinematography",
    icon: ImageIcon,
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    iconColor: "text-cyan-400",
    count: "3,400+ prompts",
  },
  {
    slug: "video",
    name: "Cinematic Video",
    description: "Sora, Runway Gen-3 & Pika camera direction prompts",
    icon: Video,
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    iconColor: "text-purple-400",
    count: "850+ prompts",
  },
  {
    slug: "marketing",
    name: "Marketing & Growth",
    description: "High-converting ad copy, viral hooks & landing pages",
    icon: Megaphone,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconColor: "text-amber-400",
    count: "1,600+ prompts",
  },
  {
    slug: "coding",
    name: "Software & Architecture",
    description: "Full-stack code, system designs & smart refactoring",
    icon: Code,
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconColor: "text-emerald-400",
    count: "2,200+ prompts",
  },
  {
    slug: "chatgpt",
    name: "ChatGPT & Reasoning",
    description: "Deep reasoning frameworks, custom GPTs & business tools",
    icon: MessageSquare,
    gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
    iconColor: "text-teal-400",
    count: "1,950+ prompts",
  },
  {
    slug: "gemini",
    name: "Multimodal Gemini",
    description: "Vision analysis, document processing & mega context",
    icon: Sparkles,
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    iconColor: "text-blue-400",
    count: "1,100+ prompts",
  },
];

export function CategoryGrid() {
  return (
    <section className="w-full py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Section Title ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/90 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Curated Collections
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-200">Discipline</span>
          </h2>
        </div>
        <Link
          href="/category"
          className="text-xs font-bold text-cyan-400 hover:text-cyan-200 transition-colors flex items-center gap-1 group py-1.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-cyan-500/30"
        >
          <span>All Categories</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* ── 3 x 2 Grid on Desktop (grid-cols-3), 2 columns on Mobile (grid-cols-2) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {SIX_CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                href={`/category/${cat.slug}`}
                className="group relative block rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-[#131620]/90 to-[#0c0e15]/95 border border-white/[0.09] hover:border-cyan-400/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_10px_30px_-10px_rgba(0,0,0,0.6)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_20px_45px_-12px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.2)] transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden backdrop-blur-xl"
              >
                {/* Ambient Subtle Card Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-25 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative z-10 flex flex-col items-start gap-3">
                  {/* Top Row: Icon Badge + Count Tag */}
                  <div className="w-full flex items-center justify-between">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.06] border border-white/[0.1] group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 transition-all shadow-sm">
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${cat.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground/70 group-hover:text-cyan-300/90 transition-colors px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
                      {cat.count}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground/75 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
