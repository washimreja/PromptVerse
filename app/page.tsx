import {
  getFeaturedPrompts,
  getTrendingPrompts,
  getMostCopiedPrompts,
  getLatestPrompts,
  getEditorChoicePrompts,
} from "@/lib/prompts";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { PromptCarousel } from "@/components/home/PromptCarousel";
import { ContentHighlights } from "@/components/home/ContentHighlights";
import { AIStudioSuite } from "@/components/home/AIStudioSuite";
import { BrowseByModel } from "@/components/home/BrowseByModel";
import { BrowseByCategory } from "@/components/home/BrowseByCategory";
import { NewestPrompts } from "@/components/home/NewestPrompts";
import { TrendingToday } from "@/components/home/TrendingToday";
import { MostCopied } from "@/components/home/MostCopied";
import { EditorChoice } from "@/components/home/EditorChoice";
import { QuickActionCards } from "@/components/home/QuickActionCards";
import { PremiumBanner } from "@/components/home/PremiumBanner";
import { AdSlot } from "@/components/ads/AdSlot";

export const revalidate = 3600; // Cache for 1 hour

export default async function HomePage() {
  // Fetch data in parallel on the server
  const [
    featured,
    trending,
    mostCopied,
    latest,
    editorChoice
  ] = await Promise.all([
    getFeaturedPrompts(8),
    getTrendingPrompts(8),
    getMostCopiedPrompts(8),
    getLatestPrompts(8),
    getEditorChoicePrompts(8)
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#08090d] text-foreground relative selection:bg-cyan-500/25">
      
      {/* 1. Hero Section (Desktop hero with single search bar + Mobile compact dashboard) */}
      <HeroSection />

      {/* 2. Desktop Category Grid (Hidden on Mobile) */}
      <div className="hidden md:block">
        <CategoryGrid />
      </div>

      {/* Subtle Luminous Divider */}
      <div className="luminous-divider max-w-7xl mx-auto my-2 opacity-40" />

      {/* 3. Featured Prompt Showcase Gallery (Horizontal continuous marquee) */}
      <PromptCarousel prompts={featured} />

      {/* 4. Content Highlights (Trending/New/Pro content picks) */}
      <ContentHighlights />

      {/* Leaderboard Ad */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-2">
        <AdSlot format="leaderboard" />
      </div>

      {/* Subtle Luminous Divider */}
      <div className="luminous-divider max-w-7xl mx-auto my-4 opacity-40" />

      {/* 5. PromptVerse AI Studio Suite */}
      <AIStudioSuite />

      {/* 6. Browse by AI Model Grid */}
      <BrowseByModel />

      {/* 7. Trending Today Grid */}
      <TrendingToday prompts={trending} />

      {/* Between Grid Ad */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
        <AdSlot format="rectangle" />
      </div>

      {/* 8. Most Copied Grid */}
      <MostCopied prompts={mostCopied} />

      {/* 9. Editor's Choice Section */}
      <EditorChoice prompts={editorChoice} />

      {/* 10. PRO Conversion Banner */}
      <PremiumBanner />

      {/* 11. Browse by Category Grid */}
      <BrowseByCategory />

      {/* 12. Newest/Latest Grid */}
      <NewestPrompts prompts={latest} />

      {/* 13. Quick Launchpad Cards */}
      <QuickActionCards />

    </div>
  );
}
