"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

// Strict interaction physics from your design specs
const springInteraction = {
  whileHover: { y: -5 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 320, damping: 22 }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

// Helper function to generate premium initials for missing photos
const getInitials = (name: string) => {
  const cleanName = name.replace(/(Prof\.|Dr\.)\s*/, '');
  const parts = cleanName.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return cleanName.substring(0, 2).toUpperCase();
};

const speakersData = [
  { name: "Prof. Raymond B. Birge", affiliation: "Rutgers School of Biomedical and Health Sciences, Newark, USA", image: "/speakers/raymond-birge.png" },
  { name: "Prof. Dhyan Chandra", affiliation: "Roswell Park Comprehensive Cancer Center, New York, USA", image: "/speakers/dhyan-chandra.png" },
  { name: "Prof. Jerry Chipuk", affiliation: "Icahn School of Medicine Mount Sinai, New York, USA", image: "/speakers/jerry-chipuk.png" },
  { name: "Prof. Rajesh Agarwal", affiliation: "University of Colorado, Denver, USA", image: "/speakers/rajesh-agarwal.png" },
  { name: "Prof. C.V. Rao", affiliation: "The University of Oklahoma College of Medicine, Oklahoma, USA", image: "/speakers/cv-rao.png" },
  // { name: "Prof. Natasha Kyprianou", affiliation: "Icahn School of Medicine Mount Sinai, New York, USA", image: "/speakers/natasha-kyprianou.png" },
  { name: "Prof. R. P. Singh", affiliation: "Gautam Budha University, Noida, India", image: "/speakers/rp-singh.png" },
  { name: "Prof. Sujit Basu", affiliation: "Ohio State University, USA", image: "/speakers/sujit-basu.png" },
  { name: "Prof. Gokul Das", affiliation: "Roswell Park Comprehensive Cancer Center, USA", image: "/speakers/gokul.png" },
  { name: "Dr. Chandrani Sarkar", affiliation: "Mitchell Cancer Institute, USA", image: "/speakers/chandrani-sarkar.png" },
  { name: "Prof. Pankaj Singh", affiliation: "The University of Oklahoma College of Medicine, Oklahoma, USA", image: "/speakers/pankaj-singh.png" },
  // { name: "Prof. Doris Germain", affiliation: "Icahn School of Medicine Mount Sinai, New York, USA", image: "/speakers/doris-germain.png" },
  // { name: "Prof. Yidong Bai", affiliation: "University of Texas San Antonio, Texas, USA", image: "/speakers/yidong-bai.png" },
  { name: "Prof. Reshma Taneja", affiliation: "National University of Singapore, Singapore", image: "/speakers/reshma-taneja.png" },
  // { name: "Prof. Huangen Ding", affiliation: "Louisiana State University, USA", image: "/speakers/huangen-ding.png" },
  // { name: "Prof. Ashok Kumar", affiliation: "University of Houston, Houston, USA", image: "/speakers/ashok-kumar.png" },
  // { name: "Prof. David Goodrich", affiliation: "Roswell Park Comprehensive Cancer Center, New York, USA", image: "/speakers/david-goodrich.png" },
  // { name: "Prof. Rakesh Singh", affiliation: "Banaras Hindu University, Varanasi, India", image: "/speakers/rakesh-singh.png" },
  // { name: "Dr. Marie Hardwick", affiliation: "Johns Hopkins University, Baltimore, USA", image: "/speakers/marie-hardwick.png" },
  // { name: "Dr. Komal Raina", affiliation: "South Dakota University, USA", image: "/speakers/komal-raina.png" },
  // { name: "Dr. Neera Tiwari Singh", affiliation: "Michigan University, USA", image: "/speakers/neera-singh.png" },
  // { name: "Prof. Sarad Mishra", affiliation: "Deen Dayal Upadhyaya University, Gorakhpur, India", image: "/speakers/sarad-mishra.png" },
  // { name: "Dr. Dipali Sharma", affiliation: "Johns Hopkins University, Baltimore, USA", image: "/speakers/dipali-sharma.png" },
  { name: "Dr. Subhrajit Saha", affiliation: "University of Kansas Medical Center, Kansas, USA", image: "/speakers/subhrajit-saha.png" },
  { name: "Dr. Pooja Jadiya", affiliation: "Wake Forest University, Winston-Salem, USA", image: "/speakers/pooja-jadiya.png" },
  // { name: "Dr. Ashok Varma", affiliation: "ACTREC, Navi Mumbai, India", image: "/speakers/ashok-varma.png" },
  { name: "Dr. Dhanendra Tomar", affiliation: "Wake Forest University, Winston-Salem, USA", image: "/speakers/dhanendra-tomar.png" }
];

export default function SpeakersPage() {
  return (
    <div className="w-full min-h-screen bg-surface pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-24">
      
      {/* Header Section */}
      <motion.div 
        className="max-w-[1280px] mx-auto mb-10 sm:mb-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp} className="w-10 sm:w-12 h-1 bg-secondary mb-4 sm:mb-6" />
        <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-primary mb-3 sm:mb-6 leading-tight">
          Distinguished Speakers
        </motion.h1>
        <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg font-inter text-on-surface-variant max-w-3xl leading-relaxed">
          The MCDHD/MCDTU 2026 brings together a global consortium of leading minds in oncology, mitochondrial dynamics, and cellular therapeutics.
        </motion.p>
      </motion.div>

      {/* Roster Grid */}
      <motion.div 
        className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {speakersData.map((speaker, idx) => (
          <motion.div 
            key={idx} 
            variants={fadeUp}
            {...springInteraction}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-surface-dim/30 shadow-[0_4px_20px_rgba(0,33,71,0.03)] hover:shadow-[0_8px_30px_rgba(0,33,71,0.08)] cursor-default"
          >
            {/* Image Container with Fallback */}
            <div className="aspect-[4/5] w-full relative bg-primary-container overflow-hidden group">
              {/* 1. Fallback Background & Initials */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-container to-primary">
                <span className="font-playfair text-4xl sm:text-5xl font-semibold text-white/20 tracking-widest">
                  {getInitials(speaker.name)}
                </span>
              </div>
              
              {/* 2. Speaker Image (Removed mix-blend and opacity) */}
              <Image 
                src={speaker.image} 
                alt={speaker.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  // Fallback if image doesn't exist yet
                  e.currentTarget.style.display = 'none';
                }}
              /> 
              
              {/* 3. Decorative overlay line (Added z-10 so it sits above the image) */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10" />
            </div>

            {/* Profile Info */}
            <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow bg-white">
              <h3 className="font-playfair text-base sm:text-lg font-bold text-primary mb-1.5 sm:mb-2 leading-tight">
                {speaker.name}
              </h3>
              <p className="font-inter text-[10px] sm:text-xs font-medium text-secondary-container uppercase tracking-wide mb-1.5 sm:mb-2 line-clamp-1">
                {speaker.affiliation.split(',').pop()?.trim() || "USA"}
              </p>
              <p className="font-inter text-xs sm:text-sm text-on-surface-variant leading-snug line-clamp-3">
                {speaker.affiliation}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}