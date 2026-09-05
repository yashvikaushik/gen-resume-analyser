import React, { useState } from "react";
import { Link } from "react-router";
import "./auth.form.scss";

// SVG Icons matching the new cyan/teal mockup
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

const LineChartIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
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

const TrendUpIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
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

const Login = () => {
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // UI-only submission handling
    console.log("Sign in form submitted (UI only):", formData);
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
        {/* Glowing Node Dot on the wave line */}
        <circle cx="305" cy="395" r="3.5" fill="#22d3ee" filter="url(#glowFilter)" />

        <defs>
          <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
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
            <span className="hero-tag">WELCOME BACK</span>
            <span className="hero-tag-line" aria-hidden="true" />
          </div>

          <h1 className="hero-title">
            Let AI open <br />
            <span className="gradient-doors">doors</span> for you.
          </h1>

          <p className="hero-description">
            Smart resume analysis that helps you stand out and land your dream role faster.
          </p>

          <div className="hero-features-wrapper">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <LineChartIcon />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">AI insights</h3>
                <p className="feature-text">Get personalized feedback in seconds</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <ShieldCheckIcon />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Your data is safe</h3>
                <p className="feature-text">We never share your information</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <TrendUpIcon />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Faster growth</h3>
                <p className="feature-text">Actionable tips to help you grow</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Glassmorphic Sign In Card */}
        <section className="auth-card-wrapper">
          <div className="auth-card">
            <div className="card-header">
              <h2 className="card-title">Sign in</h2>
              <p className="card-subtitle">Glad to see you again!</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* Forgot Password Link */}
              <div className="forgot-password-row">
                <a
                  href="#forgot-password"
                  onClick={(e) => e.preventDefault()}
                  className="forgot-link"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-submit">
                <span>Sign in</span>
                <ArrowRightIcon className="btn-arrow-icon" />
              </button>

              {/* Divider */}
              <div className="auth-divider">
                <span>or</span>
              </div>

              {/* Footer */}
              <div className="auth-footer">
                <span>Don't have an account?</span>
                <Link to="/register" className="create-account-link">
                  Create account
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;