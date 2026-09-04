"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ExternalLink } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE, SITE_INSTAGRAM, SITE_AUTHOR } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // Keep Footer ONLY on Home ("/") and Profile ("/profile")
  const isAllowedPage = pathname === "/" || pathname === "/profile";
  if (!isAllowedPage) return null;

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#08090d] text-white py-8 px-4 sm:px-6 lg:px-8 mb-20 md:mb-0 select-none">
      {/* Subtle top glow line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent" />

      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand info */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link href="/" className="font-black text-base tracking-tight hover:text-cyan-400 transition-colors">
            {SITE_NAME}
          </Link>
          <p className="text-xs text-muted-foreground/75 font-medium max-w-xs">
            {SITE_TAGLINE} — Hand-crafted AI prompt engine.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-muted-foreground/80">
          <Link href="/category" className="hover:text-white transition-colors">Categories</Link>
          <Link href="/models" className="hover:text-white transition-colors">AI Models</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center md:items-end gap-1 text-[11px] font-medium text-muted-foreground/60">
          <span>© {year} {SITE_NAME}. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by{" "}
            <a
              href={SITE_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-cyan-400 transition-colors inline-flex items-center gap-0.5 font-bold"
            >
              {SITE_AUTHOR}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
