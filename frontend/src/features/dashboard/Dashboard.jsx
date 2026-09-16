import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../auth/hooks/useAuth";
import { getUserReportsApi } from "../interview/services/interview.api";
import "./Dashboard.scss";

// SVG Icons with explicit width & height
const DocumentIcon = ({ width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const TargetIcon = ({ width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ActivityIcon = ({ width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const ArrowRightIcon = ({ width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const ResumeIllustration = () => (
  <svg
    width="210"
    height="170"
    viewBox="0 0 240 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="banner-illustration-svg"
  >
    <defs>
      {/* Soft Ambient Glow */}
      <radialGradient id="ambGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
        <stop offset="70%" stopColor="#2563EB" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
      </radialGradient>

      {/* Document Shadow */}
      <filter id="doc3DShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="2" dy="16" stdDeviation="14" floodColor="#1E3A8A" floodOpacity="0.16" />
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3B82F6" floodOpacity="0.1" />
      </filter>

      {/* Arrow Shadow */}
      <filter id="arrow3DShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0284C7" floodOpacity="0.35" />
        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#1D4ED8" floodOpacity="0.3" />
      </filter>

      {/* Document Gradient */}
      <linearGradient id="docSurfaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F6FE" />
      </linearGradient>

      {/* Arrow Gradient */}
      <linearGradient id="arrowDynamicGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="30%" stopColor="#0066FF" />
        <stop offset="100%" stopColor="#0052EA" />
      </linearGradient>
    </defs>

    {/* Ambient Backdrop Glow */}
    <circle cx="140" cy="95" r="75" fill="url(#ambGlow)" />

    {/* Tilted 3D Document Group */}
    <g transform="translate(136, 88) rotate(11)" filter="url(#doc3DShadow)">
      {/* Document Base */}
      <rect
        x="-42"
        y="-60"
        width="84"
        height="120"
        rx="14"
        fill="url(#docSurfaceGrad)"
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />

      {/* Purple/Lavender Resume Content Lines */}
      <rect x="-28" y="-42" width="34" height="7" rx="3.5" fill="#A5B4FC" opacity="0.95" />
      <rect x="-28" y="-28" width="56" height="7" rx="3.5" fill="#818CF8" opacity="0.85" />
      <rect x="-28" y="-14" width="56" height="7" rx="3.5" fill="#A5B4FC" opacity="0.75" />
      <rect x="-28" y="0" width="42" height="7" rx="3.5" fill="#C7D2FE" opacity="0.85" />
      <rect x="-28" y="14" width="28" height="7" rx="3.5" fill="#DDD6FE" opacity="0.8" />
    </g>

    {/* Dynamic Upward 3D Blue Arrow Swoosh */}
    <g filter="url(#arrow3DShadow)">
      {/* Smooth swooping tail ribbon */}
      <path
        d="M50 152 C 90 148, 140 125, 172 88"
        stroke="url(#arrowDynamicGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrowhead */}
      <path
        d="M158 88 L188 64 L184 102 L172 90 Z"
        fill="url(#arrowDynamicGrad)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </g>

    {/* Sparkle Star on the right */}
    <path
      d="M208 92 Q208 99 215 99 Q208 99 208 106 Q208 99 201 99 Q208 99 208 92Z"
      fill="#38BDF8"
      opacity="0.9"
    />
    <circle cx="218" cy="80" r="1.5" fill="#38BDF8" opacity="0.7" />
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getUserReportsApi();
        if (data?.reports) {
          setReports(data.reports);
        }
      } catch (err) {
        console.error("Failed to load dashboard reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const displayName = user?.username || user?.name || "Candidate";

  const totalReports = reports.length;
  const bestScore = reports.length > 0 ? Math.max(...reports.map((r) => r.matchScore || 0)) : 0;
  const activeAnalyses = reports.length > 0 ? Math.min(reports.length, 2) : 0;

  const getRoleTitle = (jobDesc) => {
    if (!jobDesc) return "Backend Developer";
    const firstLine = jobDesc.trim().split("\n")[0].replace(/^Position:\s*/i, "").replace(/^Role:\s*/i, "");
    return firstLine.length > 35 ? firstLine.substring(0, 35) + "..." : firstLine;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "17 Sept 2026";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard-page">
      {/* Greeting Header */}
      <header className="dashboard-header">
        <div className="header-greeting">
          <h1 className="greeting-title">
            Hello there, <span className="user-highlight">{displayName}</span>
          </h1>
          <p className="greeting-subtitle">Ready to take the next step in your career?</p>
        </div>
      </header>

      {/* 3 Metric Stat Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box icon-blue">
            <DocumentIcon width={22} height={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{loading ? "..." : totalReports}</span>
            <span className="stat-label">Reports Generated</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box icon-mint">
            <TargetIcon width={22} height={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{loading ? "..." : `${bestScore}%`}</span>
            <span className="stat-label">Best Match Score</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box icon-purple">
            <ActivityIcon width={22} height={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{loading ? "..." : activeAnalyses}</span>
            <span className="stat-label">Active Analyses</span>
          </div>
        </div>
      </section>

      {/* Action Banner */}
      <section className="action-banner">
        <div className="banner-content">
          <span className="banner-tag">TURN YOUR RESUME INTO</span>
          <h2 className="banner-title">OPPORTUNITIES</h2>
          <p className="banner-text">
            Get AI-powered insights, interview questions, skill gaps and a personalized preparation plan tailored to your target job.
          </p>
          <Link to="/analyze" className="btn-banner-cta">
            <span>Analyze Resume</span>
            <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>

        <div className="banner-graphic-wrapper" aria-hidden="true">
          <ResumeIllustration />
        </div>
      </section>

      {/* Recent Reports Section */}
      <section className="recent-reports-section">
        <div className="section-header">
          <h2 className="section-title">Recent Reports</h2>
          <Link to="/reports" className="view-all-link">
            View all →
          </Link>
        </div>

        <div className="reports-list">
          {loading ? (
            <div className="empty-state">
              <p>Loading your reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="empty-state">
              <DocumentIcon width={40} height={40} />
              <p>No reports found yet. Generate your first interview analysis!</p>
              <Link to="/analyze" className="btn-create-first">
                Analyze Resume Now →
              </Link>
            </div>
          ) : (
            reports.slice(0, 4).map((rep) => {
              const score = rep.matchScore || 0;
              const isHigh = score >= 80;
              return (
                <div key={rep._id} className="report-card-item">
                  <div className="report-main-info">
                    <div className={`report-doc-icon ${isHigh ? "icon-mint-doc" : "icon-blue-doc"}`}>
                      <DocumentIcon width={20} height={20} />
                    </div>
                    <div className="report-texts">
                      <span className="report-role-title">{getRoleTitle(rep.jobDescription)}</span>
                      <span className="report-date">Generated on {formatDate(rep.createdAt)}</span>
                    </div>
                  </div>

                  <div className="report-actions">
                    <span className={`score-pill ${isHigh ? "score-mint" : "score-blue"}`}>
                      {score}%
                    </span>
                    <Link to={`/report/${rep._id}`} className="btn-view-report">
                      View
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
