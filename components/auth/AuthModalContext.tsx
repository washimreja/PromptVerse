"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { PremiumAuthModal } from "./PremiumAuthModal";

interface AuthModalContextType {
  isOpen: boolean;
  openModal: (reason?: string) => void;
  closeModal: () => void;
  reason: string;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");

  const openModal = (modalReason: string = "Sign in to continue") => {
    setReason(modalReason);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, openModal, closeModal, reason }}>
      {children}
      <PremiumAuthModal />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
