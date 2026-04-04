"use client";

import { useState, useEffect } from "react";

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const DAILY_LIMIT = 2;
const STORAGE_KEY = "resumeMatcher_usage";
const HISTORY_KEY = "resumeMatcher_history";

// Mobile detection
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
}

// IST timezone utilities
function getISTNow() {
  const date = new Date();
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function getISTDateStr(date = null) {
  const d = date || getISTNow();
  return d.toISOString().split("T")[0];
}

function getFormattedDateTime(date = null) {
  const d = date || getISTNow();
  return d.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Usage tracking
function getUsageData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: getISTDateStr() };
    return JSON.parse(raw);
  } catch {
    return { count: 0, date: getISTDateStr() };
  }
}

function saveUsageData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getRemainingUses() {
  const usage = getUsageData();
  const today = getISTDateStr();
  if (usage.date !== today) return DAILY_LIMIT;
  return Math.max(0, DAILY_LIMIT - usage.count);
}

function incrementUsage() {
  const today = getISTDateStr();
  const usage = getUsageData();
  if (usage.date !== today) {
    saveUsageData({ count: 1, date: today });
  } else {
    saveUsageData({ count: usage.count + 1, date: today });
  }
}

// History management
function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveToHistory(analysis) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    timestamp: getISTNow().toISOString(),
    formattedTime: getFormattedDateTime(),
    role: analysis.role,
    resumeVersion: analysis.resumeVersion,
    experience: analysis.experience,
    matchScore: analysis.matchScore,
    verdict: analysis.verdict,
    fullAnalysis: analysis,
  };
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

// Components
function ScoreRing({ score, size = 100 }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  const color =
    score >= 75 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={fill}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <text
        x="50"
        y="46"
        textAnchor="middle"
        fill={color}
        style={{
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "var(--font-display, sans-serif)",
        }}
      >
        {score}%
      </text>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fill="var(--text-muted)"
        style={{ fontSize: 8, fontFamily: "sans-serif", letterSpacing: 0.5 }}
      >
        MATCH
      </text>
    </svg>
  );
}

function Divider({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "28px 0 20px",
      }}
    >
      <div
        style={{
          height: 1,
          flex: 1,
          background: "var(--border, rgba(255,255,255,0.07))",
        }}
      />
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
      <div
        style={{
          height: 1,
          flex: 1,
          background: "var(--border, rgba(255,255,255,0.07))",
        }}
      />
    </div>
  );
}

function Tag({ text, variant }) {
  const styles = {
    miss: {
      bg: "rgba(239,68,68,0.08)",
      color: "var(--red, #ef4444)",
      border: "rgba(239,68,68,0.2)",
    },
    hit: {
      bg: "rgba(34,197,94,0.08)",
      color: "var(--green, #22c55e)",
      border: "rgba(34,197,94,0.2)",
    },
    neutral: {
      bg: "rgba(255,255,255,0.04)",
      color: "var(--text-secondary)",
      border: "rgba(255,255,255,0.1)",
    },
  };
  const s = styles[variant] || styles.neutral;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.2px",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {text}
    </span>
  );
}

function ImpactRow({ label, value, verdict, detail }) {
  const barColor =
    verdict === "strong"
      ? "var(--green)"
      : verdict === "weak"
        ? "var(--yellow)"
        : "var(--red)";
  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid var(--border, rgba(255,255,255,0.05))",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            color: barColor,
          }}
        >
          {verdict}
        </span>
      </div>
      <div
        style={{
          height: 3,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 2,
          marginBottom: 6,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: barColor,
            borderRadius: 2,
            transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
      {detail && (
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {detail}
        </p>
      )}
    </div>
  );
}

function HistoryModal({ isOpen, onClose, history }) {
  if (!isOpen) return null;
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 999,
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "var(--bg-secondary, rgba(10,10,10,0.95))",
          border: "1px solid var(--border, rgba(255,255,255,0.07))",
          borderRadius: 12,
          width: "90%",
          maxWidth: 700,
          maxHeight: "85vh",
          overflowY: "auto",
          zIndex: 1000,
          animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid var(--border, rgba(255,255,255,0.07))",
            position: "sticky",
            top: 0,
            background: "var(--bg-secondary)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              Analysis History
            </h3>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              {history.length} analyses saved (Last 50)
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {history.length === 0 ? (
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
            <p style={{ margin: 0 }}>No analyses yet. Run your first match!</p>
          </div>
        ) : (
          <div style={{ padding: "16px 20px" }}>
            {history.map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border, rgba(255,255,255,0.06))",
                  borderRadius: 8,
                  marginBottom: 10,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {entry.role}
                      </span>
                      {entry.experience !== null &&
                        entry.experience !== undefined &&
                        entry.experience !== "" && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                              background: "rgba(34,197,94,0.08)",
                              border: "1px solid rgba(34,197,94,0.2)",
                              padding: "2px 8px",
                              borderRadius: 3,
                            }}
                          >
                            {entry.experience === "0" || entry.experience === 0
                              ? "Fresher"
                              : `${entry.experience} yr${entry.experience == 1 ? "" : "s"}`}
                          </span>
                        )}
                      {entry.resumeVersion && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            background: "rgba(129,140,248,0.1)",
                            padding: "2px 8px",
                            borderRadius: 3,
                          }}
                        >
                          v{entry.resumeVersion}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginBottom: 8,
                      }}
                    >
                      {entry.formattedTime}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        fontStyle: "italic",
                      }}
                    >
                      "{entry.verdict}"
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color:
                          entry.matchScore >= 75
                            ? "var(--green)"
                            : entry.matchScore >= 50
                              ? "var(--yellow)"
                              : "var(--red)",
                      }}
                    >
                      {entry.matchScore}%
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      match
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translate(-50%, calc(-50% + 20px)); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }
      `}</style>
    </>
  );
}

export default function ResumeMatcher() {
  const isMobile = useIsMobile();
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [role, setRole] = useState("");
  const [jobType, setJobType] = useState("job");
  const [resumeVersion, setResumeVersion] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setRemaining(getRemainingUses());
    setHistory(getHistory());
  }, []);

  const isLimitReached = remaining <= 0;

  const expYears = experience === "" ? null : parseInt(experience);

  // If experience > 0, internship is not applicable — show only job
  const isFresherOrUnset = expYears === null || expYears === 0;

  // Validate experience input — only allow whole numbers
  const handleExperienceChange = (e) => {
    const val = e.target.value;
    if (val === "" || (/^\d+$/.test(val) && parseInt(val) <= 50)) {
      setExperience(val);
      // Auto-reset to "job" if user enters experience > 0
      if (val !== "" && parseInt(val) > 0) {
        setJobType("job");
      }
    }
  };

  const experienceLabel =
    expYears === null
      ? ""
      : expYears === 0
        ? "Fresher / No Experience"
        : expYears === 1
          ? "1 year"
          : `${expYears} years`;

  const analyze = async () => {
    if (!resume.trim() || !jobDesc.trim() || !role.trim()) {
      setError("Resume, job description, and role are required.");
      return;
    }
    if (experience === "") {
      setError(
        "Years of experience is required. Enter 0 if you are a fresher.",
      );
      return;
    }
    if (getRemainingUses() <= 0) {
      setError("Daily limit reached. Resets at midnight IST.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const positionType =
      jobType === "internship" ? "Internship Position" : "Full-Time Job";
    const expContext =
      expYears === 0
        ? "0 years (Fresher — no professional work experience at all)"
        : `${expYears} year${expYears === 1 ? "" : "s"} of professional experience`;

    const prompt = `You are a senior technical recruiter and ATS specialist. Your job is to give a surgical, honest analysis — not a feel-good report. Be direct, specific, and ruthless about gaps.

Position Type: ${positionType}
Target Role: ${role}

Resume:
${resume}

Job Description:
${jobDesc}

Return ONLY a valid JSON object with no extra text, markdown, or explanation:

{
  "matchScore": <integer 0-100, be realistic — 60+ means genuinely strong>,
  "verdict": "<one sentence: direct hiring recommendation>",

  "roleAlignment": {
    "score": <0-100>,
    "verdict": "strong|weak|missing",
    "detail": "<specific: does their title/experience level actually fit the seniority and domain of this role?>"
  },
  "technicalDepth": {
    "score": <0-100>,
    "verdict": "strong|weak|missing",
    "detail": "<specific: which required skills are demonstrated at depth vs. surface-mentioned vs. missing entirely?>"
  },
  "experienceRelevance": {
    "score": <0-100>,
    "verdict": "strong|weak|missing",
    "detail": "<specific: do past employers / projects actually reflect the work this role requires?>"
  },
  "achievementQuality": {
    "score": <0-100>,
    "verdict": "strong|weak|missing",
    "detail": "<specific: are results quantified and meaningful, or are they vague duty-lists? Name actual bullets that stand out or that are weak.>"
  },

  "criticalGaps": [
    "<gap 1: be specific — name the missing skill, tool, domain, or experience. Max 6 items.>",
    "<gap 2>",
    "<gap 3>"
  ],

  "missingKeywords": ["<exact keyword from JD not in resume>"],
  "matchedKeywords": ["<exact keyword present in both>"],

  "atsRisk": "<one sentence: will this resume likely pass ATS filters for this specific role, and why?>",

  "oneThingToFix": "<the single most impactful edit the candidate should make to this resume before applying>"
}`;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            max_tokens: 1400,
            messages: [
              {
                role: "system",
                content:
                  "You are a blunt, expert technical recruiter. Return ONLY valid JSON — no markdown, no preamble, no explanation. Follow all scoring rules exactly as given.",
              },
              { role: "user", content: prompt },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error?.message || "API error");
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      saveToHistory({
        role,
        jobType,
        experience: experience,
        resumeVersion: resumeVersion || null,
        matchScore: parsed.matchScore,
        verdict: parsed.verdict,
        ...parsed,
      });

      incrementUsage();
      setRemaining(getRemainingUses());
      setHistory(getHistory());
      setResult(parsed);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translate(-50%, calc(-50% + 20px)); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
          gap: isMobile ? 12 : 20,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: isMobile ? 16 : 18,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.4px",
              fontFamily: "var(--font-display, sans-serif)",
            }}
          >
            Resume Matcher Pro
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: isMobile ? 11 : 12,
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            Role-targeted analysis with experience-aware scoring.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            alignItems: isMobile ? "center" : "flex-end",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: isMobile ? 16 : 20,
              fontWeight: 800,
              lineHeight: 1,
              fontFamily: "var(--font-display, sans-serif)",
              color: isLimitReached
                ? "var(--red)"
                : remaining === 1
                  ? "var(--yellow)"
                  : "var(--green)",
              textAlign: isMobile ? "center" : "right",
            }}
          >
            {remaining}/{DAILY_LIMIT}
            <div
              style={{
                fontSize: isMobile ? 9 : 10,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: 600,
              }}
            >
              left
            </div>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "var(--text-primary)",
              padding: isMobile ? "6px 10px" : "8px 12px",
              borderRadius: 6,
              fontSize: isMobile ? 10 : 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
            }
          >
            📊 {history.length}
          </button>
        </div>
      </div>

      {/* Features strip */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border, rgba(255,255,255,0.07))",
          borderRadius: 8,
          padding: isMobile ? "12px 14px" : "14px 18px",
          marginBottom: 20,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: isMobile ? 12 : 0,
        }}
      >
        {[
          { label: "Experience-aware", sub: "0 = fresher scoring" },
          { label: "Job / Internship", sub: "separate scoring" },
          { label: "Version tracking", sub: "iterations" },
          { label: "Full history", sub: "50 analyses" },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            style={{
              padding: isMobile ? "0" : "0 16px",
              borderRight:
                !isMobile && i < arr.length - 1
                  ? "1px solid var(--border, rgba(255,255,255,0.07))"
                  : "none",
            }}
          >
            <div
              style={{
                fontSize: isMobile ? 10 : 11,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 2,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: isMobile ? 9 : 10,
                color: "var(--text-muted)",
              }}
            >
              {item.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Limit banners */}
      {isLimitReached && (
        <div
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.18)",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 16,
            fontSize: 12,
            color: "var(--red)",
            lineHeight: 1.6,
          }}
        >
          Daily limit reached — resets at midnight IST.
        </div>
      )}
      {remaining === 1 && !isLimitReached && (
        <div
          style={{
            background: "rgba(234,179,8,0.06)",
            border: "1px solid rgba(234,179,8,0.18)",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 16,
            fontSize: 12,
            color: "var(--yellow)",
          }}
        >
          Last analysis for today — use it wisely.
        </div>
      )}

      {/* Input grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 12 : 16,
          marginBottom: 16,
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Target Role */}
          <div className="form-group" style={{ margin: 0 }}>
            <label
              className="form-label"
              style={{
                margin: "0 0 6px 0",
                display: "block",
                fontSize: isMobile ? 11 : 12,
              }}
            >
              Target Role
            </label>
            <input
              type="text"
              className="form-input"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6,
                color: "var(--text-primary)",
                fontSize: isMobile ? 11 : 12,
                fontFamily: "sans-serif",
                opacity: isLimitReached ? 0.4 : 1,
              }}
              placeholder="e.g., ML Engineer, Frontend Dev"
              value={role}
              disabled={isLimitReached}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          {/* Years of Experience */}
          <div className="form-group" style={{ margin: 0 }}>
            <label
              className="form-label"
              style={{
                margin: "0 0 6px 0",
                display: "block",
                fontSize: isMobile ? 11 : 12,
              }}
            >
              Years of Experience
              <span style={{ color: "var(--red)", marginLeft: 3 }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="form-input"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  paddingRight: experienceLabel ? "110px" : "12px",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${experience === "" ? "rgba(255,255,255,0.1)" : expYears === 0 ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                  borderRadius: 6,
                  color: "var(--text-primary)",
                  fontSize: isMobile ? 11 : 12,
                  fontFamily: "sans-serif",
                  opacity: isLimitReached ? 0.4 : 1,
                  boxSizing: "border-box",
                }}
                placeholder="Enter 0, 1, 2, 3 ..."
                value={experience}
                disabled={isLimitReached}
                onChange={handleExperienceChange}
              />
              {experienceLabel && (
                <span
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 10,
                    fontWeight: 600,
                    color: expYears === 0 ? "var(--red)" : "var(--green)",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {experienceLabel}
                </span>
              )}
            </div>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: 10,
                color: "var(--text-muted)",
              }}
            >
              Enter 0 if you are a fresher with no work experience.
            </p>
          </div>

          {/* Resume Version */}
          <div className="form-group" style={{ margin: 0 }}>
            <label
              className="form-label"
              style={{
                margin: "0 0 6px 0",
                display: "block",
                fontSize: isMobile ? 11 : 12,
              }}
            >
              Resume Version (optional)
            </label>
            <input
              type="text"
              className="form-input"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6,
                color: "var(--text-primary)",
                fontSize: isMobile ? 11 : 12,
                fontFamily: "sans-serif",
                opacity: isLimitReached ? 0.4 : 1,
              }}
              placeholder="e.g., v1.2, Final, ML-focused"
              value={resumeVersion}
              disabled={isLimitReached}
              onChange={(e) => setResumeVersion(e.target.value)}
            />
          </div>

          {/* Job Type Toggle */}
          <div className="form-group" style={{ margin: 0 }}>
            <label
              className="form-label"
              style={{
                margin: "0 0 8px 0",
                display: "block",
                fontSize: isMobile ? 11 : 12,
              }}
            >
              Position Type
            </label>
            <div
              style={{
                display: "grid",
                // Show 2 columns only for freshers or when experience is unset
                gridTemplateColumns: isFresherOrUnset ? "1fr 1fr" : "1fr",
                gap: 8,
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.1)",
                padding: 4,
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {[
                { value: "job", label: "Job" },
                { value: "internship", label: "Internship" },
              ]
                // Hide internship button entirely when experience > 0
                .filter(({ value }) => value === "job" || isFresherOrUnset)
                .map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setJobType(value)}
                    disabled={isLimitReached}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 4,
                      border: `1px solid ${jobType === value ? "rgba(34,197,94,0.3)" : "transparent"}`,
                      background:
                        jobType === value
                          ? "rgba(34,197,94,0.15)"
                          : "transparent",
                      color:
                        jobType === value
                          ? "var(--green)"
                          : "var(--text-secondary)",
                      fontSize: isMobile ? 11 : 12,
                      fontWeight: jobType === value ? 700 : 600,
                      cursor: isLimitReached ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      opacity: isLimitReached ? 0.4 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isLimitReached && jobType !== value)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        jobType === value
                          ? "rgba(34,197,94,0.15)"
                          : "transparent";
                    }}
                  >
                    {label}
                  </button>
                ))}
            </div>
            {/* Hint shown only when internship is hidden */}
            {!isFresherOrUnset && (
              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: 10,
                  color: "var(--text-muted)",
                }}
              >
                Internship option is only available for freshers (0 years
                experience).
              </p>
            )}
          </div>
        </div>

        {/* Right column: Resume + JD */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            {
              label: "Resume",
              value: resume,
              setter: setResume,
              placeholder: "Paste your resume text here...",
            },
            {
              label: "Job Description",
              value: jobDesc,
              setter: setJobDesc,
              placeholder: "Paste the job description here...",
            },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label} className="form-group" style={{ margin: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <label
                  className="form-label"
                  style={{ margin: 0, fontSize: isMobile ? 11 : 12 }}
                >
                  {label}
                </label>
                <span
                  style={{
                    fontSize: isMobile ? 9 : 10,
                    color: "var(--text-muted)",
                  }}
                >
                  {value.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                className="form-textarea"
                style={{
                  minHeight: isMobile ? 120 : 150,
                  fontFamily: "monospace",
                  fontSize: isMobile ? 10 : 11,
                  lineHeight: 1.7,
                  opacity: isLimitReached ? 0.4 : 1,
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--text-primary)",
                  resize: "vertical",
                }}
                placeholder={placeholder}
                value={value}
                disabled={isLimitReached}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.18)",
            borderRadius: 6,
            padding: "10px 14px",
            fontSize: 12,
            color: "var(--red)",
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? 8 : 10,
          marginBottom: 32,
          alignItems: "center",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <button
          className="btn-primary"
          onClick={analyze}
          disabled={loading || isLimitReached}
          style={{
            opacity: loading || isLimitReached ? 0.45 : 1,
            cursor: isLimitReached ? "not-allowed" : "pointer",
            fontSize: isMobile ? 12 : 14,
            padding: isMobile ? "10px 16px" : "10px 20px",
            flex: isMobile ? "1 1 auto" : "0 1 auto",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                }}
              >
                ◌
              </span>
              {!isMobile && "Analyzing..."}
            </span>
          ) : (
            "Analyze"
          )}
        </button>

        {(resume || jobDesc || role || result) && (
          <button
            className="btn-ghost"
            onClick={() => {
              setResume("");
              setJobDesc("");
              setRole("");
              setResumeVersion("");
              setExperience("");
              setJobType("job");
              setResult(null);
              setError("");
            }}
            style={{
              fontSize: isMobile ? 12 : 14,
              padding: isMobile ? "10px 16px" : "10px 20px",
            }}
          >
            {isMobile ? "Clear" : "Clear All"}
          </button>
        )}
      </div>

      {/* Results */}
      {result && (
        <div>
          {/* Score + verdict */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? 16 : 24,
              alignItems: "center",
              padding: isMobile ? "16px 18px" : "24px 28px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border, rgba(255,255,255,0.07))",
              borderRadius: 12,
              marginBottom: 8,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <ScoreRing score={result.matchScore} size={isMobile ? 90 : 110} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: isMobile ? 10 : 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                Verdict
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: isMobile ? 13 : 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  lineHeight: 1.5,
                }}
              >
                {result.verdict}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 8,
                  flexWrap: "wrap",
                }}
              >
                {role && (
                  <span
                    style={{
                      fontSize: isMobile ? 11 : 12,
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    {role}
                  </span>
                )}
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 3,
                    background:
                      jobType === "internship"
                        ? "rgba(129,140,248,0.1)"
                        : "rgba(34,197,94,0.08)",
                    color:
                      jobType === "internship"
                        ? "var(--accent, #818cf8)"
                        : "var(--green)",
                    border:
                      jobType === "internship"
                        ? "1px solid rgba(129,140,248,0.2)"
                        : "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  {jobType === "internship" ? "Internship" : "Job"}
                </span>
                {experience !== "" && (
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 3,
                      background:
                        expYears === 0
                          ? "rgba(239,68,68,0.08)"
                          : "rgba(34,197,94,0.08)",
                      color: expYears === 0 ? "var(--red)" : "var(--green)",
                      border:
                        expYears === 0
                          ? "1px solid rgba(239,68,68,0.2)"
                          : "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    {expYears === 0
                      ? "Fresher"
                      : `${expYears} yr${expYears === 1 ? "" : "s"} exp`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ATS risk */}
          {result.atsRisk && (
            <div
              style={{
                padding: "10px 16px",
                background: "rgba(255,255,255,0.015)",
                border: "1px solid var(--border, rgba(255,255,255,0.06))",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "var(--text-muted)",
                  marginRight: 10,
                }}
              >
                ATS Risk
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {result.atsRisk}
              </span>
            </div>
          )}

          {/* Dimension breakdown */}
          <Divider label="Dimension Analysis" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { key: "roleAlignment", label: "Role Alignment" },
              { key: "technicalDepth", label: "Technical Depth" },
              { key: "experienceRelevance", label: "Experience Relevance" },
              { key: "achievementQuality", label: "Achievement Quality" },
            ].map(({ key, label }) => {
              const d = result[key];
              if (!d) return null;
              return (
                <ImpactRow
                  key={key}
                  label={label}
                  value={d.score}
                  verdict={d.verdict}
                  detail={d.detail}
                />
              );
            })}
          </div>

          {/* Missing sections */}
          {result.missingSections?.length > 0 && (
            <>
              <Divider label="Missing Sections" />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                {result.missingSections.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(239,68,68,0.06)",
                      border: "1px solid rgba(239,68,68,0.18)",
                      borderRadius: 5,
                      fontSize: 12,
                      color: "var(--red)",
                      fontWeight: 600,
                    }}
                  >
                    ✕ {s}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Critical gaps */}
          {result.criticalGaps?.length > 0 && (
            <>
              <Divider label="Critical Gaps" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.criticalGaps.map((gap, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      padding: "10px 14px",
                      background: "rgba(239,68,68,0.04)",
                      border: "1px solid rgba(239,68,68,0.12)",
                      borderRadius: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "var(--red)",
                        flexShrink: 0,
                        marginTop: 1,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        lineHeight: 1.65,
                      }}
                    >
                      {gap}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Keywords */}
          <Divider label="Keyword Coverage" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 8,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "var(--text-muted)",
                  marginBottom: 10,
                }}
              >
                Missing from resume
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(result.missingKeywords || []).map((kw, i) => (
                  <Tag key={i} text={kw} variant="miss" />
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "var(--text-muted)",
                  marginBottom: 10,
                }}
              >
                Present in both
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(result.matchedKeywords || []).map((kw, i) => (
                  <Tag key={i} text={kw} variant="hit" />
                ))}
              </div>
            </div>
          </div>

          {/* One thing to fix */}
          {result.oneThingToFix && (
            <>
              <Divider label="Highest-Leverage Edit" />
              <div
                style={{
                  padding: "16px 20px",
                  background: "rgba(129,140,248,0.05)",
                  border:
                    "1px solid var(--accent-border, rgba(129,140,248,0.2))",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "var(--accent)",
                    marginBottom: 8,
                  }}
                >
                  Do this before applying
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    fontWeight: 500,
                  }}
                >
                  {result.oneThingToFix}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
      />
    </div>
  );
}
