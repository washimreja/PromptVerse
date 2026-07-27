"use client";

import Link from "next/link";
import { Crown, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function PremiumBanner() {
  return (
    <section className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-r from-[#0d0e15] via-[#12131d] to-[#0d0e15] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]"
      >
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4 shadow-sm">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>PromptVerse PRO Membership</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Unlock Unlimited Access to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                10,000+ Premium Prompts & Parameters
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed mb-6">
              Get full commercial access, exact Midjourney parameters, negative prompts, seed numbers, and multi-device sync.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-white/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Instant One-Click Copy
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Midjourney v6 & Flux
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Priority Support
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-black text-xs font-black hover:brightness-110 transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 uppercase tracking-wider"
            >
              <span>Upgrade to PRO Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-[11px] text-muted-foreground/60 font-medium">
              30-day money-back guarantee • Cancel anytime
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
