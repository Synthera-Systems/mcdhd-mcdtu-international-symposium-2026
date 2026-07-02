"use client";

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

// Marquee logos restricted ONLY to the top "In Association With" banner on the poster
const associationLogos = [
  { name: "Rutgers Health", src: "/logos/rutgers.png" },
  { name: "Roswell Park Comprehensive Cancer Center", src: "/logos/roswell.png" },
  { name: "Gautam Buddha University", src: "/logos/gautam.png" },
  { name: "Cachar Cancer Hospital & Research Centre", src: "/logos/cachar.png" },
  { name: "Excellence Christ Service", src: "/logos/christ.png" },
  { name: "JNU. New Delhi", src: "/logos/jnu.png" },
  
];

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex justify-center bg-primary-container text-on-primary pt-12 pb-36 px-6 md:px-12 lg:px-24 overflow-hidden">
        
        {/* Background Image with Navy Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero.png" 
            alt="Scientific Research Background" 
            fill 
            className="object-cover opacity-40 mix-blend-luminosity"
            priority
          />
          {/* Gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container/80 via-primary-container/60 to-primary-container/90" />
        </div>

        <motion.div 
          className="relative z-10 max-w-[1280px] mx-auto flex flex-col items-center text-center gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-secondary-container text-xl font-semibold tracking-widest uppercase mb-2 backdrop-blur-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            November 2 - 3, 2026
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-7xl font-playfair font-bold leading-tight tracking-tight max-w-5xl drop-shadow-lg">
            International Symposium on Mitochondria, Cell Death, and Human Disease
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg md:text-2xl text-inverse-primary font-playfair italic max-w-3xl">
            Recent Advances in Cancer Research and Clinical Translation
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-2 text-on-primary-container font-inter mt-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Council Hall, Tezpur University, Assam, India
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-1 mt-4 p-4 md:p-6 rounded-2xl bg-secondary/10 border border-secondary/20 backdrop-blur-sm max-w-3xl">
            <p className="text-[10px] md:text-xs font-bold tracking-widest text-secondary-container uppercase">Organised By</p>
            <h2 className="text-sm md:text-lg font-bold text-on-primary text-center">
              Dept. of Molecular Biology and Biotechnology<br/>
              <span className="font-normal text-inverse-primary">Tezpur University, Assam, India</span>
            </h2>
          </motion.div>

          {/* <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mt-6">
            <motion.div {...springInteraction}>
              <Link href="/registration" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary text-on-secondary font-inter font-medium transition-colors hover:bg-secondary-container hover:text-on-secondary-container shadow-lg shadow-secondary/20">
                <span>Register Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </motion.div>
            <motion.div {...springInteraction}>
              <Link href="/submissions" className="inline-flex items-center px-8 py-3.5 rounded-full bg-transparent border border-inverse-primary text-inverse-primary font-inter font-medium transition-colors hover:bg-inverse-primary/10">
                Submit Abstract
              </Link>
            </motion.div>
          </motion.div> */}
        </motion.div>

       {/* Marquee - In Association With */}
       <div className="absolute bottom-0 left-0 w-full border-t border-secondary/20 bg-primary-container/50 backdrop-blur-md pt-4 pb-4 overflow-hidden z-20">
          <div className="max-w-[1280px] mx-auto px-6 mb-3">
            <p className="text-center text-[10px] font-bold tracking-widest text-secondary-container uppercase">In Association With</p>
          </div>
          <div className="relative flex overflow-hidden w-full h-24 items-center">
            {associationLogos.map((logo, idx) => (
              <motion.div
                key={idx}
                className="absolute flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                initial={{ left: "100%" }} 
                animate={{ left: "-300px" }} // Pushed to -300px to ensure it fully exits the left screen
                transition={{
                  ease: "linear",
                  duration: 20, 
                  repeat: Infinity,
                  delay: idx * (20 / associationLogos.length), 
                }}
              >
                {/* FIX 1: Replaced w-full with explicit dimensions (w-48 h-16) */}
                <div className="relative w-auto h-30 flex items-center justify-center">
                  
                  {/* FIX 2: Commented out the text so it doesn't show behind transparent images */}
                  {/* <span className="font-bold text-sm md:text-base text-inverse-primary absolute z-0 whitespace-nowrap">
                    {logo.name}
                  </span> */}
                  
                  <img 
                    src={logo.src} 
                    alt={logo.name} 
                    className="h-20 md:h-12 w-auto object-contain drop-shadow-md relative z-10" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="w-full py-24 px-6 md:px-12 lg:px-24 bg-surface">
        <motion.div 
          className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="space-y-6">
            <motion.div variants={fadeUp} className="w-12 h-1 bg-secondary mb-8" />
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-playfair font-semibold text-primary leading-tight">
              Fostering Global Collaboration in Oncology & Mitochondrial Biology
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base md:text-lg font-inter text-on-surface-variant leading-relaxed">
              The MCDHD/MCDTU 2026 serves as a premier multidisciplinary platform for world-renowned scientists, clinical researchers, and young investigators to converge and discuss the pivotal role of mitochondria in human health and disease. 
            </motion.p>
            <motion.p variants={fadeUp} className="text-base md:text-lg font-inter text-on-surface-variant leading-relaxed">
              With a specific focus on mitochondria and cancer, this symposium facilitates international collaboration, sparking dialogues that lead to innovative therapeutic strategies. By bringing together diverse perspectives from Tezpur to New Jersey, we aim to unravel the complexities of cell death pathways and metabolic reprogramming in cancer cells.
            </motion.p>
          </div>
          <motion.div variants={fadeUp} className="bg-primary-container rounded-3xl p-10 aspect-square md:aspect-video lg:aspect-square flex flex-col justify-end relative overflow-hidden shadow-2xl group">
             <div className="absolute inset-0 opacity- px-4 flex items-center justify-center transition-transform duration-1000 group-hover:scale-110">
                 <div className="w-72 h-72 border-[0.5px] border-secondary-container rounded-full animate-[spin_60s_linear_infinite] absolute" />
                 <div className="w-56 h-56 border-[0.5px] border-secondary-container/50 rounded-full animate-[spin_40s_reverse_linear_infinite] absolute" />
                 <div className="w-32 h-32 border border-secondary-container/30 rounded-full animate-pulse absolute" />
                 <img src={"/screen.png"} className="rounded-2xl"/>
             </div>
             <div className="relative z-10 bg-gradient-to-t from-primary-container p-6 -m-10 mt-0">
               <h3 className="text-white font-playfair text-3xl font-semibold mb-2">Pioneering Science</h3>
               <p className="text-inverse-primary font-inter flex items-center gap-2">
                 Where academia meets clinical translation
                 {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg> */}
               </p>
             </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. THEMES SECTION */}
      <section className="w-full py-24 px-6 md:px-12 lg:px-24 bg-surface-bright border-y border-surface-dim/30">
        <motion.div 
          className="max-w-[1280px] mx-auto flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-primary mb-4">
              Scientific Program Themes
            </h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { 
                title: "Mitochondrial Dynamics", 
                desc: "Exploring organelle fusion, fission, and trafficking mechanisms and their implications in cellular homeostasis and metabolic diseases.",
                icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              },
              { 
                title: "Cell Death Pathways", 
                desc: "Investigating the molecular signatures of apoptosis, ferroptosis, and necroptosis in the context of therapeutic resistance.",
                icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              },
              { 
                title: "Cancer Therapeutics", 
                desc: "Translating bench discoveries into targeted therapies, focusing on drug delivery systems and personalized medicine approaches.",
                icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              }
            ].map((theme, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgba(0,33,71,0.04)] border border-surface-dim/20 transition-all"
              >
                <div className="w-14 h-14 bg-primary-container text-secondary-container rounded-xl flex items-center justify-center mb-8 shadow-inner">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={theme.icon} /></svg>
                </div>
                <h3 className="text-xl font-playfair font-bold text-primary mb-4">{theme.title}</h3>
                <p className="text-on-surface-variant font-inter text-sm leading-relaxed">{theme.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. ORGANIZING COMMITTEE SECTION */}
      <section className="w-full py-24 px-6 md:px-12 lg:px-24 bg-surface">
        <motion.div 
          className="max-w-[1280px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-playfair font-semibold text-primary mb-4">Organizing Committee</h2>
            <div className="w-16 h-1 bg-secondary mx-auto rounded-full mb-6" />
            <p className="text-on-surface-variant font-inter max-w-2xl mx-auto">Guided by visionary leadership and a dedicated team of national and international scientific experts.</p>
          </motion.div>

          {/* Patrons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { role: "Chief Patron", name: "Prof. Amarendra Kr. Das", title: "Pro Vice Chancellor", org: "Tezpur University" },
              { role: "Patron", name: "Prof. Ashim Jyoti Thakur", title: "Dean, Academic Affairs", org: "Tezpur University" },
              { role: "Patron", name: "Prof. Nayandeep Deka Baruah", title: "Dean, School of Sciences", org: "Tezpur University" }
            ].map((person, idx) => (
              <motion.div key={idx} variants={fadeUp} className="bg-surface-bright border border-surface-dim/30 p-8 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[10px] font-bold tracking-widest text-secondary uppercase bg-secondary/10 px-3 py-1 rounded-full mb-4">{person.role}</span>
                <h3 className="text-lg font-playfair font-bold text-primary mb-1">{person.name}</h3>
                <p className="text-sm font-medium text-on-surface-variant">{person.title}</p>
                <p className="text-xs text-secondary mt-1">{person.org}</p>
              </motion.div>
            ))}
          </div>

          {/* Convenor Banner */}
          <motion.div variants={fadeUp} className="bg-primary text-white rounded-2xl p-8 mb-16 shadow-lg text-center max-w-3xl mx-auto border border-primary-container">
             <span className="text-[10px] font-bold tracking-widest text-secondary-container uppercase bg-secondary/20 px-4 py-1.5 rounded-full mb-4 inline-block">Convenor & Organizing Secretary</span>
             <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-2">Prof. Anand Shankar Ramteke</h3>
             <p className="text-inverse-primary font-inter text-sm">Tezpur University, Tezpur, India</p>
          </motion.div>

          {/* Co-Convenors Grid */}
          <motion.div variants={fadeUp}>
            <h3 className="text-2xl font-playfair font-bold text-center text-primary mb-8">Co-Convenors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Prof. Raymond B. Birge", org: "Rutgers School of Biomedical and Health Sciences", loc: "Newark, USA" },
                { name: "Prof. Dhyan Chandra", org: "Roswell Park Comprehensive Cancer Center", loc: "New York, USA" },
                { name: "Prof. Paulraj Rajamani", org: "JNU", loc: "New Delhi, India" },
                { name: "Prof. S. Dhanalakhmi", org: "Gautam Budha University", loc: "Noida, India" },
                { name: "Dr. Rajiv Kumar", org: "Cachar Cancer Hospital and Research Center", loc: "Silchar, India" },
                { name: "Dr. Ravi Thakur", org: "CHRIST University", loc: "Bengaluru, India" }
              ].map((person, idx) => (
                <div key={idx} className="bg-white border border-surface-dim/20 p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform">
                  <h4 className="text-base font-playfair font-bold text-primary mb-2">{person.name}</h4>
                  <p className="text-xs font-inter text-on-surface-variant leading-relaxed">{person.org}</p>
                  <p className="text-[11px] font-medium text-secondary mt-2">{person.loc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 5. AWARDS SECTION */}
      <section className="w-full py-24 px-6 md:px-12 lg:px-24 bg-surface-bright border-t border-surface-dim/30">
        <motion.div 
          className="max-w-[1280px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="mb-16">
            <h2 className="text-3xl md:text-5xl font-playfair font-semibold text-primary mb-6">Academic Recognition</h2>
            <p className="text-on-surface-variant font-inter text-lg max-w-2xl">We honor the outstanding contributions of young investigators and researchers pushing the boundaries of mitochondrial science.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} className="bg-primary text-white p-10 md:p-12 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <svg className="w-32 h-32 " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
               </div>
               <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full bg-secondary/30 border border-secondary/50 flex items-center justify-center mb-8">
                    <svg className="w-6 h-6 text-secondary-container " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                  <h3 className="text-3xl font-playfair font-bold mb-4">Best Poster Award</h3>
                  <p className="text-inverse-primary font-inter text-base leading-relaxed mb-10 max-w-md">Recognizing visual clarity and scientific rigor in research presentation. Open to all registered graduate students and post-docs.</p>
               </div>
               <ul className="space-y-4 font-inter text-sm text-surface-dim relative z-10">
                  <li className="flex items-center gap-3"><svg className="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Cash Prize</li>
                  <li className="flex items-center gap-3"><svg className="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Certificate of Excellence</li>
                  <li className="flex items-center gap-3"><svg className="w-5 h-5 text-secondary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Travel Grant Opportunity</li>
               </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-secondary text-white p-10 md:p-12 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
               </div>
               <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-8">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  </div>
                  <h3 className="text-3xl font-playfair font-bold mb-4">Best Oral Presentation</h3>
                  <p className="text-secondary-fixed font-inter text-base leading-relaxed mb-10 max-w-md">Awarded for exceptional communication of innovative research findings during the plenary and thematic sessions.</p>
               </div>
               <ul className="space-y-4 font-inter text-sm text-surface-bright relative z-10">
                  <li className="flex items-center gap-3"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> International Recognition</li>
                  <li className="flex items-center gap-3"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Publication Assistance</li>
                  <li className="flex items-center gap-3"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Keynote Nomination</li>
               </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </main>
  );
}