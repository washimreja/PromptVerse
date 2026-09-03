"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { PVLogo } from "@/components/layout/Header";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

// Google Icon Component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// Discord Icon Component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 127.14 96.36" fill="currentColor">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.68,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.1,46,96,53,91,65.69,84.69,65.69Z" />
  </svg>
);

// Github Icon Component
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    
    if (errorParam === "Configuration" || errorParam === "OAuthSignin") {
      toast.error("OAuth Sign In isn't configured yet.", {
        description: "The administrator needs to add OAuth credentials in .env.local. You can still continue using Email & Password.",
        duration: 8000,
      });
      // Clear the error from the URL
      window.history.replaceState(null, "", "/auth");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (mode === "signup" && !name) {
      toast.error("Please enter your name");
      return;
    }

    const tempDomains = ["tempmail.com", "mailinator.com", "guerrillamail.com", "10minutemail.com", "yopmail.com", "temp-mail.org"];
    const emailDomain = email.split("@")[1]?.toLowerCase();
    
    if (tempDomains.includes(emailDomain)) {
      toast.error("Temporary emails are not allowed on this platform.");
      return;
    }

    setIsLoading(true);
    
    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          toast.error(data.message || "Registration failed");
          setIsLoading(false);
          return;
        }
        
        toast.success("Account created successfully! Logging in...");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error !== "CredentialsSignin" ? result.error : "Invalid email or password");
        setIsLoading(false);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get("redirect");
        const autoCheckout = urlParams.get("autoCheckout");
        
        let destination = redirectPath || "/";
        if (autoCheckout && destination.includes("/pricing")) {
          destination = `/pricing?autoCheckout=${autoCheckout}`;
        }

        router.push(destination);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get("redirect");
    const autoCheckout = urlParams.get("autoCheckout");
    
    let callbackUrl = redirectPath || "/";
    if (autoCheckout && callbackUrl.includes("/pricing")) {
      callbackUrl = `/pricing?autoCheckout=${autoCheckout}`;
    }

    signIn(provider, { callbackUrl });
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#09090b] overflow-hidden">
      {/* ── Background Glow ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="absolute w-[60vw] h-[60vw] rounded-full bg-violet-600/10 blur-[150px]" />
      </div>

      <div className="relative w-full max-w-[440px] z-10">
        {/* ── Main Authentication Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative bg-[#111113] border border-white/[0.08] p-8 sm:p-10 rounded-[20px] shadow-2xl flex flex-col"
        >
          {/* Close Button */}
          <Link href="/" className="absolute top-6 right-6 text-muted-foreground hover:text-white transition-colors p-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 1L1 11M1 1L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8 mt-2">
            <h1 className="text-[26px] font-bold tracking-tight mb-2 text-white">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access your prompts and collections
            </p>
          </div>

          {/* Social Logins */}
          <div className="w-full space-y-3 mb-8">
            <button 
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md bg-[#222225] hover:bg-[#2a2a2e] border border-white/[0.08] transition-all duration-200 font-medium text-sm text-white"
            >
              <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center p-1">
                <GoogleIcon className="w-full h-full text-black" />
              </div>
              Continue with Google
            </button>
            <button 
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md bg-[#1877F2] hover:bg-[#1877F2]/90 transition-all duration-200 font-medium text-sm text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 mb-6">
            <div className="h-px bg-white/[0.08] flex-1" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60">OR CONTINUE WITH EMAIL</span>
            <div className="h-px bg-white/[0.08] flex-1" />
          </div>

          {/* Segmented Toggle */}
          <div className="relative w-full flex bg-[#0a0a0b] p-1 rounded-lg mb-6 border border-white/[0.05]">
            {["signin", "signup"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab as any)}
                className={cn(
                  "relative w-1/2 py-2 text-[13px] font-semibold tracking-tight rounded-md transition-colors z-10",
                  mode === tab ? "text-white" : "text-muted-foreground hover:text-white"
                )}
              >
                {tab === "signin" ? "Sign In" : "Create Account"}
                {mode === tab && (
                  <motion.div
                    layoutId="auth-tab-indicator"
                    className="absolute inset-0 bg-[#222225] rounded-md shadow-sm border border-white/[0.05]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <AnimatePresence mode="popLayout">
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5"
                >
                  <label className="text-[11px] font-bold text-muted-foreground/70 tracking-wider uppercase ml-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-[#161618] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-white/20 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground/70 tracking-wider uppercase ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#161618] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-white/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold text-muted-foreground/70 tracking-wider uppercase">Password</label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#161618] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-foreground/40 focus:outline-none focus:border-white/20 transition-all"
              />
            </div>

            {mode === "signin" && (
              <div className="flex justify-end pt-1 pb-2">
                <a href="#" className="text-[12px] font-medium text-[#7c3aed] hover:text-[#8b5cf6] transition-colors">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full mt-2 bg-white text-black font-bold text-[15px] py-3.5 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:bg-white"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
              ) : (
                mode === "signin" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-[11px] text-muted-foreground/50 text-center mt-6">
            By continuing, you agree to our <a href="#" className="underline hover:text-muted-foreground transition-colors">Terms</a> and <a href="#" className="underline hover:text-muted-foreground transition-colors">Privacy Policy</a>
          </p>
        </motion.div>

      </div>
    </main>
  );
}
