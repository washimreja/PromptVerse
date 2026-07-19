"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Lock, Sparkles, ArrowLeft, Zap, Crown } from "lucide-react";

const FEATURES = [
  "Access 100+ premium AI prompts",
  "Unlock full prompt text instantly",
  "Negative prompts for cleaner outputs",
  "Advanced configs & camera settings",
  "Priority access to new releases",
  "Save unlimited prompts to collections",
  "Ad-free experience",
  "Early access to new features",
];

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$9",
    period: "/month",
    description: "Full access, billed monthly",
    highlight: false,
  },
  {
    id: "annual",
    name: "Annual",
    price: "$59",
    period: "/year",
    description: "Save 45% vs monthly",
    badge: "Best Value",
    highlight: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$149",
    period: " once",
    description: "Pay once, own forever",
    highlight: false,
  },
];

export default function ProPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Discover
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12 space-y-4"
      >
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400">
            <Crown className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-widest">PromptVerse Pro</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Unlock{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
            Premium
          </span>{" "}
          Prompts
        </h1>
        <p className="text-base text-muted-foreground/70 max-w-xl mx-auto leading-relaxed">
          Get instant access to 100+ expert-crafted AI prompts for Midjourney, Flux, ChatGPT and more.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className={`relative rounded-3xl p-6 border transition-all ${
              plan.highlight
                ? "bg-gradient-to-b from-amber-400/15 to-amber-400/5 border-amber-400/30 shadow-[0_8px_32px_rgba(245,158,11,0.2)]"
                : "bg-card border-border/15"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black shadow-[0_2px_12px_rgba(245,158,11,0.4)]">
                  {plan.badge}
                </span>
              </div>
            )}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{plan.name}</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black ${plan.highlight ? "text-amber-400" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground/60">{plan.period}</span>
              </div>
              <p className="text-xs text-muted-foreground/60">{plan.description}</p>
              <button
                className={`w-full py-3 rounded-xl text-sm font-black transition-all duration-200 active:scale-95 ${
                  plan.highlight
                    ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_24px_rgba(245,158,11,0.5)] hover:scale-105"
                    : "bg-secondary/60 border border-border/20 text-foreground hover:bg-secondary"
                }`}
              >
                {plan.highlight ? "🔒 Get Pro Access" : "Get Started"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Features list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="bg-card rounded-3xl border border-border/10 p-8"
      >
        <h2 className="text-lg font-black mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          Everything included in Pro
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((feat) => (
            <div key={feat} className="flex items-center gap-3 text-sm font-semibold">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                <Check className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="text-foreground/80">{feat}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground/50 font-semibold">
        <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Secure checkout</span>
        <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Instant access</span>
        <span className="flex items-center gap-1.5">✨ Cancel anytime</span>
      </div>
    </div>
  );
}
