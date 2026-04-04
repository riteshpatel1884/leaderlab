"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "applications", icon: "☰", label: "Applications" },
  { id: "analytics", icon: "◈", label: "Analytics" },
  { id: "weekly", icon: "◷", label: "Weekly Report" },
  { id: "resume", icon: "⬡", label: "Resume Matcher" },
];

const CHANGELOG = [
  {
    version: "v1.2.0",
    date: "Coming Soon",
    tag: "next",
    changes: [
      {
        type: "upcoming",
        text: "User authentication — sign up & log in to your account securely",
      },
      {
        type: "upcoming",
        text: "Cloud database sync — your applications backed up and accessible from any device",
      },
      {
        type: "upcoming",
        text: "No more local storage limits — unlimited applications stored in the cloud",
      },
    ],
  },
  {
    version: "v1.1.0",
    date: "April 2025",
    tag: null,
    changes: [
      {
        type: "new",
        text: "Resume tab updated with only 2 limits per day.",
      },
      { type: "fix", text: "Minor bugs fixed" },
      {
        type: "improved",
        text: "Dashboard cards now show streak and active application count",
      },
    ],
  },
];

const TYPE_CONFIG = {
  new: {
    label: "New",
    color: "var(--green, #4ade80)",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.2)",
  },
  improved: {
    label: "Improved",
    color: "var(--accent, #818cf8)",
    bg: "rgba(129,140,248,0.08)",
    border: "rgba(129,140,248,0.2)",
  },
  fix: {
    label: "Fix",
    color: "var(--yellow, #facc15)",
    bg: "rgba(250,204,21,0.08)",
    border: "rgba(250,204,21,0.2)",
  },
  upcoming: {
    label: "Upcoming",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.07)",
    border: "rgba(244,114,182,0.2)",
  },
};

function ChangelogModal({ onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 999,
          animation: "fadeIn 0.18s ease",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(520px, 92vw)",
          maxHeight: "80vh",
          background: "var(--surface, #13141f)",
          border: "1px solid var(--border, rgba(255,255,255,0.08))",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--border, rgba(255,255,255,0.07))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 16,
                fontWeight: 800,
                color: "var(--text-primary, #f1f5f9)",
                letterSpacing: "-0.3px",
              }}
            >
              What's New
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted, #64748b)",
                marginTop: 2,
              }}
            >
              LeaderLab changelog
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              background: "transparent",
              color: "var(--text-muted, #64748b)",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "var(--surface-2, rgba(255,255,255,0.06))";
              e.currentTarget.style.color = "var(--text-primary, #f1f5f9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted, #64748b)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {CHANGELOG.map((release, i) => {
            const regularChanges = release.changes.filter(
              (c) => c.type !== "upcoming",
            );
            const upcomingChanges = release.changes.filter(
              (c) => c.type === "upcoming",
            );

            return (
              <div key={release.version}>
                {/* Version header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "var(--text-primary, #f1f5f9)",
                    }}
                  >
                    {release.version}
                  </span>

                  {release.tag === "next" && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: "rgba(244,114,182,0.12)",
                        color: "#f472b6",
                        border: "1px solid rgba(244,114,182,0.25)",
                      }}
                    >
                      Next
                    </span>
                  )}
                  {release.tag === "latest" && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: "rgba(129,140,248,0.15)",
                        color: "var(--accent, #818cf8)",
                        border:
                          "1px solid var(--accent-border, rgba(129,140,248,0.25))",
                      }}
                    >
                      Latest
                    </span>
                  )}
                  {release.tag === "initial" && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: "rgba(100,116,139,0.12)",
                        color: "var(--text-muted, #64748b)",
                        border: "1px solid rgba(100,116,139,0.2)",
                      }}
                    >
                      Initial
                    </span>
                  )}

                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: "var(--text-muted, #64748b)",
                    }}
                  >
                    {release.date}
                  </span>
                </div>

                {/* Regular changes */}
                {regularChanges.length > 0 && (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {regularChanges.map((c, j) => {
                      const cfg = TYPE_CONFIG[c.type];
                      return (
                        <div
                          key={j}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "9px 12px",
                            borderRadius: 8,
                            background:
                              "var(--surface-2, rgba(255,255,255,0.03))",
                            border:
                              "1px solid var(--border, rgba(255,255,255,0.05))",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.6px",
                              padding: "2px 6px",
                              borderRadius: 4,
                              background: cfg.bg,
                              color: cfg.color,
                              flexShrink: 0,
                              marginTop: 1,
                              border: `1px solid ${cfg.border}`,
                            }}
                          >
                            {cfg.label}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--text-secondary, #94a3b8)",
                              lineHeight: 1.6,
                            }}
                          >
                            {c.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upcoming features — visually separated */}
                {upcomingChanges.length > 0 && (
                  <div
                    style={{ marginTop: regularChanges.length > 0 ? 16 : 0 }}
                  >
                    {/* "Coming Soon" divider */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          height: 1,
                          flex: 1,
                          background:
                            "linear-gradient(to right, rgba(244,114,182,0.35), transparent)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          color: "#f472b6",
                          opacity: 0.75,
                        }}
                      >
                        ✦ Coming Soon
                      </span>
                      <div
                        style={{
                          height: 1,
                          flex: 1,
                          background:
                            "linear-gradient(to left, rgba(244,114,182,0.35), transparent)",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {upcomingChanges.map((c, j) => {
                        const cfg = TYPE_CONFIG.upcoming;
                        return (
                          <div
                            key={j}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              padding: "9px 12px",
                              borderRadius: 8,
                              background: "rgba(244,114,182,0.04)",
                              border: "1px dashed rgba(244,114,182,0.25)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.6px",
                                padding: "2px 6px",
                                borderRadius: 4,
                                background: cfg.bg,
                                color: cfg.color,
                                flexShrink: 0,
                                marginTop: 1,
                                border: `1px solid ${cfg.border}`,
                              }}
                            >
                              {cfg.label}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--text-secondary, #94a3b8)",
                                lineHeight: 1.6,
                                opacity: 0.75,
                                fontStyle: "italic",
                              }}
                            >
                              {c.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Divider between releases */}
                {i < CHANGELOG.length - 1 && (
                  <div
                    style={{
                      height: 1,
                      background: "var(--border, rgba(255,255,255,0.06))",
                      marginTop: 24,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [showChangelog, setShowChangelog] = useState(false);

  // Show the first shipped (non-"next") version in the badge
  const currentVersion =
    CHANGELOG.find((r) => r.tag !== "next")?.version ?? CHANGELOG[0].version;

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">LeaderLab</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map((item) => {
            const href = `/${item.id}`;
            const isActive = pathname === href;
            return (
              <Link
                key={item.id}
                href={href}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: 10,
            }}
          >
            Data stored locally
            <br />
            in your browser
          </div>

          {/* Version badge */}
          <button
            onClick={() => setShowChangelog(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--accent-dim, rgba(129,140,248,0.08))",
              border: "1px solid var(--accent-border, rgba(129,140,248,0.2))",
              borderRadius: 6,
              padding: "5px 10px",
              cursor: "pointer",
              width: "100%",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(129,140,248,0.15)";
              e.currentTarget.style.borderColor = "rgba(129,140,248,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "var(--accent-dim, rgba(129,140,248,0.08))";
              e.currentTarget.style.borderColor =
                "var(--accent-border, rgba(129,140,248,0.2))";
            }}
          >
            <span style={{ fontSize: 10, opacity: 0.5 }}>◈</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--accent, #818cf8)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {currentVersion}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 9,
                color: "var(--text-muted, #64748b)",
                fontStyle: "italic",
              }}
            >
              What's new →
            </span>
          </button>
        </div>
      </aside>

      {showChangelog && (
        <ChangelogModal onClose={() => setShowChangelog(false)} />
      )}
    </>
  );
}
