"use client";

import { useState, useMemo } from "react";

const STATUSES = ["All", "Applied", "Interview", "Offer", "Rejected"];
const PLATFORMS = [
  "All",
  "LinkedIn",
  "Naukri",
  "Internshala",
  "Indeed",
  "Glassdoor",
  "AngelList",
  "Unstop",
  "HackerEarth",
  "Company Website",
  "Referral",
  "Other",
];
const WORK_TYPES = ["All", "Remote", "Onsite", "Hybrid"];

export default function ApplicationsTable({
  applications,
  onUpdate,
  onDelete,
  onEdit,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [workTypeFilter, setWorkTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const filtered = useMemo(() => {
    return applications
      .filter((app) => {
        const searchLower = search.toLowerCase();
        const matchSearch =
          !search ||
          app.company.toLowerCase().includes(searchLower) ||
          app.role.toLowerCase().includes(searchLower);
        const matchStatus =
          statusFilter === "All" || app.status === statusFilter;
        const matchPlatform =
          platformFilter === "All" || app.platform === platformFilter;
        const matchWork =
          workTypeFilter === "All" || app.workType === workTypeFilter;
        return matchSearch && matchStatus && matchPlatform && matchWork;
      })
      .sort((a, b) => {
        if (sortBy === "date")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "company") return a.company.localeCompare(b.company);
        if (sortBy === "status") return a.status.localeCompare(b.status);
        return 0;
      });
  }, [
    applications,
    search,
    statusFilter,
    platformFilter,
    workTypeFilter,
    sortBy,
  ]);

  const getDaysAgo = (dateStr) => {
    if (!dateStr) return null;
    const days = Math.round(
      (Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24),
    );
    if (days === 0) return "Today";
    if (days === 1) return "1d ago";
    return `${days}d ago`;
  };

  return (
    <div>
      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="form-input"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Status" : s}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p === "All" ? "All Platforms" : p}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          value={workTypeFilter}
          onChange={(e) => setWorkTypeFilter(e.target.value)}
        >
          {WORK_TYPES.map((w) => (
            <option key={w} value={w}>
              {w === "All" ? "Remote/Onsite" : w}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort: Newest</option>
          <option value="company">Sort: Company</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>

      <div
        style={{ marginBottom: 10, fontSize: 12, color: "var(--text-muted)" }}
      >
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔎</div>
          <h3>No applications found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Platform</th>
                <th>Type</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id}>
                  <td className="company-cell">
                    <div>{app.company}</div>
                    {app.jobLink && (
                      <a
                        href={app.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Job ↗
                      </a>
                    )}
                  </td>
                  <td>{app.role}</td>
                  <td>
                    {app.platform || (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    {app.workType ? (
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          borderRadius: 20,
                          background: "var(--bg-hover)",
                          color: "var(--text-muted)",
                          border: "1px solid var(--border)",
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                        }}
                      >
                        {app.workType}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}>
                      {app.dateApplied
                        ? new Date(app.dateApplied).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "2-digit" },
                          )
                        : "—"}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginTop: 1,
                      }}
                    >
                      {getDaysAgo(app.createdAt)}
                    </div>
                  </td>
                  <td>
                    <select
                      className="filter-select"
                      value={app.status}
                      onChange={(e) =>
                        onUpdate(app.id, { status: e.target.value })
                      }
                      style={{ fontSize: 11 }}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn-ghost"
                        style={{ padding: "5px 10px", fontSize: 11 }}
                        onClick={() => onEdit(app)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => {
                          if (
                            window.confirm(`Delete ${app.company} application?`)
                          )
                            onDelete(app.id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
