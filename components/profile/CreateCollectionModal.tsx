"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { useFavorites } from "@/components/favorites/FavoritesContext";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCollectionModal({ isOpen, onClose }: CreateCollectionModalProps) {
  const { createCollection } = useFavorites();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📁");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    const created = createCollection(name.trim(), icon);
    if (created) {
      toast.success(`Collection "${name.trim()}" created! 🎉`);
      setName("");
      setIcon("📁");
      onClose();
    } else {
      toast.error("Failed to create collection");
    }
  };

  const ICONS = ["📁", "🎨", "💬", "🎬", "🧠", "📚", "🚀", "⚡", "🔥"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#090a0f] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-brand" /> Create New Collection
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/90 mb-1.5">Collection Icon</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {ICONS.map((ic) => (
                  <button
                    type="button"
                    key={ic}
                    onClick={() => setIcon(ic)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all shrink-0 ${
                      icon === ic
                        ? "bg-brand text-brand-foreground ring-2 ring-brand/50 scale-105"
                        : "bg-white/5 hover:bg-white/10 text-white"
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/90 mb-1.5">Collection Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cyberpunk Characters"
                className="w-full bg-[#121319] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                autoFocus
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand/20 active:scale-95"
              >
                <Check className="w-4 h-4" /> Create Collection
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
