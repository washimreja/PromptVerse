"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { X } from "lucide-react";
import { useAuthModal } from "./AuthModalContext";
import { useRouter } from "next/navigation";

// Google Icon Component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export function PremiumAuthModal() {
  const { isOpen, closeModal, reason } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: window.location.href });
  };

  const handleEmailNavigation = () => {
    closeModal();
    router.push("/auth");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[420px] bg-[#111113] border border-white/[0.08] p-8 rounded-[20px] shadow-2xl pointer-events-auto overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 text-muted-foreground hover:text-white transition-colors bg-white/[0.03] hover:bg-white/[0.08] p-1.5 rounded-full"
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8 mt-2 relative z-10">
                <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center mb-4 border border-violet-500/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h2 className="text-[22px] font-bold tracking-tight mb-2 text-white">Join PromptVerse</h2>
                <p className="text-sm text-muted-foreground px-4">
                  {reason}
                </p>
              </div>

              {/* Actions */}
              <div className="w-full space-y-3 mb-6 relative z-10">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-gray-100 transition-all duration-200 font-bold text-sm text-black disabled:opacity-70 shadow-[0_0_0_1px_rgba(255,255,255,1)]"
                >
                  <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center p-1">
                    <GoogleIcon className="w-full h-full text-black" />
                  </div>
                  {isLoading ? "Connecting..." : "Continue with Google"}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#1877F2]/90 transition-all duration-200 font-bold text-sm text-white disabled:opacity-70"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  Continue with Facebook
                </button>
              </div>

              {/* Divider */}
              <div className="w-full flex items-center gap-4 mb-6 relative z-10">
                <div className="h-px bg-white/[0.08] flex-1" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60">OR</span>
                <div className="h-px bg-white/[0.08] flex-1" />
              </div>

              {/* Email Link */}
              <button
                onClick={handleEmailNavigation}
                className="w-full py-3 rounded-xl bg-[#1a1a1c] hover:bg-[#222225] border border-white/[0.05] transition-all duration-200 font-semibold text-sm text-white flex items-center justify-center gap-2 relative z-10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Continue with Email
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
