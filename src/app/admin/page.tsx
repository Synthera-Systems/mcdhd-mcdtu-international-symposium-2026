"use client";
export const runtime = 'edge';
import { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopBar from "./components/AdminTopBar";
import PendingApprovals from "./components/PendingApprovals";
import AbstractReviews from "./components/AbstractReviews";
import Home from "./components/Home";
import SystemSettingsView from "./components/SystemSettings";
import DataExporter from "./components/DataExporter";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{name: string, role: string} | null>(null);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 👈 Added

  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Layout State
  const [activeTab, setActiveTab] = useState("HOME"); 

  // Check Session
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const adminCookie = cookies.find(c => c.trim().startsWith('admin_session='));
    
    if (adminCookie) {
      try {
        const decoded = decodeURIComponent(adminCookie.split('=')[1]);
        const sessionData = JSON.parse(decoded);
        if (sessionData.authenticated) {
          setIsAuthenticated(true);
          setAdminUser({ name: sessionData.name, role: sessionData.role });
        }
      } catch (e) {
        document.cookie = "admin_session=; Max-Age=0; path=/;";
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setAdminUser(data.admin);
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) { setError("Network error."); } 
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    document.cookie = "admin_session=; Max-Age=0; path=/;"; 
    window.location.reload();
  };

  // --- RENDER LOGIN ---
  if (!isAuthenticated) {
    return <LoginScreen handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} loading={loading} error={error} />;
  }

  // --- RENDER DASHBOARD LAYOUT ---
  return (
    <div className="fixed inset-0 bg-surface flex overflow-hidden">
      
      {/* Dynamic Mobile & Desktop Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col h-screen w-full relative">
        
        {/* Fixed Topbar */}
        <AdminTopBar 
          activeTab={activeTab} 
          adminUser={adminUser}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        {/* Scrollable Content Canvas */}
        <main className="flex-1 overflow-y-auto w-full p-6 md:p-10 ">
          <div className="max-w-[1440px] mx-auto h-full flex flex-col">
            
            {activeTab === "HOME" && (
              <Home adminUser={adminUser} setActiveTab={setActiveTab} />
            )}
            
            {activeTab === "APPROVALS" && (
              <PendingApprovals />
            )}

            {activeTab === "REVIEWS" && (
              <AbstractReviews />
            )}

            {activeTab === "SETTINGS" && (
              <SystemSettingsView />
            )}

            {activeTab === "EXPORT-DATA" && (
              <DataExporter />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}