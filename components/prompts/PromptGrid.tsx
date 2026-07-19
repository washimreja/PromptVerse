"use client";

import type { Prompt } from "@/types";
import { PromptCard } from "./PromptCard";

interface PromptGridProps {
  prompts: Prompt[];
  /** "grid" renders a responsive CSS grid; "carousel" renders flat flex items */
  variant?: "grid" | "carousel";
  /** Optional message shown when prompts array is empty */
  emptyMessage?: string;
}

export function PromptGrid({ prompts, variant = "grid" }: PromptGridProps) {
  if (variant === "carousel") {
    return (
      <>
        {prompts.map((prompt, i) => (
          <PromptCard key={prompt.id} prompt={prompt} index={i} variant="carousel" />
        ))}
      </>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {prompts.map((prompt, i) => (
        <PromptCard key={prompt.id} prompt={prompt} index={i} variant="grid" />
      ))}
    </div>
  );
}
