"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, Trash2, Sparkles, Compass } from "lucide-react";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import promptsData from "@/data/prompts.json";
import type { Prompt } from "@/types";
import { toast } from "sonner";

export default function SavedPromptsPage() {
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSaved = () => {
    try {
      const saved = localStorage.getItem("pv:saved:prompts");
      if (saved) {
        const savedIds = JSON.parse(saved) as string[];
        const prompts = (promptsData as Prompt[]).filter((p) => savedIds.includes(p.id));
        setSavedPrompts(prompts);
      } else {
        setSavedPrompts([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
    
    // Listen for custom save changes to keep in sync
    window.addEventListener("pv:saved:change", loadSaved);
    return () => {
      window.removeEventListener("pv:saved:change", loadSaved);
    };
  }, []);

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all your saved bookmarks?")) {
      localStorage.removeItem("pv:saved:prompts");
      setSavedPrompts([]);
      toast.success("All bookmarked prompts cleared!");
      window.dispatchEvent(new Event("pv:saved:change"));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh] flex flex-col justify-start">
      
      {/* Back button & title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-8 mb-10">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Discover
          </Link>
          
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 select-none">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <Heart className="w-4.5 h-4.5 fill-rose-500" />
            </div>
            <span>Bookmarked Prompts</span>
          </h1>
          <p className="text-xs text-muted-foreground/75 leading-none">
            {savedPrompts.length === 0 
              ? "Keep track of your favorite templates across AI models." 
              : `You have saved ${savedPrompts.length} premium template${savedPrompts.length === 1 ? "" : "s"}.`}
          </p>
        </div>

        {savedPrompts.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 transition-all duration-300 active:scale-95 self-start sm:self-center cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 animate-pulse text-muted-foreground text-xs font-bold gap-2.5">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-bounce" />
          <span>Loading bookmarked prompts...</span>
        </div>
      ) : savedPrompts.length > 0 ? (
        <div className="animate-fade-in">
          <PromptGrid prompts={savedPrompts} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-16 animate-fade-in">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-3xl bg-secondary/50 border border-border/60 text-muted-foreground/40 mb-6 shadow-sm">
            <Heart className="w-7 h-7" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-gold animate-pulse" />
          </div>
          <h2 className="text-lg font-black tracking-tight text-foreground mb-2">No bookmarks saved yet</h2>
          <p className="text-xs text-muted-foreground/75 leading-relaxed mb-8">
            Browse through our premium library of copy-ready prompt templates for Midjourney, FLUX, ChatGPT and Claude, and tap the heart icon to save them here!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-6 py-3 rounded-xl hover:bg-primary/95 transition-all duration-300 active:scale-95 shadow-[0_4px_15px_rgba(139,92,246,0.3)]"
          >
            <Compass className="w-4 h-4" />
            Explore Prompts Feed
          </Link>
        </div>
      )}
    </div>
  );
}
