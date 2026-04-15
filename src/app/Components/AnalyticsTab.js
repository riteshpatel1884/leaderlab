"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

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

// ── Enhanced Charts ────────────────────────────────────────────────────────

function StatusDistributionChart({ byStatus, total }) {
  const data = [
    { name: "Applied", value: byStatus.Applied || 0, fill: "#3b82f6" },
    { name: "Interview", value: byStatus.Interview || 0, fill: "#f59e0b" },
    { name: "Offer", value: byStatus.Offer || 0, fill: "#10b981" },
    { name: "Rejected", value: byStatus.Rejected || 0, fill: "#ef4444" },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Application Status</div>
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
          No data available.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">Application Status Distribution</div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} applications`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function TagsVisualization({ topTags, total }) {
  if (!topTags || topTags.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Top Application Tags</div>
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
          No tags available.
        </div>
      </div>
    );
  }

  const data = topTags.map(([tag, count]) => ({
    name: tag,
    count: count,
    percentage: Math.round((count / total) * 100),
  }));

  return (
    <div className="card">
      <div className="card-title">Top Application Tags</div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip
            formatter={(value) => `${value} applications`}
            contentStyle={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          />
          <Bar dataKey="count" fill="var(--accent)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function WorkTypeVisualization({ byWorkType, total }) {
  if (!byWorkType || Object.keys(byWorkType).length === 0) {
    return (
      <div className="card">
        <div className="card-title">Work Type Distribution</div>
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
          No data available.
        </div>
      </div>
    );
  }

  const data = Object.entries(byWorkType)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({
      name: type,
      value: count,
      percentage: Math.round((count / total) * 100),
    }));

  const colors = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];

  return (
    <div className="card">
      <div className="card-title">Work Type Distribution</div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} ${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} applications`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function PlatformPerformanceChart({ platformPerf }) {
  if (!platformPerf || platformPerf.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Platform Performance</div>
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
          No platform data.
        </div>
      </div>
    );
  }

  const data = platformPerf.map((p) => ({
    name: p.name,
    rate: parseFloat(p.rate),
    total: p.total,
    responses: p.responses,
  }));

  return (
    <div className="card">
      <div className="card-title">Platform Success Rate</div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis
            stroke="var(--text-muted)"
            label={{ value: "Rate (%)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => `${value.toFixed(1)}%`}
            labelFormatter={(label) => `Platform: ${label}`}
            contentStyle={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          />
          <Bar dataKey="rate" fill="var(--green)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function WeeklyTrendChart({ weeks }) {
  if (!weeks || weeks.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Weekly Trend</div>
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
          No trend data available.
        </div>
      </div>
    );
  }

  const data = weeks.map(([key, d]) => ({
    week: new Date(key).toLocaleDateString("en-IN", {
      month: "short",
      day: "2-digit",
    }),
    applied: d.applied,
    interviews: d.interviews || 0,
    offers: d.offers || 0,
  }));

  return (
    <div className="card">
      <div className="card-title">Weekly Application Trend</div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="week" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip
            contentStyle={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="applied"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
          />
          <Area
            type="monotone"
            dataKey="interviews"
            stackId="1"
            stroke="#f59e0b"
            fill="#f59e0b"
          />
          <Area
            type="monotone"
            dataKey="offers"
            stackId="1"
            stroke="#10b981"
            fill="#10b981"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ConversionFunnelChart({ byStatus, total }) {
  const data = [
    { name: "Applied", value: byStatus.Applied || 0 },
    { name: "Interview", value: byStatus.Interview || 0 },
    { name: "Offer", value: byStatus.Offer || 0 },
  ];

  return (
    <div className="card">
      <div className="card-title">Conversion Metrics</div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip
            formatter={(value) => `${value} applications`}
            contentStyle={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={3}
            dot={{ fill: "var(--accent)", r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Analytics({ applications }) {
  const [timeFilter, setTimeFilter] = useState("7d");

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
        const week = getWeekKey(app.dateApplied);
        if (!weeklyData[week])
          weeklyData[week] = { applied: 0, interviews: 0, offers: 0 };
        weeklyData[week].applied++;
        if (app.status === "Interview") weeklyData[week].interviews++;
        if (app.status === "Offer") weeklyData[week].offers++;
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
          label="Total Applications"
          value={stats.total}
          sub="In selected period"
          color="var(--yellow)"
        />
      </div>

      {/* Funnel */}
      <Funnel byStatus={stats.byStatus} total={stats.total} />

      {/* Status Distribution Pie Chart */}
      <StatusDistributionChart byStatus={stats.byStatus} total={stats.total} />

      {/* Grid of charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <WorkTypeVisualization
          byWorkType={stats.byWorkType}
          total={stats.total}
        />
        <PlatformPerformanceChart platformPerf={stats.platformPerf} />
      </div>

      {/* Tags Chart */}
      <TagsVisualization topTags={stats.topTags} total={stats.total} />

      {/* Weekly Trend */}
      <WeeklyTrendChart weeks={stats.weeks} />

      {/* Conversion Funnel */}
      <ConversionFunnelChart byStatus={stats.byStatus} total={stats.total} />
    </div>
  );
}
