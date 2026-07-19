"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Eye, Copy, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthModal } from "../auth/AuthModalContext";
import { useUpgradeModal } from "../modals/UpgradeToProModal";

export interface StudioPrompt {
  id: string;
  title: string;
  imageUrl: string;
  views: number;
  isPremium?: boolean;
  promptText: string;
  negativePrompt?: string;
  model?: string;
}

interface StudioPromptCardProps {
  prompt: StudioPrompt;
  onPremiumClick: () => void;
}

export function StudioPromptCard({ prompt, onPremiumClick }: StudioPromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const { openModal } = useAuthModal();
  const { isPro } = useUpgradeModal();

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (prompt.isPremium && !isPro) {
      onPremiumClick();
      return;
    }

    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    if (!liked) {
      toast.success("Added to favorites!");
    }
  };

  return (
    <div
      className="group relative w-full rounded-3xl overflow-hidden cursor-pointer bg-[#090A0F] border border-white/5 shadow-xl"
      style={{ aspectRatio: "4/5" }}
      onClick={() => prompt.isPremium && !isPro && onPremiumClick()}
    >
      {/* Background Image */}
      <Image
        src={prompt.imageUrl}
        alt={prompt.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Sleek Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Top Section: Badges & Actions */}
      <div className="absolute top-4 inset-x-4 flex items-start justify-between z-10">
        {/* FREE / PRO Badge */}
        {prompt.isPremium ? (
          <div className="flex items-center gap-1.5 bg-[#FFB800]/20 backdrop-blur-md border border-[#FFB800]/30 text-[#FFB800] text-[10px] sm:text-[11px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(255,184,0,0.2)]">
            <Sparkles size={12} className="shrink-0" />
            PRO
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-[11px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(16,185,129,0.2)]">
            FREE
          </div>
        )}

        {/* Action Buttons: Like & Views */}
        <div className="flex flex-col gap-2 items-end">
          <button
            onClick={handleLike}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors shadow-lg"
          >
            <Heart size={14} className={cn("transition-colors", liked ? "fill-rose-500 text-rose-500" : "text-white")} />
          </button>
          
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10 shadow-lg">
            <Eye size={12} className="text-white/60" />
            <span className="text-[10px] font-bold text-white/90">
              {prompt.views}k
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Title & Copy Button */}
      <div className="absolute bottom-4 inset-x-4 z-10 flex flex-col gap-3">
        <div>
          {/* Subtle Model Name (Optional) */}
          {prompt.model && (
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1 block">
              {prompt.model}
            </span>
          )}
          
          {/* Clean Title */}
          <h3 className="text-sm sm:text-base font-bold text-white leading-tight line-clamp-2">
            {prompt.title}
          </h3>
        </div>

        {/* Full-width sleek Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-xl py-2.5 transition-all duration-300 active:scale-[0.98]"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          <span className="text-xs font-bold tracking-wide uppercase">
            {copied ? "Copied to Clipboard" : "Copy Prompt"}
          </span>
        </button>
      </div>
    </div>
  );
}
