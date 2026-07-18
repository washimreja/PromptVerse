import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Estimate reading time for a prompt string */
export function getReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  if (minutes < 1) return '< 1 min read';
  return `${minutes} min read`;
}

/** Format copy count: 1234 → "1.2K" */
export function formatCopyCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

/** Convert a string to a URL-safe slug */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Capitalize first letter of each word */
export function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Format ISO date to human-readable */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Truncate a string to a given length with ellipsis */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '…';
}

/** Get difficulty label from numeric value */
export function getDifficultyLabel(difficulty: 1 | 2 | 3): string {
  return { 1: 'Easy', 2: 'Medium', 3: 'Expert' }[difficulty];
}

/** Get prompt length category */
export function getPromptLength(prompt: string): 'short' | 'medium' | 'long' {
  const words = prompt.trim().split(/\s+/).length;
  if (words < 30) return 'short';
  if (words < 80) return 'medium';
  return 'long';
}
