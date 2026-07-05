"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const springInteraction = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 320, damping: 22 }
};

interface LoginProps {
  handleLogin: (e: React.FormEvent) => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  error: string;
}

export default function LoginScreen({ 
  handleLogin, username, setUsername, password, setPassword, loading, error 
}: LoginProps) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6 font-inter w-full">
      
      {/* Card styled using your surface-dim borders */}
      <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgba(0,33,71,0.04)] border border-surface-dim/30 w-full max-w-md">
        
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-primary mb-2 tracking-tight">
            Admin Panel
          </h1>
          <h2 className="font-playfair text-xl font-bold text-primary mb-2 tracking-tight">
            MitoCan-Symposium 2026
          </h2>
          <p className="font-inter text-sm text-on-surface-variant">
            Symposium Management System
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-[#ffdad6] text-[#93000a] text-sm font-medium rounded-xl border border-[#ba1a1a]/20 text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="font-inter text-xs font-bold text-on-surface-variant uppercase tracking-wide pl-1">
              Username
            </label>
            <input 
              type="text" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full bg-surface-bright border px-3 border-surface-dim/50 rounded-xl py-3.5 font-inter text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all" 
            />
          </div>
          
          <div className="space-y-2 pb-2">
            <label className="font-inter text-xs font-bold text-on-surface-variant uppercase tracking-wide pl-1">
              Password
            </label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-surface-bright border border-surface-dim/50 rounded-xl px-3 py-3.5 font-inter text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="cursor-pointer w-full bg-primary text-white font-inter font-bold text-lg py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
          
        </form>
        <motion.div {...springInteraction}>
          <Link href="/" className="flex items-center gap-2">
            <span className="cursor-pointer w-full bg-primary/30 mt-4 text-primaryfont-inter font-bold text-lg py-4 rounded-xl hover:bg-primary/60 hover:text-gray-100 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-primary/20">
              Go to the site
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}