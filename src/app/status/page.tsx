"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const timelineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const timelineItemVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
  },
};

export default function StatusTrackingPage() {
  const [referenceId, setReferenceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId) return;

    setLoading(true);
    setError(null);
    setStatusData(null);

    try {
      const res = await fetch(`/api/status?ref=${encodeURIComponent(referenceId.trim())}`);
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Unable to connect to the status service. Please try again.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch status.");
      }

      setStatusData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-8 sm:pt-16 md:pt-20 pb-16 sm:pb-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-secondary-container font-inter font-bold tracking-widest text-[10px] sm:text-xs uppercase mb-2 sm:mb-3">
            Delegate Portal
          </p>
          <h1 className="text-2xl sm:text-4xl font-playfair font-bold text-primary mb-3 sm:mb-4">
            Track Application
          </h1>
          <p className="text-xs sm:text-base font-inter text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Enter your 6-character Reference ID to check the real-time status of your registration and payment.
          </p>
        </div>

        {/* Search Box */}
        <form 
          onSubmit={handleSearch} 
          className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-[0_8px_30px_rgba(0,33,71,0.06)] border border-surface-dim/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 mb-8 sm:mb-12 relative z-10"
        >
          <div className="flex items-center flex-grow pl-3 sm:pl-4 pr-2">
            <div className="text-secondary/50 shrink-0 mr-2 sm:mr-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. REF-A7X9K2-26"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
              className="w-full py-2.5 sm:py-3.5 bg-transparent font-mono text-base sm:text-lg text-primary focus:outline-none placeholder:text-surface-dim placeholder:font-inter"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-primary hover:bg-primary-container text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-inter text-xs sm:text-sm font-medium transition-colors disabled:opacity-70 shrink-0"
          >
            {loading ? "Searching..." : "Check Status"}
          </button>
        </form>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              className="bg-[#ffdad6] text-[#93000a] p-3.5 sm:p-4 rounded-xl border border-[#ba1a1a]/20 font-inter text-xs sm:text-sm flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8 justify-center text-center"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Dashboard */}
        <AnimatePresence>
          {statusData && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl sm:rounded-3xl border border-surface-dim/30 shadow-xl overflow-hidden"
            >
              
              {/* Profile Header */}
              <div className="bg-surface-bright border-b border-surface-dim/30 p-5 sm:p-8 flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-6">
                <div className="w-12 h-16 sm:w-16 sm:h-16 bg-primary text-white rounded-2xl sm:rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold font-playfair shrink-0 shadow-md">
                  {statusData.fullName ? statusData.fullName.charAt(0) : "D"}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-playfair font-bold text-primary">{statusData.fullName}</h2>
                  <p className="text-xs sm:text-sm font-inter text-on-surface-variant mt-0.5 sm:mt-1">{statusData.affiliation}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-6 sm:p-10 md:p-12">
                <motion.div 
                  variants={timelineContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative border-l-2 border-surface-dim/50 ml-3 sm:ml-4 space-y-8 sm:space-y-12"
                >
                  
                  {/* Step 1: Submitted */}
                  <motion.div variants={timelineItemVariants} className="relative pl-6 sm:pl-8">
                    <div className="absolute -left-[9px] sm:-left-[11px] top-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 sm:border-4 border-white shadow-sm" />
                    <p className="font-inter text-[10px] sm:text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Step 1</p>
                    <h3 className="font-playfair text-lg sm:text-xl font-bold text-primary">Application Received</h3>
                    <p className="text-xs sm:text-sm font-inter text-on-surface-variant mt-1.5 leading-relaxed">
                      Submitted on {new Date(statusData.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </motion.div>

                  {/* Step 2: Payment Verification */}
                  <motion.div variants={timelineItemVariants} className="relative pl-6 sm:pl-8">
                    <div className={`absolute -left-[9px] sm:-left-[11px] top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 sm:border-4 border-white shadow-sm ${
                      statusData.paymentStatus === "COMPLETED" ? "bg-green-500" : 
                      statusData.paymentStatus === "FAILED" ? "bg-red-500" : "bg-amber-400 animate-pulse ring-4 ring-amber-100"
                    }`} />
                    <p className={`font-inter text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 ${
                       statusData.paymentStatus === "COMPLETED" ? "text-green-600" : 
                       statusData.paymentStatus === "FAILED" ? "text-red-600" : "text-amber-600"
                    }`}>
                      Step 2
                    </p>
                    <h3 className="font-playfair text-lg sm:text-xl font-bold text-primary">
                      {statusData.paymentStatus === "COMPLETED" ? "Payment Verified" : 
                       statusData.paymentStatus === "FAILED" ? "Payment Verification Failed" : "Under Review"}
                    </h3>
                    <p className="text-xs sm:text-sm font-inter text-on-surface-variant mt-1.5 leading-relaxed">
                      {statusData.paymentStatus === "COMPLETED" ? "Your UTR and receipt screenshot have been verified by the organizing committee." : 
                       statusData.paymentStatus === "FAILED" ? "We could not verify your payment. Please check your email for re-upload instructions or contact support." : "The financial desk is currently verifying your payment receipt. This typically takes 24–48 hours."}
                    </p>
                  </motion.div>

                  {/* Step 3: Final Confirmation */}
                  <motion.div 
                    variants={timelineItemVariants} 
                    className={`relative pl-6 sm:pl-8 transition-opacity duration-300 ${statusData.paymentStatus === "COMPLETED" ? "opacity-100" : "opacity-40"}`}
                  >
                    <div className={`absolute -left-[9px] sm:-left-[11px] top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 sm:border-4 border-white shadow-sm ${statusData.paymentStatus === "COMPLETED" ? "bg-green-500" : "bg-surface-dim"}`} />
                    <p className="font-inter text-[10px] sm:text-xs font-bold text-surface-dim uppercase tracking-widest mb-1">Step 3</p>
                    <h3 className="font-playfair text-lg sm:text-xl font-bold text-primary">Registration Confirmed</h3>
                    <p className="text-xs sm:text-sm font-inter text-on-surface-variant mt-1.5 leading-relaxed">
                      {statusData.paymentStatus === "COMPLETED" 
                        ? "Welcome to the symposium! Your official delegate pass has been sent to your email." 
                        : "Awaiting payment verification to issue your final delegate pass."}
                    </p>
                  </motion.div>

                </motion.div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}