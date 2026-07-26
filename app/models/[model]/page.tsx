import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPromptsByModel } from "@/lib/prompts";

export const dynamic = "force-dynamic";
import { AI_MODELS } from "@/lib/constants";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import { Cpu, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";

interface Props {
  params: Promise<{ model: string }>;
}

export async function generateStaticParams() {
  return AI_MODELS.map((model) => ({ model: model.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model: modelSlug } = await params;
  const model = AI_MODELS.find((m) => m.slug === modelSlug);
  if (!model) return {};

  return {
    title: `${model.name} Prompts`,
    description: `${model.description} Browse premium engineering templates and settings for ${model.name}.`,
  };
}

export default async function ModelDetailPage({ params }: Props) {
  const { model: modelSlug } = await params;
  const model = AI_MODELS.find((m) => m.slug === modelSlug);
  if (!model) notFound();

  const prompts = await getPromptsByModel(modelSlug, "newest");
  const count = prompts.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Link */}
      <Link
        href="/models"
        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary mb-8 group transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span>Back to models</span>
      </Link>

      {/* Model Hero Card */}
      <div className="relative border border-border bg-card rounded-3xl p-6 sm:p-10 mb-10 overflow-hidden shadow-sm">
        {/* Color wash */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: model.color }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl select-none"
                style={{
                  backgroundColor: `${model.color}15`,
                  border: `1px solid ${model.color}25`
                }}
              >
                {model.icon}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{model.name}</h1>
                <a
                  href={model.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-primary mt-0.5"
                >
                  <span>Official Website</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {model.description}
            </p>

            {/* Best For Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mr-1">
                Best For:
              </span>
              {model.bestFor.map((useCase) => (
                <span
                  key={useCase}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="inline-flex flex-col items-center justify-center bg-secondary border border-border/60 rounded-2xl px-6 py-3 min-w-[120px]">
              <span className="text-xl font-black text-foreground">{count}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Templates
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad slot leaderboard */}
      <div className="mb-10">
        <AdSlot format="leaderboard" />
      </div>

      {/* Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            All {model.name} Prompts
          </h2>
        </div>
        <PromptGrid
          prompts={prompts}
          emptyMessage={`No prompts available for ${model.name} yet. Check back soon!`}
        />
      </div>

    </div>
  );
}
