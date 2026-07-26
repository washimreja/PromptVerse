export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  badge?: string;
  features: string[];
  missing?: string[];
  buttonText: string;
  buttonVariant?: "brand" | "outline" | "gold";
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for casual creators exploring prompts.",
    features: [
      "Browse 10,000+ prompts",
      "Copy prompts with 1 click",
      "Basic search functionality",
      "Community support",
      "Save up to 10 favorites",
    ],
    missing: [
      "Create unlimited collections",
      "Access to Pro-only prompts",
      "Advanced AI prompt generator",
      "API access",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
  },
  {
    id: "pro",
    name: "Pro Member",
    price: "$0.010",
    period: "per month",
    description: "For professionals and power users building with AI.",
    popular: true,
    badge: "Best Value",
    features: [
      "Everything in Free, plus:",
      "Create unlimited collections",
      "Access to exclusive Pro prompts",
      "Advanced AI prompt generator",
      "Priority customer support",
      "Early access to new features",
    ],
    missing: [
      "API access for automation",
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "brand",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$149",
    period: "one-time",
    description: "Pay once. Enjoy PromptVerse Pro forever.",
    features: [
      "Everything in Pro, plus:",
      "One-time payment, no subscriptions",
      "API access for automation",
      "Dedicated account manager",
      "Feature request priority",
      "Exclusive Lifetime badge",
    ],
    buttonText: "Get Lifetime Access",
    buttonVariant: "outline",
  },
];
