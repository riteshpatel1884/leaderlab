"use client";

import { useState, useEffect } from "react";

const PLATFORMS = [
  "LinkedIn",
  "Naukri",
  "Internshala",
  "Indeed",
  "Glassdoor",
  "AngelList",
  "Unstop",
  "HackerEarth",
  "Company Website",
  "Referral",
  "Other",
];
const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];
const WORK_TYPES = ["Remote", "Onsite", "Hybrid"];

export default function AddJobModal({ onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    company: "",
    role: "",
    platform: "",
    jobLink: "",
    dateApplied: new Date().toISOString().split("T")[0],
    status: "Applied",
    workType: "Onsite",
    notes: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        company: initialData.company || "",
        role: initialData.role || "",
        platform: initialData.platform || "",
        jobLink: initialData.jobLink || "",
        dateApplied:
          initialData.dateApplied || new Date().toISOString().split("T")[0],
        status: initialData.status || "Applied",
        workType: initialData.workType || "Onsite",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.company.trim() || !form.role.trim()) return;
    onSave(form);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            {initialData ? "Edit Application" : "Add Application"}
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input
                className="form-input"
                placeholder="e.g. Google"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
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
              <label className="form-label">Platform</label>
              <select
                className="form-select"
                value={form.platform}
                onChange={(e) => set("platform", e.target.value)}
              >
                <option value="">Select platform</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Work Type</label>
              <select
                className="form-select"
                value={form.workType}
                onChange={(e) => set("workType", e.target.value)}
              >
                {WORK_TYPES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date Applied</label>
              <input
                className="form-input"
                type="date"
                value={form.dateApplied}
                onChange={(e) => set("dateApplied", e.target.value)}
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
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Interview rounds, salary, recruiter name..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 4,
            }}
          >
            <button className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!form.company.trim() || !form.role.trim()}
              style={{
                opacity: !form.company.trim() || !form.role.trim() ? 0.5 : 1,
              }}
            >
              {initialData ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
