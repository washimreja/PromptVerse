import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for PromptVerse prompt library.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-black tracking-tight mb-8">Terms of Use</h1>
      
      <div className="prose dark:prose-invert text-xs sm:text-sm text-muted-foreground space-y-6 leading-relaxed">
        <p>
          Last updated: July 18, 2026.
        </p>

        <p>
          Welcome to PromptVerse. These Terms of Use govern your access to and use of promptverse.app. Please read them carefully. By using our website, you agree to comply with these terms.
        </p>

        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground pt-4">1. License and Prompt Usage</h2>
        <p>
          All prompts provided on PromptVerse are free to copy, modify, distribute, and use in commercial and non-commercial projects. You do not need to provide attribution to PromptVerse, although it is always appreciated. You may not, however, scrape our database to package or resell our prompt library collection directly as a competing service.
        </p>

        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground pt-4">2. Disclaimer of Warranties</h2>
        <p>
          The prompts are provided on an &quot;as is&quot; and &quot;as available&quot; basis. PromptVerse makes no warranties, expressed or implied, regarding the accuracy, performance, or results you will receive from third-party AI models (e.g. Midjourney, ChatGPT, Flux) when using these prompts.
        </p>

        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground pt-4">3. Limitation of Liability</h2>
        <p>
          PromptVerse and its developers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use the prompts or website.
        </p>

        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground pt-4">4. Governing Law</h2>
        <p>
          These Terms of Use shall be governed by and construed in accordance with the laws of your local jurisdiction, without regard to its conflict of law provisions.
        </p>
      </div>
    </div>
  );
}
