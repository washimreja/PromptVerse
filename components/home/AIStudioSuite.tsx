import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Wand2, RefreshCcw, Focus } from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    id: "smart-shot",
    titlePrefix: "Smart ",
    titleAccent: "Shot",
    description: "Highly detailed cinematic photography and portrait generation",
    image: "/images/tools/smart_shot.png",
    icon: Focus,
  },
  {
    id: "relight",
    titlePrefix: "Relight ",
    titleAccent: "Scene",
    description: "Adjust atmospheric lighting to match a reference mood",
    image: "/images/tools/relight.png",
    icon: Sparkles,
  },
  {
    id: "replace-bg",
    titlePrefix: "Replace ",
    titleAccent: "Background",
    description: "Swap the scene behind your subject seamlessly",
    image: "/images/tools/replace_bg.png",
    icon: RefreshCcw,
  },
  {
    id: "edit-image",
    titlePrefix: "Edit ",
    titleAccent: "Image",
    description: "Modify details, add elements, or refine specific areas",
    image: "/images/tools/edit_image.png",
    icon: Wand2,
  },
];

export function AIStudioSuite() {
  return (
    <section className="w-full py-6 md:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          PromptVerse Suite
        </h2>
        <Link
          href="/studio"
          className="text-xs md:text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
        >
          More <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.id}
            href={`/studio/${tool.id}`}
            className="group relative rounded-[14px] p-[1px] overflow-hidden cursor-pointer"
          >
            {/* Gradient Border (Green on the left, fading to dark) */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-zinc-800/50 to-zinc-900 rounded-[14px]" />
            
            {/* Inner Card Background */}
            <div className="relative flex items-center p-2 rounded-[13px] bg-[#0c0c0e] h-full transition-colors group-hover:bg-[#121215]">
              
              {/* Image Container (Small & Compact) */}
              <div className="relative shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-[8px] overflow-hidden bg-zinc-900 z-10 border border-white/10">
                <Image
                  src={tool.image}
                  alt={tool.titlePrefix + tool.titleAccent}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Tiny Badge Icon */}
                <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-md p-1 rounded border border-white/10">
                  <tool.icon size={10} className="text-white" />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col justify-center ml-2.5 sm:ml-3 pr-1 z-10 overflow-hidden">
                <h3 className="text-[12px] sm:text-[15px] font-semibold tracking-tight text-white mb-0.5 truncate">
                  {tool.titlePrefix}
                  <span className="text-emerald-400">{tool.titleAccent}</span>
                </h3>
                <p className="text-[9px] sm:text-[11px] text-muted-foreground leading-[1.3] line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
