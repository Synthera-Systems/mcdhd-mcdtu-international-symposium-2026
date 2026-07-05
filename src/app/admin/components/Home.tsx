"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";

export default function Home({ adminUser, setActiveTab }: { adminUser: any, setActiveTab: (tab: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDelegates: 0,
    pendingPayments: 0,
    totalAbstracts: 0,
    pendingReviews: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const data = await res.json();
        
        // Calculate Metrics
        const delegates = data.delegates || [];
        const submissions = data.submissions || [];
        
        const pendingPay = delegates.filter((d: any) => d.payment?.status !== 'COMPLETED' && d.payment?.status !== 'FAILED').length;
        const pendingRev = submissions.filter((s: any) => !s.status.includes('ACCEPTED') && s.status !== 'REJECTED').length;

        setStats({
          totalDelegates: delegates.length,
          pendingPayments: pendingPay,
          totalAbstracts: submissions.length,
          pendingReviews: pendingRev,
        });

        // Combine and sort for Recent Activity (Top 6 latest items)
        const combined = [
          ...delegates.map((d: any) => ({ ...d, activityType: 'REGISTRATION', date: new Date(d.createdAt) })),
          ...submissions.map((s: any) => ({ ...s, activityType: 'SUBMISSION', date: new Date(s.createdAt) }))
        ];
        
        combined.sort((a, b) => b.date.getTime() - a.date.getTime());
        setRecentActivity(combined.slice(0, 6));
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    // Replaced arbitrary pb-10 with standard p-6 md:p-8 padding scheme matching the layout wrapper
    <div className="w-full h-full bg-surface p-6 md:p-8 overflow-y-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Banner */}
      <div className="bg-primary rounded-2xl p-8 md:p-10 relative overflow-hidden shadow-lg shadow-primary/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="font-playfair text-3xl font-bold text-white mb-3">
            Welcome back, {adminUser?.name?.split(' ')[0] || 'Administrator'}
          </h2>
          <p className="font-inter text-white max-w-xl text-sm leading-relaxed">
            Here is what's happening with the MitoCan-Symposium 2026 today. You have <strong className="text-white font-semibold">{stats.pendingPayments} payments</strong> and <strong className="text-white font-semibold">{stats.pendingReviews} abstracts</strong> awaiting your review.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={() => setActiveTab("APPROVALS")}
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              Review Payments
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button 
              onClick={() => setActiveTab("REVIEWS")}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center gap-2"
            >
              Review Abstracts
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Registrations */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-white p-6 md:p-8 rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            
          </div>
          <div>
            <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">Total Registrations</h3>
            {!loading && <p className="font-mono text-4xl font-bold text-primary tracking-tight">{stats.totalDelegates}</p>}
            {loading && (
              <div className="w-10 h-10 flex justify-center items-center rounded-full border-2 p-1 border-primary animate-pulse">
                <div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-primary animate-pulse [animation-delay:150ms]">
                  <div className="w-6 h-6 rounded-full border-2 border-primary animate-pulse [animation-delay:300ms]"></div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Card 2: Pending Payments */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-white p-6 md:p-8 rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-[#fff8e6] text-[#b08b2b] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div>
            <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">Pending Payments</h3>
            {!loading && <p className="font-mono text-4xl font-bold text-primary tracking-tight">{stats.pendingPayments}</p>}
            {loading && (
              <div className="w-10 h-10 flex justify-center items-center rounded-full border-2 p-1 border-primary animate-pulse">
                <div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-primary animate-pulse [animation-delay:150ms]">
                  <div className="w-6 h-6 rounded-full border-2 border-primary animate-pulse [animation-delay:300ms]"></div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Card 3: Total Abstracts */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-white p-6 md:p-8 rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
          </div>
          <div>
            <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">Total Abstracts</h3>
            {!loading && <p className="font-mono text-4xl font-bold text-primary tracking-tight">{stats.totalAbstracts}</p>}
            {loading && (
              <div className="w-10 h-10 flex justify-center items-center rounded-full border-2 p-1 border-primary animate-pulse">
                <div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-primary animate-pulse [animation-delay:150ms]">
                  <div className="w-6 h-6 rounded-full border-2 border-primary animate-pulse [animation-delay:300ms]"></div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Card 4: Pending Reviews */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="bg-white p-6 md:p-8 rounded-2xl border border-surface-dim/30 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-[#fff1f0] text-[#ba1a1a] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
          </div>
          <div>
            <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">Pending Reviews</h3>
            {!loading && <p className="font-mono text-4xl font-bold text-primary tracking-tight">{stats.pendingReviews}</p>}
            {loading && (
              <div className="w-10 h-10 flex justify-center items-center rounded-full border-2 p-1 border-primary animate-pulse">
                <div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-primary animate-pulse [animation-delay:150ms]">
                  <div className="w-6 h-6 rounded-full border-2 border-primary animate-pulse [animation-delay:300ms]"></div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-surface-dim/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-surface-dim/30 bg-surface-bright/30 flex justify-between items-center shrink-0">
          <h3 className="font-playfair text-2xl font-bold text-primary">Recent Activity Feed</h3>
          <button onClick={fetchDashboardData} className="flex items-center gap-2 p-2.5 bg-white border border-surface-dim/30 hover:bg-surface-bright rounded-xl text-on-surface-variant transition-all shadow-sm cursor-pointer active:scale-95">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Refresh</span>
          </button>
        </div>
        
        <div className="overflow-x-auto mt-4 pb-4">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <tbody className="divide-y divide-surface-dim/20">
              {loading ? (
                <tr><td className="px-8 py-16 text-center text-on-surface-variant">Syncing recent activity...</td></tr>
              ) : recentActivity.length === 0 ? (
                <tr><td className="px-8 py-16 text-center text-on-surface-variant">No recent activity found.</td></tr>
              ) : (
                recentActivity.map((activity, idx) => (
                  <tr key={`${activity.activityType}-${activity.id || idx}`} className="hover:bg-surface-bright/50 transition-colors">
                    <td className="px-8 py-5 w-16">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border ${activity.activityType === 'REGISTRATION' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-primary/5 text-primary border-primary/10'}`}>
                        {activity.activityType === 'REGISTRATION' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <p className="font-bold text-primary text-base mb-1">
                        {activity.activityType === 'REGISTRATION' ? 'New Registration Request' : 'New Abstract Submission'}
                      </p>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {activity.activityType === 'REGISTRATION' ? activity.fullName : activity.title}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className="text-sm font-bold text-primary mb-1">
                        {activity.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-on-surface-variant font-mono uppercase tracking-widest">
                        {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}