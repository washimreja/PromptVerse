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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3), ease: "easeOut" }}
    >
      <Link
        href={`/category/${category.slug}`}
        className={cn(
          "group flex items-center justify-between p-4.5 rounded-2xl",
          "bg-card border border-border hover:border-primary/20",
          "transition-all duration-300 card-hover"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Icon frame */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg select-none transition-all duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${category.color}12`,
              border: `1px solid ${category.color}25`
            }}
          >
            {category.icon}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">
              {category.name}
            </span>
            <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[180px]">
              {category.description}
            </span>
          </div>
        </div>

        {/* Dynamic Badge */}
        {category.promptCount !== undefined && (
          <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {category.promptCount}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex items-center justify-between p-4.5 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl skeleton" />
        <div className="space-y-1.5">
          <div className="h-4 w-24 rounded skeleton" />
          <div className="h-3 w-32 rounded skeleton" />
        </div>
      </div>
      <div className="w-8 h-4 rounded-full skeleton" />
    </div>
  );
}
