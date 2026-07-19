"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

const BROWSE_CATS = CATEGORIES.slice(0, 16);

export function BrowseByCategory() {
  const [active, setActive] = useState(BROWSE_CATS[0].slug);

  return (
    <section className="py-12 bg-muted/[0.03] border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div className="space-y-1.5">
            <span className="section-label">Browse by Style</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Explore Categories</h2>
            <p className="text-xs text-muted-foreground/60">Discover AI prompts by theme and subject</p>
          </div>
          <Link
            href="/category"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline underline-offset-3"
          >
            See all categories <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Pill tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {BROWSE_CATS.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActive(cat.slug)}
              suppressHydrationWarning
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300",
                active === cat.slug
                  ? "live-border-chip text-white shadow-[0_0_15px_rgba(var(--brand),0.3)] hover:scale-105"
                  : "bg-transparent text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              )}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Active category CTA */}
        {(() => {
          const cat = BROWSE_CATS.find((c) => c.slug === active);
          if (!cat) return null;
          return (
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-secondary/30">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  {cat.icon}
                </div>
                <div>
                  <p className="font-extrabold text-xs">{cat.name}</p>
                  <p className="text-[10px] text-muted-foreground/70 leading-snug">{cat.description}</p>
                </div>
              </div>
              <Link
                href={`/category/${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Browse <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          );
        })()}

      </div>
    </section>
  );
}
