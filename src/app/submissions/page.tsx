"use client";

import { motion, Variants } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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

export default function SubmissionsPage() {
  // --- Form State ---
  const [formData, setFormData] = useState({ 
    title: "", 
    authors: "", 
    presenterEmail: "", // NEW FIELD added to state
    type: "Oral Presentation" 
  });
  const [abstractFile, setAbstractFile] = useState<File | null>(null);
  
  // --- UI State ---
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to top on success
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;

    // Validation: Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10MB limit. Please compress and try again.");
      setAbstractFile(null);
      return;
    }

    // Validation: PDF or Word Docs
    const validTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setError("Invalid file format. Only PDF, DOC, or DOCX are allowed.");
      setAbstractFile(null);
      return;
    }

    setAbstractFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Added presenterEmail to required validation
    if (!formData.title || !formData.authors || !formData.presenterEmail || !abstractFile) {
      setError("Please fill all required fields and upload your abstract document.");
      return;
    }

    try {
      // Step 1: Upload to Supabase Storage
      setLoadingStep("Uploading Document...");
      const fileExt = abstractFile.name.split('.').pop();
      const fileName = `${Date.now()}-ABSTRACT.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('abstracts')
        .upload(fileName, abstractFile);

      if (uploadError) throw new Error("Failed to upload document. Please try again.");

      const { data: publicUrlData } = supabase.storage
        .from('abstracts')
        .getPublicUrl(fileName);

      // Step 2: Save to Database
      setLoadingStep("Securing Submission...");
      const submitRes = await fetch("/api/submit_abstract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fileUrl: publicUrlData.publicUrl,
        })
      });

      const submitData = await submitRes.json();
      
      if (!submitRes.ok) {
        throw new Error(submitData.error || "Database submission failed.");
      }

      setLoadingStep(null);
      setSuccessRef(submitData.referenceId);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setLoadingStep(null);
    }
  };

  // --- SUCCESS SCREEN ---
  if (successRef) {
    return (
      <div className="w-full min-h-[85vh] flex items-center justify-center bg-surface px-6 py-12">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-10 md:p-12 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,33,71,0.1)] max-w-lg w-full text-center border border-surface-dim/30 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-green-100"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <h2 className="font-playfair text-3xl font-bold text-primary mb-4">Abstract Submitted!</h2>
          <p className="font-inter text-on-surface-variant mb-8 leading-relaxed">
            Your research has been successfully submitted to the scientific committee. It is currently queued for the triple-blind review process.
          </p>
          
          <div className="bg-surface-bright p-6 rounded-2xl border border-surface-dim/50 mb-10 relative">
            <p className="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Abstract ID</p>
            <div className="flex items-center justify-center gap-3">
              <p className="font-mono text-3xl font-bold text-secondary-container tracking-wider">{successRef}</p>
              
              <button 
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-white border border-surface-dim/50 text-secondary hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                title="Copy ID"
              >
                {copied ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
            
            {copied && (
              <motion.p 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-inter font-bold uppercase tracking-widest text-green-600"
              >
                Copied to clipboard
              </motion.p>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <Link href="/registration" className="w-full max-w-sm bg-primary text-white font-inter font-medium py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm">
              Proceed to Registration
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm font-inter text-secondary hover:text-secondary-container hover:underline transition-colors font-medium flex items-center justify-center gap-2"
            >
              Submit another abstract
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- MAIN SUBMISSION SCREEN ---
  return (
    <div className="w-full min-h-screen bg-surface pt-12 pb-24 px-6 md:px-12 lg:px-24">
      
      {/* Header Section */}
      <motion.div 
        className="max-w-[1280px] mx-auto mb-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.p variants={fadeUp} className="text-secondary-container font-inter font-bold tracking-widest text-xs uppercase mb-4">
          Scientific Inquiry
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-6">
          Call for Abstracts
        </motion.h1>
        <motion.p variants={fadeUp} className="text-lg font-inter text-on-surface-variant max-w-2xl leading-relaxed">
          Join the forefront of mitochondrial research. We invite original contributions on molecular mechanisms, cellular dynamics, and therapeutic interventions in human disease.
        </motion.p>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Left Column: Rules & Deadlines */}
        <div className="lg:col-span-5 space-y-8">
          
          <motion.div variants={fadeUp} className="bg-white p-8 rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgba(0,33,71,0.03)]">
            <h3 className="font-playfair text-2xl font-bold text-primary mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              Submission Rules
            </h3>
            <ul className="space-y-5">
              {[
                "Abstracts must be submitted in English and should not exceed 350 words in total.",
                "The study must represent original research not previously published in a major journal.",
                "All authors must have consented to the submission and presentation of the data.",
                "Scientific notation should be maintained using standard nomenclature."
              ].map((rule, idx) => (
                <li key={idx} className="flex items-start gap-4 font-inter text-sm text-on-surface-variant leading-relaxed">
                  <svg className="w-5 h-5 text-secondary-container shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-primary-container p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 opacity-10">
              <svg className="w-48 h-48 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div className="relative z-10">
              <h3 className="font-playfair text-2xl font-bold text-white mb-2">Key Deadlines</h3>
              <p className="font-inter text-inverse-primary text-sm mb-8">Mark your calendars for clinical review phases.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="font-inter text-sm font-medium text-white">Submission Deadline</span>
                  <span className="font-inter text-sm font-bold text-secondary-container">Oct 15, 2026</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-inter text-sm font-medium text-white">Notification Date</span>
                  <span className="font-inter text-sm font-bold text-white">Nov 01, 2026</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Form Container */}
        <motion.div variants={fadeUp} className="lg:col-span-7">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-surface-dim/30 shadow-[0_8px_30px_rgba(0,33,71,0.06)]">
            <h2 className="font-playfair text-3xl font-bold text-primary mb-8">Submit Your Abstract</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#ffdad6] text-[#93000a] p-4 rounded-lg border border-[#ba1a1a]/20 font-inter text-sm flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="font-inter text-xs font-bold text-on-surface-variant uppercase tracking-wide">Abstract Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter the full scientific title of your abstract"
                  className="w-full bg-surface-bright border border-surface-dim/50 rounded-lg px-4 py-3 font-inter text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-inter text-xs font-bold text-on-surface-variant uppercase tracking-wide">Author Names</label>
                  <input 
                    required
                    type="text" 
                    value={formData.authors}
                    onChange={(e) => setFormData({...formData, authors: e.target.value})}
                    placeholder="John Doe, Jane Smith, et al."
                    className="w-full bg-surface-bright border border-surface-dim/50 rounded-lg px-4 py-3 font-inter text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                  />
                </div>
                
                {/* NEW FIELD: Presenter Email */}
                <div className="space-y-2">
                  <label className="font-inter text-xs font-bold text-on-surface-variant uppercase tracking-wide">Presenter Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.presenterEmail}
                    onChange={(e) => setFormData({...formData, presenterEmail: e.target.value})}
                    placeholder="email@university.edu"
                    className="w-full bg-surface-bright border border-surface-dim/50 rounded-lg px-4 py-3 font-inter text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                  />
                  <p className="font-inter text-[11px] text-on-surface-variant mt-1">Please use this exact email when you register.</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="font-inter text-xs font-bold text-on-surface-variant uppercase tracking-wide">Presentation Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-surface-bright border border-surface-dim/50 rounded-lg px-4 py-3 font-inter text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors appearance-none"
                >
                  <option value="Oral Presentation">Oral Presentation</option>
                  <option value="Poster Presentation">Poster Presentation</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="font-inter text-xs font-bold text-on-surface-variant uppercase tracking-wide">Abstract Document</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer group ${abstractFile ? 'border-secondary bg-secondary/5' : 'border-surface-dim/80 hover:border-secondary/50 bg-surface-bright/50'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${abstractFile ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white'}`}>
                    {abstractFile ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    )}
                  </div>
                  <div className="text-center font-inter px-2">
                    <p className={`text-sm font-medium mb-1 truncate max-w-[250px] ${abstractFile ? 'text-secondary font-bold' : 'text-primary'}`}>
                      {abstractFile ? abstractFile.name : <><span className="font-bold text-secondary">Click to upload</span> or drag and drop</>}
                    </p>
                    <p className="text-xs text-on-surface-variant tracking-widest uppercase">
                      {abstractFile ? `${(abstractFile.size / 1024 / 1024).toFixed(2)} MB` : 'Word or PDF (Max 10MB)'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <motion.button 
                  disabled={!!loadingStep}
                  {...springInteraction}
                  className="w-full bg-primary text-white font-inter font-medium text-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingStep ? (
                    <span className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      {loadingStep}
                    </span>
                  ) : (
                    <>
                      Complete Submission
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </motion.button>
                <p className="text-center font-inter text-xs text-on-surface-variant mt-4">
                  You will receive a confirmation email within 24 hours of submission.
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Feature Highlights Footer */}
      <motion.div 
        className="max-w-[1280px] mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-surface-dim/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {[
          { title: "Peer Review", desc: "Triple-blind scientific review committee for all oral candidates.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
          { title: "Global Reach", desc: "Top-selected abstracts will be published in the Symposium proceedings.", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
          { title: "Scholarships", desc: "Travel grants available for top 10 outstanding student submissions.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
        ].map((feature, idx) => (
          <motion.div key={idx} variants={fadeUp} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} /></svg>
            </div>
            <div>
              <h4 className="font-inter font-bold text-sm text-primary mb-1">{feature.title}</h4>
              <p className="font-inter text-xs text-on-surface-variant leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}