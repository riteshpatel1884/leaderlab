"use client";

import {useApplications} from "../../context/ApplicationsContext"
import Analytics from "../../Components/AnalyticsTab";

export default function AnalyticsPage() {
  const { applications } = useApplications();

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">
            {applications.length} total application
            {applications.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
      </div>
      <Analytics applications={applications} />
    </>
  );
}
