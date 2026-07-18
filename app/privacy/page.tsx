import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for PromptVerse prompt library.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-black tracking-tight mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert text-xs sm:text-sm text-muted-foreground space-y-6 leading-relaxed">
        <p>
          Last updated: July 18, 2026.
        </p>

        <p>
          At PromptVerse, accessible from promptverse.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by PromptVerse and how we use it.
        </p>

        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground pt-4">1. Information We Collect</h2>
        <p>
          PromptVerse does not require user accounts, email registration, or log-in credentials to browse and copy prompts. We only collect standard non-identifying website usage data via Google Analytics and Vercel Analytics to understand general layout traffic and button click events (e.g. copying prompts).
        </p>

        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground pt-4">2. Cookies and Web Beacons</h2>
        <p>
          Like any other website, PromptVerse uses cookies to store information including visitors preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users experience by customizing our web page content based on visitors browser type and/or other information.
        </p>

        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground pt-4">3. Third Party Policies</h2>
        <p>
          PromptVerse may host Google AdSense advertisements. Google uses cookies to serve ads on our site based on users visits to our site and other sites on the Internet. Users may opt out of personalized advertising by visiting Google Ad settings.
        </p>

        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground pt-4">4. Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>
      </div>
    </div>
  );
}
