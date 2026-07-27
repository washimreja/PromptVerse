"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* ── Top Ambient Glow Mesh ── */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-cyan-500/20 via-brand/20 to-blue-600/10 blur-[140px] rounded-full mix-blend-screen"
      />

      {/* ── Secondary Floating Cyan Glow ── */}
      <motion.div
        animate={{
          x: [-30, 30, -30],
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[450px] h-[250px] bg-cyan-400/15 blur-[120px] rounded-full"
      />

      {/* ── Third Floating Teal Glow ── */}
      <motion.div
        animate={{
          x: [30, -30, 30],
          y: [20, -20, 20],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 right-1/4 w-[400px] h-[220px] bg-teal-500/10 blur-[110px] rounded-full"
      />

      {/* ── Grid Pattern Overlay ── */}
      <div 
        className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" 
      />

      {/* ── Bottom Gradient Fade to Dark ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#040508] via-[#040508]/80 to-transparent" />
    </div>
  );
}
