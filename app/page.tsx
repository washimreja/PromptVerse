import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="animate-fade-up">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text-brand mb-4">
          {SITE_NAME}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">{SITE_TAGLINE}</p>
        <p className="text-sm text-muted-foreground/60">
          Phase 1 complete — foundation in place ✓
        </p>
      </div>
    </div>
  );
}
