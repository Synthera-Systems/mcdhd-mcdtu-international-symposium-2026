"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXCEL_COLUMNS = [
  { key: "referenceId", label: "Reference ID" },
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email Address" },
  { key: "affiliation", label: "Affiliation" },
  { key: "category", label: "Category" },
  { key: "participationType", label: "Participation Mode" },
  { key: "utrNumber", label: "UTR Number" },
  { key: "paymentStatus", label: "Payment Status" },
  { key: "linkedAbstractId", label: "Linked Abstract" },
  { key: "createdAt", label: "Registration Date" }
];

export default function DataExporter() {
  // Excel Export State
  const [exportingExcel, setExportingExcel] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    EXCEL_COLUMNS.map(c => c.key) // Default to all selected
  );

  // ZIP Export State
  const [exportingZip, setExportingZip] = useState(false);
  const [zipPage, setZipPage] = useState(1);
  
  // UI State
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const toggleColumn = (key: string) => {
    setSelectedColumns(prev => 
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );
  };

  const handleExcelExport = async () => {
    if (selectedColumns.length === 0) {
      setMessage({ type: "error", text: "Please select at least one column to export." });
      return;
    }

    setExportingExcel(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/export/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusFilter, selectedColumns })
      });

      if (!res.ok) throw new Error("Failed to generate spreadsheet.");

      // Convert the binary stream into a downloadable file link
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MitoCan_Delegates_${statusFilter}_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setMessage({ type: "success", text: "Excel spreadsheet downloaded successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setExportingExcel(false);
    }
  };

  const handleZipExport = async () => {
    setExportingZip(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/export/receipts?page=${zipPage}&limit=100`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to package ZIP archive.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MitoCan_Receipts_Batch_${zipPage}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMessage({ type: "success", text: `Receipts batch ${zipPage} downloaded successfully!` });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setExportingZip(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgba(0,33,71,0.02)] p-6 sm:p-8 min-w-full font-inter mt-6">
      
      <div className="mb-6 pb-4 border-b border-surface-dim/20">
        <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-primary">Data Export Center</h3>
        <p className="text-sm text-on-surface-variant mt-1">Compile and securely download registration records and bulk receipt archives.</p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl text-xs sm:text-sm font-semibold mb-6 border flex items-start gap-3 ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
          >
            {message.type === "success" ? "✓" : "⚠"} {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* --- EXCEL EXPORTER SECTION --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-primary text-lg">Spreadsheet Engine</h4>
              <p className="text-xs text-on-surface-variant">Generate clean .xlsx files for delegate tracking.</p>
            </div>
          </div>

          <div className="bg-surface-bright/50 border border-surface-dim/40 p-4 sm:p-5 rounded-xl space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Filter by Payment Status</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-surface-dim/60 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              >
                <option value="ALL">All Registrations (Global List)</option>
                <option value="COMPLETED">Verified & Paid (COMPLETED)</option>
                <option value="ACTION_REQUIRED">Action Required (Rejected/Failed)</option>
                <option value="PROCESSING">Processing (Pending Review)</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Select Columns</label>
                <button onClick={() => setSelectedColumns(EXCEL_COLUMNS.map(c => c.key))} className="text-[10px] font-bold text-secondary hover:underline">Select All</button>
              </div>
              <div className="grid grid-cols-2 gap-2 h-40 overflow-y-auto custom-scrollbar p-2 bg-white border border-surface-dim/40 rounded-lg">
                {EXCEL_COLUMNS.map((col) => (
                  <label key={col.key} className="flex items-center gap-2 cursor-pointer text-xs text-primary hover:bg-surface-dim/10 p-1.5 rounded transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedColumns.includes(col.key)} 
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-surface-dim text-secondary focus:ring-secondary accent-secondary"
                    />
                    <span className="truncate">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={handleExcelExport}
              disabled={exportingExcel}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm shadow-green-600/20"
            >
              {exportingExcel ? "Generating Workbook..." : "Download Excel (.xlsx)"}
            </button>
          </div>
        </div>

        {/* --- ZIP BATCH ARCHIVER SECTION --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-primary text-lg">Receipt Bulk Archiver</h4>
              <p className="text-xs text-on-surface-variant">Download payment screenshots in secure ZIP batches.</p>
            </div>
          </div>

          <div className="bg-surface-bright/50 border border-surface-dim/40 p-4 sm:p-5 rounded-xl space-y-5">
            <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20 text-xs text-secondary-container leading-relaxed">
              To ensure system stability, assets are packed in chunks of 100 images per file. The files inside will be neatly renamed to <strong>REF_ID-Name-receipt.png</strong>.
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Select Target Batch</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setZipPage(Math.max(1, zipPage - 1))}
                  disabled={zipPage === 1}
                  className="w-10 h-10 flex items-center justify-center border border-surface-dim/60 bg-white rounded-lg hover:bg-surface-dim/10 disabled:opacity-30 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                
                <div className="flex-1 text-center font-mono font-bold text-primary bg-white border border-surface-dim/60 rounded-lg py-2 text-sm">
                  Batch Page {zipPage}
                  <span className="block text-[10px] text-on-surface-variant font-inter font-normal mt-0.5">Records {(zipPage - 1) * 100 + 1} to {zipPage * 100}</span>
                </div>

                <button 
                  onClick={() => setZipPage(zipPage + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-surface-dim/60 bg-white rounded-lg hover:bg-surface-dim/10 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <button 
              onClick={handleZipExport}
              disabled={exportingZip}
              className="w-full bg-secondary hover:bg-secondary-container text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm shadow-secondary/20 mt-4"
            >
              {exportingZip ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Packing ZIP Archive...
                </span>
              ) : "Download ZIP Archive"}
            </button>
          </div>
        </div>

      </div>
      {/* --- MASTER ARCHIVE & PURGE ZONE (NUKE BUTTON) --- */}
    <div className="mt-8 border-t border-surface-dim/30 pt-8">
    <div className="bg-[#ffdad6]/30 border border-[#ba1a1a]/20 p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="space-y-2">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center border border-[#ba1a1a]/20 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h4 className="font-bold text-[#ba1a1a] text-lg">Master Archive & Purge</h4>
        </div>
        <p className="text-sm text-[#93000a]/80 max-w-xl">
            <strong>Danger Zone:</strong> This action will package all physical receipt files into a single master ZIP, download it to your machine, and then <strong>permanently delete all images from cloud storage</strong> to free up quota.
        </p>
        </div>
        
        <button 
        onClick={async () => {
            if (!window.confirm("WARNING: This will completely wipe the receipts bucket after downloading. Ensure your connection is stable before proceeding.")) return;
            
            try {
            setMessage({ type: "success", text: "Compiling master archive. Please do not close the window..." });
            const res = await fetch("/api/admin/archive?type=receipts&delete=true");
            if (!res.ok) throw new Error("Failed to compile master archive.");
            
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `MitoCan_MASTER_RECEIPT_ARCHIVE_${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            setMessage({ type: "success", text: "Master Archive Downloaded & Storage Purged Successfully!" });
            } catch (err: any) {
            setMessage({ type: "error", text: err.message });
            }
        }}
        className="shrink-0 w-full md:w-auto bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
        Empty Cloud Storage 
        </button>
    </div>
    </div>
    </div>
  );
}