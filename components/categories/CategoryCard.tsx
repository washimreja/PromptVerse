"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

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
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.3), ease: "easeOut" }}
      className="perspective-container"
    >
      <Link
        href={`/category/${category.slug}`}
        className={cn(
          "group relative flex items-center justify-between p-4 rounded-2xl h-[92px] transition-all duration-300 ease-out",
          "bg-[#080713]/60 border border-[#23203c]/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden",
          "hover:-translate-y-[2px] hover:bg-[#0a0917]/70 hover:border-primary/20",
          "focus:outline-none focus:ring-1"
        )}
        style={{
          // @ts-expect-error - Custom CSS Variable mapping
          "--tw-ring-color": `${category.color}30`
        }}
      >
        {/* Subtle radial backglow matching category color */}
        <div
          className="absolute -top-6 -right-6 w-14 h-14 rounded-full blur-xl opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: category.color }}
        />

        {/* Dynamic border glow overlay matching category color */}
        <div
          className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-current opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{ color: category.color }}
        />

        <div className="flex items-center gap-3.5 relative z-10 min-w-0 flex-grow pr-4">
          {/* Avatar Icon Box */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[1.1rem] select-none flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${category.color}10`,
              border: `1px solid ${category.color}25`
            }}
          >
            {category.icon}
          </div>
          
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-[0.85rem] tracking-tight text-white/95 leading-normal truncate group-hover:text-white transition-colors">
              {category.name}
            </span>
            <span className="text-[10px] text-muted-foreground/60 font-semibold line-clamp-1 leading-normal mt-0.5">
              {category.description}
            </span>
          </div>
        </div>

        {/* Count / Explore Badge */}
        <div className="flex items-center gap-1.5 flex-shrink-0 relative z-10">
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-lg bg-secondary/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-border/10">
            {count} {count === 1 ? 'Prompt' : 'Prompts'}
          </span>
          <div className="opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300 ease-out">
            <ArrowRight className="h-3.5 w-3.5" style={{ color: category.color }} />
          </div>
        </div>

      </Link>
    </motion.div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#080713]/60 border border-[#23203c]/20 h-[92px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl skeleton" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-20 rounded skeleton" />
          <div className="h-3 w-28 rounded skeleton" />
        </div>
      </div>
      <div className="w-12 h-4 rounded-full skeleton" />
    </div>
  );
}
