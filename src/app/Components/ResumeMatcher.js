"use client";

import { useState, useEffect } from "react";

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const DAILY_LIMIT = 2;
const STORAGE_KEY = "resumeMatcher_usage";

function getTodayStr() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
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
  if (usage.date !== getTodayStr()) return DAILY_LIMIT; // new day → full reset
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
      setError("Please paste both your resume and the job description.");
      return;
    }
    if (getRemainingUses() <= 0) {
      setError("Daily limit reached. Come back tomorrow.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach.

Analyze the match between this resume and job description. Return ONLY a valid JSON object with no extra text, markdown, or explanation.

Resume:
${resume}

Job Description:
${jobDesc}

Return this exact JSON structure:
{
  "matchScore": <number 0-100>,
  "mismatchScore": <number 0-100, complement of matchScore>,
  "summary": "<2-3 sentence overview of the match>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "matchedKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
  "recommendation": "<1-2 sentence actionable advice to improve the resume for this job>"
}`;

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
            temperature: 0.3,
            max_tokens: 1000,
            messages: [
              {
                role: "system",
                content:
                  "You are an ATS analyzer. Always respond with only valid JSON. No markdown, no explanation, no extra text.",
              },
              { role: "user", content: prompt },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error?.message || "Groq API error");
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      // Deduct only after successful response
      incrementUsage();
      setRemaining(getRemainingUses());
      setResult(parsed);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "var(--green)";
    if (score >= 50) return "var(--yellow)";
    return "var(--red)";
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return "Strong Match";
    if (score >= 50) return "Moderate Match";
    if (score >= 25) return "Weak Match";
    return "Poor Match";
  };

  return (
    <div>
      {/* Top row: insight box + usage counter */}
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "stretch",
          marginBottom: 16,
        }}
      >
        <div className="insight-box" style={{ margin: 0, flex: 1 }}>
          Paste your resume and a job description to get match
          analysis. Find missing keywords, skill gaps and actionable advice.
        </div>

        {/* Usage pill */}
        <div
          style={{
            flexShrink: 0,
            background: isLimitReached
              ? "var(--red-dim)"
              : remaining === 1
                ? "var(--yellow-dim)"
                : "var(--green-dim)",
            border: `1px solid ${
              isLimitReached
                ? "rgba(239,68,68,0.25)"
                : remaining === 1
                  ? "rgba(234,179,8,0.25)"
                  : "rgba(34,197,94,0.25)"
            }`,
            borderRadius: "var(--radius)",
            padding: "12px 18px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 100,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              lineHeight: 1,
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
              marginTop: 5,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Left Today
          </div>
        </div>
      </div>

      {/* Limit reached banner */}
      {isLimitReached && (
        <div
          style={{
            background: "var(--red-dim)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "var(--radius)",
            padding: "14px 18px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 20 }}>🚫</span>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--red)",
                marginBottom: 2,
              }}
            >
              Daily limit reached
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              You&apos;ve used both your free analyses for today. Resets at
              midnight.
            </div>
          </div>
        </div>
      )}

      {/* 1 remaining warning */}
      {remaining === 1 && (
        <div
          style={{
            background: "var(--yellow-dim)",
            border: "1px solid rgba(234,179,8,0.2)",
            borderRadius: "var(--radius)",
            padding: "10px 16px",
            marginBottom: 16,
            fontSize: 12,
            color: "var(--yellow)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>⚠️</span>
          Last analysis for today — use it on your best resume + JD combo.
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
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Your Resume</label>
          <textarea
            className="form-textarea"
            style={{
              minHeight: 220,
              fontFamily: "monospace",
              fontSize: 12,
              opacity: isLimitReached ? 0.45 : 1,
            }}
            placeholder="Paste your resume text here..."
            value={resume}
            disabled={isLimitReached}
            onChange={(e) => setResume(e.target.value)}
          />
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}
          >
            {resume.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Job Description</label>
          <textarea
            className="form-textarea"
            style={{
              minHeight: 220,
              fontFamily: "monospace",
              fontSize: 12,
              opacity: isLimitReached ? 0.45 : 1,
            }}
            placeholder="Paste the job description here..."
            value={jobDesc}
            disabled={isLimitReached}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}
          >
            {jobDesc.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "var(--red-dim)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            fontSize: 13,
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
          marginBottom: 24,
          alignItems: "center",
        }}
      >
        <button
          className="btn-primary"
          onClick={analyze}
          disabled={loading || isLimitReached}
          style={{
            opacity: loading || isLimitReached ? 0.5 : 1,
            cursor: isLimitReached ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                }}
              >
                ◌
              </span>
              Analyzing...
            </>
          ) : (
            <>
              <span>⬡</span> Analyze Match
            </>
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
            Clear All
          </button>
        )}

        {!isLimitReached && (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {remaining} free {remaining === 1 ? "analysis" : "analyses"} left
            today
          </span>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Results */}
      {result && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div
              className="card"
              style={{ textAlign: "center", padding: "28px 20px" }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  marginBottom: 8,
                }}
              >
                Match Score
              </div>
              <div
                style={{
                  fontSize: 52,
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  color: getScoreColor(result.matchScore),
                  lineHeight: 1,
                }}
              >
                {result.matchScore}%
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: getScoreColor(result.matchScore),
                  fontWeight: 600,
                }}
              >
                {getScoreLabel(result.matchScore)}
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${result.matchScore}%`,
                      background: getScoreColor(result.matchScore),
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className="card"
              style={{ textAlign: "center", padding: "28px 20px" }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  marginBottom: 8,
                }}
              >
                Mismatch
              </div>
              <div
                style={{
                  fontSize: 52,
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  color: "var(--red)",
                  lineHeight: 1,
                }}
              >
                {result.mismatchScore}%
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "var(--text-muted)",
                }}
              >
                Skills/keywords gap
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${result.mismatchScore}%`,
                      background: "var(--red)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="insight-box" style={{ marginBottom: 16 }}>
            {result.summary}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div className="card">
              <div className="card-title">✓ Strengths</div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {(result.strengths || []).map((s, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--green)",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div className="card-title">✗ Gaps</div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {(result.gaps || []).map((g, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--red)",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      −
                    </span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title">Keyword Analysis</div>
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Missing Keywords
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {(result.missingKeywords || []).map((kw, i) => (
                  <span
                    key={i}
                    style={{
                      background: "var(--red-dim)",
                      color: "var(--red)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Matched Keywords
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {(result.matchedKeywords || []).map((kw, i) => (
                  <span
                    key={i}
                    style={{
                      background: "var(--green-dim)",
                      color: "var(--green)",
                      border: "1px solid rgba(34,197,94,0.2)",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ borderColor: "var(--accent-border)" }}>
            <div className="card-title">💡 Recommendation</div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              {result.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
