"use client";

import { useEffect } from "react";

export default function PanicMeter({
  level,
  compact = false,
  backlogCount = 0,
  onLevelChange = null,
}) {
  // Auto-reset panic level when backlogs are cleared
  useEffect(() => {
    if (backlogCount === 0 && level > 0 && onLevelChange) {
      onLevelChange(0);
    }
  }, [backlogCount, level, onLevelChange]);

  const getColor = () => {
    if (level >= 70) return "var(--accent)";
    if (level >= 40) return "var(--accent2)";
    if (level >= 20) return "var(--accent3)";
    return "var(--green)";
  };

  const getLabel = () => {
    if (level >= 50) return "Critical";
    if (level >= 10) return "Warning";
    return "On Track";
  };

  const color = getColor();

  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            background: "var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${level}%`,
              background: color,
              borderRadius: 3,
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 11,
            fontFamily: "Space Mono, monospace",
            color,
            minWidth: 20,
          }}
        >
          {level}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${level >= 70 ? color : "var(--border)"}`,
        borderRadius: 12,
        padding: "16px 20px",
        ...(level >= 70 ? { boxShadow: `0 0 20px rgba(255,77,77,0.12)` } : {}),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontFamily: "Space Mono, monospace",
            color: "var(--text3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Panic Level
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>
          {getLabel()}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            background: "var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${level}%`,
              background: `linear-gradient(90deg, var(--green), ${color})`,
              borderRadius: 4,
              transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 22,
            fontFamily: "Space Mono, monospace",
            fontWeight: 700,
            color,
            minWidth: 44,
            textAlign: "right",
          }}
        >
          {level}
        </span>
      </div>

      {level >= 40 && (
        <p style={{ marginTop: 10, fontSize: 12, color: "var(--text3)" }}>
          {level >= 70
            ? "Critical backlog detected. You must act today to stay on track."
            : "You have pending topics. Clear them before they pile up."}
        </p>
      )}

      {level === 0 && backlogCount === 0 && (
        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "var(--green)",
            fontWeight: 500,
          }}
        >
          ✓ All clear! No backlogs pending.
        </p>
      )}
    </div>
  );
}
