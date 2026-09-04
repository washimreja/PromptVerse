"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* ── Top Atmospheric Spotlight (Refined Sapphire & Cyan) ── */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.25, 0.38, 0.25],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-gradient-to-tr from-cyan-500/25 via-indigo-600/20 to-teal-400/15 blur-[150px] rounded-full mix-blend-screen"
      />

      {/* ── Secondary Floating Warm Champagne & Cyan Glow ── */}
      <motion.div
        animate={{
          x: [-25, 25, -25],
          y: [-15, 15, -15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[480px] h-[280px] bg-cyan-500/15 blur-[130px] rounded-full"
      />

      {/* ── Warm Champagne Accent Light ── */}
      <motion.div
        animate={{
          x: [25, -25, 25],
          y: [15, -15, 15],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 right-1/4 w-[420px] h-[240px] bg-amber-400/10 blur-[130px] rounded-full"
      />

      {/* ── Architectural Dot Grid Overlay with radial mask ── */}
      <div 
        className="absolute inset-0 opacity-[0.045] bg-[radial-gradient(oklch(0.68_0.16_195)_1.2px,transparent_1.2px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_60%,transparent_100%)]" 
      />

      {/* ── Seamless Bottom Gradient Fade to Deep Obsidian ── */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#08090d] via-[#08090d]/85 to-transparent" />
    </div>
  );
}
