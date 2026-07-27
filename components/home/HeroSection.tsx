"use client";

import { HeroBackground } from "@/components/home/HeroBackground";
import { DesktopHero } from "@/components/home/DesktopHero";
import { MobileHero } from "@/components/home/MobileHero";

export function HeroSection() {
  return (
    <section className="relative min-h-[35vh] md:min-h-[45vh] flex flex-col justify-center items-center px-3 sm:px-6 lg:px-8 pt-4 md:pt-16 pb-4 md:pb-8 overflow-hidden bg-[#040508]">
      {/* Ambient background mesh and glows */}
      <HeroBackground />

      {/* Desktop view */}
      <DesktopHero />

      {/* Mobile compact dashboard view */}
      <MobileHero />
    </section>
  );
}
