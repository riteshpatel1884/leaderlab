"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import InsightsEngine from "./Insightsengine";
import {
  PieChart,
  Pie,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ── Recharts reset ────────────────────────────────────────────────────────
const RECHARTS_RESET = `
  .recharts-wrapper,.recharts-wrapper *,.recharts-surface,.recharts-surface *,
  svg.recharts-surface,.recharts-layer,.recharts-layer *,
  .recharts-responsive-container,.recharts-responsive-container * {
    outline: none !important;
    -webkit-tap-highlight-color: transparent !important;
  }
  .recharts-wrapper,.recharts-wrapper:focus,.recharts-wrapper:focus-within,
  .recharts-surface:focus,svg.recharts-surface:focus {
    outline: none !important; box-shadow: none !important; background: transparent !important;
  }
  .recharts-wrapper > div { outline: none !important; background: transparent !important; }
  .recharts-surface,.recharts-surface > rect:first-child { fill: transparent !important; background: transparent !important; }
  .recharts-sector:focus,.recharts-bar-rectangle:focus,.recharts-curve:focus,.recharts-dot:focus { outline: none !important; stroke: none !important; }
  .recharts-rectangle.recharts-tooltip-cursor { fill: rgba(255,255,255,0.04) !important; }
  .recharts-pie-sector path:focus,.recharts-pie-sector path:active { outline: none !important; stroke: none !important; }
`;

// ── Weekly trend dropdown styles ──────────────────────────────────────────
const TREND_DROPDOWN_STYLES = `
  .wt-dropdown-wrap { position: relative; display: inline-flex; align-items: center; }
  .wt-dropdown-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-primary);
    font-size: 12px; font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.12s, border-color 0.12s, color 0.12s;
    white-space: nowrap;
    outline: none;
  }
  .wt-dropdown-btn:hover {
    background: rgba(108,99,255,0.08);
    border-color: rgba(108,99,255,0.4);
    color: #6c63ff;
  }
  .wt-dropdown-btn.open {
    background: rgba(108,99,255,0.12);
    border-color: rgba(108,99,255,0.45);
    color: #6c63ff;
  }
  .wt-menu {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 200;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    min-width: 178px;
    box-shadow: 0 10px 28px rgba(0,0,0,0.16);
    overflow: hidden;
    display: none;
    padding: 4px 0;
  }
  .wt-menu.open { display: block; }
  .wt-menu-item {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 14px;
    font-size: 12.5px;
    cursor: pointer;
    color: var(--text-secondary);
    font-family: 'DM Sans', sans-serif;
    transition: background 0.1s, color 0.1s;
    position: relative;
  }
  .wt-menu-item:hover { background: rgba(108,99,255,0.1); color: var(--text-primary); }
  .wt-menu-item.wt-active { color: #6c63ff; font-weight: 700; background: rgba(108,99,255,0.08); }
  .wt-check { margin-left: auto; font-size: 11px; opacity: 0; color: #6c63ff; }
  .wt-menu-item.wt-active .wt-check { opacity: 1; }
  .wt-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; }
  .wt-granularity-btn {
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
    outline: none;
    white-space: nowrap;
  }
  .wt-granularity-btn:hover { border-color: rgba(108,99,255,0.35); color: #6c63ff; }
  .wt-granularity-btn.active {
    background: rgba(108,99,255,0.14);
    border-color: rgba(108,99,255,0.45);
    color: #6c63ff;
  }
`;

const THRESHOLDS = {
  PLATFORM_CHART: 3,
  DONUT_CHART: 5,
  WEEKLY_CHART: 3,
  GHOST_RATE: 5,
  ROLE_INSIGHTS: 5,
  CONSISTENCY: 7,
  HEALTH_SCORE: 3,
};

const STATUS_COLORS = {
  Applied: "#3b82f6",
  Interview: "#f59e0b",
  Offer: "#22c55e",
  Rejected: "#ef4444",
};

// ── Metric definitions for the weekly trend dropdowns ─────────────────────
const TREND_METRICS = [
  { key: "applied",      label: "Applied",        color: "#3b82f6" },
  { key: "interviews",   label: "Interviews",      color: "#f59e0b" },
  { key: "offers",       label: "Offers",          color: "#22c55e" },
  { key: "rejected",     label: "Rejected",        color: "#ef4444" },
  { key: "ghosted",      label: "Ghosted",         color: "#8b5cf6" },
  { key: "callbackRate", label: "Callback Rate %", color: "#06b6d4" },
];

// ── Mobile detection hook ─────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function pct(num, denom) {
  if (!denom) return null;
  return ((num / denom) * 100).toFixed(1);
}

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

const tooltipStyle = {
  background: "rgba(14,14,18,0.97)",
  border: "1px solid rgba(108,99,255,0.2)",
  borderRadius: 10,
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  padding: "10px 14px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12,
  color: "#f0f0f2",
  outline: "none",
};

const tooltipLabelStyle = {
  color: "#f0f0f2",
  fontWeight: 700,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12,
  marginBottom: 4,
};

function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={tooltipStyle}>
      {label && <div style={tooltipLabelStyle}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#a5b4fc", marginTop: 2 }}>
          <span style={{ color: "#8b8b9a", marginRight: 6 }}>{p.name}:</span>
          {formatter ? formatter(p.value, p.name) : p.value}
        </div>
      ))}
    </div>
  );
}

// ── Locked Card ───────────────────────────────────────────────────────────
function LockedCard({ title, unlockAt, current, icon = "🔒" }) {
  const remaining = Math.max(0, unlockAt - current);
  const progress = Math.min(100, (current / unlockAt) * 100);
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "24px 20px",
      marginBottom: 16,
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "radial-gradient(circle, #6c63ff 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }} />
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
        Apply to <strong style={{ color: "#6c63ff" }}>{remaining} more</strong> job{remaining !== 1 ? "s" : ""} to unlock.
      </div>
      <div style={{ height: 4, background: "rgba(108,99,255,0.12)", borderRadius: 99, overflow: "hidden", maxWidth: 200, margin: "0 auto" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #6c63ff, #22c55e)", borderRadius: 99, transition: "width 0.5s" }} />
      </div>
      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>{current} / {unlockAt} applications</div>
    </div>
  );
}

// ── Chart Card ────────────────────────────────────────────────────────────
function ChartCard({ title, children, badge, style }) {
  return (
    <div tabIndex={-1} style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "20px",
      marginBottom: 16,
      outline: "none",
      userSelect: "none",
      WebkitTapHighlightColor: "transparent",
      ...style,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
          color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px",
        }}>{title}</div>
        {badge && (
          <div style={{
            fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 99,
            background: "rgba(108,99,255,0.12)", color: "#6c63ff",
            fontFamily: "'DM Sans', sans-serif",
          }}>{badge}</div>
        )}
      </div>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, color, muted }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: muted ? "var(--text-muted)" : (color || "var(--text-primary)"), fontSize: 28 }}>
        {value}
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

// ── Health Score ──────────────────────────────────────────────────────────
function HealthScore({ stats }) {
  const isMobile = useIsMobile();
  if (stats.total < THRESHOLDS.HEALTH_SCORE) {
    return <LockedCard title="Placement Health Score" unlockAt={THRESHOLDS.HEALTH_SCORE} current={stats.total} icon="❤️" />;
  }

  const volumeScore = Math.min(100, stats.total * 4);
  const callbackScore = Math.min(100, parseFloat(stats.callbackRate) * 3);
  const consistencyScore = stats.consistencyScore;
  const ghostPenalty = Math.max(0, 100 - stats.ghostRate);
  const offerScore = Math.min(100, parseFloat(stats.offerRate) * 10);

  const raw = volumeScore * 0.2 + callbackScore * 0.25 + consistencyScore * 0.2 + ghostPenalty * 0.2 + offerScore * 0.15;
  const score = Math.round(Math.min(99, Math.max(1, raw)));

  const getGrade = (s) => {
    if (s >= 80) return { label: "Excellent", color: "#22c55e" };
    if (s >= 60) return { label: "Good", color: "#6c63ff" };
    if (s >= 40) return { label: "Fair", color: "#f59e0b" };
    return { label: "Needs Work", color: "#ef4444" };
  };
  const grade = getGrade(score);

  const components = [
    { label: "Volume", value: Math.round(volumeScore) },
    { label: "Callback Rate", value: Math.round(callbackScore) },
    { label: "Consistency", value: Math.round(consistencyScore) },
    { label: "Response Rate", value: Math.round(ghostPenalty) },
    { label: "Offer Conv.", value: Math.round(offerScore) },
  ];

  const R = 44, C = 2 * Math.PI * R;
  const filled = (score / 100) * C;
  const ringSize = isMobile ? 100 : 130;
  const cx = ringSize / 2;

  return (
    <ChartCard title="Placement Health Score" badge={grade.label}>
      <div style={{ display: "flex", gap: isMobile ? 16 : 24, alignItems: "center", flexWrap: isMobile ? "nowrap" : "wrap" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
            <circle cx={cx} cy={cx} r={R} fill="none" stroke="rgba(108,99,255,0.1)" strokeWidth={8} />
            <circle cx={cx} cy={cx} r={R} fill="none" stroke={grade.color} strokeWidth={8}
              strokeDasharray={`${filled} ${C}`} strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cx})`}
              style={{ transition: "stroke-dasharray 0.8s ease" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: grade.color, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>/ 100</div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {components.map((c) => (
            <div key={c.label} style={{ marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: isMobile ? 10 : 11, color: "var(--text-secondary)" }}>{c.label}</span>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{c.value}/100</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${c.value}%`,
                  background: c.value >= 70 ? "#22c55e" : c.value >= 40 ? "#6c63ff" : "#ef4444",
                  borderRadius: 99, transition: "width 0.6s",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

// ── Ghost Rate ────────────────────────────────────────────────────────────
function GhostRateCard({ stats }) {
  if (stats.total < THRESHOLDS.GHOST_RATE) {
    return <LockedCard title="Ghost Rate" unlockAt={THRESHOLDS.GHOST_RATE} current={stats.total} icon="👻" />;
  }

  const { ghostCount, ghostRate, total } = stats;
  const isHigh = ghostRate > 50;

  return (
    <ChartCard title="Ghost Rate" badge={isHigh ? "High" : "Normal"}>
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1, color: isHigh ? "#ef4444" : "#f59e0b", fontFamily: "'DM Sans', sans-serif" }}>
            {ghostRate.toFixed(0)}<span style={{ fontSize: 22 }}>%</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>no response</div>
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, borderLeft: `2px solid ${isHigh ? "#ef4444" : "#f59e0b"}`, paddingLeft: 12 }}>
            <strong style={{ color: "var(--text-primary)" }}>{ghostCount} of {total}</strong> applications received no response after 14 days.
            {isHigh ? " Try personalising your outreach or targeting roles with higher match." : " Within normal range — keep applying consistently."}
          </div>
          <div style={{ marginTop: 12, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${ghostRate}%`, background: isHigh ? "#ef4444" : "#f59e0b", borderRadius: 99, transition: "width 0.6s" }} />
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

// ── Consistency ───────────────────────────────────────────────────────────
function ConsistencyCard({ stats }) {
  const isMobile = useIsMobile();
  if (stats.total < THRESHOLDS.CONSISTENCY) {
    return <LockedCard title="Application Consistency" unlockAt={THRESHOLDS.CONSISTENCY} current={stats.total} icon="📅" />;
  }

  const { weeksActive, weeksTotal, maxGapDays, avgPerActiveWeek, consistencyScore } = stats.consistencyData;
  const isConsistent = consistencyScore >= 60;

  return (
    <ChartCard title="Application Consistency">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {[
          { label: "Active Weeks", value: `${weeksActive}/${weeksTotal}`, color: "#6c63ff" },
          { label: "Avg / Week", value: avgPerActiveWeek.toFixed(1), color: "#3b82f6" },
          { label: "Longest Gap", value: maxGapDays > 0 ? `${maxGapDays}d` : "—", color: maxGapDays > 10 ? "#ef4444" : "#22c55e" },
        ].map((m) => (
          <div key={m.label} style={{
            flex: 1, minWidth: isMobile ? 70 : 80,
            background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "10px 8px", textAlign: "center",
          }}>
            <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: m.color, fontFamily: "'DM Sans', sans-serif" }}>{m.value}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      {maxGapDays > 10 && (
        <div style={{ fontSize: 12, color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "8px 12px" }}>
          ⚠ You had a {maxGapDays}-day gap. Consistent daily effort leads to better outcomes.
        </div>
      )}
      {isConsistent && (
        <div style={{ fontSize: 12, color: "#22c55e", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "8px 12px" }}>
          ✓ Strong consistency — you're applying regularly across weeks.
        </div>
      )}
    </ChartCard>
  );
}

// ── Resume Performance ────────────────────────────────────────────────────
function ResumePerformanceCard({ stats }) {
  const isMobile = useIsMobile();
  const { resumePerf } = stats;

  if (!resumePerf || resumePerf.length < 2) {
    return (
      <ChartCard title="Resume Performance">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Use multiple resume versions to compare performance.</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Tag applications with a resume version to unlock this.</div>
        </div>
      </ChartCard>
    );
  }

  const best = resumePerf.reduce((a, b) => parseFloat(a.rate) > parseFloat(b.rate) ? a : b);
  const ringColors = ["#22c55e", "#6c63ff", "#f59e0b", "#3b82f6", "#ec4899"];
  const R = 28;
  const CIRC = 2 * Math.PI * R;
  const ringSize = isMobile ? 72 : 88;
  const cx = ringSize / 2;
  const strokeW = 7;

  return (
    <ChartCard title="Resume Performance">
      <div style={{
        display: "flex",
        gap: isMobile ? 12 : 20,
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 16,
      }}>
        {resumePerf.map((r, i) => {
          const rate = parseFloat(r.rate);
          const filled = (rate / 100) * CIRC;
          const color = ringColors[i % ringColors.length];
          const isBest = r.name === best.name;

          return (
            <div key={r.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ position: "relative" }}>
                <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
                  <circle cx={cx} cy={cx} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
                  <circle cx={cx} cy={cx} r={R} fill="none" stroke={color} strokeWidth={strokeW}
                    strokeLinecap="round"
                    strokeDasharray={`${filled} ${CIRC}`}
                    transform={`rotate(-90 ${cx} ${cx})`}
                    style={{ transition: "stroke-dasharray 0.7s ease" }} />
                </svg>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontSize: isMobile ? 13 : 15,
                    fontWeight: 800,
                    color,
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1,
                  }}>{rate.toFixed(0)}%</span>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 2 }}>
                  <span style={{ fontSize: isMobile ? 11 : 12, color: "var(--text-secondary)", fontWeight: 500 }}>
                    {r.name}
                  </span>
                  {isBest && (
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      padding: "1px 6px", borderRadius: 99,
                      background: "rgba(34,197,94,0.15)", color: "#22c55e",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>BEST</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{r.total} app{r.total !== 1 ? "s" : ""}</div>
              </div>
            </div>
          );
        })}
      </div>
      {parseFloat(best.rate) > 0 && (
        <div style={{
          fontSize: 12,
          color: "#22c55e",
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.18)",
          borderRadius: 8,
          padding: "8px 12px",
        }}>
          ✦ <strong>{best.name}</strong> has the highest callback rate at {best.rate}% — use it as your primary resume.
        </div>
      )}
    </ChartCard>
  );
}

// ── Role Insights ─────────────────────────────────────────────────────────
function RoleInsightsCard({ stats }) {
  const isMobile = useIsMobile();

  if (stats.total < THRESHOLDS.ROLE_INSIGHTS) {
    return <LockedCard title="Role Insights" unlockAt={THRESHOLDS.ROLE_INSIGHTS} current={stats.total} icon="🎯" />;
  }

  const { rolePerf } = stats;
  if (!rolePerf || rolePerf.length < 2) {
    return (
      <ChartCard title="Role Insights">
        <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>
          Apply to more distinct roles to see performance comparisons.
        </div>
      </ChartCard>
    );
  }

  const best = rolePerf[0];
  const worst = rolePerf[rolePerf.length - 1];

  const chartData = rolePerf.map((r) => ({
    role: r.name,
    callbackRate: parseFloat(r.rate),
    applications: r.total,
  }));

  const maxApps = Math.max(...chartData.map((d) => d.applications), 1);

  const getBarColor = (rate) => {
    if (rate >= 40) return "#22c55e";
    if (rate >= 20) return "#6c63ff";
    if (rate >= 5) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <ChartCard title="Role Insights">
      {best && parseFloat(best.rate) > 0 && worst && best.name !== worst.name && (
        <div style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          borderLeft: "2px solid #6c63ff",
          paddingLeft: 12,
          marginBottom: 20,
        }}>
          <strong style={{ color: "var(--text-primary)" }}>{best.name}</strong> roles perform{" "}
          <strong style={{ color: "#22c55e" }}>
            {parseFloat(worst.rate) > 0
              ? `${(parseFloat(best.rate) / parseFloat(worst.rate)).toFixed(1)}×`
              : "significantly"} better
          </strong>{" "}
          than <strong style={{ color: "var(--text-primary)" }}>{worst.name}</strong>.
        </div>
      )}

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: isMobile ? 10 : 16,
        justifyContent: "center",
        alignItems: "flex-end",
        padding: "8px 0 16px",
      }}>
        {chartData.map((d) => {
          const rateColor = getBarColor(d.callbackRate);
          const bubbleSize = Math.max(
            isMobile ? 56 : 64,
            Math.min(isMobile ? 100 : 120, (isMobile ? 44 : 50) + (d.applications / maxApps) * (isMobile ? 56 : 70))
          );
          const isBest = d.role === best.name;
          return (
            <div key={d.role} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: bubbleSize,
                height: bubbleSize,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, ${rateColor}2a, ${rateColor}0d)`,
                border: `2px solid ${rateColor}${isBest ? "cc" : "55"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isBest ? `0 0 24px ${rateColor}33` : "none",
                transition: "all 0.3s",
                position: "relative",
              }}>
                {isBest && (
                  <div style={{
                    position: "absolute", top: -7, right: -7,
                    fontSize: 9, fontWeight: 700,
                    padding: "2px 6px", borderRadius: 99,
                    background: "#22c55e", color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.4px",
                  }}>TOP</div>
                )}
                <div style={{
                  fontSize: bubbleSize > 80 ? 17 : 13,
                  fontWeight: 800,
                  color: rateColor,
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1,
                }}>{d.callbackRate.toFixed(0)}%</div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 3 }}>{d.applications} apps</div>
              </div>
              <div style={{
                fontSize: isMobile ? 10 : 11,
                fontWeight: 600,
                color: isBest ? "var(--text-primary)" : "var(--text-secondary)",
                textAlign: "center",
                maxWidth: bubbleSize + 12,
                lineHeight: 1.3,
              }}>{d.role}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap",
        fontSize: 10, color: "var(--text-muted)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: 12, marginTop: 4,
      }}>
        <span style={{ marginRight: 4 }}>Bubble size = volume</span>
        {[["#22c55e", "≥40%"], ["#6c63ff", "20–39%"], ["#f59e0b", "5–19%"], ["#ef4444", "<5%"]].map(([c, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block", flexShrink: 0 }} />
            {l}
          </span>
        ))}
      </div>
    </ChartCard>
  );
}

// ── Funnel ────────────────────────────────────────────────────────────────
// Three solid blocks: Total Applications, Total Offers, Total Rejections —
// each showing its count and % of total applications. Callback Rate and
// Ghost Rate are shown underneath as supporting stat chips.
function Funnel({ byStatus, total, callbackRate, callbackCount, ghostRate, ghostCount }) {
  const isMobile = useIsMobile();
  const steps = [
    { label: "Total Applications", count: total, color: "#3b82f6" },
    { label: "Total Offers", count: byStatus.Offer || 0, color: "#22c55e" },
    { label: "Total Rejections", count: byStatus.Rejected || 0, color: "#ef4444" },
  ];

  const extraStats = [
    {
      label: "Callback Rate",
      value: `${callbackRate}%`,
      sub: `${callbackCount} of ${total} applications`,
      color: "#6c63ff",
    },
    {
      label: "Ghost Rate",
      value: `${Number(ghostRate).toFixed(0)}%`,
      sub: `${ghostCount} of ${total} applications`,
      color: Number(ghostRate) > 50 ? "#ef4444" : "#f59e0b",
    },
  ];

  return (
    <ChartCard title="Application Funnel">
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 16, marginBottom: 16 }}>
        {steps.map((step) => {
          const pctOfTotal = total > 0 ? pct(step.count, total) : "0.0";
          return (
            <div key={step.label} style={{
              flex: 1,
              minWidth: 0,
              background: step.color,
              borderRadius: 12,
              padding: isMobile ? "16px 8px" : "22px 14px",
              textAlign: "center",
            }}>
              <div style={{
                fontSize: isMobile ? 24 : 30,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1,
              }}>
                {step.count}
              </div>
              <div style={{
                fontSize: isMobile ? 11 : 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
                marginTop: 6,
              }}>
                {step.label}
              </div>
              <div style={{
                fontSize: isMobile ? 10 : 11,
                color: "rgba(255,255,255,0.8)",
                marginTop: 2,
              }}>
                {pctOfTotal}% of total
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: isMobile ? 10 : 16, flexWrap: "wrap" }}>
        {extraStats.map((s) => (
          <div key={s.label} style={{
            flex: 1,
            minWidth: isMobile ? 130 : 160,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "14px 16px",
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              marginBottom: 6,
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: isMobile ? 20 : 24,
              fontWeight: 800,
              color: s.color,
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1,
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ── Status Donut ──────────────────────────────────────────────────────────
function StatusDonutChart({ byStatus, total }) {
  const isMobile = useIsMobile();
  if (total < THRESHOLDS.DONUT_CHART) {
    return <LockedCard title="Status Distribution" unlockAt={THRESHOLDS.DONUT_CHART} current={total} icon="🥧" />;
  }

  const data = Object.entries(byStatus)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || "#6c63ff" }));

  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    if (percent < 0.08) return null;
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const chartHeight = isMobile ? 180 : 220;
  const outerR = isMobile ? 70 : 90;
  const innerR = isMobile ? 42 : 58;

  return (
    <ChartCard title="Status Distribution" style={{ flex: 1, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={chartHeight} style={{ background: "transparent", outline: "none" }}>
        <PieChart style={{ outline: "none" }} tabIndex={-1}>
          <Pie isAnimationActive={false} data={data} cx="50%" cy="50%"
            innerRadius={innerR} outerRadius={outerR}
            paddingAngle={3} dataKey="value" labelLine={false} label={renderLabel} stroke="none" tabIndex={-1}>
            {data.map((e, i) => <Cell key={i} fill={e.fill} tabIndex={-1} />)}
          </Pie>
          <Tooltip content={<CustomTooltip formatter={(v) => `${v} apps`} />} />
          <Legend iconType="circle" iconSize={7}
            formatter={(v) => <span style={{ fontSize: isMobile ? 10 : 12, color: "var(--text-secondary)" }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ── Work Type Donut ───────────────────────────────────────────────────────
const WORK_COLORS = ["#6c63ff", "#3b82f6", "#f59e0b", "#22c55e", "#ec4899"];

function WorkTypeChart({ byWorkType, total }) {
  const isMobile = useIsMobile();
  if (total < THRESHOLDS.DONUT_CHART) {
    return <LockedCard title="Work Type Split" unlockAt={THRESHOLDS.DONUT_CHART} current={total} icon="🏢" />;
  }

  const data = Object.entries(byWorkType)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({ name, value, fill: WORK_COLORS[i % WORK_COLORS.length] }));

  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    if (percent < 0.08) return null;
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const chartHeight = isMobile ? 180 : 220;
  const outerR = isMobile ? 70 : 85;
  const innerR = isMobile ? 38 : 50;

  return (
    <ChartCard title="Work Type Split" style={{ flex: 1, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={chartHeight} style={{ background: "transparent", outline: "none" }}>
        <PieChart style={{ outline: "none" }} tabIndex={-1}>
          <Pie isAnimationActive={false} data={data} cx="50%" cy="50%"
            innerRadius={innerR} outerRadius={outerR}
            paddingAngle={4} dataKey="value" labelLine={false} label={renderLabel} stroke="none" tabIndex={-1}>
            {data.map((e, i) => <Cell key={i} fill={e.fill} tabIndex={-1} />)}
          </Pie>
          <Tooltip content={<CustomTooltip formatter={(v) => `${v} (${pct(v, total)}%)`} />} />
          <Legend iconType="circle" iconSize={7}
            formatter={(v) => <span style={{ fontSize: isMobile ? 10 : 12, color: "var(--text-secondary)" }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ── Platform Leaderboard ──────────────────────────────────────────────────
// Custom ranked track-bar visualization — replaces the recharts bar chart
// with a leaderboard style consistent with the rings/bubbles used elsewhere.
function PlatformChart({ platformPerf, total }) {
  const isMobile = useIsMobile();
  if (total < THRESHOLDS.PLATFORM_CHART || !platformPerf || platformPerf.length === 0) {
    return <LockedCard title="Platform Success Rate" unlockAt={THRESHOLDS.PLATFORM_CHART} current={total} icon="📊" />;
  }

  const data = platformPerf.map((p) => ({ name: p.name, rate: parseFloat(p.rate), total: p.total }));
  const maxRate = Math.max(...data.map((d) => d.rate), 1);
  const best = data[0];

  const getColor = (rate) => {
    if (rate >= 40) return "#22c55e";
    if (rate >= 20) return "#6c63ff";
    if (rate >= 5) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <ChartCard title="Platform Success Rate">
      {best && best.rate > 0 && (
        <div style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          borderLeft: "2px solid #6c63ff",
          paddingLeft: 12,
          marginBottom: 20,
        }}>
          <strong style={{ color: "var(--text-primary)" }}>{best.name}</strong> is your top-performing platform at{" "}
          <strong style={{ color: "#22c55e" }}>{best.rate}%</strong> callback rate.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.map((d, i) => {
          const color = getColor(d.rate);
          const widthPct = maxRate > 0 ? Math.max(4, (d.rate / maxRate) * 100) : 0;
          return (
            <div key={d.name}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7, gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                  <span style={{
                    flexShrink: 0,
                    width: 20, height: 20,
                    borderRadius: 6,
                    background: `${color}1f`,
                    color,
                    fontSize: 10,
                    fontWeight: 800,
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {i + 1}
                  </span>
                  <span style={{
                    fontSize: isMobile ? 12 : 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {d.name}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 800, color, fontFamily: "'DM Sans', sans-serif" }}>
                    {d.rate.toFixed(1)}%
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {d.total} app{d.total !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div style={{ height: 8, background: "rgba(108,99,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${widthPct}%`,
                  background: color,
                  borderRadius: 99,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap",
        fontSize: 10, color: "var(--text-muted)",
        borderTop: "1px solid var(--border)",
        paddingTop: 12, marginTop: 16,
      }}>
        {[["#22c55e", "≥40%"], ["#6c63ff", "20–39%"], ["#f59e0b", "5–19%"], ["#ef4444", "<5%"]].map(([c, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block", flexShrink: 0 }} />
            {l}
          </span>
        ))}
      </div>
    </ChartCard>
  );
}

// ── Metric Dropdown ───────────────────────────────────────────────────────
function MetricDropdown({ selected, onSelect, excludeKey }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const metric = TREND_METRICS.find((m) => m.key === selected) || TREND_METRICS[0];

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="wt-dropdown-wrap" ref={wrapRef}>
      <button
        className={`wt-dropdown-btn${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="wt-dot" style={{ background: metric.color }} />
        <span>{metric.label}</span>
        <span style={{ fontSize: 9, color: "var(--text-muted)", marginLeft: 2 }}>
          {open ? "▴" : "▾"}
        </span>
      </button>
      <div className={`wt-menu${open ? " open" : ""}`} role="listbox">
        {TREND_METRICS.filter((m) => m.key !== excludeKey).map((m) => (
          <div
            key={m.key}
            role="option"
            aria-selected={selected === m.key}
            className={`wt-menu-item${selected === m.key ? " wt-active" : ""}`}
            onClick={() => { onSelect(m.key); setOpen(false); }}
          >
            <span className="wt-dot" style={{ background: m.color }} />
            {m.label}
            <span className="wt-check">✓</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Granularity Toggle ────────────────────────────────────────────────────
function GranularityToggle({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
      {[
        { value: "daily",  label: "Day"  },
        { value: "weekly", label: "Week" },
      ].map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`wt-granularity-btn${value === opt.value ? " active" : ""}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Weekly / Daily Trend Chart ────────────────────────────────────────────
function WeeklyTrendChart({ weeks, total, applications }) {
  const isMobile = useIsMobile();
  const [primary, setPrimary] = useState("applied");
  const [secondary, setSecondary] = useState("interviews");
  const [granularity, setGranularity] = useState("weekly");

  // ── MUST be before early return ──────────────────────────────────────
  const ghostCutoff = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  }, []);

  // Daily aggregation — always last 7 days (today + 6 before), zero-filled
  const dailyData = useMemo(() => {
    // Build a map from app data first
    const dayMap = {};
    (applications || []).forEach((app) => {
      const dateStr = app.dateApplied || app.createdAt;
      if (!dateStr) return;
      // Use local date string to avoid timezone shifting the day
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!dayMap[key]) dayMap[key] = { applied: 0, interviews: 0, offers: 0, rejected: 0, ghosted: 0 };
      dayMap[key].applied += 1;
      if (app.status === "Interview") dayMap[key].interviews += 1;
      if (app.status === "Offer")     dayMap[key].offers     += 1;
      if (app.status === "Rejected")  dayMap[key].rejected   += 1;
      if (app.status === "Applied" && new Date(dateStr) < ghostCutoff) dayMap[key].ghosted += 1;
    });

    // Generate exactly 5 consecutive days ending today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const isToday = i === 0;
      const data = dayMap[key] || { applied: 0, interviews: 0, offers: 0, rejected: 0, ghosted: 0 };
      const callbackRate = data.applied > 0
        ? parseFloat(((data.interviews + data.offers) / data.applied * 100).toFixed(1))
        : 0;
      days.push({
        // Label: "May 22 •" for today, "May 21" for others
        week: d.toLocaleDateString("en-IN", { month: "short", day: "2-digit" }) + (isToday ? " •" : ""),
        isToday,
        ...data,
        callbackRate,
      });
    }
    return days;
  }, [applications, ghostCutoff]);

  // ── Early return after all hooks ─────────────────────────────────────
  if (total < THRESHOLDS.WEEKLY_CHART || !weeks || weeks.length === 0) {
    return <LockedCard title="Application Trend" unlockAt={THRESHOLDS.WEEKLY_CHART} current={total} icon="📈" />;
  }

  // Weekly aggregation
  const weekMap = {};
  weeks.forEach(([key]) => {
    weekMap[key] = { applied: 0, interviews: 0, offers: 0, rejected: 0, ghosted: 0 };
  });
  (applications || []).forEach((app) => {
    const dateStr = app.dateApplied || app.createdAt;
    if (!dateStr) return;
    const weekKey = getWeekKey(dateStr);
    if (!weekMap[weekKey]) return;
    weekMap[weekKey].applied += 1;
    if (app.status === "Interview") weekMap[weekKey].interviews += 1;
    if (app.status === "Offer")     weekMap[weekKey].offers     += 1;
    if (app.status === "Rejected")  weekMap[weekKey].rejected   += 1;
    if (app.status === "Applied" && new Date(dateStr) < ghostCutoff) weekMap[weekKey].ghosted += 1;
  });
  const weeklyData = weeks.map(([key]) => {
    const d = weekMap[key] || { applied: 0, interviews: 0, offers: 0, rejected: 0, ghosted: 0 };
    const callbackRate = d.applied > 0
      ? parseFloat(((d.interviews + d.offers) / d.applied * 100).toFixed(1))
      : 0;
    return {
      week: new Date(key).toLocaleDateString("en-IN", { month: "short", day: "2-digit" }),
      ...d,
      callbackRate,
    };
  });

  const data = granularity === "daily" ? dailyData : weeklyData;

  const pMeta = TREND_METRICS.find((m) => m.key === primary);
  const sMeta = TREND_METRICS.find((m) => m.key === secondary);
  const chartHeight = isMobile ? 190 : 230;

  return (
    <div tabIndex={-1} style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "20px",
      marginBottom: 16,
      outline: "none",
      userSelect: "none",
    }}>

      {/* ── Header row ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        columnGap: isMobile ? 6 : 8,
        rowGap: 8,
        marginBottom: 16,
        flexWrap: "wrap",
      }}>

        {/* Title */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          flexShrink: 0,
          marginRight: 2,
        }}>
          Trend
        </div>

        {/* Granularity toggle */}
        <GranularityToggle value={granularity} onChange={setGranularity} />

        {/* Separator */}
        <div style={{ width: 1, height: 18, background: "var(--border)", flexShrink: 0 }} />

        {/* Primary metric dropdown */}
        <MetricDropdown selected={primary} onSelect={setPrimary} excludeKey={secondary} />

        {/* vs */}
        <span style={{
          fontSize: 11,
          color: "var(--text-muted)",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          flexShrink: 0,
        }}>
          vs
        </span>

        {/* Secondary metric dropdown */}
        <MetricDropdown selected={secondary} onSelect={setSecondary} excludeKey={primary} />

        {/* Data point count badge */}
        <div style={{
          marginLeft: "auto",
          fontSize: 10,
          color: "var(--text-muted)",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "3px 9px",
          fontFamily: "'DM Sans', sans-serif",
          flexShrink: 0,
        }}>
          {granularity === "daily" ? "Last 5 days" : `${data.length} weeks`}
        </div>
      </div>

      {/* ── Legend ── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        {[pMeta, sMeta].map((m) => (
          <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              width: 20, height: 3,
              background: m.color,
              borderRadius: 99,
              display: "inline-block",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: isMobile ? 10 : 11, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Chart ── */}
      <ResponsiveContainer width="100%" height={chartHeight} style={{ background: "transparent", outline: "none" }}>
        <AreaChart data={data} style={{ outline: "none" }} tabIndex={-1} margin={{ left: 4, right: 16, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="gPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={pMeta.color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={pMeta.color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gSecondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={sMeta.color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={sMeta.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: "#555562", fontSize: isMobile ? 9 : 11 }}
            axisLine={false}
            tickLine={false}
            interval={granularity === "daily" ? 0 : (isMobile ? 1 : 0)}
            padding={{ left: 16, right: 16 }}
          />
          <YAxis
            tick={{ fill: "#555562", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey={primary}
            name={pMeta.label}
            stroke={pMeta.color}
            strokeWidth={2}
            fill="url(#gPrimary)"
            dot={granularity === "daily" ? false : false}
            activeDot={{ r: 4, fill: pMeta.color, strokeWidth: 0 }}
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey={secondary}
            name={sMeta.label}
            stroke={sMeta.color}
            strokeWidth={2}
            fill="url(#gSecondary)"
            dot={false}
            activeDot={{ r: 4, fill: sMeta.color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* ── Insight callout ── */}
      {(() => {
        if (data.length < 2) return null;
        const lastPt  = data[data.length - 1];
        const prevPt  = data[data.length - 2];
        const pChange = lastPt[primary] - prevPt[primary];
        if (pChange === 0) return null;
        const isUp = pChange > 0;
        return (
          <div style={{
            marginTop: 14,
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
            color: isUp ? "#22c55e" : "#f59e0b",
            background: isUp ? "rgba(34,197,94,0.07)" : "rgba(245,158,11,0.07)",
            border: `1px solid ${isUp ? "rgba(34,197,94,0.18)" : "rgba(245,158,11,0.18)"}`,
          }}>
            {isUp ? "↑" : "↓"} {pMeta.label}{" "}
            {isUp ? "up" : "down"} by{" "}
            <strong>{Math.abs(pChange)}{primary === "callbackRate" ? "%" : ""}</strong>{" "}
            {granularity === "daily" ? "today vs yesterday" : "this week vs last week"}.
          </div>
        );
      })()}
    </div>
  );
}

// ── computeStats ──────────────────────────────────────────────────────────
function computeStats(filtered) {
  const total = filtered.length;
  if (total === 0) return null;

  const byStatus = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  const byPlatform = {};
  const byWorkType = {};
  const weeklyData = {};
  const resumeData = {};
  const roleData = {};

  let totalResponseDays = 0, responseCount = 0;
  const now = new Date();

  filtered.forEach((app) => {
    byStatus[app.status] = (byStatus[app.status] || 0) + 1;

    if (app.platform) {
      if (!byPlatform[app.platform]) byPlatform[app.platform] = { total: 0, interviews: 0, offers: 0 };
      byPlatform[app.platform].total++;
      if (app.status === "Interview") byPlatform[app.platform].interviews++;
      if (app.status === "Offer")     byPlatform[app.platform].offers++;
    }

    if (app.workType) byWorkType[app.workType] = (byWorkType[app.workType] || 0) + 1;

    const dateForWeek = app.dateApplied || app.createdAt;
    if (dateForWeek) {
      const week = getWeekKey(dateForWeek);
      if (!weeklyData[week]) weeklyData[week] = { applied: 0, interviews: 0, offers: 0 };
      weeklyData[week].applied++;
      if (app.status === "Interview") weeklyData[week].interviews++;
      if (app.status === "Offer")     weeklyData[week].offers++;
    }

    if (app.resumeVersion) {
      if (!resumeData[app.resumeVersion]) resumeData[app.resumeVersion] = { total: 0, callbacks: 0 };
      resumeData[app.resumeVersion].total++;
      if (app.status === "Interview" || app.status === "Offer") resumeData[app.resumeVersion].callbacks++;
    }

    if (app.role) {
      const r = app.role.toLowerCase();
      const roleKey = r.includes("backend")  ? "Backend"
        : r.includes("frontend") ? "Frontend"
        : r.includes("full")     ? "Fullstack"
        : r.includes("data")     ? "Data"
        : r.includes("ml") || r.includes("ai") ? "ML/AI"
        : "Other";
      if (!roleData[roleKey]) roleData[roleKey] = { total: 0, callbacks: 0 };
      roleData[roleKey].total++;
      if (app.status === "Interview" || app.status === "Offer") roleData[roleKey].callbacks++;
    }

    if (app.statusHistory && app.statusHistory.length > 1) {
      const first  = new Date(app.statusHistory[0].date);
      const second = new Date(app.statusHistory[1].date);
      const days   = Math.round((second - first) / (1000 * 60 * 60 * 24));
      if (days >= 0) { totalResponseDays += days; responseCount++; }
    }
  });

  const ghostCutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const ghostCount  = filtered.filter((a) => {
    if (a.status !== "Applied") return false;
    return new Date(a.dateApplied || a.createdAt) < ghostCutoff;
  }).length;
  const ghostRate = total > 0 ? (ghostCount / total) * 100 : 0;

  const platformPerf = Object.entries(byPlatform)
    .map(([name, d]) => ({
      name, total: d.total, responses: d.interviews + d.offers,
      rate: d.total > 0 ? pct(d.interviews + d.offers, d.total) : "0.0",
    }))
    .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));

  const resumePerf = Object.entries(resumeData)
    .map(([name, d]) => ({ name, total: d.total, rate: d.total > 0 ? pct(d.callbacks, d.total) : "0.0" }))
    .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));

  const rolePerf = Object.entries(roleData)
    .filter(([, d]) => d.total >= 2)
    .map(([name, d]) => ({ name, total: d.total, rate: d.total > 0 ? pct(d.callbacks, d.total) : "0.0" }))
    .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));

  const weeks       = Object.entries(weeklyData).sort((a, b) => a[0].localeCompare(b[0]));
  const weeksTotal  = weeks.length;
  const weeksActive = weeks.filter(([, d]) => d.applied > 0).length;
  const avgPerActiveWeek = weeksActive > 0 ? filtered.length / weeksActive : 0;

  let maxGapDays = 0;
  const activeDates = filtered
    .map((a) => new Date(a.dateApplied || a.createdAt))
    .filter(Boolean)
    .sort((a, b) => a - b);
  for (let i = 1; i < activeDates.length; i++) {
    const gap = Math.round((activeDates[i] - activeDates[i - 1]) / (1000 * 60 * 60 * 24));
    if (gap > maxGapDays) maxGapDays = gap;
  }

  const consistencyScore = weeksTotal > 0
    ? Math.round((weeksActive / weeksTotal) * 100 * (1 - Math.min(1, maxGapDays / 30)))
    : 0;

  return {
    total,
    byStatus,
    byWorkType,
    platformPerf,
    resumePerf,
    rolePerf,
    weeks: weeks.slice(-5),
    callbackRate:   pct(byStatus.Interview + byStatus.Offer, total) ?? "0.0",
    offerRate:      pct(byStatus.Offer,     total) ?? "0.0",
    rejectionRate:  pct(byStatus.Rejected,  total) ?? "0.0",
    ghostCount,
    ghostRate,
    avgResponseDays: responseCount > 0 ? Math.round(totalResponseDays / responseCount) : null,
    consistencyScore,
    consistencyData: { weeksActive, weeksTotal, maxGapDays, avgPerActiveWeek },
    responseByCompanyType: [],
  };
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function Analytics({ applications }) {
  const [timeFilter, setTimeFilter] = useState("all");
  const isMobile = useIsMobile();

  const filtered = useMemo(() => {
    if (timeFilter === "all") return applications;
    const cutoff = new Date();
    if (timeFilter === "7d")  cutoff.setDate(cutoff.getDate() - 7);
    if (timeFilter === "30d") cutoff.setDate(cutoff.getDate() - 30);
    cutoff.setHours(0, 0, 0, 0);
    return applications.filter((a) => {
      const date = a.dateApplied ? new Date(a.dateApplied) : new Date(a.createdAt);
      return date >= cutoff;
    });
  }, [applications, timeFilter]);

  const stats = useMemo(() => computeStats(filtered), [filtered]);

  if (!stats) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.5 }}>📭</div>
        <h3>No data to analyze</h3>
        <p>
          {timeFilter !== "all"
            ? `No applications in the last ${timeFilter === "7d" ? "7 days" : "30 days"}. Try "All time".`
            : "Add your first application to start tracking."}
        </p>
        {timeFilter !== "all" && (
          <button className="btn-ghost" style={{ marginTop: 12 }} onClick={() => setTimeFilter("all")}>
            View All Time
          </button>
        )}
      </div>
    );
  }

  const donutSection = isMobile ? (
    <>
      <StatusDonutChart byStatus={stats.byStatus} total={stats.total} />
      <WorkTypeChart byWorkType={stats.byWorkType} total={stats.total} />
    </>
  ) : (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <StatusDonutChart byStatus={stats.byStatus} total={stats.total} />
      <WorkTypeChart byWorkType={stats.byWorkType} total={stats.total} />
    </div>
  );

  const callbackCount = stats.byStatus.Interview + stats.byStatus.Offer;

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: RECHARTS_RESET + TREND_DROPDOWN_STYLES }} />

      {/* Time filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        {[
          { value: "7d",  label: "Last 7d"  },
          { value: "30d", label: "Last 30d" },
          { value: "all", label: "All time" },
        ].map((opt) => (
          <button key={opt.value} onClick={() => setTimeFilter(opt.value)} style={{
            padding: isMobile ? "5px 10px" : "6px 14px",
            borderRadius: "var(--radius-sm)",
            border: `1px solid ${timeFilter === opt.value ? "rgba(108,99,255,0.4)" : "var(--border)"}`,
            background: timeFilter === opt.value ? "rgba(108,99,255,0.12)" : "transparent",
            color: timeFilter === opt.value ? "#6c63ff" : "var(--text-muted)",
            fontSize: isMobile ? 11 : 12, fontWeight: 500, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", outline: "none",
          }}>
            {opt.label}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>
          {stats.total} app{stats.total !== 1 ? "s" : ""}
        </span>
      </div>

      <HealthScore stats={stats} />

      <GhostRateCard stats={stats} />
      <Funnel
        byStatus={stats.byStatus}
        total={stats.total}
        callbackRate={stats.callbackRate}
        callbackCount={callbackCount}
        ghostRate={stats.ghostRate}
        ghostCount={stats.ghostCount}
      />
      <ConsistencyCard stats={stats} />

      {donutSection}

      <WeeklyTrendChart
        weeks={stats.weeks}
        total={stats.total}
        applications={filtered}
      />

      <PlatformChart platformPerf={stats.platformPerf} total={stats.total} />
      <ResumePerformanceCard stats={stats} />
      <RoleInsightsCard stats={stats} />

      <InsightsEngine applications={applications} />
    </div>
  );
}