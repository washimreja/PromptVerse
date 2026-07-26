"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      toast.loading("Deleting account and purging data...");
      
      // Simulate API call for deletion
      await new Promise((r) => setTimeout(r, 1200));

      toast.dismiss();
      toast.success("Account deleted permanently");
      signOut({ callbackUrl: "/" });
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#090a0f] border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 text-red-400 mb-4">
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Delete Account?</h3>
              <p className="text-xs text-red-400/80 font-medium">This action is permanent and cannot be undone.</p>
            </div>
          </div>

          <div className="space-y-3 mb-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-xs text-white/80 leading-relaxed">
            <p className="font-bold text-white mb-1">Deleting your account will remove:</p>
            <ul className="space-y-1.5 list-disc list-inside text-white/70">
              <td>Profile details & avatar</td>
              <td>All saved favorites & prompt history</td>
              <td>Custom collections & organize data</td>
              <td>Device sessions & security data</td>
              <td>Active subscription & PRO membership</td>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Delete Forever
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
