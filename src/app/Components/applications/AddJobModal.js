// "use client";

// import { useState, useCallback } from "react";

// const PLATFORMS = [
//   "LinkedIn", "Naukri", "Internshala", "Indeed", "Glassdoor",
//   "AngelList", "Unstop", "HackerEarth", "Company Website", "Referral", "Other",
// ];
// const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];
// const WORK_TYPES = ["Remote", "Onsite", "Hybrid"];
// const JOB_TYPES = ["Job", "Internship"];
// const APPLY_TYPES = ["Direct Apply", "Referral", "Cold Apply"];

// const REJECTION_REASONS = [
//   "No response",
//   "Resume shortlisted, rejected after",
//   "Failed aptitude/OA",
//   "Failed technical round",
//   "Failed HR round",
//   "Overqualified",
//   "Underqualified",
//   "Position filled internally",
//   "Role cancelled",
//   "Other",
// ];

// const DEFAULT_FORM = {
//   company: "",
//   role: "",
//   jobType: "Job",
//   platform: "",
//   dateApplied: new Date().toISOString().split("T")[0],
//   status: "Applied",
//   applyType: "Direct Apply",
//   workType: "Onsite",
//   followUpDate: "",
//   salary: "",
//   resumeVersion: "",
//   jobLink: "",
//   notes: "",
//   rejectionReason: "",
// };

// function buildFormFromData(data) {
//   return {
//     company: data.company || "",
//     role: data.role || "",
//     jobType: data.jobType || "Job",
//     platform: data.platform || "",
//     dateApplied: data.dateApplied || new Date().toISOString().split("T")[0],
//     status: data.status || "Applied",
//     applyType: data.applyType || "Direct Apply",
//     workType: data.workType || "Onsite",
//     followUpDate: data.followUpDate || "",
//     salary: data.salary || "",
//     resumeVersion: data.resumeVersion || "",
//     jobLink: data.jobLink || "",
//     notes: data.notes || "",
//     rejectionReason: data.rejectionReason || "",
//   };
// }

// function ToggleGroup({ options, value, onChange, small }) {
//   return (
//     <div className="toggle-group">
//       {options.map((t) => (
//         <button
//           key={t}
//           type="button"
//           className={`toggle-btn${value === t ? " active" : ""}${small ? " toggle-btn-sm" : ""}`}
//           onClick={() => onChange(t)}
//         >
//           {t}
//         </button>
//       ))}
//     </div>
//   );
// }

// export default function AddJobModal({ onClose, onSave, initialData }) {
//   const [activeSection, setActiveSection] = useState("essentials");
//   const [form, setForm] = useState(() =>
//     initialData ? buildFormFromData(initialData) : { ...DEFAULT_FORM }
//   );

//   const set = useCallback(
//     (key, val) => setForm((f) => ({ ...f, [key]: val })),
//     []
//   );

//   const isValid = form.company.trim() && form.role.trim();
//   const isRejected = form.status === "Rejected";

//   const handleSubmit = () => {
//     if (!isValid) return;
//     onSave(form);
//   };

//   return (
//     <div
//       className="modal-overlay"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="modal">
//         {/* Header */}
//         <div className="modal-header">
//           <div className="modal-title">
//             {initialData ? "Edit Application" : "Add Application"}
//           </div>
//           <button className="modal-close" onClick={onClose}>
//             &times;
//           </button>
//         </div>

//         {/* Section Tabs */}
//         <div
//           style={{
//             display: "flex",
//             gap: 0,
//             borderBottom: "1px solid var(--border)",
//             padding: "0 20px",
//           }}
//         >
//           {[
//             { key: "essentials", label: "Essentials", required: true },
//             { key: "details", label: "Details", required: false },
//           ].map(({ key, label, required }) => (
//             <button
//               key={key}
//               type="button"
//               onClick={() => setActiveSection(key)}
//               style={{
//                 background: "none",
//                 border: "none",
//                 borderBottom: `2px solid ${activeSection === key ? "var(--accent, #6c63ff)" : "transparent"}`,
//                 color: activeSection === key ? "var(--text-primary)" : "var(--text-muted)",
//                 fontFamily: "inherit",
//                 fontSize: 13,
//                 fontWeight: activeSection === key ? 600 : 400,
//                 padding: "10px 14px 9px",
//                 cursor: "pointer",
//                 transition: "all 0.15s",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//               }}
//             >
//               {label}
//               {!required && (
//                 <span
//                   style={{
//                     fontSize: 10,
//                     padding: "1px 6px",
//                     borderRadius: 20,
//                     background: "var(--bg-hover, rgba(255,255,255,0.06))",
//                     color: "var(--text-muted)",
//                     fontWeight: 400,
//                   }}
//                 >
//                   optional
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         <div className="modal-body">
//           {/* ── ESSENTIALS SECTION ── */}
//           {activeSection === "essentials" && (
//             <>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">
//                     Company <span style={{ color: "var(--red, #ef4444)" }}>*</span>
//                   </label>
//                   <input
//                     className="form-input"
//                     placeholder="e.g. Google"
//                     value={form.company}
//                     onChange={(e) => set("company", e.target.value)}
//                     autoFocus
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">
//                     Role <span style={{ color: "var(--red, #ef4444)" }}>*</span>
//                   </label>
//                   <input
//                     className="form-input"
//                     placeholder="e.g. Backend Intern"
//                     value={form.role}
//                     onChange={(e) => set("role", e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Type</label>
//                   <ToggleGroup
//                     options={JOB_TYPES}
//                     value={form.jobType}
//                     onChange={(v) => set("jobType", v)}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Status</label>
//                   <select
//                     className="form-select"
//                     value={form.status}
//                     onChange={(e) => set("status", e.target.value)}
//                   >
//                     {STATUSES.map((s) => (
//                       <option key={s} value={s}>{s}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {isRejected && (
//                 <div className="form-group">
//                   <label className="form-label">Rejection Reason</label>
//                   <select
//                     className="form-select"
//                     value={form.rejectionReason}
//                     onChange={(e) => set("rejectionReason", e.target.value)}
//                   >
//                     <option value="">Select reason (optional)</option>
//                     {REJECTION_REASONS.map((r) => (
//                       <option key={r} value={r}>{r}</option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Platform</label>
//                   <select
//                     className="form-select"
//                     value={form.platform}
//                     onChange={(e) => set("platform", e.target.value)}
//                   >
//                     <option value="">Select platform</option>
//                     {PLATFORMS.map((p) => (
//                       <option key={p} value={p}>{p}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Date Applied</label>
//                   <input
//                     className="form-input"
//                     type="date"
//                     value={form.dateApplied}
//                     onChange={(e) => set("dateApplied", e.target.value)}
//                   />
//                 </div>
//               </div>

//               {/* Hint */}
//               <div
//                 style={{
//                   fontSize: 11,
//                   color: "var(--text-muted)",
//                   padding: "8px 12px",
//                   borderRadius: 8,
//                   background: "var(--bg-hover, rgba(255,255,255,0.04))",
//                   border: "1px solid var(--border)",
//                   marginTop: 4,
//                 }}
//               >
//                 💡 Salary, work type, follow-up date, resume version and notes can be filled in the{" "}
//                 <button
//                   type="button"
//                   onClick={() => setActiveSection("details")}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     color: "var(--accent, #6c63ff)",
//                     cursor: "pointer",
//                     fontFamily: "inherit",
//                     fontSize: "inherit",
//                     padding: 0,
//                     fontWeight: 600,
//                   }}
//                 >
//                   Details tab
//                 </button>{" "}
//                 — you can update these later too.
//               </div>
//             </>
//           )}

//           {/* ── DETAILS SECTION ── */}
//           {activeSection === "details" && (
//             <>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Apply Method</label>
//                   <ToggleGroup
//                     options={APPLY_TYPES}
//                     value={form.applyType}
//                     onChange={(v) => set("applyType", v)}
//                     small
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Work Type</label>
//                   <ToggleGroup
//                     options={WORK_TYPES}
//                     value={form.workType}
//                     onChange={(v) => set("workType", v)}
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Salary / Stipend</label>
//                   <input
//                     className="form-input"
//                     placeholder="e.g. ₹8 LPA or ₹15,000/mo"
//                     value={form.salary}
//                     onChange={(e) => set("salary", e.target.value)}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Next Follow-up Date</label>
//                   <input
//                     className="form-input"
//                     type="date"
//                     value={form.followUpDate}
//                     onChange={(e) => set("followUpDate", e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Resume Version</label>
//                   <input
//                     className="form-input"
//                     placeholder="e.g. Resume v2, SDE-focused"
//                     value={form.resumeVersion}
//                     onChange={(e) => set("resumeVersion", e.target.value)}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Job Link</label>
//                   <input
//                     className="form-input"
//                     placeholder="https://..."
//                     value={form.jobLink}
//                     onChange={(e) => set("jobLink", e.target.value)}
//                   />
//                 </div>
//               </div>

//               {isRejected && (
//                 <div className="form-group">
//                   <label className="form-label">Rejection Reason</label>
//                   <select
//                     className="form-select"
//                     value={form.rejectionReason}
//                     onChange={(e) => set("rejectionReason", e.target.value)}
//                   >
//                     <option value="">Select reason (optional)</option>
//                     {REJECTION_REASONS.map((r) => (
//                       <option key={r} value={r}>{r}</option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <div className="form-group" style={{ marginTop: 4 }}>
//                 <label className="form-label">Notes</label>
//                 <textarea
//                   className="form-textarea"
//                   placeholder="Interview rounds, CTC, hiring manager name..."
//                   value={form.notes}
//                   onChange={(e) => set("notes", e.target.value)}
//                 />
//               </div>
//             </>
//           )}

//           {/* Footer */}
//           <div
//             style={{
//               display: "flex",
//               gap: 10,
//               justifyContent: "flex-end",
//               marginTop: 16,
//               paddingTop: 12,
//               borderTop: "1px solid var(--border)",
//             }}
//           >
//             <button className="btn-ghost" onClick={onClose}>
//               Cancel
//             </button>
//             {activeSection === "essentials" && !initialData && (
//               <button
//                 className="btn-ghost"
//                 disabled={!isValid}
//                 style={{ opacity: isValid ? 1 : 0.5 }}
//                 onClick={() => { if (!isValid) return; setActiveSection("details"); }}
//               >
//                 Add Details →
//               </button>
//             )}
//             <button
//               className="btn-primary"
//               onClick={handleSubmit}
//               disabled={!isValid}
//               style={{ opacity: isValid ? 1 : 0.5 }}
//             >
//               {initialData ? "Save Changes" : "Add Application"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useCallback } from "react";

const PLATFORMS = [
  "LinkedIn", "Naukri", "Internshala", "Indeed", "Glassdoor",
  "AngelList", "Unstop", "HackerEarth", "Company Website", "Referral", "Other",
];
const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];
const WORK_TYPES = ["Remote", "Onsite", "Hybrid"];
const JOB_TYPES = ["Job", "Internship"];
const APPLY_TYPES = ["Direct Apply", "Referral", "Cold Apply"];

const REJECTION_REASONS = [
  "No response / Ghosted",
  "Resume rejected (ATS / Screening)",
  "Resume shortlisted, rejected after screening call",
  "Failed aptitude / OA",
  "Failed coding assessment",
  "Failed technical interview",
  "Failed system design interview",
  "Failed HR / Behavioral interview",
  "Better candidate selected",
  "Experience mismatch",
  "Skills mismatch",
  "Overqualified",
  "Underqualified",
  "Salary expectation mismatch",
  "Location / Relocation issue",
  "Work authorization / Visa issue",
  "Position filled internally",
  "Hiring freeze",
  "Role cancelled / Closed",
  "Candidate withdrew",
  "Offer declined",
  "Other",
];

const DEFAULT_FORM = {
  company: "",
  role: "",
  jobType: "Job",
  platform: "",
  dateApplied: new Date().toISOString().split("T")[0],
  status: "Applied",
  applyType: "Direct Apply",
  workType: "Onsite",
  followUpDate: "",
  salary: "",
  resumeVersion: "",
  jobLink: "",
  notes: "",
  rejectionReason: "",
};

function buildFormFromData(data) {
  return {
    company: data.company || "",
    role: data.role || "",
    jobType: data.jobType || "Job",
    platform: data.platform || "",
    dateApplied: data.dateApplied || new Date().toISOString().split("T")[0],
    status: data.status || "Applied",
    applyType: data.applyType || "Direct Apply",
    workType: data.workType || "Onsite",
    followUpDate: data.followUpDate || "",
    salary: data.salary || "",
    resumeVersion: data.resumeVersion || "",
    jobLink: data.jobLink || "",
    notes: data.notes || "",
    rejectionReason: data.rejectionReason || "",
  };
}

function ToggleGroup({ options, value, onChange, small }) {
  return (
    <div className="toggle-group">
      {options.map((t) => (
        <button
          key={t}
          type="button"
          className={`toggle-btn${value === t ? " active" : ""}${small ? " toggle-btn-sm" : ""}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function AddJobModal({ onClose, onSave, initialData }) {
  const [activeSection, setActiveSection] = useState("essentials");
  const [form, setForm] = useState(() =>
    initialData ? buildFormFromData(initialData) : { ...DEFAULT_FORM }
  );

  const set = useCallback(
    (key, val) => setForm((f) => ({ ...f, [key]: val })),
    []
  );

  const isValid = form.company.trim() && form.role.trim();
  const isRejected = form.status === "Rejected";

  const handleSubmit = () => {
    if (!isValid) return;
    onSave(form);
  };

  return (
    <>
      {/* Scoped styles: keep the modal clear of the app's fixed mobile
          bottom nav (which sits on top of everything at a fixed height,
          separate from the browser's own chrome). */}
      <style>{`
        .add-job-modal-overlay {
          padding-bottom: 0px;
        }
        .add-job-modal {
          max-height: min(88dvh, 720px);
        }
        @media (max-width: 768px) {
          .add-job-modal-overlay {
            padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));
          }
          .add-job-modal {
            max-height: calc(100dvh - 64px - env(safe-area-inset-bottom, 0px) - 24px);
          }
        }
      `}</style>
      <div
        className="modal-overlay add-job-modal-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          // Use dvh so mobile browser chrome (address bar / bottom nav) is
          // accounted for, and make sure the overlay itself doesn't scroll.
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
      <div
        className="modal add-job-modal"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "min(560px, 94vw)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <div className="modal-title">
            {initialData ? "Edit Application" : "Add Application"}
          </div>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Section Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid var(--border)",
            padding: "0 20px",
            flexShrink: 0,
          }}
        >
          {[
            { key: "essentials", label: "Essentials", required: true },
            { key: "details", label: "Details", required: false },
          ].map(({ key, label, required }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeSection === key ? "var(--accent, #6c63ff)" : "transparent"}`,
                color: activeSection === key ? "var(--text-primary)" : "var(--text-muted)",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: activeSection === key ? 600 : 400,
                padding: "10px 14px 9px",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {label}
              {!required && (
                <span
                  style={{
                    fontSize: 10,
                    padding: "1px 6px",
                    borderRadius: 20,
                    background: "var(--bg-hover, rgba(255,255,255,0.06))",
                    color: "var(--text-muted)",
                    fontWeight: 400,
                  }}
                >
                  optional
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Scrollable body — only this area scrolls, footer stays pinned */}
        <div
          className="modal-body"
          style={{
            flex: "1 1 auto",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            minHeight: 0,
          }}
        >
          {/* ── ESSENTIALS SECTION ── */}
          {activeSection === "essentials" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Company <span style={{ color: "var(--red, #ef4444)" }}>*</span>
                  </label>
                  <input
                    className="form-input"
                    placeholder="e.g. Google"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Role <span style={{ color: "var(--red, #ef4444)" }}>*</span>
                  </label>
                  <input
                    className="form-input"
                    placeholder="e.g. Backend Intern"
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <ToggleGroup
                    options={JOB_TYPES}
                    value={form.jobType}
                    onChange={(v) => set("jobType", v)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) => set("status", e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isRejected && (
                <div className="form-group">
                  <label className="form-label">Rejection Reason</label>
                  <select
                    className="form-select"
                    value={form.rejectionReason}
                    onChange={(e) => set("rejectionReason", e.target.value)}
                  >
                    <option value="">Select reason (optional)</option>
                    {REJECTION_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Platform</label>
                  <select
                    className="form-select"
                    value={form.platform}
                    onChange={(e) => set("platform", e.target.value)}
                  >
                    <option value="">Select platform</option>
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date Applied</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.dateApplied}
                    onChange={(e) => set("dateApplied", e.target.value)}
                  />
                </div>
              </div>

              {/* Hint */}
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "var(--bg-hover, rgba(255,255,255,0.04))",
                  border: "1px solid var(--border)",
                  marginTop: 4,
                }}
              >
                💡 Salary, work type, follow-up date, resume version and notes can be filled in the{" "}
                <button
                  type="button"
                  onClick={() => setActiveSection("details")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent, #6c63ff)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    padding: 0,
                    fontWeight: 600,
                  }}
                >
                  Details tab
                </button>{" "}
                — you can update these later too.
              </div>
            </>
          )}

          {/* ── DETAILS SECTION ── */}
          {activeSection === "details" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Apply Method</label>
                  <ToggleGroup
                    options={APPLY_TYPES}
                    value={form.applyType}
                    onChange={(v) => set("applyType", v)}
                    small
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Work Type</label>
                  <ToggleGroup
                    options={WORK_TYPES}
                    value={form.workType}
                    onChange={(v) => set("workType", v)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Salary / Stipend</label>
                  <input
                    className="form-input"
                    placeholder="e.g. ₹8 LPA or ₹15,000/mo"
                    value={form.salary}
                    onChange={(e) => set("salary", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Next Follow-up Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.followUpDate}
                    onChange={(e) => set("followUpDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Resume Version</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Resume v2, SDE-focused"
                    value={form.resumeVersion}
                    onChange={(e) => set("resumeVersion", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Link</label>
                  <input
                    className="form-input"
                    placeholder="https://..."
                    value={form.jobLink}
                    onChange={(e) => set("jobLink", e.target.value)}
                  />
                </div>
              </div>

              {isRejected && (
                <div className="form-group">
                  <label className="form-label">Rejection Reason</label>
                  <select
                    className="form-select"
                    value={form.rejectionReason}
                    onChange={(e) => set("rejectionReason", e.target.value)}
                  >
                    <option value="">Select reason (optional)</option>
                    {REJECTION_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group" style={{ marginTop: 4 }}>
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  placeholder="Interview rounds, CTC, hiring manager name..."
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer — pinned to the bottom of the modal, always visible,
            with safe-area padding so mobile OS/browser nav bars never
            cover the buttons. */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            padding: "12px 20px calc(12px + env(safe-area-inset-bottom, 0px))",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!isValid}
            style={{ opacity: isValid ? 1 : 0.5 }}
          >
            {initialData ? "Save Changes" : "Add Application"}
          </button>
        </div>
      </div>
      </div>
    </>
  );
}