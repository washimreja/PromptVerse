"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Shuffle, ArrowLeft, HelpCircle } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { getRandomPrompt } from "@/lib/prompts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [shuffling, setShuffling] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleShuffle = async () => {
    setShuffling(true);
    try {
      const prompt = await getRandomPrompt();
      toast.success("Found a random prompt!", { duration: 1500 });
      router.push(`/prompts/${prompt.id}`);
    } catch {
      toast.error("Failed to find a random prompt");
    } finally {
      setShuffling(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center flex flex-col justify-center items-center min-h-[70vh] animate-fade-in">
      
      {/* 404 Visual Icon */}
      <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-6 animate-float">
        <HelpCircle className="h-8 w-8" />
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-black tracking-tight mb-2">404</h1>
      <h2 className="text-lg font-bold text-foreground mb-4">Page not found</h2>
      
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-10 leading-relaxed">
        The page you are looking for doesn&apos;t exist or has been moved. Try searching or exploring these shortcuts:
      </p>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-md mb-8">
        <div className="flex items-center gap-2.5 p-1.5 rounded-xl bg-card border border-border/80 shadow-sm focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts..."
            className="flex-1 bg-transparent border-0 py-2 pl-3 text-xs text-foreground focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer select-none"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Categories Shortcuts */}
      <div className="space-y-3 w-full mb-8">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 block">
          Popular Categories
        </span>
        <div className="flex flex-wrap justify-center gap-1.5">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <span>{cat.icon}</span> <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Primary CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-4 border-t border-border/40">
        
        {/* Shuffle */}
        <button
          onClick={handleShuffle}
          disabled={shuffling}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary border border-border/80 text-xs font-bold hover:bg-accent text-foreground transition-all duration-200 select-none cursor-pointer active:scale-[0.98]"
        >
          <Shuffle className={cn("h-3.5 w-3.5", shuffling && "animate-spin")} />
          <span>Shuffle a Prompt</span>
        </button>

        {/* Back home */}
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all duration-200 shadow-sm active:scale-[0.98]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

    </div>
  );
}
