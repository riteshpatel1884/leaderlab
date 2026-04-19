"use client";

import { useMemo } from "react";

function getWeekStart(offset = 0) {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + offset * 7;
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default function WeeklyReport({ applications }) {
  const report = useMemo(() => {
    const thisWeekStart = getWeekStart(0);
    const lastWeekStart = getWeekStart(-1);
    const lastWeekEnd = new Date(thisWeekStart);

    const filterByWeek = (start, end) =>
      applications.filter((app) => {
        const d = new Date(app.createdAt);
        return d >= start && d < end;
      });

    const nextWeekStart = new Date(thisWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    const thisWeek = filterByWeek(thisWeekStart, nextWeekStart);
    const lastWeek = filterByWeek(lastWeekStart, lastWeekEnd);

    const summarize = (apps) => ({
      total: apps.length,
      interviews: apps.filter((a) => a.status === "Interview").length,
      offers: apps.filter((a) => a.status === "Offer").length,
      rejected: apps.filter((a) => a.status === "Rejected").length,
      applied: apps.filter((a) => a.status === "Applied").length,
      rate:
        apps.length > 0
          ? (
              ((apps.filter((a) => a.status === "Interview").length +
                apps.filter((a) => a.status === "Offer").length) /
                apps.length) *
              100
            ).toFixed(1)
          : "0.0",
    });

    // Build past 8 weeks
    const weeklyHistory = [];
    for (let i = 7; i >= 0; i--) {
      const start = getWeekStart(-i);
      const end = getWeekStart(-i + 1);
      const apps = filterByWeek(start, end);
      weeklyHistory.push({
        label: start.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
        ...summarize(apps),
      });
    }

    return {
      thisWeek: summarize(thisWeek),
      lastWeek: summarize(lastWeek),
      thisWeekApps: thisWeek,
      weeklyHistory,
      thisWeekStart,
    };
  }, [applications]);

  const maxWeekly = Math.max(...report.weeklyHistory.map((w) => w.total), 1);

  const delta = report.thisWeek.total - report.lastWeek.total;

  return (
    <div>
    
      <div className="insight-box" style={{ marginBottom: 20 }}>
        This week you submitted {" "}
        <strong>
          {report.thisWeek.total} application
          {report.thisWeek.total !== 1 ? "s" : ""}
        </strong>
        {report.thisWeek.interviews > 0 && (
          <>
            , got{" "}
            <strong>
              {report.thisWeek.interviews} interview
              {report.thisWeek.interviews !== 1 ? "s" : ""}
            </strong>
          </>
        )}
        {report.thisWeek.offers > 0 && (
          <>
            , and received{" "}
            <strong>
              {report.thisWeek.offers} offer
              {report.thisWeek.offers !== 1 ? "s" : ""}
            </strong>
          </>
        )}
        .{" "}
        {delta > 0 ? (
          <>
            <strong style={{ color: "var(--green)" }}>+{delta} more</strong>{" "}
            than last week.
          </>
        ) : delta < 0 ? (
          <>
            <strong style={{ color: "var(--red)" }}>{delta} fewer</strong> than
            last week.
          </>
        ) : (
          <>Same as last week.</>
        )}
      </div>

      {/* This week vs last week */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div className="card">
          <div className="card-title">This Week</div>
          <div
            style={{
              fontSize: 28,
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              color: "var(--accent)",
              marginBottom: 12,
            }}
          >
            {report.thisWeek.total} apps
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 13,
            }}
          >
            <WeekStat
              label="Interviews"
              val={report.thisWeek.interviews}
              color="var(--yellow)"
            />
            <WeekStat
              label="Offers"
              val={report.thisWeek.offers}
              color="var(--green)"
            />
            <WeekStat
              label="Rejected"
              val={report.thisWeek.rejected}
              color="var(--red)"
            />
            <WeekStat
              label="Awaiting"
              val={report.thisWeek.applied}
              color="var(--text-muted)"
            />
          </div>
          {report.thisWeek.total > 0 && (
            <div
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: "1px solid var(--border)",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              Response rate:{" "}
              <strong style={{ color: "var(--text-secondary)" }}>
                {report.thisWeek.rate}%
              </strong>
            </div>
          )}
        </div>
        <div className="card">
          <div className="card-title">Last Week</div>
          <div
            style={{
              fontSize: 28,
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              color: "var(--text-secondary)",
              marginBottom: 12,
            }}
          >
            {report.lastWeek.total} apps
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 13,
            }}
          >
            <WeekStat
              label="Interviews"
              val={report.lastWeek.interviews}
              color="var(--yellow)"
            />
            <WeekStat
              label="Offers"
              val={report.lastWeek.offers}
              color="var(--green)"
            />
            <WeekStat
              label="Rejected"
              val={report.lastWeek.rejected}
              color="var(--red)"
            />
            <WeekStat
              label="Awaiting"
              val={report.lastWeek.applied}
              color="var(--text-muted)"
            />
          </div>
          {report.lastWeek.total > 0 && (
            <div
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: "1px solid var(--border)",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              Response rate:{" "}
              <strong style={{ color: "var(--text-secondary)" }}>
                {report.lastWeek.rate}%
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* 8-week chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">8-Week Application Volume</div>
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "flex-end",
            height: 100,
          }}
        >
          {report.weeklyHistory.map((week, i) => {
            const isThisWeek = i === report.weeklyHistory.length - 1;
            const heightPct = (week.total / maxWeekly) * 100;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {week.total > 0 && (
                  <div style={{ fontSize: 9, color: "var(--text-muted)" }}>
                    {week.total}
                  </div>
                )}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    height: 70,
                  }}
                >
                  <div
                    style={{
                      width: "65%",
                      height: `${Math.max(heightPct, week.total > 0 ? 5 : 0)}%`,
                      background: isThisWeek
                        ? "var(--accent)"
                        : "var(--border-light)",
                      borderRadius: 3,
                      minHeight: week.total > 0 ? 4 : 0,
                      transition: "height 0.3s",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: isThisWeek ? "var(--accent)" : "var(--text-muted)",
                    textAlign: "center",
                  }}
                >
                  {week.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* This week's apps list */}
      {report.thisWeekApps.length > 0 && (
        <div className="card">
          <div className="card-title">Applications This Week</div>
          <div className="table-wrapper" style={{ border: "none" }}>
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Platform</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {report.thisWeekApps.map((app) => (
                  <tr key={app.id}>
                    <td className="company-cell">{app.company}</td>
                    <td>{app.role}</td>
                    <td>{app.platform || "—"}</td>
                    <td>
                      <span
                        className={`badge badge-${app.status.toLowerCase()}`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function WeekStat({ label, val, color }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span
        style={{
          fontWeight: 600,
          color: val > 0 ? color : "var(--text-muted)",
        }}
      >
        {val}
      </span>
    </div>
  );
}
