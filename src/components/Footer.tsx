"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const springInteraction = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 320, damping: 22 }
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] text-surface-dim pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 md:px-12 lg:px-24 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 mb-12 sm:mb-16">
          
          {/* Brand & Mission (Takes up more space) */}
          <div className="sm:col-span-2 md:col-span-5 space-y-4 sm:space-y-6 pr-0 md:pr-12 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="flex gap-3 justify-center md:justify-start">
              <div className="relative w-12 h-12 sm:w-10 sm:h-10 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 bg-surface-bright shadow-inner">
                <Image 
                  src='/logos/TU.png'
                  alt='Tezu' 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                /> 
              </div>
              <div className="relative w-12 h-12 sm:w-10 sm:h-10 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 bg-surface-bright shadow-inner">
                <Image 
                  src='/logos/JNUN.png'
                  alt='JNUN' 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                /> 
              </div>
            </div>
            <h3 className="font-playfair font-bold text-2xl sm:text-3xl text-white tracking-tight">MitoCan-Symposium 2026</h3>
            <p className="font-inter text-xs sm:text-sm leading-relaxed text-[#A0A0A0] max-w-sm">
              Empowering scientific discovery through international collaboration and mitochondrial excellence.
            </p>
            <div className="flex gap-4 pt-2 sm:pt-4">
               <motion.a href="#" {...springInteraction} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="Share">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
               </motion.a>
               <motion.a href="#" {...springInteraction} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="Email">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-4 sm:space-y-6 text-center sm:text-left">
            <h4 className="font-inter text-[11px] sm:text-xs font-bold tracking-widest uppercase text-white">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 font-inter text-xs sm:text-sm">
              <li><Link href="/privacy" className="text-[#A0A0A0] hover:text-secondary-container transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#A0A0A0] hover:text-secondary-container transition-colors">Terms of Service</Link></li>
              <li><Link href="/partners" className="text-[#A0A0A0] hover:text-secondary-container transition-colors">University Partners</Link></li>
              <li><Link href="/contact" className="text-[#A0A0A0] hover:text-secondary-container transition-colors">Contact Secretariat</Link></li>
            </ul>
          </div>

          {/* Location */}
          <div className="md:col-span-3 space-y-4 sm:space-y-6 text-center sm:text-left">
            <h4 className="font-inter text-[11px] sm:text-xs font-bold tracking-widest uppercase text-white">Location</h4>
            <div className="font-inter text-xs sm:text-sm leading-relaxed text-[#A0A0A0] space-y-2 flex flex-col items-center sm:items-start">
              <p className="flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-container shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-left">Council Hall, Tezpur University<br />Tezpur, Assam, India</span>
              </p>
              <p className="flex items-center gap-2 pt-1 sm:pt-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-container shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                October 26 - 27, 2026
              </p>
            </div>
          </div>

          {/* Institutional Partners */}
          <div className="md:col-span-2 space-y-4 sm:space-y-6 text-center sm:text-left">
             <h4 className="font-inter text-[11px] sm:text-xs font-bold tracking-widest uppercase text-white">In Association With</h4>
             <ul className="space-y-2 sm:space-y-3 font-inter text-xs sm:text-sm text-[#A0A0A0]">
                <li>Tezpur University</li>
                <li>Rutgers Health</li>
                <li>Roswell Park Cancer Center</li>
             </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-6 sm:mb-8" />

        {/* Bottom Bar: Copyright & Developer Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 font-inter text-[10px] sm:text-xs text-[#606060] text-center md:text-left">
          <p className="px-2">© 2026 International Symposium on Mitochondria, Cell Death, and Human Disease. All rights reserved.</p>
          
          {/* Synthera Systems Badge */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/5 hover:border-white/10 transition-colors shrink-0">
            <span>Platform developed by</span>
            <div className="flex items-center gap-1.5 sm:gap-2 text-white font-medium">
                  <Image src="/synthera_system.svg" alt="Synthera Systems Logo" width={16} height={16} className="sm:w-5 sm:h-5" />
               <span>Synthera Systems</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}