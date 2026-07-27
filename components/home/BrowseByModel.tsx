"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { AI_MODELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BrowseByModel() {
  return (
    <section className="py-8 sm:py-12 bg-muted/[0.02] border-b border-border/10">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-7">
          <div className="space-y-1">
            <span className="section-label">AI Models</span>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">Browse by AI Model</h2>
            <p className="text-xs text-muted-foreground/60">Find the perfect prompt for every AI tool</p>
          </div>
          <Link
            href="/models"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline underline-offset-3"
          >
            See all models <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Model 3-Column Mobile Grid (3 items in 1 line) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {AI_MODELS.slice(0, 12).map((model, i) => (
            <motion.div
              key={model.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link
                href={`/models/${model.slug}`}
                className={cn(
                  "group flex flex-col justify-between p-2.5 sm:p-3.5 rounded-xl bg-[#090a0f]/90 border border-white/10 backdrop-blur-md",
                  "hover:-translate-y-1 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer block h-full"
                )}
              >
                {/* Icon + badge */}
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs sm:text-sm border shrink-0"
                    style={{
                      backgroundColor: `${model.color}18`,
                      borderColor: `${model.color}28`,
                    }}
                  >
                    {model.icon}
                  </div>
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground/30 group-hover:text-cyan-400 transition-colors" />
                </div>

                {/* Name & Short Description */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-[13px] font-extrabold leading-tight text-white group-hover:text-cyan-300 transition-colors truncate">
                    {model.name}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground/60 mt-0.5 leading-snug line-clamp-1">
                    {model.description}
                  </p>
                </div>

                {/* Best for tags (first tag only on mobile to keep ratio clean) */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {model.bestFor.slice(0, 1).map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] sm:text-[9px] font-extrabold text-cyan-400/80 truncate"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 sm:hidden text-center">
          <Link href="/models" className="text-xs font-bold text-primary flex items-center justify-center gap-1">
            See all models <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
