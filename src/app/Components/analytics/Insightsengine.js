"use client";

import { useState, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Data Preprocessor
// ─────────────────────────────────────────────────────────────────────────────
function buildAnalyticsPayload(applications) {
  if (!applications?.length) return null;

  const total = applications.length;
  const now = new Date();
  const ghostCutoff = new Date(now - 14 * 864e5);

  const byStatus = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  applications.forEach((a) => { byStatus[a.status] = (byStatus[a.status] || 0) + 1; });

  const platformMap = {};
  applications.forEach((a) => {
    if (!a.platform) return;
    if (!platformMap[a.platform]) platformMap[a.platform] = { total: 0, interviews: 0, offers: 0, rejections: 0, ghosts: 0 };
    platformMap[a.platform].total++;
    if (a.status === "Interview") platformMap[a.platform].interviews++;
    if (a.status === "Offer") platformMap[a.platform].offers++;
    if (a.status === "Rejected") platformMap[a.platform].rejections++;
    const appliedDate = new Date(a.dateApplied || a.createdAt);
    if (a.status === "Applied" && appliedDate < ghostCutoff) platformMap[a.platform].ghosts++;
  });
  const platforms = Object.entries(platformMap).map(([name, d]) => ({
    name, total: d.total,
    callbackRate: d.total > 0 ? +((( d.interviews + d.offers) / d.total) * 100).toFixed(1) : 0,
    rejectionRate: d.total > 0 ? +((d.rejections / d.total) * 100).toFixed(1) : 0,
    ghostRate: d.total > 0 ? +((d.ghosts / d.total) * 100).toFixed(1) : 0,
  })).sort((a, b) => b.total - a.total);

  const workTypeMap = {};
  applications.forEach((a) => {
    if (!a.workType) return;
    if (!workTypeMap[a.workType]) workTypeMap[a.workType] = { total: 0, callbacks: 0 };
    workTypeMap[a.workType].total++;
    if (a.status === "Interview" || a.status === "Offer") workTypeMap[a.workType].callbacks++;
  });
  const workTypes = Object.entries(workTypeMap).map(([name, d]) => ({
    name, total: d.total,
    callbackRate: d.total > 0 ? +((d.callbacks / d.total) * 100).toFixed(1) : 0,
  }));

  const classifyRole = (role = "") => {
    const r = role.toLowerCase();
    if (r.includes("backend") || r.includes("back-end")) return "Backend";
    if (r.includes("frontend") || r.includes("front-end")) return "Frontend";
    if (r.includes("full") && r.includes("stack")) return "Fullstack";
    if (r.includes("data") && (r.includes("science") || r.includes("analyst"))) return "Data Science";
    if (r.includes("data engineer")) return "Data Engineering";
    if (r.includes("ml") || r.includes("machine learning") || r.includes("ai ")) return "ML/AI";
    if (r.includes("devops") || r.includes("sre") || r.includes("cloud")) return "DevOps/Cloud";
    if (r.includes("mobile") || r.includes("android") || r.includes("ios")) return "Mobile";
    if (r.includes("intern")) return "Internship";
    return "Other";
  };
  const roleMap = {};
  applications.forEach((a) => {
    const cat = classifyRole(a.role);
    if (!roleMap[cat]) roleMap[cat] = { total: 0, callbacks: 0, rejections: 0 };
    roleMap[cat].total++;
    if (a.status === "Interview" || a.status === "Offer") roleMap[cat].callbacks++;
    if (a.status === "Rejected") roleMap[cat].rejections++;
  });
  const roles = Object.entries(roleMap)
    .filter(([, d]) => d.total >= 2)
    .map(([name, d]) => ({
      name, total: d.total,
      callbackRate: +((d.callbacks / d.total) * 100).toFixed(1),
      rejectionRate: +((d.rejections / d.total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.callbackRate - a.callbackRate);

  const applyTypeMap = {};
  applications.forEach((a) => {
    const t = a.applyType || "Direct Apply";
    if (!applyTypeMap[t]) applyTypeMap[t] = { total: 0, callbacks: 0, rejections: 0 };
    applyTypeMap[t].total++;
    if (a.status === "Interview" || a.status === "Offer") applyTypeMap[t].callbacks++;
    if (a.status === "Rejected") applyTypeMap[t].rejections++;
  });
  const applyTypes = Object.entries(applyTypeMap).map(([name, d]) => ({
    name, total: d.total,
    callbackRate: +((d.callbacks / d.total) * 100).toFixed(1),
  }));

  const jobTypeMap = {};
  applications.forEach((a) => {
    const t = a.jobType || "Job";
    if (!jobTypeMap[t]) jobTypeMap[t] = { total: 0, callbacks: 0 };
    jobTypeMap[t].total++;
    if (a.status === "Interview" || a.status === "Offer") jobTypeMap[t].callbacks++;
  });
  const jobTypes = Object.entries(jobTypeMap).map(([name, d]) => ({
    name, total: d.total,
    callbackRate: +((d.callbacks / d.total) * 100).toFixed(1),
  }));

  const resumeMap = {};
  applications.forEach((a) => {
    if (!a.resumeVersion) return;
    if (!resumeMap[a.resumeVersion]) resumeMap[a.resumeVersion] = { total: 0, callbacks: 0 };
    resumeMap[a.resumeVersion].total++;
    if (a.status === "Interview" || a.status === "Offer") resumeMap[a.resumeVersion].callbacks++;
  });
  const resumeVersions = Object.entries(resumeMap).map(([name, d]) => ({
    name, total: d.total,
    callbackRate: +((d.callbacks / d.total) * 100).toFixed(1),
  })).sort((a, b) => b.callbackRate - a.callbackRate);

  const responseTimes = [];
  applications.forEach((a) => {
    if (a.statusHistory?.length > 1) {
      const delta = Math.round((new Date(a.statusHistory[1].date) - new Date(a.statusHistory[0].date)) / 864e5);
      if (delta >= 0) responseTimes.push(delta);
    }
  });
  const avgResponseDays = responseTimes.length
    ? +(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
    : null;

  const ghosts = applications.filter((a) => {
    if (a.status !== "Applied") return false;
    return new Date(a.dateApplied || a.createdAt) < ghostCutoff;
  });
  const ghostRate = +((ghosts.length / total) * 100).toFixed(1);

  const weekMap = {};
  applications.forEach((a) => {
    const d = new Date(a.dateApplied || a.createdAt);
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    const key = monday.toISOString().slice(0, 10);
    weekMap[key] = (weekMap[key] || 0) + 1;
  });
  const weekCounts = Object.values(weekMap);
  const avgPerWeek = weekCounts.length
    ? +(weekCounts.reduce((a, b) => a + b, 0) / weekCounts.length).toFixed(1)
    : 0;
  const maxGap = (() => {
    const dates = applications.map((a) => new Date(a.dateApplied || a.createdAt)).sort((a, b) => a - b);
    let max = 0;
    for (let i = 1; i < dates.length; i++) {
      const gap = Math.round((dates[i] - dates[i - 1]) / 864e5);
      if (gap > max) max = gap;
    }
    return max;
  })();

  const rejectedApps = applications.filter((a) => a.status === "Rejected");
  const preInterviewRejections = rejectedApps.filter(
    (a) => !a.statusHistory?.some((h) => h.status === "Interview")
  ).length;
  const postInterviewRejections = rejectedApps.length - preInterviewRejections;

  return {
    summary: {
      total, byStatus,
      callbackRate: +((( byStatus.Interview + byStatus.Offer) / total) * 100).toFixed(1),
      offerRate: +(( byStatus.Offer / total) * 100).toFixed(1),
      ghostRate, avgResponseDays, avgPerWeek, maxGapDays: maxGap,
    },
    platforms, workTypes, roles, applyTypes, jobTypes, resumeVersions,
    rejectionBreakdown: {
      total: rejectedApps.length,
      preInterview: preInterviewRejections,
      postInterview: postInterviewRejections,
      preInterviewPct: rejectedApps.length > 0
        ? +((preInterviewRejections / rejectedApps.length) * 100).toFixed(1) : 0,
    },
  };
}

function buildPrompt(payload) {
  return `You are an expert placement coach and data analyst helping a student or job seeker understand their job application performance.

Here is their complete application analytics data:
${JSON.stringify(payload, null, 2)}

Generate exactly 6 sharp, data-driven insights. Each insight must:
1. Reference a specific number or percentage from the data
2. Name the exact metric or dimension
3. Include a concrete, actionable recommendation
4. Be written in plain conversational English
5. Feel personally relevant and slightly surprising

Insight types to cover (pick the most relevant 6 based on the data):
- Platform performance differences
- Role category performance gaps
- Apply method impact
- Resume version comparison
- Rejection pattern analysis
- Work type callback differences
- Application consistency patterns
- Ghost rate analysis

Rules:
- ONLY generate an insight if the data actually supports it
- Do NOT hallucinate numbers
- Be direct. Lead with the finding.
- Max 2 sentences per insight body.

Respond ONLY with a valid JSON object. No preamble, no markdown.

Format:
{
  "insights": [
    {
      "id": "unique_slug",
      "type": "positive" | "warning" | "neutral" | "critical",
      "icon": "single emoji",
      "headline": "Short punchy headline under 10 words",
      "body": "The specific finding with numbers. One action sentence.",
      "metric": "the key number e.g. 4x or 34%",
      "metricLabel": "what the metric means",
      "dimension": "platform|role|apply_type|resume|consistency|ghost|rejection|worktype|response_speed"
    }
  ]
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 0.9; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes dotPulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40%            { transform: scale(1);   opacity: 1; }
  }
`;

// Type configs — green accent with opacity variations, red only for critical
const TYPE_CONFIG = {
  positive: {
    label: "WIN",
    leftBar: "var(--accent, #10b981)",
    metricColor: "var(--accent, #10b981)",
    labelBg: "rgba(16,185,129,0.12)",
    labelColor: "var(--accent, #10b981)",
  },
  warning: {
    label: "WATCH",
    leftBar: "rgba(245,158,11,0.7)",
    metricColor: "#f59e0b",
    labelBg: "rgba(245,158,11,0.08)",
    labelColor: "#f59e0b",
  },
  critical: {
    label: "ACTION",
    leftBar: "rgba(248,113,113,0.7)",
    metricColor: "#f87171",
    labelBg: "rgba(248,113,113,0.08)",
    labelColor: "#f87171",
  },
  neutral: {
    label: "INSIGHT",
    leftBar: "var(--border-light, #273330)",
    metricColor: "var(--accent, #10b981)",
    labelBg: "rgba(16,185,129,0.08)",
    labelColor: "var(--text-muted, #4d6159)",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Insight Card — editorial / refined minimal
// ─────────────────────────────────────────────────────────────────────────────
function InsightCard({ insight, index }) {
  const cfg = TYPE_CONFIG[insight.type] || TYPE_CONFIG.neutral;

  return (
    <div
      style={{
        position: "relative",
        background: "var(--bg-card, #111714)",
        border: "1px solid var(--border, #1e2722)",
        borderRadius: 10,
        padding: "18px 20px 18px 24px",
        display: "flex",
        gap: 18,
        alignItems: "flex-start",
        animation: `fadeUp 0.35s ease both`,
        animationDelay: `${index * 70}ms`,
        transition: "border-color 0.15s",
        overflow: "hidden",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-light, #273330)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border, #1e2722)"}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: 3,
        background: cfg.leftBar,
        borderRadius: "10px 0 0 10px",
      }} />

      {/* Metric block */}
      <div style={{
        flexShrink: 0,
        width: 64,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 2,
        gap: 4,
      }}>
        <div style={{ fontSize: 22, lineHeight: 1 }}>{insight.icon}</div>
        {insight.metric && (
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: cfg.metricColor,
            lineHeight: 1,
            letterSpacing: "-0.5px",
          }}>
            {insight.metric}
          </div>
        )}
        {insight.metricLabel && (
          <div style={{
            fontSize: 9,
            color: "var(--text-muted, #4d6159)",
            textAlign: "center",
            lineHeight: 1.4,
            letterSpacing: "0.2px",
            maxWidth: 60,
          }}>
            {insight.metricLabel}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{
        width: 1,
        alignSelf: "stretch",
        background: "var(--border, #1e2722)",
        flexShrink: 0,
      }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Label pill */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 8px",
          borderRadius: 4,
          background: cfg.labelBg,
          marginBottom: 7,
        }}>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 9,
            fontWeight: 700,
            color: cfg.labelColor,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}>
            {cfg.label}
          </span>
        </div>

        {/* Headline */}
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: "var(--text-primary, #eef2f0)",
          lineHeight: 1.35,
          marginBottom: 6,
          letterSpacing: "-0.2px",
        }}>
          {insight.headline}
        </div>

        {/* Body */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12.5,
          color: "var(--text-secondary, #8a9e96)",
          lineHeight: 1.65,
        }}>
          {insight.body}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }) {
  return (
    <div style={{
      background: "var(--bg-card, #111714)",
      border: "1px solid var(--border, #1e2722)",
      borderRadius: 10,
      padding: "18px 20px 18px 24px",
      display: "flex",
      gap: 18,
      alignItems: "flex-start",
      overflow: "hidden",
      position: "relative",
      animationDelay: `${delay}ms`,
    }}>
      {/* Shimmer overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.03), transparent)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s ease infinite",
        animationDelay: `${delay}ms`,
        pointerEvents: "none",
      }} />
      {/* Left bar placeholder */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: "var(--border, #1e2722)", borderRadius: "10px 0 0 10px",
        animation: "pulse 1.5s ease infinite",
      }} />
      {/* Icon block */}
      <div style={{ flexShrink: 0, width: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, paddingTop: 2 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-hover, #161d1a)", animation: "pulse 1.5s ease infinite" }} />
        <div style={{ width: 36, height: 20, borderRadius: 4, background: "var(--bg-hover, #161d1a)", animation: "pulse 1.5s ease infinite" }} />
        <div style={{ width: 48, height: 10, borderRadius: 3, background: "var(--bg-hover, #161d1a)", animation: "pulse 1.5s ease infinite" }} />
      </div>
      <div style={{ width: 1, alignSelf: "stretch", background: "var(--border, #1e2722)", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: 48, height: 14, borderRadius: 4, background: "var(--bg-hover, #161d1a)", marginBottom: 10, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ width: "55%", height: 16, borderRadius: 4, background: "var(--bg-hover, #161d1a)", marginBottom: 8, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ width: "90%", height: 11, borderRadius: 3, background: "var(--bg-hover, #161d1a)", marginBottom: 5, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ width: "70%", height: 11, borderRadius: 3, background: "var(--bg-hover, #161d1a)", animation: "pulse 1.5s ease infinite" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading dots
// ─────────────────────────────────────────────────────────────────────────────
function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center", marginLeft: 6 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: "50%",
          background: "var(--accent, #10b981)",
          display: "inline-block",
          animation: `dotPulse 1.2s ease ${i * 0.2}s infinite`,
        }} />
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main InsightsEngine
// ─────────────────────────────────────────────────────────────────────────────
const MIN_APPS_FOR_AI = 3;

export default function InsightsEngine({ applications }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastGeneratedAt, setLastGeneratedAt] = useState(null);
  const abortRef = useRef(null);

  const generate = useCallback(async () => {
    const payload = buildAnalyticsPayload(applications);
    if (!payload) return;

    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      setError("NEXT_PUBLIC_GROQ_API_KEY is not set. Add it to your .env.local file and restart the dev server.");
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You are a placement coach analyst. Always respond with valid JSON only — a single object with an 'insights' array.",
            },
            { role: "user", content: buildPrompt(payload) },
          ],
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = errBody?.error?.message || `API error ${response.status}`;
        if (response.status === 401) throw new Error("Invalid API key. Check NEXT_PUBLIC_GROQ_API_KEY in .env.local.");
        if (response.status === 429) throw new Error("Rate limit hit. Wait a moment then try again.");
        throw new Error(msg);
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const insightsArray = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.insights)
        ? parsed.insights
        : null;

      if (!insightsArray) throw new Error("Unexpected response shape from model.");

      setInsights(insightsArray.slice(0, 6));
      setLastGeneratedAt(new Date());
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Couldn't generate insights. Try again.");
    } finally {
      setLoading(false);
    }
  }, [applications]);

  const total = applications?.length ?? 0;
  const hasEnoughData = total >= MIN_APPS_FOR_AI;
  const needsMore = MIN_APPS_FOR_AI - total;

  return (
    <div style={{ marginBottom: 24 }}>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* ── Section header ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 12,
        flexWrap: "wrap",
      }}>
        {/* Left: title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Icon mark */}
          <div style={{
            width: 28, height: 28,
            border: "1px solid var(--accent-border, rgba(16,185,129,0.25))",
            borderRadius: 6,
            background: "var(--accent-dim, rgba(16,185,129,0.10))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12,
            color: "var(--accent, #10b981)",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
          }}>
            ✦
          </div>
          <div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-primary, #eef2f0)",
              letterSpacing: "-0.2px",
              lineHeight: 1,
            }}>
              AI Insights
              {loading && <LoadingDots />}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "var(--text-muted, #4d6159)",
              marginTop: 3,
            }}>
              {hasEnoughData
                ? lastGeneratedAt
                  ? `Last generated ${lastGeneratedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : "Pattern analysis across all your applications"
                : `${needsMore} more application${needsMore !== 1 ? "s" : ""} needed to unlock`}
            </div>
          </div>
        </div>

        {/* Right: action button */}
        {hasEnoughData && (
          <button
            onClick={generate}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid var(--border, #1e2722)",
              background: "var(--bg-card, #111714)",
              color: loading ? "var(--text-muted, #4d6159)" : "var(--text-secondary, #8a9e96)",
              fontSize: 12,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
              outline: "none",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.borderColor = "var(--border-light, #273330)";
                e.currentTarget.style.color = "var(--text-primary, #eef2f0)";
                e.currentTarget.style.background = "var(--bg-hover, #161d1a)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border, #1e2722)";
              e.currentTarget.style.color = loading ? "var(--text-muted, #4d6159)" : "var(--text-secondary, #8a9e96)";
              e.currentTarget.style.background = "var(--bg-card, #111714)";
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 10, height: 10,
                  border: "1.5px solid var(--border-light, #273330)",
                  borderTopColor: "var(--accent, #10b981)",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} />
                Analysing
              </>
            ) : insights ? (
              <> ↻ Refresh</>
            ) : (
              <> ✦ Generate</>
            )}
          </button>
        )}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "var(--border, #1e2722)", marginBottom: 16 }} />

      {/* ── Not enough data ── */}
      {!hasEnoughData && (
        <div style={{
          background: "var(--bg-card, #111714)",
          border: "1px solid var(--border, #1e2722)",
          borderRadius: 10,
          padding: "32px 24px",
          textAlign: "center",
        }}>
          <div style={{
            width: 44, height: 44,
            borderRadius: 10,
            background: "var(--accent-dim, rgba(16,185,129,0.10))",
            border: "1px solid var(--accent-border, rgba(16,185,129,0.25))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, margin: "0 auto 14px",
          }}>🧠</div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14, fontWeight: 700,
            color: "var(--text-primary, #eef2f0)",
            marginBottom: 6,
          }}>
            Not enough data yet
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12.5,
            color: "var(--text-secondary, #8a9e96)",
            lineHeight: 1.7,
            maxWidth: 340, margin: "0 auto 20px",
          }}>
            You have <strong style={{ color: "var(--accent, #10b981)" }}>{total}</strong> application{total !== 1 ? "s" : ""}. Add {needsMore} more and the AI will start finding patterns — platform ghost rates, role conversion gaps, and what's actually working.
          </div>
          <div style={{ maxWidth: 200, margin: "0 auto" }}>
            <div style={{
              height: 3,
              background: "var(--bg-hover, #161d1a)",
              borderRadius: 99, overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${(total / MIN_APPS_FOR_AI) * 100}%`,
                background: "var(--accent, #10b981)",
                borderRadius: 99,
                transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              color: "var(--text-muted, #4d6159)",
              marginTop: 7,
            }}>
              {total} / {MIN_APPS_FOR_AI} applications
            </div>
          </div>
        </div>
      )}

      {/* ── Idle — enough data ── */}
      {hasEnoughData && !loading && !insights && !error && (
        <div style={{
          background: "var(--bg-card, #111714)",
          border: "1px dashed var(--border-light, #273330)",
          borderRadius: 10,
          padding: "36px 24px",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: "var(--accent, #10b981)",
            marginBottom: 10,
            letterSpacing: "-1px",
            opacity: 0.4,
          }}>✦</div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14, fontWeight: 700,
            color: "var(--text-primary, #eef2f0)",
            marginBottom: 6,
          }}>
            Ready to analyse {total} applications
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12.5,
            color: "var(--text-secondary, #8a9e96)",
            lineHeight: 1.7,
            maxWidth: 360, margin: "0 auto 22px",
          }}>
            Scans for platform ghost rates, role performance gaps, resume effectiveness, and consistency patterns in your data.
          </div>
          <button
            onClick={generate}
            style={{
              padding: "9px 22px",
              borderRadius: 6,
              border: "1px solid var(--accent-border, rgba(16,185,129,0.25))",
              background: "var(--accent-dim, rgba(16,185,129,0.10))",
              color: "var(--accent, #10b981)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Syne', sans-serif",
              transition: "all 0.15s",
              outline: "none",
              letterSpacing: "0.2px",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(16,185,129,0.16)";
              e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--accent-dim, rgba(16,185,129,0.10))";
              e.currentTarget.style.borderColor = "var(--accent-border, rgba(16,185,129,0.25))";
            }}
          >
            ✦ Generate Insights
          </button>
        </div>
      )}

      {/* ── Skeletons ── */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} delay={i * 80} />)}
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div style={{
          background: "var(--bg-card, #111714)",
          border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 10,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 12, fontWeight: 600,
              color: "var(--red, #f87171)",
              marginBottom: 2,
            }}>
              Failed to generate insights
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "var(--text-muted, #4d6159)",
            }}>
              {error}
            </div>
          </div>
          <button
            onClick={generate}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid var(--border, #1e2722)",
              background: "transparent",
              color: "var(--text-secondary, #8a9e96)",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--bg-hover, #161d1a)";
              e.currentTarget.style.color = "var(--text-primary, #eef2f0)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary, #8a9e96)";
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Insights list ── */}
      {insights && !loading && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {insights.map((insight, i) => (
              <InsightCard key={insight.id || i} insight={insight} index={i} />
            ))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid var(--border, #1e2722)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "var(--text-muted, #4d6159)",
            }}>
              Based on {total} applications
            </span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              color: "var(--text-muted, #4d6159)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "var(--accent, #10b981)",
                display: "inline-block",
                opacity: 0.6,
              }} />
              Llama 3.3 · {lastGeneratedAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </>
      )}
    </div>
  );
}