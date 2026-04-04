"use client";

import { useState, useEffect } from "react";

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const DAILY_LIMIT = 2;
const STORAGE_KEY = "resumeMatcher_usage";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}
function getUsageData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: getTodayStr() };
    return JSON.parse(raw);
  } catch {
    return { count: 0, date: getTodayStr() };
  }
}
function saveUsageData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function getRemainingUses() {
  const usage = getUsageData();
  if (usage.date !== getTodayStr()) return DAILY_LIMIT;
  return Math.max(0, DAILY_LIMIT - usage.count);
}
function incrementUsage() {
  const today = getTodayStr();
  const usage = getUsageData();
  if (usage.date !== today) {
    saveUsageData({ count: 1, date: today });
  } else {
    saveUsageData({ count: usage.count + 1, date: today });
  }
}

// Score ring — pure CSS, no emoji
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
  // verdict: "strong" | "weak" | "missing"
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

export default function ResumeMatcher() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(DAILY_LIMIT);

  useEffect(() => {
    setRemaining(getRemainingUses());
  }, []);

  const isLimitReached = remaining <= 0;

  const analyze = async () => {
    if (!resume.trim() || !jobDesc.trim()) {
      setError("Paste both your resume and the job description to continue.");
      return;
    }
    if (getRemainingUses() <= 0) {
      setError("Daily limit reached. Resets at midnight.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const prompt = `You are a senior technical recruiter and ATS specialist. Your job is to give a surgical, honest analysis — not a feel-good report. Be direct, specific, and ruthless about gaps.

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
            temperature: 0.2,
            max_tokens: 1400,
            messages: [
              {
                role: "system",
                content:
                  "You are a blunt, expert technical recruiter. Return ONLY valid JSON — no markdown, no preamble, no explanation.",
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

      incrementUsage();
      setRemaining(getRemainingUses());
      setResult(parsed);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.matchScore >= 75
      ? "var(--green)"
      : result.matchScore >= 50
        ? "var(--yellow)"
        : "var(--red)"
    : "var(--text-muted)";

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.4px",
              fontFamily: "var(--font-display, sans-serif)",
            }}
          >
            Resume Matcher
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            Surgical match analysis — role alignment, technical depth, ATS risk,
            and one fix that matters.
          </p>
        </div>

        {/* Usage counter */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 2,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1,
              fontFamily: "var(--font-display, sans-serif)",
              color: isLimitReached
                ? "var(--red)"
                : remaining === 1
                  ? "var(--yellow)"
                  : "var(--green)",
            }}
          >
            {remaining}/{DAILY_LIMIT}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            left today
          </div>
        </div>
      </div>

      {/* Why this is different — minimal, factual */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border, rgba(255,255,255,0.07))",
          borderRadius: 8,
          padding: "14px 18px",
          marginBottom: 20,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
        }}
      >
        {[
          { label: "Role alignment", sub: "seniority & domain fit" },
          { label: "Technical depth", sub: "skills that actually match" },
          { label: "Achievement quality", sub: "impact vs. duty-lists" },
          { label: "One fix", sub: "highest-leverage edit" },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            style={{
              padding: "0 16px",
              borderRight:
                i < arr.length - 1
                  ? "1px solid var(--border, rgba(255,255,255,0.07))"
                  : "none",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 2,
              }}
            >
              {item.label}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
              {item.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Limit banner */}
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
          Daily limit reached — both analyses used. Resets at midnight.
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
          Last analysis for today — use it on your best resume + JD pair.
        </div>
      )}

      {/* Text areas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
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
              <label className="form-label" style={{ margin: 0 }}>
                {label}
              </label>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {value.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              className="form-textarea"
              style={{
                minHeight: 210,
                fontFamily: "monospace",
                fontSize: 11,
                lineHeight: 1.7,
                opacity: isLimitReached ? 0.4 : 1,
              }}
              placeholder={placeholder}
              value={value}
              disabled={isLimitReached}
              onChange={(e) => setter(e.target.value)}
            />
          </div>
        ))}
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
          gap: 10,
          marginBottom: 32,
          alignItems: "center",
        }}
      >
        <button
          className="btn-primary"
          onClick={analyze}
          disabled={loading || isLimitReached}
          style={{
            opacity: loading || isLimitReached ? 0.45 : 1,
            cursor: isLimitReached ? "not-allowed" : "pointer",
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
              Analyzing...
            </span>
          ) : (
            "Analyze Match"
          )}
        </button>

        {(resume || jobDesc || result) && (
          <button
            className="btn-ghost"
            onClick={() => {
              setResume("");
              setJobDesc("");
              setResult(null);
              setError("");
            }}
          >
            Clear
          </button>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Results ── */}
      {result && (
        <div>
          {/* Score + verdict */}
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              padding: "24px 28px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border, rgba(255,255,255,0.07))",
              borderRadius: 12,
              marginBottom: 8,
            }}
          >
            <ScoreRing score={result.matchScore} size={110} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
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
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  lineHeight: 1.5,
                }}
              >
                {result.verdict}
              </p>
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
    </div>
  );
}
