"use client";

import Link from "next/link";
import { useGoals, computeStats } from "@/app/hooks/useGoals";

const features = [
  {
    icon: "📅",
    title: "Smart Daily Scheduling",
    desc: "Add your topics, set a deadline — DueOrDie automatically spreads every topic across every single day of your plan. No empty days, no guesswork.",
  },
  {
    icon: "⏱️",
    title: "Per-Topic Duration",
    desc: "Some topics take 3 days, others just 1. Set exact duration per topic and the schedule adjusts automatically — heavier topics get more days.",
  },
  {
    icon: "🔥",
    title: "Backlog Pressure System",
    desc: "Miss a day? Those topics don't disappear. They pile onto your upcoming days, making tomorrow heavier. The pressure is real — and intentional.",
  },
  {
    icon: "⚡",
    title: "Hard Mode & Normal Mode",
    desc: "Normal mode spreads your backlog over 3 days. Hard mode dumps it all on tomorrow. Choose your poison — both create accountability.",
  },
  {
    icon: "⏳",
    title: "Deadline Integrity",
    desc: 'If you\'re falling behind pace, DueOrDie tells you directly: "At this rate, you will miss your deadline." That hits differently than a to-do app.',
  },
  {
    icon: "🔢",
    title: "Streak Tracking",
    desc: "Build a streak of consecutive completed days. Losing a streak after 10 days of consistency is one of the best motivators to not skip today.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Create a Goal",
    desc: "Name your goal, set a deadline, choose backlog mode.",
    icon: "🎯",
    color: "#FF4D4D",
    bg: "rgba(255,77,77,0.12)",
    border: "rgba(255,77,77,0.3)",
  },
  {
    step: "02",
    title: "Add Topics",
    desc: "Add topics with how many days each one needs.",
    icon: "📚",
    color: "#4D9FFF",
    bg: "rgba(77,159,255,0.12)",
    border: "rgba(77,159,255,0.3)",
  },
  {
    step: "03",
    title: "Get Scheduled",
    desc: "Topics distribute across every day automatically.",
    icon: "📆",
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.3)",
  },
  {
    step: "04",
    title: "Log Progress",
    desc: "Check off daily topics. Skipped ones become backlog.",
    icon: "✅",
    color: "#34D399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
  },
  {
    step: "05",
    title: "Feel Pressure",
    desc: "Watch your Panic Meter rise. That anxiety makes you act.",
    icon: "🔥",
    color: "#FB923C",
    bg: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.3)",
  },
];

export default function HomePage() {
  const { goals, loaded } = useGoals();
  const hasGoals = loaded && goals.length > 0;

  const totalBacklog = hasGoals
    ? goals.reduce((a, g) => a + computeStats(g).backlogTopics, 0)
    : 0;
  const avgProgress = hasGoals
    ? Math.round(
        goals.reduce((a, g) => a + computeStats(g).progress, 0) / goals.length,
      )
    : 0;

  return (
    <div style={{ background: "var(--bg)", overflowX: "hidden" }}>
      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "90px 24px 70px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Subtle radial glow behind headline */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,77,77,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,77,77,0.08)",
            border: "1px solid rgba(255,77,77,0.25)",
            borderRadius: 999,
            padding: "6px 14px",
            marginBottom: 28,
            fontSize: 12,
            fontFamily: "Space Mono, monospace",
            color: "var(--accent)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
              animation: "pulse 1.8s infinite",
            }}
          />
          Pressure-based study planner
        </div>

        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(38px, 6vw, 66px)",
            color: "var(--text)",
            letterSpacing: "-2px",
            lineHeight: 1.08,
            marginBottom: 26,
            maxWidth: 820,
            margin: "0 auto 26px",
          }}
        >
          Stop ignoring your
          <span style={{ color: "var(--accent)" }}> backlog.</span>
          <br />
          Start feeling the pressure.
        </h1>

        <p
          style={{
            fontSize: 17,
            color: "var(--text2)",
            maxWidth: 520,
            margin: "0 auto 40px",
            lineHeight: 1.75,
          }}
        >
          DueOrDie turns missed study days into visible, growing pressure — so
          you can't ignore what you owe yourself.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/goals/new"
            className="btn btn-primary"
            style={{ padding: "14px 30px", fontSize: 15, borderRadius: 10 }}
          >
            Create Your First Goal →
          </Link>
          <Link
            href="/goals"
            className="btn btn-secondary"
            style={{ padding: "14px 30px", fontSize: 15, borderRadius: 10 }}
          >
            {hasGoals ? `View My Goals (${goals.length})` : "See Goals Page"}
          </Link>
        </div>

        {hasGoals && (
          <div
            style={{
              display: "flex",
              gap: 32,
              justifyContent: "center",
              marginTop: 48,
              flexWrap: "wrap",
            }}
          >
            {[
              {
                label: "Active Goals",
                value: goals.length,
                color: "var(--blue)",
              },
              {
                label: "Avg Progress",
                value: `${avgProgress}%`,
                color: "var(--green)",
              },
              {
                label: "Total Backlog",
                value: totalBacklog,
                color: totalBacklog > 0 ? "var(--accent)" : "var(--green)",
              },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 30,
                    fontFamily: "Space Mono, monospace",
                    fontWeight: 700,
                    color: s.color,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── THE PROBLEM ── */}
      <section
        style={{
          background: "var(--bg2)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "64px 24px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: "var(--text)",
              marginBottom: 12,
              letterSpacing: "-0.5px",
            }}
          >
            Why normal planners fail you
          </h2>
          <p
            style={{
              color: "var(--text3)",
              fontSize: 14,
              maxWidth: 540,
              margin: "0 auto 44px",
              lineHeight: 1.7,
            }}
          >
            Todoist, Notion, and Excel all share one fatal flaw — missing a day
            has zero consequence. No pressure, no urgency.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 14,
            }}
          >
            {[
              {
                emoji: "😴",
                title: "Todoist",
                prob: "Tasks roll over silently. No one knows you missed day 5.",
              },
              {
                emoji: "📝",
                title: "Notion",
                prob: "Beautiful database, zero accountability. You can just uncheck.",
              },
              {
                emoji: "📊",
                title: "Excel/Sheets",
                prob: "You built the formula. You can also just delete the row.",
              },
              {
                emoji: "⚡",
                title: "DueOrDie",
                prob: "Missed days compound into backlog. Tomorrow gets heavier. You feel it.",
                highlight: true,
              },
            ].map((c) => (
              <div
                key={c.title}
                className="card"
                style={{
                  padding: "22px 18px",
                  borderColor: c.highlight
                    ? "rgba(255,77,77,0.5)"
                    : "var(--border)",
                  background: c.highlight
                    ? "rgba(255,77,77,0.07)"
                    : "var(--surface)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {c.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background:
                        "linear-gradient(90deg, transparent, var(--accent), transparent)",
                    }}
                  />
                )}
                <div style={{ fontSize: 28, marginBottom: 10 }}>{c.emoji}</div>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: c.highlight ? "var(--accent)" : "var(--text)",
                    marginBottom: 8,
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text3)",
                    lineHeight: 1.6,
                  }}
                >
                  {c.prob}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — GRAPHIC VERSION ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: "var(--text)",
              letterSpacing: "-0.5px",
              marginBottom: 10,
            }}
          >
            How it works
          </h2>
          <p style={{ color: "var(--text3)", fontSize: 14 }}>
            Five steps from zero to full pressure-mode.
          </p>
        </div>

        {/* Timeline graphic */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {howItWorks.map((h, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={h.step}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 1fr",
                  alignItems: "center",
                  minHeight: 130,
                  position: "relative",
                }}
              >
                {/* Left card (even steps) or spacer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "0 20px",
                  }}
                >
                  {isEven ? <StepCard h={h} align="right" /> : <div />}
                </div>

                {/* Center spine */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    height: "100%",
                  }}
                >
                  {/* Vertical line above node */}
                  {i > 0 && (
                    <div
                      style={{
                        flex: 1,
                        width: 2,
                        background: `linear-gradient(180deg, ${howItWorks[i - 1].color}60, ${h.color}60)`,
                        marginBottom: 0,
                      }}
                    />
                  )}
                  {i === 0 && <div style={{ flex: 1 }} />}

                  {/* Node */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: h.bg,
                      border: `2px solid ${h.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                      position: "relative",
                      zIndex: 2,
                      boxShadow: `0 0 20px ${h.color}25`,
                    }}
                  >
                    {h.icon}
                  </div>

                  {/* Vertical line below node */}
                  {i < howItWorks.length - 1 ? (
                    <div
                      style={{
                        flex: 1,
                        width: 2,
                        background: `linear-gradient(180deg, ${h.color}60, ${howItWorks[i + 1].color}60)`,
                      }}
                    />
                  ) : (
                    <div style={{ flex: 1 }} />
                  )}
                </div>

                {/* Right card (odd steps) or spacer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    padding: "0 20px",
                  }}
                >
                  {!isEven ? <StepCard h={h} align="left" /> : <div />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile fallback: linear list shown on small screens via CSS below */}
        <style>{`
          @media (max-width: 640px) {
            .hiw-grid { display: none !important; }
            .hiw-mobile { display: flex !important; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>

        {/* Mobile list */}
        <div
          className="hiw-mobile"
          style={{
            display: "none",
            flexDirection: "column",
            gap: 16,
            marginTop: 0,
          }}
        >
          {howItWorks.map((h) => (
            <div
              key={h.step}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: "18px",
                borderRadius: 14,
                background: h.bg,
                border: `1px solid ${h.border}`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: h.bg,
                  border: `2px solid ${h.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {h.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: 11,
                    color: h.color,
                    marginBottom: 4,
                    letterSpacing: "0.06em",
                  }}
                >
                  STEP {h.step}
                </div>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  {h.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text3)",
                    lineHeight: 1.6,
                  }}
                >
                  {h.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section
        style={{
          background: "var(--bg2)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: 28,
                color: "var(--text)",
                letterSpacing: "-0.5px",
                marginBottom: 10,
              }}
            >
              Everything you need to stay on track
            </h2>
            <p style={{ color: "var(--text3)", fontSize: 14 }}>
              Features designed for pressure, not comfort.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
              gap: 16,
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="card"
                style={{
                  padding: "24px",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,77,77,0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    marginBottom: 14,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--text)",
                    marginBottom: 8,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text3)",
                    lineHeight: 1.7,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "88px 24px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 500,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,77,77,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: 34,
            color: "var(--text)",
            letterSpacing: "-0.8px",
            marginBottom: 16,
            lineHeight: 1.15,
          }}
        >
          Your backlog is waiting.
          <br />
          <span style={{ color: "var(--accent)" }}>Start today.</span>
        </h2>
        <p
          style={{
            color: "var(--text3)",
            fontSize: 15,
            marginBottom: 36,
            lineHeight: 1.75,
          }}
        >
          Every day you delay is another day of backlog that will haunt you.
          DueOrDie makes sure you can't ignore it.
        </p>
        <Link
          href="/goals/new"
          className="btn btn-primary"
          style={{ padding: "16px 40px", fontSize: 16, borderRadius: 12 }}
        >
          Create Your Goal Now →
        </Link>
        {hasGoals && (
          <p style={{ marginTop: 18, fontSize: 13, color: "var(--text3)" }}>
            Or{" "}
            <Link
              href="/goals"
              style={{ color: "var(--blue)", textDecoration: "none" }}
            >
              view your {goals.length} active goal
              {goals.length !== 1 ? "s" : ""}
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}

/* ── Step Card sub-component ── */
function StepCard({ h, align }) {
  return (
    <div
      style={{
        maxWidth: 320,
        width: "100%",
        padding: "20px 22px",
        borderRadius: 16,
        background: h.bg,
        border: `1px solid ${h.border}`,
        textAlign: align === "right" ? "right" : "left",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: align === "right" ? "auto" : 0,
          right: align === "right" ? 0 : "auto",
          width: "50%",
          height: 2,
          background: `linear-gradient(${align === "right" ? "270deg" : "90deg"}, ${h.color}, transparent)`,
        }}
      />
      <div
        style={{
          fontFamily: "Space Mono, monospace",
          fontSize: 11,
          color: h.color,
          letterSpacing: "0.08em",
          marginBottom: 6,
          opacity: 0.8,
        }}
      >
        STEP {h.step}
      </div>
      <div
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          color: "var(--text)",
          marginBottom: 6,
        }}
      >
        {h.title}
      </div>
      <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.65 }}>
        {h.desc}
      </div>
    </div>
  );
}
