"use client";

import { motion } from "framer-motion";
import type { Prompt } from "@/types";
import { PromptCard } from "./PromptCard";
import { PromptSkeleton } from "./PromptSkeleton";
import { cn } from "@/lib/utils";

interface PromptGridProps {
  prompts: Prompt[];
  loading?: boolean;
  className?: string;
  emptyMessage?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export function PromptGrid({
  prompts,
  loading = false,
  className,
  emptyMessage = "No prompts found matching your criteria.",
}: PromptGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
          className
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <PromptSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border rounded-3xl bg-card">
        <p className="text-sm text-muted-foreground text-center">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {prompts.map((prompt, idx) => (
        <PromptCard key={prompt.id} prompt={prompt} index={idx} />
      ))}
    </motion.div>
  );
}
