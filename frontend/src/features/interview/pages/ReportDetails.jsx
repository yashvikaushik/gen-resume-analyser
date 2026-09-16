import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getReportByIdApi } from "../services/interview.api";
import toast from "react-hot-toast";
import "./ReportDetails.scss";

// SVG Icons
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, flexShrink: 0 }}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const QuestionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const CalendarPlanIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [openAccordions, setOpenAccordions] = useState({ 0: true });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getReportByIdApi(id);
        if (data?.report) {
          setReport(data.report);
        }
      } catch (err) {
        console.error("Failed to load report:", err);
        toast.error("Failed to load report details");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="report-details-page">
        <div style={{ textAlign: "center", padding: "5rem 0", color: "#64748B" }}>
          <p>Loading your interview report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-details-page">
        <div style={{ textAlign: "center", padding: "5rem 0", color: "#64748B" }}>
          <p>Report not found.</p>
          <Link to="/reports" style={{ color: "#2563EB", marginTop: "1rem", display: "inline-block", fontWeight: 700 }}>
            ← Back to My Reports
          </Link>
        </div>
      </div>
    );
  }

  const matchScore = report.matchScore || 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

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

  const techCount = report.technicalQuestions?.length || 0;
  const behavioralCount = report.behavioralQuestions?.length || 0;
  const totalQuestions = techCount + behavioralCount;
  const skillGapCount = report.skillGaps?.length || 0;
  const planDays = report.preparationPlan?.length || 0;

  // Fallback summary items if not populated
  const summaryText =
    report.summary ||
    `Your resume shows strong skills and relevant experience for this ${getRoleTitle(
      report.jobDescription
    )} role. Bridging the identified skill gaps and practicing targeted interview questions will maximize your readiness.`;

  const keyStrengths = report.keyStrengths && report.keyStrengths.length > 0
    ? report.keyStrengths
    : [
        "Strong core development and problem-solving skills",
        "Hands-on project experience with modern stack",
        "Clear technical communication and API design understanding",
      ];

  const areasToImprove = report.areasToImprove && report.areasToImprove.length > 0
    ? report.areasToImprove
    : (report.skillGaps?.map((s) => s.skill) || [
        "System architecture & scalability tradeoffs",
        "Cloud platform integrations (AWS/GCP)",
        "Advanced caching & performance tuning",
      ]);

  return (
    <div className="report-details-page">
      {/* Top Header */}
      <header className="report-header screen-only">
        <div className="header-left">
          <Link to="/reports" className="btn-back-link">
            <ArrowLeftIcon />
            <span>Back to My Reports</span>
          </Link>
          <h1 className="report-page-title">{getRoleTitle(report.jobDescription)} – Analysis</h1>
          <p className="report-page-subtitle">Generated on {formatDate(report.createdAt)}</p>
        </div>

        <div className="header-actions screen-only">
          <button type="button" className="btn-download-pdf" onClick={handleDownload}>
            <DownloadIcon />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="report-tabs-bar screen-only">
        <button
          type="button"
          className={`report-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          type="button"
          className={`report-tab-btn ${activeTab === "technical" ? "active" : ""}`}
          onClick={() => setActiveTab("technical")}
        >
          Technical Questions ({techCount})
        </button>

        <button
          type="button"
          className={`report-tab-btn ${activeTab === "behavioral" ? "active" : ""}`}
          onClick={() => setActiveTab("behavioral")}
        >
          Behavioral Questions ({behavioralCount})
        </button>

        <button
          type="button"
          className={`report-tab-btn ${activeTab === "skills" ? "active" : ""}`}
          onClick={() => setActiveTab("skills")}
        >
          Skill Gaps ({skillGapCount})
        </button>

        <button
          type="button"
          className={`report-tab-btn ${activeTab === "plan" ? "active" : ""}`}
          onClick={() => setActiveTab("plan")}
        >
          Preparation Plan ({planDays} Days)
        </button>
      </nav>

      {/* Screen Interactive Tab Content */}
      <div className="tab-content-wrapper screen-only">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="overview-layout-grid">
            {/* Left Score Card & Mini Stats */}
            <div className="overview-left-card">
              <div className="score-gauge-box">
                <svg className="gauge-svg" viewBox="0 0 130 130">
                  <circle className="gauge-bg" cx="65" cy="65" r={radius} />
                  <circle
                    className="gauge-progress"
                    cx="65"
                    cy="65"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="gauge-center-text">
                  <span className="score-number">{matchScore}%</span>
                </div>
              </div>

              <span className="score-title-text">Match Score</span>
              <p className="score-subtext">Great match for your target role!</p>

              {/* Mini Stats Row */}
              <div className="overview-mini-stats">
                <div className="mini-stat-item">
                  <div className="mini-stat-icon icon-blue">
                    <QuestionIcon />
                  </div>
                  <span className="mini-stat-label">Questions</span>
                  <span className="mini-stat-val">{totalQuestions}</span>
                </div>

                <div className="mini-stat-item">
                  <div className="mini-stat-icon icon-mint">
                    <TargetIcon />
                  </div>
                  <span className="mini-stat-label">Skill Gaps</span>
                  <span className="mini-stat-val">{skillGapCount}</span>
                </div>

                <div className="mini-stat-item">
                  <div className="mini-stat-icon icon-purple">
                    <CalendarPlanIcon />
                  </div>
                  <span className="mini-stat-label">Days Plan</span>
                  <span className="mini-stat-val">{planDays}</span>
                </div>
              </div>
            </div>

            {/* Right Summary & Key Findings Card */}
            <div className="overview-right-card">
              {/* Summary Section */}
              <div className="overview-section">
                <h3 className="section-title">Summary</h3>
                <p className="summary-paragraph">{summaryText}</p>
              </div>

              {/* Key Strengths */}
              <div className="overview-section">
                <h3 className="section-title">Key Strengths</h3>
                <ul className="points-list strengths-list">
                  {keyStrengths.map((st, idx) => (
                    <li key={idx} className="point-item">
                      <CheckIcon />
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="overview-section">
                <h3 className="section-title">Areas to Improve</h3>
                <ul className="points-list improve-list">
                  {areasToImprove.map((item, idx) => (
                    <li key={idx} className="point-item">
                      <AlertTriangleIcon />
                      <span>{typeof item === "string" ? item : item.skill || item.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICAL QUESTIONS */}
        {activeTab === "technical" && (
          <div className="questions-list">
            {report.technicalQuestions?.map((q, idx) => (
              <div key={idx} className="question-card">
                <div className="question-card-header" onClick={() => toggleAccordion(idx)}>
                  <span className="question-title-text">
                    Q{idx + 1}. {q.question}
                  </span>
                  <ChevronDownIcon className={`accordion-chevron ${openAccordions[idx] ? "open" : ""}`} />
                </div>

                {openAccordions[idx] && (
                  <div className="question-card-body">
                    {q.intend && (
                      <div className="answer-section-box intend-box">
                        <div className="box-header">
                          <span>What the interviewer wants to assess</span>
                        </div>
                        <p className="box-body-text">{q.intend}</p>
                      </div>
                    )}

                    {q.answer && (
                      <div className="answer-section-box answer-box">
                        <div className="box-header">
                          <span>Suggested answer</span>
                        </div>
                        <p className="box-body-text">{q.answer}</p>
                      </div>
                    )}

                    <div className="answer-section-box tip-box">
                      <div className="box-header">
                        <span>Pro tip</span>
                      </div>
                      <p className="box-body-text">
                        Use diagrams to explain the flow or system interactions. Keep the explanation high-level first, then go into depth based on follow-up questions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: BEHAVIORAL QUESTIONS */}
        {activeTab === "behavioral" && (
          <div className="questions-list">
            {report.behavioralQuestions?.map((q, idx) => (
              <div key={idx} className="question-card">
                <div className="question-card-header" onClick={() => toggleAccordion(`b-${idx}`)}>
                  <span className="question-title-text">
                    Q{idx + 1}. {q.question}
                  </span>
                  <ChevronDownIcon className={`accordion-chevron ${openAccordions[`b-${idx}`] ? "open" : ""}`} />
                </div>

                {openAccordions[`b-${idx}`] && (
                  <div className="question-card-body">
                    {q.intend && (
                      <div className="answer-section-box intend-box">
                        <div className="box-header">
                          <span>Interviewer Goal</span>
                        </div>
                        <p className="box-body-text">{q.intend}</p>
                      </div>
                    )}

                    {q.answer && (
                      <div className="answer-section-box answer-box">
                        <div className="box-header">
                          <span>Recommended STAR Approach</span>
                        </div>
                        <p className="box-body-text">{q.answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SKILL GAPS */}
        {activeTab === "skills" && (
          <div className="skill-gaps-container">
            {report.skillGaps?.map((item, idx) => (
              <div key={idx} className="skill-gap-card">
                <div className="skill-left-info">
                  <span className="skill-name-text">{item.skill}</span>
                  {item.reason && <p className="skill-reason-text">{item.reason}</p>}
                </div>
                <span className={`severity-pill ${item.severity || "medium"}`}>
                  {item.severity || "Medium"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: PREPARATION PLAN */}
        {activeTab === "plan" && (
          <div className="prep-plan-grid">
            {report.preparationPlan?.map((plan, idx) => (
              <div key={idx} className="plan-day-column-card">
                <div className="day-card-header">
                  <span className="day-number-label">Day {plan.day || idx + 1}</span>
                  <h4 className="day-focus-title">{plan.focusAreas}</h4>
                </div>
                <ul className="day-tasks-ul">
                  {plan.tasksOfDay?.map((task, tIdx) => (
                    <li key={tIdx} className="day-task-li">
                      <span className="task-bullet-dot" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dedicated Comprehensive Print View (Print Only) */}
      <div className="print-full-report">
        {/* Brand & Document Header */}
        <div className="print-doc-header">
          <div className="print-brand-row">
            <div className="print-logo-mark">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 76 V22 C22 16.5 26.5 12 32 12 H56 L80 36 V52" stroke="#0F172A" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M56 12 V34 C56 35.1 56.9 36 58 36 H80" stroke="#0F172A" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M58 14 L78 34 H62 C59.8 34 58 32.2 58 30 Z" fill="#0066FF" />
                <line x1="34" y1="40" x2="49" y2="40" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
                <line x1="34" y1="53" x2="58" y2="53" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
                <line x1="34" y1="66" x2="48" y2="66" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
                <path d="M11 72 C10.5 83 25 91 50 88 C69 85 79 73 83 56 L75 58 C69 70 57 78 40 79 C22 80 13 76 11 72 Z" fill="#0066FF" />
                <path d="M66 50 L89 40 L89 64 L78 56 Z" fill="#0066FF" stroke="#0066FF" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span className="print-brand-name">Hire<strong>Path</strong></span>
            </div>
            <span className="print-badge-tag">AI Interview Intelligence Report</span>
          </div>

          <div className="print-meta-info">
            <h1 className="print-target-title">{getRoleTitle(report.jobDescription)}</h1>
            <p className="print-date-line">Report generated on <strong>{formatDate(report.createdAt)}</strong></p>
          </div>
        </div>

        {/* 1. EXECUTIVE SUMMARY & STATS */}
        <div className="print-section print-summary-section">
          <h2 className="print-section-title">1. Executive Overview & Match Score</h2>
          
          <div className="print-score-banner">
            <div className="print-score-pill">
              <span className="print-score-val">{matchScore}%</span>
              <span className="print-score-lbl">Role Match Score</span>
            </div>
            <div className="print-stats-group">
              <div className="print-stat-item">
                <span className="p-stat-num">{techCount}</span>
                <span className="p-stat-lbl">Technical Qs</span>
              </div>
              <div className="print-stat-item">
                <span className="p-stat-num">{behavioralCount}</span>
                <span className="p-stat-lbl">Behavioral Qs</span>
              </div>
              <div className="print-stat-item">
                <span className="p-stat-num">{skillGapCount}</span>
                <span className="p-stat-lbl">Skill Gaps Identified</span>
              </div>
              <div className="print-stat-item">
                <span className="p-stat-num">{planDays} Days</span>
                <span className="p-stat-lbl">Prep Plan</span>
              </div>
            </div>
          </div>

          <div className="print-box print-overview-box">
            <h4 className="print-box-heading">Summary Analysis</h4>
            <p className="print-box-p">{summaryText}</p>
          </div>

          <div className="print-two-col-grid">
            <div className="print-col-box">
              <h4 className="print-col-title strengths-title">Key Strengths</h4>
              <ul className="print-bullet-list">
                {keyStrengths.map((st, idx) => (
                  <li key={idx}>✓ {st}</li>
                ))}
              </ul>
            </div>

            <div className="print-col-box">
              <h4 className="print-col-title gaps-title">Areas to Improve</h4>
              <ul className="print-bullet-list">
                {areasToImprove.map((item, idx) => (
                  <li key={idx}>! {typeof item === "string" ? item : item.skill || item.reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 2. TECHNICAL QUESTIONS & ANSWERS */}
        {report.technicalQuestions && report.technicalQuestions.length > 0 && (
          <div className="print-section">
            <h2 className="print-section-title">2. Technical Interview Questions & Suggested Answers ({report.technicalQuestions.length})</h2>
            <div className="print-questions-flow">
              {report.technicalQuestions.map((q, idx) => (
                <div key={idx} className="print-qa-card">
                  <div className="print-qa-header">
                    <span className="print-qa-index">Q{idx + 1}</span>
                    <h3 className="print-qa-title">{q.question}</h3>
                  </div>

                  {q.intend && (
                    <div className="print-inner-block intend-block">
                      <span className="print-block-label">Interviewer Goal / Assessment Intent:</span>
                      <p>{q.intend}</p>
                    </div>
                  )}

                  {q.answer && (
                    <div className="print-inner-block answer-block">
                      <span className="print-block-label">Recommended Response Approach & Key Points:</span>
                      <p>{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. BEHAVIORAL QUESTIONS & STAR STRATEGIES */}
        {report.behavioralQuestions && report.behavioralQuestions.length > 0 && (
          <div className="print-section">
            <h2 className="print-section-title">3. Behavioral & Culture-Fit Questions ({report.behavioralQuestions.length})</h2>
            <div className="print-questions-flow">
              {report.behavioralQuestions.map((q, idx) => (
                <div key={idx} className="print-qa-card">
                  <div className="print-qa-header">
                    <span className="print-qa-index">Q{idx + 1}</span>
                    <h3 className="print-qa-title">{q.question}</h3>
                  </div>

                  {q.intend && (
                    <div className="print-inner-block intend-block">
                      <span className="print-block-label">Interviewer Assessment Criteria:</span>
                      <p>{q.intend}</p>
                    </div>
                  )}

                  {q.answer && (
                    <div className="print-inner-block answer-block">
                      <span className="print-block-label">Suggested STAR Method Framework:</span>
                      <p>{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SKILL GAPS ANALYSIS */}
        {report.skillGaps && report.skillGaps.length > 0 && (
          <div className="print-section">
            <h2 className="print-section-title">4. Skill Gaps ({report.skillGaps.length})</h2>
            <div className="print-skill-table">
              <div className="print-table-row print-table-head">
                <span className="th-skill">Identified Skill</span>
                <span className="th-severity">Severity</span>
              </div>
              {report.skillGaps.map((g, idx) => (
                <div key={idx} className="print-table-row">
                  <span className="td-skill"><strong>{g.skill}</strong></span>
                  <span className="td-severity">
                    <span className={`print-sev-badge ${g.severity?.toLowerCase() || "medium"}`}>
                      {(g.severity || "Medium").toUpperCase()}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. PREPARATION PLAN */}
        {report.preparationPlan && report.preparationPlan.length > 0 && (
          <div className="print-section">
            <h2 className="print-section-title">5. Targeted Day-by-Day Preparation Plan ({report.preparationPlan.length} Days)</h2>
            <div className="print-plan-flow">
              {report.preparationPlan.map((p, idx) => (
                <div key={idx} className="print-plan-day-card">
                  <div className="print-day-header">
                    <span className="print-day-badge">Day {p.day || idx + 1}</span>
                    <h4 className="print-day-title">{p.focusAreas}</h4>
                  </div>
                  <ul className="print-plan-task-list">
                    {p.tasksOfDay?.map((task, tIdx) => (
                      <li key={tIdx}>
                        <span className="task-bullet">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="print-doc-footer">
          <span>HirePath AI Career Platform – Confidential Candidate Analysis</span>
          <span>hirepath.io</span>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
