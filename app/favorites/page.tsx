"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  ArrowLeft,
  Trash2,
  Sparkles,
  Compass,
  Search,
  Filter,
  FolderOpen,
  Plus,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/components/favorites/FavoritesContext";
import { PromptCard } from "@/components/prompts/PromptCard";
import { PromptSkeletonGrid } from "@/components/prompts/PromptSkeleton";
import { SaveToCollectionModal } from "@/components/favorites/SaveToCollectionModal";
import promptsData from "@/data/prompts.json";
import type { Prompt } from "@/types";

const ALL_PROMPTS = promptsData as Prompt[];

export default function FavoritesPage() {
  const {
    favorites,
    collections,
    totalCount,
    removeFavorite,
    getFavoritesForCollection,
    createCollection,
  } = useFavorites();

  const [mounted, setMounted] = useState(false);
  const [activeCollection, setActiveCollection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "free" | "pro">("newest");
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [newColName, setNewColName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleIds = useMemo(() => {
    if (activeCollection === "all") return favorites.map((f) => f.promptId);
    return getFavoritesForCollection(activeCollection);
  }, [activeCollection, favorites, getFavoritesForCollection]);

  const visiblePrompts = useMemo(() => {
    let prompts = ALL_PROMPTS.filter((p) => visibleIds.includes(p.id));

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      prompts = prompts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "newest") {
      prompts = [...prompts].sort((a, b) => {
        const tA = favorites.find((f) => f.promptId === a.id)?.addedAt ?? 0;
        const tB = favorites.find((f) => f.promptId === b.id)?.addedAt ?? 0;
        return tB - tA;
      });
    } else if (sortBy === "oldest") {
      prompts = [...prompts].sort((a, b) => {
        const tA = favorites.find((f) => f.promptId === a.id)?.addedAt ?? 0;
        const tB = favorites.find((f) => f.promptId === b.id)?.addedAt ?? 0;
        return tA - tB;
      });
    } else if (sortBy === "free") {
      prompts = prompts.filter((p) => !p.isPro);
    } else if (sortBy === "pro") {
      prompts = prompts.filter((p) => p.isPro);
    }

    return prompts;
  }, [visibleIds, searchQuery, sortBy, favorites]);

  const handleCreateCollection = () => {
    if (!newColName.trim()) return;
    createCollection(newColName.trim());
    setNewColName("");
    setCreatingCollection(false);
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <PromptSkeletonGrid count={8} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-8 mb-8">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Discover
          </Link>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            My Favorites
            {totalCount > 0 && (
              <span className="text-base font-bold text-muted-foreground/60 tabular-nums">
                ({totalCount})
              </span>
            )}
          </h1>
          <p className="text-xs text-muted-foreground/60">
            {totalCount === 0
              ? "Save prompts you love and organize them into collections."
              : `${totalCount} saved prompt${totalCount === 1 ? "" : "s"} across ${collections.filter(c => c.promptIds.length > 0).length} collection${collections.filter(c => c.promptIds.length > 0).length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      {totalCount === 0 ? (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto py-20 animate-fade-in">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/15 mb-6">
            <Heart className="w-9 h-9 text-rose-500/50" />
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-gold animate-pulse" />
          </div>
          <h2 className="text-xl font-black tracking-tight mb-2">No favorites yet</h2>
          <p className="text-xs text-muted-foreground/60 leading-relaxed mb-8 max-w-xs">
            Browse our premium prompt library and tap the ❤️ icon to save prompts for later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-[0_4px_15px_oklch(0.58_0.19_185_/_0.3)]"
          >
            <Compass className="w-4 h-4" />
            Explore Prompts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">

          {/* ── Collections Sidebar ── */}
          <aside className="space-y-2">
            {/* All */}
            <button
              onClick={() => setActiveCollection("all")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all",
                activeCollection === "all"
                  ? "bg-primary/10 text-primary border border-primary/15"
                  : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">All Favorites</span>
              <span className="text-[10px] font-bold text-muted-foreground/50">{totalCount}</span>
            </button>

            <div className="border-t border-border/10 pt-2 mt-2 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-3 pb-1">Collections</p>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setActiveCollection(col.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-left transition-all",
                    activeCollection === col.id
                      ? "bg-primary/10 text-primary border border-primary/15"
                      : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-base leading-none w-5 text-center">{col.icon}</span>
                  <span className="flex-1 truncate">{col.name}</span>
                  {col.promptIds.length > 0 && (
                    <span className="text-[10px] font-bold text-muted-foreground/50">{col.promptIds.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Create collection */}
            {creatingCollection ? (
              <div className="pt-2 space-y-2">
                <input
                  autoFocus
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateCollection()}
                  placeholder="Collection name…"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-secondary/40 border border-border/20 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/40"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateCollection}
                    className="flex-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => { setCreatingCollection(false); setNewColName(""); }}
                    className="px-3 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground text-xs font-bold"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setCreatingCollection(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors mt-2"
              >
                <Plus className="h-3.5 w-3.5" />
                New Collection
              </button>
            )}
          </aside>

          {/* ── Main Content ── */}
          <div className="space-y-5">
            {/* Search + Sort bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search favorites…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-secondary/30 border border-border/20 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/40"
                />
              </div>
              <div className="flex items-center gap-1.5">
                {(["newest", "oldest", "free", "pro"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all",
                      sortBy === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground/60 font-semibold">
                {visiblePrompts.length === 0 ? "No results" : `${visiblePrompts.length} prompt${visiblePrompts.length === 1 ? "" : "s"}`}
              </p>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {visiblePrompts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <FolderOpen className="h-10 w-10 text-muted-foreground/20 mb-3" />
                  <p className="text-sm font-bold text-muted-foreground/50">
                    {searchQuery ? "No prompts match your search" : "This collection is empty"}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeCollection + sortBy + searchQuery}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3"
                >
                  {visiblePrompts.map((prompt, i) => (
                    <div key={prompt.id} className="relative group/fav">
                      <PromptCard prompt={prompt} index={i} />
                      {/* Remove overlay */}
                      <button
                        onClick={() => removeFavorite(prompt.id)}
                        title="Remove from favorites"
                        className="absolute top-1.5 left-1.5 z-20 opacity-0 group-hover/fav:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-full bg-red-500/90 hover:bg-red-600 text-white shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
