import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "./auth.form.scss";

// SVG Icons matching the cyan/teal registration mockup
const LogoSquareIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="4" />
  </svg>
);

const DocumentUploadIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <polyline points="9 15 12 12 15 15" />
  </svg>
);

const BarChartIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ShieldCheckIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="3" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="20" height="20">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loginWithGithub, authActionLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call backend registration via useAuth hook
    const result = await register({
      username: formData.fullName,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      // Redirect to /login after successful registration
      navigate("/login");
    }
  };

  return (
    <div className="auth-page">
      {/* Background Ambient Glows */}
      <div className="bg-glow bg-glow-top-left" aria-hidden="true" />
      <div className="bg-glow bg-glow-center-right" aria-hidden="true" />
      <div className="bg-glow bg-glow-bottom-left" aria-hidden="true" />

      {/* Decorative Bottom Cyan Wave Ribbons with Glowing Node Point */}
      <svg
        className="bg-waves"
        viewBox="0 0 1000 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M-50,420 C180,360 280,440 460,360 C640,280 720,380 1020,320"
          stroke="url(#cyanGrad1)"
          strokeWidth="2.5"
          strokeOpacity="0.75"
        />
        <path
          d="M-80,450 C140,390 250,470 430,390 C610,310 690,410 990,350"
          stroke="url(#cyanGrad2)"
          strokeWidth="1.8"
          strokeOpacity="0.55"
        />
        <path
          d="M-30,480 C190,420 300,500 480,420 C660,340 740,440 1040,380"
          stroke="url(#cyanGrad3)"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        <circle cx="305" cy="395" r="3.5" fill="#22d3ee" filter="url(#glowFilterRegister)" />

        <defs>
          <filter id="glowFilterRegister" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22d3ee" floodOpacity="0.9" />
          </filter>
          <linearGradient id="cyanGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="cyanGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0e7490" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cyanGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#155e75" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="auth-container">
        {/* Left Column: Hero & Feature Showcase */}
        <section className="auth-hero">
          <Link to="/" className="brand-logo" aria-label="GenResume Home">
            <div className="logo-icon-wrapper">
              <LogoSquareIcon />
            </div>
            <span className="brand-name">GenResume</span>
          </Link>

          <div className="hero-tag-row">
            <span className="hero-tag">START YOUR JOURNEY</span>
            <span className="hero-tag-line" aria-hidden="true" />
          </div>

          <h1 className="hero-title">
            A smarter <br />
            career starts <br />
            <span className="gradient-here">here.</span>
          </h1>

          <p className="hero-description">
            Create your account and get personalized resume insights to stand out and land your dream role.
          </p>

          <div className="hero-features-wrapper">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <DocumentUploadIcon />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Upload & Analyze</h3>
                <p className="feature-text">Get instant AI feedback</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <BarChartIcon />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Improve Faster</h3>
                <p className="feature-text">Actionable suggestions</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <ShieldCheckIcon />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Your Data, Your Control</h3>
                <p className="feature-text">We keep your information safe</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Glassmorphic Registration Card */}
        <section className="auth-card-wrapper">
          <div className="auth-card">
            <div className="card-header">
              <h2 className="card-title">Create your account</h2>
              <p className="card-subtitle">
                Join GenResume and take the next step towards a brighter career!
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Full Name Field */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Full name
                </label>
                <div className={`input-wrapper ${errors.fullName ? "has-error" : ""}`}>
                  <span className="input-icon-left" aria-hidden="true">
                    <UserIcon />
                  </span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    disabled={authActionLoading}
                    required
                  />
                </div>
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <div className={`input-wrapper ${errors.email ? "has-error" : ""}`}>
                  <span className="input-icon-left" aria-hidden="true">
                    <MailIcon />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={authActionLoading}
                    required
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className={`input-wrapper ${errors.password ? "has-error" : ""}`}>
                  <span className="input-icon-left" aria-hidden="true">
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={authActionLoading}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={authActionLoading}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password ? (
                  <span className="error-message">{errors.password}</span>
                ) : (
                  <span className="form-helper-text">
                    Use at least 8 characters with a number and a symbol.
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-submit" disabled={authActionLoading}>
                {authActionLoading ? (
                  <>
                    <div className="btn-spinner" aria-hidden="true" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRightIcon className="btn-arrow-icon" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              {/* Social Login Buttons Container */}
              <div className="social-buttons-container">
                {/* Google Sign-up Button */}
                <button
                  type="button"
                  className="btn-google"
                  onClick={async () => {
                    const result = await loginWithGoogle();
                    if (result.success) {
                      navigate("/");
                    }
                  }}
                  disabled={authActionLoading}
                >
                  <GoogleIcon className="google-icon" />
                  <span>Google</span>
                </button>

                {/* GitHub Sign-up Button */}
                <button
                  type="button"
                  className="btn-github"
                  onClick={async () => {
                    const result = await loginWithGithub();
                    if (result.success) {
                      navigate("/");
                    }
                  }}
                  disabled={authActionLoading}
                >
                  <GithubIcon className="github-icon" />
                  <span>GitHub</span>
                </button>
              </div>

              {/* Footer */}
              <div className="auth-footer">
                <span>Already have an account?</span>
                <Link to="/login" className="create-account-link">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;