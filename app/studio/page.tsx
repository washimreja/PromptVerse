"use client";

import React from "react";
import { StudioPromptCard, StudioPrompt } from "@/components/studio/StudioPromptCard";
import { useUpgradeModal } from "@/components/modals/UpgradeToProModal";
import { ChevronRight } from "lucide-react";

// Mock data with high-quality Unsplash placeholders and realistic prompts
const FREE_PROMPTS: StudioPrompt[] = [
  {
    id: "f1",
    title: "NEON DEWY CYBERPUNK",
    imageUrl: "https://images.unsplash.com/photo-1579294523315-99933b934789?auto=format&fit=crop&q=80&w=800",
    views: 14.2,
    model: "MIDJOURNEY v6",
    promptText: "A highly realistic, stunning portrait of a beautiful blonde woman with dewy, glowing glass skin. Her face is illuminated by soft, moody blue and pink neon lights in a dark room. High fashion photography, cinematic, 85mm lens, photorealistic, 8k resolution, raw photography.",
  },
  {
    id: "f2",
    title: "ALPINE COUPE SUNSET",
    imageUrl: "https://images.unsplash.com/photo-1549406161-1002db68c78c?auto=format&fit=crop&q=80&w=800",
    views: 53.8,
    model: "DALL-E 3",
    promptText: "A highly realistic, cinematic lifestyle photograph of a man in casual white clothes standing confidently next to a sleek white sports car on a winding mountain road. Majestic alpine mountains in the background, overcast moody lighting, photorealistic, 8k.",
  },
  {
    id: "f3",
    title: "SANDY BEACH KNIT",
    imageUrl: "https://images.unsplash.com/photo-1517424687570-5c1eb5e933d1?auto=format&fit=crop&q=80&w=800",
    views: 7.1,
    model: "STABLE DIFFUSION XL",
    promptText: "A stunning black and white fashion photograph of a beautiful woman wearing a cozy knit crop top and skirt, lying gracefully on a sandy beach. Highly realistic, editorial fashion photography, high contrast, sand texture, photorealistic, 8k.",
  },
  {
    id: "f4",
    title: "NIGHT CAR SELFIE POV",
    imageUrl: "https://images.unsplash.com/photo-1596701886895-46788ea170ab?auto=format&fit=crop&q=80&w=800",
    views: 1.5,
    model: "FLUX.1 PRO",
    promptText: "A highly realistic, aesthetic POV photograph from inside a car at night. A hand is holding an iPhone horizontally, showing a glowing selfie on the screen of a beautiful woman with makeup. The car windows show blurred street lights in the background. Photorealistic, shallow depth of field, 8k.",
  },
];

const PREMIUM_PROMPTS: StudioPrompt[] = [
  {
    id: "p1",
    title: "MINIMALIST CONCRETE VILLA",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    views: 12.4,
    isPremium: true,
    model: "MIDJOURNEY v6",
    promptText: "A hyperrealistic architectural visualization of a brutalist concrete villa nestled in a dense tropical jungle. Golden hour sunlight casting harsh shadows, ivy growing over concrete walls. Cinematic lighting, architectural photography, shot on Hasselblad, 8k resolution, highly detailed.",
    negativePrompt: "people, cartoon, drawing, illustration, low quality, bad lighting",
  },
  {
    id: "p2",
    title: "BLUSH SATIN BALCONY",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    views: 8.9,
    isPremium: true,
    model: "FLUX.1 PRO",
    promptText: "Fashion editorial photography of a gorgeous model wearing a flowing blush satin dress, standing on a Parisian balcony at sunset. The wind is catching the dress, Eiffel tower softly blurred in the background. Vintage 35mm film aesthetic, Kodak Portra 400, grainy, cinematic.",
    negativePrompt: "ugly, deformed, poorly drawn, extra limbs, modern digital look",
  },
  {
    id: "p3",
    title: "CYBERPUNK STREET SAMURAI",
    imageUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800",
    views: 45.2,
    isPremium: true,
    model: "IDEOGRAM",
    promptText: "A highly detailed, cinematic shot of a lone street samurai in a cyberpunk metropolis. Rain pouring down, reflecting neon lights in puddles. The samurai holds a glowing katana. Dark gritty atmosphere, highly realistic, Unreal Engine 5 render style, volumetric lighting, 8k.",
    negativePrompt: "bright, sunny, daytime, low resolution, untextured, cartoonish",
  },
  {
    id: "p4",
    title: "GHIBLI FANTASY VALLEY",
    imageUrl: "https://images.unsplash.com/photo-1506744626753-1fa00d52f933?auto=format&fit=crop&q=80&w=800",
    views: 33.1,
    isPremium: true,
    model: "MIDJOURNEY NIJI",
    promptText: "A breathtaking fantasy valley with lush green grass, a small rustic windmill, and a sparkling river. Studio Ghibli animation style, vibrant anime colors, fluffy clouds in a bright blue sky, masterpiece, highly detailed background art, Makoto Shinkai style.",
    negativePrompt: "realistic, photographic, dark, gloomy, 3d render",
  },
];

export default function StudioPage() {
  const { openUpgradeModal } = useUpgradeModal();

  return (
    <div className="min-h-screen bg-[#040508] text-white">
      {/* Top Banner (Optional, to match layout vibes) */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          PromptVerse Studio
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
          Discover high-end, production-ready AI image prompts. Elevate your creations with our curated studio collection.
        </p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        {/* Free Prompts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {FREE_PROMPTS.map((prompt) => (
            <StudioPromptCard
              key={prompt.id}
              prompt={prompt}
              onPremiumClick={openUpgradeModal}
            />
          ))}
        </div>

        {/* Premium Spotlight Section */}
        <div className="mt-12 rounded-3xl bg-[#090A0F] border border-white/5 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Spotlight Header Text */}
            <div className="md:w-1/4 shrink-0 mt-4 md:sticky md:top-24">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                Premium Spotlight
              </h4>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Premium
                <br /> Prompts
              </h2>
              <button
                onClick={openUpgradeModal}
                className="flex items-center gap-2 text-sm font-semibold text-[#FFB800] hover:text-white transition-colors group"
              >
                Unlock Pro Access
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Premium Prompts Grid (Horizontal scroll on mobile, grid on desktop) */}
            <div className="md:w-3/4 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
              {PREMIUM_PROMPTS.map((prompt) => (
                <StudioPromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onPremiumClick={openUpgradeModal}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
