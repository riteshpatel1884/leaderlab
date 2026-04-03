"use client";

import { useState } from "react";

export default function ResumeMatcher() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!resume.trim() || !jobDesc.trim()) {
      setError("Please paste both your resume and the job description.");
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

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Analysis failed. Please try again.");
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
      <div className="insight-box">
        Paste your resume and a job description to get an AI-powered match
        analysis. Find missing keywords, skill gaps, and actionable advice.
      </div>

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
            style={{ minHeight: 220, fontFamily: "monospace", fontSize: 12 }}
            placeholder="Paste your resume text here..."
            value={resume}
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
            style={{ minHeight: 220, fontFamily: "monospace", fontSize: 12 }}
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <div
            style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}
          >
            {jobDesc.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </div>
      </div>

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

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <button
          className="btn-primary"
          onClick={analyze}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
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
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Results */}
      {result && (
        <div>
          {/* Score */}
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

          {/* Summary */}
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
            {/* Strengths */}
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

            {/* Gaps */}
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

          {/* Keywords */}
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

          {/* Recommendation */}
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
