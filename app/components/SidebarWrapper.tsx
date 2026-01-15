"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Sidebar from "./Sidebar";

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) {
      setIsOpen(savedState === "true");
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", isOpen.toString());
  }, [isOpen]);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main
          className={`flex-1 transition-all duration-300 ${
            isOpen ? "ml-64" : "ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
