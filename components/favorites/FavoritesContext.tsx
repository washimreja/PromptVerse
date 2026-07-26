"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useAuthModal } from "../auth/AuthModalContext";
import {
  getUserCollectionsAction,
  createCollectionAction,
  getUserFavoritesAction,
  toggleFavoriteAction,
} from "@/app/actions/user";

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
  createCollection: (name: string, icon?: string) => Promise<Collection | null>;
  deleteCollection: (collectionId: string) => void;
  getFavoritesForCollection: (collectionId: string) => string[];
  refreshCollections: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const STORAGE_KEY_FAV = "pv:favorites:v2";
const STORAGE_KEY_COL = "pv:collections:v2";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [mounted, setMounted] = useState(false);
  const { status } = useSession();
  const { openModal } = useAuthModal();

  // Load real DB data when authenticated, or localStorage when guest
  const refreshCollections = useCallback(async () => {
    if (status === "authenticated") {
      const dbCols = await getUserCollectionsAction();
      setCollections(dbCols);
    }
  }, [status]);

  const refreshFavorites = useCallback(async () => {
    if (status === "authenticated") {
      const dbFavs = await getUserFavoritesAction();
      setFavorites(dbFavs);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      refreshCollections();
      refreshFavorites();
    } else {
      try {
        const rawFav = localStorage.getItem(STORAGE_KEY_FAV);
        if (rawFav) setFavorites(JSON.parse(rawFav));

        const rawCol = localStorage.getItem(STORAGE_KEY_COL);
        if (rawCol) setCollections(JSON.parse(rawCol));
      } catch (_) {}
    }
    setMounted(true);
  }, [status, refreshCollections, refreshFavorites]);

  // Persist to localStorage for offline / guest state
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY_FAV, JSON.stringify(favorites));
    } catch (_) {}
  }, [favorites, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY_COL, JSON.stringify(collections));
    } catch (_) {}
  }, [collections, mounted]);

  const isFavorited = useCallback(
    (promptId: string) => favorites.some((f) => f.promptId === promptId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (promptId: string, promptTitle?: string) => {
      if (status !== "authenticated") {
        openModal("Sign in to save this prompt to your favorites");
        return;
      }

      // DB sync
      toggleFavoriteAction(promptId);

      setFavorites((prev) => {
        const exists = prev.some((f) => f.promptId === promptId);
        if (exists) {
          toast.success("Removed from favorites", {
            icon: "💔",
            duration: 1500,
          });
          return prev.filter((f) => f.promptId !== promptId);
        } else {
          toast.custom(
            (t) => (
              <div
                onClick={() => {
                  toast.dismiss(t);
                  router.push("/profile");
                }}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#090a0f]/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-xl cursor-pointer hover:bg-emerald-950/60 active:scale-95 transition-all w-full max-w-sm group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">❤️</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-400">Added to favorites!</span>
                    <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                      {promptTitle || "Tap to view saved prompts"}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-black transition-colors shrink-0">
                  View
                </span>
              </div>
            ),
            { duration: 3500 }
          );
          return [
            ...prev,
            { promptId, addedAt: Date.now(), collectionId: "favorites" },
          ];
        }
      });
    },
    [status, openModal, router]
  );

  const removeFavorite = useCallback((promptId: string) => {
    toggleFavoriteAction(promptId);
    setFavorites((prev) => prev.filter((f) => f.promptId !== promptId));
    toast.success("Removed from favorites", { icon: "💔", duration: 1500 });
  }, []);

  const addToCollection = useCallback(
    (promptId: string, collectionId: string) => {
      if (status === "unauthenticated") {
        openModal("Sign in to save this prompt to your collection");
        return;
      }

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
    [collections, status, openModal]
  );

  const createCollection = useCallback(
    async (name: string, icon = "📁"): Promise<Collection | null> => {
      if (status === "unauthenticated") {
        openModal("Sign in to create a new collection");
        return null;
      }

      const res = await createCollectionAction(name, icon);
      if (res.success && res.collection) {
        const newCol: Collection = res.collection;
        setCollections((prev) => [newCol, ...prev]);
        toast.success(`Collection "${name}" created! 🎉`, {
          icon,
          duration: 2000,
        });
        return newCol;
      } else {
        toast.error(res.error || "Failed to create collection");
        return null;
      }
    },
    [status, openModal]
  );

  const deleteCollection = useCallback((collectionId: string) => {
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
        refreshCollections,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
