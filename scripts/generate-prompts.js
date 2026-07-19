/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * PromptVerse Seed Data Generator
 * Generates 250 premium, highly realistic AI prompts.
 */

const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  { slug: 'portrait', name: 'Portrait', type: 'image' },
  { slug: 'female-portrait', name: 'Female Portrait', type: 'image' },
  { slug: 'male-portrait', name: 'Male Portrait', type: 'image' },
  { slug: 'fashion', name: 'Fashion', type: 'image' },
  { slug: 'cinematic', name: 'Cinematic', type: 'image' },
  { slug: 'nature', name: 'Nature', type: 'image' },
  { slug: 'travel', name: 'Travel', type: 'image' },
  { slug: 'architecture', name: 'Architecture', type: 'image' },
  { slug: 'food', name: 'Food', type: 'image' },
  { slug: 'anime', name: 'Anime', type: 'image' },
  { slug: 'fantasy', name: 'Fantasy', type: 'image' },
  { slug: 'realistic', name: 'Realistic', type: 'image' },
  { slug: 'logo', name: 'Logo Design', type: 'image' },
  { slug: 'typography', name: 'Typography', type: 'image' },
  { slug: 'poster', name: 'Poster', type: 'image' },
  { slug: 'thumbnail', name: 'Thumbnail', type: 'image' },
  { slug: 'wallpaper', name: 'Wallpaper', type: 'image' },
  { slug: 'product-photography', name: 'Product Photography', type: 'image' },
  { slug: 'instagram', name: 'Instagram', type: 'text' },
  { slug: 'youtube', name: 'YouTube', type: 'text' },
  { slug: 'reels', name: 'Reels', type: 'video' },
  { slug: 'tiktok', name: 'TikTok', type: 'video' },
  { slug: 'photography', name: 'Photography', type: 'image' },
  { slug: 'lighting', name: 'Lighting', type: 'image' },
  { slug: 'background', name: 'Background', type: 'image' },
  { slug: 'sky-replacement', name: 'Sky Replacement', type: 'image' },
  { slug: 'color-grading', name: 'Color Grading', type: 'image' },
  { slug: 'character-design', name: 'Character Design', type: 'image' },
  { slug: 'pixar', name: 'Pixar Style', type: 'image' },
  { slug: 'ghibli', name: 'Ghibli Style', type: 'image' },
  { slug: '3d', name: '3D Art', type: 'image' },
  { slug: 'interior', name: 'Interior Design', type: 'image' },
  { slug: 'vehicles', name: 'Vehicles', type: 'image' },
  { slug: 'drone', name: 'Drone Photography', type: 'image' },
  { slug: 'luxury', name: 'Luxury', type: 'image' },
  { slug: 'cyberpunk', name: 'Cyberpunk', type: 'image' },
  { slug: 'minimal', name: 'Minimal', type: 'image' },
  { slug: 'vintage', name: 'Vintage', type: 'image' },
  { slug: 'black-white', name: 'Black & White', type: 'image' },
  { slug: 'children', name: 'Children', type: 'image' },
  { slug: 'animals', name: 'Animals', type: 'image' },
  { slug: 'macro', name: 'Macro', type: 'image' },
  { slug: 'street', name: 'Street Photography', type: 'image' }
];

const MODELS = [
  { slug: 'midjourney', name: 'Midjourney', type: 'image' },
  { slug: 'flux', name: 'Flux', type: 'image' },
  { slug: 'chatgpt', name: 'ChatGPT', type: 'text' },
  { slug: 'gemini', name: 'Gemini', type: 'text' },
  { slug: 'claude', name: 'Claude', type: 'text' },
  { slug: 'gpt-image', name: 'GPT Image', type: 'image' },
  { slug: 'imagen', name: 'Imagen', type: 'image' },
  { slug: 'ideogram', name: 'Ideogram', type: 'image' },
  { slug: 'recraft', name: 'Recraft', type: 'image' },
  { slug: 'nano-banana', name: 'Nano Banana', type: 'image' },
  { slug: 'kling', name: 'Kling', type: 'video' },
  { slug: 'veo', name: 'Veo', type: 'video' },
  { slug: 'sora', name: 'Sora', type: 'video' }
];

// Helper to get random item from list
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Helper to get multiple random items
const randomSubarray = (arr, size) => {
  const shuffled = arr.slice(0).sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
};
// Helper to generate a random number within range
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generators for specific types of prompts to make them look authentic
const IMAGE_PROMPT_COMPONENTS = {
  subjects: [
    "A cyberpunk street samurai standing under neon rain",
    "An elegant woman in a flowing silk dress at a Parisian balcony",
    "A serene Buddhist monk meditating near a misty waterfall",
    "A futuristic explorer looking at a massive glowing crystal cave",
    "An adorable baby red panda playing with fallen cherry blossom leaves",
    "A majestic lion with glowing cosmic constellations in its mane",
    "A vintage steam locomotive crossing a high mountain bridge in the clouds",
    "A hyper-realistic slice of strawberry shortcake on a rustic wooden table",
    "A minimalist glass house nestled in a snowy pine forest",
    "An ancient wizard holding a wooden staff topped with a blue glowing orb",
    "A sleek futuristic electric motorcycle racing down a desert highway",
    "A detailed close-up portrait of a rugged old fisherman with deep sea-wrinkles",
    "A vibrant Ghibli-inspired meadow filled with wild colorful flowers"
  ],
  styles: [
    "cinematic lighting, photorealistic, 8k resolution, shot on Hasselblad",
    "oil painting style, rich textures, impasto brushstrokes, dramatic chiaroscuro",
    "Studio Ghibli style, watercolor textures, soft colors, nostalgia, hand-drawn anime aesthetic",
    "minimalist editorial fashion photography, high contrast, clean background, vogue style",
    "Pixar 3D animation style, cute character design, soft lighting, vibrant color palette",
    "cyberpunk aesthetic, high contrast neon colors, rain slicked streets, volumetric fog",
    "macro photography, extreme detail, shallow depth of field, natural lighting",
    "vintage 35mm film photography, analog style, grain, warm color grading, nostalgia",
    "3D claymation style, handcrafted textures, cute characters, soft volumetric shadows",
    "isometric vector illustration, flat colors, clean design, minimalist tech aesthetic"
  ],
  cameras: [
    "shot on 85mm f/1.4 lens",
    "shot on 35mm lens, f/2.8",
    "50mm prime lens, cinematic framing",
    "shot on Hasselblad H6D-100c, 100mm macro lens",
    "action camera, wide-angle lens, low angle",
    "aerial drone shot, wide overview",
    "anamorphic lens, cinemascope aspect ratio"
  ],
  lighting: [
    "golden hour lighting, warm glow, long shadows",
    "volumetric atmospheric lighting, sunbeams breaking through dust",
    "dramatic studio lighting, soft key light, blue fill light",
    "neon glow, colorful rim lighting, dark cyberpunk atmosphere",
    "split lighting, high contrast shadows, dark moody vibe",
    "soft diffuse natural light, overcast sky, gentle colors",
    "harsh side lighting, high texture detail, deep shadows"
  ],
  aspectRatios: ["16:9", "9:16", "4:5", "1:1", "3:2", "21:9"]
};

const TEXT_PROMPT_COMPONENTS = {
  topics: [
    "write a highly engaging cold email sequence for a B2B SaaS tool targeting CMOs",
    "generate a comprehensive 30-day social media content calendar for a sustainable clothing brand",
    "write a Python script to scrape product details from an e-commerce website and export to CSV with rate limiting",
    "create a detailed landing page copy structure using the AIDA framework for a premium copywriting agency",
    "explain quantum computing in simple terms using a metaphor of a library with infinite books",
    "draft a professional responses to a client who wants to reduce the budget while keeping the same scope",
    "design an interactive command-line adventure game in Node.js with multiple choice storylines",
    "generate 10 viral YouTube title options and descriptions for a video explaining personal finance to Gen Z",
    "create a custom Tailwind CSS configuration and card component for a dark mode dashboard layout",
    "write a comprehensive guide on how to optimize a React application for Core Web Vitals, specifically targeting CLS"
  ],
  modifiers: [
    "using a professional yet friendly tone",
    "ensure the output is formatted in clean Markdown with clear headings and bullet points",
    "keep the code modular, well-commented, and follow industry best practices",
    "structure the response using the Hook-Story-Offer copywriting framework",
    "add code blocks and explain the time complexity for each solution provided",
    "keep it concise, easy to scan, and actionable"
  ]
};

const VIDEO_PROMPT_COMPONENTS = {
  scenes: [
    "A majestic dragon soaring over a snowy mountain range, breathing soft golden embers",
    "A slow-motion close-up of water droplets splashing on a green leaf during a tropical rain",
    "A cinematic tracking shot following a classic sports car driving along a coastal road at sunset",
    "A cute astronaut cat floating in space, playing with a ball of glowing stardust",
    "A futuristic train arriving at a floating station in a futuristic city in the clouds",
    "A slow zoom-in on a campfire glowing in the dark forest, sparks rising into the starry sky",
    "An aerial view of ocean waves crashing against dark volcanic rocks, creating white seafoam"
  ],
  motions: [
    "smooth camera glide, cinematic tracking, slow motion 60fps",
    "drone shot, rotating slowly, high-angle cinematic view",
    "steadycam shot, panning slowly from left to right, cinematic lighting",
    "macro zoom, slow movement, extreme detail, photorealistic render",
    "first-person view, dynamic movement, fast-paced action cam"
  ]
};

const TAGS = [
  "photorealistic", "cinematic", "cyberpunk", "anime", "watercolor", "flat-vector",
  "vintage-film", "studio-lighting", "minimalist", "retro", "ghibli-style", "pixar-style",
  "street-photo", "macro", "landscape", "portrait", "neon", "gold-hour", "3d-art",
  "saas", "copywriting", "marketing", "developer", "automation", "python", "css",
  "youtube", "instagram-reel", "tiktok-trend", "video-art", "b2b", "ui-design"
];

// Generate 250 prompts programmatically
const prompts = [];
const startDate = new Date("2026-01-01T00:00:00.000Z");

for (let i = 1; i <= 250; i++) {
  const id = `p${String(i).padStart(3, '0')}`;
  
  // Distribute categories and models evenly but with some variety
  const categoryObj = CATEGORIES[(i - 1) % CATEGORIES.length];
  
  // Match model type (image, text, video) with category type to be realistic
  let matchingModels = MODELS.filter(m => m.type === categoryObj.type);
  if (matchingModels.length === 0) {
    matchingModels = MODELS;
  }
  const modelObj = randomItem(matchingModels);

  let title = "";
  let promptText = "";
  let negativePrompt = "";
  let description = "";
  let estimatedTime = "";
  let style = "";
  let camera = "";
  let lighting = "";
  let aspectRatio = "";
  let colorPalette = [];

  const copyCount = randomRange(50, 4500);
  const difficulty = randomItem([1, 2, 3]);
  const quality = randomItem([4, 5]); // Mostly high-quality prompts
  const isFeatured = i % 15 === 0; // ~7% featured
  const isTrending = i % 12 === 0 || copyCount > 3000; // trending based on copying/modulo
  
  const createdDate = new Date(startDate.getTime() + i * 16 * 60 * 60 * 1000); // spread across weeks
  const updatedAt = new Date(createdDate.getTime() + 2 * 24 * 60 * 60 * 1000);

  // Generate specific details based on type
  if (categoryObj.type === 'image') {
    const subject = randomItem(IMAGE_PROMPT_COMPONENTS.subjects);
    const styleComponent = randomItem(IMAGE_PROMPT_COMPONENTS.styles);
    const cameraComponent = randomItem(IMAGE_PROMPT_COMPONENTS.cameras);
    const lightingComponent = randomItem(IMAGE_PROMPT_COMPONENTS.lighting);
    
    title = `${categoryObj.name} - ${subject.split(" ").slice(1, 4).join(" ")}`;
    promptText = `${subject}, ${styleComponent}, ${cameraComponent}, ${lightingComponent} --ar ${randomItem(IMAGE_PROMPT_COMPONENTS.aspectRatios)}`;
    negativePrompt = "ugly, deformed, poor quality, blurry, low resolution, extra limbs, bad anatomy, watermark, signature";
    description = `A premium ${categoryObj.name.toLowerCase()} prompt designed to generate a highly detailed, professional ${categoryObj.name.toLowerCase()} artwork using ${modelObj.name}.`;
    estimatedTime = `~${randomItem([1, 2])} min`;
    style = styleComponent.split(",")[0];
    camera = cameraComponent;
    lighting = lightingComponent.split(",")[0];
    aspectRatio = promptText.split("--ar ").pop();
    colorPalette = randomSubarray(["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#3B82F6", "#7C3AED", "#1F2937"], 3);
  } else if (categoryObj.type === 'video') {
    const scene = randomItem(VIDEO_PROMPT_COMPONENTS.scenes);
    const motionComponent = randomItem(VIDEO_PROMPT_COMPONENTS.motions);
    
    title = `${categoryObj.name} - ${scene.split(" ").slice(1, 4).join(" ")}`;
    promptText = `${scene}, ${motionComponent}, high fidelity, photorealistic, cinematic camera movements`;
    description = `A cinematic video prompt to generate high-resolution, realistic motion scenes for ${categoryObj.name.toLowerCase()} content using ${modelObj.name}.`;
    estimatedTime = `~${randomItem([3, 5])} min`;
    style = "cinematic video";
    camera = motionComponent.split(",")[0];
    lighting = "cinematic lighting";
    aspectRatio = "16:9";
    colorPalette = ["#111827", "#8B5CF6", "#EC4899"];
  } else {
    // text
    const topic = randomItem(TEXT_PROMPT_COMPONENTS.topics);
    const modifier = randomItem(TEXT_PROMPT_COMPONENTS.modifiers);
    
    title = `${categoryObj.name} - ${topic.split(" ").slice(2, 5).join(" ")}`;
    promptText = `${topic}, ${modifier}.`;
    description = `A highly optimized productivity prompt to generate detailed, professional-grade ${categoryObj.name.toLowerCase()} content with ${modelObj.name}.`;
    estimatedTime = `~${randomItem([10, 15, 30])} sec`;
    style = "professional text";
  }

  // Slug generation
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const tags = [
    categoryObj.slug,
    modelObj.slug,
    ...randomSubarray(TAGS.filter(t => t !== categoryObj.slug && t !== modelObj.slug), randomRange(2, 4))
  ];

  prompts.push({
    id,
    slug: `${slug}-${id}`,
    title,
    description,
    prompt: promptText,
    negativePrompt: negativePrompt || undefined,
    previewImage: `/prompts/${id}.svg`, // Will be resolved dynamically to custom SVGs
    category: categoryObj.slug,
    subCategory: categoryObj.slug + "-premium",
    model: modelObj.slug,
    difficulty,
    quality,
    createdAt: createdDate.toISOString(),
    updatedAt: updatedAt.toISOString(),
    tags,
    isFeatured,
    isTrending,
    copyCount,
    estimatedTime,
    style: style || undefined,
    camera: camera || undefined,
    lighting: lighting || undefined,
    aspectRatio: aspectRatio || undefined,
    colorPalette: colorPalette.length > 0 ? colorPalette : undefined,
    author: "PromptVerse Editor",
    version: "1.0"
  });
}

// Ensure the data directory exists
const dir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(
  path.join(dir, 'prompts.json'),
  JSON.stringify(prompts, null, 2),
  'utf-8'
);

console.log("Successfully generated 250 premium prompts in data/prompts.json!");
