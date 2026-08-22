// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopBar from "./components/AdminTopBar";
import PendingApprovals from "./components/PendingApprovals";
import FlaggedApprovals from "./components/FlaggedApprovals";
import ConfirmedDelegates from "./components/ConfirmedDelegates";
import AbstractReviews from "./components/AbstractReviews";
import Home from "./components/Home";
import SystemSettingsView from "./components/SystemSettings";
import DataExporter from "./components/DataExporter";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; role: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Layout State
  const [activeTab, setActiveTab] = useState("HOME");

  // Check Session on mount & reload
  useEffect(() => {
    try {
      const match = document.cookie.match(/(?:^|;\s*)admin_session=([^;]+)/);
      if (match && match[1]) {
        let cookieVal = match[1];
        
        // Fully unwrap any percent-encoding layers
        while (cookieVal.includes("%")) {
          cookieVal = decodeURIComponent(cookieVal);
        }
        
        const sessionData = JSON.parse(cookieVal);

        if (sessionData && (sessionData.authenticated || sessionData.role === "admin")) {
          setIsAuthenticated(true);
          setAdminUser({
            name: sessionData.name || "Abhijit Roy",
            role: sessionData.role || "Developer",
          });
        }
      }
    } catch (e) {
      console.warn("Session check parsing warning:", e);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setAdminUser(data.admin);
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "admin_session=; Max-Age=0; path=/;";
    setIsAuthenticated(false);
    setAdminUser(null);
    window.location.reload();
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --- RENDER LOGIN ---
  if (!isAuthenticated) {
    return (
      <LoginScreen
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        loading={loading}
        error={error}
      />
    );
  }

  // --- RENDER DASHBOARD LAYOUT ---
  return (
    <div className="fixed inset-0 bg-surface flex overflow-hidden">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 md:pl-64 flex flex-col h-screen w-full relative">
        <AdminTopBar
          activeTab={activeTab}
          adminUser={adminUser}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto w-full p-6 md:p-10">
          <div className="max-w-[1440px] mx-auto h-full flex flex-col">
            {activeTab === "HOME" && (
              <Home adminUser={adminUser} setActiveTab={setActiveTab} />
            )}

            {activeTab === "APPROVALS" && <PendingApprovals />}

            {activeTab === "FLAGGED" && <FlaggedApprovals />}

            {activeTab === "CONFIRMED" && <ConfirmedDelegates />}

            {activeTab === "REVIEWS" && <AbstractReviews />}

            {activeTab === "SETTINGS" && <SystemSettingsView />}

            {activeTab === "EXPORT-DATA" && <DataExporter />}
          </div>
        </main>
      </div>
    </div>
  );
}