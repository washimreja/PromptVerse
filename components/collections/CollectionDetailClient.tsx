"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  SortAsc,
  CheckSquare,
  Square,
  Trash2,
  FolderInput,
  Copy,
  ExternalLink,
  Heart,
  Edit3,
  Calendar,
  Layers,
  Sparkles,
  FolderHeart,
  X,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/components/favorites/FavoritesContext";
import { copyProPromptAction } from "@/app/actions/user";
import type { Prompt } from "@/types";

interface CollectionData {
  id: string;
  name: string;
  icon: string;
  createdAt: number;
  updatedAt: number;
  promptIds: string[];
  prompts: Prompt[];
  stats: {
    totalPrompts: number;
    freeCount: number;
    proCount: number;
  };
}

interface CollectionDetailClientProps {
  initialData: CollectionData | null;
  collectionId: string;
}

export function CollectionDetailClient({
  initialData,
  collectionId,
}: CollectionDetailClientProps) {
  const router = useRouter();
  const {
    collections,
    isFavorited,
    toggleFavorite,
    removeFromCollection,
    bulkRemoveFromCollection,
    bulkMoveToCollection,
    renameCollection,
    deleteCollection,
    addToCollection,
  } = useFavorites();

  // Local state
  const [collection, setCollection] = useState<CollectionData | null>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recently_added" | "newest" | "oldest" | "alphabetical" | "most_copied">("recently_added");
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(collection?.name || "");
  const [editIcon, setEditIcon] = useState(collection?.icon || "📁");
  const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false);
  const [promptToRemove, setPromptToRemove] = useState<Prompt | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [promptToMove, setPromptToMove] = useState<string[]>([]);

  const ICON_OPTIONS = ["📁", "⭐", "🎨", "💬", "🎬", "🧠", "📚", "✈️", "💼", "🌸", "🏆", "🔥"];

  // Sync state if initialData changes
  useEffect(() => {
    if (initialData) {
      setCollection(initialData);
      setEditName(initialData.name);
      setEditIcon(initialData.icon);
    }
  }, [initialData]);

  // Keep collection prompt list synced with Context state changes
  useEffect(() => {
    const currentContextCol = collections.find((c) => c.id === collectionId);
    if (currentContextCol && collection) {
      const activeSet = new Set(currentContextCol.promptIds);
      const updatedPrompts = collection.prompts.filter((p) => activeSet.has(p.id));
      if (updatedPrompts.length !== collection.prompts.length) {
        const freeCount = updatedPrompts.filter((p) => p.accessLevel === "FREE").length;
        const proCount = updatedPrompts.filter((p) => p.accessLevel === "PRO").length;
        setCollection({
          ...collection,
          name: currentContextCol.name,
          icon: currentContextCol.icon,
          promptIds: currentContextCol.promptIds,
          prompts: updatedPrompts,
          stats: {
            totalPrompts: updatedPrompts.length,
            freeCount,
            proCount,
          },
        });
      }
    }
  }, [collections, collectionId, collection]);

  // Filter & Sort prompts
  const filteredPrompts = useMemo(() => {
    if (!collection?.prompts) return [];

    let list = collection.prompts.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.model?.toLowerCase().includes(query) ||
        p.prompt?.toLowerCase().includes(query)
      );
    });

    switch (sortBy) {
      case "newest":
        return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "oldest":
        return [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "alphabetical":
        return [...list].sort((a, b) => a.title.localeCompare(b.title));
      case "most_copied":
        return [...list].sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0));
      case "recently_added":
      default:
        return list;
    }
  }, [collection?.prompts, searchQuery, sortBy]);

  // Multi select handlers
  const toggleSelectPrompt = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredPrompts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPrompts.map((p) => p.id));
    }
  };

  // Actions
  const handleCopyPrompt = async (prompt: Prompt) => {
    try {
      if (prompt.accessLevel === "PRO" && !prompt.prompt) {
        const res = await copyProPromptAction(prompt.id);
        if (res.success) {
          await navigator.clipboard.writeText(res.text);
          toast.success("PRO prompt copied to clipboard! 🚀", { icon: "📋" });
        } else {
          toast.error("Pro subscription required to copy this prompt", { icon: "🔒" });
        }
        return;
      }

      await navigator.clipboard.writeText(prompt.prompt);
      toast.success("Prompt copied to clipboard!", { icon: "📋" });
    } catch (_) {
      toast.error("Failed to copy prompt");
    }
  };

  const handleBulkCopy = async () => {
    const selectedPrompts = collection?.prompts.filter((p) => selectedIds.includes(p.id)) || [];
    const textToCopy = selectedPrompts.map((p) => `--- ${p.title} ---\n${p.prompt || "[PRO Content]"}`).join("\n\n");
    await navigator.clipboard.writeText(textToCopy);
    toast.success(`Copied ${selectedPrompts.length} prompts to clipboard!`, { icon: "📋" });
  };

  const handleRemoveSinglePrompt = async () => {
    if (!promptToRemove) return;
    await removeFromCollection(promptToRemove.id, collectionId);
    setPromptToRemove(null);
  };

  const handleBulkRemove = async () => {
    if (selectedIds.length === 0) return;
    await bulkRemoveFromCollection(selectedIds, collectionId);
    setSelectedIds([]);
    setIsMultiSelect(false);
  };

  const handleSaveRename = async () => {
    if (!editName.trim()) return;
    await renameCollection(collectionId, editName.trim(), editIcon);
    if (collection) {
      setCollection({
        ...collection,
        name: editName.trim(),
        icon: editIcon,
      });
    }
    setIsEditOpen(false);
  };

  const handleDeleteCollectionConfirm = async () => {
    await deleteCollection(collectionId);
    router.push("/profile");
  };

  const handleMoveConfirm = async (targetColId: string) => {
    await bulkMoveToCollection(promptToMove, collectionId, targetColId);
    setIsMoveModalOpen(false);
    setPromptToMove([]);
    setSelectedIds([]);
    setIsMultiSelect(false);
  };

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#08090d] text-white pt-24 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-4">
          <FolderHeart className="w-8 h-8 text-white/40" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Collection Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          This collection may have been removed or doesn't exist.
        </p>
        <Link
          href="/profile"
          className="px-5 py-2.5 bg-brand hover:bg-brand/90 text-black font-bold text-sm rounded-xl transition-all"
        >
          Back to Profile
        </Link>
      </div>
    );
  }

  const createdDateStr = new Date(collection.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#08090d] text-white pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-cyan-400 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Collections
        </Link>

        {/* Collection Header */}
        <div className="bg-[#090A0F] border border-white/10 rounded-[2rem] p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4 sm:gap-6">
              <span className="text-4xl sm:text-5xl p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                {collection.icon || "📁"}
              </span>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {collection.name}
                  </h1>
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                    title="Edit Collection"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5 font-semibold text-cyan-400">
                    <Layers className="w-3.5 h-3.5" />
                    {collection.stats.totalPrompts} Prompts
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Created {createdDateStr}
                  </span>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      {collection.stats.freeCount} FREE
                    </span>
                    {collection.stats.proCount > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[10px]">
                        {collection.stats.proCount} PRO
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Delete collection button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDeleteCollectionOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Delete Collection
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Sort & Multi-Select */}
        {collection.prompts.length > 0 && (
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-[#090A0F]/60 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inside collection..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Multi Select */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-2 rounded-xl">
                <SortAsc className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <option value="recently_added" className="bg-[#090A0F]">Recently Added</option>
                  <option value="newest" className="bg-[#090A0F]">Newest Creation</option>
                  <option value="oldest" className="bg-[#090A0F]">Oldest</option>
                  <option value="alphabetical" className="bg-[#090A0F]">Alphabetical (A-Z)</option>
                  <option value="most_copied" className="bg-[#090A0F]">Most Copied</option>
                </select>
              </div>

              {/* Multi-Select Toggle */}
              <button
                onClick={() => {
                  setIsMultiSelect(!isMultiSelect);
                  setSelectedIds([]);
                }}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95",
                  isMultiSelect
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
                    : "bg-white/[0.04] border-white/10 text-white/80 hover:bg-white/10"
                )}
              >
                {isMultiSelect ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                Select Mode
              </button>
            </div>
          </div>
        )}

        {/* Sticky Bulk Action Bar */}
        <AnimatePresence>
          {isMultiSelect && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="sticky top-20 z-40 mb-6 bg-gradient-to-r from-cyan-950/90 via-[#090A0F]/95 to-slate-950/90 border border-cyan-500/30 p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAll}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  {selectedIds.length === filteredPrompts.length ? "Deselect All" : "Select All"}
                </button>
                <span className="text-xs font-bold text-cyan-400">
                  {selectedIds.length} Selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={selectedIds.length === 0}
                  onClick={handleBulkCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white disabled:opacity-40 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Bulk Copy
                </button>
                <button
                  disabled={selectedIds.length === 0}
                  onClick={() => {
                    setPromptToMove(selectedIds);
                    setIsMoveModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-bold text-cyan-400 disabled:opacity-40 transition-colors"
                >
                  <FolderInput className="w-3.5 h-3.5" /> Move Selected
                </button>
                <button
                  disabled={selectedIds.length === 0}
                  onClick={handleBulkRemove}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-xs font-bold text-red-400 disabled:opacity-40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Selected
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredPrompts.map((prompt) => {
              const isSelected = selectedIds.includes(prompt.id);
              const fav = isFavorited(prompt.id);
              return (
                <motion.div
                  key={prompt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "group relative bg-[#090A0F] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300",
                    isSelected
                      ? "border-cyan-400 ring-2 ring-cyan-400/30 bg-cyan-950/20"
                      : "border-white/10 hover:border-white/20 hover:bg-[#0c0e17]"
                  )}
                >
                  {/* Select Checkbox (when MultiSelect is active) */}
                  {isMultiSelect && (
                    <button
                      onClick={() => toggleSelectPrompt(prompt.id)}
                      className="absolute top-2 left-2 z-30 p-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/20 hover:scale-105 transition-transform"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                      ) : (
                        <Square className="w-4 h-4 text-white/60" />
                      )}
                    </button>
                  )}

                  {/* Thumbnail / Gradient Placeholder */}
                  <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-black/40">
                    {prompt.previewImage ? (
                      <img
                        src={prompt.previewImage}
                        alt={prompt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Hide image and show gradient on error
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    
                    {/* Mesh Gradient Fallback when no image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-purple-900/30 to-slate-950 flex flex-col items-center justify-center p-3 text-center pointer-events-none">
                      <Sparkles className="w-6 h-6 text-cyan-400/50 mb-1" />
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{prompt.model}</span>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-2 right-2 z-20 flex gap-1">
                      {prompt.accessLevel === "PRO" ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-black font-black text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-lg">
                          <Lock className="w-2.5 h-2.5" /> PRO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-black font-black text-[9px] uppercase tracking-wider shadow-lg">
                          FREE
                        </span>
                      )}
                    </div>

                    {/* Quick Overlay Action Bar */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-10">
                      <div className="flex items-center justify-between gap-1">
                        <Link
                          href={`/prompts/${prompt.id}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold backdrop-blur-md transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> Open
                        </Link>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFavorite(prompt.id, prompt.title)}
                            className={cn(
                              "p-1.5 rounded-lg backdrop-blur-md transition-colors",
                              fav ? "bg-rose-500/30 text-rose-400" : "bg-black/60 text-white hover:bg-white/20"
                            )}
                            title="Favorite"
                          >
                            <Heart className={cn("w-3.5 h-3.5", fav && "fill-rose-400")} />
                          </button>
                          
                          <button
                            onClick={() => {
                              setPromptToMove([prompt.id]);
                              setIsMoveModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-black/60 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                            title="Move to another collection"
                          >
                            <FolderInput className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => setPromptToRemove(prompt)}
                            className="p-1.5 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-400 backdrop-blur-md transition-colors"
                            title="Remove from collection"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Footer */}
                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider truncate">
                          {prompt.model}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 truncate">
                          {prompt.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                        {prompt.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleCopyPrompt(prompt)}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/30 border border-white/10 text-white hover:text-cyan-300 text-xs font-bold transition-all active:scale-95"
                    >
                      <Copy className="w-3 h-3" /> Copy Prompt
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#090A0F] border border-white/5 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
              <FolderHeart className="w-10 h-10 text-cyan-400/60" />
            </div>
            <h3 className="text-xl font-bold mb-2">This collection is empty</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              {searchQuery
                ? `No prompts match "${searchQuery}". Try a different keyword.`
                : "Explore our library of premium AI prompts and save your favorites here."}
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-brand hover:bg-brand/90 text-black font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95"
            >
              Browse Prompts
            </Link>
          </div>
        )}

      </div>

      {/* Edit Collection Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#090A0F] border border-white/15 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Edit Collection</h3>
                <button onClick={() => setIsEditOpen(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Icon Selection */}
              <div className="mb-4">
                <label className="text-xs font-bold text-muted-foreground mb-2 block">Choose Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setEditIcon(icon)}
                      className={cn(
                        "w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all",
                        editIcon === icon ? "bg-cyan-500/20 border border-cyan-500 scale-110" : "bg-white/5 hover:bg-white/10"
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-6">
                <label className="text-xs font-bold text-muted-foreground mb-2 block">Collection Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRename}
                  disabled={!editName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand/90 text-black text-xs font-bold disabled:opacity-40"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Single Prompt Remove Confirmation Modal */}
      <AnimatePresence>
        {promptToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#090A0F] border border-white/15 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3 text-amber-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">Remove Prompt?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Remove <span className="font-bold text-white">"{promptToRemove.title}"</span> from this collection?
                This action only removes it from this folder and does NOT delete the prompt from PromptVerse.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPromptToRemove(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveSinglePrompt}
                  className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Collection Confirmation Modal */}
      <AnimatePresence>
        {isDeleteCollectionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#090A0F] border border-red-500/30 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">Delete Collection?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                This collection contains <span className="font-bold text-white">{collection.stats.totalPrompts} prompts</span>.
              </p>
              <p className="text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl mb-6">
                Deleting this collection will NOT delete the original prompts from PromptVerse.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteCollectionOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCollectionConfirm}
                  className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-lg"
                >
                  Yes, Delete Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move to Collection Modal */}
      <AnimatePresence>
        {isMoveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#090A0F] border border-white/15 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Move to Collection</h3>
                <button onClick={() => setIsMoveModalOpen(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Select target collection to move {promptToMove.length} prompt(s):
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
                {collections
                  .filter((c) => c.id !== collectionId)
                  .map((col) => (
                    <button
                      key={col.id}
                      onClick={() => handleMoveConfirm(col.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/30 border border-white/10 text-left transition-all group"
                    >
                      <span className="text-xl">{col.icon || "📁"}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white group-hover:text-cyan-300">{col.name}</p>
                        <p className="text-[10px] text-muted-foreground">{col.promptIds.length} saved</p>
                      </div>
                      <FolderInput className="w-4 h-4 text-white/40 group-hover:text-cyan-300" />
                    </button>
                  ))}
                {collections.filter((c) => c.id !== collectionId).length === 0 && (
                  <p className="text-xs text-center text-muted-foreground py-4">
                    No other collections available. Create a new collection first.
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsMoveModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
