"use client";

import { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFavorites } from "./FavoritesContext";

interface SaveToCollectionModalProps {
  promptId: string;
  promptTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SaveToCollectionModal({
  promptId,
  promptTitle,
  isOpen,
  onClose,
}: SaveToCollectionModalProps) {
  const { collections, addToCollection, createCollection, getFavoritesForCollection } =
    useFavorites();
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("📁");

  const ICON_OPTIONS = ["📁", "⭐", "🎨", "💬", "🎬", "🧠", "📚", "✈️", "💼", "🌸", "🏆", "🔥"];

  const handleAdd = (collectionId: string) => {
    addToCollection(promptId, collectionId);
    onClose();
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newCol = createCollection(newName.trim(), newIcon);
    if (!newCol) return;
    addToCollection(promptId, newCol.id);
    setNewName("");
    setCreatingNew(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="fixed inset-x-4 bottom-8 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[61] w-full sm:w-96 bg-card border border-border/20 rounded-3xl shadow-[0_24px_80px_-8px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border/10">
              <div>
                <h3 className="text-sm font-black">Save to Collection</h3>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 truncate max-w-[220px]">
                  {promptTitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Collections List */}
            <div className="px-3 py-3 space-y-1 max-h-64 overflow-y-auto">
              {collections.map((col) => {
                const isIn = getFavoritesForCollection(col.id).includes(promptId);
                return (
                  <button
                    key={col.id}
                    onClick={() => handleAdd(col.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold",
                      "transition-all duration-200 text-left",
                      isIn
                        ? "bg-primary/10 text-primary border border-primary/15"
                        : "hover:bg-secondary/60 text-foreground"
                    )}
                  >
                    <span className="text-base leading-none w-6 text-center">{col.icon}</span>
                    <span className="flex-1 truncate">{col.name}</span>
                    <span className="text-[10px] text-muted-foreground/50 flex-shrink-0">
                      {col.promptIds.length} saved
                    </span>
                    {isIn && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Create New Collection */}
            <div className="px-3 pb-4 pt-2 border-t border-border/10">
              {!creatingNew ? (
                <button
                  onClick={() => setCreatingNew(true)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create New Collection
                </button>
              ) : (
                <div className="space-y-2">
                  {/* Icon picker */}
                  <div className="flex flex-wrap gap-1.5">
                    {ICON_OPTIONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewIcon(icon)}
                        className={cn(
                          "w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all",
                          newIcon === icon
                            ? "bg-primary/15 border border-primary/30 scale-110"
                            : "hover:bg-secondary/60"
                        )}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      placeholder="Collection name…"
                      className="flex-1 px-3 py-2 rounded-xl text-sm bg-secondary/40 border border-border/20 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground/40"
                    />
                    <button
                      onClick={handleCreate}
                      disabled={!newName.trim()}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40 transition-opacity"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
