"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    
    // Guard against non-JSON (HTML 404/500) error pages
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
    <div className="min-h-screen bg-surface pt-24 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-secondary-container font-inter font-bold tracking-widest text-xs uppercase mb-4">
            Delegate Portal
          </p>
          <h1 className="text-4xl font-playfair font-bold text-primary mb-4">
            Track Application
          </h1>
          <p className="text-on-surface-variant font-inter">
            Enter your 6-character Reference ID to check the real-time status of your registration and payment.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgba(0,33,71,0.06)] border border-surface-dim/30 flex items-center mb-12 relative z-10">
          <div className="pl-6 pr-4 text-secondary/50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            required
            placeholder="e.g. REF-A7X9K2-26"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
            className="flex-grow py-4 bg-transparent font-mono text-lg text-primary focus:outline-none placeholder:text-surface-dim placeholder:font-inter"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-xl font-inter font-medium transition-colors disabled:opacity-70"
          >
            {loading ? "Searching..." : "Check Status"}
          </button>
        </form>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-[#ffdad6] text-[#93000a] p-4 rounded-xl border border-[#ba1a1a]/20 font-inter text-sm flex items-center gap-3 mb-8 text-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Dashboard */}
        <AnimatePresence>
          {statusData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-surface-dim/30 shadow-xl overflow-hidden">
              
              {/* Profile Header */}
              <div className="bg-surface-bright border-b border-surface-dim/30 p-8 flex items-center gap-6">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold font-playfair shrink-0">
                  {statusData.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-primary">{statusData.fullName}</h2>
                  <p className="text-sm font-inter text-on-surface-variant mt-1">{statusData.affiliation}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-8 md:p-12">
                <div className="relative border-l-2 border-surface-dim/50 ml-4 space-y-12">
                  
                  {/* Step 1: Submitted (Always True if they exist) */}
                  <div className="relative pl-8">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                    <p className="font-inter text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Step 1</p>
                    <h3 className="font-playfair text-xl font-bold text-primary">Application Received</h3>
                    <p className="text-sm font-inter text-on-surface-variant mt-2">
                      Submitted on {new Date(statusData.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Step 2: Payment Verification */}
                  <div className="relative pl-8">
                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${
                      statusData.paymentStatus === 'COMPLETED' ? 'bg-green-500' : 
                      statusData.paymentStatus === 'FAILED' ? 'bg-red-500' : 'bg-yellow-400 animate-pulse'
                    }`}></div>
                    <p className={`font-inter text-xs font-bold uppercase tracking-widest mb-1 ${
                       statusData.paymentStatus === 'COMPLETED' ? 'text-green-600' : 
                       statusData.paymentStatus === 'FAILED' ? 'text-red-600' : 'text-yellow-600'
                    }`}>Step 2</p>
                    <h3 className="font-playfair text-xl font-bold text-primary">
                      {statusData.paymentStatus === 'COMPLETED' ? 'Payment Verified' : 
                       statusData.paymentStatus === 'FAILED' ? 'Payment Verification Failed' : 'Under Review'}
                    </h3>
                    <p className="text-sm font-inter text-on-surface-variant mt-2">
                      {statusData.paymentStatus === 'COMPLETED' ? 'Your UTR and screenshot have been successfully vetted by the financial committee.' : 
                       statusData.paymentStatus === 'FAILED' ? 'We could not verify your payment. Please contact support.' : 'The organizing committee is currently reviewing your payment receipt. This usually takes 24-48 hours.'}
                    </p>
                  </div>

                  {/* Step 3: Final Confirmation */}
                  <div className={`relative pl-8 transition-opacity ${statusData.paymentStatus === 'COMPLETED' ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${statusData.paymentStatus === 'COMPLETED' ? 'bg-green-500' : 'bg-surface-dim'}`}></div>
                    <p className="font-inter text-xs font-bold text-surface-dim uppercase tracking-widest mb-1">Step 3</p>
                    <h3 className="font-playfair text-xl font-bold text-primary">Registration Confirmed</h3>
                    <p className="text-sm font-inter text-on-surface-variant mt-2">
                      {statusData.paymentStatus === 'COMPLETED' 
                        ? 'Welcome to the symposium! Your official delegate pass has been sent to your email.' 
                        : 'Awaiting payment verification to issue your final delegate pass.'}
                    </p>
                  </div>

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}