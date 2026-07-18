"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Shuffle, Search, ArrowUp, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getRandomPrompt } from "@/lib/prompts";
import { toast } from "sonner";

export function FloatingActionButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shuffling, setShuffling] = useState(false);

  // Show only after scrolling down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const handleShuffle = async () => {
    setShuffling(true);
    try {
      const prompt = await getRandomPrompt();
      toast.success("Found a random prompt!", { duration: 1500 });
      router.push(`/prompts/${prompt.id}`);
      setIsOpen(false);
    } catch {
      toast.error("Failed to find a random prompt");
    } finally {
      setShuffling(false);
    }
  };

  const menuItems = [
    { icon: ArrowUp, label: "Top", onClick: handleScrollTop, color: "bg-slate-900 border-border/20 text-foreground" },
    { icon: Shuffle, label: "Shuffle", onClick: handleShuffle, color: "bg-gradient-to-r from-indigo-500 to-purple-500 border-transparent text-white" },
    { icon: Search, label: "Search", onClick: () => { router.push("/search"); setIsOpen(false); }, color: "bg-slate-900 border-border/20 text-foreground" },
    { icon: Sparkles, label: "Browse", onClick: () => { router.push("/category"); setIsOpen(false); }, color: "bg-slate-900 border-border/20 text-foreground" },
  ];

  return (
    <div className={cn(
      "fixed z-50 transition-all duration-500",
      "right-4 bottom-20 md:right-8 md:bottom-8", // offset mobile bottom nav space
      isVisible ? "scale-100 opacity-100 pointer-events-auto" : "scale-75 opacity-0 pointer-events-none"
    )}>
      <div className="relative flex items-center justify-center">
        
        {/* Expanded mini-menu panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="absolute bottom-16 right-0 flex flex-col gap-2 p-2 rounded-2xl border border-border/30 bg-card/90 backdrop-blur-2xl shadow-2xl w-36 glow-brand"
            >
              {menuItems.map((item, idx) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border transition-all duration-300 active:scale-95 text-left w-full hover:bg-secondary",
                    item.color
                  )}
                >
                  <item.icon className={cn("h-3.5 w-3.5", item.label === "Shuffle" && shuffling && "animate-spin")} />
                  <span>{item.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Expand quick actions"
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300",
            "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border border-white/10",
            "hover:scale-105 active:scale-95 shadow-primary/20 hover:shadow-primary/40"
          )}
        >
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </motion.div>
        </button>
      </div>
    </div>
  );
}
export default FloatingActionButton;
