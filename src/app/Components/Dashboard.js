"use client";

import { useMemo } from "react";

const STATUS_COLORS = {
  Applied: "#3b82f6",
  Interview: "#eab308",
  Offer: "#22c55e",
  Rejected: "#ef4444",
};

export default function Dashboard({
  applications,
  onAddClick,
  onUpdateStatus,
  setActiveTab,
}) {
  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter(
      (a) => a.status === "Interview",
    ).length;
    const offers = applications.filter((a) => a.status === "Offer").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;
    const applied = applications.filter((a) => a.status === "Applied").length;
    const callbackRate =
      total > 0 ? (((interviews + offers) / total) * 100).toFixed(1) : 0;

    // Avg response time
    let totalDays = 0;
    let responseCount = 0;
    applications.forEach((app) => {
      if (app.statusHistory && app.statusHistory.length > 1) {
        const first = new Date(app.statusHistory[0].date);
        const second = new Date(app.statusHistory[1].date);
        const days = Math.round((second - first) / (1000 * 60 * 60 * 24));
        if (days >= 0) {
          totalDays += days;
          responseCount++;
        }
      }
    });
    const avgResponseDays =
      responseCount > 0 ? Math.round(totalDays / responseCount) : null;

    // Platform stats
    const platformMap = {};
    applications.forEach((app) => {
      if (!app.platform) return;
      if (!platformMap[app.platform])
        platformMap[app.platform] = { total: 0, interviews: 0, offers: 0 };
      platformMap[app.platform].total++;
      if (app.status === "Interview") platformMap[app.platform].interviews++;
      if (app.status === "Offer") platformMap[app.platform].offers++;
    });

    const platformStats = Object.entries(platformMap)
      .map(([name, data]) => ({
        name,
        total: data.total,
        responses: data.interviews + data.offers,
        rate:
          data.total > 0
            ? (((data.interviews + data.offers) / data.total) * 100).toFixed(0)
            : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);

    return {
      total,
      interviews,
      offers,
      rejected,
      applied,
      callbackRate,
      avgResponseDays,
      platformStats,
    };
  }, [applications]);

  const recentApps = applications
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (applications.length === 0) {
    return (
      <div>
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-state-icon">📋</div>
          <h3>No applications yet</h3>
          <p>Start tracking your job search by adding your first application</p>
          <button
            className="btn-primary"
            style={{ margin: "16px auto 0", display: "inline-flex" }}
            onClick={onAddClick}
          >
            <span>+</span> Add Your First Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Insight banner */}
      <div className="insight-box">
        You&apos;ve applied to{" "}
        <strong>
          {stats.total} job{stats.total !== 1 ? "s" : ""}
        </strong>{" "}
        and received{" "}
        <strong>
          {stats.interviews + stats.offers} callback
          {stats.interviews + stats.offers !== 1 ? "s" : ""}
        </strong>
        . That&apos;s a <strong>{stats.callbackRate}% response rate</strong>.
        {stats.avgResponseDays !== null && (
          <>
            {" "}
            Most responses come within{" "}
            <strong>
              {stats.avgResponseDays} day
              {stats.avgResponseDays !== 1 ? "s" : ""}
            </strong>
            .
          </>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Applied</div>
          <div className="stat-value stat-accent">{stats.total}</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Interviews</div>
          <div className="stat-value stat-yellow">{stats.interviews}</div>
          <div className="stat-sub">
            {stats.total > 0
              ? ((stats.interviews / stats.total) * 100).toFixed(1)
              : 0}
            % of total
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Offers</div>
          <div className="stat-value stat-green">{stats.offers}</div>
          <div className="stat-sub">
            {stats.total > 0
              ? ((stats.offers / stats.total) * 100).toFixed(1)
              : 0}
            % success rate
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected</div>
          <div className="stat-value stat-red">{stats.rejected}</div>
          <div className="stat-sub">
            {stats.total > 0
              ? ((stats.rejected / stats.total) * 100).toFixed(1)
              : 0}
            % of total
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{stats.applied}</div>
          <div className="stat-sub">Awaiting response</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Response Rate</div>
          <div className="stat-value stat-accent">{stats.callbackRate}%</div>
          <div className="stat-sub">Callback ratio</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Status breakdown */}
        <div className="card">
          <div className="card-title">Status Breakdown</div>
          {["Applied", "Interview", "Offer", "Rejected"].map((status) => {
            const count = applications.filter(
              (a) => a.status === status,
            ).length;
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={status} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    {status}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {count} &middot; {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${pct}%`,
                      background: STATUS_COLORS[status],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform success */}
        <div className="card">
          <div className="card-title">Platform Performance</div>
          {stats.platformStats.length === 0 ? (
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: 12,
                paddingTop: 8,
              }}
            >
              No platform data yet.
            </div>
          ) : (
            stats.platformStats.map((p) => (
              <div key={p.name} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    {p.name}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {p.rate}% ({p.responses}/{p.total})
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.max(p.rate, 2)}%`,
                      background: "var(--accent)",
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div className="card-title" style={{ marginBottom: 0 }}>
            Recent Applications
          </div>
          <button
            className="btn-ghost"
            style={{ fontSize: 11 }}
            onClick={() => setActiveTab("applications")}
          >
            View all →
          </button>
        </div>
        {recentApps.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
            No recent applications.
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: "none" }}>
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Platform</th>
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app.id}>
                    <td className="company-cell">{app.company}</td>
                    <td>{app.role}</td>
                    <td>{app.platform || "—"}</td>
                    <td>
                      {app.dateApplied
                        ? new Date(app.dateApplied).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short" },
                          )
                        : "—"}
                    </td>
                    <td>
                      <span
                        className={`badge badge-${app.status.toLowerCase()}`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
