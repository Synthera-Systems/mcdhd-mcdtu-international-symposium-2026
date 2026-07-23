"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";

const springInteraction = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 320, damping: 22 }
};

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Speakers", href: "/speakers" },
    { name: "Committee", href: "/committee" },
    { name: "Sponsor", href: "/sponsor" },
    { name: "Submissions", href: "/submissions" },
    { name: "Venue", href: "/venue" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-bright/90 backdrop-blur-md border-b border-surface-dim/30">
      <div className="max-w-full mx-auto flex items-center justify-between px-4 py-3 md:px-12 lg:px-24">
        
        <div className="flex gap-2 sm:gap-3 items-center justify-center">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative w-7 h-7 sm:w-10 sm:h-10 md:w-15 md:h-15 rounded-full overflow-hidden shrink-0 bg-surface-bright shadow-inner">
            <Image 
              src='/logos/TU.png'
              alt='Tezu' 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            /> 
          </div>
          {/* <div className="relative w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 bg-surface-bright shadow-inner">
            <Image 
              src='/logos/JNUN.png'
              alt='JNUN' 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            /> 
          </div> */}
          {/* Brand */}
          <motion.div {...springInteraction}>
              <span className="font-playfair font-bold text-[13px] sm:text-lg md:text-2xl tracking-tight text-primary leading-none block max-w-60 sm:max-w-none whitespace-normal sm:whitespace-nowrap">
                MitoCan-Symposium <br className="block sm:hidden" /> 2026
              </span>
          </motion.div>
          </Link>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <motion.div key={link.name} {...springInteraction}>
                <Link 
                  href={link.href}
                  className={`font-inter text-sm transition-all px-4 lg:px-5 py-2 lg:py-2.5 rounded-full border ${
                    isActive 
                      ? "bg-secondary/10 text-secondary font-bold border-secondary/20 shadow-sm" 
                      : "border-transparent text-on-surface-variant hover:text-primary hover:bg-surface-dim/20"
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2 sm:gap-4">
          <motion.div {...springInteraction}>
            <Link 
              href="/registration" 
              className="hidden md:inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-white font-inter text-sm font-medium transition-colors hover:bg-primary-container"
            >
              Register Now
            </Link>
          </motion.div>
          
          {/* MOBILE NAVIGATION WRAPPER */}
        <div className="md:hidden relative">
          
          {/* Mobile Toggle Button */}
          <motion.button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1.5 sm:p-2 rounded-xl transition-colors ${
              isMenuOpen ? "bg-secondary/10 text-secondary" : "text-primary hover:bg-surface-dim/20"
            }`}
            {...springInteraction}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                /* X Icon when open */
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                /* Hamburger Icon when closed */
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>

          {/* Mobile Dropdown Modal */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] sm:w-56 max-w-[280px] bg-white border border-surface-dim/30 rounded-2xl shadow-[0_8px_30px_rgba(0,33,71,0.12)] p-2 sm:p-3 flex flex-col gap-1 z-50 origin-top-right"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)} 
                      className={`font-inter text-xs sm:text-sm transition-all px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl flex items-center ${
                        isActive 
                          ? "bg-secondary/10 text-secondary font-bold" 
                          : "text-on-surface-variant font-medium hover:text-primary hover:bg-surface-dim/10"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <div className="w-full h-px bg-surface-dim/30 my-1" />
                <Link 
                  href="/registration"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-1 flex items-center justify-center px-4 py-3 rounded-xl bg-primary text-white font-inter text-xs sm:text-sm font-medium transition-colors hover:bg-primary-container"
                >
                  Register Now
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
        </div>
      </div>
    </header>
  );
}