"use client";

import { useMemo } from "react";

export default function Analytics({ applications }) {
  const stats = useMemo(() => {
    const total = applications.length;
    if (total === 0) return null;

    const byStatus = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    const byPlatform = {};
    const byWorkType = {};
    const monthlyData = {};

    // Response time tracking
    let totalResponseDays = 0;
    let responseCount = 0;
    let fastestResponse = Infinity;
    let slowestResponse = 0;

    applications.forEach((app) => {
      // Status counts
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;

      // Platform
      if (app.platform) {
        if (!byPlatform[app.platform])
          byPlatform[app.platform] = { total: 0, interviews: 0, offers: 0 };
        byPlatform[app.platform].total++;
        if (app.status === "Interview") byPlatform[app.platform].interviews++;
        if (app.status === "Offer") byPlatform[app.platform].offers++;
      }

      // Work type
      if (app.workType) {
        byWorkType[app.workType] = (byWorkType[app.workType] || 0) + 1;
      }

      // Monthly
      if (app.dateApplied) {
        const month = app.dateApplied.slice(0, 7); // YYYY-MM
        if (!monthlyData[month])
          monthlyData[month] = { applied: 0, interviews: 0, offers: 0 };
        monthlyData[month].applied++;
        if (app.status === "Interview") monthlyData[month].interviews++;
        if (app.status === "Offer") monthlyData[month].offers++;
      }

      // Response time
      if (app.statusHistory && app.statusHistory.length > 1) {
        const first = new Date(app.statusHistory[0].date);
        const second = new Date(app.statusHistory[1].date);
        const days = Math.round((second - first) / (1000 * 60 * 60 * 24));
        if (days >= 0) {
          totalResponseDays += days;
          responseCount++;
          fastestResponse = Math.min(fastestResponse, days);
          slowestResponse = Math.max(slowestResponse, days);
        }
      }
    });

    const avgResponseDays =
      responseCount > 0 ? Math.round(totalResponseDays / responseCount) : null;
    const callbackRate = (
      ((byStatus.Interview + byStatus.Offer) / total) *
      100
    ).toFixed(1);
    const offerRate = ((byStatus.Offer / total) * 100).toFixed(1);
    const rejectionRate = ((byStatus.Rejected / total) * 100).toFixed(1);

    // Platform performance sorted
    const platformPerf = Object.entries(byPlatform)
      .map(([name, d]) => ({
        name,
        total: d.total,
        responses: d.interviews + d.offers,
        rate:
          d.total > 0
            ? (((d.interviews + d.offers) / d.total) * 100).toFixed(1)
            : "0.0",
      }))
      .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));

    // Last 6 months sorted
    const months = Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);

    return {
      total,
      byStatus,
      byPlatform,
      byWorkType,
      platformPerf,
      months,
      callbackRate,
      offerRate,
      rejectionRate,
      avgResponseDays,
      fastestResponse: fastestResponse === Infinity ? null : fastestResponse,
      slowestResponse:
        slowestResponse === 0 && responseCount === 0 ? null : slowestResponse,
    };
  }, [applications]);

  if (!stats) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <h3>No data to analyze</h3>
        <p>Add applications to see analytics</p>
      </div>
    );
  }

  const statusColors = {
    Applied: "var(--blue)",
    Interview: "var(--yellow)",
    Offer: "var(--green)",
    Rejected: "var(--red)",
  };

  const maxMonthlyApps = Math.max(...stats.months.map((m) => m[1].applied), 1);

  return (
    <div>
      {/* Key metrics */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Callback Rate</div>
          <div className="stat-value stat-accent">{stats.callbackRate}%</div>
          <div className="stat-sub">Interview + Offer</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Offer Rate</div>
          <div className="stat-value stat-green">{stats.offerRate}%</div>
          <div className="stat-sub">Of all applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejection Rate</div>
          <div className="stat-value stat-red">{stats.rejectionRate}%</div>
          <div className="stat-sub">Of all applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Response</div>
          <div className="stat-value stat-yellow">
            {stats.avgResponseDays !== null ? `${stats.avgResponseDays}d` : "—"}
          </div>
          <div className="stat-sub">
            {stats.fastestResponse !== null &&
              `${stats.fastestResponse}d fastest`}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Platform wise */}
        <div className="card">
          <div className="card-title">Platform Success Rate</div>
          {stats.platformPerf.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
              No platform data.
            </div>
          ) : (
            <div>
              {stats.platformPerf.map((p, i) => (
                <div key={p.name} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {i === 0 && <span style={{ fontSize: 12 }}>🏆</span>}
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-secondary)",
                          fontWeight: 500,
                        }}
                      >
                        {p.name}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        fontSize: 11,
                        color: "var(--text-muted)",
                      }}
                    >
                      <span>{p.total} apps</span>
                      <span
                        style={{
                          color:
                            parseFloat(p.rate) > 10
                              ? "var(--green)"
                              : parseFloat(p.rate) > 0
                                ? "var(--yellow)"
                                : "var(--text-muted)",
                        }}
                      >
                        {p.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar-wrap">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.max(parseFloat(p.rate), 1)}%`,
                        background:
                          parseFloat(p.rate) > 10
                            ? "var(--green)"
                            : parseFloat(p.rate) > 0
                              ? "var(--yellow)"
                              : "var(--text-muted)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Work type */}
        <div className="card">
          <div className="card-title">Work Type Distribution</div>
          {Object.keys(stats.byWorkType).length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
              No data.
            </div>
          ) : (
            <div>
              {Object.entries(stats.byWorkType).map(([type, count]) => {
                const pct = ((count / stats.total) * 100).toFixed(0);
                return (
                  <div key={type} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: "var(--text-secondary)" }}>
                        {type}
                      </span>
                      <span style={{ color: "var(--text-muted)" }}>
                        {count} · {pct}%
                      </span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${pct}%`,
                          background: "var(--accent)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <div className="card-title">Response Time</div>
            {stats.avgResponseDays !== null ? (
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 2,
                }}
              >
                <div>
                  Average:{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    {stats.avgResponseDays} days
                  </strong>
                </div>
                {stats.fastestResponse !== null && (
                  <div>
                    Fastest:{" "}
                    <strong style={{ color: "var(--green)" }}>
                      {stats.fastestResponse} days
                    </strong>
                  </div>
                )}
                {stats.slowestResponse !== null && (
                  <div>
                    Slowest:{" "}
                    <strong style={{ color: "var(--red)" }}>
                      {stats.slowestResponse} days
                    </strong>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                Update application statuses to track response times.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      {stats.months.length > 0 && (
        <div className="card">
          <div className="card-title">Monthly Application Trend</div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              height: 120,
              padding: "8px 0",
            }}
          >
            {stats.months.map(([month, data]) => {
              const heightPct = (data.applied / maxMonthlyApps) * 100;
              const label = new Date(month + "-01").toLocaleDateString(
                "en-IN",
                { month: "short", year: "2-digit" },
              );
              return (
                <div
                  key={month}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {data.applied}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      alignItems: "center",
                      justifyContent: "flex-end",
                      height: 80,
                    }}
                  >
                    <div
                      style={{
                        width: "70%",
                        borderRadius: 4,
                        height: `${heightPct}%`,
                        background: "var(--accent)",
                        opacity: 0.85,
                        minHeight: 4,
                        transition: "height 0.3s ease",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 10,
              fontSize: 11,
              color: "var(--text-muted)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  background: "var(--accent)",
                  borderRadius: 2,
                  display: "inline-block",
                }}
              />
              Applications
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
