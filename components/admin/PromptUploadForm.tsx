"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { CATEGORIES, AI_MODELS } from "@/lib/constants";
import { createPromptAction } from "@/app/actions/prompt";
import { 
  Sparkles, 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  ArrowRight,
  PlusCircle,
  Hash,
  Sliders,
  Settings,
  User,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PromptUploadForm() {
  const [isPending, setIsPending] = useState(false);
  
  // Form values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptText, setPromptText] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]?.slug || "");
  const [subCategory, setSubCategory] = useState("");
  const [model, setModel] = useState(AI_MODELS[0]?.slug || "");
  
  const [difficulty, setDifficulty] = useState(1);
  const [quality, setQuality] = useState(5);
  
  const [estimatedTime, setEstimatedTime] = useState("5m");
  const [style, setStyle] = useState("");
  const [camera, setCamera] = useState("");
  const [lighting, setLighting] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  
  const [author, setAuthor] = useState("Admin");
  const [version, setVersion] = useState("1.0");

  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [accessLevel, setAccessLevel] = useState<"FREE" | "PRO">("FREE");
  
  const [tags, setTags] = useState("");
  const [colorPalette, setColorPalette] = useState("");

  // Preview Image state (file or URL)
  const [imageSource, setImageSource] = useState<"file" | "url">("file");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("File size is too large (max 8MB).");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !promptText) {
      toast.error("Please fill in all required fields (Title, Description, and Prompt).");
      return;
    }

    if (imageSource === "file" && !previewUrl) {
      toast.error("Please upload a preview image file.");
      return;
    }
    
    if (imageSource === "url" && !imageUrl) {
      toast.error("Please enter a preview image URL.");
      return;
    }

    setIsPending(true);
    const toastId = toast.loading("Uploading and creating prompt...");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("prompt", promptText);
      formData.append("negativePrompt", negativePrompt);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("model", model);
      formData.append("difficulty", difficulty.toString());
      formData.append("quality", quality.toString());
      formData.append("estimatedTime", estimatedTime);
      formData.append("style", style);
      formData.append("camera", camera);
      formData.append("lighting", lighting);
      formData.append("aspectRatio", aspectRatio);
      formData.append("author", author);
      formData.append("version", version);
      formData.append("isFeatured", isFeatured.toString());
      formData.append("isTrending", isTrending.toString());
      formData.append("accessLevel", accessLevel);
      formData.append("tags", tags);
      formData.append("colorPalette", colorPalette);

      if (imageSource === "file" && fileInputRef.current?.files?.[0]) {
        formData.append("previewImageFile", fileInputRef.current.files[0]);
      } else {
        formData.append("previewImageUrl", imageUrl);
      }

      const result = await createPromptAction(null, formData);

      if (result.success) {
        toast.success("Prompt uploaded successfully!", { id: toastId });
        
        // Reset form
        setTitle("");
        setDescription("");
        setPromptText("");
        setNegativePrompt("");
        setSubCategory("");
        setTags("");
        setColorPalette("");
        setPreviewUrl(null);
        setImageUrl("");
        setIsFeatured(false);
        setIsTrending(false);
        setAccessLevel("FREE");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(result.error || "Failed to upload prompt.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.", { id: toastId });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6.5">
        
        {/* Left Column: Form Details (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Core Content */}
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md space-y-5">
            <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              Core Information
            </h3>
            
            <div className="space-y-4.5">
              <div>
                <label htmlFor="title" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                  Prompt Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g. Cinematic Retro Cyberpunk Streetscape"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 text-white placeholder-neutral-500 rounded-xl text-sm transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={3}
                  placeholder="A cinematic 8k portrait of an astronaut walking in Tokyo at night, neon reflections..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 text-white placeholder-neutral-500 rounded-xl text-sm transition-all duration-300 resize-y"
                />
              </div>

              <div>
                <label htmlFor="promptText" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                  The Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="promptText"
                  required
                  rows={5}
                  placeholder="Enter the full generative prompt text here..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 text-white font-mono placeholder-neutral-500 rounded-xl text-sm transition-all duration-300 resize-y"
                />
              </div>

              <div>
                <label htmlFor="negativePrompt" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                  Negative Prompt (Optional)
                </label>
                <textarea
                  id="negativePrompt"
                  rows={2}
                  placeholder="ugly, deformed, noise, low resolution, watermark..."
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 text-white font-mono placeholder-neutral-500 rounded-xl text-sm transition-all duration-300 resize-y"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Metadata & Taxonomy */}
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md space-y-5">
            <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" />
              Taxonomy & Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 text-white rounded-xl text-sm transition-all duration-300 appearance-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug} className="bg-neutral-900 text-white">
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subCategory" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                  Sub-Category (Optional)
                </label>
                <input
                  id="subCategory"
                  type="text"
                  placeholder="e.g. Cyberpunk, Vintage, Portraiture"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 text-white placeholder-neutral-500 rounded-xl text-sm transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                  AI Model Architecture <span className="text-red-500">*</span>
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 text-white rounded-xl text-sm transition-all duration-300"
                >
                  {AI_MODELS.map((m) => (
                    <option key={m.slug} value={m.slug} className="bg-neutral-900 text-white">
                      {m.icon} {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                  Tags (Comma-separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  placeholder="neon, 8k, bokeh, cyberpunk, retro"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 text-white placeholder-neutral-500 rounded-xl text-sm transition-all duration-300"
                />
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Upload Media & Side Parameters (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 3: Preview Image (Upload or URL) */}
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md space-y-5">
            <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-blue-400" />
              Preview Image
            </h3>

            {/* Toggle Source */}
            <div className="flex gap-2 p-1 rounded-xl bg-neutral-950 border border-neutral-800/60">
              <button
                type="button"
                onClick={() => setImageSource("file")}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  imageSource === "file" 
                    ? "bg-neutral-800 text-white" 
                    : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                Local File Upload
              </button>
              <button
                type="button"
                onClick={() => setImageSource("url")}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  imageSource === "url" 
                    ? "bg-neutral-800 text-white" 
                    : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                External Image URL
              </button>
            </div>

            {imageSource === "file" ? (
              <div className="space-y-4">
                {previewUrl ? (
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-neutral-800 group shadow-lg">
                    <img 
                      src={previewUrl} 
                      alt="Upload Preview" 
                      className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 text-red-400 hover:text-red-300 transition-all duration-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed border-neutral-800/80 hover:border-purple-500/50 hover:bg-neutral-900/10 cursor-pointer",
                      "aspect-square w-full rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300 shadow-inner"
                    )}
                  >
                    <UploadCloud className="h-10 w-10 text-neutral-500 mb-3 group-hover:text-purple-400" />
                    <p className="text-xs font-bold text-neutral-300 mb-1">Drag and drop file here</p>
                    <p className="text-[10px] text-neutral-500">Supports PNG, JPG, WEBP (Max 8MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="imageUrl" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                    Image URL
                  </label>
                  <input
                    id="imageUrl"
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setPreviewUrl(e.target.value || null);
                    }}
                    className="w-full px-4 py-3 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 text-white placeholder-neutral-500 rounded-xl text-sm transition-all duration-300"
                  />
                </div>
                {previewUrl && (
                  <div className="aspect-square w-full rounded-xl overflow-hidden border border-neutral-800 shadow-md">
                    <img 
                      src={previewUrl} 
                      alt="URL Preview" 
                      className="h-full w-full object-cover"
                      onError={() => toast.error("Could not load image from URL.")}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 4: Advanced Styling Parameters */}
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md space-y-5">
            <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Settings className="h-4 w-4 text-orange-400" />
              Aesthetics & Setup
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="difficulty" className="block text-xs font-bold text-neutral-400 uppercase mb-1">
                    Difficulty ({difficulty})
                  </label>
                  <input
                    id="difficulty"
                    type="range"
                    min={1}
                    max={3}
                    step={1}
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 font-bold">
                    <span>EASY</span>
                    <span>MID</span>
                    <span>EXPERT</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="quality" className="block text-xs font-bold text-neutral-400 uppercase mb-1">
                    Quality ({quality}/5)
                  </label>
                  <input
                    id="quality"
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 font-bold">
                    <span>1⭐</span>
                    <span>3⭐</span>
                    <span>5⭐</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="aspectRatio" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                    Aspect Ratio
                  </label>
                  <input
                    id="aspectRatio"
                    type="text"
                    placeholder="e.g. 16:9, 4:5"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 text-white rounded-xl text-xs transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="estimatedTime" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                    Estimated Time
                  </label>
                  <input
                    id="estimatedTime"
                    type="text"
                    placeholder="e.g. 5m, 1h"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 text-white rounded-xl text-xs transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="colorPalette" className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                  Color Palette (Comma-separated)
                </label>
                <input
                  id="colorPalette"
                  type="text"
                  placeholder="#000000, #ffffff, #ff00ff"
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-950/60 border border-neutral-800/85 focus:border-purple-500/80 text-white rounded-xl text-xs transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-950 border border-neutral-800/60 cursor-pointer hover:border-purple-500/30 transition-all duration-300 select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded accent-purple-500"
                  />
                  <span className="text-xs font-bold text-neutral-300">Featured</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-950 border border-neutral-800/60 cursor-pointer hover:border-purple-500/30 transition-all duration-300 select-none">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="rounded accent-purple-500"
                  />
                  <span className="text-xs font-bold text-neutral-300">Trending</span>
                </label>
              </div>

              {/* Access Level Toggle */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">
                  Access Level <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 p-1 rounded-xl bg-neutral-950 border border-neutral-800/60">
                  <button
                    type="button"
                    onClick={() => setAccessLevel("FREE")}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-xs font-black transition-all duration-300 flex items-center justify-center gap-1.5",
                      accessLevel === "FREE"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                        : "text-neutral-500 hover:text-neutral-300"
                    )}
                  >
                    ✅ FREE
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccessLevel("PRO")}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-xs font-black transition-all duration-300 flex items-center justify-center gap-1.5",
                      accessLevel === "PRO"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                        : "text-neutral-500 hover:text-neutral-300"
                    )}
                  >
                    👑 PRO
                  </button>
                </div>
                {accessLevel === "PRO" && (
                  <p className="text-[10px] text-amber-400/70 mt-1.5 font-semibold">
                    PRO prompts are locked for FREE users. Only PRO subscribers can copy.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full py-4 px-6 rounded-2xl font-black text-sm text-white uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-500",
              "bg-gradient-to-r from-purple-600 to-indigo-600",
              "hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:brightness-110",
              "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <span>Publish Prompt</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>

        </div>

      </div>
    </form>
  );
}
