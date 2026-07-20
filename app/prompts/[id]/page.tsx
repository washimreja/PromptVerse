import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getPromptById,
  getRelatedPrompts,
  getAllPromptSlugs,
} from "@/lib/prompts";
import { CATEGORIES, AI_MODELS } from "@/lib/constants";
import { SvgThumbnail } from "@/components/prompts/PromptCard";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { CopyButton } from "@/components/prompts/CopyButton";
import { AdSlot } from "@/components/ads/AdSlot";
import { ModelLogo } from "@/components/models/ModelLogos";
import { PromptDetailClient } from "@/components/prompts/PromptDetailClient";
import { getUserProfile } from "@/app/actions/user";
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Eye,
  Info,
  Sliders,
  ChevronRight,
  User,
  GitBranch,
  Lock,
  CheckCircle2,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const prompt = await getPromptById(id);
  if (!prompt) return {};

  return {
    title: prompt.title,
    description: prompt.description,
    openGraph: {
      title: prompt.title,
      description: prompt.description,
      type: "article",
    },
  };
}

export default async function PromptDetailPage({ params }: Props) {
  const { id } = await params;
  const prompt = await getPromptById(id);
  if (!prompt) notFound();

  const related = await getRelatedPrompts(prompt.id, prompt.category, 4);
  const categoryObj = CATEGORIES.find((c) => c.slug === prompt.category);
  const modelObj = AI_MODELS.find((m) => m.slug === prompt.model);

  // Get current user from DB
  const dbUser = await getUserProfile();
  const userIsPro = dbUser?.membership === "PRO";

  // Determine if prompt is Premium
  const isPremium = prompt.isPro === true;
  
  // Determine if it should be locked for the current user
  const isLocked = isPremium && !userIsPro;

  // Preview text: first 2–3 lines (~300 chars) for premium prompts
  const PREVIEW_LENGTH = 280;
  const previewText = isLocked
    ? prompt.prompt.slice(0, PREVIEW_LENGTH) + (prompt.prompt.length > PREVIEW_LENGTH ? "…" : "")
    : prompt.prompt;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* ── Breadcrumbs ── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-muted-foreground/60 mb-8 flex-wrap">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/category" className="hover:text-primary transition-colors">Categories</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/category/${prompt.category}`} className="hover:text-primary transition-colors">{categoryObj?.name}</Link>
        <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
        <span className="text-muted-foreground truncate max-w-[150px] sm:max-w-xs">{prompt.title}</span>
      </nav>

      {/* ── Main Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* Left Column: Preview & Prompt Content */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ── Title + Badge ── */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{prompt.title}</h1>
              {prompt.description && (
                <p className="text-sm text-muted-foreground/70 leading-relaxed">{prompt.description}</p>
              )}
            </div>
            {/* PRO / FREE Badge */}
            {isPremium ? (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-400/20 to-yellow-300/10 text-amber-400 border border-amber-400/30 shadow-[0_2px_16px_rgba(245,158,11,0.20)]">
                  <Lock className="h-3 w-3" />
                  PRO
                </span>
              </div>
            ) : (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-[0_2px_16px_rgba(34,197,94,0.20)]">
                  <CheckCircle2 className="h-3 w-3" />
                  FREE
                </span>
              </div>
            )}
          </div>

          {/* ── Large Preview Panel ── */}
          <div
            className="relative rounded-3xl overflow-hidden border border-border/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-card w-full"
            style={{ aspectRatio: prompt.aspectRatio ? prompt.aspectRatio.replace(":", "/") : "21/9" }}
          >
            {prompt.previewImage && (prompt.previewImage.startsWith("http") || !prompt.previewImage.endsWith(".svg")) ? (
              <img
                src={prompt.previewImage}
                alt={prompt.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <SvgThumbnail prompt={prompt} />
              </div>
            )}

            {/* Premium overlay on image for PRO (only if locked) */}
            {isLocked && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            )}
          </div>

          {/* ── Prompt Core Panel ── */}
          <div className="border border-border/10 rounded-3xl p-6 bg-card/60 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/10 pb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Prompt Text
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60 font-semibold">
                <Clock className="h-3.5 w-3.5" />
                <span>{prompt.estimatedTime}</span>
              </div>
            </div>

            {/* PRO lock: preview with blur + unlock CTA */}
            {isLocked ? (
              <div className="relative">
                <pre className="font-mono text-sm leading-relaxed p-5 bg-secondary/30 text-foreground rounded-2xl border border-border/10 overflow-hidden whitespace-pre-wrap select-none blur-[2px] pointer-events-none line-clamp-4">
                  {previewText}
                </pre>
                {/* Fade gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card via-card/80 to-transparent rounded-b-2xl pointer-events-none" />

                {/* Unlock CTA */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 gap-3">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                      <Lock className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground/80">
                      This prompt requires <span className="text-amber-400 font-black">PromptVerse Pro</span>
                    </p>
                  </div>
                  <Link
                    href="/pro"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-black shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.55)] hover:scale-105 transition-all duration-200 active:scale-95"
                  >
                    🔒 Unlock Pro — Get Full Access
                  </Link>
                  <p className="text-[10px] text-muted-foreground/40">
                    Unlock 100+ premium prompts with PromptVerse Pro
                  </p>
                </div>
              </div>
            ) : (
              /* FREE: full prompt, no restrictions */
              <div className="relative group">
                <div className="absolute right-3 top-3 z-10">
                  <CopyButton textToCopy={prompt.prompt} isPro={false} className="py-2 px-3 rounded-lg text-xs" />
                </div>
                <pre className="font-mono text-sm leading-relaxed p-5 pt-12 sm:pt-5 bg-secondary/20 text-foreground rounded-2xl border border-border/10 overflow-x-auto whitespace-pre-wrap select-all selection:bg-primary/20">
                  {prompt.prompt}
                </pre>
              </div>
            )}

            {/* Negative Prompt (only for free or below preview for pro) */}
            {!isLocked && prompt.negativePrompt && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/10 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500/80">
                    Negative Prompt
                  </h3>
                </div>
                <div className="relative group">
                  <div className="absolute right-3 top-3 z-10">
                    <CopyButton textToCopy={prompt.negativePrompt} isPro={false} className="py-2 px-3 rounded-lg text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20" />
                  </div>
                  <pre className="font-mono text-xs leading-relaxed p-5 pt-12 sm:pt-5 bg-rose-500/5 text-rose-600/90 dark:text-rose-400/90 rounded-2xl border border-rose-500/10 overflow-x-auto whitespace-pre-wrap select-all">
                    {prompt.negativePrompt}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Client-side actions (favorite button, share) */}
          <PromptDetailClient prompt={prompt} isPremium={isPremium} />

          {/* AdSense Placement */}
          <AdSlot format="rectangle" />
        </div>

        {/* Right Column: Settings & Metadata */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* PRO Upgrade card (right column for premium only if locked) */}
          {isLocked && (
            <div className="relative overflow-hidden rounded-3xl p-5 border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-yellow-300/5 to-transparent shadow-[0_8px_32px_rgba(245,158,11,0.15)]">
              <div className="absolute top-3 right-3 text-2xl">✨</div>
              <h3 className="font-black text-sm mb-1 text-amber-400">PromptVerse Pro</h3>
              <p className="text-xs text-muted-foreground/70 leading-relaxed mb-4">
                Unlock this prompt and 100+ premium templates with unlimited copies, negative prompts, and advanced configs.
              </p>
              <Link
                href="/pro"
                className="block w-full py-2.5 rounded-xl text-center text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-black hover:opacity-95 transition-opacity shadow-[0_2px_12px_rgba(245,158,11,0.3)]"
              >
                🔒 Unlock Pro Access
              </Link>
            </div>
          )}

          {/* Config card */}
          <div className="border border-border/10 bg-card/60 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-5 backdrop-blur-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 border-b border-border/10 pb-4">
              <Sliders className="h-4 w-4 text-primary" />
              <span>Recommended Config</span>
            </h2>

            <div className="space-y-3.5 text-xs">
              {/* AI Model */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">AI Model</span>
                {modelObj && (
                  <Link
                    href={`/models/${modelObj.slug}`}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-secondary/40 border border-border/20 hover:text-primary hover:border-primary/20 transition-all font-bold"
                  >
                    <ModelLogo slug={modelObj.slug} />
                    <span>{modelObj.name}</span>
                  </Link>
                )}
              </div>

              {prompt.aspectRatio && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Aspect Ratio</span>
                  <span className="font-bold px-2.5 py-1 rounded-xl bg-secondary/40 text-foreground border border-border/15">{prompt.aspectRatio}</span>
                </div>
              )}
              {prompt.lighting && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Lighting</span>
                  <span className="font-bold px-2.5 py-1 rounded-xl bg-secondary/40 text-foreground border border-border/15 capitalize">{prompt.lighting}</span>
                </div>
              )}
              {prompt.style && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Style Mode</span>
                  <span className="font-bold px-2.5 py-1 rounded-xl bg-secondary/40 text-foreground border border-border/15 capitalize">{prompt.style}</span>
                </div>
              )}
              {prompt.camera && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Camera/Lens</span>
                  <span className="font-bold px-2.5 py-1 rounded-xl bg-secondary/40 text-foreground border border-border/15">{prompt.camera}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">Difficulty</span>
                <span className="font-bold px-2.5 py-1 rounded-xl bg-secondary/40 text-foreground border border-border/15">
                  {prompt.difficulty === 1 ? "Easy" : prompt.difficulty === 2 ? "Medium" : "Expert"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">Quality Index</span>
                <span className="font-bold px-2.5 py-1 rounded-xl bg-secondary/40 text-foreground border border-border/15">
                  {prompt.quality}/5 ⭐
                </span>
              </div>
            </div>
          </div>

          {/* Quick tips card */}
          <div className="border border-border/10 bg-card/60 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-4 backdrop-blur-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 border-b border-border/10 pb-4">
              <Info className="h-4 w-4 text-primary" />
              Prompt Tips
            </h2>
            <ul className="list-disc list-inside text-xs text-muted-foreground/70 space-y-2.5 leading-relaxed">
              <li>Click the Copy button to copy the prompt text to your clipboard.</li>
              <li>For image generators, adjust the aspect ratio tag <code className="font-mono bg-secondary px-1 py-0.5 rounded">--ar</code> to match your composition.</li>
              <li>Include negative prompt keywords for a cleaner output.</li>
              <li>Modify descriptive keywords (subjects, colors) to customize the theme.</li>
            </ul>
          </div>

          {/* Author/System Details */}
          <div className="flex items-center justify-between px-5 py-3.5 rounded-3xl bg-card/60 border border-border/10 text-xs backdrop-blur-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Author: <strong className="text-foreground">{prompt.author}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GitBranch className="h-4 w-4" />
              <span>v<strong className="text-foreground">{prompt.version}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Prompts Section ── */}
      {related.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-border/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight">Related Prompts</h2>
          </div>
          <PromptGrid prompts={related} />
        </div>
      )}

      {/* ── Schema.org JSON-LD Rich Snippet ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": prompt.title,
            "description": prompt.description,
            "author": { "@type": "Person", "name": prompt.author },
            "dateCreated": prompt.createdAt,
            "dateModified": prompt.updatedAt,
            "genre": prompt.category,
            "version": prompt.version,
            "keywords": prompt.tags.join(", "),
            "image": prompt.previewImage
          })
        }}
      />
    </div>
  );
}
