import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { NextAuthProvider } from "@/components/layout/NextAuthProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/MobileNav";
import { SponsorBanner } from "@/components/layout/SponsorBanner";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { FavoritesProvider } from "@/components/favorites/FavoritesContext";
import { FloatingFavoritesButton } from "@/components/favorites/FloatingFavoritesButton";
import { AuthModalProvider } from "@/components/auth/AuthModalContext";
import { UpgradeModalProvider } from "@/components/modals/UpgradeToProModal";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_URL,
  SITE_AUTHOR,
} from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AI prompts",
    "Midjourney prompts",
    "ChatGPT prompts",
    "Flux prompts",
    "AI art prompts",
    "prompt library",
    "prompt engineering",
    "AI image prompts",
    "Gemini prompts",
    "Claude prompts",
    "Ideogram prompts",
    "Stable Diffusion prompts",
  ],
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@Cinematic_vibes_by_washim",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)",  color: "#040508" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <NextAuthProvider>
          <ThemeProvider>
            <AuthModalProvider>
              <UpgradeModalProvider>
                <FavoritesProvider>
                  <SponsorBanner />
                  <Header />
                  {/* Extra bottom padding on mobile for the bottom nav */}
                  <main className="flex-1 pb-20 md:pb-0">
                    {children}
                  </main>
                  {/* Footer — visible on all screens; MobileNav overlays bottom on mobile */}
                  <Footer />
                  <BottomNavigation />
                  <FloatingActionButton />
                  <FloatingFavoritesButton />
                  <Toaster
                    richColors
                    position="top-center"
                    toastOptions={{
                      classNames: {
                        toast: "!rounded-2xl !shadow-xl !border-border !font-sans",
                      },
                    }}
                  />
                </FavoritesProvider>
              </UpgradeModalProvider>
            </AuthModalProvider>
          </ThemeProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
