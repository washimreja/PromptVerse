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
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllPromptSlugs();
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
        
        {/* Left Column: Svg Preview & Prompt Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Large Preview Panel */}
          <div className="relative aspect-video sm:aspect-[21/9] rounded-3xl overflow-hidden border border-border shadow-sm">
            <SvgThumbnail prompt={prompt} />

            {/* V3.5 Free/Pro badge overlay */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none select-none">
              {prompt.isPro ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gold/15 text-gold border border-gold/30 shadow-[0_2px_12px_rgba(245,158,11,0.25)] backdrop-blur-md">
                  🔒 Pro
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 backdrop-blur-md">
                  ✓ Free
                </span>
              )}
            </div>
          </div>

          {/* Prompt Core Panel */}
          <div className="border border-border rounded-3xl p-6 bg-card shadow-sm space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Prompt Text</span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{prompt.estimatedTime}</span>
              </div>
            </div>

            {/* Prompt Code Block */}
            <div className="relative group">
              <div className="absolute right-3 top-3 z-10">
                <CopyButton textToCopy={prompt.prompt} isPro={prompt.isPro} className="py-2 px-3 rounded-lg text-xs" />
              </div>
              <pre className="font-mono text-sm leading-relaxed p-5 pt-12 sm:pt-5 bg-secondary text-foreground rounded-2xl border border-border/60 overflow-x-auto whitespace-pre-wrap select-all selection:bg-primary/20">
                {prompt.prompt}
              </pre>
            </div>

            {/* Negative Prompt (If Exists) */}
            {prompt.negativePrompt && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500/80">
                    Negative Prompt
                  </h3>
                </div>
                <div className="relative group">
                  <div className="absolute right-3 top-3 z-10">
                    <CopyButton textToCopy={prompt.negativePrompt} isPro={prompt.isPro} className="py-2 px-3 rounded-lg text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20" />
                  </div>
                  <pre className="font-mono text-xs leading-relaxed p-5 pt-12 sm:pt-5 bg-rose-500/5 text-rose-600/90 dark:text-rose-400/90 rounded-2xl border border-rose-500/10 overflow-x-auto whitespace-pre-wrap select-all">
                    {prompt.negativePrompt}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* AdSense Placement */}
          <AdSlot format="rectangle" />
        </div>

        {/* Right Column: Settings & Metadata */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Config card */}
          <div className="border border-border bg-card rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 border-b border-border/40 pb-4">
              <Sliders className="h-4 w-4 text-primary" />
              <span>Recommended Config</span>
            </h2>

            {/* Config Fields */}
            <div className="space-y-4 text-xs">
              
              {/* AI Model */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">AI Model</span>
                {modelObj && (
                  <Link
                    href={`/models/${modelObj.slug}`}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary border border-border/60 hover:text-primary hover:border-primary/20 transition-all font-bold"
                  >
                    <span>{modelObj.icon}</span>
                    <span>{modelObj.name}</span>
                  </Link>
                )}
              </div>

              {/* Aspect Ratio */}
              {prompt.aspectRatio && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Aspect Ratio</span>
                  <span className="font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
                    {prompt.aspectRatio}
                  </span>
                </div>
              )}

              {/* Lighting */}
              {prompt.lighting && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Lighting</span>
                  <span className="font-bold px-2 py-0.5 rounded bg-secondary text-foreground capitalize">
                    {prompt.lighting}
                  </span>
                </div>
              )}

              {/* Style */}
              {prompt.style && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Style Mode</span>
                  <span className="font-bold px-2 py-0.5 rounded bg-secondary text-foreground capitalize">
                    {prompt.style}
                  </span>
                </div>
              )}

              {/* Camera */}
              {prompt.camera && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Camera/Lens</span>
                  <span className="font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
                    {prompt.camera}
                  </span>
                </div>
              )}

              {/* Difficulty */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">Difficulty</span>
                <span className="font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
                  {prompt.difficulty === 1 ? "Easy" : prompt.difficulty === 2 ? "Medium" : "Expert"}
                </span>
              </div>

              {/* Quality rating */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">Quality Index</span>
                <span className="font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
                  {prompt.quality}/5 (Premium)
                </span>
              </div>
            </div>
          </div>

          {/* Quick tips card */}
          <div className="border border-border bg-card rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 border-b border-border/40 pb-4">
              <Info className="h-4 w-4 text-primary" />
              <span>Prompt Tips</span>
            </h2>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li>Click the Copy button to copy the prompt text to your clipboard.</li>
              <li>For image generators, adjust the aspect ratio tag <code className="font-mono bg-secondary px-1 py-0.5 rounded">--ar</code> to match your composition layout.</li>
              <li>Incorporate the negative prompt keywords for a cleaner rendered output.</li>
              <li>Modify descriptive keywords (e.g. subjects, colors) to customize the visual theme.</li>
            </ul>
          </div>

          {/* Author/System Details */}
          <div className="flex items-center justify-between px-6 py-4 rounded-3xl bg-secondary/40 border border-border text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Author: <strong className="text-foreground">{prompt.author}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GitBranch className="h-4 w-4" />
              <span>Version: <strong className="text-foreground">{prompt.version}</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Related Prompts Section ── */}
      {related.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-border/40">
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
            "author": {
              "@type": "Person",
              "name": prompt.author
            },
            "dateCreated": prompt.createdAt,
            "dateModified": prompt.updatedAt,
            "genre": prompt.category,
            "version": prompt.version,
            "keywords": prompt.tags.join(", "),
            "text": prompt.prompt
          })
        }}
      />
    </div>
  );
}
