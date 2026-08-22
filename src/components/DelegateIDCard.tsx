"use client";

import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";

interface DelegateIDCardProps {
  fullName: string;
  affiliation: string;
  category: string;
  referenceId: string;
  participationType?: string;
}

export default function DelegateIDCard({
  fullName,
  affiliation,
  category,
  referenceId,
  participationType = "GENERAL ATTENDEE",
}: DelegateIDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: cardRef,
    documentTitle: `Delegate_Badge_${referenceId}`,
  });

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // High resolution output
      });
      const link = document.createElement("a");
      link.download = `ID_Badge_${referenceId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Failed to export image. Try the Print button instead.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Printable Portrait Card */}
      <div
        ref={cardRef}
        className="w-[320px] min-h-[490px] bg-[#001733] text-white rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl font-sans border-2 border-[#1e3a5f]"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 0%, #002b5c 0%, #001226 100%)",
          printColorAdjust: "exact",
        }}
      >
        {/* Subtle Background Circuit Mesh */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/hero.png')" }}
        />

        {/* TOP: Logos & Symposium Brand */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/logos/TU.png"
              alt="Tezpur University Logo"
              className="w-11 h-11 object-contain drop-shadow-md rounded-full bg-white/10 p-0.5"
            />
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-white leading-tight font-playfair">
                MitoCan-Symp 2026
              </p>
              <p className="text-[8px] text-blue-200 uppercase tracking-widest font-semibold">
                Tezpur University
              </p>
            </div>
          </div>

          <span className="text-[9px] font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full uppercase">
            {category || "DELEGATE"}
          </span>
        </div>

        {/* MIDDLE: Delegate Info */}
        <div className="relative z-10 my-auto text-center flex flex-col items-center px-1">
          {/* QR Code Container */}
          <div className="bg-white p-2.5 rounded-2xl shadow-xl border-2 border-white/80 mb-4 inline-block">
            <QRCodeSVG
              value={`https://mcdhd-mcdtu-2026-symposium-tezu.vercel.app/status?ref=${referenceId}`}
              size={96}
              level="M"
            />
          </div>

          <h2 className="text-lg font-bold font-playfair text-white tracking-tight leading-snug break-words max-w-[270px]">
            {fullName}
          </h2>

          <p className="text-xs text-blue-100/90 font-medium mt-1 leading-relaxed break-words max-w-[260px]">
            {affiliation || "Tezpur University"}
          </p>

          <div className="mt-3 inline-block px-3 py-0.5 rounded-full bg-white/10 border border-white/15">
            <p className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">
              {participationType ? participationType.replace("_", " ") : "GENERAL ATTENDEE"}
            </p>
          </div>
        </div>

        {/* BOTTOM: Pass Validation Footer */}
        <div className="relative z-10 border-t border-white/15 pt-3 flex justify-between items-end">
          <div className="text-left">
            <p className="text-[8px] text-blue-200/70 uppercase tracking-widest font-mono">Reference ID</p>
            <p className="text-xs font-mono font-bold text-white tracking-wider">{referenceId}</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified
            </p>
            <p className="text-[8px] text-white/50 uppercase tracking-wider">Delegate Pass</p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3 w-full justify-center">
        <button
          onClick={handleDownloadPNG}
          disabled={downloading}
          className="flex-1 max-w-[145px] flex items-center justify-center gap-1.5 bg-secondary hover:bg-secondary/90 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {downloading ? "Saving..." : "Save PNG"}
        </button>

        <button
          onClick={() => handlePrint()}
          className="flex-1 max-w-[145px] flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Card
        </button>
      </div>
    </div>
  );
}