import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import "./ProfileSettings.scss";

// SVG Icons
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const ProfileSettings = () => {
  const { user, updateProfile, authActionLoading } = useAuth();

  const currentUsername = user?.username || user?.name || "";
  const [fullName, setFullName] = useState(currentUsername);
  const [displayName, setDisplayName] = useState(user?.name || currentUsername);
  const [errorMsg, setErrorMsg] = useState("");

  // Dark Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      document.documentElement.getAttribute("data-theme") === "dark";
  });

  useEffect(() => {
    if (user?.username || user?.name) {
      setFullName(user.username || user.name);
      setDisplayName(user.name || user.username);
    }
  }, [user]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const validate = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Username cannot be empty";
    }
    if (trimmed.length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (trimmed.length > 30) {
      return "Username cannot exceed 30 characters";
    }
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(trimmed)) {
      return "Only letters, numbers, hyphens, underscores, and dots are allowed";
    }
    return "";
  };

  const handleFullNameChange = (e) => {
    const val = e.target.value;
    setFullName(val);
    setErrorMsg(validate(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(fullName);
    if (validationError) {
      setErrorMsg(validationError);
      toast.error(validationError);
      return;
    }

    if (fullName.trim() === currentUsername) {
      toast("No changes made to your username", { icon: "ℹ️" });
      return;
    }

    const result = await updateProfile(fullName.trim());
    if (result.success) {
      setErrorMsg("");
    }
  };

  const hasChanges = fullName.trim() !== currentUsername && fullName.trim().length >= 3;

  return (
    <div className="profile-settings-page">
      {/* Header */}
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and theme preferences.</p>
      </header>

      <div className="settings-cards-list">
        {/* Profile Information Section */}
        <section className="settings-section-card">
          <h2 className="section-title">Profile Information</h2>

          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className={`form-input ${errorMsg ? "has-error" : ""}`}
                value={fullName}
                onChange={handleFullNameChange}
                placeholder="nobita_nobi"
                disabled={authActionLoading}
              />
              {errorMsg && <span className="field-error-text">{errorMsg}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input readonly-input"
                value={user?.email || "nobita51205@gmail.com"}
                readOnly
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="displayName" className="form-label">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Yashvi kaushik"
              />
            </div>

            <button
              type="submit"
              className="btn-save-changes"
              disabled={!hasChanges || !!errorMsg || authActionLoading}
            >
              {authActionLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Appearance & Theme Section */}
        <section className="settings-section-card">
          <h2 className="section-title">Appearance</h2>

          <div className="preferences-list">
            <div className="pref-toggle-row">
              <div className="pref-meta-box">
                <div className="theme-icon-indicator">
                  {isDarkMode ? <MoonIcon /> : <SunIcon />}
                </div>
                <div className="pref-texts">
                  <span className="pref-label">Dark Mode</span>
                  <span className="pref-sublabel">
                    {isDarkMode ? "Dark theme active" : "Light theme active"}
                  </span>
                </div>
              </div>

              <label className="switch-toggle" aria-label="Toggle Dark Mode">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                />
                <span className="slider-round" />
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileSettings;
