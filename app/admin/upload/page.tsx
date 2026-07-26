import React from "react";
export const dynamic = "force-dynamic";
import { getUserProfile } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { PromptUploadForm } from "@/components/admin/PromptUploadForm";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin upload | PromptVerse Console",
  description: "Publish and index new premium prompts to the PromptVerse repository database.",
};

export default async function AdminUploadPage() {
  const user = await getUserProfile();

  // Protect page at server-level: require ADMIN role
  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background py-14 noise-overlay">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Guard Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 animate-fade-up">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-white transition-all duration-300 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-all duration-300" />
            <span>Return to Dashboard</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.05)]">
            <ShieldCheck className="h-4 w-4" />
            <span>Admin Session Active</span>
          </div>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-12 animate-fade-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent">
            Publish New Prompt
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
            Input prompt details, configure aesthetic categories, and upload previews. Newly submitted prompts will be immediately indexed and live for visitors.
          </p>
        </div>

        {/* Upload Form Component */}
        <div className="animate-scale-in">
          <PromptUploadForm />
        </div>

      </div>
    </div>
  );
}
