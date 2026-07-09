"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import imageCompression from "browser-image-compression";

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

export default function RegistrationPage() {
  // --- Form State ---
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    fullName: "", 
    affiliation: "", 
    email: "", 
    utrNumber: "",
    participationType: "GENERAL_ATTENDEE",
    linkedAbstractId: "",
    studentLevel: ""
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  
  // --- UI State ---
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const pricingTiers = [
    { 
      id: "Student", 
      label: "Scholars", 
      title: "Student", 
      price: "Rs. 3000", 
      features: ["Eligibility for oral/poster presentations", "Access to peer-reviewed scientific sessions", "Official participation validation"] 
    },
    { 
      id: "Faculty", 
      label: "Academia", 
      title: "Faculty", 
      price: "Rs. 5000", 
      features: ["Eligibility for oral/poster presentations", "Access to peer-reviewed scientific sessions", "Official participation validation"], 
      popular: true 
    },
    { 
      id: "Industry", 
      label: "Professional", 
      title: "Industry", 
      price: "Rs. 10000", 
      features: ["Eligibility for oral/poster presentations", "Access to peer-reviewed scientific sessions", "Official participation validation"] 
    },
    { 
      id: "Foreign", 
      label: "International", 
      title: "Foreign", 
      price: "Rs. 30000", 
      features: ["Eligibility for oral/poster presentations", "Access to peer-reviewed scientific sessions", "Official participation validation"] 
    }
  ];

  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiQrUrl: ""
  });

  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setBankDetails({
            accountName: data.accountName,
            bankName: data.bankName,
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
            upiQrUrl: data.upiQrUrl
          });
        }
      })
      .catch((err) => console.error("Error fetching payment settings:", err))
      .finally(() => setLoadingSettings(false));
  }, []);
  
  // Auto-scroll to top when the success screen renders
  useEffect(() => {
    if (successRef) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [successRef]);

  const handleCopy = () => {
    if (successRef) {
      navigator.clipboard.writeText(successRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500); 
    }
  };

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      setError("File exceeds 1MB limit. Please compress and try again.");
      setReceiptFile(null);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file format. Only JPG, PNG, WEBP, or PDF are allowed.");
      setReceiptFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      try {
        const options = {
          maxSizeMB: 0.2, // Targets ~200KB max size
          maxWidthOrHeight: 1280, // Resizes large phone dimensions safely
          useWebWorker: true
        };
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], file.name, { type: file.type });
        setReceiptFile(compressedFile);
      } catch (compressErr) {
        console.error("Compression skipped, using original:", compressErr);
        setReceiptFile(file); 
      }
    } else {
      setReceiptFile(file);
    }

  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName || !formData.email || !formData.utrNumber || !receiptFile || !selectedTier) {
      setError("Please fill all required fields and upload a payment receipt.");
      return;
    }

    if (selectedTier === "Student" && !formData.studentLevel) {
      setError("Please select your academic level (MSc, PhD, or RA/PostDoc).");
      return;
    }

    try {
      setLoadingStep("Securing Application...");
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${Date.now()}-${formData.utrNumber}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptFile);

        if (uploadError) {
          if (uploadError.message.includes("quota") || uploadError.message.includes("capacity") || uploadError.status === 413) {
            throw new Error("SERVER_STORAGE_MAXED");
          }
          throw new Error("Failed to upload receipt. Please try again.");
        }

      const { data: publicUrlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      const dbCategory = selectedTier === "Student" 
        ? `Student - ${formData.studentLevel}` 
        : selectedTier;

      const registerRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category: dbCategory,
          screenshotUrl: publicUrlData.publicUrl,
        })
      });

      const registerData = await registerRes.json();
      
      if (!registerRes.ok) {
        throw new Error(registerData.error || "Database registration failed.");
      }

      setLoadingStep(null);
      setSuccessRef(registerData.referenceId);

    } catch (err: any) {
      console.error(err);
      if (err.message === "SERVER_STORAGE_MAXED") {
        setError("Our primary storage is temporarily at maximum capacity. To secure your submission timeline, you can submit this text form safely right now, and our administrative desk will follow up via email to collect your visual screenshot manual receipt verification.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
      setLoadingStep(null);
    }
  };

  // --- SUCCESS SCREEN ---
  if (successRef) {
    return (
      <div className="w-full min-h-[100svh] md:min-h-[85vh] flex items-center justify-center bg-surface px-4 sm:px-6 py-12">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,33,71,0.1)] max-w-lg w-full text-center border border-surface-dim/30 relative overflow-hidden"
        >
          
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-sm border border-green-100"
          >
            <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">Registration Secured!</h2>
          <p className="font-inter text-sm sm:text-base text-on-surface-variant mb-6 sm:mb-8 leading-relaxed px-2">
            Your details are saved safely. Our system is currently verifying your payment receipt. You will receive an email shortly.
          </p>
          
          <div className="bg-surface-bright p-5 sm:p-6 rounded-2xl border border-surface-dim/50 mb-8 sm:mb-10 relative">
            <p className="font-inter text-[10px] sm:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 sm:mb-3">Reference ID</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <p className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-secondary-container tracking-wider break-all">{successRef}</p>
              
              <button 
                onClick={handleCopy}
                className="p-2 sm:p-2.5 rounded-xl bg-white border border-surface-dim/50 text-secondary hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm active:scale-95 shrink-0"
                aria-label="Copy Reference ID"
                title="Copy ID"
              >
                {copied ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
            
            <AnimatePresence>
              {copied && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] font-inter font-bold uppercase tracking-widest text-green-600 whitespace-nowrap"
                >
                  Copied to clipboard
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs sm:text-sm font-inter text-secondary hover:text-secondary-container hover:underline transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Submit another registration
          </button>
        </motion.div>
      </div>
    );
  }

  // --- MAIN REGISTRATION SCREEN ---
  return (
    <div className="w-full min-h-screen bg-surface pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-24">
      
      <motion.div className="max-w-[1280px] mx-auto mb-10 sm:mb-16 text-center" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.p variants={fadeUp} className="text-secondary-container font-inter font-bold tracking-widest text-[10px] sm:text-xs uppercase mb-3 sm:mb-4">
          Join the Scientific Dialogue
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-primary mb-4 sm:mb-6 leading-tight">
          Delegate Registration
        </motion.h1>
        <motion.p variants={fadeUp} className="text-sm sm:text-base md:text-lg font-inter text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Secure your place at the International Symposium on Mitochondria, Cancer and Human Diseases. Access world-class research and institutional excellence.
        </motion.p>
      </motion.div>

      <motion.div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16" initial="hidden" animate="visible" variants={staggerContainer}>
        {pricingTiers.map((tier) => (
          <motion.div 
            key={tier.id}
            variants={fadeUp}
            onClick={() => handleTierSelect(tier.id)}
            className={`relative cursor-pointer bg-white rounded-2xl p-6 sm:p-8 border transition-all duration-300 shadow-[0_4px_20px_rgba(0,33,71,0.03)] flex flex-col ${
              selectedTier === tier.id 
                ? "border-secondary ring-2 ring-secondary scale-[1.02] shadow-[0_8px_30px_rgba(0,33,71,0.08)]" 
                : "border-surface-dim/40 hover:border-secondary/30"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white font-inter text-[9px] sm:text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full whitespace-nowrap">
                Most Popular
              </div>
            )}
            <p className="font-inter text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center mb-1">
              {tier.label}
            </p>
            <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-primary text-center mb-3 sm:mb-4">
              {tier.title}
            </h3>
            <div className="text-center mb-6 sm:mb-8">
              <span className="font-inter text-2xl sm:text-3xl font-bold text-primary">{tier.price}</span>
            </div>
            
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 sm:gap-3 font-inter text-xs sm:text-sm text-on-surface-variant">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-container shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {feature}
                </li>
              ))}
            </ul>

            <motion.button 
              {...springInteraction}
              className={`w-full py-2.5 sm:py-3 rounded-xl font-inter cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                selectedTier === tier.id 
                  ? "bg-secondary text-white" 
                  : "bg-surface-bright text-primary border border-surface-dim/50 hover:bg-surface-dim/20"
              }`}
            >
              {selectedTier === tier.id ? "Selected" : "Select Tier"}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-[1000px] mx-auto mb-12 sm:mb-16 bg-secondary/5 border border-secondary/20 rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-sm text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center border border-secondary/20 shrink-0 shadow-sm">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <div>
            <h3 className="font-playfair text-lg sm:text-xl font-bold text-primary mb-1">Already registered?</h3>
            <p className="font-inter text-xs sm:text-sm text-on-surface-variant">Check your payment approval status or track your application.</p>
          </div>
        </div>
        <Link href="/status" className="w-full md:w-auto justify-center bg-white border border-surface-dim/50 text-primary hover:text-secondary hover:border-secondary px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-inter font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 group shrink-0">
          Track Application
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </motion.div>

      <AnimatePresence>
        {selectedTier && (
          <motion.div 
            ref={formRef}
            initial={{ opacity: 0, height: 0, marginTop: 0 }} 
            animate={{ opacity: 1, height: "auto", marginTop: 32 }} 
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="max-w-[1000px] mx-auto overflow-hidden sm:mt-12"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-surface-dim/30 shadow-[0_8px_30px_rgba(0,33,71,0.06)]">
              <div className="bg-primary p-6 sm:p-8 text-center">
                <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Attendee Details</h2>
                <p className="font-inter text-xs sm:text-sm text-inverse-primary px-2">Please fill in the details exactly as they should appear on certificates</p>
              </div>

              <form className="p-5 sm:p-8 md:p-12 space-y-6 sm:space-y-8" onSubmit={handleRegistration}>
                
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#ffdad6] text-[#93000a] p-3 sm:p-4 rounded-lg border border-[#ba1a1a]/20 font-inter text-xs sm:text-sm flex items-start sm:items-center gap-2 sm:gap-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="font-inter text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide">Full Name</label>
                    <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Dr./Mr./Ms. John Doe" className="w-full bg-surface-bright border border-surface-dim/50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 font-inter text-xs sm:text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="font-inter text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide">Affiliation / University</label>
                    <input required type="text" value={formData.affiliation} onChange={e => setFormData({...formData, affiliation: e.target.value})} placeholder="Harvard Medical School" className="w-full bg-surface-bright border border-surface-dim/50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 font-inter text-xs sm:text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="font-inter text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide">Email Address</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@university.edu" className="w-full bg-surface-bright border border-surface-dim/50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 font-inter text-xs sm:text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" />
                  </div>
                </div>

                <hr className="border-surface-dim/30" />

                {/* --- NEW: Student Academic Level Section --- */}
                <AnimatePresence mode="wait">
                  {selectedTier === "Student" && (
                    <motion.div 
                      key="student-level-selection"
                      initial={{ opacity: 0, height: 0, y: -10 }} 
                      animate={{ opacity: 1, height: "auto", y: 0 }} 
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-8">
                        <label className="font-inter text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                          Academic Level
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                          {[
                            { id: "MSc", label: "MSc Student" },
                            { id: "PhD", label: "PhD Scholar" },
                            { id: "RA/PostDoc", label: "RA / PostDoc" }
                          ].map((level) => (
                            <div 
                              key={level.id}
                              onClick={() => setFormData({...formData, studentLevel: level.id})}
                              className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                                formData.studentLevel === level.id 
                                  ? "border-secondary bg-secondary/5 ring-1 ring-secondary shadow-sm" 
                                  : "border-surface-dim/50 hover:border-secondary/30 bg-surface-bright"
                              }`}
                            >
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border flex items-center justify-center shrink-0 ${formData.studentLevel === level.id ? "border-secondary" : "border-surface-dim"}`}>
                                  {formData.studentLevel === level.id && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary" />}
                                </div>
                                <p className={`font-inter text-xs sm:text-sm font-bold ${formData.studentLevel === level.id ? "text-secondary" : "text-primary"}`}>{level.label}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <hr className="border-surface-dim/30" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* --- Replaces the Participation Role selection block in registration/page.tsx --- */}
                <div className="space-y-4 text-left">
                  <label className="font-inter text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide block">
                    Participation Role
                  </label>
                  
                  {/* Elegant Informational Workflow Card */}
                  <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-sm">
                    <div className="bg-white p-2 rounded-xl shadow-xs shrink-0 mt-0.5 border border-secondary/10 text-secondary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="font-inter text-xs sm:text-lg font-bold text-primary">
                        Registering as a Symposium Delegate
                      </p>
                      <p className="font-inter text-[11px] sm:text-sm text-secondary leading-relaxed">
                        All delegates register initially as a General Attendee. Upon completing your payment upload and securing this form, you will be issued a unique <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-secondary/25 text-sm">Reference ID</span>.
                      </p>
                      <p className="font-inter text-[11px] sm:text-sm text-secondary leading-relaxed pt-1">
                        Want to present a Poster or Oral Presentation?Once you get your Reference ID, head directly over to the <Link href="/submissions" className="underline font-bold text-secondary hover:text-secondary-container transition-colors">Submissions tab</Link> to upload your abstract and link it to your profile.
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-surface-dim/30" />

                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-6 sm:mb-8">
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">Bank Details</h3>
                <div className="bg-surface-bright rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-surface-dim/50 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                    <div className="w-full space-y-4 sm:space-y-6 text-left flex-grow">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {loadingSettings ? (
                        <>
                          <div className="animate-pulse space-y-2"><div className="h-3 w-20 bg-surface-dim/60 rounded" /><div className="h-5 w-40 bg-surface-dim rounded animate-pulse" /></div>
                          <div className="animate-pulse space-y-2"><div className="h-3 w-20 bg-surface-dim/60 rounded" /><div className="h-5 w-40 bg-surface-dim rounded animate-pulse" /></div>
                          <div className="animate-pulse space-y-2"><div className="h-3 w-25 bg-surface-dim/60 rounded" /><div className="h-6 w-48 bg-surface-dim rounded animate-pulse" /></div>
                          <div className="animate-pulse space-y-2"><div className="h-3 w-20 bg-surface-dim/60 rounded" /><div className="h-6 w-32 bg-surface-dim rounded animate-pulse" /></div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="font-inter text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Account Name</p>
                            <p className="font-inter text-sm sm:text-lg text-primary font-medium">{bankDetails.accountName}</p>
                          </div>
                          <div>
                            <p className="font-inter text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Bank Name</p>
                            <p className="font-inter text-sm sm:text-lg text-primary font-medium">{bankDetails.bankName}</p>
                          </div>
                          <div>
                            <p className="font-inter text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Account Number</p>
                            <p className="font-inter text-base sm:text-xl text-primary font-bold font-mono tracking-wider">{bankDetails.accountNumber}</p>
                          </div>
                          <div>
                            <p className="font-inter text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">IFSC Code</p>
                            <p className="font-inter text-base sm:text-xl text-primary font-bold font-mono tracking-wider">{bankDetails.ifscCode}</p>
                          </div>
                        </>
                      )}
                      </div>
                    </div>

                    {/* UPI QR Wrapper Section */}
                    <div className="w-full md:w-auto flex flex-col items-center gap-2 sm:gap-3 pt-6 md:pt-0 md:pl-8 border-t md:border-t-0 md:border-l border-surface-dim/50 shrink-0">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-xl shadow-md border border-surface-dim/30 p-2 flex items-center justify-center relative overflow-hidden">
                      {loadingSettings ? (
                        <div className="absolute inset-0 bg-surface-dim animate-pulse m-2 rounded" />
                      ) : bankDetails.upiQrUrl ? (
                        <img src={bankDetails.upiQrUrl} alt="UPI Payment QR" className="w-full h-full object-contain" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary m-1.5 sm:m-2 rounded flex items-center justify-center">
                          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                        </div>
                      )}
                      </div>
                      <p className="font-inter text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Scan for UPI Payment</p>
                    </div>
                </div>
              </motion.div>

                <div>
                   <h3 className="font-playfair text-lg sm:text-xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                     <svg className="w-5 h-5 sm:w-6 sm:h-6 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                     Payment Verification
                   </h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
                      <div className="space-y-1.5 sm:space-y-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/jpeg,image/png,image/webp,application/pdf" />
                        <div 
                          onClick={() => fileInputRef.current?.click()} 
                          className={`w-full border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center gap-2 sm:gap-3 transition-colors cursor-pointer group ${receiptFile ? 'border-secondary bg-secondary/5' : 'border-surface-dim/80 hover:border-secondary/50 bg-surface-bright/50'}`}
                        >
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${receiptFile ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white'}`}>
                            {receiptFile ? (
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            )}
                          </div>
                          <div className="text-center font-inter px-2 w-full">
                            <p className={`text-xs sm:text-sm font-bold mb-1 truncate w-full ${receiptFile ? 'text-secondary' : 'text-primary'}`}>
                              {receiptFile ? receiptFile.name : 'Upload Payment Screenshot'}
                            </p>
                            <p className="text-[10px] sm:text-xs text-on-surface-variant tracking-widest uppercase">
                              {receiptFile ? `${(receiptFile.size / 1024 / 1024).toFixed(2)} MB` : 'UPI / Bank Transfer Receipt'}
                            </p>
                          </div>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-on-surface-variant italic px-1">Accepted formats: JPG, PNG, PDF. Max size 2MB.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <label className="font-inter text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wide">12-Digit UTR Number</label>
                          <input 
                            required
                            type="text" 
                            maxLength={12}
                            value={formData.utrNumber}
                            onChange={e => setFormData({...formData, utrNumber: e.target.value})}
                            placeholder="0000 0000 0000" 
                            className="w-full bg-surface-bright border border-surface-dim/50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 font-inter text-xs sm:text-sm text-primary tracking-widest sm:tracking-[0.2em] focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" 
                          />
                        </div>
                        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                           <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           <p className="font-inter text-[10px] sm:text-xs text-secondary-container leading-relaxed">
                             Ensure the UTR matches the screenshot for instant automated verification.
                           </p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="pt-4 sm:pt-6">
                  <motion.button 
                    disabled={!!loadingStep}
                    {...springInteraction}
                    className="w-full bg-primary text-white font-inter font-medium text-sm sm:text-lg py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 sm:gap-3 hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingStep ? (
                      <span className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {loadingStep}
                      </span>
                    ) : "Complete Registration"}
                  </motion.button>
                  <p className="text-center font-inter text-[10px] sm:text-xs text-on-surface-variant mt-3 sm:mt-4">
                    By clicking, you agree to our Terms & Data Processing Policy for scientific symposiums.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* {selectedTier && (
        
      )} */}

    </div>
  );
}