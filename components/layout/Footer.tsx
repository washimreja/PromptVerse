"use client";

import Link from "next/link";
import { Sparkles, Heart, ExternalLink } from "lucide-react";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_INSTAGRAM,
  SITE_GITHUB,
  SITE_LINKEDIN,
  SITE_AUTHOR,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ── Custom SVG Social Icons ─────────────────── */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const FOOTER_LINKS = [
  {
    title: "Explore Links",
    links: [
      { href: "/",         label: "Discover Feed" },
      { href: "/category", label: "Categories" },
      { href: "/models",   label: "AI Models" },
      { href: "/search",   label: "Search Box" },
    ],
  },
  {
    title: "Legal Pillars",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms",   label: "Terms of Use" },
    ],
  },
];

const SOCIAL_LINKS = [
  { href: SITE_INSTAGRAM, label: "Instagram", Icon: InstagramIcon, hoverColor: "hover:bg-pink-500/25 hover:text-pink-500" },
  { href: SITE_GITHUB,    label: "GitHub",    Icon: GitHubIcon,    hoverColor: "hover:bg-slate-700/25 hover:text-foreground" },
  { href: SITE_LINKEDIN,  label: "LinkedIn",  Icon: LinkedInIcon,  hoverColor: "hover:bg-blue-600/25 hover:text-blue-500" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/10 bg-background/50 overflow-hidden noise-overlay">
      
      {/* Subtle brand glow line separating the footer */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-indigo-500 via-purple-500 to-gold" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* V3 Stats horizontal strip bar */}
        <div className="grid grid-cols-3 gap-4 border border-border/20 rounded-2xl bg-card/45 backdrop-blur-md p-4 mb-12 text-center max-w-3xl mx-auto shadow-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-extrabold text-primary">250+</span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/60">AI Templates</span>
          </div>
          <div className="flex flex-col gap-0.5 border-x border-border/10">
            <span className="text-sm font-extrabold text-gold">12+</span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/60">Models Optimization</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-extrabold text-primary">Instant</span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/60">Copy Action</span>
          </div>
        </div>

        {/* Main layout grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand block column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="inline-flex items-center gap-2 group w-fit">
              <div className="font-extrabold text-lg leading-tight tracking-tight">
                {SITE_NAME}
                <span className="text-[10px] block font-extrabold text-muted-foreground/50 tracking-widest uppercase mt-0.5">{SITE_TAGLINE}</span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-sm font-semibold">
              The easiest place on the internet to copy, customize, and discover creative prompt templates. Designed for artists, photographers, editors, and creators.
            </p>

            {/* Social Buttons with brand color triggers */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${SITE_NAME} on ${s.label}`}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-xl bg-secondary/40 border border-border/20 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 shadow-sm",
                    s.hoverColor
                  )}
                >
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links Columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/60">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300 hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom credits bar */}
        <div className="mt-12 pt-6 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-semibold text-muted-foreground/60">
            © {year} {SITE_NAME}. All rights reserved. Built for creators.
          </p>
          
          <p className="text-[10px] font-semibold text-muted-foreground/65 flex items-center gap-1.5">
            Made with{" "}
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" aria-hidden="true" />{" "}
            by{" "}
            <a
              href={SITE_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-foreground hover:text-primary transition-colors duration-300 inline-flex items-center gap-1 hover:underline underline-offset-2"
            >
              {SITE_AUTHOR}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
