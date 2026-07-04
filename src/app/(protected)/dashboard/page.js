// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useApplications } from "../../context/ApplicationsContext";
// import Dashboard from "../../Components/dashboard/Dashboard";
// import AddJobModal from "../../Components/applications/AddJobModal";
// import DashboardSkeleton from "./Dashboardskeleton";

// export default function DashboardPage() {
//   const { applications, addApplication, updateApplication, loading } = useApplications();
//   const [showModal, setShowModal] = useState(false);
//   const router = useRouter();

//   return (
//     <>
//       <div className="topbar">
//         <div>
//           <h1 className="page-title">Dashboard</h1>
//           <p className="page-subtitle">
//             {applications.length} total application
//             {applications.length !== 1 ? "s" : ""} tracked
//           </p>
//         </div>
//         <button className="btn-primary" onClick={() => setShowModal(true)}>
//           <span>+</span> Add Application
//         </button>
//       </div>

//       {loading ? (
//         <DashboardSkeleton />
//       ) : (
//         <Dashboard
//           applications={applications}
//           onAddClick={() => setShowModal(true)}
//           onUpdateStatus={updateApplication}
//           setActiveTab={(tab) => router.push(`/${tab}`)}
//         />
//       )}

//       {showModal && (
//         <AddJobModal
//           onClose={() => setShowModal(false)}
//           onSave={(job) => {
//             addApplication(job);
//             setShowModal(false);
//           }}
//         />
//       )}
//     </>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApplications } from "../../context/ApplicationsContext";
import Dashboard from "../../Components/dashboard/Dashboard";
import AddJobModal from "../../Components/applications/AddJobModal";

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
        Loading dashboard...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  const { applications, addApplication, updateApplication, loading } = useApplications();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {applications.length} total application
            {applications.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <span>+</span> Add Application
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Dashboard
          applications={applications}
          onAddClick={() => setShowModal(true)}
          onUpdateStatus={updateApplication}
          setActiveTab={(tab) => router.push(`/${tab}`)}
        />
      )}

      {showModal && (
        <AddJobModal
          onClose={() => setShowModal(false)}
          onSave={(job) => {
            addApplication(job);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}