"use client";

import { useState, useEffect } from "react";
import { useGoals } from "../hooks/useGoals";
import GoalCard from "../components/Goalcard/Goalcard";
import Link from "next/link";

export default function GoalsPage() {
  const { goals, loaded, deleteGoal } = useGoals();
  const [panicLevel, setPanicLevel] = useState(0);

  // Calculate total backlog count across all goals
  const totalBacklogCount = goals.reduce((sum, goal) => {
    return sum + (goal.backlog?.length || 0);
  }, 0);

  // Auto-reset panic level when all backlogs are cleared
  useEffect(() => {
    if (totalBacklogCount === 0 && panicLevel > 0) {
      setPanicLevel(0);
    }
  }, [totalBacklogCount, panicLevel]);

  if (!loaded) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: "var(--text)",
              letterSpacing: "-0.4px",
            }}
          >
            All Goals
          </h1>
          <p style={{ color: "var(--text3)", marginTop: 4, fontSize: 14 }}>
            {goals.length} active goal{goals.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/goals/new" className="btn btn-primary">
          + New Goal
        </Link>
      </div>

      {goals.length === 0 ? (
        <div
          className="card"
          style={{ padding: "60px 40px", textAlign: "center" }}
        >
          <p style={{ color: "var(--text3)" }}>
            No goals yet. Create one to get started.
          </p>
          <Link
            href="/goals/new"
            className="btn btn-primary"
            style={{ marginTop: 16, display: "inline-flex" }}
          >
            Create Goal
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: 20,
          }}
        >
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onDelete={deleteGoal}
              panicLevel={panicLevel}
              setPanicLevel={setPanicLevel}
              totalBacklogCount={totalBacklogCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
