"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SponsorBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pv:banner:dismissed");
    if (!dismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      document.documentElement.style.setProperty("--banner-height", "40px");
    } else {
      document.documentElement.style.setProperty("--banner-height", "0px");
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("pv:banner:dismissed", "true");
    document.documentElement.style.setProperty("--banner-height", "0px");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sponsor-banner"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 380, duration: 0.35 }}
          className="fixed top-0 left-0 right-0 z-[51] h-10 border-b border-white/[0.06] flex items-center justify-center px-4 bg-gradient-to-r from-teal-950/95 via-[oklch(0.055_0.018_185)]/95 to-teal-950/95 text-white select-none overflow-hidden"
        >
          {/* Hover sheen */}
          <div className="absolute inset-0 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 pointer-events-none" />

          {/* Decorative Radial Glow */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 120%, rgba(139, 92, 246, 0.4), transparent 70%)`,
            }}
          />

          <div className="relative flex items-center justify-between w-full max-w-7xl font-sans text-xs">
            <div className="flex-1 flex justify-center items-center gap-2.5 truncate pr-8">
              <span className="shrink-0 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gold text-slate-950 shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
                <Sparkles className="w-2.5 h-2.5" />
                Sponsor
              </span>
              <a
                href="/sponsor"
                className="font-bold tracking-tight text-slate-100 hover:text-white transition-colors hover:underline flex items-center gap-1 truncate"
              >
                Become a sponsor — partner with PromptVerse and reach AI prompt creators. Learn More →
              </a>
            </div>

            <motion.button
              onClick={handleDismiss}
              aria-label="Close sponsor banner"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
