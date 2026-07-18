import { MetadataRoute } from "next";
import { CATEGORIES, AI_MODELS } from "@/lib/constants";
import promptsData from "@/data/prompts.json";
import type { Prompt } from "@/types";

const ALL_PROMPTS: Prompt[] = promptsData as Prompt[];
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://promptverse.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // 1. Static Pages
  const staticPages = [
    "",
    "/category",
    "/models",
    "/search",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Category Detail Pages
  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 3. AI Model Detail Pages
  const modelPages = AI_MODELS.map((model) => ({
    url: `${BASE_URL}/models/${model.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 4. Prompt Detail Pages (250 prompts)
  const promptPages = ALL_PROMPTS.map((prompt) => ({
    url: `${BASE_URL}/prompts/${prompt.id}`,
    lastModified: new Date(prompt.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...modelPages, ...promptPages];
}
