import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import "./AppLayout.scss";

// SVG Brand and Nav Icons
const BrandLogoIcon = ({ width = 32, height = 32, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Clean Flat Document Outline */}
    <path
      d="M22 76 V22 C22 16.5 26.5 12 32 12 H56 L80 36 V52"
      stroke="currentColor"
      strokeWidth="8.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Folded Corner Flap */}
    <path
      d="M56 12 V34 C56 35.1 56.9 36 58 36 H80"
      stroke="currentColor"
      strokeWidth="8.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M58 14 L78 34 H62 C59.8 34 58 32.2 58 30 Z"
      fill="#0066FF"
    />

    {/* 3 Minimal Horizontal Resume Lines */}
    <line x1="34" y1="40" x2="49" y2="40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <line x1="34" y1="53" x2="58" y2="53" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <line x1="34" y1="66" x2="48" y2="66" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />

    {/* Smooth Upward-Curving Swoosh (Vivid Bright Blue) */}
    <path
      d="M11 72 C10.5 83 25 91 50 88 C69 85 79 73 83 56 L75 58 C69 70 57 78 40 79 C22 80 13 76 11 72 Z"
      fill="#0066FF"
    />

    {/* Sharp Upward Arrowhead */}
    <path
      d="M66 50 L89 40 L89 64 L78 56 Z"
      fill="#0066FF"
      stroke="#0066FF"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const DocumentSearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <circle cx="11.5" cy="14.5" r="2.5" />
    <path d="m13.5 16.5 2 2" />
  </svg>
);

const DocumentChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName = user?.username || user?.name || "Candidate";
  const userEmail = user?.email || "candidate@hirepath.ai";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-top">
          <Link to="/" className="sidebar-brand" aria-label="HirePath Home">
            <div className="brand-icon-box">
              <BrandLogoIcon width={32} height={32} />
            </div>
            <span className="brand-title">
              <span className="brand-hire">Hire</span>
              <span className="brand-path">Path</span>
            </span>
          </Link>

          <nav className="sidebar-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <DashboardIcon />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/analyze"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <DocumentSearchIcon />
              <span>Analyze Resume</span>
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <DocumentChartIcon />
              <span>My Reports</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <SettingsIcon />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-footer">
          <Link to="/settings" className="user-profile-badge" title="Manage Profile & Settings">
            <div className="avatar-circle">{userInitial}</div>
            <div className="user-info">
              <span className="user-name">{displayName}</span>
              <span className="user-email">{userEmail}</span>
            </div>
          </Link>

          <button type="button" className="btn-logout" onClick={handleLogout}>
            <LogoutIcon />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-content-wrapper">
        {/* Top Navbar */}
        <header className="app-topbar">
          <div className="topbar-spacer" />

          <div className="topbar-right">
            <Link to="/settings" className="topbar-avatar" title={displayName}>
              {userInitial}
            </Link>
          </div>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
