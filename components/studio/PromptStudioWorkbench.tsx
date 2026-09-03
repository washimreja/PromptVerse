"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Dice5,
  SlidersHorizontal,
  Layers,
  Camera,
  SunMedium,
  Palette,
  Ratio,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Flame,
  Wand2,
  Maximize2,
  Bookmark,
  Focus,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type StudioToolId = "universal" | "smart-shot" | "relight" | "replace-bg";

interface ModelOption {
  id: string;
  name: string;
  badge: string;
  icon: string;
  color: string;
  description: string;
}

const AI_MODELS: ModelOption[] = [
  {
    id: "midjourney",
    name: "Midjourney v6",
    badge: "IMAGE",
    icon: "🎨",
    color: "from-purple-500 to-indigo-600",
    description: "Appends v6 parameters, aspect ratios, and fine styling flags",
  },
  {
    id: "flux",
    name: "FLUX.1 Pro",
    badge: "IMAGE",
    icon: "⚡",
    color: "from-cyan-500 to-blue-600",
    description: "Photorealistic textures, optical lighting tokens, and exact rendering tags",
  },
  {
    id: "dalle3",
    name: "DALL-E 3",
    badge: "IMAGE",
    icon: "✨",
    color: "from-emerald-500 to-teal-600",
    description: "Natural language nuances, composition storytelling, and detail framing",
  },
  {
    id: "sdxl",
    name: "SDXL / Stable",
    badge: "IMAGE",
    icon: "🔮",
    color: "from-pink-500 to-rose-600",
    description: "Includes weighted quality tokens and explicit negative prompt blocks",
  },
  {
    id: "chatgpt",
    name: "ChatGPT-4o",
    badge: "LLM",
    icon: "💬",
    color: "from-emerald-600 to-green-700",
    description: "Role, context framing, step-by-step thinking constraints, and markdown format",
  },
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    badge: "LLM",
    icon: "🤖",
    color: "from-amber-500 to-orange-600",
    description: "Structured XML tags, nuanced persona guidelines, and concise output rules",
  },
];

const STYLE_PRESETS = [
  { id: "cinematic", label: "Cinematic 35mm", tag: "cinematic film still, 35mm anamorphic photography, high production value, dramatic color grading" },
  { id: "hyperrealistic", label: "Hyperrealistic 8K", tag: "hyperrealistic, photorealistic, 8k resolution, shot on Hasselblad H6D-100c, raw photography, subsurface scattering" },
  { id: "cyberpunk", label: "Cyberpunk Neon", tag: "cyberpunk aesthetics, neo-tokyo futuristic vibes, rainy asphalt reflections, vibrant neon glow, volumetric smoke" },
  { id: "anime", label: "Anime & Ghibli", tag: "Studio Ghibli aesthetic, Makoto Shinkai art style, vivid pastel colors, hand-painted anime background, masterpiece" },
  { id: "minimalist", label: "Minimalist Editorial", tag: "editorial minimalism, clean negative space, architectural balance, Vogue aesthetics, monochrome accents" },
  { id: "3d-unreal", label: "Unreal Engine 5", tag: "Unreal Engine 5 render, Octane render, ray-traced ambient occlusion, global illumination, hyper-detailed textures" },
  { id: "dark-fantasy", label: "Dark Fantasy", tag: "dark fantasy, gothic atmosphere, ominous mist, eldritch detailing, dramatic chiaroscuro lighting, intricate lore" },
  { id: "vintage-kodak", label: "Vintage Portra", tag: "Kodak Portra 400 film grain, nostalgic warm hues, organic soft shadows, 1990s magazine aesthetic" },
];

const LIGHTING_PRESETS = [
  { id: "golden-hour", label: "Golden Hour", tag: "warm golden hour sunlight, low angle sun rays, soft rim light, glowing atmosphere" },
  { id: "volumetric", label: "Volumetric God Rays", tag: "volumetric god rays, atmospheric haze, dust particles caught in light beam, dramatic shafts" },
  { id: "neon-cyber", label: "Moody Cyber Neon", tag: "dual neon lighting, electric cyan and magenta rim light, dark moody backdrop, high contrast" },
  { id: "studio-softbox", label: "Studio Softbox", tag: "soft diffused studio lighting, beauty dish, wrap-around illumination, minimal harsh shadows" },
  { id: "bioluminescent", label: "Bioluminescence", tag: "ethereal bioluminescent glow, cyan and electric blue phosphorescent specks, organic glow" },
  { id: "chiaroscuro", label: "Chiaroscuro Drama", tag: "Caravaggio style chiaroscuro, intense directional key light, deep pitch-black shadows" },
];

const CAMERA_PRESETS = [
  { id: "85mm", label: "85mm f/1.4 Portrait", tag: "85mm portrait prime lens, f/1.4 aperture, creamy bokeh, shallow depth of field, sharp subject focus" },
  { id: "24mm", label: "24mm Wide Cinematic", tag: "24mm ultra-wide cine lens, wide angle perspective, environmental depth, immersive field of view" },
  { id: "100mm-macro", label: "100mm Macro", tag: "100mm macro lens, ultra close-up, extreme micro details, tactile surface texture, f/2.8" },
  { id: "drone-aerial", label: "Aerial 4K Drone", tag: "birds-eye aerial drone photography, 4k overhead perspective, sweeping scale, geometric symmetry" },
  { id: "hasselblad", label: "Medium Format", tag: "medium format 100MP camera, ultra sharp edge-to-edge clarity, dynamic range, authentic glass optics" },
];

const ASPECT_RATIOS = [
  { id: "16:9", label: "16:9", desc: "Cinematic / Banner", mjFlag: "--ar 16:9" },
  { id: "9:16", label: "9:16", desc: "Reels / Stories / Phone", mjFlag: "--ar 9:16" },
  { id: "1:1", label: "1:1", desc: "Square Social Feed", mjFlag: "--ar 1:1" },
  { id: "4:5", label: "4:5", desc: "Instagram Portrait", mjFlag: "--ar 4:5" },
  { id: "21:9", label: "21:9", desc: "Ultrawide Anamorphic", mjFlag: "--ar 21:9" },
];

const INSPIRATION_SEEDS = [
  {
    tool: "smart-shot",
    title: "Cyberpunk Cybernetic Portrait",
    text: "Portrait of a rebellious young female pilot with subtle chrome cybernetic implants near her temple, wearing a tactical flight jacket, standing in rain",
    style: "cinematic",
    lighting: "neon-cyber",
    camera: "85mm",
    model: "midjourney",
  },
  {
    tool: "relight",
    title: "Golden Hour Glass Greenhouse",
    text: "Victorian glass greenhouse overgrown with exotic tropical flora and weeping orchids, sunlight piercing through foggy morning panes",
    style: "hyperrealistic",
    lighting: "golden-hour",
    camera: "24mm",
    model: "flux",
  },
  {
    tool: "replace-bg",
    title: "Brutalist Desert Sanctuary",
    text: "Minimalist brutalist concrete villa cantilevered over a terracotta sand dune desert, sleek infinity pool reflecting sunset clouds",
    style: "minimalist",
    lighting: "chiaroscuro",
    camera: "24mm",
    model: "midjourney",
  },
  {
    tool: "universal",
    title: "Floating Ghibli Island",
    text: "A floating mossy castle in the clouds with small brass watermills and flock of white origami birds soaring past",
    style: "anime",
    lighting: "volumetric",
    camera: "24mm",
    model: "dalle3",
  },
  {
    tool: "smart-shot",
    title: "High-Fashion Editorial Model",
    text: "Elegant woman in an architectural crimson silk evening gown, wind blowing draped fabric, standing on a misty Parisian limestone balcony",
    style: "hyperrealistic",
    lighting: "studio-softbox",
    camera: "85mm",
    model: "flux",
  },
];

interface PromptStudioWorkbenchProps {
  initialTool?: StudioToolId;
}

export function PromptStudioWorkbench({ initialTool = "universal" }: PromptStudioWorkbenchProps) {
  const [activeTool, setActiveTool] = useState<StudioToolId>(initialTool);
  const [selectedModel, setSelectedModel] = useState("midjourney");
  const [inputPrompt, setInputPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [selectedLighting, setSelectedLighting] = useState("golden-hour");
  const [selectedCamera, setSelectedCamera] = useState("85mm");
  const [selectedAspect, setSelectedAspect] = useState("16:9");

  // Outputs
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [variations, setVariations] = useState<{ title: string; prompt: string; tag: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);
  const [activeTab, setActiveTab] = useState<"master" | "variations" | "negative">("master");

  // Sync tool when prop changes
  useEffect(() => {
    if (initialTool) {
      setActiveTool(initialTool);
      if (initialTool === "smart-shot") {
        setSelectedCamera("85mm");
        setSelectedStyle("hyperrealistic");
        if (!inputPrompt) {
          setInputPrompt("High fashion cinematic portrait of an expressive model with luminous skin and tailored linen jacket");
        }
      } else if (initialTool === "relight") {
        setSelectedLighting("volumetric");
        if (!inputPrompt) {
          setInputPrompt("Moody interior scene of an old library with warm amber lamplight cutting through afternoon shadows");
        }
      } else if (initialTool === "replace-bg") {
        setSelectedCamera("24mm");
        setSelectedStyle("minimalist");
        if (!inputPrompt) {
          setInputPrompt("Futuristic sleek vehicle parked in front of a monumental brutalist stone museum facade");
        }
      }
    }
  }, [initialTool]);

  // Generate Master Prompt Engine
  const handleEnhance = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const raw = inputPrompt.trim() || "A captivating masterpiece showcasing supreme detail, depth, and atmospheric ambience";
      const styleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle);
      const lightObj = LIGHTING_PRESETS.find((l) => l.id === selectedLighting);
      const camObj = CAMERA_PRESETS.find((c) => c.id === selectedCamera);
      const aspectObj = ASPECT_RATIOS.find((a) => a.id === selectedAspect);

      let master = "";
      let neg = "";

      if (selectedModel === "midjourney") {
        master = `${raw}, ${styleObj?.tag || ""}, ${lightObj?.tag || ""}, ${camObj?.tag || ""}, award-winning photography, 8k resolution, photorealistic rendering ${aspectObj?.mjFlag || "--ar 16:9"} --v 6.0 --style raw --q 2`;
        neg = "blurry, deformed eyes, extra limbs, bad anatomy, cartoonish, low resolution, watermark, amateur snapshot, oversaturated";
      } else if (selectedModel === "flux") {
        master = `A high-fidelity photograph of ${raw}. Rendered with ${styleObj?.tag || ""}. Atmosphere: ${lightObj?.tag || ""}. Lens optics: ${camObj?.tag || ""}. True-to-life texture detail, pristine color calibration, shot on 35mm film, aspect ratio ${selectedAspect}.`;
        neg = "plastic skin, CGI doll look, deformed fingers, mutated hands, low quality, oversaturated colors, text artifacts";
      } else if (selectedModel === "dalle3") {
        master = `A breathtaking, cinematic scene depicting ${raw}. The composition embraces ${styleObj?.label} styling with ${lightObj?.tag}. The perspective is captured through ${camObj?.tag}. Wide dynamic range, natural depth of field, crisp high-definition visual storytelling in ${selectedAspect} framing.`;
        neg = "Avoid exaggerated cartoon expressions, distorted faces, blurry background noise, and cluttered geometry.";
      } else if (selectedModel === "sdxl") {
        master = `masterpiece, best quality, (photorealistic:1.3), ${raw}, (${styleObj?.tag}:1.2), (${lightObj?.tag}:1.1), ${camObj?.tag}, intricate details, 8k uhd, dslr, soft lighting, high quality`;
        neg = "(worst quality, low quality:1.4), (deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation";
      } else if (selectedModel === "chatgpt") {
        master = `You are a world-class prompt engineer and creative director.\n\nTask: Develop a comprehensive, highly compelling production brief and execution prompt for: "${raw}".\n\nStyle Context: ${styleObj?.label} with ${lightObj?.label} lighting.\n\nRequirements:\n1. Provide a vivid, sensory-rich scene description.\n2. Detail character/subject nuances, emotional undertones, and textures.\n3. Specify optical settings (${camObj?.label}, ${selectedAspect} framing).\n4. Format the final output in clean Markdown ready for immediate generation.`;
        neg = "Avoid generic clichés, repetitive adjectives, vague descriptions, and passive voice.";
      } else if (selectedModel === "claude") {
        master = `<prompt_engineering_spec>\n  <objective>${raw}</objective>\n  <aesthetic_profile>\n    <style>${styleObj?.label}</style>\n    <lighting>${lightObj?.label}</lighting>\n    <optics>${camObj?.label}</optics>\n    <aspect_ratio>${selectedAspect}</aspect_ratio>\n  </aesthetic_profile>\n  <instructions>\n    Create an impeccably detailed generation prompt that emphasizes physical authenticity, micro-textures, nuanced light interaction, and precise spatial depth.\n  </instructions>\n</prompt_engineering_spec>`;
        neg = "Discard superficial buzzwords. Prioritize concrete physical materials, authentic geometry, and natural light behavior.";
      }

      setGeneratedPrompt(master);
      setNegativePrompt(neg);

      // Generate 3 Distinct Variations
      setVariations([
        {
          title: "🎬 Cinematic Director's Cut",
          tag: "Dramatic & Anamorphic",
          prompt: `Cinematic wide shot of ${raw}. Moody chiaroscuro illumination, heavy atmosphere with volumetric haze, 35mm film grain, Panavision anamorphic lens flare, award-winning cinematography, 8k resolution.`,
        },
        {
          title: "💎 Editorial Fine Art",
          tag: "High-Fashion Minimalist",
          prompt: `Vogue editorial fine art photography of ${raw}. Minimalist clean composition, architectural poise, soft diffuse wrap-around studio light, medium format camera, natural textures, neutral color palette.`,
        },
        {
          title: "🌌 Stylized Visionary Art",
          tag: "Concept & Atmosphere",
          prompt: `Surreal concept art illustration of ${raw}. Dreamy luminous atmosphere, intricate detailing, Studio Ghibli meets Moebius aesthetic, rich atmospheric perspective, masterpiece digital painting.`,
        },
      ]);

      setIsGenerating(false);
      toast.success("Prompt optimized with model-specific parameters!");
    }, 400);
  };

  // Load an inspiration seed
  const handleRandomSeed = () => {
    const random = INSPIRATION_SEEDS[Math.floor(Math.random() * INSPIRATION_SEEDS.length)];
    setInputPrompt(random.text);
    setSelectedStyle(random.style);
    setSelectedLighting(random.lighting);
    setSelectedCamera(random.camera);
    setSelectedModel(random.model);
    setActiveTool(random.tool as StudioToolId);
    toast.info(`Loaded inspiration: "${random.title}"`);
  };

  const copyToClipboard = (text: string, isNeg = false) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (isNeg) {
      setCopiedNeg(true);
      toast.success("Negative prompt copied to clipboard!");
      setTimeout(() => setCopiedNeg(false), 2000);
    } else {
      setCopiedPrompt(true);
      toast.success("Optimized prompt copied to clipboard!");
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <div className="w-full">
      {/* ── Studio Header & Tool Switcher ── */}
      <div className="relative rounded-3xl bg-[#090A0F] border border-white/10 p-4 sm:p-6 lg:p-8 overflow-hidden mb-8 shadow-2xl">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2.5">
              <Sparkles size={13} className="animate-pulse" />
              AI Prompt Studio & Optimizer
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Craft & Enhance <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-brand">Perfect Prompts</span>
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-2xl">
              Transform rough concepts into production-grade prompts engineered for Midjourney, FLUX, DALL-E 3, SDXL, and frontier LLMs.
            </p>
          </div>

          {/* Quick Action: Surprise Me */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleRandomSeed}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/90 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Load a creative seed concept"
            >
              <Dice5 size={16} className="text-cyan-400" />
              <span>Surprise Me</span>
            </button>
            {inputPrompt && (
              <button
                onClick={() => {
                  setInputPrompt("");
                  setGeneratedPrompt("");
                  setVariations([]);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 border border-white/10 text-white/60 text-xs sm:text-sm transition-all cursor-pointer"
                title="Clear input"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Mode Selection Tabs ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
          <button
            onClick={() => setActiveTool("universal")}
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer",
              activeTool === "universal"
                ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
              activeTool === "universal" ? "bg-cyan-500 text-black border-cyan-400" : "bg-white/5 border-white/10 text-white/70"
            )}>
              <Wand2 size={16} />
            </div>
            <div>
              <div className="text-xs font-bold leading-none mb-1">Universal</div>
              <div className="text-[10px] text-white/50 leading-tight">Master Enhancer</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTool("smart-shot");
              setSelectedCamera("85mm");
              setSelectedStyle("hyperrealistic");
            }}
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer",
              activeTool === "smart-shot"
                ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
              activeTool === "smart-shot" ? "bg-cyan-500 text-black border-cyan-400" : "bg-white/5 border-white/10 text-white/70"
            )}>
              <Focus size={16} />
            </div>
            <div>
              <div className="text-xs font-bold leading-none mb-1">Smart Shot</div>
              <div className="text-[10px] text-white/50 leading-tight">Portrait & Human</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTool("relight");
              setSelectedLighting("volumetric");
            }}
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer",
              activeTool === "relight"
                ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
              activeTool === "relight" ? "bg-cyan-500 text-black border-cyan-400" : "bg-white/5 border-white/10 text-white/70"
            )}>
              <SunMedium size={16} />
            </div>
            <div>
              <div className="text-xs font-bold leading-none mb-1">Relight Scene</div>
              <div className="text-[10px] text-white/50 leading-tight">Atmosphere & Glow</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTool("replace-bg");
              setSelectedCamera("24mm");
            }}
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer",
              activeTool === "replace-bg"
                ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
              activeTool === "replace-bg" ? "bg-cyan-500 text-black border-cyan-400" : "bg-white/5 border-white/10 text-white/70"
            )}>
              <RefreshCcw size={16} />
            </div>
            <div>
              <div className="text-xs font-bold leading-none mb-1">Replace BG</div>
              <div className="text-[10px] text-white/50 leading-tight">World & Scenery</div>
            </div>
          </button>
        </div>

        {/* ── Model Selector Pills ── */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
            Target AI Model & Engine
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {AI_MODELS.map((m) => {
              const isSelected = selectedModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={cn(
                    "flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                    isSelected
                      ? "bg-white/10 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                      : "bg-black/20 border-white/5 text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-sm">{m.icon}</span>
                    <span className={cn(
                      "text-[9px] font-black px-1.5 py-0.5 rounded",
                      m.badge === "IMAGE" ? "bg-cyan-500/20 text-cyan-300" : "bg-amber-500/20 text-amber-300"
                    )}>
                      {m.badge}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white truncate">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Main Input Area ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70">
              Your Raw Idea or Prompt
            </label>
            <span className="text-[11px] text-white/40">{inputPrompt.length} characters</span>
          </div>
          <div className="relative">
            <textarea
              rows={3}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                activeTool === "smart-shot"
                  ? "Describe your subject, emotion, attire, or expression (e.g., cyberpunk pilot with subtle cyberware, wearing flight jacket in rain)..."
                  : activeTool === "relight"
                  ? "Describe your desired atmosphere, mood, or light source (e.g., misty greenhouse at dawn with golden rays cutting through glass)..."
                  : activeTool === "replace-bg"
                  ? "Describe the scenery, architecture, or environment (e.g., brutalist concrete pavilion overlooking a tranquil mountain lake)..."
                  : "Enter any basic idea or raw prompt to enhance and optimize..."
              }
              className="w-full rounded-2xl bg-black/40 border border-white/10 p-3.5 sm:p-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none shadow-inner"
            />
          </div>
        </div>

        {/* ── Parameters Matrix (Style, Lighting, Camera, Aspect Ratio) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/30 border border-white/5 mb-6">
          {/* Style */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-white/70 mb-2">
              <Palette size={13} className="text-cyan-400" />
              Visual Style
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-[#0E1017] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {STYLE_PRESETS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lighting */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-white/70 mb-2">
              <SunMedium size={13} className="text-amber-400" />
              Lighting Atmosphere
            </label>
            <select
              value={selectedLighting}
              onChange={(e) => setSelectedLighting(e.target.value)}
              className="w-full bg-[#0E1017] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {LIGHTING_PRESETS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Camera / Optics */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-white/70 mb-2">
              <Camera size={13} className="text-purple-400" />
              Camera Optics
            </label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full bg-[#0E1017] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {CAMERA_PRESETS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-white/70 mb-2">
              <Ratio size={13} className="text-emerald-400" />
              Aspect Ratio
            </label>
            <select
              value={selectedAspect}
              onChange={(e) => setSelectedAspect(e.target.value)}
              className="w-full bg-[#0E1017] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {ASPECT_RATIOS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} ({a.desc})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Enhance CTA Button ── */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleEnhance}
            disabled={isGenerating}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-brand hover:brightness-110 text-black font-extrabold text-sm sm:text-base shadow-lg shadow-cyan-500/25 transition-all transform active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <Wand2 size={18} className={cn("transition-transform", isGenerating && "animate-spin")} />
            <span>{isGenerating ? "Synthesizing Tokens..." : "Enhance & Optimize Prompt"}</span>
          </button>
        </div>
      </div>

      {/* ── Results Workbench Output ── */}
      <AnimatePresence>
        {generatedPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-3xl bg-[#090A0F] border border-cyan-500/30 p-5 sm:p-7 lg:p-8 relative overflow-hidden shadow-[0_10px_40px_rgba(6,182,212,0.1)] mb-12"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[90px] pointer-events-none" />

            {/* Output Navigation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-lg font-extrabold text-white">Generated Production Prompt</h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10">
                  {AI_MODELS.find((m) => m.id === selectedModel)?.name}
                </span>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab("master")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    activeTab === "master" ? "bg-cyan-500 text-black" : "text-white/60 hover:text-white"
                  )}
                >
                  Master Prompt
                </button>
                <button
                  onClick={() => setActiveTab("variations")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    activeTab === "variations" ? "bg-cyan-500 text-black" : "text-white/60 hover:text-white"
                  )}
                >
                  3 Variations
                </button>
                {negativePrompt && (
                  <button
                    onClick={() => setActiveTab("negative")}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      activeTab === "negative" ? "bg-cyan-500 text-black" : "text-white/60 hover:text-white"
                    )}
                  >
                    Negative Prompt
                  </button>
                )}
              </div>
            </div>

            {/* ── TAB 1: MASTER PROMPT ── */}
            {activeTab === "master" && (
              <div className="space-y-4">
                <div className="relative group rounded-2xl bg-black/60 border border-white/10 p-4 sm:p-5 font-mono text-xs sm:text-sm text-cyan-100/90 leading-relaxed break-words select-all">
                  {generatedPrompt}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(generatedPrompt)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs sm:text-sm font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
                    >
                      {copiedPrompt ? <Check size={15} /> : <Copy size={15} />}
                      <span>{copiedPrompt ? "Copied Prompt!" : "Copy Full Prompt"}</span>
                    </button>
                    {negativePrompt && (
                      <button
                        onClick={() => copyToClipboard(negativePrompt, true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs sm:text-sm font-medium transition-all cursor-pointer"
                      >
                        {copiedNeg ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>Copy Negative</span>
                      </button>
                    )}
                  </div>

                  {/* Test in External AI links */}
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <span>Test prompt on:</span>
                    <a
                      href="https://discord.com/channels/@me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                    >
                      <span>Midjourney</span>
                      <ExternalLink size={11} />
                    </a>
                    <a
                      href="https://chatgpt.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                    >
                      <span>ChatGPT</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: 3 VARIATIONS ── */}
            {activeTab === "variations" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variations.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl bg-black/40 border border-white/10 p-4 hover:border-cyan-500/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{v.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-cyan-300 font-semibold">
                          {v.tag}
                        </span>
                      </div>
                      <p className="text-xs text-white/80 font-mono leading-relaxed mb-4 select-all">
                        {v.prompt}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(v.prompt)}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-white hover:text-cyan-300 border border-white/10 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Copy size={13} />
                      <span>Copy Variation</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ── TAB 3: NEGATIVE PROMPT ── */}
            {activeTab === "negative" && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-black/60 border border-rose-500/20 p-4 sm:p-5 font-mono text-xs sm:text-sm text-rose-200/80 leading-relaxed break-words select-all">
                  {negativePrompt}
                </div>
                <button
                  onClick={() => copyToClipboard(negativePrompt, true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  {copiedNeg ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copiedNeg ? "Copied Negative Prompt!" : "Copy Negative Prompt"}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
