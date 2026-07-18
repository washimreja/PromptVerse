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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.3), ease: "easeOut" }}
      className="perspective-container"
    >
      <Link
        href={`/category/${category.slug}`}
        className={cn(
          "group flex items-center justify-between p-4.5 rounded-2xl transition-all duration-500",
          "bg-card/45 border border-border/30 backdrop-blur-md",
          "tilt-card noise-overlay shine"
        )}
      >
        <div className="flex items-center gap-3 relative z-10">
          {/* Icon frame */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-md select-none transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${category.color || "var(--color-primary)"}12`,
              border: `1px solid ${category.color || "var(--color-primary)"}25`
            }}
          >
            {category.icon}
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[0.88rem] tracking-tight group-hover:text-primary transition-colors duration-300">
              {category.name}
            </span>
            <span className="text-[10px] text-muted-foreground/75 font-semibold line-clamp-1 max-w-[180px] leading-relaxed">
              {category.description}
            </span>
          </div>
        </div>

        {/* Count Badge */}
        <div className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-lg bg-secondary/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300 border border-border/10">
          Explore
        </div>
      </Link>
    </motion.div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex items-center justify-between p-4.5 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl skeleton" />
        <div className="space-y-1.5">
          <div className="h-4 w-24 rounded skeleton" />
          <div className="h-3 w-32 rounded skeleton" />
        </div>
      </div>
      <div className="w-8 h-4 rounded-full skeleton" />
    </div>
  );
}
