"use client";

import Link from "next/link";
import { Image as ImageIcon, Video, MessageSquare, Sparkles, Code, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const MOBILE_GRID_ITEMS = [
  {
    slug: "image",
    name: "Image",
    icon: ImageIcon,
    iconColor: "text-cyan-400",
    borderGlow: "hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]",
  },
  {
    slug: "video",
    name: "Video",
    icon: Video,
    iconColor: "text-purple-400",
    borderGlow: "hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]",
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    icon: MessageSquare,
    iconColor: "text-emerald-400",
    borderGlow: "hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]",
  },
  {
    slug: "gemini",
    name: "Gemini",
    icon: Sparkles,
    iconColor: "text-blue-400",
    borderGlow: "hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]",
  },
  {
    slug: "coding",
    name: "Coding",
    icon: Code,
    iconColor: "text-teal-400",
    borderGlow: "hover:border-teal-500/40 hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]",
  },
  {
    slug: "marketing",
    name: "Marketing",
    icon: Megaphone,
    iconColor: "text-amber-400",
    borderGlow: "hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]",
  },
];

export function MobileHero() {
  return (
    <div className="flex md:hidden flex-col items-center text-center w-full px-2 z-10 relative pt-2 pb-4">
      {/* ── Small Heading ── */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-xl font-extrabold tracking-tight text-white mb-1"
      >
        Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brand">Premium AI Prompts</span>
      </motion.h1>

      {/* ── Short Subtitle ── */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-xs text-muted-foreground/80 mb-3 font-medium"
      >
        10,000+ ready-to-copy prompts.
      </motion.p>

      {/* ── Compact 3-Column Grid (3 items per line) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-2 w-full max-w-md"
      >
        {MOBILE_GRID_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className={`flex flex-col items-center justify-center p-2 rounded-xl bg-[#090a0f]/90 border border-white/10 ${item.borderGlow} active:scale-95 transition-all duration-200 backdrop-blur-md text-center`}
            >
              <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/10 mb-1">
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight truncate w-full">
                {item.name}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
