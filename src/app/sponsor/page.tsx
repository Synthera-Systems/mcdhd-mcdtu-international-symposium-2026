"use client";

import { motion, Variants } from "framer-motion";

// Strict interaction physics from your design specs
const springInteraction = { 
  whileTap: { scale: 0.97 }, 
  transition: { type: "spring" as const, stiffness: 320, damping: 22 } 
};

const fadeUp: Variants = { 
  hidden: { opacity: 0, y: 20 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } 
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function SponsorsPage() {
  const sponsorTiers = [
    { 
      id: "Silver", 
      label: "Silver Tier", 
      title: "Advertisement", 
      price: "Rs. 10,000", 
      features: [
        "Advertisement placement in the official Symposium Abstract Book"
      ],
      popular: false 
    },
    { 
      id: "Golden", 
      label: "Golden Tier", 
      title: "Exhibition", 
      price: "Rs. 30,000", 
      features: [
        "Dedicated Exhibition / Stall space at the symposium venue"
      ], 
      popular: false 
    },
    { 
      id: "Platinum", 
      label: "Platinum Tier", 
      title: "Premium Partner", 
      price: "Rs. 90,000", 
      features: [
        "10-Minute Talk/Presentation in the Symposium",
        "Dedicated Exhibition / Stall space",
        "Advertisement placement in the Abstract Book"
      ], 
      popular: true 
    }
  ];

  // Dynamic content for the Custom Option banner
  const customSubject = encodeURIComponent("Custom Sponsorship Inquiry - MitoCan Symposium 2026");
  const customBody = encodeURIComponent(
    "Dear MitoCan Organizing Committee,\n\nWe are interested in discussing a custom sponsorship package for the upcoming MitoCan Symposium 2026.\n\nPlease let us know when we can connect to discuss potential partnership opportunities.\n\nBest regards,\n[Your Name/Organization]"
  );

  return (
    <div className="w-full min-h-screen bg-surface pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-24 flex flex-col items-center">
      
      {/* Header Section */}
      <motion.div 
        className="max-w-[1280px] mx-auto mb-10 sm:mb-16 text-center flex flex-col items-center" 
        initial="hidden" 
        animate="visible" 
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp} className="w-10 sm:w-12 h-1 bg-secondary mb-4 sm:mb-6" />
        <motion.p variants={fadeUp} className="text-secondary-container font-inter font-bold tracking-widest text-[10px] sm:text-xs uppercase mb-3 sm:mb-4">
          Partner With Us
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-primary mb-4 sm:mb-6 max-w-4xl leading-tight">
          Sponsored Presentation & Advertisement
        </motion.h1>
        <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg font-inter text-on-surface-variant max-w-2xl mx-auto leading-relaxed px-2">
          Showcase your organization to a global consortium of leading minds in oncology, mitochondrial dynamics, and cellular therapeutics.
        </motion.p>
      </motion.div>

      {/* Pricing Grid */}
      <motion.div 
        className="max-w-[1100px] w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16" 
        initial="hidden" 
        animate="visible" 
        variants={staggerContainer}
      >
        {sponsorTiers.map((tier) => {
          // Dynamically generate the email subject and body for each tier
          const tierSubject = encodeURIComponent(`Sponsorship Inquiry: ${tier.label} - MitoCan 2026`);
          const tierBody = encodeURIComponent(
            `Dear MitoCan Organizing Committee,\n\nWe are interested in partnering with you for the MitoCan Symposium 2026.\n\nWe would like to proceed with the ${tier.label} (${tier.title}) priced at ${tier.price}.\n\nPlease provide us with the next steps regarding payment and required materials.\n\nBest regards,\n[Your Name/Organization]`
          );

          return (
            <motion.div 
              key={tier.id}
              variants={fadeUp}
              // Added "group" here to control the button state on card hover
              className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-surface-dim/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,33,71,0.03)] flex flex-col h-full hover:border-secondary hover:ring-2 hover:ring-secondary hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,33,71,0.08)]"
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white font-inter text-[9px] sm:text-[10px] font-bold uppercase tracking-widest py-1 px-3 sm:px-4 rounded-full shadow-sm whitespace-nowrap z-10">
                  Premium Value
                </div>
              )}
              
              <p className="font-inter text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center mb-1.5 sm:mb-2 mt-2">
                {tier.label}
              </p>
              <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-primary text-center mb-4 sm:mb-6">
                {tier.title}
              </h3>
              
              <div className="text-center mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-surface-dim/30">
                <span className="font-inter text-2xl sm:text-3xl font-bold text-primary tracking-tight">{tier.price}</span>
              </div>
              
              <ul className="space-y-4 sm:space-y-5 mb-6 sm:mb-8 flex-grow">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3 font-inter text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-container shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.a 
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=mitocansypm2026@gmail.com&su=${tierSubject}&body=${tierBody}`}
                target="_blank" 
                rel="noopener noreferrer"
                {...springInteraction}
                // Button now defaults to the bright outline, but fills in when the parent card is hovered
                className="w-full py-3 sm:py-3.5 rounded-xl font-inter flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm font-medium transition-colors bg-surface-bright text-primary border border-surface-dim/50 group-hover:bg-secondary group-hover:text-white group-hover:border-transparent"
              >
                Contact to Sponsor
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </motion.a>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Additional Information Banner */}
      <motion.div 
        variants={fadeUp} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        className="max-w-[1100px] w-full mx-auto bg-secondary/5 border border-secondary/20 rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-sm text-center md:text-left"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center border border-secondary/20 shrink-0 shadow-sm">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <h3 className="font-playfair text-lg sm:text-xl font-bold text-primary mb-1.5 sm:mb-1">Custom Sponsorship Packages</h3>
            <p className="font-inter text-xs sm:text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Looking for a tailored presence at the symposium? We offer flexible partnership options to match your organization's specific outreach goals.
            </p>
          </div>
        </div>
        <a 
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=mitocansypm2026@gmail.com&su=${customSubject}&body=${customBody}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full md:w-auto justify-center bg-white border border-surface-dim/50 text-primary hover:text-secondary hover:border-secondary px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-inter font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 group whitespace-normal sm:whitespace-nowrap"
        >
          Discuss Custom Options
        </a>
      </motion.div>

    </div>
  );
}