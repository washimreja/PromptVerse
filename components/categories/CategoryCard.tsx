"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const count = category.promptCount ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.25), ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/category/${category.slug}`}
        className={cn(
          "group relative flex flex-col justify-between p-3 sm:p-4 rounded-2xl h-full transition-all duration-300 ease-out",
          "bg-[#090a0f]/90 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md",
          "hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]"
        )}
      >
        {/* Subtle radial backglow matching category color */}
        <div
          className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: category.color || "#06b6d4" }}
        />

        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Avatar Icon Box */}
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm sm:text-base select-none shrink-0 transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${category.color || "#06b6d4"}15`,
              border: `1px solid ${category.color || "#06b6d4"}30`
            }}
          >
            {category.icon}
          </div>

          {/* Count Badge */}
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-white/[0.04] text-cyan-400 border border-white/10 shrink-0">
            {count} {count === 1 ? 'prompt' : 'prompts'}
          </span>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col min-w-0">
          <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
            {category.name}
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground/75 font-medium line-clamp-1 leading-snug mt-0.5">
            {category.description}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="p-3 rounded-2xl bg-[#090a0f]/90 border border-white/10 h-28 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-xl skeleton" />
        <div className="w-12 h-4 rounded-md skeleton" />
      </div>
      <div className="space-y-1">
        <div className="h-3.5 w-20 rounded skeleton" />
        <div className="h-3 w-28 rounded skeleton" />
      </div>
    </div>
  );
}
