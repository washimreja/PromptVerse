"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const COLLECTIONS = [
  { slug: "midjourney", name: "Midjourney Prompts", icon: "🎨", color: "#1a1a2e", accent: "#7c3aed" },
  { slug: "realistic", name: "Realistic Photos", icon: "📷", color: "#0f1923", accent: "#06b6d4" },
  { slug: "cinematic", name: "Cinematic Prompts", icon: "🎬", color: "#1a0f00", accent: "#f59e0b" },
  { slug: "instagram", name: "Instagram Reels", icon: "📸", color: "#1a0020", accent: "#ec4899" },
  { slug: "portrait", name: "AI Profile Pics", icon: "🤳", color: "#001a0d", accent: "#10b981" },
  { slug: "youtube", name: "YouTube Thumbnails", icon: "▶️", color: "#1a0000", accent: "#ef4444" },
  { slug: "reels", name: "Viral Prompts", icon: "🔥", color: "#1a0a00", accent: "#f97316" },
  { slug: "luxury", name: "Luxury Lifestyle", icon: "💎", color: "#0d0d1a", accent: "#a78bfa" },
  { slug: "anime", name: "Anime Prompts", icon: "⛩️", color: "#1a0010", accent: "#f472b6" },
  { slug: "product-photography", name: "Product Photos", icon: "📦", color: "#000f1a", accent: "#38bdf8" },
];

export function PromptCollections() {
  return (
    <section className="py-12 bg-background border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div className="space-y-1.5">
            <span className="section-label">Curated Sets</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Prompt Collections</h2>
            <p className="text-xs text-muted-foreground/60">Curated AI prompt libraries for every style</p>
          </div>
        </div>

        {/* 5-column grid (2-col mobile, 3-col tablet, 5-col desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {COLLECTIONS.map((col, i) => (
            <motion.div
              key={col.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/category/${col.slug}`}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3.5 rounded-xl",
                  "border border-border/10 transition-all duration-300",
                  "hover:border-border/30 hover:shadow-md hover:-translate-y-0.5"
                )}
                style={{
                  backgroundColor: col.color,
                }}
              >
                <span className="text-xl leading-none flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  {col.icon}
                </span>
                <span
                  className="text-xs font-bold text-white/85 leading-snug group-hover:text-white transition-colors"
                >
                  {col.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
