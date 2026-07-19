"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────────
export interface Collection {
  id: string;
  name: string;
  icon: string;
  promptIds: string[];
  createdAt: number;
}

export interface FavoriteItem {
  promptId: string;
  addedAt: number;
  collectionId: string; // default = "favorites"
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  collections: Collection[];
  totalCount: number;
  isFavorited: (promptId: string) => boolean;
  toggleFavorite: (promptId: string, promptTitle?: string) => void;
  removeFavorite: (promptId: string) => void;
  addToCollection: (promptId: string, collectionId: string) => void;
  createCollection: (name: string, icon?: string) => Collection;
  deleteCollection: (collectionId: string) => void;
  getFavoritesForCollection: (collectionId: string) => string[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const STORAGE_KEY_FAV = "pv:favorites:v2";
const STORAGE_KEY_COL = "pv:collections:v2";

const DEFAULT_COLLECTIONS: Collection[] = [
  { id: "favorites", name: "Favorites", icon: "⭐", promptIds: [], createdAt: 0 },
  { id: "images", name: "Image Prompts", icon: "🎨", promptIds: [], createdAt: 1 },
  { id: "chatgpt", name: "ChatGPT", icon: "💬", promptIds: [], createdAt: 2 },
  { id: "video", name: "Video", icon: "🎬", promptIds: [], createdAt: 3 },
  { id: "coding", name: "Coding", icon: "🧠", promptIds: [], createdAt: 4 },
  { id: "writing", name: "Writing", icon: "📚", promptIds: [], createdAt: 5 },
];

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>(DEFAULT_COLLECTIONS);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const rawFav = localStorage.getItem(STORAGE_KEY_FAV);
      if (rawFav) setFavorites(JSON.parse(rawFav));

      const rawCol = localStorage.getItem(STORAGE_KEY_COL);
      if (rawCol) setCollections(JSON.parse(rawCol));
    } catch (_) {
      // ignore parse errors
    }
    setMounted(true);
  }, []);

  // Persist favorites
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY_FAV, JSON.stringify(favorites));
    window.dispatchEvent(new Event("pv:favorites:change"));
  }, [favorites, mounted]);

  // Persist collections
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY_COL, JSON.stringify(collections));
  }, [collections, mounted]);

  const isFavorited = useCallback(
    (promptId: string) => favorites.some((f) => f.promptId === promptId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (promptId: string, promptTitle?: string) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.promptId === promptId);
        if (exists) {
          toast.success("Removed from favorites", {
            icon: "💔",
            duration: 1500,
          });
          return prev.filter((f) => f.promptId !== promptId);
        } else {
          toast.success("Added to favorites!", {
            description: promptTitle,
            icon: "❤️",
            duration: 2000,
          });
          return [
            ...prev,
            { promptId, addedAt: Date.now(), collectionId: "favorites" },
          ];
        }
      });

      // Also update the default "favorites" collection
      setCollections((prev) =>
        prev.map((col) => {
          if (col.id !== "favorites") return col;
          const has = col.promptIds.includes(promptId);
          return {
            ...col,
            promptIds: has
              ? col.promptIds.filter((id) => id !== promptId)
              : [...col.promptIds, promptId],
          };
        })
      );
    },
    []
  );

  const removeFavorite = useCallback((promptId: string) => {
    setFavorites((prev) => prev.filter((f) => f.promptId !== promptId));
    setCollections((prev) =>
      prev.map((col) => ({
        ...col,
        promptIds: col.promptIds.filter((id) => id !== promptId),
      }))
    );
    toast.success("Removed from favorites", { icon: "💔", duration: 1500 });
  }, []);

  const addToCollection = useCallback(
    (promptId: string, collectionId: string) => {
      // Ensure in master favorites list
      setFavorites((prev) => {
        if (prev.some((f) => f.promptId === promptId)) return prev;
        return [...prev, { promptId, addedAt: Date.now(), collectionId }];
      });

      setCollections((prev) =>
        prev.map((col) => {
          if (col.id !== collectionId) return col;
          if (col.promptIds.includes(promptId)) return col;
          return { ...col, promptIds: [...col.promptIds, promptId] };
        })
      );
      const col = collections.find((c) => c.id === collectionId);
      toast.success(`Saved to ${col?.name ?? "collection"}!`, {
        icon: col?.icon ?? "📁",
        duration: 1800,
      });
    },
    [collections]
  );

  const createCollection = useCallback(
    (name: string, icon = "📁"): Collection => {
      const newCol: Collection = {
        id: `col-${Date.now()}`,
        name,
        icon,
        promptIds: [],
        createdAt: Date.now(),
      };
      setCollections((prev) => [...prev, newCol]);
      toast.success(`Collection "${name}" created!`, {
        icon,
        duration: 1800,
      });
      return newCol;
    },
    []
  );

  const deleteCollection = useCallback((collectionId: string) => {
    if (collectionId === "favorites") return; // can't delete default
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));
  }, []);

  const getFavoritesForCollection = useCallback(
    (collectionId: string) => {
      if (collectionId === "all") return favorites.map((f) => f.promptId);
      const col = collections.find((c) => c.id === collectionId);
      return col?.promptIds ?? [];
    },
    [favorites, collections]
  );

  const totalCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        collections,
        totalCount,
        isFavorited,
        toggleFavorite,
        removeFavorite,
        addToCollection,
        createCollection,
        deleteCollection,
        getFavoritesForCollection,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be inside FavoritesProvider");
  return ctx;
}
