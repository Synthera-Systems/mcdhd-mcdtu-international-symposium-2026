// src/app/action/[token]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import imageCompression from "browser-image-compression";

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File exceeds 2MB limit. Please compress and try again.");
      setReceiptFile(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file format. Only JPG, PNG, WEBP, or PDF are allowed.");
      setReceiptFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      try {
        const options = { maxSizeMB: 0.4, maxWidthOrHeight: 1440, useWebWorker: true };
        const compressedBlob = await imageCompression(file, options);
        const optimizedFile = new File([compressedBlob], file.name, { type: file.type });
        setReceiptFile(optimizedFile);
      } catch (err) {
        console.error("Compression bypassed:", err);
        setReceiptFile(file);
      }
    } else {
      setReceiptFile(file);
    }
  };

  const handleResubmit = async () => {
    if (!receiptFile || !delegateData) return;
    setUploading(true);
    setError(null);

    try {
      const fileExt = receiptFile.name.split(".").pop();
      const fileName = `${Date.now()}-RETRY-${delegateData.utrNumber}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, receiptFile);

      if (uploadError) throw new Error("Failed to upload the new receipt.");

      const { data: publicUrlData } = supabase.storage
        .from("receipts")
        .getPublicUrl(fileName);

      const res = await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newScreenshotUrl: publicUrlData.publicUrl,
        }),
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
        <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !delegateData) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md text-center border border-surface-dim/30">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="font-playfair text-2xl font-bold text-primary mb-3">Link Expired</h2>
          <p className="font-inter text-sm text-on-surface-variant">
            {error || "This action link is invalid or has already been used."}
          </p>
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
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h2 className="font-playfair text-3xl font-bold text-primary mb-4">Receipt Updated!</h2>
          <p className="font-inter text-on-surface-variant mb-8 leading-relaxed text-sm">
            Your new receipt has been uploaded. Our organizing team is reviewing it and will notify you via email shortly.
          </p>

          <div className="bg-surface-bright px-6 py-4 rounded-xl border border-surface-dim/50 mb-6">
            <p className="font-inter text-xs text-on-surface-variant uppercase tracking-widest mb-1">Reference ID</p>
            <p className="font-mono text-xl font-bold text-primary">{delegateData?.referenceId}</p>
          </div>

          <p className="text-xs font-inter text-secondary mt-6 flex items-center justify-center italic gap-2 font-medium">
            Redirecting to homepage in {countdown} seconds...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-24 px-6 md:px-12 font-inter">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-amber-100 text-amber-800 border border-amber-300 font-bold tracking-widest text-[11px] uppercase px-3.5 py-1 rounded-full mb-3">
            Action Required
          </span>
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-primary mb-2">
            Payment Receipt Clarification
          </h1>
          <p className="text-on-surface-variant text-sm max-w-lg mx-auto">
            Please provide a clearer, full screenshot of your bank transfer or UPI transaction receipt.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-surface-dim/30 shadow-xl overflow-hidden">
          {/* Static, Safe Instruction Banner */}
          <div className="bg-amber-50/70 border-b border-amber-100 p-6 sm:p-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
              Requirements for Verification:
            </h3>
            <ul className="text-xs text-amber-900/90 space-y-1.5 list-disc list-inside">
              <li>Ensure the entire payment screen is visible and not cropped.</li>
              <li>The 12-digit UTR / UPI Transaction Reference Number must be legible.</li>
              <li>The recipient account and payment amount must match your registration category.</li>
            </ul>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            {/* Target UTR Box */}
            <div className="bg-surface-bright rounded-2xl p-5 border border-surface-dim/40 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Target UTR / Reference
                </p>
                <p className="font-mono text-lg font-bold text-primary mt-0.5">
                  {delegateData?.utrNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Reference ID
                </p>
                <p className="font-mono text-sm font-bold text-secondary mt-0.5">
                  {delegateData?.referenceId}
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-medium border border-red-200">
                {error}
              </div>
            )}

            {/* Upload Area */}
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/jpeg,image/png,image/webp,application/pdf"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group ${
                  receiptFile
                    ? "border-secondary bg-secondary/5"
                    : "border-surface-dim/70 hover:border-secondary/50 bg-surface-bright/40"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    receiptFile
                      ? "bg-secondary text-white"
                      : "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white"
                  }`}
                >
                  {receiptFile ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  )}
                </div>
                <div className="text-center px-2">
                  <p className={`text-sm font-bold truncate max-w-[260px] ${receiptFile ? "text-secondary" : "text-primary"}`}>
                    {receiptFile ? receiptFile.name : "Select new screenshot"}
                  </p>
                  <p className="text-[11px] text-on-surface-variant tracking-wider uppercase mt-0.5">
                    {receiptFile ? `${(receiptFile.size / 1024 / 1024).toFixed(2)} MB` : "JPG, PNG, PDF (Max 2MB)"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleResubmit}
              disabled={uploading || !receiptFile}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading & Submitting...
                </span>
              ) : (
                "Submit Corrected Receipt"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}