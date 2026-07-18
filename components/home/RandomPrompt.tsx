"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle, ArrowRight } from "lucide-react";
import { getRandomPrompt } from "@/lib/prompts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function RandomPrompt() {
  const router = useRouter();
  const [shuffling, setShuffling] = useState(false);

  const handleShuffle = async () => {
    setShuffling(true);
    try {
      const prompt = await getRandomPrompt();
      toast.success("Found a random prompt!", { duration: 1500 });
      router.push(`/prompts/${prompt.id}`);
    } catch {
      toast.error("Failed to find a random prompt");
    } finally {
      // Keep shuffle anim spinning for a bit
      setTimeout(() => setShuffling(false), 500);
    }
  };

  return (
    <section className="py-16 bg-background border-b border-border/40 relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="mx-auto max-w-4xl px-4 text-center relative">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
          Unsure what to create?
        </h2>
        
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          Roll the dice and discover a randomly selected, high-quality prompt from our library of 250+ templates.
        </p>

        <button
          onClick={handleShuffle}
          disabled={shuffling}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm",
            "bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 shadow-md",
            "select-none cursor-pointer active:scale-[0.98]",
            shuffling && "opacity-80"
          )}
        >
          <Shuffle className={cn("h-4 w-4", shuffling && "animate-spin")} />
          <span>Shuffle a Prompt</span>
        </button>

      </div>
    </section>
  );
}
