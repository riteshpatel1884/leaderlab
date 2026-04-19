"use client";

import { useMemo, useState, useEffect } from "react";
import {
  PieChart, Pie, BarChart, Bar, AreaChart, Area,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// ── Theme tokens — mirrors globals.css exactly ───────────────────────────────
const T = {
  bg:           "#0d0d0f",
  bgCard:       "#1f1f22",
  bgHover:      "#1a1a1d",
  border:       "#242428",
  borderLight:  "#2e2e34",
  textP:        "#f0f0f2",
  textS:        "#8b8b9a",
  textM:        "#555562",
  accent:       "#6c63ff",
  accentHover:  "#7c74ff",
  accentDim:    "rgba(108, 99, 255, 0.12)",
  accentBorder: "rgba(108, 99, 255, 0.3)",
  green:        "#22c55e",
  greenDim:     "rgba(34, 197, 94, 0.1)",
  yellow:       "#eab308",
  yellowDim:    "rgba(234, 179, 8, 0.1)",
  red:          "#ef4444",
  redDim:       "rgba(239, 68, 68, 0.1)",
  blue:         "#3b82f6",
  blueDim:      "rgba(59, 130, 246, 0.1)",
};

// Palette — accent-led, all from the theme
const PALETTE = [
  T.accent,   // #6c63ff purple
  T.blue,     // #3b82f6 blue
  T.green,    // #22c55e green
  T.yellow,   // #eab308 yellow
  "#f472b6",  // pink (complementary dark accent)
  "#22d3ee",  // cyan
  T.red,
];

const STATUS_COLORS = {
  Applied:   T.blue,
  Interview: T.yellow,
  Offer:     T.green,
  Rejected:  T.red,
};

const AXIS = {
  tick:     { fontSize: 11, fill: T.textM },
  axisLine: false,
  tickLine: false,
};

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${T.borderLight}`,
      borderRadius: 8,
      padding: "9px 13px",
      fontSize: 12,
      color: T.textP,
      boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
    }}>
      {label && (
        <div style={{ fontSize: 10, color: T.textM, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>
          {label}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginTop: i > 0 ? 4 : 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.fill || T.accent, flexShrink: 0 }} />
          <span style={{ fontWeight: 500, color: T.textP }}>
            {p.name && <span style={{ color: T.textS, fontWeight: 400, marginRight: 4 }}>{p.name}:</span>}
            {p.value}{suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, color, sub }) {
  return (
    <div
      style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 18px", transition: "border-color .15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = T.borderLight}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
    >
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, color, lineHeight: 1.1, marginBottom: 5 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: T.textM, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".06em" }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 10, color: T.textM, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ── Chart card wrapper ────────────────────────────────────────────────────────
function ChartCard({ title, children, height = 220 }) {
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ display: "inline-block", width: 3, height: 12, borderRadius: 2, background: T.accent }} />
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 600, color: T.textS, textTransform: "uppercase", letterSpacing: ".08em" }}>
          {title}
        </span>
      </div>
      <div style={{ height, width: "100%" }}>{children}</div>
    </div>
  );
}

// ── Inline legend ─────────────────────────────────────────────────────────────
function InlineLegend({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 14px", marginBottom: 12 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textS }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, flexShrink: 0, background: item.color }} />
          {item.label}
          {item.count !== undefined && (
            <span style={{ fontWeight: 700, color: T.textP, fontFamily: "'Syne', sans-serif" }}>{item.count}</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OptimizedAnalytics({ applications }) {
  const [timeFilter, setTimeFilter] = useState("7d");

  const tabs = [
    { key: "7d",  label: "7 days" },
    { key: "30d", label: "30 days" },
    { key: "all", label: "All time" },
  ];

  const stats = useMemo(() => {
    if (!applications?.length) return null;

    const cutoff = timeFilter === "7d" ? 7 : timeFilter === "30d" ? 30 : null;
    const filtered = cutoff
      ? applications.filter(a => new Date(a.createdAt) >= new Date(Date.now() - cutoff * 86400000))
      : [...applications];

    const total = filtered.length;
    if (!total) return { total: 0 };

    const byStatus   = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    const byWorkType = {};
    const byJobType  = {};
    const byPlatform = {};
    const dailyMap   = {};
    const weeklyMap  = {};

    filtered.forEach(app => {
      if (byStatus[app.status] !== undefined) byStatus[app.status]++;

      const wt = app.workType || "Other";
      byWorkType[wt] = (byWorkType[wt] || 0) + 1;

      const jt = app.jobType || "Job";
      byJobType[jt] = (byJobType[jt] || 0) + 1;

      const pl = app.platform || "Other";
      if (!byPlatform[pl]) byPlatform[pl] = { total: 0, success: 0 };
      byPlatform[pl].total++;
      if (app.status === "Interview" || app.status === "Offer") byPlatform[pl].success++;

      const dateKey = new Date(app.dateApplied || app.createdAt)
        .toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;

      const d  = new Date(app.dateApplied || app.createdAt);
      const wk = `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleDateString("en-IN", { month: "short" })}`;
      if (!weeklyMap[wk]) weeklyMap[wk] = { t: 0, s: 0 };
      weeklyMap[wk].t++;
      if (app.status === "Interview" || app.status === "Offer") weeklyMap[wk].s++;
    });

    const platformSuccess = Object.entries(byPlatform)
      .map(([name, d]) => ({ name, rate: Math.round((d.success / d.total) * 100), total: d.total }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 6);

    const dailyTrend     = Object.entries(dailyMap).slice(-14).map(([date, count]) => ({ date, count }));
    const weeklyResponse = Object.entries(weeklyMap).slice(-6).map(([week, d]) => ({
      week, rate: Math.round((d.s / d.t) * 100), apps: d.t,
    }));

    const workTypeData = Object.entries(byWorkType).map(([name, value]) => ({ name, value }));
    const jobTypeData  = Object.entries(byJobType).map(([name, value]) => ({ name, value }));
    const responseRate = Math.round(((byStatus.Interview + byStatus.Offer) / total) * 100);
    const offerRate    = Math.round((byStatus.Offer / total) * 100);

    const radarData = platformSuccess.slice(0, 5).map(p => ({
      platform: p.name.length > 9 ? p.name.slice(0, 9) + "…" : p.name,
      rate:  p.rate,
      total: Math.min(100, p.total * 10),
    }));

    return {
      total, byStatus, responseRate, offerRate,
      platformSuccess, dailyTrend, weeklyResponse,
      workTypeData, jobTypeData, radarData,
      bestPlatform: platformSuccess[0],
    };
  }, [applications, timeFilter]);

  if (!stats) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <h3>No data yet</h3>
        <p>Add applications to see your analytics</p>
      </div>
    );
  }

  const funnelData = [
    { name: "Applied",   value: stats.byStatus?.Applied   || 0 },
    { name: "Interview", value: stats.byStatus?.Interview || 0 },
    { name: "Offer",     value: stats.byStatus?.Offer     || 0 },
    { name: "Rejected",  value: stats.byStatus?.Rejected  || 0 },
  ].filter(d => d.value > 0);

  return (
    <div style={{ paddingBottom: 32 }}>
      <style>{`
        .recharts-surface, .recharts-surface:focus, .recharts-surface:focus-visible,
        .recharts-wrapper, .recharts-wrapper:focus, .recharts-wrapper:focus-visible,
        .recharts-sector:focus, .recharts-sector:focus-visible,
        .recharts-bar-rectangle:focus, .recharts-bar-rectangle:focus-visible,
        .recharts-rectangle:focus, .recharts-rectangle:focus-visible,
        .recharts-pie-sector:focus, .recharts-pie-sector:focus-visible,
        .recharts-layer:focus, .recharts-layer:focus-visible,
        svg:focus, svg:focus-visible, g:focus, g:focus-visible, path:focus, path:focus-visible {
          outline: none !important;
          stroke: none;
        }
        .recharts-surface { outline: none !important; }
      `}</style>

      {/* Time filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {tabs.map(t => {
          const active = timeFilter === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTimeFilter(t.key)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 6,
                border: active ? `1px solid ${T.accentBorder}` : `1px solid ${T.border}`,
                background: active ? T.accentDim : "transparent",
                color: active ? T.accent : T.textS,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Metric cards */}
      {stats.total > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 20 }}>
          <MetricCard label="Total applied"  value={stats.total}                   color={T.accent} />
          <MetricCard label="Interviews"      value={stats.byStatus.Interview}       color={T.yellow} />
          <MetricCard label="Offers"          value={stats.byStatus.Offer}           color={T.green}  />
          <MetricCard label="Rejected"        value={stats.byStatus.Rejected}        color={T.red}    />
          <MetricCard label="Response rate"   value={`${stats.responseRate}%`}       color={T.blue}   sub={`${stats.offerRate}% offer rate`} />
        </div>
      )}

      {stats.total === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No data in this period</h3>
          <p>Try switching to a wider time range</p>
        </div>
      )}

      {stats.total > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* 1 — Daily trend */}
          <ChartCard title="Daily applications" height={200}>
            <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
              <BarChart data={stats.dailyTrend} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.border} />
                <XAxis dataKey="date" {...AXIS} />
                <YAxis {...AXIS} width={22} allowDecimals={false} />
                <Tooltip content={<CustomTooltip suffix=" apps" />} cursor={{ fill: "rgba(108,99,255,0.07)" }} />
                <Bar dataKey="count" fill={T.accent} fillOpacity={.9} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 2 — Funnel + Work type */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <ChartCard title="Application funnel" height={230}>
              <InlineLegend items={funnelData.map(d => ({ label: d.name, color: STATUS_COLORS[d.name] || T.accent, count: d.value }))} />
              <div style={{ height: 178 }}>
                <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
                  <PieChart>
                    <Pie data={funnelData} innerRadius="50%" outerRadius="75%" paddingAngle={4} dataKey="value" stroke="none">
                      {funnelData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.name] || PALETTE[i]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Work type" height={230}>
              <InlineLegend items={stats.workTypeData.map((d, i) => ({ label: d.name, color: PALETTE[i % PALETTE.length], count: d.value }))} />
              <div style={{ height: 178 }}>
                <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
                  <BarChart data={stats.workTypeData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.border} />
                    <XAxis dataKey="name" {...AXIS} />
                    <YAxis {...AXIS} width={22} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip suffix=" apps" />} cursor={{ fill: "rgba(108,99,255,0.07)" }} />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                      {stats.workTypeData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* 3 — Platform success */}
          <ChartCard title="Platform success rate" height={Math.max(200, stats.platformSuccess.length * 44 + 40)}>
            <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
              <BarChart data={stats.platformSuccess} layout="vertical" margin={{ left: 4, right: 28 }} barSize={18}>
                <XAxis type="number" {...AXIS} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" {...AXIS} width={96} />
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={T.border} />
                <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ fill: "rgba(108,99,255,0.07)" }} />
                <Bar dataKey="rate" radius={[0, 5, 5, 0]}>
                  {stats.platformSuccess.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 4 — Weekly response + Job type */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <ChartCard title="Weekly response rate" height={200}>
              <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
                <AreaChart data={stats.weeklyResponse}>
                  <defs>
                    <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={T.accent} stopOpacity={.22} />
                      <stop offset="100%" stopColor={T.accent} stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.border} />
                  <XAxis dataKey="week" {...AXIS} />
                  <YAxis {...AXIS} width={30} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ stroke: T.accent, strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="rate" stroke={T.accent} strokeWidth={2} fill="url(#accentGrad)"
                    dot={{ r: 3, fill: T.accent, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: T.accent, stroke: T.bgCard, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Job vs internship" height={200}>
              <InlineLegend items={stats.jobTypeData.map((d, i) => ({ label: d.name, color: [T.accent, T.blue][i % 2], count: d.value }))} />
              <div style={{ height: 158 }}>
                <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
                  <BarChart data={stats.jobTypeData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.border} />
                    <XAxis dataKey="name" {...AXIS} />
                    <YAxis {...AXIS} width={22} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip suffix=" apps" />} cursor={{ fill: "rgba(108,99,255,0.07)" }} />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                      {stats.jobTypeData.map((_, i) => <Cell key={i} fill={[T.accent, T.blue][i % 2]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* 5 — Platform radar (≥3 platforms) */}
          {stats.radarData?.length >= 3 && (
            <ChartCard title="Platform activity radar" height={260}>
              <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
                <RadarChart data={stats.radarData} margin={{ top: 10, right: 28, bottom: 10, left: 28 }}>
                  <PolarGrid stroke={T.border} />
                  <PolarAngleAxis dataKey="platform" tick={{ fontSize: 11, fill: T.textS }} />
                  <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                  <Radar name="Success rate" dataKey="rate" stroke={T.accent} fill={T.accent} fillOpacity={.18} strokeWidth={2} />
                  <Radar name="Volume" dataKey="total" stroke={T.green} fill={T.green} fillOpacity={.1} strokeWidth={1.5} strokeDasharray="4 3" />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: T.textS }} />
                  <Tooltip content={<CustomTooltip suffix="%" />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Insight strip */}
          <div style={{
            background: T.accentDim,
            border: `1px solid ${T.accentBorder}`,
            borderRadius: 10,
            padding: "14px 18px",
            fontSize: 13,
            color: T.textS,
            lineHeight: 1.65,
          }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: T.accent, marginRight: 6 }}>💡 Insight</span>
            {stats.bestPlatform ? (
              <>
                <span style={{ color: T.textP, fontWeight: 500 }}>{stats.bestPlatform.name}</span>
                {" "}is your top platform with a{" "}
                <span style={{ color: T.textP, fontWeight: 500 }}>{stats.bestPlatform.rate}% response rate</span>.
                {" "}Focus your effort there this week. Overall response rate is{" "}
                <span style={{ color: T.textP, fontWeight: 500 }}>{stats.responseRate}%</span>
                {" "}across {stats.total} application{stats.total !== 1 ? "s" : ""}.
              </>
            ) : (
              "Add more applications to unlock actionable insights."
            )}
          </div>

        </div>
      )}
    </div>
  );
}