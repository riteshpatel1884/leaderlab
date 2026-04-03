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
const JOB_TYPES = ["All", "Job", "Internship"];
const PRIORITIES = ["All", "High", "Medium", "Low"];

const PRIORITY_COLORS = {
  High: { color: "var(--red)", bg: "var(--red-dim)" },
  Medium: { color: "var(--yellow)", bg: "var(--yellow-dim)" },
  Low: { color: "var(--green)", bg: "var(--green-dim)" },
};

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
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const filtered = useMemo(() => {
    return applications
      .filter((app) => {
        const q = search.toLowerCase();
        const matchSearch =
          !search ||
          app.company.toLowerCase().includes(q) ||
          app.role.toLowerCase().includes(q);
        const matchStatus =
          statusFilter === "All" || app.status === statusFilter;
        const matchPlatform =
          platformFilter === "All" || app.platform === platformFilter;
        const matchWork =
          workTypeFilter === "All" || app.workType === workTypeFilter;
        const matchJob =
          jobTypeFilter === "All" || app.jobType === jobTypeFilter;
        const matchPriority =
          priorityFilter === "All" || app.priority === priorityFilter;
        return (
          matchSearch &&
          matchStatus &&
          matchPlatform &&
          matchWork &&
          matchJob &&
          matchPriority
        );
      })
      .sort((a, b) => {
        if (sortBy === "date")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "company") return a.company.localeCompare(b.company);
        if (sortBy === "status") return a.status.localeCompare(b.status);
        if (sortBy === "priority") {
          const order = { High: 0, Medium: 1, Low: 2 };
          return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
        }
        return 0;
      });
  }, [
    applications,
    search,
    statusFilter,
    platformFilter,
    workTypeFilter,
    jobTypeFilter,
    priorityFilter,
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

  const getDaysSinceApplied = (dateStr) => {
    if (!dateStr) return null;
    return Math.round((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  };

  const isFollowUpDue = (app) => {
    if (!app.followUpDate || app.status !== "Applied") return false;
    return new Date(app.followUpDate) <= new Date();
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
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
        >
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "Job/Intern" : t}
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
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p === "All" ? "All Priority" : p}
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
          <option value="priority">Sort: Priority</option>
        </select>
      </div>

      <div
        style={{ marginBottom: 10, fontSize: 12, color: "var(--text-muted)" }}
      >
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        {filtered.filter(isFollowUpDue).length > 0 && (
          <span
            style={{ marginLeft: 10, color: "var(--yellow)", fontWeight: 600 }}
          >
            ⚡ {filtered.filter(isFollowUpDue).length} follow-up
            {filtered.filter(isFollowUpDue).length !== 1 ? "s" : ""} due
          </span>
        )}
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
                <th>Type</th>
                <th>Platform</th>
                <th>Applied</th>
                <th>Response</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => {
                const daysSince = getDaysSinceApplied(app.dateApplied);
                const followUpDue = isFollowUpDue(app);
                return (
                  <tr
                    key={app.id}
                    style={
                      followUpDue ? { background: "rgba(234,179,8,0.04)" } : {}
                    }
                  >
                    <td className="company-cell">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {app.company}
                        {app.applyType === "Referral" && (
                          <span
                            title="Referral"
                            style={{
                              fontSize: 10,
                              padding: "1px 6px",
                              borderRadius: 20,
                              background: "rgba(108,99,255,0.12)",
                              color: "var(--accent)",
                              border: "1px solid var(--accent-border)",
                            }}
                          >
                            REF
                          </span>
                        )}
                        {app.applyType === "Cold Apply" && (
                          <span
                            title="Cold Apply"
                            style={{
                              fontSize: 10,
                              padding: "1px 6px",
                              borderRadius: 20,
                              background: "var(--bg-hover)",
                              color: "var(--text-muted)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            COLD
                          </span>
                        )}
                      </div>
                      {app.jobLink && (
                        <a
                          href={app.jobLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Job ↗
                        </a>
                      )}
                      {followUpDue && (
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--yellow)",
                            marginTop: 2,
                          }}
                        >
                          ⚡ Follow-up due
                        </div>
                      )}
                    </td>
                    <td>
                      <div>{app.role}</div>
                      {app.salary && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--green)",
                            marginTop: 2,
                          }}
                        >
                          {app.salary}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          borderRadius: 20,
                          background:
                            app.jobType === "Internship"
                              ? "rgba(59,130,246,0.1)"
                              : "var(--bg-hover)",
                          color:
                            app.jobType === "Internship"
                              ? "var(--blue)"
                              : "var(--text-muted)",
                          border: `1px solid ${app.jobType === "Internship" ? "rgba(59,130,246,0.2)" : "var(--border)"}`,
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                        }}
                      >
                        {app.jobType || "Job"}
                      </span>
                    </td>
                    <td>
                      {app.platform || (
                        <span style={{ color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>
                        {app.dateApplied
                          ? new Date(app.dateApplied).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit",
                              },
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
                      {app.status === "Applied" && daysSince !== null ? (
                        <span
                          style={{
                            fontSize: 11,
                            color:
                              daysSince > 14
                                ? "var(--red)"
                                : daysSince > 7
                                  ? "var(--yellow)"
                                  : "var(--text-muted)",
                          }}
                        >
                          {daysSince}d{daysSince > 14 && " 🔴"}
                          {daysSince > 7 && daysSince <= 14 && " 🟡"}
                        </span>
                      ) : (
                        <span
                          style={{ color: "var(--text-muted)", fontSize: 11 }}
                        >
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      {app.priority ? (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 20,
                            fontWeight: 600,
                            background:
                              PRIORITY_COLORS[app.priority]?.bg ||
                              "var(--bg-hover)",
                            color:
                              PRIORITY_COLORS[app.priority]?.color ||
                              "var(--text-muted)",
                          }}
                        >
                          {app.priority}
                        </span>
                      ) : (
                        "—"
                      )}
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
                              window.confirm(
                                `Delete ${app.company} application?`,
                              )
                            )
                              onDelete(app.id);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
