"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { AI_MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BrowseByModel() {
  return (
    <section className="py-12 bg-muted/[0.02] border-b border-border/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div className="space-y-1.5">
            <span className="section-label">AI Models</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Browse by AI Model</h2>
            <p className="text-xs text-muted-foreground/60">Find the perfect prompt for every AI tool</p>
          </div>
          <Link
            href="/models"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline underline-offset-3"
          >
            See all models <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Model grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {AI_MODELS.slice(0, 10).map((model, i) => (
            <motion.div
              key={model.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/models/${model.slug}`}
                className={cn(
                  "group flex flex-col gap-3 p-3.5",
                  "live-border-card",
                  "hover:-translate-y-1 transition-transform duration-300 cursor-pointer block h-full"
                )}
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm border"
                    style={{
                      backgroundColor: `${model.color}18`,
                      borderColor: `${model.color}28`,
                    }}
                  >
                    {model.icon}
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className="text-[13px] font-extrabold leading-tight group-hover:text-primary transition-colors">
                    {model.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 leading-snug line-clamp-2">
                    {model.description}
                  </p>
                </div>

                {/* Best for tags (first 2) */}
                <div className="flex flex-wrap gap-2.5 mt-1">
                  {model.bestFor.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-extrabold tracking-wide text-muted-foreground/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
