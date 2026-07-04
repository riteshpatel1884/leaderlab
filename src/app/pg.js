"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useTheme } from "../utils/themeProvider/Themeprovider";
import {
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

/* ─── 35 Mock Applications ─── */
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

/* ─── Analytics computation ─── */
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
      fill: { Remote: "#5b6cf9", Hybrid: "#5b9df9", Onsite: "#f0b429" }[name] || "#34d399",
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
  background: "rgba(10,11,15,0.97)", border: "1px solid rgba(91,108,249,0.25)",
  borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#f1f2f5", outline: "none",
  fontFamily: "'Inter', sans-serif",
};
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      {label && <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#9ca6f5", marginTop: 2 }}>
          <span style={{ color: "#7d8493", marginRight: 6 }}>{p.name}:</span>{p.value}
        </div>
      ))}
    </div>
  );
}

/* ─── Status colors ─── */
const STATUS_COLORS = { Applied: "#5b9df9", Interview: "#f0b429", Offer: "#34d399", Rejected: "#f26d6d" };

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(target / 40);
      const t = setInterval(() => {
        start = Math.min(start + step, target);
        setVal(start);
        if (start >= target) clearInterval(t);
      }, 30);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Donut Chart (hero mock) ─── */
function DonutChart({ size = 100 }) {
  const data = [
    { pct: 0.48, color: "#5b9df9" }, { pct: 0.16, color: "#f0b429" },
    { pct: 0.08, color: "#34d399" }, { pct: 0.28, color: "#f26d6d" },
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
      {segments.map((seg, i) => <path key={i} d={segPath(seg.startAngle, seg.pct * 360, r)} fill={seg.color} opacity="0.94" />)}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-primary)" fontSize={size * 0.13} fontWeight="700" fontFamily="'Space Grotesk', sans-serif">35</text>
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
          <stop offset="0%" stopColor="#5b6cf9" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5b6cf9" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t, i) => <line key={i} x1={PAD.left} x2={PAD.left + iW} y1={PAD.top + t * iH} y2={PAD.top + t * iH} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 4" />)}
      <path d={aArea} fill="url(#heroAreaGrad)" />
      <path d={aLine} fill="none" stroke="#5b6cf9" strokeWidth="1.8" strokeLinecap="round" />
      <path d={iLine} fill="none" stroke="#f0b429" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />
      <circle cx={aPts[n - 1][0]} cy={aPts[n - 1][1]} r="3" fill="#5b6cf9" stroke="var(--bg-card)" strokeWidth="1.2" />
      <circle cx={iPts[n - 1][0]} cy={iPts[n - 1][1]} r="3" fill="#f0b429" stroke="var(--bg-card)" strokeWidth="1.2" />
      {HERO_TREND.map((d, i) => <text key={i} x={xOf(i)} y={H - 3} textAnchor="middle" fontSize="5.5" fill="rgba(146,151,166,0.75)" fontFamily="'Inter', sans-serif">{d.label}</text>)}
    </svg>
  );
}

/* ─── Analytics Demo Section ─── */
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
    }, 1200);
  }, []);

  const RECHARTS_RESET = `
    .recharts-wrapper,.recharts-wrapper *,.recharts-surface,.recharts-surface * {
      outline: none !important; -webkit-tap-highlight-color: transparent !important;
    }
    .recharts-surface,.recharts-surface > rect:first-child { fill: transparent !important; }
    .recharts-rectangle.recharts-tooltip-cursor { fill: rgba(255,255,255,0.04) !important; }
  `;

  return (
    <section className="ll-features" style={{ paddingTop: 56, paddingBottom: 80 }}>
      <style dangerouslySetInnerHTML={{ __html: RECHARTS_RESET }} />
      <p className="ll-section-eyebrow">See it in action</p>
      <h2 className="ll-section-title">Your job search analytics</h2>
      <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 14.5, marginBottom: 36, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px", fontWeight: 400 }}>
        35 real-world applications. Click Analyse to instantly see your full performance breakdown — funnel, platforms, trends and more.
      </p>

      {/* CTA */}
      {!analysed && (
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <button
            onClick={handleAnalyse}
            disabled={loading}
            style={{
              padding: "13px 32px", borderRadius: 9,
              background: loading ? "rgba(91,108,249,0.3)" : "var(--accent)",
              border: "none", color: "#fff", fontSize: 14.5, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Inter', sans-serif", letterSpacing: "0.1px",
              boxShadow: loading ? "none" : "0 10px 28px rgba(91,108,249,0.28)",
              transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 10,
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                Analysing 35 applications…
              </>
            ) : (
              <>Analyse My Applications</>
            )}
          </button>
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>Based on 35 mock applications across 6 weeks</div>
        </div>
      )}

      {/* Charts */}
      {analysed && stats && (
        <div style={{ animation: "fadeUp 0.4s ease both" }}>
          {/* Refresh button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button
              onClick={() => { setAnalysed(false); setStats(null); }}
              style={{ padding: "7px 16px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-light)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              ↺ Reset
            </button>
          </div>

          {/* ── Stat cards: 4 per row on desktop, 2 per row on mobile ── */}
          <div className="stat-cards-grid">
            {[
              { label: "Total Applied",  value: stats.total,              color: "#5b9df9" },
              { label: "Callback Rate",  value: `${stats.callbackRate}%`, color: "#5b6cf9" },
              { label: "Offer Rate",     value: `${stats.offerRate}%`,    color: "#34d399" },
              { label: "Ghost Rate",     value: `${stats.ghostRate}%`,    color: "#f0b429" },
              { label: "Interviews",     value: stats.byStatus.Interview, color: "#f0b429" },
              { label: "Offers",         value: stats.byStatus.Offer,     color: "#34d399" },
              { label: "Rejected",       value: stats.byStatus.Rejected,  color: "#f26d6d" },
              { label: "Pending",        value: stats.byStatus.Applied,   color: "#5b9df9" },
            ].map((s) => (
              <div key={s.label} className="stat-card" style={{ animation: "fadeUp 0.4s ease both" }}>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 27, fontWeight: 600, color: s.color, lineHeight: 1.1, margin: "7px 0 4px", letterSpacing: "-0.5px" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Funnel */}
          <div className="demo-chart-card" style={{ marginBottom: 16 }}>
            <div className="demo-chart-title">Application Funnel</div>
            {[
              { label: "Applied",   count: stats.total,                color: "#5b9df9" },
              { label: "Interview", count: stats.byStatus.Interview,   color: "#f0b429" },
              { label: "Offer",     count: stats.byStatus.Offer,       color: "#34d399" },
            ].map((step, i, arr) => {
              const prev = i === 0 ? stats.total : arr[i - 1].count;
              const conv = i > 0 && prev > 0 ? `${((step.count / prev) * 100).toFixed(0)}% conv.` : null;
              return (
                <div key={step.label} style={{ marginBottom: 10 }}>
                  {conv && <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>{conv}</div>}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 70, fontSize: 11, color: "var(--text-muted)", textAlign: "right", fontWeight: 500 }}>{step.label}</div>
                    <div style={{ flex: 1, height: 28, background: "var(--bg)", borderRadius: 6, overflow: "hidden" }}>
                      <div style={{
                        width: `${(step.count / stats.total) * 100}%`, height: "100%",
                        background: step.color, borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 8,
                        transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'IBM Plex Mono', monospace" }}>{step.count}</span>
                      </div>
                    </div>
                    <div style={{ width: 40, fontSize: 11, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>{((step.count / stats.total) * 100).toFixed(0)}%</div>
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 8, fontSize: 11, color: "#f26d6d", fontWeight: 500 }}>Rejected: {stats.byStatus.Rejected}</div>
          </div>

          {/* ── Donut charts: side-by-side, mobile-safe ── */}
          <div className="donut-grid">
            {/* Status Donut */}
            <div className="demo-chart-card">
              <div className="demo-chart-title">Status Distribution</div>
              <div className="pie-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart style={{ outline: "none" }} tabIndex={-1}>
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
                    <Legend
                      iconType="circle" iconSize={7}
                      formatter={(v) => <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Work Type Donut */}
            <div className="demo-chart-card">
              <div className="demo-chart-title">Work Type Split</div>
              <div className="pie-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart style={{ outline: "none" }} tabIndex={-1}>
                    <Pie
                      isAnimationActive={false}
                      data={stats.workTypeData}
                      cx="50%" cy="45%" innerRadius="35%" outerRadius="62%"
                      paddingAngle={4} dataKey="value" stroke="none" tabIndex={-1}
                    >
                      {stats.workTypeData.map((e, i) => <Cell key={i} fill={e.fill} tabIndex={-1} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle" iconSize={7}
                      formatter={(v) => <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="demo-chart-card" style={{ marginBottom: 16 }}>
            <div className="demo-chart-title">Weekly Application Trend</div>
            <ResponsiveContainer width="100%" height={200} style={{ background: "transparent", outline: "none" }}>
              <AreaChart data={stats.weeks} style={{ outline: "none" }} tabIndex={-1} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="gApplied2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5b9df9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5b9df9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gInterview2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f0b429" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f0b429" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#565c6b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#565c6b", fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7} formatter={(v) => <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{v}</span>} />
                <Area isAnimationActive={false} type="monotone" dataKey="applied" name="Applied" stroke="#5b9df9" strokeWidth={2} fill="url(#gApplied2)" dot={false} />
                <Area isAnimationActive={false} type="monotone" dataKey="interviews" name="Interviews" stroke="#f0b429" strokeWidth={2} fill="url(#gInterview2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Success Rate */}
          <div className="demo-chart-card" style={{ marginBottom: 16 }}>
            <div className="demo-chart-title">Platform Success Rate</div>
            <ResponsiveContainer width="100%" height={180} style={{ background: "transparent", outline: "none" }}>
              <BarChart data={stats.platformData} layout="vertical" style={{ outline: "none" }} tabIndex={-1}>
                <defs>
                  <linearGradient id="gPlatform2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#5b6cf9" />
                    <stop offset="100%" stopColor="#5b9df9" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#565c6b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#9297a6", fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar isAnimationActive={false} dataKey="rate" name="Success Rate %" fill="url(#gPlatform2)" radius={[0, 6, 6, 0]} barSize={16} tabIndex={-1} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Resume Performance */}
          <div className="demo-chart-card" style={{ marginBottom: 16 }}>
            <div className="demo-chart-title">Resume Performance</div>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", alignItems: "center", padding: "12px 0" }}>
              {stats.resumeData.map((r, i) => {
                const R = 34, CIRC = 2 * Math.PI * R;
                const filled = (r.rate / 100) * CIRC;
                const colors = ["#34d399", "#5b6cf9"];
                const color = colors[i % colors.length];
                const isBest = i === 0;
                return (
                  <div key={r.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ position: "relative" }}>
                      <svg width={100} height={100} viewBox="0 0 100 100">
                        <circle cx={50} cy={50} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
                        <circle cx={50} cy={50} r={R} fill="none" stroke={color} strokeWidth={8}
                          strokeLinecap="round" strokeDasharray={`${filled} ${CIRC}`}
                          transform="rotate(-90 50 50)" style={{ transition: "stroke-dasharray 0.7s ease" }} />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 19, fontWeight: 600, color, fontFamily: "'IBM Plex Mono', monospace" }}>{r.rate}%</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>{r.name}</span>
                        {isBest && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 99, background: "rgba(52,211,153,0.15)", color: "#34d399", fontWeight: 700 }}>BEST</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.total} apps</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 12, color: "#34d399", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.18)", borderRadius: 8, padding: "8px 12px", marginTop: 4 }}>
              ✦ <strong>{stats.resumeData[0]?.name}</strong> has a {stats.resumeData[0]?.rate}% callback rate — use it as your primary resume.
            </div>
          </div>

          {/* Ghost rate callout */}
          <div style={{
            background: "var(--bg-card)",
            border: `1px solid ${stats.ghostRate > 40 ? "rgba(242,109,109,0.3)" : "rgba(240,180,41,0.3)"}`,
            borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, marginBottom: 16,
          }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 40, fontWeight: 600, lineHeight: 1, color: stats.ghostRate > 40 ? "#f26d6d" : "#f0b429", fontFamily: "'IBM Plex Mono', monospace" }}>
                {stats.ghostRate.toFixed(0)}<span style={{ fontSize: 19 }}>%</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, fontWeight: 500 }}>Ghost Rate</div>
            </div>
            <div style={{ flex: 1, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, borderLeft: `2px solid ${stats.ghostRate > 40 ? "#f26d6d" : "#f0b429"}`, paddingLeft: 16 }}>
              <strong style={{ color: "var(--text-primary)" }}>{Math.round((stats.ghostRate / 100) * stats.total)} applications</strong> received no response after 14 days.
              {stats.ghostRate > 40 ? " Try personalising your outreach or targeting roles with higher match." : " Within normal range — keep applying consistently."}
            </div>
          </div>

         
        </div>
      )}
    </section>
  );
}

const FEATURES = [
  { icon: "📊", title: "Visual Analytics",  desc: "Track your application funnel, conversion rate, and success metrics in real time." },
  { icon: "🗓️", title: "Timeline View",     desc: "See applications over time and spot the best windows to apply for maximum response." },
  { icon: "🤝", title: "Resume Matcher",    desc: "Match your resume to job descriptions and boost your interview call-back rate." },
  { icon: "🎯", title: "Prep Tracker",      desc: "Log interview rounds, notes, and prep tasks so you walk in fully confident." },
  { icon: "🔔", title: "Smart Reminders",   desc: "Never let a follow-up slip. Get nudged at the right time for every application." },
  { icon: "🌗", title: "Light & Dark Mode", desc: "Pristine in daylight, easy on the eyes at midnight. Your tracker, your vibe." },
];

/* ─── Main Page ─── */
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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .ll-page { min-height: 100vh; background: var(--bg); color: var(--text-primary); font-family: 'Inter', sans-serif; }

        /* ── Nav ── */
        .ll-nav {
          position: sticky; top: 0; z-index: 80;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 64px;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }
        .ll-nav-logo { font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.2px; }
        .ll-nav-logo span { color: var(--accent); }
        .ll-nav-right { display: flex; align-items: center; gap: 10px; }

        /* ── Theme toggle ── */
        .theme-toggle {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 20px; width: 42px; height: 24px;
          cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0;
        }
        .theme-toggle-thumb {
          position: absolute; top: 3px; width: 18px; height: 18px;
          border-radius: 50%; background: var(--accent); transition: left 0.2s;
        }
        .theme-toggle-thumb.dark  { left: 3px; }
        .theme-toggle-thumb.light { left: 21px; }

        /* ── Hero ── */
        .ll-hero {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: center;
          max-width: 1200px; margin: 0 auto;
          padding: 64px 40px 68px;
        }
        .ll-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 600; color: var(--accent);
          text-transform: uppercase; letter-spacing: 1.1px;
          background: var(--accent-dim); border: 1px solid var(--accent-border);
          padding: 6px 12px; border-radius: 20px; margin-bottom: 20px;
        }
        .ll-hero h1 {
          font-family: 'Space Grotesk', sans-serif; font-size: clamp(32px, 3.8vw, 50px);
          font-weight: 700; line-height: 1.12; color: var(--text-primary);
          margin-bottom: 18px; letter-spacing: -1.2px;
        }
        .ll-hero h1 em { color: var(--accent); font-style: normal; }
        .ll-hero-desc { font-size: 15.5px; color: var(--text-secondary); line-height: 1.75; max-width: 440px; margin-bottom: 32px; font-weight: 400; }
        .ll-hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }

        /* ── Buttons ── */
        .btn-cta-primary {
          background: var(--accent); color: #ffffff; border: none; padding: 12px 28px;
          border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          text-decoration: none; display: inline-flex; align-items: center; gap: 7px;
        }
        .btn-cta-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 10px 28px rgba(91,108,249,0.28); }

        .btn-cta-ghost {
          background: transparent; color: var(--text-secondary); border: 1px solid var(--border);
          padding: 12px 22px; border-radius: 8px; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s;
          text-decoration: none; display: inline-flex; align-items: center; gap: 7px;
        }
        .btn-cta-ghost:hover { border-color: var(--accent-border); color: var(--accent); background: var(--accent-dim); }

        /* ── Mock Dashboard ── */
        .mock-dashboard-wrap { position: relative; perspective: 1000px; }
        .mock-dashboard-wrap::before {
          content: ''; position: absolute; inset: 30px -10px -20px;
          background: var(--accent); opacity: 0.08; border-radius: 20px; filter: blur(48px); z-index: 0;
        }
        .mock-dashboard {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;
          overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px var(--border);
          position: relative; z-index: 1;
          transform: perspective(900px) rotateY(-5deg) rotateX(2.5deg);
        }
        .mock-topbar {
          background: var(--bg); border-bottom: 1px solid var(--border);
          padding: 11px 16px; display: flex; align-items: center; justify-content: space-between;
        }
        .mock-topbar-title { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; }
        .mock-topbar-sub   { font-size: 10px; color: var(--text-muted); font-weight: 500; }
        .mock-add-btn {
          background: var(--accent); color: #fff; border: none; padding: 5px 12px;
          border-radius: 6px; font-size: 10px; font-weight: 600; cursor: default; white-space: nowrap;
        }
        .mock-body { padding: 12px; }
        .mock-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 10px; }
        .mock-stat { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 9px 10px; }
        .mock-stat-label { font-size: 8px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 3px; font-weight: 600; }
        .mock-stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 600; line-height: 1; }
        .mock-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .mock-chart-card { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 10px 11px; }
        .mock-chart-title { font-size: 8px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 9px; font-weight: 600; }
        .mock-funnel { display: flex; align-items: center; gap: 4px; }
        .funnel-box { border-radius: 7px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 13px; color: #fff; padding: 9px 5px; flex: 1; gap: 1px; }
        .funnel-label { font-size: 7px; font-weight: 600; font-family: 'Inter', sans-serif; color: rgba(255,255,255,0.8); }
        .funnel-arrow { color: var(--text-muted); font-size: 11px; flex-shrink: 0; }
        .funnel-rejected { font-size: 7px; color: var(--red); margin-top: 5px; text-align: right; font-weight: 500; }
        .mock-donut-row { display: flex; align-items: center; gap: 10px; }
        .mock-donut-legend { display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .legend-item { display: flex; align-items: center; justify-content: space-between; font-size: 9px; color: var(--text-secondary); }
        .legend-left { display: flex; align-items: center; gap: 5px; }
        .legend-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .legend-val { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 9px; color: var(--text-primary); }
        .trend-chart-wrap { width: 100%; }
        .trend-legend { display: flex; gap: 10px; margin-top: 6px; justify-content: center; }
        .trend-legend-item { display: flex; align-items: center; gap: 4px; font-size: 7.5px; color: var(--text-muted); font-weight: 500; }
        .trend-legend-dot { width: 5px; height: 5px; border-radius: 50%; }

        /* ── Features ── */
        .ll-features { max-width: 1200px; margin: 0 auto; padding: 80px 40px; }
        .ll-section-eyebrow { font-size: 12px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 1.4px; margin-bottom: 10px; text-align: center; }
        .ll-section-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(26px, 3vw, 36px); font-weight: 700; color: var(--text-primary); text-align: center; margin-bottom: 8px; letter-spacing: -0.8px; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 36px; }
        .feature-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 22px; transition: border-color 0.15s, transform 0.15s; }
        .feature-card:hover { border-color: var(--accent-border); transform: translateY(-3px); }
        .feature-icon { font-size: 24px; margin-bottom: 12px; }
        .feature-title { font-family: 'Space Grotesk', sans-serif; font-size: 14.5px; font-weight: 700; color: var(--text-primary); margin-bottom: 7px; letter-spacing: -0.2px; }
        .feature-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.7; }

        /* ── Demo chart cards ── */
        .demo-chart-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-bottom: 16px; }
        .demo-chart-title { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.9px; margin-bottom: 16px; }

        /* ── Stat cards: 4 per row desktop, 2 per row mobile ── */
        .stat-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
       
        }
        .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; transition: border-color 0.15s; }
        .stat-card:hover { border-color: var(--border-light); }
        .stat-label { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; }

        /* ── Donut chart grid: side-by-side desktop, stacked mobile ── */
        .donut-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        /* ── Pie chart container: fixed height, no overflow ── */
        .pie-chart-wrap {
          width: 100%;
          height: 200px;
          min-width: 0;
          overflow: hidden;
        }

        /* ── CTA banner ── */
        .ll-cta-banner { max-width: 1200px; margin: 0 auto 80px; padding: 0 40px; }
        .cta-inner { background: var(--accent-dim); border: 1px solid var(--accent-border); border-radius: 16px; padding: 56px 40px; text-align: center; }
        .cta-inner h2 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(24px, 3vw, 34px); font-weight: 700; color: var(--text-primary); margin-bottom: 12px; letter-spacing: -0.6px; }
        .cta-inner p { font-size: 15px; color: var(--text-secondary); margin-bottom: 28px; font-weight: 400; }

        /* ── Footer ── */
        .ll-footer { padding: 24px 40px; display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; border-top: 1px solid var(--border); }
        .ll-footer-copy { font-size: 12px; color: var(--text-muted); }

        /* ── Responsive: tablet ── */
        @media (max-width: 900px) {
          .ll-hero         { grid-template-columns: 1fr; padding: 40px 24px; }
          .mock-stats      { grid-template-columns: repeat(2, 1fr); }
          .mock-charts     { grid-template-columns: 1fr; }
          .features-grid   { grid-template-columns: repeat(2, 1fr); }
          .ll-nav          { padding: 0 20px; }
          .ll-footer       { flex-direction: column; gap: 8px; text-align: center; }
        }

        /* ── Responsive: mobile ── */
        @media (max-width: 640px) {
          .features-grid      { grid-template-columns: 1fr; }
          .ll-hero h1         { font-size: 28px; }
          .ll-features,
          .ll-cta-banner      { padding: 48px 20px; }

          /* 4+4 stat grid → 2+2+2+2 on mobile */
          .stat-cards-grid    { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .stat-card          { padding: 14px 16px; }
          .stat-card div[style] { font-size: 22px !important; }

          /* Pie charts: stack vertically on mobile, constrain height */
          .donut-grid         { grid-template-columns: 1fr; gap: 12px; }
          .pie-chart-wrap     { height: 180px; }
        }
      `}</style>

      <div className="ll-page">
        {/* NAV */}
        <nav className="ll-nav">
          <div className="ll-nav-logo">Leader<span>Lab</span></div>
          <div className="ll-nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              <div className={`theme-toggle-thumb ${theme}`} />
            </button>
            <SignInButton mode="modal">
              <button className="btn-cta-ghost" style={{ padding: "7px 16px", fontSize: 13 }}>Sign in</button>
            </SignInButton>
          </div>
        </nav>

        {/* HERO */}
        <section className="ll-hero">
          <div>
            <div className="ll-hero-eyebrow">● Built for job seekers</div>
            <h1>Your Job Search,<br />Finally <em>Under Control</em></h1>
            <p className="ll-hero-desc">
              LeaderLab is a placement tracker that turns scattered applications into a clean, visual command centre — so you always know where you stand and what to do next.
            </p>
            <div className="ll-hero-ctas">
              <SignUpButton mode="modal">
                <button className="btn-cta-primary">Get started free</button>
              </SignUpButton>
              <a href="#analytics-demo" className="btn-cta-ghost">See it in action</a>
            </div>
          </div>

          <div className="mock-dashboard-wrap">
            <div className="mock-dashboard">
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
                        { label: "Applied",   value: 35, color: "#5b9df9" },
                        { label: "Interview", value: 10, color: "#f0b429" },
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
                      <DonutChart size={90} />
                      <div className="mock-donut-legend">
                        {[
                          { label: "Applied",   color: "#5b9df9", val: "37%" },
                          { label: "Interview", color: "#f0b429", val: "29%" },
                          { label: "Offer",     color: "#34d399", val: "9%"  },
                          { label: "Rejected",  color: "#f26d6d", val: "26%" },
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
                      <div className="trend-legend-item"><div className="trend-legend-dot" style={{ background: "#5b9df9" }} />Applied</div>
                      <div className="trend-legend-item"><div className="trend-legend-dot" style={{ background: "#f0b429" }} />Interviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="ll-features" style={{ paddingBottom: 32 }}>
          <p className="ll-section-eyebrow">Why LeaderLab</p>
          <h2 className="ll-section-title">Everything your search needs, in one place</h2>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ANALYTICS DEMO */}
        <div id="analytics-demo">
          <AnalyticsDemo />
        </div>

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
          <div className="ll-footer">
            <div className="ll-nav-logo">Leader<span>Lab</span></div>
            <div className="ll-footer-copy">© {new Date().getFullYear()} LeaderLab. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
}