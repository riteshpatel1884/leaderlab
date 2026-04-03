"use client";

import { useApplications } from "../context/ApplicationsContext";
import WeeklyReport from "../Components/WeeklyReport";

export default function WeeklyPage() {
  const { applications } = useApplications();

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">Weekly Report</h1>
          <p className="page-subtitle">
            {applications.length} total application
            {applications.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
      </div>
      <WeeklyReport applications={applications} />
    </>
  );
}
