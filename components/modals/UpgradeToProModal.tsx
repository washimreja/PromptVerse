"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Lock, Zap } from "lucide-react";
import Link from "next/link";

interface UpgradeModalContextType {
  isOpen: boolean;
  isPro: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
}

const UpgradeModalContext = createContext<UpgradeModalContextType | undefined>(
  undefined
);

import { getUserProfile } from "@/app/actions/user";

export function UpgradeModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);

  React.useEffect(() => {
    getUserProfile().then((user) => {
      if (user?.membership === "PRO") {
        setIsPro(true);
      }
    });
  }, []);

  const openUpgradeModal = () => {
    if (isPro) return; // Don't open if already pro
    setIsOpen(true);
  };
  const closeUpgradeModal = () => setIsOpen(false);

  return (
    <UpgradeModalContext.Provider
      value={{ isOpen, isPro, openUpgradeModal, closeUpgradeModal }}
    >
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60"
              onClick={closeUpgradeModal}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="relative w-full max-w-md bg-[#0F0F12] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(255,184,0,0.15)] overflow-hidden z-10"
            >
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500" />

              {/* Close Button */}
              <button
                onClick={closeUpgradeModal}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={16} />
              </button>

              <div className="p-8 pb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20">
                  <Lock size={32} className="text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  Premium Prompt Unlocked!
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  This is a Premium Spotlight prompt. Upgrade to PromptVerse Pro to copy this prompt and access thousands of exclusive, high-tier AI parameters.
                </p>

                <div className="w-full space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Sparkles size={16} className="text-yellow-500" />
                    <span>Unlimited Premium Prompts</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Zap size={16} className="text-yellow-500" />
                    <span>Early access to new AI Models</span>
                  </div>
                </div>

                <Link
                  href="/pricing"
                  onClick={closeUpgradeModal}
                  className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Upgrade to Pro
                </Link>
                
                <button
                  onClick={closeUpgradeModal}
                  className="mt-4 text-sm text-white/50 hover:text-white transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </UpgradeModalContext.Provider>
  );
}

export function useUpgradeModal() {
  const context = useContext(UpgradeModalContext);
  if (context === undefined) {
    throw new Error(
      "useUpgradeModal must be used within an UpgradeModalProvider"
    );
  }
  return context;
}
