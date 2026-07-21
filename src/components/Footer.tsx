"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import DownloadFlyerButton from "./DownloadFlyerButton"
const springInteraction = {
  whileTap: { scale: 0.95 },
  transition: { type: "spring" as const, stiffness: 400, damping: 25 }
};

export default function Footer() {
  const [symposiumDates, setSymposiumDates] = useState("");
  const [showToast, setShowToast] = useState(false);
  const supportEmail = "mitocansypm2026@gmail.com";
  const mapLink = "https://maps.app.goo.gl/oPrpjk8Gwcw1LveE6";

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.symposiumDates) {
          setSymposiumDates(data.symposiumDates);
        }
      })
      .catch((err) => console.error("Error loading layout settings:", err));
  }, []);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareData = {
      title: 'MitoCan-Symposium 2026',
      text: 'Join the International Symposium on Mitochondria, Cell Death, and Human Disease at Tezpur University.',
      url: window.location.origin,
    };

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Native system share canceled:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error("Clipboard execution fault:", err);
      }
    }
  };

  return (
    // FIXED: Lowered z-index to z-10 and tightened mobile top/bottom paddings
    <footer className="w-full bg-[#0a0a0a] text-surface-dim pt-10 sm:pt-20 pb-6 sm:pb-10 px-4 sm:px-6 md:px-12 lg:px-24 border-t border-white/10 relative z-10">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 mb-8 sm:mb-12">
          
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-5 space-y-4 sm:space-y-6 pr-0 md:pr-8 text-left flex flex-col items-start">
            <div className="flex gap-3 justify-start">
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 bg-white shadow-inner">
                <Image 
                  src='/logos/TU.png'
                  alt='Tezpur University' 
                  fill 
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                /> 
              </div>
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 bg-white shadow-inner">
                <Image 
                  src='/logos/JNUN.png'
                  alt='JNU New Delhi' 
                  fill 
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                /> 
              </div>
            </div>
            
            <div className="space-y-1 sm:space-y-2 text-left">
              <h3 className="font-playfair font-bold text-xl sm:text-3xl text-white tracking-tight">MitoCan-Symposium 2026</h3>
              <p className="font-inter text-[11px] sm:text-sm leading-relaxed text-[#A0A0A0] max-w-sm">
                Empowering scientific discovery through international collaboration and mitochondrial excellence.
              </p>
            </div>
            
            <div className="flex gap-3 sm:gap-4 pt-1 sm:pt-2">
               <motion.button 
                  onClick={handleShare}
                  {...springInteraction} 
                  className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-secondary border border-white/10 hover:border-secondary text-white transition-all duration-300 cursor-pointer" 
                  aria-label="Share Symposium"
                  title="Share Link"
               >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
               </motion.button>
               
               <motion.a 
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}&su=Inquiry:%20MitoCan-Symposium%202026`}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...springInteraction} 
                  className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-secondary border border-white/10 hover:border-secondary text-white transition-all duration-300" 
                  aria-label="Email Secretariat via Gmail"
                  title="Open in Gmail"
               >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </motion.a>
            </div>
          </div>

          {/* FIXED: Column 2 uses a 2-column grid on mobile to save vertical space! */}
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-1 gap-6 text-left pt-2 md:pt-0">
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-inter text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3 font-inter text-[11px] sm:text-sm">
                <li><Link href="/privacy" className="text-[#A0A0A0] hover:text-white hover:underline transition-colors block">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-[#A0A0A0] hover:text-white hover:underline transition-colors block">Terms of Service</Link></li>
                <li><DownloadFlyerButton variant="footer" /></li>
              </ul>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-inter text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white">Help & Support</h4>
              <a 
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-start gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-secondary hover:text-secondary-container transition-colors font-medium group"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                <span className="truncate">{supportEmail}</span>
              </a>
            </div>
          </div>

          {/* Column 3: Location & Map */}
          <div className="md:col-span-4 space-y-3 sm:space-y-5 text-left flex flex-col items-start w-full pt-2 md:pt-0">
            <h4 className="font-inter text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white flex items-center justify-start gap-2">
              Venue Location
            </h4>
            
            <div className="font-inter text-[11px] sm:text-sm leading-relaxed text-white flex flex-col items-start gap-1.5 sm:gap-2 w-full">
              <p className="flex items-start justify-start gap-2 w-full">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-left">Council Hall, Tezpur University<br />Tezpur, Assam 784028, India</span>
              </p>
              <p className="flex items-center justify-start gap-2 pt-0.5 sm:pt-1 w-full">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-white font-medium">{symposiumDates || "Loading Dates..."}</span>
              </p>
            </div>

            {/* FIXED: Reduced map height on mobile (h-24) to save space */}
            <a 
              href={mapLink}
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full h-24 sm:h-36 rounded-xl overflow-hidden mt-2 sm:mt-4 border border-white/10 opacity-80 hover:opacity-100 transition-all duration-300 relative group bg-[#1a1a1a]"
            >
              <Image 
                src="/map_preview.png"
                alt="Map to Tezpur University"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-start justify-start p-2 sm:p-4">
                <div className="bg-black/80 border border-white/10 text-white px-2.5 sm:px-3 py-1.5 rounded-full text-[9px] sm:text-xs font-medium backdrop-blur-sm flex items-center gap-1.5 transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 transition-all duration-300">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Open in Maps
                </div>
              </div>
            </a>
          </div>

        </div>

        <div className="w-full h-px bg-white/10 mb-5 sm:mb-8" />

        {/* FIXED: Reordered layout on mobile so badge is on top of copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 font-inter text-[9px] sm:text-xs text-[#606060] text-center md:text-left">
          
          <div className="order-1 md:order-2 flex items-center gap-2 sm:gap-3 bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/5 hover:border-white/10 transition-colors shrink-0">
            <span>Platform developed by</span>
            <div className="flex items-center gap-1.5 sm:gap-2 text-white font-medium">
              <Image src="/synthera_system.svg" alt="Synthera Systems Logo" width={16} height={16} className="sm:w-6 sm:h-6 opacity-80" />
              <span>Synthera Systems</span>
            </div>
          </div>
          
          <p className="order-2 md:order-1 px-2 w-full md:w-auto">
            © 2026 International Symposium on Mitochondria, Cell Death, and Human Disease. All rights reserved.
          </p>

        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-12 sm:bottom-18 left-1/2 bg-secondary text-white font-inter text-[10px] sm:text-sm font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-xl border border-white/10 flex items-center gap-2 z-[99999] whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            Symposium link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}