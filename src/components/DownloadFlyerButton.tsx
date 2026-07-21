"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DownloadFlyerButtonProps {
  variant?: "primary" | "footer";
}

export default function DownloadFlyerButton({ variant = "primary" }: DownloadFlyerButtonProps) {
  const [downloadState, setDownloadState] = useState<"idle" | "downloading" | "success">("idle");
  const isFooter = variant === "footer";

  const handleDownload = () => {
    if (downloadState !== "idle") return;
    
    setDownloadState("downloading");
    
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/symposium-flyer.pdf"; 
      link.download = "MitoCan_Symposium_2026_Flyer.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadState("success");
      
      setTimeout(() => {
        setDownloadState("idle");
      }, 3000);
    }, 1200);
  };

  return (
    <div className={isFooter ? "mt-1" : "flex justify-center mt-6"}>
      <motion.button
        onClick={handleDownload}
        whileTap={downloadState === "idle" ? { scale: 0.95 } : {}}
        className={`relative flex items-center gap-2 sm:gap-2.5 overflow-hidden transition-colors duration-300 cursor-pointer font-inter ${
          isFooter 
            ? "w-full sm:w-auto px-3 py-2 rounded-lg text-[11px] sm:text-xs font-medium border " + 
              (downloadState === "success" 
                ? "bg-green-500/10 text-green-400 border-green-500/30" 
                : "bg-white/5 text-[#A0A0A0] border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20")
            : "w-full justify-center px-6 py-3.5 rounded-xl text-sm font-bold border-2 shadow-sm " +
              (downloadState === "success"
                ? "bg-green-500 text-white border-green-500"
                : "bg-surface-bright text-primary border-primary/20 hover:border-primary/60 hover:bg-primary/5")
        }`}
        style={!isFooter ? { minWidth: "220px" } : {}}
      >
        <AnimatePresence mode="popLayout">
          {downloadState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex items-center gap-2"
            >
              <svg className={isFooter ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {isFooter ? "Download Flyer" : "Download Symposium Flyer"}
            </motion.div>
          )}

          {downloadState === "downloading" && (
            <motion.div
              key="downloading"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`flex items-center gap-2 ${isFooter ? "text-[#A0A0A0]" : "text-primary"}`}
            >
              <svg className={`animate-spin ${isFooter ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-5 h-5"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isFooter ? "Preparing..." : "Preparing File..."}
            </motion.div>
          )}

          {downloadState === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <svg className={isFooter ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              {isFooter ? "Downloaded!" : "Download Complete!"}
            </motion.div>
          )}
        </AnimatePresence>

        {downloadState === "downloading" && (
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`absolute bottom-0 left-0 h-1 ${isFooter ? "bg-white/40" : "bg-secondary"}`}
          />
        )}
      </motion.button>
    </div>
  );
}