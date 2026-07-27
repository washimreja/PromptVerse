import {
  getFeaturedPrompts,
  getTrendingPrompts,
  getMostCopiedPrompts,
  getLatestPrompts,
  getEditorChoicePrompts,
} from "@/lib/prompts";
import { HeroSection } from "@/components/home/HeroSection";
import { PromptCarousel } from "@/components/home/PromptCarousel";
import { TrendingCategories } from "@/components/home/TrendingCategories";
import { AIStudioSuite } from "@/components/home/AIStudioSuite";
import { BrowseByModel } from "@/components/home/BrowseByModel";
import { BrowseByCategory } from "@/components/home/BrowseByCategory";
import { NewestPrompts } from "@/components/home/NewestPrompts";
import { TrendingToday } from "@/components/home/TrendingToday";
import { MostCopied } from "@/components/home/MostCopied";
import { EditorChoice } from "@/components/home/EditorChoice";
import { RandomPrompt } from "@/components/home/RandomPrompt";
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
    <div className="flex flex-col min-h-screen bg-[#040508]">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Interactive 3D Curvature Prompt Showcase Carousel */}
      <PromptCarousel prompts={featured} />

      {/* Leaderboard Ad */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-4">
        <AdSlot format="leaderboard" />
      </div>

      {/* 3. PromptVerse AI Studio Suite */}
      <AIStudioSuite />

      {/* 4. Trending Categories Pills */}
      <TrendingCategories />

      {/* 5. Browse by AI Model Grid */}
      <BrowseByModel />

      {/* 6. Trending Today Grid */}
      <TrendingToday prompts={trending} />

      {/* Between Grid Ad */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
        <AdSlot format="rectangle" />
      </div>

      {/* 7. Most Copied Grid */}
      <MostCopied prompts={mostCopied} />

      {/* 8. Editor's Choice Section */}
      <EditorChoice prompts={editorChoice} />

      {/* 9. PRO Conversion Banner */}
      <PremiumBanner />

      {/* 10. Browse by Category Grid */}
      <BrowseByCategory />

      {/* 11. Newest/Latest Grid */}
      <NewestPrompts prompts={latest} />

      {/* 12. Quick Launchpad Cards */}
      <QuickActionCards />

      {/* 13. Random Prompt Shuffle Section */}
      <RandomPrompt />

    </div>
  );
}
