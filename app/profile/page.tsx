"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getUserProfile, getPromptsByIdsAction } from "@/app/actions/user";
import { PromptGrid } from "@/components/prompts/PromptGrid";
import type { Prompt } from "@/types";
import { 
  Sparkles, 
  Settings, 
  Heart, 
  FolderHeart, 
  ChevronRight, 
  Crown,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Laptop
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/components/favorites/FavoritesContext";
import { ActiveDevicesList } from "@/components/profile/ActiveDevicesList";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { CreateCollectionModal } from "@/components/profile/CreateCollectionModal";
import { DeleteAccountModal } from "@/components/profile/DeleteAccountModal";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { favorites, collections } = useFavorites();
  const [activeTab, setActiveTab] = useState<"favorites" | "collections" | "devices" | "settings">("favorites");
  const [dbUser, setDbUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const fetchUserProfile = async () => {
    if (status === "authenticated") {
      try {
        const data = await getUserProfile();
        if (data) {
          setDbUser(data);
        } else if (session?.user) {
          setDbUser({
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            membership: "FREE",
          });
        }
      } catch (err) {
        if (session?.user) {
          setDbUser({
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            membership: "FREE",
          });
        }
      } finally {
        setLoadingProfile(false);
      }
    } else if (status === "unauthenticated") {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [status, session]);

  useEffect(() => {
    const ids = favorites.map((f) => f.promptId);
    if (ids.length > 0) {
      setLoadingPrompts(true);
      getPromptsByIdsAction(ids).then((prompts) => {
        setFavoritePrompts(prompts);
        setLoadingPrompts(false);
      });
    } else {
      setFavoritePrompts([]);
    }
  }, [favorites]);

  if (status === "loading" || loadingProfile) {
    return (
      <div className="min-h-screen bg-[#040508] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
  }

  const user = session?.user;
  const isPro = dbUser?.membership === "PRO";

  return (
    <div className="min-h-screen bg-[#040508] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={dbUser?.image || user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser?.name || user?.name || "User")}&background=random`} 
                alt="Profile" 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] object-cover ring-2 ring-white/10 shadow-2xl"
              />
              {isPro && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#FFB800] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,184,0,0.4)]">
                  <Crown size={20} className="text-black" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{dbUser?.name || user?.name}</h1>
                {isPro ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider text-black bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-200">
                    <Crown className="w-3.5 h-3.5 fill-black" />
                    <span>Pro Access</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-white/5 border border-white/10 rounded-full">
                    <span>Free Plan</span>
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {dbUser?.username && (
                  <span className="text-xs font-bold text-cyan-400">@{dbUser.username}</span>
                )}
                <span className="text-sm text-muted-foreground">{dbUser?.email || user?.email}</span>
              </div>

              {dbUser?.bio && (
                <p className="text-xs text-white/80 max-w-md line-clamp-2 mt-0.5 font-medium">{dbUser.bio}</p>
              )}
              
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                  <CheckCircle2 size={12} /> Verified
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-white/50 bg-white/5 px-2 py-1 rounded-md">
                  <Calendar size={12} /> Joined 2026
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#090A0F] hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Settings size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Stats Cards */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-5">
            <div className="bg-[#090A0F] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between group hover:border-brand/30 transition-all hover:bg-[#0c0d14]">
              <Heart className="w-6 h-6 text-rose-500 mb-6 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-3xl font-black mb-1">{favorites.length}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Saved Prompts</p>
              </div>
            </div>
            <div className="bg-[#090A0F] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between group hover:border-brand/30 transition-all hover:bg-[#0c0d14]">
              <FolderHeart className="w-6 h-6 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-3xl font-black mb-1">{collections.length}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Collections</p>
              </div>
            </div>
            <div className="bg-[#090A0F] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between group hover:border-brand/30 transition-all hover:bg-[#0c0d14]">
              <ImageIcon className="w-6 h-6 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-3xl font-black mb-1">0</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Generations</p>
              </div>
            </div>
          </div>

          {/* Upgrade Card (Only for Free users) */}
          {!isPro && (
            <div className="col-span-1 relative overflow-hidden bg-gradient-to-br from-[#FFB800]/10 via-[#FFB800]/5 to-transparent border border-[#FFB800]/20 rounded-[2rem] p-8 flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800]/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-[#FFB800]">
                  <Sparkles size={18} />
                  <span className="text-[11px] font-black uppercase tracking-widest">PromptVerse Pro</span>
                </div>
                <h3 className="text-2xl font-bold leading-tight mb-2 text-white">Unlock Premium<br/>Studio Access</h3>
                <p className="text-sm text-white/60 mb-6 leading-relaxed">Get exclusive access to the best AI models, premium studio parameters, and unlimited saves.</p>
              </div>
              
              <Link 
                href="/pricing" 
                className="relative z-10 inline-flex items-center justify-between w-full px-5 py-3.5 bg-[#FFB800] hover:bg-[#e6a600] text-black font-bold text-sm rounded-xl transition-all group-hover:shadow-[0_0_30px_rgba(255,184,0,0.3)]"
              >
                Upgrade to Pro
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <div className="bg-[#090A0F] border border-white/5 rounded-[2rem] min-h-[500px] overflow-hidden">
          <div className="flex items-center gap-8 border-b border-white/5 px-8 pt-6">
            {(["favorites", "collections", "devices", "settings"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative pb-5 text-[13px] font-bold uppercase tracking-wider transition-colors",
                  activeTab === tab ? "text-white" : "text-muted-foreground hover:text-white/80"
                )}
              >
                {tab === "devices" ? "Active Devices" : tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="profile-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFB800] rounded-t-full shadow-[0_0_15px_rgba(255,184,0,0.5)]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "devices" && <ActiveDevicesList />}
            {activeTab === "favorites" && (
              loadingPrompts ? (
                <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-brand border-t-transparent animate-spin" />
                  <span className="text-sm">Loading saved prompts...</span>
                </div>
              ) : favoritePrompts.length > 0 ? (
                <div className="pt-2">
                  <PromptGrid prompts={favoritePrompts} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-[300px] opacity-60">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                    <Heart size={32} className="text-white/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-6">
                    You haven't saved any prompts yet. Explore the studio to find inspiration for your next masterpiece.
                  </p>
                  <Link href="/" className="px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-xl text-sm font-bold transition-colors">
                    Explore Prompts
                  </Link>
                </div>
              )
            )}

            {activeTab === "collections" && (
              collections.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Your Collections ({collections.length})</h3>
                    <button
                      onClick={() => setIsCreateCollectionOpen(true)}
                      className="px-4 py-2 rounded-xl bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      + New Collection
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collections.map((col) => (
                      <div
                        key={col.id}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="text-2xl p-2.5 rounded-xl bg-white/5">{col.icon || "📁"}</span>
                          <div>
                            <p className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">{col.name}</p>
                            <p className="text-xs text-muted-foreground">{col.promptIds?.length || 0} prompts</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-[300px] opacity-60">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                    <FolderHeart size={32} className="text-white/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Empty Collections</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-6">
                    Create collections to organize your favorite prompts by theme, project, or AI model.
                  </p>
                  <button
                    onClick={() => setIsCreateCollectionOpen(true)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
                  >
                    Create Collection
                  </button>
                </div>
              )
            )}

            {activeTab === "settings" && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl gap-4">
                    <div>
                      <p className="font-bold text-sm text-white mb-1">Email Address</p>
                      <p className="text-sm text-muted-foreground">{dbUser?.email || user?.email}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                      <CheckCircle2 size={14} /> Verified
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl gap-4">
                    <div>
                      <p className="font-bold text-sm text-white mb-1">Connected Accounts</p>
                      <p className="text-sm text-muted-foreground">Google OAuth</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                    <h4 className="text-red-400 font-bold mb-2">Danger Zone</h4>
                    <p className="text-sm text-white/50 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <button
                      onClick={() => setIsDeleteAccountOpen(true)}
                      className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={dbUser || user || {}}
        onSaveSuccess={fetchUserProfile}
      />

      <CreateCollectionModal
        isOpen={isCreateCollectionOpen}
        onClose={() => setIsCreateCollectionOpen(false)}
      />

      <DeleteAccountModal
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
      />
    </div>
  );
}
