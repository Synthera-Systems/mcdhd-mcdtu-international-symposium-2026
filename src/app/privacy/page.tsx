"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicy() {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const emailId = "mitocansypm2026@gmail.com"; // Update with actual email
  const siteURL = "https://mitocan2026.org"; // Update with actual domain

  const tocItems = [
    { id: "intro", label: "Introduction" },
    { id: "infocollect", label: "1. Information We Collect" },
    { id: "infouse", label: "2. How We Process Information" },
    { id: "whoshare", label: "3. Sharing Your Information" },
    { id: "abstracts", label: "4. Abstract & Research Data" },
    { id: "inforetain", label: "5. Data Retention" },
    { id: "infosafe", label: "6. Security Measures" },
    { id: "privacyrights", label: "7. Your Privacy Rights" },
    { id: "contact", label: "8. Contact Us" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 180; 

      const current = sections.reduce((acc, section) => {
        if (section && section.offsetTop <= scrollPosition) {
          return section.id;
        }
        return acc;
      }, "");

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);

    if (element) {
      setIsTocOpen(false);
      setTimeout(() => {
        const y = element.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative w-full min-h-screen bg-surface overflow-x-clip font-inter text-on-surface-variant">
      <div className="relative z-10 flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 pb-20 pt-10 sm:pt-16">
        
        {/* Page Header */}
        <header className="mb-10 lg:mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest mb-6 hover:text-secondary-container transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex ml-4 items-center justify-center px-4 py-1.5 mb-4 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20">
            Last Updated - July 2026
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-primary tracking-tight">
            Privacy Policy
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
            Your privacy and the security of your scientific research are critically important to us. This document outlines how the MitoCan-Symposium collects, uses, and protects your information.
          </motion.p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full relative">
          
          {/* Mobile Table of Contents */}
          <div className="block lg:hidden w-full sticky top-20 z-40 self-start">
            <div className="rounded-2xl shadow-[0_8px_30px_rgba(0,33,71,0.06)] overflow-hidden border border-surface-dim/30 bg-white/95 backdrop-blur-xl">
              <button onClick={() => setIsTocOpen(!isTocOpen)} className="flex items-center justify-between w-full p-5 text-left focus:outline-none">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Table of Contents</span>
                </div>
                <motion.div animate={{ rotate: isTocOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isTocOpen && (
                  <motion.div initial="collapsed" animate="open" exit="collapsed" variants={{ open: { opacity: 1, height: "auto" }, collapsed: { opacity: 0, height: 0 } }} className="overflow-hidden">
                    <div className="px-4 pb-4 border-t border-surface-dim/20 bg-surface-bright/50">
                      <nav className="flex flex-col space-y-1 mt-2 max-h-[50vh] overflow-y-auto">
                        {tocItems.map((item) => (
                          <a key={item.id} href={`#${item.id}`} onClick={(e) => handleNav(e, item.id)} className={`px-3 py-2.5 text-xs font-medium rounded-lg transition-colors ${activeSection === item.id ? "text-secondary font-bold bg-secondary/10" : "text-on-surface-variant hover:text-primary hover:bg-surface-dim/10"}`}>
                            {item.label}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Sticky Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24 self-start h-fit z-30">
            <div className="bg-white rounded-2xl p-6 border border-surface-dim/30 shadow-[0_8px_30px_rgba(0,33,71,0.03)]">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-primary">Contents</h4>
              <nav className="flex flex-col border-l-2 border-surface-dim/30">
                {tocItems.map((item) => (
                  <a key={item.id} href={`#${item.id}`} onClick={(e) => handleNav(e, item.id)} className={`pl-4 py-2.5 text-xs transition-all border-l-2 -ml-[2px] ${activeSection === item.id ? "border-secondary font-bold text-secondary bg-secondary/5 rounded-r-lg" : "border-transparent font-medium text-on-surface-variant hover:border-surface-dim hover:text-primary"}`}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <motion.main initial="hidden" animate="visible" variants={fadeUp} className="flex-1 w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 border border-surface-dim/30 shadow-[0_8px_30px_rgba(0,33,71,0.03)]">
            <div className="space-y-10 sm:space-y-14">
              
              <section id="intro" className="scroll-mt-32">
                <div className="space-y-4 leading-relaxed text-sm sm:text-base">
                  <p>
                    This Privacy Notice for the <strong>International Symposium on Mitochondria, Cell Death, and Human Disease</strong> ("we," "us," or "our"), describes how we collect, store, and share your personal and scientific information when you register for the event, submit manuscripts, or interact with our portal.
                  </p>
                  <p className="p-5 rounded-xl border bg-secondary/5 border-secondary/20 mt-4">
                    <strong className="text-primary block mb-1">Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights. If you do not agree with our policies, please do not use our Services. Contact the organizing committee at <a href={`mailto:${emailId}`} className="text-secondary font-bold hover:underline">{emailId}</a>.
                  </p>
                </div>
              </section>

              <section id="infocollect" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">1. Information We Collect</h2>
                <div className="space-y-4 leading-relaxed text-sm sm:text-base">
                  <p>We collect personal information that you voluntarily provide to us when you register as a delegate or submit an abstract. This includes:</p>
                  <ul className="list-disc pl-6 space-y-2 marker:text-secondary">
                    <li><strong>Identity Data:</strong> Full name, academic level, and university/institutional affiliation.</li>
                    <li><strong>Contact Data:</strong> Email addresses and phone numbers.</li>
                    <li><strong>Financial Data:</strong> UTR reference numbers and payment receipts/screenshots used for fee verification. (We do not collect or process live credit card details).</li>
                    <li><strong>Scientific Data:</strong> Abstract titles, co-author names, and uploaded research manuscript files (PDF/DOCX).</li>
                  </ul>
                </div>
              </section>

              <section id="infouse" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">2. How We Process Information</h2>
                <p className="leading-relaxed text-sm sm:text-base mb-4">We process your information for the following administrative and academic purposes:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-secondary text-sm sm:text-base">
                  <li>To facilitate your registration and issue delegate credentials.</li>
                  <li>To execute triple-blind peer reviews on submitted abstracts.</li>
                  <li>To send administrative information, event schedules, and acceptance notifications.</li>
                  <li>To compile the official Symposium Abstract Book and proceedings.</li>
                </ul>
              </section>

              <section id="whoshare" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">3. Sharing Your Information</h2>
                <p className="leading-relaxed text-sm sm:text-base">
                  We only share your information with authorized entities directly involved in organizing the symposium. This includes the internal scientific review committee (for evaluating abstracts) and institutional partners (like Tezpur University) solely for the purpose of granting campus access and generating official certificates. We will never sell your data to third-party marketers.
                </p>
              </section>

              <section id="abstracts" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">4. Abstract & Research Data</h2>
                <p className="leading-relaxed text-sm sm:text-base">
                  Any unpublished scientific data submitted through the portal is treated with strict confidentiality. It is made accessible only to the scientific review board. Upon acceptance and your explicit consent, the abstract text will be published in the official symposium proceedings distributed to attendees.
                </p>
              </section>

              <section id="inforetain" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">5. Data Retention</h2>
                <p className="leading-relaxed text-sm sm:text-base">
                  We retain your registration and financial verification data only for as long as necessary to fulfill the symposium's audit requirements (typically up to 1 year post-event). Published abstracts will remain part of the permanent academic record of the symposium.
                </p>
              </section>

              <section id="contact" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">8. Contact Us</h2>
                <p className="leading-relaxed text-sm sm:text-base mb-6">
                  If you have questions or comments about this notice, you may email the organizing committee at <a href={`mailto:${emailId}`} className="text-secondary font-bold hover:underline">{emailId}</a> or contact us via post at:
                </p>
                <div className="border border-surface-dim/40 rounded-xl p-6 bg-surface-bright inline-block min-w-[280px]">
                  <strong className="text-base block mb-2 text-primary font-playfair">Organizing Secretary</strong>
                  <address className="not-italic space-y-1 text-sm text-on-surface-variant">
                    <p>Dept. of Molecular Biology and Biotechnology</p>
                    <p>Tezpur University, Napaam</p>
                    <p>Tezpur, Assam 784028, India</p>
                  </address>
                </div>
              </section>

            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}