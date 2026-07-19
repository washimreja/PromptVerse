"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { AIModel } from "@/types";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelLogo } from "./ModelLogos";

interface ModelCardProps {
  model: AIModel;
  index?: number;
}

export function ModelCard({ model, index = 0 }: ModelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.35), ease: "easeOut" }}
      className="perspective-container"
    >
      <Link
        href={`/models/${model.slug}`}
        className={cn(
          "group relative flex items-center gap-3.5 p-3.5 rounded-2xl h-[100px] transition-all duration-300 ease-out",
          "bg-[#080713]/60 border border-[#23203c]/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden",
          "hover:-translate-y-[2px] hover:bg-[#0a0917]/70 hover:border-primary/20",
          "focus:outline-none focus:ring-1"
        )}
        style={{
          // @ts-expect-error - Custom CSS Variable mapping
          "--tw-ring-color": `${model.color}30`
        }}
      >
        {/* Soft model-specific radial backglow */}
        <div
          className="absolute -top-6 -right-6 w-14 h-14 rounded-full blur-xl opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: model.color }}
        />

        {/* Dynamic model-specific border glow overlay */}
        <div
          className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-current opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{ color: model.color }}
        />

        {/* Logo Avatar Frame (Uses crisp SVG official logos) */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: `${model.color}10`,
            border: `1px solid ${model.color}25`
          }}
        >
          <ModelLogo slug={model.slug} />
        </div>

        {/* Content Block */}
        <div className="flex-grow flex flex-col justify-center text-left min-w-0 pr-4">
          <h3 className="font-extrabold text-[0.85rem] tracking-tight text-white/95 leading-normal truncate group-hover:text-white transition-colors">
            {model.name}
          </h3>
          <p className="text-[10px] text-muted-foreground/60 font-semibold line-clamp-2 leading-relaxed mt-0.5">
            {model.description}
          </p>
        </div>

        {/* Floating action arrow indicator */}
        <div 
          className="absolute right-4.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 ease-out"
          style={{ color: model.color }}
        >
          <ArrowRight className="h-4 w-4" />
        </div>

      </Link>
    </motion.div>
  );
}
export default ModelCard;
