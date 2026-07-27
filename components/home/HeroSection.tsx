"use client";

import { HeroBackground } from "@/components/home/HeroBackground";
import { DesktopHero } from "@/components/home/DesktopHero";
import { MobileHero } from "@/components/home/MobileHero";

export function HeroSection() {
  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-12 overflow-hidden bg-[#040508]">
      {/* Ambient background mesh and glows */}
      <HeroBackground />

      {/* Desktop view */}
      <DesktopHero />

      {/* Mobile view */}
      <MobileHero />
    </section>
  );
}
