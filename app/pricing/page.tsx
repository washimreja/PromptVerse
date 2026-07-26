"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Sparkles, ArrowRight, Zap, Crown } from "lucide-react";
import { PVLogo } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { PRICING_PLANS } from "@/data/pricingConfig";

const TIERS = PRICING_PLANS;

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <main className="min-h-screen bg-[#020204] overflow-hidden pb-24">
      {/* ── Background Effects ── */}
      <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-brand/10 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 noise-overlay opacity-50" />
      </div>

      {/* ── Header Simple ── */}
      <header className="relative z-10 w-full flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <PVLogo className="w-8 h-8" />
          <span className="font-extrabold text-xl tracking-tight text-white">PromptVerse</span>
        </Link>
        <Link href="/auth" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">
          Sign In
        </Link>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
        
        {/* ── Hero Section ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Pricing Plans
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
              Unlock PromptVerse <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400">Pro</span>
            </h1>
            <p className="text-lg text-muted-foreground/90 max-w-2xl mx-auto">
              Everything you need to build faster with AI. Save time, organize your workflow, and access the world's most advanced prompt library.
            </p>
          </motion.div>

          {/* Billing Toggle (Optional UI flair) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mt-10"
          >
            <span className={cn("text-sm font-bold transition-colors", billing === "monthly" ? "text-white" : "text-muted-foreground")}>Monthly</span>
            <button 
              onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-8 bg-white/10 rounded-full border border-white/10 flex items-center p-1 transition-colors hover:bg-white/15"
            >
              <motion.div 
                layout
                className="w-6 h-6 bg-brand rounded-full shadow-md"
                animate={{ x: billing === "monthly" ? 0 : 24 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={cn("text-sm font-bold transition-colors flex items-center gap-2", billing === "yearly" ? "text-white" : "text-muted-foreground")}>
              Annually <span className="text-[10px] bg-brand/20 text-brand px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>
            </span>
          </motion.div>
        </div>

        {/* ── Pricing Grid ── */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {TIERS.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
              className={cn(
                "relative flex flex-col p-8 rounded-[32px] border backdrop-blur-xl h-full",
                tier.popular 
                  ? "bg-[#09090b]/80 border-brand/50 shadow-[0_0_50px_-12px_rgba(var(--brand),0.3)] md:-mt-8 md:pb-12" 
                  : "bg-white/[0.02] border-white/5"
              )}
            >
              {/* Popular glow overlay */}
              {tier.popular && (
                <div className="absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent rounded-[32px] pointer-events-none" />
              )}

              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-brand-foreground text-[10px] font-extrabold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg shadow-brand/20 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  {tier.name === "Lifetime" && <Crown className="w-5 h-5 text-amber-400" />}
                  {tier.name}
                </h3>
                <p className="text-sm text-muted-foreground min-h-[40px]">{tier.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {billing === "yearly" && tier.name === "Pro Member" ? "$7.99" : tier.price}
                  </span>
                  {tier.price !== "$0" && (
                    <span className="text-sm font-medium text-muted-foreground">/{tier.period}</span>
                  )}
                </div>
              </div>

              <Link 
                href="/auth"
                className={cn(
                  "w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 mb-8",
                  tier.buttonVariant === "brand" 
                    ? "bg-brand text-brand-foreground hover:bg-brand/90 shadow-lg shadow-brand/25" 
                    : tier.buttonVariant === "gold"
                    ? "bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:opacity-90 shadow-lg shadow-amber-500/25"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                )}
              >
                {tier.buttonText}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="space-y-4 flex-1">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn("mt-0.5 rounded-full p-0.5 shrink-0", tier.popular ? "bg-brand/20 text-brand" : "bg-white/10 text-white")}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-sm text-white/90">{feature}</span>
                  </div>
                ))}
                
                {tier.missing?.map((feature, i) => (
                  <div key={`missing-${i}`} className="flex items-start gap-3 opacity-40">
                    <div className="mt-0.5 rounded-full p-0.5 shrink-0 bg-white/5 text-white/50">
                      <X className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-sm text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}
