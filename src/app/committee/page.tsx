"use client";

import { motion, Variants } from "framer-motion";

// Strict interaction physics from your design specs
const springInteraction = {
  whileHover: { y: -3 },
  whileTap: { scale: 0.98 },
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
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
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

const advisoryCommittee = [
  { name: "Prof. R.K. Kale", affiliation: "Former Vice Chancellor, Central University of Gujarat, Gandhinagar, India" },
  { name: "Prof. V.K. Jain", affiliation: "Former Vice Chancellor, Tezpur University, Tezpur, India" },
  {name: "Prof. Gokul Das", affiliation: "Roswell Park Comprehensive Cancer Center, USA"},
  {name: "Prof. Jerry Chipuk", affiliation: "Icahn School of Medicine Mount Sinai,New York, USA"},
  {name: "Prof. Ajay Singh", affiliation: "Mitchell Cancer Institute, Alabama, USA"},
  { name: "Prof. Rajesh Agarwal", affiliation: "University of Colorado, USA" },
  { name: "Prof. Chinthalapally V. Rao", affiliation: "The University of Oklahoma College of Medicine, Oklahoma, USA" },
  { name: "Prof. R.P. Singh", affiliation: "Vice Chancellor, Gautam Buddha University, Noida, India" },
  { name: "Dr. Ravi Kannan", affiliation: "Director, Cachar Cancer Hospital and Research Center, Silchar, Assam, India" },
  { name: "Prof. Rajiv Varshney", affiliation: "Former Director, Defence Institute of Physiology and Allied Sciences, Delhi, India" },
  { name: "Prof. Supriyo Chakraborty", affiliation: "Dean, School of Life Sciences, JNU, New Delhi, India" },
  { name: "Prof. D.K. Bhattacharyya", affiliation: "School of Computer Science and Engineering, Tezpur University, Tezpur, India" }
];

const localCoConvenors = [
  { name: "Prof. S.K. Ray", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India" },
  { name: "Prof. D. Mahanta", affiliation: "Dept. of Physics, Tezpur University, Tezpur, India" },
  { name: "Prof. Vijay K Nath", affiliation: "Dept of Electonics and Comm. Eng., Tezpur University, Tezpur, India" }
];

const localOrganizingCommittee = [
  { name: "Prof. Rupak Mukhopadyay", affiliation: "Head, Dept. of MBBT, Tezpur University, Tezpur, India", role: "Chairperson" },
  { name: "Prof. D. Mohanta", affiliation: "Dept. of Physics, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Prof. Utpal Bora", affiliation: "Tezpur University, Tezpur, India", role: "Member" },
  { name: "Prof. Pritam Deb", affiliation: "Dept. of Physics, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Prof. Pobitra Nath", affiliation: "Dept. of Physics, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Prof. Suvendra K Ray", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Prof. M Mandal", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Prof. MVS Satish Kumar", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Bipul Sarma", affiliation: "Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Deepika Hazarika", affiliation: "Dept of Electonics and Comm. Eng., Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Anupam Nath Jha", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Thiyam Ramsing Singh", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Surya Prakash G. Ponnam", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Suman Dasgupta", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Jyoti Prasad Saikia", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Aditya Kumar", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Nima D. Namsa", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Pankaj Barah", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" },
  { name: "Dr. Sunita Kushwah", affiliation: "Dept. of MBBT, Tezpur University, Tezpur, India", role: "Member" }
];

export default function CommitteePage() {
  
  // Reusable card component to keep the code DRY
  const MemberCard = ({ member, showRole = false }: { member: any, showRole?: boolean }) => (
    <motion.div 
      variants={fadeUp}
      {...springInteraction}
      className="group flex items-start sm:items-center gap-3 sm:gap-5 bg-white p-4 sm:p-5 rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgba(0,33,71,0.02)] hover:shadow-[0_8px_30px_rgba(0,33,71,0.06)] cursor-default transition-shadow"
    >
      {/* Avatar */}
      {/* <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shrink-0 flex items-center justify-center bg-gradient-to-br from-primary-container to-primary overflow-hidden relative">
        <span className="font-playfair text-lg sm:text-xl font-bold text-white/30 tracking-widest">
          {getInitials(member.name)}
        </span>
      </div> */}

      {/* Info */}
      <div className="flex flex-col flex-grow">
        {/* Used flex-wrap so the badge falls below the name on 300px widths if the name is too long */}
        <div className="flex flex-wrap justify-between items-start gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
            <h3 className="font-playfair text-base sm:text-xl font-bold text-primary leading-tight">
              {member.name}
            </h3>
            {showRole && member.role && (
                <span className="shrink-0 text-[8px] sm:text-[9px] font-bold tracking-widest text-secondary uppercase bg-secondary/10 px-2 py-1 rounded-full">
                    {member.role}
                </span>
            )}
        </div>
        <p className="font-inter text-[11px] sm:text-sm text-on-surface-variant leading-relaxed">
          {member.affiliation}
        </p>
      </div>
    </motion.div>
  );

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
          Committees
        </motion.h1>
        <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg font-inter text-on-surface-variant max-w-3xl leading-relaxed">
          The dedicated teams and esteemed advisors guiding the vision, planning, and execution of the Mitocondria Cancer Symposium 2026.
        </motion.p>
      </motion.div>

      <div className="max-w-[1280px] mx-auto space-y-12 sm:space-y-20">
        
        {/* Advisory Committee */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="text-xl sm:text-2xl font-playfair font-bold text-primary mb-6 sm:mb-8 border-b border-surface-dim/30 pb-3 sm:pb-4">
                Advisory Committee
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {advisoryCommittee.map((member, idx) => (
                    <MemberCard key={idx} member={member} />
                ))}
            </div>
        </motion.section>

        {/* Local Co-Convenors */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="text-xl sm:text-2xl font-playfair font-bold text-primary mb-6 sm:mb-8 border-b border-surface-dim/30 pb-3 sm:pb-4">
                Local Co-Convenors
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {localCoConvenors.map((member, idx) => (
                    <MemberCard key={idx} member={member} />
                ))}
            </div>
        </motion.section>

        {/* Local Organizing Committee */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="text-xl sm:text-2xl font-playfair font-bold text-primary mb-6 sm:mb-8 border-b border-surface-dim/30 pb-3 sm:pb-4">
                Local Organizing Committee
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {localOrganizingCommittee.map((member, idx) => (
                    <MemberCard key={idx} member={member} showRole={true} />
                ))}
            </div>
        </motion.section>

      </div>
    </div>
  );
}