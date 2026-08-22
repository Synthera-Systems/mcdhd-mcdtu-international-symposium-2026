"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FlaggedApprovals() {
  const [delegates, setDelegates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const data = await res.json();
        const flagged = (data.delegates || []).filter(
          (d: any) => d.payment && d.payment.status === "ACTION_REQUIRED"
        );
        setDelegates(flagged);
      }
    } catch (err) {
      console.error("Failed to load flagged applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (paymentId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/delegate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, newStatus })
      });
      if (res.ok) {
        await fetchData();
        setSelectedItem(null);
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const parseAiReason = (log: string) => {
    try {
      const parsed = JSON.parse(log);
      return parsed.reason || log;
    } catch {
      return log || "Receipt flagged by automated audit.";
    }
  };

  const filtered = delegates.filter((d) =>
    d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.payment?.utrNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] w-full bg-surface p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden">
      <motion.div
        layout
        className="w-full h-full bg-white rounded-2xl py-3 border border-surface-dim/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden min-h-0"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-surface-dim/20 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 bg-surface-bright/30 shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-amber-600 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full tracking-wider shadow-sm">
              {filtered.length} FLAGGED
            </span>
            <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest hidden sm:block">
              AI Verification Exceptions
            </span>
          </div>

          <div className="relative flex gap-3 items-center border-l border-surface-dim/40 pl-4 w-full md:w-96 shrink-0">
            <svg className="w-5 h-5 text-on-surface-variant shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search Name, Ref ID, UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-surface-dim/50 rounded-xl px-4 py-2 text-sm font-inter focus:outline-none focus:border-secondary w-full"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-auto py-2 min-h-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-bright/90 sticky top-0 z-10 backdrop-blur-sm border-b border-surface-dim/20">
              <tr>
                <th className="px-6 py-3.5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Applicant Details</th>
                <th className="px-6 py-3.5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Claimed UTR</th>
                <th className="px-6 py-3.5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">AI Audit Reason</th>
                <th className="px-6 py-3.5 font-bold text-on-surface-variant text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-dim/15">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-on-surface-variant">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      Loading flagged applications...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-on-surface-variant font-medium">
                    No flagged applications in the review queue.
                  </td>
                </tr>
              ) : (
                filtered.map((del) => (
                  <tr key={del.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-primary text-sm">{del.fullName}</p>
                      <p className="text-xs text-on-surface-variant">{del.email}</p>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs font-bold text-primary">
                      {del.payment?.utrNumber || "N/A"}
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-amber-900 bg-amber-100/70 border border-amber-300/60 px-3 py-1.5 rounded-lg whitespace-normal leading-tight font-medium">
                        {parseAiReason(del.payment?.aiValidationLog)}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedItem(del)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                      >
                        Inspect & Decide
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* MODAL: Review & Human Override */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-primary/70 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-surface-dim/30 z-10"
            >
              {/* LEFT: Image Viewer */}
              <div className="w-full md:w-3/5 h-1/2 md:h-full bg-gray-50 border-r border-surface-dim/20 p-4 flex flex-col relative">
                <div className="absolute top-6 right-6 z-10">
                  <a
                    href={selectedItem.payment?.screenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black/75 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Open Full Image ↗
                  </a>
                </div>
                <div className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden rounded-2xl bg-white border border-gray-200">
                  <img
                    src={selectedItem.payment?.screenshotUrl}
                    alt="Receipt"
                    className="max-h-full max-w-full object-contain p-2"
                  />
                </div>
              </div>

              {/* RIGHT: Audit Details & Actions */}
              <div className="w-full md:w-2/5 h-1/2 md:h-full flex flex-col bg-white">
                <div className="p-6 pb-4 flex items-center justify-between border-b border-surface-dim/20">
                  <h3 className="font-playfair text-xl font-bold text-primary">Flag Review</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-surface-bright rounded-xl text-gray-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                      Gemini AI Audit Reasoning
                    </p>
                    <p className="text-xs text-amber-950 mt-1 leading-relaxed font-medium">
                      {parseAiReason(selectedItem.payment?.aiValidationLog)}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2.5 text-xs">
                    <div>
                      <p className="text-gray-400 font-bold uppercase text-[10px]">Applicant</p>
                      <p className="font-bold text-gray-900 text-sm">{selectedItem.fullName}</p>
                      <p className="text-gray-500">{selectedItem.email}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-gray-400 font-bold uppercase text-[10px]">Claimed UTR</p>
                      <p className="font-mono text-sm font-bold text-primary">{selectedItem.payment?.utrNumber}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-gray-400 font-bold uppercase text-[10px]">Category & Amount</p>
                      <p className="font-semibold text-gray-800 uppercase">{selectedItem.category} ({selectedItem.participationType})</p>
                    </div>
                  </div>
                </div>

                {/* Human Override Actions */}
                <div className="p-6 border-t border-surface-dim/20 bg-gray-50 flex flex-col gap-2.5">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction(selectedItem.payment.id, "COMPLETED")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    ✓ False Alarm: Approve Delegate
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction(selectedItem.payment.id, "ACTION_REQUIRED")}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    ✉ Send "Action Required" Email
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}