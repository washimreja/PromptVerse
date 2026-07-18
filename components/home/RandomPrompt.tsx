"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
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
      toast.success("Found a random template!", { duration: 1500 });
      router.push(`/prompts/${prompt.id}`);
    } catch {
      toast.error("Failed to find a random prompt");
    } finally {
      setTimeout(() => setShuffling(false), 600);
    }
  };

  return (
    <section className="py-20 bg-background border-b border-border/10 relative overflow-hidden noise-overlay">
      
      {/* Decorative center orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
        <span className="text-[10px] font-extrabold tracking-widest text-primary bg-primary/15 border border-primary/20 px-2.5 py-0.5 rounded-md uppercase mb-4 inline-block">
          Pillar 08 // Surprise Mode
        </span>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Unsure what to create?
        </h2>
        
        <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-md mx-auto mb-8 leading-relaxed font-semibold">
          Roll the dice and discover a randomly selected, high-quality prompt template from our community library.
        </p>

        <button
          onClick={handleShuffle}
          disabled={shuffling}
          className={cn(
            "inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-xs",
            "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg border border-white/10",
            "hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300",
            "select-none cursor-pointer active:scale-[0.98]",
            shuffling && "opacity-80"
          )}
        >
          <Shuffle className={cn("h-4 w-4 transition-transform duration-500", shuffling && "rotate-180")} />
          <span>Shuffle a Prompt</span>
        </button>

      </div>
    </section>
  );
}
