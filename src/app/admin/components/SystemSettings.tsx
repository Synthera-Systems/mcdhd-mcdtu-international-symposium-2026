"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to turn two calendar selections into a premium banner string
const formatBannerDates = (startDateStr: string, endDateString: string): string => {
  if (!startDateStr) return "";
  if (!endDateString || startDateStr === endDateString) {
    return new Date(startDateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  const start = new Date(startDateStr);
  const end = new Date(endDateString);

  const startMonth = start.toLocaleDateString("en-US", { month: "long" });
  const endMonth = end.toLocaleDateString("en-US", { month: "long" });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = start.getFullYear();

  // Case 1: Dates are in the same month (e.g., October 26 - 27, 2026)
  if (startMonth === endMonth) {
    return `${startMonth} ${String(startDay).padStart(2, '0')} - ${String(endDay).padStart(2, '0')}, ${year}`;
  }

  // Case 2: Dates cross into different months (e.g., October 31 - November 02, 2026)
  return `${startMonth} ${String(startDay).padStart(2, '0')} - ${endMonth} ${String(endDay).padStart(2, '0')}, ${year}`;
};

export default function SystemSettingsView() {
  
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const [settings, setSettings] = useState({
    symposiumDates: "",
    submissionDeadline: "",
    notificationDate: "",
    accountName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiQrUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Custom file upload states for the dynamic QR Code image
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setSettings(data);
          if (data.upiQrUrl) setQrPreview(data.upiQrUrl);
          if (data.submissionDeadline) setSettings(prev => ({...prev, submissionDeadline: data.submissionDeadline}));
        }
      })
      .catch(() => setMessage({ type: "error", text: "Failed to initialize configuration values." }))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setQrFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let finalQrUrl = settings.upiQrUrl;

      // Optional: If a new file is uploaded, handle R2/S3 or local base64 string injection
      if (qrFile && qrPreview.startsWith("data:image")) {
        finalQrUrl = qrPreview; 
      }

      const updatedPayload = {
        ...settings,
        upiQrUrl: finalQrUrl
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSettings(data);
      setIsEditing(false);
      setMessage({ type: "success", text: "System properties successfully committed to database globally." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An operational save execution fault occurred." });
    } finally {
      setSaving(false);
    }
  };

  // --- LOADING / SKELETON STATE COMPONENT ---
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-surface-dim/30 p-6 max-w-4xl space-y-6">
        <div className="animate-pulse space-y-2">
          <div className="h-6 w-1/3 bg-surface-dim rounded" />
          <div className="h-4 w-1/2 bg-surface-dim/50 rounded" />
        </div>
        <hr className="border-surface-dim/20" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse space-y-2">
              <div className="h-3 w-24 bg-surface-dim/60 rounded" />
              <div className="h-10 w-full bg-surface-dim rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="animate-pulse space-y-2">
              <div className="h-3 w-24 bg-surface-dim/60 rounded" />
              <div className="h-10 w-full bg-surface-dim rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgba(0,33,71,0.02)] p-6 min-w-full font-inter text-left mt-6">
      
      {/* Dynamic Header Block with Mode Toggles */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-surface-dim/20">
        <div>
          <h3 className="font-playfair text-3xl font-bold text-primary">Global Configuration Parameters</h3>
          <p className="text-sm text-on-surface-variant mt-1">Manage public landing details, timelines, and payment structures cleanly.</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 border border-secondary/30 text-secondary hover:bg-secondary/5 rounded-xl text-lg font-semibold font-inter transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Modify Details
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold mb-6 border ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: EVENT TIMELINES */}
        <div className="space-y-4">
          <h4 className="text-2xl font-semibold text-primary tracking-widest uppercase border-l-2 border-secondary pl-2">Event Timelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Symposium Banner Dates</label>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <div className="flex-1 space-y-1">
                  <input 
                    required 
                    type="date" 
                    value={startInput} 
                    onChange={(e) => {
                      const nextStart = e.target.value;
                      setStartInput(nextStart);
                      setSettings({ ...settings, symposiumDates: formatBannerDates(nextStart, endInput) });
                    }} 
                    className="w-full bg-surface-bright border border-surface-dim/50 rounded-xl px-3 py-2 text-xl text-primary focus:outline-none focus:border-secondary" 
                  />
                  <span className="text-sm text-secondary font-medium">Start Date</span>
                </div>
                <div className="flex-1 space-y-1"> 
                  <input 
                    required 
                    type="date" 
                    value={endInput} 
                    min={startInput} 
                    onChange={(e) => {
                      const nextEnd = e.target.value;
                      setEndInput(nextEnd);
                      setSettings({ ...settings, symposiumDates: formatBannerDates(startInput, nextEnd) });
                    }} 
                    className="w-full bg-surface-bright border border-surface-dim/50 rounded-xl px-3 py-2 text-xl text-primary focus:outline-none focus:border-secondary" 
                  />
                  <span className="text-sm text-secondary font-medium">End Date</span>
                </div>
              </div>
            ) : (
              <p className="text-xl font-medium text-primary bg-surface-bright/50 px-3 py-2.5 border border-transparent rounded-xl">
                {settings.symposiumDates || "Not configured"}
              </p>
            )}
          </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Abstract Submission Deadline</label>
              {isEditing ? (
                <input required type="date" value={settings.submissionDeadline} onChange={(e) => setSettings({ ...settings, submissionDeadline: e.target.value })} className="w-full bg-surface-bright border border-surface-dim/50 rounded-xl px-3 py-2.5 text-xl text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary" />
              ) : (
                <p className="text-xl font-medium text-primary bg-surface-bright/50 px-3 py-2.5 border border-transparent rounded-xl font-mono">{settings.submissionDeadline || "Not configured"}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Review Notification Date</label>
              {isEditing ? (
                <input required type="date" value={settings.notificationDate} onChange={(e) => setSettings({ ...settings, notificationDate: e.target.value })} className="w-full bg-surface-bright border border-surface-dim/50 rounded-xl px-3 py-2.5 text-xl text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary" />
              ) : (
                <p className="text-xl font-medium text-primary bg-surface-bright/50 px-3 py-2.5 border border-transparent rounded-xl font-mono">{settings.notificationDate || "Not configured"}</p>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 2: PAYMENT CREDENTIALS & QR UPLOAD */}
        <div className="space-y-4">
          <h4 className="text-2xl font-semibold text-primary tracking-widest uppercase border-l-2 border-secondary pl-2">Payment Gateways & Banking</h4>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Form Fields Column */}
            <div className="w-full md:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Banking Account Title</label>
                {isEditing ? (
                  <input required type="text" value={settings.accountName} onChange={(e) => setSettings({ ...settings, accountName: e.target.value })} className="w-full bg-surface-bright border border-surface-dim/50 rounded-xl px-3 py-2.5 text-xl text-primary focus:outline-none focus:border-secondary" />
                ) : (
                  <p className="text-xl font-medium text-primary bg-surface-bright/50 px-3 py-2.5 border border-transparent rounded-xl">{settings.accountName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Institution Bank Name</label>
                {isEditing ? (
                  <input required type="text" value={settings.bankName} onChange={(e) => setSettings({ ...settings, bankName: e.target.value })} className="w-full bg-surface-bright border border-surface-dim/50 rounded-xl px-3 py-2.5 text-xl text-primary focus:outline-none focus:border-secondary" />
                ) : (
                  <p className="text-xl font-medium text-primary bg-surface-bright/50 px-3 py-2.5 border border-transparent rounded-xl">{settings.bankName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Account Number</label>
                {isEditing ? (
                  <input required type="text" value={settings.accountNumber} onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })} className="w-full bg-surface-bright border border-surface-dim/50 rounded-xl px-3 py-2.5 text-xl text-primary focus:outline-none focus:border-secondary" />
                ) : (
                  <p className="text-xl font-bold text-primary font-mono tracking-wide bg-surface-bright/50 px-3 py-2.5 border border-transparent rounded-xl">{settings.accountNumber}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Bank IFSC Code</label>
                {isEditing ? (
                  <input required type="text" value={settings.ifscCode} onChange={(e) => setSettings({ ...settings, ifscCode: e.target.value })} className="w-full bg-surface-bright border border-surface-dim/50 rounded-xl px-3 py-2.5 text-xl text-primary focus:outline-none focus:border-secondary" />
                ) : (
                  <p className="text-xl font-bold text-primary font-mono tracking-wide bg-surface-bright/50 px-3 py-2.5 border border-transparent rounded-xl">{settings.ifscCode}</p>
                )}
              </div>
            </div>

            {/* Premium QR Code Component Row */}
            <div className="w-full md:w-auto flex flex-col items-center gap-2 border border-surface-dim/40 bg-surface-bright/30 rounded-2xl p-4 shrink-0 self-stretch justify-center">
              <div className="relative w-28 h-28 bg-white border border-surface-dim/50 rounded-xl p-2 flex items-center justify-center shadow-inner overflow-hidden group">
                {qrPreview ? (
                  <img src={qrPreview} alt="UPI Configuration QR" className="w-full h-full object-contain" />
                ) : (
                  <div className="bg-gradient-to-br from-primary-container to-primary inset-0 absolute m-1.5 rounded flex items-center justify-center">
                    <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                  </div>
                )}
                
                {isEditing && (
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute inset-0 bg-primary/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-bold uppercase tracking-wider"
                  >
                    Upload QR
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">UPI Target QR</span>
            </div>

          </div>
        </div>

        {/* Form Mutation Action Triggers */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="pt-4 flex justify-end gap-3 border-t border-surface-dim/20"
            >
              <button 
                type="button" 
                disabled={saving}
                onClick={() => {
                  setIsEditing(false);
                  setQrPreview(settings.upiQrUrl);
                }}
                className="px-5 py-2.5 bg-surface-bright border border-surface-dim/60 text-primary font-semibold rounded-xl text-sm transition-colors cursor-pointer hover:bg-surface-dim/30"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Committing Updates..." : "Save System Settings"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </form>
    </div>
  );
}