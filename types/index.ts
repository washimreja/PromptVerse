// PromptVerse — Core Types
// All types defined here. Import from '@/types' throughout the app.

export type Difficulty = 1 | 2 | 3;
export type Quality = 1 | 2 | 3 | 4 | 5;
export type PromptLength = 'short' | 'medium' | 'long';

export interface Prompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  negativePrompt?: string;
  previewImage: string;
  category: string;
  subCategory?: string;
  model: string;
  difficulty: Difficulty;
  quality: Quality;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isPro?: boolean;
  copyCount: number;
  estimatedTime: string;
  style?: string;
  camera?: string;
  lighting?: string;
  aspectRatio?: string;
  colorPalette?: string[];
  author: string;
  version: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  promptCount?: number;
}

export interface AIModel {
  slug: string;
  name: string;
  description: string;
  bestFor: string[];
  icon: string;
  color: string;
  website: string;
}

export type SortOption = 'newest' | 'trending' | 'most-copied' | 'most-popular' | 'recently-added';
export type DifficultyFilter = 'all' | 'easy' | 'medium' | 'expert';
export type LengthFilter = 'all' | 'short' | 'medium' | 'long';

export interface FilterState {
  category: string;
  model: string;
  sort: SortOption;
  difficulty: DifficultyFilter;
  length: LengthFilter;
}

export interface SearchResult {
  prompts: Prompt[];
  total: number;
  query: string;
  suggestions?: string[];
}

export interface SearchHistory {
  query: string;
  timestamp: number;
}
