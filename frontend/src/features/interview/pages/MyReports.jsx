import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { getUserReportsApi, deleteReportApi } from "../services/interview.api";
import toast from "react-hot-toast";
import "./MyReports.scss";

// SVG Icons with explicit sizes
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const TrashIcon = ({ width = 16, height = 16 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const DocumentIcon = ({ width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const MyReports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterScore, setFilterScore] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync state if URL search query changes
  useEffect(() => {
    const q = searchParams.get("search") || "";
    setSearchQuery(q);
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getUserReportsApi();
        if (data?.reports) {
          setReports(data.reports);
        }
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDeleteReport = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this interview report? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteReportApi(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
      toast.success("Report deleted successfully");
    } catch (err) {
      console.error("Failed to delete report:", err);
      toast.error(err.response?.data?.message || "Failed to delete report");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
    if (val.trim()) {
      setSearchParams({ search: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const getRoleTitle = (jobDesc) => {
    if (!jobDesc) return "Backend Developer";
    const firstLine = jobDesc.trim().split("\n")[0].replace(/^Position:\s*/i, "").replace(/^Role:\s*/i, "");
    return firstLine.length > 40 ? firstLine.substring(0, 40) + "..." : firstLine;
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

  const filteredReports = reports.filter((rep) => {
    const titleMatch = (rep.jobDescription || "Backend Developer")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (!titleMatch) return false;

    if (filterScore === "high") return (rep.matchScore || 0) >= 80;
    if (filterScore === "medium") return (rep.matchScore || 0) >= 60 && (rep.matchScore || 0) < 80;
    if (filterScore === "low") return (rep.matchScore || 0) < 60;
    return true;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage) || 1;
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="my-reports-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-text">
          <h1 className="page-title">My Reports</h1>
          <p className="page-subtitle">
            View all your past resume analyses, review prep questions and track interview readiness over time.
          </p>
        </div>
      </header>

      {/* Search & Score Filter Pills */}
      <div className="controls-bar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search reports by job title, keywords..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="score-filters">
          <button
            type="button"
            className={`filter-btn ${filterScore === "all" ? "active" : ""}`}
            onClick={() => {
              setFilterScore("all");
              setCurrentPage(1);
            }}
          >
            All Reports ({reports.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${filterScore === "high" ? "active" : ""}`}
            onClick={() => {
              setFilterScore("high");
              setCurrentPage(1);
            }}
          >
            High Match (≥ 80%)
          </button>
          <button
            type="button"
            className={`filter-btn ${filterScore === "medium" ? "active" : ""}`}
            onClick={() => {
              setFilterScore("medium");
              setCurrentPage(1);
            }}
          >
            Good Match (60-79%)
          </button>
          <button
            type="button"
            className={`filter-btn ${filterScore === "low" ? "active" : ""}`}
            onClick={() => {
              setFilterScore("low");
              setCurrentPage(1);
            }}
          >
            Needs Prep (&lt; 60%)
          </button>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading your reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="empty-reports-container">
          <div className="empty-icon-box">
            <DocumentIcon width={28} height={28} />
          </div>
          <h3>No reports found</h3>
          <p>
            {searchQuery || filterScore !== "all"
              ? "No reports matched your filters. Try resetting the search or filter criteria."
              : "You haven't generated any resume analyses yet. Upload your resume to get started!"}
          </p>
          <Link to="/analyze" className="btn-empty-cta">
            Analyze Resume Now
          </Link>
        </div>
      ) : (
        <div className="reports-list-container">
          <div className="reports-list">
            {paginatedReports.map((report) => {
              const score = report.matchScore || 0;
              const isMint = score >= 80;
              const isSky = score >= 60 && score < 80;

              return (
                <div key={report._id} className="report-row-card">
                  <div className="row-left">
                    <div className={`doc-icon-box ${isMint ? "mint" : isSky ? "sky" : "amber"}`}>
                      <DocumentIcon width={20} height={20} />
                    </div>
                    <div className="row-texts">
                      <h3 className="job-title">{getRoleTitle(report.jobDescription)}</h3>
                      <span className="gen-date">Generated on {formatDate(report.createdAt)}</span>
                    </div>
                  </div>

                  <div className="row-right">
                    <span
                      className={`score-pill ${
                        isMint ? "pill-mint" : isSky ? "pill-sky" : "pill-amber"
                      }`}
                    >
                      {score}%
                    </span>

                    <Link to={`/report/${report._id}`} className="btn-view-link">
                      View
                    </Link>

                    <button
                      type="button"
                      className="btn-delete-report"
                      onClick={(e) => handleDeleteReport(report._id, e)}
                      disabled={deletingId === report._id}
                      title="Delete Report"
                      aria-label="Delete Report"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                type="button"
                className="btn-page-nav"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`btn-page-num ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="btn-page-nav"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyReports;
