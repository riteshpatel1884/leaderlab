"use client";

import { useMemo, useState } from "react";

const MIN_DATA_THRESHOLD = 5;

function pct(num, denom) {
  if (!denom) return null;
  return ((num / denom) * 100).toFixed(1);
}

function fmtResponseDays(d) {
  if (d === null || d === undefined) return "—";
  if (d === 0) return "< 1 day";
  return `${d}d`;
}

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function MetricCard({ label, value, sub, color, lowData }) {
  return (
    <div className="stat-card" style={{ position: "relative" }}>
      <div className="stat-label">{label}</div>
      <div
        className="stat-value"
        style={{ color: color || "var(--text-primary)", fontSize: 28 }}
      >
        {value}
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
      {lowData && (
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            color: "var(--text-muted)",
            fontStyle: "italic",
          }}
        >
          Based on {lowData} application{lowData !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

function ProgressRow({ label, sublabel, value, max, color, right }) {
  const pctWidth = max > 0 ? Math.max((value / max) * 100, 1) : 1;
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            {label}
          </span>
          {sublabel && (
            <span
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginLeft: 6,
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: color || "var(--text-muted)" }}>
          {right}
        </span>
      </div>
      <div className="progress-bar-wrap">
        <div
          className="progress-bar"
          style={{
            width: `${pctWidth}%`,
            background: color || "var(--accent)",
          }}
        />
      </div>
    </div>
  );
}

function Funnel({ byStatus, total }) {
  const steps = [
    { label: "Applied", key: "Applied", color: "var(--blue)" },
    { label: "Interview", key: "Interview", color: "var(--yellow)" },
    { label: "Offer", key: "Offer", color: "var(--green)" },
  ];

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-title">Application Funnel</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          marginTop: 8,
          overflowX: "auto",
        }}
      >
        {steps.map((step, i) => {
          const count = byStatus[step.key] || 0;
          const prevCount = i === 0 ? total : byStatus[steps[i - 1].key] || 0;
          const convRate =
            i > 0 && prevCount > 0 ? pct(count, prevCount) : null;

          return (
            <div
              key={step.key}
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                minWidth: 90,
              }}
            >
              <div style={{ flex: 1 }}>
                {convRate !== null && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      textAlign: "center",
                      marginBottom: 4,
                    }}
                  >
                    {convRate}% conversion.
                  </div>
                )}
                <div
                  style={{
                    height: 44,
                    background: step.color,
                    opacity: 0.15 + (count / (total || 1)) * 0.7,
                    borderRadius:
                      i === 0
                        ? "8px 0 0 8px"
                        : i === steps.length - 1
                          ? "0 8px 8px 0"
                          : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 0.3s",
                    border: `1px solid ${step.color}`,
                    borderRight: i < steps.length - 1 ? "none" : undefined,
                  }}
                >
                  <span
                    style={{ fontSize: 18, fontWeight: 800, color: "#ffffff" }}
                  >
                    {count}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  {step.label}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "22px solid transparent",
                    borderBottom: "22px solid transparent",
                    borderLeft: `14px solid ${step.color}`,
                    opacity: 0.4,
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 10,
          fontSize: 11,
          color: "var(--text-muted)",
        }}
      >
        Rejected: {byStatus.Rejected || 0}
      </div>
    </div>
  );
}

function InsightsBox({ stats, applications }) {
  const insights = useMemo(() => {
    const list = [];

    const best = stats.platformPerf[0];
    if (best && parseFloat(best.rate) > 0 && best.total >= 1) {
      list.push(
        `${best.name} has your best response rate at ${best.rate}% — prioritise it.`,
      );
    }

    if (stats.byStatus.Offer === 0 && stats.total >= 3) {
      list.push(
        "No offers yet. Consider refining your resume or increasing application volume.",
      );
    }

    const workEntries = Object.entries(stats.byWorkType).sort(
      (a, b) => b[1] - a[1],
    );
    if (workEntries.length > 0) {
      const [topType, topCount] = workEntries[0];
      const topPct = Math.round((topCount / stats.total) * 100);
      if (topPct >= 80) {
        const alt = topType === "Onsite" ? "Remote or Hybrid" : "Onsite";
        list.push(
          `${topPct}% of applications are ${topType} — consider exploring ${alt} roles.`,
        );
      }
    }

    if (stats.avgResponseDays !== null && stats.avgResponseDays > 14) {
      list.push(
        `Average response time is ${stats.avgResponseDays} days — follow up on older applications.`,
      );
    }

    const cbRate = parseFloat(stats.callbackRate);
    if (stats.total >= 5 && cbRate < 10) {
      list.push(
        `Callback rate is ${stats.callbackRate}%. Tailoring your applications per role may improve this.`,
      );
    }

    if (list.length === 0) {
      list.push("Add more applications to unlock personalised insights.");
    }

    return list;
  }, [stats, applications]);

  return (
    <div
      style={{
        background: "var(--accent-dim)",
        border: "1px solid var(--accent-border)",
        borderRadius: "var(--radius)",
        padding: "16px 20px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: "var(--accent)",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          marginBottom: 12,
        }}
      >
        Insights
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {insights.map((text, i) => (
          <li
            key={i}
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              paddingLeft: 14,
              borderLeft: "2px solid var(--accent)",
            }}
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MonthlyTrend({ months, weeks, trendMode, setTrendMode }) {
  const data = trendMode === "weekly" ? weeks : months;
  const maxVal = Math.max(...data.map((d) => d[1].applied), 1);

  return (
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
          Application Trend
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["monthly", "weekly"].map((m) => (
            <button
              key={m}
              onClick={() => setTrendMode(m)}
              style={{
                padding: "3px 10px",
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${trendMode === m ? "var(--accent-border)" : "var(--border)"}`,
                background:
                  trendMode === m ? "var(--accent-dim)" : "transparent",
                color: trendMode === m ? "var(--accent)" : "var(--text-muted)",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
          No trend data available.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "flex-end",
            height: 120,
            padding: "8px 0",
          }}
        >
          {data.map(([key, d]) => {
            const heightPct = (d.applied / maxVal) * 100;
            const label =
              trendMode === "weekly"
                ? new Date(key).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })
                : new Date(key + "-01").toLocaleDateString("en-IN", {
                    month: "short",
                    year: "2-digit",
                  });
            return (
              <div
                key={key}
                title={`${d.applied} applied`}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                  {d.applied}
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    height: 80,
                  }}
                >
                  <div
                    style={{
                      width: "65%",
                      borderRadius: "4px 4px 0 0",
                      height: `${Math.max(heightPct, 3)}%`,
                      background: "var(--accent)",
                      opacity: 0.8,
                      minHeight: 3,
                      transition: "height 0.4s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--text-muted)",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Analytics({ applications }) {
  const [timeFilter, setTimeFilter] = useState("all");
  const [trendMode, setTrendMode] = useState("monthly");

  const filtered = useMemo(() => {
    if (timeFilter === "all") return applications;
    const cutoff = new Date();
    if (timeFilter === "7d") cutoff.setDate(cutoff.getDate() - 7);
    if (timeFilter === "30d") cutoff.setDate(cutoff.getDate() - 30);
    return applications.filter((a) => new Date(a.createdAt) >= cutoff);
  }, [applications, timeFilter]);

  const stats = useMemo(() => {
    const total = filtered.length;
    if (total === 0) return null;

    const byStatus = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    const byPlatform = {};
    const byWorkType = {};
    const monthlyData = {};
    const weeklyData = {};
    const tagCounts = {};

    let totalResponseDays = 0,
      responseCount = 0;
    let fastestResponse = Infinity,
      slowestResponse = 0;

    filtered.forEach((app) => {
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;

      if (app.platform) {
        if (!byPlatform[app.platform])
          byPlatform[app.platform] = { total: 0, interviews: 0, offers: 0 };
        byPlatform[app.platform].total++;
        if (app.status === "Interview") byPlatform[app.platform].interviews++;
        if (app.status === "Offer") byPlatform[app.platform].offers++;
      }

      if (app.workType)
        byWorkType[app.workType] = (byWorkType[app.workType] || 0) + 1;

      if (app.dateApplied) {
        const month = app.dateApplied.slice(0, 7);
        if (!monthlyData[month])
          monthlyData[month] = { applied: 0, interviews: 0, offers: 0 };
        monthlyData[month].applied++;
        if (app.status === "Interview") monthlyData[month].interviews++;
        if (app.status === "Offer") monthlyData[month].offers++;

        const week = getWeekKey(app.dateApplied);
        if (!weeklyData[week]) weeklyData[week] = { applied: 0 };
        weeklyData[week].applied++;
      }

      if (app.tags && Array.isArray(app.tags)) {
        app.tags.forEach((t) => {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      }
      if (app.workType)
        tagCounts[app.workType] = (tagCounts[app.workType] || 0) + 1;

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
    const callbackRate = pct(byStatus.Interview + byStatus.Offer, total);
    const offerRate = pct(byStatus.Offer, total);
    const rejectionRate = pct(byStatus.Rejected, total);

    const platformPerf = Object.entries(byPlatform)
      .map(([name, d]) => ({
        name,
        total: d.total,
        responses: d.interviews + d.offers,
        rate: d.total > 0 ? pct(d.interviews + d.offers, d.total) : "0.0",
      }))
      .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));

    const months = Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);
    const weeks = Object.entries(weeklyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-8);
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      total,
      byStatus,
      byPlatform,
      byWorkType,
      platformPerf,
      months,
      weeks,
      callbackRate,
      offerRate,
      rejectionRate,
      avgResponseDays,
      fastestResponse: fastestResponse === Infinity ? null : fastestResponse,
      slowestResponse:
        slowestResponse === 0 && responseCount === 0 ? null : slowestResponse,
      topTags,
      isLowData: total < MIN_DATA_THRESHOLD,
    };
  }, [filtered]);

  if (!stats) {
    return (
      <div className="empty-state">
        <div
          className="empty-state-icon"
          style={{ fontSize: 32, marginBottom: 10, opacity: 0.4 }}
        >
          —
        </div>
        <h3>No data to analyze</h3>
        <p>Add applications to see analytics</p>
      </div>
    );
  }

  return (
    <div>
      {/* Time filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[
          { value: "7d", label: "Last 7 days" },
          { value: "30d", label: "Last 30 days" },
          { value: "all", label: "All time" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTimeFilter(opt.value)}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${timeFilter === opt.value ? "var(--accent-border)" : "var(--border)"}`,
              background:
                timeFilter === opt.value ? "var(--accent-dim)" : "transparent",
              color:
                timeFilter === opt.value
                  ? "var(--accent)"
                  : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
            }}
          >
            {opt.label}
          </button>
        ))}
        {stats.isLowData && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              color: "var(--text-muted)",
              alignSelf: "center",
              fontStyle: "italic",
            }}
          >
            Based on {stats.total} application{stats.total !== 1 ? "s" : ""} —
            metrics may not be representative
          </span>
        )}
      </div>

      {/* Insights */}
      <InsightsBox stats={stats} applications={filtered} />

      {/* Key metrics */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <MetricCard
          label="Callback Rate"
          value={stats.callbackRate !== null ? `${stats.callbackRate}%` : "—"}
          sub="Interview + Offer"
          color="var(--accent)"
          lowData={stats.isLowData ? stats.total : null}
        />
        <MetricCard
          label="Offer Rate"
          value={stats.offerRate !== null ? `${stats.offerRate}%` : "—"}
          sub="Of all applications"
          color="var(--green)"
          lowData={stats.isLowData ? stats.total : null}
        />
        <MetricCard
          label="Rejection Rate"
          value={stats.rejectionRate !== null ? `${stats.rejectionRate}%` : "—"}
          sub="Of all applications"
          color="var(--red)"
          lowData={stats.isLowData ? stats.total : null}
        />
        <MetricCard
          label="Avg Response"
          value={fmtResponseDays(stats.avgResponseDays)}
          sub={
            stats.fastestResponse !== null
              ? `${fmtResponseDays(stats.fastestResponse)} fastest`
              : "No history yet"
          }
          color="var(--yellow)"
        />
      </div>

      {/* Funnel */}
      <Funnel byStatus={stats.byStatus} total={stats.total} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Platform performance */}
        <div className="card">
          <div className="card-title">Platform Success Rate</div>
          {stats.platformPerf.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
              No platform data.
            </div>
          ) : (
            stats.platformPerf.map((p) => {
              const rateNum = parseFloat(p.rate);
              const color =
                rateNum > 15
                  ? "var(--green)"
                  : rateNum > 0
                    ? "var(--yellow)"
                    : "var(--text-muted)";
              return (
                <ProgressRow
                  key={p.name}
                  label={p.name}
                  sublabel={`${p.responses}/${p.total}`}
                  value={rateNum}
                  max={100}
                  color={color}
                  right={`${p.rate}%`}
                />
              );
            })
          )}
        </div>

        {/* Work type + response time */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-title">Work Type</div>
            {Object.keys(stats.byWorkType).length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                No data.
              </div>
            ) : (
              Object.entries(stats.byWorkType)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <ProgressRow
                    key={type}
                    label={type}
                    value={count}
                    max={stats.total}
                    color="var(--accent)"
                    right={`${count} · ${Math.round((count / stats.total) * 100)}%`}
                  />
                ))
            )}
          </div>

          <div className="card">
            <div className="card-title">Response Time</div>
            {stats.avgResponseDays !== null ? (
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 2.2,
                }}
              >
                <div>
                  Average:{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    {fmtResponseDays(stats.avgResponseDays)}
                  </strong>
                </div>
                {stats.fastestResponse !== null && (
                  <div>
                    Fastest:{" "}
                    <strong style={{ color: "var(--green)" }}>
                      {fmtResponseDays(stats.fastestResponse)}
                    </strong>
                  </div>
                )}
                {stats.slowestResponse !== null && (
                  <div>
                    Slowest:{" "}
                    <strong style={{ color: "var(--red)" }}>
                      {fmtResponseDays(stats.slowestResponse)}
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

      {/* Top Tags */}
      {stats.topTags.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title">Top Application Tags</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {stats.topTags.map(([tag, count]) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flex: "1 1 140px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>
                      {tag}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {Math.round((count / stats.total) * 100)}%
                    </span>
                  </div>
                  <div className="progress-bar-wrap" style={{ height: 4 }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.round((count / stats.total) * 100)}%`,
                        background: "var(--accent)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly / Weekly trend */}
      <MonthlyTrend
        months={stats.months}
        weeks={stats.weeks}
        trendMode={trendMode}
        setTrendMode={setTrendMode}
      />
    </div>
  );
}
