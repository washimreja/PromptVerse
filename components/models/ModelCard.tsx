"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { AIModel } from "@/types";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelCardProps {
  model: AIModel;
  index?: number;
}

export function ModelCard({ model, index = 0 }: ModelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.35), ease: "easeOut" }}
      className="perspective-container"
    >
      <Link
        href={`/models/${model.slug}`}
        className={cn(
          "group relative flex flex-col justify-between p-6 rounded-3xl h-[175px] transition-all duration-500",
          "bg-card/45 border border-border/30 overflow-hidden backdrop-blur-md",
          "tilt-card noise-overlay shine"
        )}
      >
        {/* Glow backdrop styling */}
        <div
          className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-15 transition-opacity duration-500 group-hover:opacity-30"
          style={{ backgroundColor: model.color || "var(--color-primary)" }}
        />

        {/* Icon & Details */}
        <div className="space-y-3 relative z-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-md select-none transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${model.color || "var(--color-primary)"}15`,
              border: `1px solid ${model.color || "var(--color-primary)"}25`
            }}
          >
            {model.icon}
          </div>
          
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-[0.92rem] tracking-tight group-hover:text-primary transition-colors duration-300">
              {model.name}
            </h3>
            <p className="text-[10.5px] text-muted-foreground/75 font-semibold line-clamp-2 leading-relaxed">
              {model.description}
            </p>
          </div>
        </div>

        {/* Arrow Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border/10 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary transition-colors duration-300">
          <span>Explore Prompts</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </Link>
    </motion.div>
  );
}
