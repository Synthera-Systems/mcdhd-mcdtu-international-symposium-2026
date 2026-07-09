"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function TermsAndConditions() {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const emailId = "mitocansypm2026@gmail.com";
  const siteURL = "https://mitocan2026.org"; 

  const tocItems = [
    { id: "agreement", label: "Agreement to Terms" },
    { id: "registration", label: "1. Registration & Payment" },
    { id: "abstracts", label: "2. Abstract Submissions" },
    { id: "ip", label: "3. Intellectual Property" },
    { id: "prohibited", label: "4. Prohibited Activities" },
    { id: "cancellation", label: "5. Cancellation Policy" },
    { id: "liability", label: "6. Limitations of Liability" },
    { id: "contact", label: "7. Contact Us" },
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
            Terms & Conditions
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
            Please read these terms and conditions carefully before registering as a delegate or submitting research manuscripts to the symposium.
          </motion.p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full relative">
          
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
              
              <section id="agreement" className="scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">Agreement to Terms</h2>
                <div className="space-y-4 leading-relaxed text-sm sm:text-base">
                  <p>
                    These Terms and Conditions constitute a legally binding agreement made between you and the Organizing Committee of the <strong>MitoCan-Symposium 2026</strong>, hosted at Tezpur University, Assam. By registering, accessing the portal, or submitting an abstract, you agree to be bound by these Terms.
                  </p>
                </div>
              </section>

              <section id="registration" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">1. Registration & Payment</h2>
                <div className="space-y-4 leading-relaxed text-sm sm:text-base">
                  <p>All symposium delegate fees must be paid in INR via approved Bank Transfer or UPI gateways. The issuance of a Delegate Reference ID does not confirm attendance until the payment screenshot and UTR number have been manually or automatically verified by our backend systems.</p>
                  <ul className="list-disc pl-6 space-y-2 marker:text-secondary">
                    <li>You agree to provide accurate and current payment documentation. Fraudulent UTR submissions will result in immediate disqualification.</li>
                    <li>The organizing committee reserves the right to reject any registration at their sole discretion.</li>
                  </ul>
                </div>
              </section>

              <section id="abstracts" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">2. Abstract Submissions</h2>
                <p className="leading-relaxed text-sm sm:text-base mb-4">By submitting an abstract or research manuscript, you warrant and represent that:</p>
                <ul className="list-disc pl-6 space-y-2 marker:text-secondary text-sm sm:text-base">
                  <li>The study represents original research and is not previously published in a major peer-reviewed journal.</li>
                  <li>You have obtained consent from all listed co-authors to present the data at this symposium.</li>
                  <li>You possess a valid, paid Delegate Registration ID at the time of submission.</li>
                </ul>
              </section>

              <section id="ip" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">3. Intellectual Property</h2>
                <p className="leading-relaxed text-sm sm:text-base">
                  Authors retain the primary copyright to their submitted abstracts. However, by submitting, you grant the MitoCan-Symposium organizing committee a non-exclusive, royalty-free license to publish, display, and distribute the abstract within the official Symposium Proceedings, Abstract Book, and promotional materials.
                </p>
              </section>

              <section id="cancellation" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">5. Cancellation & Refunds</h2>
                <div className="p-6 rounded-xl border-l-4 bg-secondary/5 border-secondary text-sm sm:text-base">
                  <p className="font-semibold text-primary mb-2">Non-Refundable Policy</p>
                  <p>Due to the administrative overhead required for academic scheduling and peer-review processing, <strong>all registration fees are strictly non-refundable</strong> once paid and verified, regardless of abstract acceptance status or personal attendance ability.</p>
                </div>
              </section>

              <section id="contact" className="pt-8 border-t border-surface-dim/30 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-playfair font-bold mb-4 text-primary">7. Contact Us</h2>
                <p className="leading-relaxed text-sm sm:text-base mb-6">
                  For legal inquiries or disputes regarding these Terms, please reach out to:
                </p>
                <div className="border border-surface-dim/40 rounded-xl p-6 bg-surface-bright inline-block min-w-[280px]">
                  <strong className="text-base block mb-2 text-primary font-playfair">Symposium Secretariat</strong>
                  <address className="not-italic space-y-1 text-sm text-on-surface-variant">
                    <p>Dept. of MBBT, Tezpur University</p>
                    <a href={`mailto:${emailId}`} className="text-secondary font-bold block mt-2 hover:underline">{emailId}</a>
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