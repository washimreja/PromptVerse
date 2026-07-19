"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("done");
    toast.success("You're subscribed! Welcome to PromptVerse 🎉");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 border-b border-border/10">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/[0.06] rounded-full blur-[80px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black tracking-widest uppercase text-primary">Daily AI Prompts</span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Join{" "}
              <span className="gradient-text">10,000+ AI Creators</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground/70 max-w-xl mx-auto leading-relaxed">
              Get the best new AI prompts delivered to your inbox. Fresh inspiration every week — no spam, just creativity.
            </p>
          </div>

          {/* Subscribe form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={status !== "idle"}
                className={cn(
                  "w-full pl-11 pr-4 py-3 rounded-xl text-sm",
                  "bg-secondary/40 border border-border/30 backdrop-blur-md",
                  "placeholder:text-muted-foreground/40 text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40",
                  "transition-all duration-300",
                  status !== "idle" && "opacity-50 cursor-not-allowed"
                )}
              />
            </div>
            <button
              type="submit"
              disabled={status !== "idle"}
              className={cn(
                "flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold",
                "transition-all duration-200 active:scale-95",
                status === "done"
                  ? "bg-emerald-500 text-white"
                  : "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_2px_16px_oklch(0.58_0.19_185_/_0.35)]",
                status !== "idle" && "cursor-not-allowed"
              )}
            >
              {status === "done" ? (
                <>
                  <Check className="h-4 w-4" />
                  Subscribed!
                </>
              ) : status === "loading" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Joining...
                </span>
              ) : (
                <>
                  Subscribe Free
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust indicators */}
          <p className="text-[11px] text-muted-foreground/40">
            No spam · Unsubscribe anytime · 10,000+ creators already subscribed
          </p>
        </motion.div>
      </div>
    </section>
  );
}
