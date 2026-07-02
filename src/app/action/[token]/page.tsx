"use client";
export const runtime = 'edge';
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function ActionRequiredPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [delegateData, setDelegateData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/action?token=${token}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        setDelegateData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [token]);

  useEffect(() => {
    if (success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      const timer = setTimeout(() => {
        router.push("/");
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [success, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File exceeds 2MB limit. Please compress and try again.");
      setReceiptFile(null);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file format. Only JPG, PNG, WEBP, or PDF are allowed.");
      setReceiptFile(null);
      return;
    }

    setReceiptFile(file);
  };

  const handleResubmit = async () => {
    if (!receiptFile || !delegateData) return;
    setUploading(true);
    setError(null);

    try {
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${Date.now()}-RETRY-${delegateData.utrNumber}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptFile);

      if (uploadError) throw new Error("Failed to upload the new receipt.");

      const { data: publicUrlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      const res = await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newScreenshotUrl: publicUrlData.publicUrl
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setUploading(false);
    } 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  if (error && !delegateData) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md text-center border border-surface-dim/30">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h2 className="font-playfair text-2xl font-bold text-primary mb-3">Link Expired</h2>
          <p className="font-inter text-sm text-on-surface-variant">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full min-h-[85vh] flex items-center justify-center bg-surface px-6 py-12">
        <motion.div 
          initial={{ scale: 0.85, opacity: 0, y: 30 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          className="bg-white p-10 md:p-12 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,33,71,0.1)] max-w-lg w-full text-center border border-surface-dim/30 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <h2 className="font-playfair text-3xl font-bold text-primary mb-4">Receipt Updated!</h2>
          <p className="font-inter text-on-surface-variant mb-8 leading-relaxed">
            Your new receipt has been successfully uploaded. Our automated system is reviewing it now, and we will email you with the updated status shortly.
          </p>
          
          <div className="bg-surface-bright px-6 py-4 rounded-xl border border-surface-dim/50 mb-6">
            <p className="font-inter text-xs text-on-surface-variant uppercase tracking-widest mb-1">Reference ID</p>
            <p className="font-mono text-xl font-bold text-primary">{delegateData.referenceId}</p>
          </div>

          <p className="text-xs font-inter text-secondary mt-6 flex items-center justify-center italic gap-2 font-medium">
            Redirecting to homepage in {countdown} seconds...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-24 px-6 md:px-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        
        <div className="text-center mb-12">
          <p className="text-[#e11d48] font-inter font-bold tracking-widest text-xs uppercase mb-4">Action Required</p>
          <h1 className="text-4xl font-playfair font-bold text-primary mb-4">Verification Failed</h1>
          <p className="text-on-surface-variant font-inter">Please upload a clearer image of your bank transfer receipt.</p>
        </div>

        <div className="bg-white rounded-3xl border border-surface-dim/30 shadow-xl overflow-hidden">
          
          <div className="bg-[#fff1f2] border-b border-[#ffe4e6] p-8">
            <h3 className="font-inter text-xs font-bold uppercase tracking-widest text-[#e11d48] mb-2">Issue Detected</h3>
            <p className="font-inter text-[#9f1239] font-medium leading-relaxed">{delegateData.reason}</p>
          </div>

          <div className="p-8 md:p-12 space-y-8">
            
            <div className="bg-surface-bright rounded-xl p-6 border border-surface-dim/50">
               <p className="font-inter text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1">Target UTR Number</p>
               <p className="font-mono text-xl text-primary font-bold tracking-widest">{delegateData.utrNumber}</p>
               <p className="font-inter text-xs text-secondary-container mt-2">Ensure the new image clearly displays this exact 12-digit number.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg font-inter text-sm border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/jpeg,image/png,image/webp,application/pdf" />
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer group ${receiptFile ? 'border-secondary bg-secondary/5' : 'border-surface-dim/80 hover:border-secondary/50 bg-surface-bright/50'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${receiptFile ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white'}`}>
                  {receiptFile ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  )}
                </div>
                <div className="text-center font-inter px-2">
                  <p className={`text-base font-bold mb-1 truncate max-w-[250px] ${receiptFile ? 'text-secondary' : 'text-primary'}`}>
                    {receiptFile ? receiptFile.name : 'Select new screenshot'}
                  </p>
                  <p className="text-xs text-on-surface-variant tracking-widest uppercase">
                    {receiptFile ? `${(receiptFile.size / 1024 / 1024).toFixed(2)} MB` : 'JPG, PNG, PDF (Max 2MB)'}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleResubmit}
              disabled={uploading || !receiptFile}
              className="w-full bg-primary text-white font-inter font-medium text-lg py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary-container transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Verifying & Uploading...
                </span>
              ) : "Submit New Receipt"}
            </button>

          </div>
        </div>
      </motion.div>
    </div>
  );
}