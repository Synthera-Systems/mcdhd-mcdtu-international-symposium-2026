"use client";

interface TopBarProps {
  activeTab: string;
  adminUser: { name: string; role: string } | null;
  onMenuClick: () => void; // 👈 Added
}

export default function AdminTopBar({ activeTab, adminUser, onMenuClick }: TopBarProps) {
  const getTitle = () => {
    if (activeTab === "HOME") return "Dashboard";
    if (activeTab === "APPROVALS") return "Pending Approvals";
    if (activeTab === "REVIEWS") return "Abstract Reviews";
    if (activeTab === "SETTINGS") return "System Settings";
    return "Admin Panel";
  };

  return (
    <header className="h-24 bg-surface flex items-center justify-between px-8 lg:px-10 shrink-0 border-b border-surface-dim/30 z-30 relative">
      <div className="flex items-center gap-4">
        {/* 👇 Attached onClick handler */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-surface-bright text-primary cursor-pointer transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <h2 className="font-playfair text-3xl font-bold text-primary tracking-tight">
          {getTitle()}
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="font-inter text-sm font-bold text-primary">{adminUser?.name || 'Administrator'}</p>
          <p className="font-inter text-xs text-on-surface-variant">{adminUser?.role || 'System Admin'}</p>
        </div>
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm border border-surface-dim/30">
          {adminUser?.name?.charAt(0) || 'A'}
        </div>
      </div>
    </header>
  );
}