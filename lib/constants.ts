// PromptVerse — Constants
// Categories, AI Models, Filters, Site Metadata

import type { Category, AIModel } from '@/types';

export const SITE_NAME = 'PromptVerse';
export const SITE_TAGLINE = 'Discover. Copy. Create.';
export const SITE_DESCRIPTION =
  'The easiest place on the internet to discover and copy AI prompts. Browse 250+ premium prompts for Midjourney, Flux, ChatGPT, Gemini, and more.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptverse.app';
export const SITE_AUTHOR = 'Washim Reja';
export const SITE_INSTAGRAM = 'https://instagram.com/Cinematic_vibes_by_washim';
export const SITE_GITHUB = 'https://github.com/washimreja';
export const SITE_LINKEDIN = 'https://linkedin.com/in/washimreja';

export const CATEGORIES: Category[] = [
  { slug: 'portrait', name: 'Portrait', description: 'Stunning portrait photography prompts', icon: '👤', color: '#8B5CF6' },
  { slug: 'female-portrait', name: 'Female Portrait', description: 'Beautiful female portrait styles', icon: '👩', color: '#EC4899' },
  { slug: 'male-portrait', name: 'Male Portrait', description: 'Powerful male portrait styles', icon: '👨', color: '#3B82F6' },
  { slug: 'fashion', name: 'Fashion', description: 'High fashion and editorial looks', icon: '👗', color: '#F59E0B' },
  { slug: 'cinematic', name: 'Cinematic', description: 'Movie-quality cinematic scenes', icon: '🎬', color: '#1F2937' },
  { slug: 'nature', name: 'Nature', description: 'Breathtaking nature and landscapes', icon: '🌿', color: '#10B981' },
  { slug: 'travel', name: 'Travel', description: 'Wanderlust-worthy travel scenes', icon: '✈️', color: '#06B6D4' },
  { slug: 'architecture', name: 'Architecture', description: 'Stunning architectural photography', icon: '🏛️', color: '#6366F1' },
  { slug: 'food', name: 'Food', description: 'Mouth-watering food photography', icon: '🍽️', color: '#F97316' },
  { slug: 'anime', name: 'Anime', description: 'Japanese anime and manga styles', icon: '⛩️', color: '#EF4444' },
  { slug: 'fantasy', name: 'Fantasy', description: 'Magical fantasy worlds and creatures', icon: '🐉', color: '#7C3AED' },
  { slug: 'realistic', name: 'Realistic', description: 'Hyper-realistic photographic prompts', icon: '📷', color: '#374151' },
  { slug: 'logo', name: 'Logo Design', description: 'Professional logo design prompts', icon: '🎯', color: '#DC2626' },
  { slug: 'typography', name: 'Typography', description: 'Creative typography and lettering', icon: '✍️', color: '#1D4ED8' },
  { slug: 'poster', name: 'Poster', description: 'Eye-catching poster designs', icon: '🎨', color: '#D97706' },
  { slug: 'thumbnail', name: 'Thumbnail', description: 'Click-worthy YouTube thumbnails', icon: '▶️', color: '#FF0000' },
  { slug: 'wallpaper', name: 'Wallpaper', description: 'Desktop and mobile wallpapers', icon: '🖼️', color: '#059669' },
  { slug: 'product-photography', name: 'Product Photography', description: 'Commercial product shots', icon: '📦', color: '#7C3AED' },
  { slug: 'instagram', name: 'Instagram', description: 'Instagram-ready content prompts', icon: '📸', color: '#E1306C' },
  { slug: 'youtube', name: 'YouTube', description: 'YouTube content and thumbnails', icon: '🎥', color: '#FF0000' },
  { slug: 'reels', name: 'Reels', description: 'Viral reel-worthy visuals', icon: '🎞️', color: '#833AB4' },
  { slug: 'tiktok', name: 'TikTok', description: 'TikTok trending visual styles', icon: '🎵', color: '#010101' },
  { slug: 'photography', name: 'Photography', description: 'General photography techniques', icon: '📷', color: '#4B5563' },
  { slug: 'lighting', name: 'Lighting', description: 'Dramatic lighting techniques', icon: '💡', color: '#FCD34D' },
  { slug: 'background', name: 'Background', description: 'Creative background designs', icon: '🌄', color: '#60A5FA' },
  { slug: 'sky-replacement', name: 'Sky Replacement', description: 'Dramatic sky swap prompts', icon: '☁️', color: '#38BDF8' },
  { slug: 'color-grading', name: 'Color Grading', description: 'Professional color grading styles', icon: '🎨', color: '#A78BFA' },
  { slug: 'character-design', name: 'Character Design', description: 'Original character concepts', icon: '🧙', color: '#F472B6' },
  { slug: 'pixar', name: 'Pixar Style', description: 'Pixar-quality 3D animation', icon: '🤖', color: '#34D399' },
  { slug: 'ghibli', name: 'Ghibli Style', description: 'Studio Ghibli art style', icon: '🌸', color: '#6EE7B7' },
  { slug: '3d', name: '3D Art', description: 'Three-dimensional digital art', icon: '🎲', color: '#60A5FA' },
  { slug: 'interior', name: 'Interior Design', description: 'Stunning interior design concepts', icon: '🛋️', color: '#A16207' },
  { slug: 'vehicles', name: 'Vehicles', description: 'Cars, bikes, and transport', icon: '🚗', color: '#1E3A5F' },
  { slug: 'drone', name: 'Drone Photography', description: 'Aerial drone photography', icon: '🚁', color: '#0EA5E9' },
  { slug: 'luxury', name: 'Luxury', description: 'Premium and luxury aesthetics', icon: '💎', color: '#B8860B' },
  { slug: 'cyberpunk', name: 'Cyberpunk', description: 'Neon-lit dystopian futures', icon: '🌆', color: '#00FF41' },
  { slug: 'minimal', name: 'Minimal', description: 'Clean minimalist compositions', icon: '◻️', color: '#E5E7EB' },
  { slug: 'vintage', name: 'Vintage', description: 'Retro and vintage aesthetics', icon: '📻', color: '#92400E' },
  { slug: 'black-white', name: 'Black & White', description: 'Timeless monochrome photography', icon: '⬛', color: '#111827' },
  { slug: 'children', name: 'Children', description: 'Cute and fun children photography', icon: '🧒', color: '#FDE68A' },
  { slug: 'animals', name: 'Animals', description: 'Wildlife and pet photography', icon: '🦁', color: '#D97706' },
  { slug: 'macro', name: 'Macro', description: 'Extreme close-up macro shots', icon: '🔬', color: '#10B981' },
  { slug: 'street', name: 'Street Photography', description: 'Urban street photography', icon: '🏙️', color: '#6B7280' },
];

export const AI_MODELS: AIModel[] = [
  {
    slug: 'midjourney',
    name: 'Midjourney',
    description: 'The gold standard for artistic AI image generation with unparalleled aesthetic quality.',
    bestFor: ['Portrait', 'Fantasy', 'Cinematic', 'Art'],
    icon: '🎨',
    color: '#000000',
    website: 'https://midjourney.com',
  },
  {
    slug: 'flux',
    name: 'Flux',
    description: 'Lightning-fast, photorealistic image generation by Black Forest Labs.',
    bestFor: ['Realistic', 'Product Photography', 'Portrait'],
    icon: '⚡',
    color: '#7C3AED',
    website: 'https://blackforestlabs.ai',
  },
  {
    slug: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s powerful language model for text, code, and creative writing prompts.',
    bestFor: ['Text', 'Code', 'Creative Writing', 'Analysis'],
    icon: '💬',
    color: '#10A37F',
    website: 'https://chat.openai.com',
  },
  {
    slug: 'gemini',
    name: 'Gemini',
    description: 'Google\'s multimodal AI for text, image understanding, and generation.',
    bestFor: ['Text', 'Research', 'Multimodal'],
    icon: '✨',
    color: '#4285F4',
    website: 'https://gemini.google.com',
  },
  {
    slug: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s AI assistant known for nuanced writing and detailed analysis.',
    bestFor: ['Long-form Writing', 'Analysis', 'Code'],
    icon: '🤖',
    color: '#D4A856',
    website: 'https://claude.ai',
  },
  {
    slug: 'gpt-image',
    name: 'GPT Image',
    description: 'OpenAI\'s latest image generation model with superior instruction following.',
    bestFor: ['Illustration', 'Logo', 'Poster', 'Consistent Characters'],
    icon: '🖼️',
    color: '#10A37F',
    website: 'https://openai.com',
  },
  {
    slug: 'imagen',
    name: 'Imagen',
    description: 'Google\'s photorealistic text-to-image model with exceptional quality.',
    bestFor: ['Photorealistic', 'Nature', 'Product'],
    icon: '🌄',
    color: '#EA4335',
    website: 'https://imagen.research.google',
  },
  {
    slug: 'ideogram',
    name: 'Ideogram',
    description: 'Best-in-class for text rendering within images — logos, posters, and typography.',
    bestFor: ['Typography', 'Logo', 'Poster', 'Text in Image'],
    icon: '🔤',
    color: '#6366F1',
    website: 'https://ideogram.ai',
  },
  {
    slug: 'recraft',
    name: 'Recraft',
    description: 'Professional-grade vector and raster image generation for designers.',
    bestFor: ['Vector', 'Icon', 'Brand Design', 'Illustration'],
    icon: '✏️',
    color: '#F59E0B',
    website: 'https://recraft.ai',
  },
  {
    slug: 'nano-banana',
    name: 'Nano Banana',
    description: 'Ultra-fast image generation optimized for social media and content creators.',
    bestFor: ['Social Media', 'Reels', 'Instagram', 'TikTok'],
    icon: '🍌',
    color: '#FBBF24',
    website: 'https://nanobanana.ai',
  },
  {
    slug: 'kling',
    name: 'Kling',
    description: "Kuaishou's advanced AI video generation model — cinematic quality at scale.",
    bestFor: ['Video', 'Cinematic', 'Animation', 'Motion'],
    icon: '🎞️',
    color: '#EC4899',
    website: 'https://klingai.com',
  },
  {
    slug: 'veo',
    name: 'Veo',
    description: "Google DeepMind's state-of-the-art video generation model with unmatched realism.",
    bestFor: ['Video Generation', 'Cinematic', 'Realistic Video'],
    icon: '🎬',
    color: '#4285F4',
    website: 'https://deepmind.google/veo',
  },
  {
    slug: 'sora',
    name: 'Sora',
    description: "OpenAI's groundbreaking text-to-video model creating stunning cinematic videos.",
    bestFor: ['Video', 'Cinematic', 'Storytelling', 'Animation'],
    icon: '🌌',
    color: '#6366F1',
    website: 'https://sora.com',
  },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'trending', label: 'Trending' },
  { value: 'most-copied', label: 'Most Copied' },
  { value: 'most-popular', label: 'Most Popular' },
  { value: 'recently-added', label: 'Recently Added' },
] as const;

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Easy',
  2: 'Medium',
  3: 'Expert',
};

export const POPULAR_SEARCHES = [
  'cinematic portrait',
  'anime girl',
  'cyberpunk city',
  'ghibli landscape',
  'product photography',
  'minimal logo',
  'golden hour',
  'pixar character',
  'fashion editorial',
  'vintage film',
  'black and white',
  'fantasy warrior',
  'luxury interior',
  'macro nature',
  'street photography',
  'instagram reel',
];

export const PROMPTS_PER_PAGE = 24;
