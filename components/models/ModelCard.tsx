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
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4), ease: "easeOut" }}
    >
      <Link
        href={`/models/${model.slug}`}
        className={cn(
          "group relative flex flex-col justify-between p-6 rounded-3xl h-[180px]",
          "bg-card border border-border overflow-hidden card-hover",
          "hover:shadow-lg hover:shadow-black/5"
        )}
      >
        {/* Glow backdrop styling */}
        <div
          className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-10 transition-opacity duration-300 group-hover:opacity-20"
          style={{ backgroundColor: model.color }}
        />

        {/* Icon & Details */}
        <div className="space-y-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg select-none transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${model.color}15`,
              border: `1px solid ${model.color}25`
            }}
          >
            {model.icon}
          </div>
          
          <div className="space-y-1">
            <h3 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">
              {model.name}
            </h3>
            <p className="text-[10.5px] text-muted-foreground line-clamp-2 leading-normal">
              {model.description}
            </p>
          </div>
        </div>

        {/* Arrow Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
          <span>Explore Prompts</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}
