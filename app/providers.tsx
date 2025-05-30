"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";

// Custom provider for DnD that supports both touch and mouse
function CustomDndProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    
    // Check initially
    checkIsMobile();
    
    // Add event listener
    window.addEventListener("resize", checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      {children}
    </DndProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomDndProvider>{children}</CustomDndProvider>
      <Toaster />
    </>
  );
}