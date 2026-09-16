import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { generateReportApi } from "../services/interview.api";
import toast from "react-hot-toast";
import "./AnalyzeResume.scss";

// SVG Icons with explicit size attributes
const UploadCloudIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

const PdfDocumentIcon = () => (
  <svg width="24" height="24" className="pdf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const AnalyzingIllustration = () => (
  <svg
    width="180"
    height="150"
    viewBox="0 0 240 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="analyzing-illustration-svg"
  >
    <defs>
      {/* Soft Ambient Glow */}
      <radialGradient id="ambGlowAnalyze" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
        <stop offset="70%" stopColor="#2563EB" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
      </radialGradient>

      {/* Document Shadow */}
      <filter id="doc3DShadowAnalyze" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="2" dy="16" stdDeviation="14" floodColor="#1E3A8A" floodOpacity="0.16" />
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3B82F6" floodOpacity="0.1" />
      </filter>

      {/* Arrow Shadow */}
      <filter id="arrow3DShadowAnalyze" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0284C7" floodOpacity="0.35" />
        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#1D4ED8" floodOpacity="0.3" />
      </filter>

      {/* Document Gradient */}
      <linearGradient id="docSurfaceGradAnalyze" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F6FE" />
      </linearGradient>

      {/* Arrow Gradient */}
      <linearGradient id="arrowDynamicGradAnalyze" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="30%" stopColor="#0066FF" />
        <stop offset="100%" stopColor="#0052EA" />
      </linearGradient>
    </defs>

    {/* Ambient Backdrop Glow */}
    <circle cx="140" cy="95" r="75" fill="url(#ambGlowAnalyze)" />

    {/* Tilted 3D Document Group */}
    <g transform="translate(136, 88) rotate(11)" filter="url(#doc3DShadowAnalyze)">
      {/* Document Base */}
      <rect
        x="-42"
        y="-60"
        width="84"
        height="120"
        rx="14"
        fill="url(#docSurfaceGradAnalyze)"
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
    <g filter="url(#arrow3DShadowAnalyze)">
      {/* Smooth swooping tail ribbon */}
      <path
        d="M50 152 C 90 148, 140 125, 172 88"
        stroke="url(#arrowDynamicGradAnalyze)"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrowhead */}
      <path
        d="M158 88 L188 64 L184 102 L172 90 Z"
        fill="url(#arrowDynamicGradAnalyze)"
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

const processingSteps = [
  "Extracting information from your resume",
  "Analyzing skills and experience",
  "Matching with job requirements",
  "Generating interview questions",
  "Creating your personalized preparation plan"
];

const AnalyzeResume = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const handleFileSelection = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      toast.error("Please select a valid PDF file");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("PDF file size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload your resume PDF");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please paste the job description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("selfDescription", selfDescription.trim());
    formData.append("jobDescription", jobDescription.trim());

    setIsProcessing(true);
    setActiveStepIndex(0);

    try {
      const result = await generateReportApi(formData);
      if (result?.report?._id) {
        toast.success("Analysis complete!");
        navigate(`/report/${result.report._id}`);
      } else {
        toast.error("Unexpected response from server");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Analysis generation error:", error);
      const msg = error?.response?.data?.message || error?.message || "Failed to generate interview report";
      toast.error(msg);
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const hasFile = Boolean(file);
  const hasDetails = Boolean(selfDescription.trim());
  const hasJobDesc = Boolean(jobDescription.trim());

  // Step state calculations
  const step1Done = hasFile;
  const step1Active = !hasFile;

  const step2Done = hasDetails;
  const step2Active = hasFile && !hasDetails && !hasJobDesc;

  const step3Done = hasJobDesc;
  const step3Active = hasFile && !hasJobDesc;

  const step4Active = hasFile && hasJobDesc;

  return (
    <div className="analyze-page">
      {/* Header */}
      <header className="analyze-header">
        <div className="header-title-box">
          <h1 className="page-title">Analyze Your Resume</h1>
          <p className="page-subtitle">
            Upload your resume and the target job description to generate custom interview questions and a tailored preparation plan.
          </p>
        </div>
      </header>

      {/* Main Container */}
      {isProcessing ? (
        <section className="processing-card">
          <div className="illustration-wrapper">
            <AnalyzingIllustration />
          </div>

          <h2 className="processing-title">Analyzing Your Resume</h2>
          <p className="processing-subtitle">
            Our AI is reviewing your resume, matching it with the job description and generating personalized insights.
          </p>

          <div className="processing-steps-list">
            {processingSteps.map((step, idx) => {
              const isDone = idx < activeStepIndex;
              const isActive = idx === activeStepIndex;
              return (
                <div
                  key={step}
                  className={`step-item ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                >
                  <div className="step-bullet">
                    {isDone ? (
                      <CheckIcon />
                    ) : isActive ? (
                      <span className="active-dot" />
                    ) : (
                      <span className="pending-dot" />
                    )}
                  </div>
                  <span className="step-text">{step}</span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="progress-percentage">{progressPercent}%</span>
          </div>

          <p className="processing-notice">
            This may take a few moments. Please don't close this page.
          </p>
        </section>
      ) : (
        <div className="analyze-flow-card">
          {/* Stepper Bar */}
          <div className="stepper-bar">
            {/* Step 1 */}
            <div className={`step-node ${step1Done ? "completed" : step1Active ? "active" : ""}`}>
              <span className="step-num">
                {step1Done ? <CheckIcon /> : 1}
              </span>
              <span className="step-label">Upload</span>
            </div>

            <div className={`step-divider ${step1Done ? "active" : ""}`} />

            {/* Step 2 */}
            <div className={`step-node ${step2Done ? "completed" : step2Active ? "active" : ""}`}>
              <span className="step-num">
                {step2Done ? <CheckIcon /> : 2}
              </span>
              <span className="step-label">Your Details</span>
            </div>

            <div className={`step-divider ${step1Done && (step2Done || hasJobDesc) ? "active" : ""}`} />

            {/* Step 3 */}
            <div className={`step-node ${step3Done ? "completed" : step3Active ? "active" : ""}`}>
              <span className="step-num">
                {step3Done ? <CheckIcon /> : 3}
              </span>
              <span className="step-label">Job Description</span>
            </div>

            <div className={`step-divider ${step4Active ? "active" : ""}`} />

            {/* Step 4 */}
            <div className={`step-node ${step4Active ? "active" : ""}`}>
              <span className="step-num">4</span>
              <span className="step-label">Get Insights</span>
            </div>
          </div>

          <form className="analyze-form" onSubmit={handleSubmit}>
            {/* Step 1 */}
            <div className="form-group-section">
              <label className="section-label">1. Upload your resume (PDF)</label>
              <p className="section-sublabel">Upload your latest resume. PDF format up to 5MB.</p>

              {file ? (
                <div className="selected-file-box">
                  <div className="file-info-left">
                    <PdfDocumentIcon />
                    <div className="file-name-meta">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={() => setFile(null)}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  className={`file-dropzone ${isDragOver ? "drag-over" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="file-input-hidden"
                    accept="application/pdf"
                    onChange={(e) => handleFileSelection(e.target.files?.[0])}
                  />
                  <div className="dropzone-icon-circle">
                    <UploadCloudIcon />
                  </div>
                  <p className="dropzone-title">Click to upload or drag & drop</p>
                  <span className="dropzone-subtitle">PDF files only (Max 5MB)</span>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div className="form-group-section">
              <label className="section-label" htmlFor="selfDescription">
                2. Tell us about yourself
              </label>
              <textarea
                id="selfDescription"
                className="form-textarea"
                rows={3}
                placeholder="Eg. I'm a 3rd year CSE student with a strong interest in backend development using Node.js and MongoDB. I have built RESTful APIs and want to improve on System Design and Caching..."
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>

            {/* Step 3 */}
            <div className="form-group-section">
              <label className="section-label" htmlFor="jobDescription">
                3. Paste the job description
              </label>
              <textarea
                id="jobDescription"
                className="form-textarea"
                rows={5}
                placeholder="Position: Backend Developer (Node.js)&#10;Responsibilities: Design REST APIs, database queries, Redis caching...&#10;Required Skills: 2+ years Node.js, MongoDB, microservices..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <button type="submit" className="btn-analyze-submit">
              <span>Analyze Resume</span>
              <ArrowRightIcon />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AnalyzeResume;
