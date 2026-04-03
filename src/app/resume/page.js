"use client";

import ResumeMatcher from "../Components/ResumeMatcher";

export default function ResumePage() {
  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">Resume Matcher</h1>
          <p className="page-subtitle">Match your resume to job descriptions</p>
        </div>
      </div>
      <ResumeMatcher />
    </>
  );
}
