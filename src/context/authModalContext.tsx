'use client';

import { createContext, useContext, useState } from "react";

type Mode = "login" | "register";

interface AuthModalContextType {
  isOpen: boolean;
  mode: Mode;
  openModal: (mode: Mode) => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");

  const openModal = (mode: Mode) => {
    setMode(mode);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, openModal, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("AuthModal not found");
  return ctx;
};