"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DelegateIDCard from "@/components/DelegateIDCard";

export default function ConfirmedDelegates() {
  const [delegates, setDelegates] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [selectedDelegateForCard, setSelectedDelegateForCard] = useState<any | null>(null);
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedAbstract, setSelectedAbstract] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const data = await res.json();
        const confirmed = (data.delegates || []).filter(
          (d: any) => d.payment && d.payment.status === "COMPLETED"
        );
        setDelegates(confirmed);
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Failed to load confirmed delegates", err);
    } finally {
      setLoading(false);
    }
  };

  // Find linked abstract for a delegate
  const getLinkedAbstract = (delegate: any) => {
    return submissions.find(
      (s) =>
        (s.referenceId && s.referenceId === delegate.referenceId) ||
        (s.presenterEmail && s.presenterEmail.toLowerCase() === delegate.email.toLowerCase())
    );
  };

  const filtered = delegates.filter((d) =>
    d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.affiliation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.payment?.utrNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] w-full bg-surface p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden">
      <motion.div
        layout
        className="w-full h-full bg-white rounded-2xl py-3 border border-surface-dim/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden min-h-0"
      >
        {/* Header Search & Filter */}
        <div className="px-6 py-4 border-b border-surface-dim/20 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 bg-surface-bright/30 shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-emerald-700 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full tracking-wider shadow-sm">
              {filtered.length} CONFIRMED
            </span>
            <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest hidden sm:block">
              Approved Delegate Registry
            </span>
          </div>

          <div className="relative flex gap-3 items-center border-l border-surface-dim/40 pl-4 w-full md:w-96 shrink-0">
            <svg className="w-5 h-5 text-on-surface-variant shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search Name, Email, Inst, Ref ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-surface-dim/50 rounded-xl px-4 py-2 text-sm font-inter focus:outline-none focus:border-secondary w-full transition-all"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-auto py-2 min-h-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-bright/90 sticky top-0 z-10 backdrop-blur-sm border-b border-surface-dim/20">
              <tr>
                <th className="px-6 py-3.5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Delegate Details</th>
                <th className="px-6 py-3.5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Category / Affiliation</th>
                <th className="px-6 py-3.5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Tracking & Abstract</th>
                <th className="px-6 py-3.5 font-bold text-on-surface-variant text-xs uppercase tracking-widest text-center">Receipt</th>
                <th className="px-6 py-3.5 font-bold text-on-surface-variant text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-dim/15">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-on-surface-variant">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading confirmed delegates...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-on-surface-variant font-medium">
                    No confirmed delegates match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((del) => {
                  const linkedAbstract = getLinkedAbstract(del);
                  return (
                    <tr key={del.id} className="hover:bg-surface-bright/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-primary text-sm">{del.fullName}</p>
                        <p className="text-xs text-on-surface-variant">{del.email}</p>
                      </td>

                      <td className="px-6 py-4 max-w-[280px]">
                        <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded uppercase">
                          {del.category}
                        </span>
                        <p className="text-xs text-gray-700 mt-1 whitespace-normal leading-tight font-medium" title={del.affiliation}>
                          {del.affiliation || "N/A"}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs">
                        <p className="font-bold text-primary">{del.referenceId}</p>
                        <div className="mt-1">
                          {linkedAbstract ? (
                            <button
                              onClick={() => setSelectedAbstract(linkedAbstract)}
                              className="text-[10px] font-sans font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded hover:bg-purple-100 transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              📄 Abstract Linked
                            </button>
                          ) : (
                            <span className="text-[10px] font-sans text-gray-400">No abstract</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {del.payment?.screenshotUrl ? (
                          <button
                            onClick={() => {
                              setImageLoaded(false);
                              setPreviewScreenshotUrl(del.payment.screenshotUrl);
                            }}
                            className="text-xs text-secondary hover:underline font-semibold cursor-pointer"
                          >
                            View Receipt
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedDelegateForCard(del)}
                          className="px-3.5 py-2 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          ID Pass
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* MODAL 1: ID Card Generator Modal */}
      <AnimatePresence>
        {selectedDelegateForCard && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDelegateForCard(null)}
              className="absolute inset-0 bg-primary/70 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full z-10 flex flex-col items-center border border-surface-dim/30"
            >
              <div className="w-full flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-playfair text-primary">Delegate Badge</h3>
                <button
                  onClick={() => setSelectedDelegateForCard(null)}
                  className="p-1.5 hover:bg-surface-bright rounded-lg text-gray-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <DelegateIDCard
                fullName={selectedDelegateForCard.fullName}
                affiliation={selectedDelegateForCard.affiliation}
                category={selectedDelegateForCard.category}
                referenceId={selectedDelegateForCard.referenceId}
                participationType={selectedDelegateForCard.participationType}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Receipt Preview with Loader */}
      <AnimatePresence>
        {previewScreenshotUrl && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewScreenshotUrl(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl p-5 max-w-xl max-h-[90vh] w-full z-10 flex flex-col"
            >
              <div className="flex justify-between items-center pb-2.5 border-b border-surface-dim/20 mb-3">
                <h4 className="font-bold text-primary font-playfair">Payment Receipt Verification</h4>
                <button
                  onClick={() => setPreviewScreenshotUrl(null)}
                  className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-auto min-h-[300px] flex items-center justify-center bg-gray-50 rounded-xl p-2 relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={previewScreenshotUrl}
                  alt="Receipt Screenshot"
                  onLoad={() => setImageLoaded(true)}
                  className={`max-h-[70vh] object-contain rounded-lg shadow-sm transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Linked Abstract Details Modal */}
      <AnimatePresence>
        {selectedAbstract && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAbstract(null)}
              className="absolute inset-0 bg-primary/70 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-xl w-full z-10 flex flex-col border border-surface-dim/30 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start pb-4 border-b border-surface-dim/20 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary px-2.5 py-1 rounded">
                    {selectedAbstract.status || "SUBMITTED"}
                  </span>
                  <h3 className="text-xl font-bold font-playfair text-primary mt-2">
                    {selectedAbstract.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAbstract(null)}
                  className="p-1.5 hover:bg-surface-bright rounded-lg text-gray-500 cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-inter">
                <div>
                  <p className="text-gray-400 uppercase tracking-widest font-bold text-[10px]">Authors</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedAbstract.authors || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-gray-400 uppercase tracking-widest font-bold text-[10px]">Presenter</p>
                  <p className="text-gray-900 mt-0.5">{selectedAbstract.presenterName} ({selectedAbstract.presenterEmail})</p>
                </div>

                {selectedAbstract.abstractText && (
                  <div>
                    <p className="text-gray-400 uppercase tracking-widest font-bold text-[10px]">Abstract Text</p>
                    <p className="text-gray-700 mt-1 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100 max-h-48 overflow-y-auto">
                      {selectedAbstract.abstractText}
                    </p>
                  </div>
                )}

                {selectedAbstract.fileUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedAbstract.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Abstract File (DOCX/PDF)
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}