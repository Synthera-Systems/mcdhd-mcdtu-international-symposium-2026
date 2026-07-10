"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Strict interaction physics
const springInteraction = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 320, damping: 22 }
};

// Scroll animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const associationLogos = [
  { name: "Rutgers Health", src: "/logos/rutgers.png" },
  { name: "Roswell Park Comprehensive Cancer Center", src: "/logos/roswell.png" },
  { name: "Gautam Buddha University", src: "/logos/gautam.png" },
  { name: "Cachar Cancer Hospital & Research Centre", src: "/logos/cachar.png" },
  { name: "Excellence Christ Service", src: "/logos/christ.png" },
  { name: "JNU. New Delhi", src: "/logos/jnu.png" },
];

export default function Home() {
  const [symposiumDates, setSymposiumDates] = useState("");
  const [loading, setLoading] = useState(true); // ADDED: Loading context flag

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.symposiumDates) {
          setSymposiumDates(data.symposiumDates);
        }
      })
      .catch((err) => console.error("Error loading layout settings:", err))
      .finally(() => setLoading(false)); // ADDED: Kill loading loop on resolution
  }, []);

  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[100svh] md:min-h-[90vh] flex items-center justify-center bg-primary-container text-on-primary pt-16 sm:pt-20 pb-32 sm:pb-40 md:pb-64 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
        
        {/* Background Image with Navy Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero.png" 
            alt="Scientific Research Background" 
            fill 
            className="object-cover opacity-40 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container/80 via-primary-container/60 to-primary-container/90" />
        </div>

        <motion.div 
          className="relative z-10 max-w-[1280px] mx-auto flex flex-col items-center text-center gap-5 sm:gap-6 -mt-8 sm:-mt-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* UPDATED: Dynamic / Loading Date Pill */}
          {loading ? (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/10 border border-secondary/30 text-on-primary backdrop-blur-sm animate-pulse w-48 sm:w-56 h-9 sm:h-10">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-400/40 shrink-0" />
              <div className="h-3.5 bg-white/20 rounded w-full" />
            </div>
          ) : (
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/80 text-on-primary text-lg sm:text-sm md:text-xl font-semibold tracking-widest uppercase mb-1 sm:mb-2 backdrop-blur-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 overflow-visible" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" className="fill-blue-400 animate-ping origin-center"/><circle cx="12" cy="12" r="6" className="fill-blue-500"/></svg>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {symposiumDates}
            </motion.div>
          )}
          
          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold leading-tight tracking-tight max-w-5xl drop-shadow-lg px-2">
            International Symposium on Mitochondria, Cell Death, and Human Disease
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-xl sm:text-lg md:text-3xl text-on-primary font-playfair italic max-w-4xl font-semibold px-2">
            Recent Advances in Cancer Research and Clinical Translation
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/80 text-on-primary font-inter font-bold mt-1 text-sm sm:text-sm md:text-2xl text-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Council Hall, Tezpur University, Assam, India
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-1 mt-3 sm:mt-4 p-3 sm:p-4 md:p-6 rounded-2xl bg-secondary/10 border border-secondary/80 backdrop-blur-sm max-w-3xl w-[90%] sm:w-auto">
            <p className="text-sm sm:text-[10px] md:text-lg font-bold tracking-widest text-secondary-container uppercase text-center">Organised By</p>
            <h2 className="text-lg sm:text-sm md:text-2xl font-bold text-on-primary text-center leading-snug">
              Dept. of Molecular Biology and Biotechnology<br/>
              <span className="font-semibold text-on-primary block mt-0.5 text-lg sm:text-sm md:text-2xl">Tezpur University, Assam, India</span>
            </h2>
          </motion.div>
        </motion.div>

        {/* Marquee - In Association With */}
        <div className="absolute bottom-0 left-0 w-full border-t border-secondary/20 bg-primary-container/50 backdrop-blur-md pt-3 sm:pt-4 pb-3 sm:pb-4 overflow-hidden z-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-2 sm:mb-3">
            <p className="text-center text-sm sm:text-lg font-bold tracking-widest text-secondary-container uppercase">In Association With</p>
          </div>
          
          <div className="relative flex overflow-hidden w-full h-16 sm:h-24 md:h-36 items-center">
            <motion.div
              className="flex gap-8 sm:gap-16 md:gap-24 w-max px-4 sm:px-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 25, repeat: Infinity }}
            >
              {[...associationLogos, ...associationLogos, ...associationLogos, ...associationLogos].map((logo, idx) => (
                <div key={idx} className="flex items-center justify-center shrink-0">
                  <img src={logo.src} alt={logo.name} className="h-10 sm:h-16 md:h-24 w-auto object-contain drop-shadow-md" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="w-full py-15 sm:pb-16 sm:pt-8 px-4 sm:px-6 md:px-12 lg:px-24 bg-surface overflow-hidden">
        <motion.div 
          className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="space-y-5 sm:space-y-6">
            <motion.div variants={fadeUp} className="w-10 sm:w-12 h-1 bg-secondary mb-6 sm:mb-8" />
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-5xl font-playfair font-semibold text-primary leading-tight">
              Fostering Global Collaboration in Oncology & Mitochondrial Biology
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg font-inter text-on-surface-variant leading-relaxed">
              The Mitochondria Cancer Symposium 2026 serves as a premier multidisciplinary platform for world-renowned scientists, clinical researchers, and young investigators to converge and discuss the pivotal role of mitochondria in human health and disease. 
            </motion.p>
            <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg font-inter text-on-surface-variant leading-relaxed">
              With a specific focus on mitochondria and cancer, this symposium facilitates international collaboration, sparking dialogues that lead to innovative therapeutic strategies. By bringing together diverse perspectives, we aim to unravel the complexities of cell death pathways and metabolic reprogramming in cancer cells.
            </motion.p>
          </div>
          <motion.div variants={fadeUp} className="bg-primary-container rounded-3xl p-6 sm:p-10 aspect-square md:aspect-video lg:aspect-square flex flex-col justify-end relative overflow-hidden shadow-2xl group w-full max-w-[500px] mx-auto lg:max-w-none">
          <div className="absolute inset-0 px-4 flex items-center justify-center">
            {/* Background Animation Rings - Scaled for mobile */}
            <div className="w-48 h-48 sm:w-72 sm:h-72 border-[0.5px] border-secondary-container rounded-full animate-[spin_60s_linear_infinite] absolute" />
            <div className="w-36 h-36 sm:w-56 sm:h-56 border-[0.5px] border-secondary-container/50 rounded-full animate-[spin_40s_reverse_linear_infinite] absolute" />
            <div className="w-20 h-20 sm:w-32 sm:h-32 border border-secondary-container/30 rounded-full animate-pulse absolute" />
            
            {/* Image Container that masks the overflow */}
            <div className="rounded-2xl overflow-hidden relative z-10 w-4/5 sm:w-auto">
              <img 
                src="/screen.png" 
                alt="Screen preview"
                className="transition-transform duration-1000 group-hover:scale-110 w-full object-cover"
              />
            </div>
          </div>
             <div className="relative z-10 bg-gradient-to-t from-primary-container p-4 sm:p-6 -m-6 sm:-m-10 mt-0">
               <h3 className="text-white font-playfair text-2xl sm:text-3xl font-semibold mb-1 sm:mb-2">Pioneering Science</h3>
               <p className="text-inverse-primary font-inter text-xs sm:text-sm flex items-center gap-2">
                 Where academia meets clinical translation
               </p>
             </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. THEMES SECTION */}
      <section className="w-full py-3 sm:pb-13 sm:pt-6 px-4 sm:px-6 md:px-12 lg:px-24 bg-surface-bright border-y border-surface-dim/30">
        <motion.div 
          className="max-w-[1280px] mx-auto flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-semibold text-primary mb-3 sm:mb-4">
              Scientific Program Themes
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-secondary mx-auto rounded-full" />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 w-full">
            {[
              { 
                title: "Mitochondrial Biology", 
                desc: "Exploring mitochondrial dynamics, respiration, and metabolism in cellular homeostasis.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z" // Lightning bolt (Energy/Mitochondria)
              },
              { 
                title: "Cell Death Pathways", 
                desc: "Investigating cell death pathways and their direct applications in cancer therapeutics.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" // Shield with check (Therapeutics/Protection)
              },
              { 
                title: "Cancer Targets", 
                desc: "Identifying novel targets and therapeutic agents to effectively control cancer progression.",
                icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" // Crosshair/Target (Novel Targets)
              },
              { 
                title: "Phytochemicals", 
                desc: "Discovering novel phytochemicals and investigating their roles in active cancer prevention.",
                icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" // Chemistry Beaker (Phytochemicals)
              },
              {
                title: "Tumor Microenvironment",
                desc: "Analyzing the tumor microenvironment and its complex impact on cancer therapeutics.",
                icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" // 3D Cubes/Cells (Microenvironment structure)
              },
              {
                title: "Biomarkers & Metabolome",
                desc: "Identifying novel biomarkers and mapping the cancer metabolome for early detection.",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" // Clipboard with check (Data/Biomarkers)
              },
              {
                title: "Stem Cells",
                desc: "Understanding stem cells and overcoming critical challenges in cancer therapy resistance.",
                icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" // Refresh/Cycle (Stem cell renewal/resistance)
              },
              {
                title: "Nano Systems & Delivery",
                desc: "Advancing nano systems and targeted drug delivery mechanisms in cancer treatment.",
                icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" // Package/Box (Drug Delivery)
              }
            ].map((theme, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-[0_8px_30px_rgba(0,33,71,0.04)] border border-surface-dim/20 transition-all"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-container text-secondary-container rounded-xl flex items-center justify-center mb-6 sm:mb-8 shadow-inner">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={theme.icon} /></svg>
                </div>
                <h3 className="text-lg sm:text-xl font-playfair font-bold text-primary mb-3 sm:mb-4">{theme.title}</h3>
                <p className="text-on-surface-variant font-inter text-xs sm:text-sm leading-relaxed">{theme.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. ORGANIZING COMMITTEE SECTION */}
      <section className="w-full py-3 sm:pb-13 sm:pt-6 px-4 sm:px-6 md:px-12 lg:px-24 bg-surface justify-center">
        <motion.div 
          className="max-w-[1280px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-playfair font-semibold text-primary mb-3 sm:mb-4">Organizing Committee</h2>
            <div className="w-12 sm:w-16 h-1 bg-secondary mx-auto rounded-full mb-4 sm:mb-6" />
            <p className="text-on-surface-variant font-inter text-sm sm:text-base max-w-2xl mx-auto px-2">Guided by visionary leadership and a dedicated team of national and international scientific experts.</p>
          </motion.div>

          {/* Patrons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {[
              { role: "Chief Patron", name: "Prof. Amarendra Kr. Das", img: "/convenors/amrendra.png" , title: "Pro Vice Chancellor", org: "Tezpur University", badgeDesign:"bg-secondary/20 border border-secondary/80 px-3 sm:px-4 py-1.5 rounded-full mb-2" },
              { role: "Patron", name: "Prof. Ashim Jyoti Thakur", img: "/convenors/ashim.png" , title: "Dean, Academic Affairs", org: "Tezpur University", badgeDesign:"" },
              { role: "Patron", name: "Prof. Nayandeep Deka Baruah", img: "/convenors/nayandeep.png" , title: "Dean, School of Sciences", org: "Tezpur University", badgeDesign:"" }
            ].map((person, idx) => (
              <motion.div key={idx} variants={fadeUp} className="group bg-surface-bright border border-surface-dim/30 p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-secondary uppercase bg-secondary/10 px-3 py-1 rounded-full mb-4">{person.role}</span>
                
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3 sm:mb-4 rounded-full overflow-hidden shrink-0 bg-surface/50 border-2 border-secondary/10 shadow-inner">
                  <Image 
                    src={person.img}
                    alt={person.name} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  /> 
                </div>

                <h3 className="text-base sm:text-lg font-playfair font-bold text-primary mb-1">{person.name}</h3>
                <p className={`text-xs sm:text-sm font-medium text-on-surface-variant ${person.badgeDesign}`}>{person.title}</p>
                <p className="text-[10px] sm:text-xs text-secondary mt-1">{person.org}</p>
              </motion.div>
            ))}
          </div>

          {/* Convenor Banner */}
          <motion.div 
            variants={fadeUp} 
            className="group bg-surface-bright border border-surface-dim/30 p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow w-full max-w-sm md:max-w-[32.3%] mx-auto mb-10"
          >
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-secondary uppercase bg-secondary/10 px-4 py-2 rounded-2xl mb-4 max-w-[90%] sm:max-w-none">
              Convenor & Organizing Secretary
            </span>
            
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3 sm:mb-4 rounded-full overflow-hidden shrink-0 bg-surface/50 border-2 border-secondary/10 shadow-inner">
              <Image 
                src='/convenors/ramteke.png'
                alt='Prof. Anand Shankar Ramteke' 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              /> 
            </div>

            <h3 className="text-base sm:text-lg font-playfair font-bold text-primary mb-1 whitespace-normal sm:whitespace-nowrap">
              Prof. Anand Shankar Ramteke
            </h3>
            <p className="text-xs sm:text-sm font-medium text-on-surface-variant max-w-[200px] sm:max-w-none">
              Professor, MBBT Department
            </p>
            <p className="text-[10px] sm:text-xs text-secondary mt-1">Tezpur University</p>
          </motion.div>

          {/* <motion.div variants={fadeUp} className="group flex flex-col items-center bg-primary text-white rounded-2xl p-6 sm:p-8 mb-12 sm:mb-16 shadow-lg text-center max-w-3xl mx-auto border border-primary-container">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6 rounded-full overflow-hidden shrink-0 bg-surface-bright border-4 border-secondary/20 shadow-inner">
              <Image 
                src='/convenors/ramteke.png'
                alt='Prof. Anand Shankar Ramteke' 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              /> 
            </div>
            
            <div className="flex flex-col items-center px-2">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-secondary-container uppercase bg-secondary/20 px-3 sm:px-4 py-1.5 rounded-full mb-3 sm:mb-4 inline-block">
                Convenor & Organizing Secretary
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold mb-1 sm:mb-2 leading-tight">
                Prof. Anand Shankar Ramteke
              </h3>
              <p className="text-inverse-primary font-inter text-xs sm:text-sm">
                Tezpur University, Tezpur, India
              </p>
            </div>
          </motion.div> */}

          {/* Co-Convenors Grid */}
          <motion.div variants={fadeUp}>
            <h3 className="text-xl sm:text-2xl font-playfair font-bold text-center text-primary mb-6 sm:mb-8">Co-Convenors</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
                { name: "Prof. Raymond B. Birge", img: "/convenors/raymond-birge.png" , org: "Rutgers School of Biomedical and Health Sciences", loc: "Newark, USA" },
                { name: "Prof. Dhyan Chandra", img: "/convenors/dhyan-chandra.png" , org: "Roswell Park Comprehensive Cancer Center", loc: "New York, USA" },
                // { name: "Prof. Jerry Chipuk", img: "/speakers/jerry-chipuk.png",org: "Icahn School of Medicine Mount Sinai", loc: " New York, USA" },
                // { name: "Prof. Ajay Singh", img: "/speakers/ajay.png", org: "Mitchell Cancer Institute", loc: "Alabama, USA"},
                { name: "Prof. Paulraj Rajamani", img: "/convenors/paulraj.png" , org: "Jawaharlal Nehru University", loc: "New Delhi, India" },
                { name: "Prof. S. Dhanalakshmi", img: "/convenors/dhanlakshmi.png" , org: "Gautam Buddha University", loc: "Noida, India" },
                { name: "Dr. Rajeev Kumar", img: "/convenors/rajeev.png" , org: "Cachar Cancer Hospital and Research Center", loc: "Silchar, India" },
                { name: "Dr. Ravi Thakur", img: "/convenors/ravi.png" , org: "CHRIST University", loc: "Bengaluru, India" }
              ].map((person, idx) => (
                <div key={idx} className="group bg-white border border-surface-dim/20 p-4 sm:p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full sm:rounded-lg overflow-hidden shrink-0 bg-surface-bright">
                    <Image 
                      src={person.img} 
                      alt={person.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    /> 
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h4 className="text-sm sm:text-base font-playfair font-bold text-primary mb-1 sm:mb-2">{person.name}</h4>
                    <p className="text-[11px] sm:text-xs font-inter text-on-surface-variant leading-relaxed flex-1">{person.org}</p>
                    <p className="text-[10px] sm:text-[11px] font-medium text-secondary mt-1 sm:mt-2 shrink-0">{person.loc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 5. AWARDS SECTION */}
      <section className="w-full py-3 sm:pb-13 sm:pt-6 px-4 sm:px-6 md:px-12 lg:px-24 bg-surface-bright border-t border-surface-dim/30">
        <motion.div 
          className="max-w-[1280px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="mb-10 sm:mb-16 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-playfair font-semibold text-primary mb-4 sm:mb-6">Academic Recognition</h2>
            <p className="text-on-surface-variant font-inter text-sm sm:text-lg max-w-2xl mx-auto md:mx-0">We honor the outstanding contributions of young investigators and researchers pushing the boundaries of mitochondrial science.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <motion.div variants={fadeUp} className="bg-primary text-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10">
                 <svg className="w-24 h-24 sm:w-32 sm:h-32 " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
               </div>
               <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary/30 border border-secondary/50 flex items-center justify-center mb-6 sm:mb-8">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-container " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold mb-3 sm:mb-4">Best Poster Award</h3>
                  <p className="text-inverse-primary font-inter text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 max-w-md">Recognizing visual clarity and scientific rigor in research presentation. Open to all registered graduate students and post-docs.</p>
               </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-secondary text-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10">
                 <svg className="w-24 h-24 sm:w-32 sm:h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
               </div>
               <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-6 sm:mb-8">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold mb-3 sm:mb-4">Best Oral Presentation</h3>
                  <p className="text-secondary-fixed font-inter text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 max-w-md">Awarded for exceptional communication of innovative research findings during the plenary and thematic sessions.</p>
               </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </main>
  );
}