// // "use client";

// // import {useApplications} from "../../context/ApplicationsContext"
// // import Analytics from "../../Components/AnalyticsTab";

// // export default function AnalyticsPage() {
// //   const { applications } = useApplications();

// //   return (
// //     <>
// //       <div className="topbar">
// //         <div>
// //           <h1 className="page-title">Analytics</h1>
// //           <p className="page-subtitle">
// //             {applications.length} total application
// //             {applications.length !== 1 ? "s" : ""} tracked
// //           </p>
// //         </div>
// //       </div>
// //       <Analytics applications={applications} />
// //     </>
// //   );
// // }



// "use client";

// import { useApplications } from "../../context/ApplicationsContext";
// import Analytics from "../../Components/analytics/AnalyticsTab";
// import { AnalyticsSkeleton } from "./Analyticsskeleton";

// export default function AnalyticsPage() {
//   const { applications, loading } = useApplications();

//   return (
//     <>
//       <div className="topbar">
//         <div>
//           <h1 className="page-title">Analytics</h1>
//           <p className="page-subtitle">
//             {applications.length} total application
//             {applications.length !== 1 ? "s" : ""} tracked
//           </p>
//         </div>
//       </div>
//       {loading ? <AnalyticsSkeleton /> : <Analytics applications={applications} />}
//     </>
//   );
// }


"use client";

import { useApplications } from "../../context/ApplicationsContext";
import Analytics from "../../Components/analytics/AnalyticsTab";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: "80px 0",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent, #6c63ff)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
        Loading analytics...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function AnalyticsPage() {
  const { applications, loading } = useApplications();

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
      {loading ? <Loader /> : <Analytics applications={applications} />}
    </>
  );
}