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
    title: "Navigate",
    links: [
      { href: "/",         label: "Home" },
      { href: "/category", label: "Categories" },
      { href: "/models",   label: "AI Models" },
      { href: "/search",   label: "Search" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms",   label: "Terms of Use" },
    ],
  },
];

const SOCIAL_LINKS = [
  { href: SITE_INSTAGRAM, label: "Instagram", Icon: InstagramIcon },
  { href: SITE_GITHUB,    label: "GitHub",    Icon: GitHubIcon    },
  { href: SITE_LINKEDIN,  label: "LinkedIn",  Icon: LinkedInIcon  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-background overflow-hidden">
      {/* Subtle gradient top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="inline-flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-4.5 h-4.5 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">{SITE_NAME}</div>
                <div className="text-xs text-muted-foreground tracking-widest uppercase">{SITE_TAGLINE}</div>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm text-pretty">
              The easiest place on the internet to discover, explore, and instantly copy premium AI prompts — for creators, designers, and prompt engineers.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${SITE_NAME} on ${s.label}`}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Made with{" "}
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" aria-hidden="true" />{" "}
            by{" "}
            <a
              href={SITE_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-1"
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
