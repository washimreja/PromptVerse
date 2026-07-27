"use client";

import Link from "next/link";
import { Image as ImageIcon, Video, Megaphone, Code, MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const SIX_CATEGORIES = [
  {
    slug: "image",
    name: "Image",
    description: "Midjourney, Flux & Stable Diffusion prompts",
    icon: ImageIcon,
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    iconColor: "text-cyan-400",
  },
  {
    slug: "video",
    name: "Video",
    description: "Sora, Runway & Pika cinematic video prompts",
    icon: Video,
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    iconColor: "text-purple-400",
  },
  {
    slug: "marketing",
    name: "Marketing",
    description: "Ad copy, SEO, sales funnels & social strategy",
    icon: Megaphone,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconColor: "text-amber-400",
  },
  {
    slug: "coding",
    name: "Coding",
    description: "Full-stack code, refactoring & architecture",
    icon: Code,
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconColor: "text-emerald-400",
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    description: "Custom GPTs, deep reasoning & system prompts",
    icon: MessageSquare,
    gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
    iconColor: "text-teal-400",
  },
  {
    slug: "gemini",
    name: "Gemini",
    description: "Multimodal analysis, vision & long-context prompts",
    icon: Sparkles,
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    iconColor: "text-blue-400",
  },
];

export function CategoryGrid() {
  return (
    <section className="w-full py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Section Title ── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand">Category</span>
        </h2>
        <Link
          href="/category"
          className="text-xs font-bold text-cyan-400 hover:text-white transition-colors flex items-center gap-1 group"
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
                className="group relative block rounded-2xl p-4 sm:p-6 bg-[#090a0f] border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Ambient Subtle Card Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative z-10 flex flex-col items-start gap-3">
                  {/* Icon Badge */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/10 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 transition-all">
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${cat.iconColor}`} />
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
