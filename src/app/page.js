"use client";

import { useState, useCallback } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useTheme } from "../utils/themeProvider/Themeprovider";
import {
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

/* ─────────────────────────────────────────────────────────
   Mock data — 35 sample applications used to power the
   "see it in action" analytics demo on the landing page.
───────────────────────────────────────────────────────── */
const MOCK_APPS = [
  { id: 1,  company: "Stripe",      role: "Product Manager",       status: "Interview", platform: "LinkedIn",     workType: "Remote",  resumeVersion: "v2", dateApplied: "2025-04-01" },
  { id: 2,  company: "Notion",      role: "Senior PM",             status: "Applied",   platform: "Referral",     workType: "Hybrid",  resumeVersion: "v1", dateApplied: "2025-04-03" },
  { id: 3,  company: "Linear",      role: "Product Lead",          status: "Offer",     platform: "Company site", workType: "Remote",  resumeVersion: "v2", dateApplied: "2025-03-28" },
  { id: 4,  company: "Figma",       role: "PM – Design Tools",     status: "Interview", platform: "LinkedIn",     workType: "Onsite",  resumeVersion: "v2", dateApplied: "2025-04-05" },
  { id: 5,  company: "Vercel",      role: "Growth PM",             status: "Applied",   platform: "AngelList",    workType: "Remote",  resumeVersion: "v1", dateApplied: "2025-04-08" },
  { id: 6,  company: "Loom",        role: "Product Manager",       status: "Rejected",  platform: "LinkedIn",     workType: "Remote",  resumeVersion: "v1", dateApplied: "2025-03-20" },
  { id: 7,  company: "Retool",      role: "Platform PM",           status: "Interview", platform: "Referral",     workType: "Hybrid",  resumeVersion: "v2", dateApplied: "2025-03-25" },
  { id: 8,  company: "Supabase",    role: "Developer PM",          status: "Applied",   platform: "Company site", workType: "Remote",  resumeVersion: "v2", dateApplied: "2025-04-10" },
  { id: 9,  company: "Atlassian",   role: "Senior PM",             status: "Rejected",  platform: "LinkedIn",     workType: "Hybrid",  resumeVersion: "v1", dateApplied: "2025-03-15" },
  { id: 10, company: "Dropbox",     role: "PM – Platform",         status: "Applied",   platform: "AngelList",    workType: "Remote",  resumeVersion: "v1", dateApplied: "2025-04-02" },
  { id: 11, company: "Intercom",    role: "Product Manager",       status: "Interview", platform: "LinkedIn",     workType: "Onsite",  resumeVersion: "v2", dateApplied: "2025-03-30" },
  { id: 12, company: "Airtable",    role: "PM – Integrations",     status: "Rejected",  platform: "Company site", workType: "Remote",  resumeVersion: "v1", dateApplied: "2025-03-18" },
  { id: 13, company: "Webflow",     role: "Growth PM",             status: "Applied",   platform: "LinkedIn",     workType: "Remote",  resumeVersion: "v2", dateApplied: "2025-04-12" },
  { id: 14, company: "Mixpanel",    role: "Data PM",               status: "Interview", platform: "Referral",     workType: "Hybrid",  resumeVersion: "v2", dateApplied: "2025-04-06" },
  { id: 15, company: "Amplitude",   role: "Product Analyst PM",    status: "Applied",   platform: "AngelList",    workType: "Remote",  resumeVersion: "v1", dateApplied: "2025-03-22" },
  { id: 16, company: "HubSpot",     role: "PM – CRM",              status: "Rejected",  platform: "LinkedIn",     workType: "Hybrid",  resumeVersion: "v1", dateApplied: "2025-03-10" },
  { id: 17, company: "Salesforce",  role: "Senior PM",             status: "Applied",   platform: "Company site", workType: "Onsite",  resumeVersion: "v2", dateApplied: "2025-04-14" },
  { id: 18, company: "Asana",       role: "PM – Workflows",        status: "Interview", platform: "LinkedIn",     workType: "Remote",  resumeVersion: "v2", dateApplied: "2025-04-07" },
  { id: 19, company: "Monday.com",  role: "Product Manager",       status: "Applied",   platform: "AngelList",    workType: "Hybrid",  resumeVersion: "v1", dateApplied: "2025-03-27" },
  { id: 20, company: "ClickUp",     role: "Growth PM",             status: "Rejected",  platform: "LinkedIn",     workType: "Remote",  resumeVersion: "v1", dateApplied: "2025-03-12" },
  { id: 21, company: "Miro",        role: "PM – Collaboration",    status: "Offer",     platform: "Referral",     workType: "Hybrid",  resumeVersion: "v2", dateApplied: "2025-04-01" },
  { id: 22, company: "Coda",        role: "Product Lead",          status: "Applied",   platform: "Company site", workType: "Remote",  resumeVersion: "v2", dateApplied: "2025-04-15" },
  { id: 23, company: "Craft",       role: "PM",                    status: "Rejected",  platform: "AngelList",    workType: "Remote",  resumeVersion: "v1", dateApplied: "2025-03-08" },
  { id: 24, company: "Descript",    role: "PM – Media",            status: "Applied",   platform: "LinkedIn",     workType: "Remote",  resumeVersion: "v2", dateApplied: "2025-04-09" },
  { id: 25, company: "LakeFS",      role: "Senior PM",             status: "Interview", platform: "Referral",     workType: "Remote",  resumeVersion: "v2", dateApplied: "2025-03-29" },
  { id: 26, company: "Pendo",       role: "PM – Analytics",        status: "Applied",   platform: "LinkedIn",     workType: "Hybrid",  resumeVersion: "v1", dateApplied: "2025-04-11" },
  { id: 27, company: "Productboard",role: "PM",                    status: "Rejected",  platform: "Company site", workType: "Remote",  resumeVersion: "v1", dateApplied: "2025-03-16" },
  { id: 28, company: "Heap",        role: "Data PM",               status: "Applied",   platform: "AngelList",    workType: "Remote",  resumeVersion: "v2", dateApplied: "2025-04-13" },
  { id: 29, company: "Segment",     role: "PM – Data Infra",       status: "Interview", platform: "LinkedIn",     workType: "Onsite",  resumeVersion: "v2", dateApplied: "2025-04-04" },
  { id: 30, company: "Braze",       role: "Product Manager",       status: "Applied",   platform: "Referral",     workType: "Hybrid",  resumeVersion: "v2", dateApplied: "2025-03-26" },
  { id: 31, company: "Contentful",  role: "PM – CMS",              status: "Rejected",  platform: "LinkedIn",     workType: "Remote",  resumeVersion: "v1", dateApplied: "2025-03-14" },
  { id: 32, company: "Sanity",      role: "Developer PM",          status: "Applied",   platform: "Company site", workType: "Remote",  resumeVersion: "v2", dateApplied: "2025-04-16" },
  { id: 33, company: "Algolia",     role: "PM – Search",           status: "Interview", platform: "LinkedIn",     workType: "Hybrid",  resumeVersion: "v2", dateApplied: "2025-03-31" },
  { id: 34, company: "Elastic",     role: "Senior PM",             status: "Applied",   platform: "AngelList",    workType: "Remote",  resumeVersion: "v1", dateApplied: "2025-04-17" },
  { id: 35, company: "Datadog",     role: "PM – Observability",    status: "Offer",     platform: "Referral",     workType: "Onsite",  resumeVersion: "v2", dateApplied: "2025-04-02" },
];

/* ─────────────────────────────────────────────────────────
   Analytics computation — unchanged business logic
───────────────────────────────────────────────────────── */
function computeAnalytics(apps) {
  const total = apps.length;
  const byStatus = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  const byPlatform = {};
  const byWorkType = {};
  const byResume = {};
  const weeklyMap = {};

  apps.forEach((a) => {
    byStatus[a.status] = (byStatus[a.status] || 0) + 1;

    if (a.platform) {
      if (!byPlatform[a.platform]) byPlatform[a.platform] = { total: 0, callbacks: 0 };
      byPlatform[a.platform].total++;
      if (a.status === "Interview" || a.status === "Offer") byPlatform[a.platform].callbacks++;
    }

    if (a.workType) {
      if (!byWorkType[a.workType]) byWorkType[a.workType] = { total: 0, callbacks: 0 };
      byWorkType[a.workType].total++;
      if (a.status === "Interview" || a.status === "Offer") byWorkType[a.workType].callbacks++;
    }

    if (a.resumeVersion) {
      if (!byResume[a.resumeVersion]) byResume[a.resumeVersion] = { total: 0, callbacks: 0 };
      byResume[a.resumeVersion].total++;
      if (a.status === "Interview" || a.status === "Offer") byResume[a.resumeVersion].callbacks++;
    }

    const d = new Date(a.dateApplied);
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    const key = monday.toISOString().slice(0, 10);
    if (!weeklyMap[key]) weeklyMap[key] = { applied: 0, interviews: 0 };
    weeklyMap[key].applied++;
    if (a.status === "Interview" || a.status === "Offer") weeklyMap[key].interviews++;
  });

  const platformData = Object.entries(byPlatform)
    .map(([name, d]) => ({ name, total: d.total, rate: d.total > 0 ? +((d.callbacks / d.total) * 100).toFixed(1) : 0 }))
    .sort((a, b) => b.rate - a.rate);

  const workTypeData = Object.entries(byWorkType)
    .map(([name, d]) => ({
      name, value: d.total, callbacks: d.callbacks,
      fill: { Remote: "#6c63ff", Hybrid: "#3b82f6", Onsite: "#f59e0b" }[name] || "#22c55e",
    }));

  const resumeData = Object.entries(byResume)
    .map(([name, d]) => ({ name, total: d.total, rate: d.total > 0 ? +((d.callbacks / d.total) * 100).toFixed(1) : 0 }))
    .sort((a, b) => b.rate - a.rate);

  const weeks = Object.entries(weeklyMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, d]) => ({
      week: new Date(key).toLocaleDateString("en-IN", { month: "short", day: "2-digit" }),
      applied: d.applied, interviews: d.interviews,
    }));

  const callbackRate = +((( byStatus.Interview + byStatus.Offer) / total) * 100).toFixed(1);
  const offerRate = +((byStatus.Offer / total) * 100).toFixed(1);
  const rejectionRate = +((byStatus.Rejected / total) * 100).toFixed(1);

  const now = new Date();
  const ghostCutoff = new Date(now - 14 * 864e5);
  const ghostCount = apps.filter(a => a.status === "Applied" && new Date(a.dateApplied) < ghostCutoff).length;
  const ghostRate = +((ghostCount / total) * 100).toFixed(1);

  return { total, byStatus, platformData, workTypeData, resumeData, weeks, callbackRate, offerRate, rejectionRate, ghostRate };
}

/* ─── Recharts tooltip ─── */
const tooltipStyle = {
  background: "rgba(10,12,11,0.97)", border: "1px solid var(--border-light)",
  borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f0f0f2", outline: "none",
  fontFamily: "'Inter', sans-serif",
};
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      {label && <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#a5b4fc", marginTop: 2 }}>
          <span style={{ color: "#8b8b9a", marginRight: 6 }}>{p.name}:</span>{p.value}
        </div>
      ))}
    </div>
  );
}

const STATUS_COLORS = { Applied: "#3b82f6", Interview: "#f59e0b", Offer: "#22c55e", Rejected: "#ef4444" };

/* ─── Donut Chart (hero preview) ─── */
function DonutChart({ size = 100 }) {
  const data = [
    { pct: 0.48, color: "#60a5fa" }, { pct: 0.16, color: "#f59e0b" },
    { pct: 0.08, color: "#34d399" }, { pct: 0.28, color: "#f87171" },
  ];
  const r = size * 0.36, cx = size / 2, cy = size / 2;
  let cumAngle = -90;
  const segments = data.map((d) => { const s = cumAngle; cumAngle += d.pct * 360; return { ...d, startAngle: s }; });

  function polarXY(a, radius) {
    const rad = (a * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  }
  function segPath(startAngle, angle, r, gap = 2) {
    const s = startAngle + gap / 2, e = startAngle + angle - gap / 2;
    const iR = r - r * 0.35;
    const [x1,y1]=polarXY(s,r), [x2,y2]=polarXY(e,r), [x3,y3]=polarXY(e,iR), [x4,y4]=polarXY(s,iR);
    const large = angle - gap > 180 ? 1 : 0;
    return `M${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} L${x3},${y3} A${iR},${iR},0,${large},0,${x4},${y4} Z`;
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      {segments.map((seg, i) => <path key={i} d={segPath(seg.startAngle, seg.pct * 360, r)} fill={seg.color} opacity="0.92" />)}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-primary)" fontSize={size * 0.13} fontWeight="700" fontFamily="'IBM Plex Mono', monospace">35</text>
      <text x={cx} y={cy + size * 0.1} textAnchor="middle" fill="var(--text-muted)" fontSize={size * 0.07} fontFamily="'Inter', sans-serif">apps</text>
    </svg>
  );
}

/* ─── Mini Trend (hero) ─── */
const HERO_TREND = [
  { label: "Wk1", applied: 3, interviews: 0 }, { label: "Wk2", applied: 4, interviews: 1 },
  { label: "Wk3", applied: 5, interviews: 2 }, { label: "Wk4", applied: 6, interviews: 2 },
  { label: "Wk5", applied: 7, interviews: 3 }, { label: "Wk6", applied: 7, interviews: 3 },
];
function MiniTrendChart() {
  const W = 280, H = 80, PAD = { top: 8, right: 8, bottom: 18, left: 18 };
  const iW = W - PAD.left - PAD.right, iH = H - PAD.top - PAD.bottom;
  const n = HERO_TREND.length, maxV = 8;
  const xOf = (i) => PAD.left + (i / (n - 1)) * iW;
  const yOf = (v) => PAD.top + iH - (v / maxV) * iH;
  function smooth(pts) {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp = (pts[i][0] + pts[i + 1][0]) / 2;
      d += ` C${cp},${pts[i][1]} ${cp},${pts[i + 1][1]} ${pts[i + 1][0]},${pts[i + 1][1]}`;
    }
    return d;
  }
  const aPts = HERO_TREND.map((d, i) => [xOf(i), yOf(d.applied)]);
  const iPts = HERO_TREND.map((d, i) => [xOf(i), yOf(d.interviews)]);
  const aLine = smooth(aPts), iLine = smooth(iPts);
  const aArea = aLine + ` L${xOf(n - 1)},${PAD.top + iH} L${PAD.left},${PAD.top + iH} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      <defs>
        <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t, i) => <line key={i} x1={PAD.left} x2={PAD.left + iW} y1={PAD.top + t * iH} y2={PAD.top + t * iH} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 4" />)}
      <path d={aArea} fill="url(#heroAreaGrad)" />
      <path d={aLine} fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" />
      <path d={iLine} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />
      <circle cx={aPts[n - 1][0]} cy={aPts[n - 1][1]} r="3" fill="#60a5fa" stroke="var(--bg-card)" strokeWidth="1.2" />
      <circle cx={iPts[n - 1][0]} cy={iPts[n - 1][1]} r="3" fill="#f59e0b" stroke="var(--bg-card)" strokeWidth="1.2" />
      {HERO_TREND.map((d, i) => <text key={i} x={xOf(i)} y={H - 3} textAnchor="middle" fontSize="5.5" fill="rgba(138,158,150,0.7)" fontFamily="'IBM Plex Mono', monospace">{d.label}</text>)}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   Analytics demo section
───────────────────────────────────────────────────────── */
function AnalyticsDemo() {
  const [analysed, setAnalysed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleAnalyse = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setStats(computeAnalytics(MOCK_APPS));
      setLoading(false);
      setAnalysed(true);
    }, 1000);
  }, []);

  const RECHARTS_RESET = `
    .recharts-wrapper,.recharts-wrapper *,.recharts-surface,.recharts-surface * {
      outline: none !important; -webkit-tap-highlight-color: transparent !important;
    }
    .recharts-surface,.recharts-surface > rect:first-child { fill: transparent !important; }
    .recharts-rectangle.recharts-tooltip-cursor { fill: rgba(255,255,255,0.04) !important; }
  `;

  return (
    <section className="ll-section" id="demo">
      <style dangerouslySetInnerHTML={{ __html: RECHARTS_RESET }} />
      <div className="ll-section-head">
        <span className="ll-eyebrow">Live demo</span>
        <h2 className="ll-section-title">See your data, not just your list</h2>
        <p className="ll-section-desc">
          35 sample applications, six weeks of activity. Run the analysis and get the full breakdown — funnel, platforms, trends, and where your resume is actually working.
        </p>
      </div>

      {!analysed && (
        <div className="ll-demo-cta">
          <button onClick={handleAnalyse} disabled={loading} className="btn-cta-primary" style={{ margin: "0 auto", fontSize: 15, padding: "14px 36px" }}>
            {loading ? (
              <>
                <span className="ll-spinner" />
                Analysing 35 applications…
              </>
            ) : (
              "See it in action"
            )}
          </button>
          <div className="ll-demo-caption">Sample dataset · 35 applications · 6 weeks</div>
        </div>
      )}

      {analysed && stats && (
        <div className="ll-demo-results">
          <div className="ll-demo-reset-row">
            <button
              onClick={() => { setAnalysed(false); setStats(null); }}
              className="btn-ghost-sm"
            >
              ↺ Reset demo
            </button>
          </div>

          <div className="ll-stat-grid">
            {[
              { label: "Total Applied",  value: stats.total,              color: "var(--blue)" },
              { label: "Callback Rate",  value: `${stats.callbackRate}%`, color: "var(--accent)" },
              { label: "Offer Rate",     value: `${stats.offerRate}%`,    color: "var(--green)" },
              { label: "Ghost Rate",     value: `${stats.ghostRate}%`,    color: "var(--yellow)" },
              { label: "Interviews",     value: stats.byStatus.Interview, color: "var(--yellow)" },
              { label: "Offers",         value: stats.byStatus.Offer,     color: "var(--green)" },
              { label: "Rejected",       value: stats.byStatus.Rejected,  color: "var(--red)" },
              { label: "Pending",        value: stats.byStatus.Applied,   color: "var(--blue)" },
            ].map((s) => (
              <div key={s.label} className="ll-stat-card">
                <div className="ll-stat-label">{s.label}</div>
                <div className="ll-stat-value" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="ll-chart-card">
            <div className="ll-chart-title">Application funnel</div>
            {[
              { label: "Applied",   count: stats.total,                color: "var(--blue)" },
              { label: "Interview", count: stats.byStatus.Interview,   color: "var(--yellow)" },
              { label: "Offer",     count: stats.byStatus.Offer,       color: "var(--green)" },
            ].map((step, i, arr) => {
              const prev = i === 0 ? stats.total : arr[i - 1].count;
              const conv = i > 0 && prev > 0 ? `${((step.count / prev) * 100).toFixed(0)}% conversion` : null;
              return (
                <div key={step.label} className="ll-funnel-row">
                  {conv && <div className="ll-funnel-conv">{conv}</div>}
                  <div className="ll-funnel-track-row">
                    <div className="ll-funnel-label">{step.label}</div>
                    <div className="ll-funnel-track">
                      <div className="ll-funnel-fill" style={{ width: `${(step.count / stats.total) * 100}%`, background: step.color }}>
                        <span>{step.count}</span>
                      </div>
                    </div>
                    <div className="ll-funnel-pct">{((step.count / stats.total) * 100).toFixed(0)}%</div>
                  </div>
                </div>
              );
            })}
            <div className="ll-funnel-rejected">Rejected: {stats.byStatus.Rejected}</div>
          </div>

          <div className="ll-donut-grid">
            <div className="ll-chart-card">
              <div className="ll-chart-title">Status distribution</div>
              <div className="ll-pie-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart tabIndex={-1}>
                    <Pie
                      isAnimationActive={false}
                      data={Object.entries(stats.byStatus).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] }))}
                      cx="50%" cy="45%" innerRadius="40%" outerRadius="65%"
                      paddingAngle={3} dataKey="value" stroke="none" tabIndex={-1}
                    >
                      {Object.entries(stats.byStatus).filter(([, v]) => v > 0).map(([name], i) => (
                        <Cell key={i} fill={STATUS_COLORS[name]} tabIndex={-1} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="ll-legend-label">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="ll-chart-card">
              <div className="ll-chart-title">Work type split</div>
              <div className="ll-pie-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart tabIndex={-1}>
                    <Pie
                      isAnimationActive={false}
                      data={stats.workTypeData}
                      cx="50%" cy="45%" innerRadius="35%" outerRadius="62%"
                      paddingAngle={4} dataKey="value" stroke="none" tabIndex={-1}
                    >
                      {stats.workTypeData.map((e, i) => <Cell key={i} fill={e.fill} tabIndex={-1} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="ll-legend-label">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="ll-chart-card">
            <div className="ll-chart-title">Weekly application trend</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.weeks} tabIndex={-1} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="gApplied2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gInterview2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="ll-legend-label">{v}</span>} />
                <Area isAnimationActive={false} type="monotone" dataKey="applied" name="Applied" stroke="#3b82f6" strokeWidth={2} fill="url(#gApplied2)" dot={false} />
                <Area isAnimationActive={false} type="monotone" dataKey="interviews" name="Interviews" stroke="#f59e0b" strokeWidth={2} fill="url(#gInterview2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="ll-chart-card">
            <div className="ll-chart-title">Platform success rate</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.platformData} layout="vertical" tabIndex={-1}>
                <defs>
                  <linearGradient id="gPlatform2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 12, fontFamily: "'Inter', sans-serif" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar isAnimationActive={false} dataKey="rate" name="Success Rate %" fill="url(#gPlatform2)" radius={[0, 6, 6, 0]} barSize={16} tabIndex={-1} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="ll-chart-card">
            <div className="ll-chart-title">Resume performance</div>
            <div className="ll-resume-row">
              {stats.resumeData.map((r, i) => {
                const R = 34, CIRC = 2 * Math.PI * R;
                const filled = (r.rate / 100) * CIRC;
                const colors = ["var(--green)", "var(--accent)"];
                const color = colors[i % colors.length];
                const isBest = i === 0;
                return (
                  <div key={r.name} className="ll-resume-item">
                    <div className="ll-resume-ring-wrap">
                      <svg width={100} height={100} viewBox="0 0 100 100">
                        <circle cx={50} cy={50} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
                        <circle cx={50} cy={50} r={R} fill="none" stroke={color} strokeWidth={8}
                          strokeLinecap="round" strokeDasharray={`${filled} ${CIRC}`}
                          transform="rotate(-90 50 50)" style={{ transition: "stroke-dasharray 0.7s ease" }} />
                      </svg>
                      <div className="ll-resume-ring-center">
                        <span style={{ color }}>{r.rate}%</span>
                      </div>
                    </div>
                    <div className="ll-resume-meta">
                      <div className="ll-resume-name-row">
                        <span>{r.name}</span>
                        {isBest && <span className="ll-best-tag">Best</span>}
                      </div>
                      <div className="ll-resume-count">{r.total} applications</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="ll-insight-note">
              <strong>{stats.resumeData[0]?.name}</strong> has a {stats.resumeData[0]?.rate}% callback rate — it's your strongest performer right now.
            </div>
          </div>

          <div className={`ll-ghost-callout ${stats.ghostRate > 40 ? "is-high" : ""}`}>
            <div className="ll-ghost-figure">
              <div className="ll-ghost-number">{stats.ghostRate.toFixed(0)}<span>%</span></div>
              <div className="ll-ghost-label">Ghost rate</div>
            </div>
            <div className="ll-ghost-text">
              <strong>{Math.round((stats.ghostRate / 100) * stats.total)} applications</strong> received no response after 14 days.
              {stats.ghostRate > 40 ? " Try personalising outreach or targeting roles with a closer match." : " That's within a normal range — keep applying consistently."}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const FEATURES = [
  { icon: "chart", title: "Visual analytics",   desc: "Track your application funnel, conversion rate, and success metrics as they happen." },
  { icon: "calendar", title: "Timeline view",    desc: "See applications laid out over time and spot the windows where response rates are highest." },
  { icon: "match", title: "Resume matcher",      desc: "Match your resume against a job description and see where it's falling short before you apply." },
  { icon: "target", title: "Prep tracker",       desc: "Log interview rounds, notes, and prep tasks so you walk in ready, every round." },
  { icon: "bell", title: "Smart reminders",      desc: "Automatic nudges for follow-ups, so nothing slips through after two weeks of silence." },
  { icon: "moon", title: "Light & dark mode",    desc: "A tracker that looks as sharp at 9am as it does at midnight before a deadline." },
];

const FEATURE_ICONS = {
  chart: (<path d="M4 19V10M10 19V5M16 19v-7M22 19H2" />),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>),
  match: (<><path d="M12 2l2.5 5.5L20 8l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" /></>),
  target: (<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" /></>),
  bell: (<><path d="M6 8a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 21a2 2 0 004 0" /></>),
  moon: (<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />),
};

function FeatureIcon({ name }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {FEATURE_ICONS[name]}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────── */
export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/dashboard");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

        @media (prefers-reduced-motion: reduce) {
          .ll-page *, .ll-page *::before, .ll-page *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }

        .ll-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .ll-page :focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .ll-mono { font-family: 'IBM Plex Mono', monospace; }
        .ll-display { font-family: 'Manrope', sans-serif; }

        /* ── Nav ── */
        .ll-nav {
          position: sticky; top: 0; z-index: 80;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 64px;
          background: color-mix(in srgb, var(--bg) 88%, transparent);
          backdrop-filter: blur(14px);
      
        }
        .ll-nav-logo { display: flex; align-items: center; gap: 9px; flex-shrink: 0; min-width: 0; }
        .ll-logo-mark {
          width: 26px; height: 26px; border-radius: 7px;
          background: var(--accent-dim); border: 1px solid var(--accent-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent); font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px;
          flex-shrink: 0;
        }
        .ll-nav-wordmark { font-family: 'Manrope', sans-serif; font-size: 16px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.3px; white-space: nowrap; }
        .ll-nav-right { display: flex; align-items: center; gap: 15px; flex-shrink: 0; }
        .ll-nav-links { display: flex; align-items: center; gap: 28px; margin-right: 8px; }
        .ll-nav-link { font-size: 13.5px; font-weight: 500; color: var(--text-secondary); text-decoration: none; transition: color 0.15s; white-space: nowrap; }
        .ll-nav-link:hover { color: var(--text-primary); }

        /* ── Theme toggle ── */
        .theme-toggle {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 20px; width: 40px; height: 23px;
          cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0;
        }
        .theme-toggle-thumb {
          position: absolute; top: 2.5px; width: 16px; height: 16px;
          border-radius: 50%; background: var(--accent); transition: left 0.2s;
        }
        .theme-toggle-thumb.dark  { left: 3px; }
        .theme-toggle-thumb.light { left: 21px; }

        /* ── Buttons ── */
        .btn-cta-primary {
          background: var(--accent); color: #ffffff; border: none; padding: 12px 28px;
          border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
          gap: 7px; white-space: nowrap; text-align: center;
        }
        .btn-cta-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 10px 28px rgba(91,108,249,0.28); }
        .btn-lg { padding: 13px 30px; font-size: 14.5px; }

        .btn-outline {
          background: transparent; color: var(--text-secondary); border: 1px solid var(--border);
          padding: 11px 22px; border-radius: 8px; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; white-space: nowrap; text-align: center;
        }
        .btn-outline:hover { border-color: var(--border-light); color: var(--text-primary); background: var(--bg-hover); }

        .btn-nav-ghost {
          background: transparent; color: var(--text-secondary); border: none;
          padding: 8px 14px; font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600;
          cursor: pointer; transition: color 0.15s; white-space: nowrap;
        }
        .btn-nav-ghost:hover { color: var(--text-primary); }

        .btn-ghost-sm {
          padding: 7px 14px; border-radius: 7px; border: 1px solid var(--border);
          background: transparent; color: var(--text-muted); font-size: 12px; font-weight: 500;
          cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
        }
        .btn-ghost-sm:hover { color: var(--text-primary); border-color: var(--border-light); background: var(--bg-hover); }

        .ll-spinner {
          width: 13px; height: 13px; border: 2px solid rgba(4,18,13,0.25); border-top-color: #04120d;
          border-radius: 50%; display: inline-block; animation: spin 0.7s linear infinite;
        }

        /* ── Hero ── */
        .ll-hero {
          position: relative;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 56px; align-items: start;
          max-width: 1180px; margin: 0 auto;
          padding: 44px 40px 72px;
        }
        .ll-hero-copy { padding-top: 6px; }

        .ll-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 12px 6px 10px; border-radius: 999px;
          background: var(--bg-card); border: 1px solid var(--border);
          font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500;
          color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.6px;
          margin-bottom: 22px;
        }
        .ll-badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          animation: pulse 2s ease-in-out infinite; flex-shrink: 0;
        }

        .ll-hero h1 {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(34px, 4vw, 54px);
          font-weight: 800; line-height: 1.08; color: var(--text-primary);
          margin-bottom: 20px; letter-spacing: -1.4px;
        }
        .ll-hero h1 em { color: var(--accent); font-style: normal; }

        .ll-hero-desc { font-size: 16px; color: var(--text-secondary); line-height: 1.7; max-width: 440px; margin-bottom: 30px; }
        .ll-hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 22px; }
        .ll-hero-trust {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--text-muted); letter-spacing: 0.2px;
        }
        .ll-hero-trust span:not(:last-child)::after { content: '·'; margin-left: 10px; color: var(--border-light); }

        /* ── Mock Dashboard preview ── */
        .mock-dashboard-wrap { position: relative; }
        .mock-dashboard {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px;
          overflow: hidden;
          position: relative; z-index: 1;
        }
        .mock-chrome {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border-bottom: 1px solid var(--border); background: var(--bg);
        }
        .mock-chrome-dots { display: flex; gap: 5px; }
        .mock-chrome-dots span { width: 8px; height: 8px; border-radius: 50%; background: var(--border-light); }
        .mock-chrome-url {
          flex: 1; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px;
          color: var(--text-muted); background: var(--bg-hover); border-radius: 5px; padding: 3px 10px;
        }
        .mock-topbar {
          background: var(--bg); border-bottom: 1px solid var(--border);
          padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;
        }
        .mock-topbar-title { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; }
        .mock-topbar-sub   { font-size: 10px; color: var(--text-muted); font-family: 'IBM Plex Mono', monospace; margin-top: 1px; }
        .mock-add-btn {
          background: var(--accent); color: #ffffff; border: none; padding: 5px 12px;
          border-radius: 6px; font-size: 10px; font-weight: 700; cursor: default; white-space: nowrap;
        }
        .mock-body { padding: 14px; }
        .mock-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; }
        .mock-stat { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 10px 10px; }
        .mock-stat-label { font-size: 8px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; font-weight: 600; }
        .mock-stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 600; line-height: 1; }
        .mock-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .mock-chart-card { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 11px 12px; }
        .mock-chart-title { font-size: 8px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 10px; font-weight: 700; }
        .mock-funnel { display: flex; align-items: center; gap: 4px; }
        .funnel-box { border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-weight: 700; font-size: 13px; color: #04120d; padding: 9px 5px; flex: 1; gap: 1px; }
        .funnel-label { font-size: 7px; font-weight: 600; font-family: 'Inter', sans-serif; color: rgba(4,18,13,0.65); }
        .funnel-arrow { color: var(--text-muted); font-size: 11px; flex-shrink: 0; }
        .funnel-rejected { font-size: 7px; color: var(--red); margin-top: 5px; text-align: right; font-family: 'IBM Plex Mono', monospace; }
        .mock-donut-row { display: flex; align-items: center; gap: 10px; }
        .mock-donut-legend { display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .legend-item { display: flex; align-items: center; justify-content: space-between; font-size: 9px; color: var(--text-secondary); }
        .legend-left { display: flex; align-items: center; gap: 5px; }
        .legend-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .legend-val { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 9px; color: var(--text-primary); }
        .trend-legend { display: flex; gap: 10px; margin-top: 6px; justify-content: center; }
        .trend-legend-item { display: flex; align-items: center; gap: 4px; font-size: 7.5px; color: var(--text-muted); font-family: 'IBM Plex Mono', monospace; }
        .trend-legend-dot { width: 5px; height: 5px; border-radius: 50%; }

        /* ── Logo/trust strip ── */
        .ll-strip { max-width: 1180px; margin: 0 auto; padding: 0 40px 60px; text-align: center; }
        .ll-strip-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.2px; }

        /* ── Section shell ── */
        .ll-section { max-width: 1180px; margin: 0 auto; padding: 76px 40px; }
        .ll-section-head { max-width: 620px; margin: 0 auto 44px; text-align: center; }
        .ll-eyebrow {
          display: block; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; font-weight: 600;
          color: var(--accent); text-transform: uppercase; letter-spacing: 1.4px; margin-bottom: 12px;
        }
        .ll-section-title {
          font-family: 'Manrope', sans-serif; font-size: clamp(26px, 3vw, 36px);
          font-weight: 800; color: var(--text-primary); margin-bottom: 12px; letter-spacing: -0.8px; line-height: 1.2;
        }
        .ll-section-desc { font-size: 15px; color: var(--text-secondary); line-height: 1.7; }

        /* ── Features ── */
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
        .feature-card { background: var(--bg-card); padding: 26px 24px; transition: background 0.15s; }
        .feature-card:hover { background: var(--bg-hover); }
        .feature-icon-box {
          width: 34px; height: 34px; border-radius: 8px; background: var(--accent-dim); border: 1px solid var(--accent-border);
          display: flex; align-items: center; justify-content: center; color: var(--accent); margin-bottom: 16px;
        }
        .feature-title { font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 7px; letter-spacing: -0.2px; }
        .feature-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.65; }

        /* ── Demo CTA ── */
        .ll-demo-cta { text-align: center; margin-bottom: 8px; }
        .ll-demo-caption { margin-top: 14px; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--text-muted); }
        .ll-demo-results { animation: fadeUp 0.4s ease both; }
        .ll-demo-reset-row { display: flex; justify-content: flex-end; margin-bottom: 20px; }

        /* Stat cards */
        .ll-stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
        .ll-stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; transition: border-color 0.15s; animation: fadeUp 0.4s ease both; }
        .ll-stat-card:hover { border-color: var(--border-light); }
        .ll-stat-label { font-size: 11px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.6px; }
        .ll-stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 26px; font-weight: 600; line-height: 1.1; margin-top: 7px; }

        /* Chart cards */
        .ll-chart-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-bottom: 16px; }
        .ll-chart-title { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px; }
        .ll-legend-label { font-size: 11px; color: var(--text-secondary); font-family: 'Inter', sans-serif; }

        .ll-funnel-row { margin-bottom: 10px; }
        .ll-funnel-conv { font-size: 10px; color: var(--text-muted); margin-bottom: 3px; font-family: 'IBM Plex Mono', monospace; }
        .ll-funnel-track-row { display: flex; align-items: center; gap: 10px; }
        .ll-funnel-label { width: 70px; font-size: 11px; color: var(--text-muted); text-align: right; }
        .ll-funnel-track { flex: 1; height: 28px; background: var(--bg); border-radius: 6px; overflow: hidden; }
        .ll-funnel-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; padding-left: 10px; transition: width 1.1s cubic-bezier(.4,0,.2,1); }
        .ll-funnel-fill span { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; color: #04120d; }
        .ll-funnel-pct { width: 40px; font-size: 11px; color: var(--text-muted); font-family: 'IBM Plex Mono', monospace; }
        .ll-funnel-rejected { margin-top: 8px; font-size: 11px; color: var(--red); font-family: 'IBM Plex Mono', monospace; }

        .ll-donut-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .ll-pie-wrap { width: 100%; height: 200px; min-width: 0; overflow: hidden; }

        .ll-resume-row { display: flex; gap: 28px; justify-content: center; align-items: center; padding: 12px 0; flex-wrap: wrap; }
        .ll-resume-item { display: flex; flex-direction: column; align-items: center; gap: 9px; }
        .ll-resume-ring-wrap { position: relative; }
        .ll-resume-ring-center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .ll-resume-ring-center span { font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 600; }
        .ll-resume-meta { text-align: center; }
        .ll-resume-name-row { display: flex; align-items: center; gap: 6px; justify-content: center; font-size: 13px; color: var(--text-secondary); font-weight: 600; }
        .ll-best-tag { font-family: 'IBM Plex Mono', monospace; font-size: 9px; padding: 1px 6px; border-radius: 4px; background: var(--accent-dim); color: var(--accent); font-weight: 600; }
        .ll-resume-count { font-size: 11px; color: var(--text-muted); margin-top: 2px; font-family: 'IBM Plex Mono', monospace; }
        .ll-insight-note {
          font-size: 12.5px; color: var(--accent); background: var(--accent-dim); border: 1px solid var(--accent-border);
          border-radius: 8px; padding: 10px 14px; margin-top: 6px; line-height: 1.6;
        }
        .ll-insight-note strong { color: var(--text-primary); }

        .ll-ghost-callout {
          background: var(--bg-card); border: 1px solid rgba(245,158,11,0.3); border-radius: 10px;
          padding: 22px 24px; display: flex; align-items: center; gap: 22px;
        }
        .ll-ghost-callout.is-high { border-color: rgba(239,68,68,0.3); }
        .ll-ghost-figure { text-align: center; flex-shrink: 0; }
        .ll-ghost-number { font-family: 'IBM Plex Mono', monospace; font-size: 38px; font-weight: 600; line-height: 1; color: var(--yellow); }
        .is-high .ll-ghost-number { color: var(--red); }
        .ll-ghost-number span { font-size: 18px; }
        .ll-ghost-label { font-size: 11px; color: var(--text-muted); margin-top: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
        .ll-ghost-text { flex: 1; font-size: 13px; color: var(--text-secondary); line-height: 1.7; border-left: 2px solid var(--yellow); padding-left: 16px; }
        .is-high .ll-ghost-text { border-left-color: var(--red); }
        .ll-ghost-text strong { color: var(--text-primary); }

        /* ── CTA banner ── */
       .ll-cta-banner { max-width: 1200px; margin: 0 auto 80px; padding: 0 40px; }
        .cta-inner { background: var(--accent-dim); border: 1px solid var(--accent-border); border-radius: 16px; padding: 56px 40px; text-align: center; }
        .cta-inner h2 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(24px, 3vw, 34px); font-weight: 700; color: var(--text-primary); margin-bottom: 12px; letter-spacing: -0.6px; }
        .cta-inner p { font-size: 15px; color: var(--text-secondary); margin-bottom: 28px; font-weight: 400; }

        /* ── Footer ── */
        .ll-footer-inner { padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; max-width: 1180px; margin: 0 auto; border-top: 1px solid var(--border); }
        .ll-footer-copy { font-size: 12px; color: var(--text-muted); font-family: 'IBM Plex Mono', monospace; }

        /* ── Responsive: tablet ── */
        @media (max-width: 900px) {
          .ll-hero         { grid-template-columns: 1fr; padding: 32px 24px 44px; gap: 36px; }
          .ll-hero-copy    { padding-top: 0; }
          .ll-hero-desc    { max-width: none; }
          .mock-stats      { grid-template-columns: repeat(2, 1fr); }
          .mock-charts     { grid-template-columns: 1fr; }
          .features-grid   { grid-template-columns: repeat(2, 1fr); }
          .ll-nav          { padding: 0 20px; }
          .ll-nav-links    { display: none; }
          .ll-footer-inner { flex-direction: column; gap: 10px; text-align: center; }
        }

        /* ── Responsive: mobile ── */
        @media (max-width: 640px) {
          .ll-nav               { padding: 0 14px; height: 58px; }
          .ll-nav-right         { gap: 6px; }
          .ll-nav-wordmark      { font-size: 14px; }
          .ll-logo-mark         { width: 22px; height: 22px; font-size: 11px; }
          .theme-toggle         { width: 32px; height: 19px; }
          .theme-toggle-thumb   { width: 13px; height: 13px; top: 2px; }
          .theme-toggle-thumb.dark  { left: 2.5px; }
          .theme-toggle-thumb.light { left: 16.5px; }
          .btn-nav-ghost        { padding: 6px 8px; font-size: 12px; }
          .ll-nav-right .btn-cta-primary { padding: 7px 12px; font-size: 12px; }

          .features-grid       { grid-template-columns: 1fr; }
          .ll-hero h1           { font-size: 30px; letter-spacing: -1px; }
          .ll-hero, .ll-strip   { padding-left: 20px; padding-right: 20px; }
          .ll-hero              { padding-top: 24px; padding-bottom: 36px; }
          .ll-section, .ll-cta-banner { padding: 52px 20px; }
          .ll-hero-ctas         { flex-direction: column; }
          .ll-hero-ctas a, .ll-hero-ctas button { width: 100%; }

          .ll-stat-grid         { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .ll-stat-card         { padding: 14px 16px; }
          .ll-stat-value        { font-size: 22px; }

          .ll-donut-grid        { grid-template-columns: 1fr; gap: 12px; }
          .ll-pie-wrap          { height: 180px; }

          .ll-ghost-callout     { flex-direction: column; text-align: center; }
          .ll-ghost-text        { border-left: none; padding-left: 0; border-top: 2px solid var(--yellow); padding-top: 14px; }
          .is-high .ll-ghost-text { border-top-color: var(--red); }
        }

        /* ── Responsive: very small phones ── */
        @media (max-width: 380px) {
          .ll-nav-right .btn-cta-primary { padding: 6px 10px; font-size: 11px; }
          .btn-nav-ghost { padding: 6px 6px; font-size: 11px; }
        }
      `}</style>

      <div className="ll-page">
        {/* NAV */}
        <nav className="ll-nav">
          <div className="ll-nav-logo">
            <div className="ll-logo-mark">L</div>
            <div className="ll-nav-wordmark">LeaderLab</div>
          </div>
          
          <div className="ll-nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              <div className={`theme-toggle-thumb ${theme}`} />
            </button>
           
            <SignInButton mode="modal">
              <button className="btn-cta-primary" style={{ padding: "9px 18px", fontSize: 13.5 }}>Sign in</button>
            </SignInButton>
          </div>
        </nav>

        {/* HERO */}
        <section className="ll-hero">
          <div className="ll-hero-copy">
            <h1>The command centre<br />for your <em>job search.</em></h1>
            <p className="ll-hero-desc">
              Replace scattered spreadsheets and sticky notes with one clean system. Track every application, see what's actually working, and always know your next move.
            </p>
            <div className="ll-hero-ctas">
              <SignUpButton mode="modal">
                <button className="btn-cta-primary btn-lg">Get started free</button>
              </SignUpButton>
              <a href="#demo" className="btn-outline btn-lg">See it in action</a>
            </div>
          
          </div>

          <div className="mock-dashboard-wrap">
            <div className="mock-dashboard">
              <div className="mock-chrome">
                <div className="mock-chrome-dots"><span /><span /><span /></div>
                <div className="mock-chrome-url">leaderlab.in/dashboard</div>
              </div>
              <div className="mock-topbar">
                <div>
                  <div className="mock-topbar-title">Analytics</div>
                  <div className="mock-topbar-sub">35 applications tracked</div>
                </div>
                <div className="mock-add-btn">+ Add Application</div>
              </div>
              <div className="mock-body">
                <div className="mock-stats">
                  <div className="mock-stat"><div className="mock-stat-label">Total Applied</div><div className="mock-stat-value" style={{ color: "var(--accent)" }}>35</div></div>
                  <div className="mock-stat"><div className="mock-stat-label">Interviews</div><div className="mock-stat-value" style={{ color: "var(--yellow)" }}>10</div></div>
                  <div className="mock-stat"><div className="mock-stat-label">Offers</div><div className="mock-stat-value" style={{ color: "var(--green)" }}>3</div></div>
                  <div className="mock-stat"><div className="mock-stat-label">Success Rate</div><div className="mock-stat-value" style={{ color: "var(--green)", fontSize: 15 }}>8.6%</div></div>
                </div>
                <div className="mock-charts">
                  <div className="mock-chart-card">
                    <div className="mock-chart-title">Application Funnel</div>
                    <div className="mock-funnel">
                      {[
                        { label: "Applied",   value: 35, color: "#60a5fa" },
                        { label: "Interview", value: 10, color: "#f59e0b" },
                        { label: "Offer",     value: 3,  color: "#34d399" },
                      ].map((f, i, arr) => (
                        <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                          <div className="funnel-box" style={{ background: f.color, flex: 1 }}>
                            {f.value}<div className="funnel-label">{f.label}</div>
                          </div>
                          {i < arr.length - 1 && <div className="funnel-arrow">→</div>}
                        </div>
                      ))}
                    </div>
                    <div className="funnel-rejected">Rejected: 9</div>
                  </div>
                  <div className="mock-chart-card">
                    <div className="mock-chart-title">Status Distribution</div>
                    <div className="mock-donut-row">
                      <DonutChart size={88} />
                      <div className="mock-donut-legend">
                        {[
                          { label: "Applied",   color: "#60a5fa", val: "37%" },
                          { label: "Interview", color: "#f59e0b", val: "29%" },
                          { label: "Offer",     color: "#34d399", val: "9%"  },
                          { label: "Rejected",  color: "#f87171", val: "26%" },
                        ].map((l) => (
                          <div className="legend-item" key={l.label}>
                            <div className="legend-left"><div className="legend-dot" style={{ background: l.color }} /><span>{l.label}</span></div>
                            <span className="legend-val">{l.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mock-chart-card" style={{ gridColumn: "1 / -1" }}>
                    <div className="mock-chart-title">Weekly Trend</div>
                    <MiniTrendChart />
                    <div className="trend-legend">
                      <div className="trend-legend-item"><div className="trend-legend-dot" style={{ background: "#60a5fa" }} />Applied</div>
                      <div className="trend-legend-item"><div className="trend-legend-dot" style={{ background: "#f59e0b" }} />Interviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* ANALYTICS DEMO */}
        <AnalyticsDemo />

         {/* CTA BANNER */}
        <div className="ll-cta-banner">
          <div className="cta-inner">
            <h2>Ready to take control of your job search?</h2>
            <p>Join hundreds of candidates who track smarter and land faster with LeaderLab.</p>
            <SignUpButton mode="modal">
              <button className="btn-cta-primary" style={{ margin: "0 auto", fontSize: 15, padding: "14px 36px" }}>
                Create Free Account
              </button>
            </SignUpButton>
          </div>
        </div>

        {/* FOOTER */}
        <footer>
          <div className="ll-footer-inner">
            <div className="ll-nav-logo">
              <div className="ll-logo-mark">L</div>
              <div className="ll-nav-wordmark">LeaderLab</div>
            </div>
            <div className="ll-footer-copy">© {new Date().getFullYear()} LeaderLab. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
}