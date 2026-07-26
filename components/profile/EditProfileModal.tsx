"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Trash2, Loader2, Check, User, Mail, AtSign, FileText, Camera } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfileAction } from "@/app/actions/user";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name?: string | null;
    username?: string | null;
    email?: string | null;
    image?: string | null;
    bio?: string | null;
  };
  onSaveSuccess: () => void;
}

// Compress image on client side using canvas
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to WebP / JPEG base64 with quality compression
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
        resolve(compressedBase64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSaveSuccess,
}: EditProfileModalProps) {
  const { update: updateSession } = useSession();
  const [name, setName] = useState(currentUser.name || "");
  const [username, setUsername] = useState(currentUser.username || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [imagePreview, setImagePreview] = useState<string | null>(currentUser.image || null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setImagePreview(compressed);
      toast.success("Image preview updated!");
    } catch (err) {
      toast.error("Failed to process image");
    }
  };

  const handleRemovePhoto = () => {
    setImagePreview(null);
    toast.info("Photo removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full name is required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await updateUserProfileAction({
        name,
        username,
        email,
        bio,
        image: imagePreview || "",
      });

      if (!res.success) {
        toast.error(res.error || "Failed to update profile");
        setIsLoading(false);
        return;
      }

      toast.success("Profile updated successfully! 🎉");
      await updateSession();
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#090a0f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-brand" /> Edit Profile
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Customize your public presence on PromptVerse</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center sm:flex-row gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="relative group shrink-0">
                <img
                  src={
                    imagePreview ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=random`
                  }
                  alt="Preview"
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/10 shadow-md"
                />
                <label htmlFor="photo-upload" className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <p className="text-xs font-bold text-white">Profile Photo</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <label
                    htmlFor="photo-upload"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Photo
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-white/90 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-[#121319] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-white/90 mb-1.5 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-cyan-400" /> Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full bg-[#121319] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-white/90 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-[#121319] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-white/90 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" /> Bio (Optional)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="AI enthusiast, creative prompt engineer..."
                rows={3}
                className="w-full bg-[#121319] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-400 transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-brand/20 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
