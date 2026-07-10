"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AbstractReviews() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  
  // Protective Modal States
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [pendingPurgeId, setPendingPurgeId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setLoading(false);
    }
  };

  // Triggered when user confirms in the warning modal
  const executePurge = async () => {
    if (!pendingPurgeId) return;
  
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/abstracts/purge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ abstractId: pendingPurgeId })
      });
      if (res.ok) {
        alert("File successfully deleted from cloud storage.");
        await fetchData();
        setSelectedItem(null);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete abstract.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setActionLoading(false);
      setIsWarningOpen(false);
      setPendingPurgeId(null);
    }
  };
  
  const handleAction = async (submissionId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/submission", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, newStatus })
      });
      if (res.ok) {
        await fetchData(); 
        setSelectedItem(null); 
      } else {
        alert("Failed to update abstract status.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] w-full bg-surface p-6 md:p-8 flex items-start gap-8 overflow-hidden">
      
      {/* ==========================================
          LEFT: MASTER LIST
          ========================================== */}
      <motion.div 
        layout 
        className="flex-1 w-full h-full bg-white rounded-[2rem] border border-surface-dim/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden min-w-0"
      >
        <div className="px-6 py-5 md:px-8 border-b border-surface-dim/30 bg-surface-bright/30 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-primary text-white text-[11px] font-bold px-4 py-2 rounded-full tracking-wider shadow-sm">
              {filteredSubmissions.length} TOTAL
            </span>
            <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest hidden lg:block ml-2">
              Scientific Review Queue
            </span>
          </div>
          
          <div className="relative flex gap-3 items-center border-l-2 px-2 py-3 w-full md:w-96 shrink-0">
            <svg className="w-6 h-6 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search ID, Title, or Author..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className=" bg-white border border-surface-dim/50 rounded-xl px-3 pr-4 py-3 text-sm font-inter focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all text-primary shadow-sm" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto py-4 min-h-0 relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-bright/90 sticky top-0 z-10 backdrop-blur-sm border-b border-surface-dim/30">
              <tr>
                <th className="px-8 py-5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Abstract ID</th>
                <th className="px-8 py-5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Study Details</th>
                <th className="px-8 py-5 font-bold text-on-surface-variant text-xs uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-surface-dim/20">
              {loading ? (
                <tr><td colSpan={3} className="px-8 py-24 text-center text-on-surface-variant">Syncing database...</td></tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr><td colSpan={3} className="px-8 py-24 text-center text-on-surface-variant font-medium text-base">No abstract submissions found.</td></tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr 
                    key={sub.id} 
                    onClick={() => setSelectedItem(sub)}
                    className={`cursor-pointer transition-colors border-l-4 group ${selectedItem?.id === sub.id ? 'bg-secondary/5 border-secondary' : 'hover:bg-surface-bright/50 border-transparent'}`}
                  >
                    <td className="px-8 py-6 align-top">
                      <p className="font-mono text-sm font-bold text-secondary pt-1">{sub.referenceId}</p>
                    </td>
                    <td className="px-8 py-6 align-top whitespace-normal max-w-lg">
                      <p className={`text-base font-bold leading-relaxed mb-3 transition-colors ${selectedItem?.id === sub.id ? 'text-primary' : 'text-primary'}`}>
                        {sub.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-bold bg-surface border border-surface-dim/50 px-2.5 py-1 rounded text-on-surface-variant uppercase tracking-widest shadow-sm">
                          {sub.type}
                        </span>
                        <span className="text-xs text-on-surface-variant italic truncate max-w-[300px]">
                          by {sub.authors}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 align-top pt-7">
                      <span className={`flex w-max items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full border tracking-wider uppercase ${
                        sub.status.includes('ACCEPTED') ? 'bg-green-50 text-green-700 border-green-200' :
                        sub.status === 'REJECTED' ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/20' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {sub.status.includes('ACCEPTED') && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        {sub.status === 'REJECTED' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>}
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ==========================================
          RIGHT: DETAIL PANEL (WIDE MODAL)
          ========================================== */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedItem(null)} 
              className="absolute inset-0 bg-primary/60 backdrop-blur-sm cursor-pointer" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[90rem] h-[90vh] bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-surface-dim/30"
            >
              
              {/* LEFT HALF: Massive Document Viewport */}
              <div className="w-full md:w-[60%] lg:w-[65%] h-1/2 md:h-full bg-surface-bright/30 border-r border-surface-dim/20 p-4 sm:p-6 flex flex-col relative">
                
                {/* Floating Tools on Document */}
                <div className="absolute top-8 right-8 flex gap-2 z-10">
                  {selectedItem.fileUrl !== "DOWNLOADED_AND_PURGED" && (
                    <>
                      <button 
                        onClick={() => {
                          setPendingPurgeId(selectedItem.id);
                          setIsWarningOpen(true);
                        }} 
                        disabled={actionLoading} 
                        className="flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-red-50 text-red-600 border border-red-100 rounded-xl backdrop-blur-md transition-all shadow-lg text-xs font-bold tracking-wider uppercase cursor-pointer disabled:opacity-50" 
                        title="Purge File from Storage"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                      <a href={selectedItem.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-black/70 hover:bg-black text-white rounded-xl backdrop-blur-md transition-all shadow-lg text-xs font-bold tracking-wider uppercase" title="Open PDF in new tab">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        New Tab
                      </a>
                    </>
                  )}
                </div>

                <div className="flex-1 w-full h-full bg-surface/50 rounded-xl border border-surface-dim/30 relative overflow-hidden shadow-inner flex flex-col">
                  {selectedItem.fileUrl === "DOWNLOADED_AND_PURGED" ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6 text-center">
                      <svg className="w-16 h-16 text-surface-dim mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      <p className="text-base font-medium text-primary mb-2">Asset Deleted</p>
                      <p className="text-sm text-on-surface-variant">The original file has been securely removed from cloud storage.</p>
                    </div>
                  ) : selectedItem.fileUrl.endsWith('.pdf') ? (
                    <iframe 
                      src={`${selectedItem.fileUrl}#toolbar=0&navpanes=0`} 
                      className="w-full h-full border-0" 
                      title="Abstract Document"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6 text-center">
                      <svg className="w-16 h-16 text-surface-dim mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p className="text-base font-medium text-primary mb-2">Word Document Detected</p>
                      <p className="text-sm text-on-surface-variant mb-6">Browsers cannot preview Word docs directly.</p>
                      <a href={selectedItem.fileUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:bg-primary/90 transition-colors">Download to Read</a>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT HALF: Verification Details & Actions */}
              <div className="w-full md:w-[40%] lg:w-[35%] h-1/2 md:h-full flex flex-col bg-white">
                
                {/* Header */}
                <div className="p-6 md:p-8 pb-5 flex items-center justify-between shrink-0 border-b border-surface-dim/20">
                  <div>
                    <h3 className="font-playfair text-2xl md:text-3xl font-bold text-primary">Abstract</h3>
                    <p className="text-sm font-mono font-bold text-secondary mt-1">{selectedItem.referenceId}</p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-2.5 bg-surface hover:bg-surface-bright rounded-xl text-on-surface-variant transition-all shadow-sm cursor-pointer active:scale-95 border border-surface-dim/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Scrollable Data Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 custom-scrollbar min-h-0">
                  <div className="bg-surface border border-surface-dim/30 rounded-2xl p-6 space-y-6 shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Study Title</p>
                      <p className="text-base md:text-lg font-bold text-primary leading-relaxed">{selectedItem.title}</p>
                    </div>
                    <hr className="border-surface-dim/30" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Primary Authors</p>
                        <p className="text-sm font-medium text-primary">{selectedItem.authors}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Requested Format</p>
                        <span className="inline-block bg-secondary/10 text-secondary text-[11px] font-bold px-3 py-1.5 rounded-md border border-secondary/20 shadow-sm uppercase tracking-wider">
                          {selectedItem.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-6 md:p-8 shrink-0 bg-surface-bright/30 border-t border-surface-dim/20">
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button 
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                        onClick={() => handleAction(selectedItem.id, "ACCEPTED_ORAL")} 
                        disabled={actionLoading} 
                        className="w-full bg-primary text-white text-xs sm:text-sm font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
                      >
                        Approve Oral
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                        onClick={() => handleAction(selectedItem.id, "ACCEPTED_POSTER")} 
                        disabled={actionLoading} 
                        className="w-full bg-secondary text-white text-xs sm:text-sm font-bold py-3.5 rounded-xl hover:bg-secondary/90 transition-all shadow-md shadow-secondary/20 disabled:opacity-50 cursor-pointer"
                      >
                        Approve Poster
                      </motion.button>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} 
                      onClick={() => handleAction(selectedItem.id, "REJECTED")} 
                      disabled={actionLoading} 
                      className="w-full bg-white border border-[#ba1a1a]/30 text-[#ba1a1a] text-sm font-bold py-3 rounded-xl hover:bg-[#ffdad6] hover:border-[#ba1a1a]/50 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      Reject Submission
                    </motion.button>
                  </div>
                  <p className="font-inter text-[10px] text-on-surface-variant text-center mt-4 italic">
                    Decision email will be sent to <span className="font-bold text-primary">{selectedItem.presenterEmail || 'the primary author'}</span>.
                  </p>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          PROTECTIVE WARNING MODAL
          ========================================== */}
      <AnimatePresence>
        {isWarningOpen && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => { setIsWarningOpen(false); setPendingPurgeId(null); }} 
              className="absolute inset-0 cursor-pointer" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-surface-dim/30 overflow-hidden font-inter text-left"
            >
              <div className="flex items-center gap-3 mb-4 text-[#ba1a1a]">
                <div className="w-10 h-10 rounded-xl bg-[#ba1a1a]/10 flex items-center justify-center border border-[#ba1a1a]/20 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h4 className="font-playfair text-xl font-bold tracking-tight">Confirm Deletion</h4>
              </div>

              <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed mb-8">
                <p className="font-bold text-primary">Have you downloaded this document yet?</p>
                <p>
                  This action will <strong>permanently delete</strong> the raw file from the cloud storage to free up space. The author's text details will remain in the system.
                </p>
                <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-200 shadow-sm leading-relaxed">
                  If you haven't saved a copy locally, please click <strong>Cancel</strong> below, use the <span className="font-bold text-primary bg-white px-1.5 py-0.5 rounded shadow-sm">New Tab</span> button to download it, and then return here to delete it.
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => { setIsWarningOpen(false); setPendingPurgeId(null); }} 
                  disabled={actionLoading} 
                  className="flex-1 py-3 border border-surface-dim/50 rounded-xl font-bold text-primary hover:bg-surface-bright transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={executePurge} 
                  disabled={actionLoading} 
                  className="flex-1 py-3 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? "Deleting..." : "Yes, Delete File"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}