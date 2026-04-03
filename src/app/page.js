"use client";

import { useState, useEffect } from "react";
import Dashboard from "./Components/Dashboard";
import ApplicationsTable from "./Components/ApplicationsTab";
import AddJobModal from "./Components/AddJobModal";
import Analytics from "./Components/AnalyticsTab";
import WeeklyReport from "./Components/WeeklyReport";
import ResumeMatcher from "./Components/ResumeMatcher";
import Sidebar from "./Components/Sidebar";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [applications, setApplications] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("jobApplications");
    if (saved) {
      setApplications(JSON.parse(saved));
    }
  }, []);

  const saveApplications = (apps) => {
    localStorage.setItem("jobApplications", JSON.stringify(apps));
    setApplications(apps);
  };

  const addApplication = (job) => {
    const newJob = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      statusHistory: [{ status: job.status, date: new Date().toISOString() }],
    };
    saveApplications([...applications, newJob]);
  };

  const updateApplication = (id, updates) => {
    const updated = applications.map((app) => {
      if (app.id === id) {
        const statusChanged = updates.status && updates.status !== app.status;
        return {
          ...app,
          ...updates,
          statusHistory: statusChanged
            ? [
                ...(app.statusHistory || []),
                { status: updates.status, date: new Date().toISOString() },
              ]
            : app.statusHistory,
        };
      }
      return app;
    });
    saveApplications(updated);
  };

  const deleteApplication = (id) => {
    saveApplications(applications.filter((app) => app.id !== id));
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <h1 className="page-title">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "applications" && "Applications"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "weekly" && "Weekly Report"}
              {activeTab === "resume" && "Resume Matcher"}
            </h1>
            <p className="page-subtitle">
              {applications.length} total application
              {applications.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setEditingJob(null);
              setShowAddModal(true);
            }}
          >
            <span>+</span> Add Application
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "dashboard" && (
            <Dashboard
              applications={applications}
              onAddClick={() => setShowAddModal(true)}
              onUpdateStatus={updateApplication}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "applications" && (
            <ApplicationsTable
              applications={applications}
              onUpdate={updateApplication}
              onDelete={deleteApplication}
              onEdit={(job) => {
                setEditingJob(job);
                setShowAddModal(true);
              }}
            />
          )}
          {activeTab === "analytics" && (
            <Analytics applications={applications} />
          )}
          {activeTab === "weekly" && (
            <WeeklyReport applications={applications} />
          )}
          {activeTab === "resume" && <ResumeMatcher />}
        </div>
      </main>

      {showAddModal && (
        <AddJobModal
          onClose={() => {
            setShowAddModal(false);
            setEditingJob(null);
          }}
          onSave={(job) => {
            if (editingJob) {
              updateApplication(editingJob.id, job);
            } else {
              addApplication(job);
            }
            setShowAddModal(false);
            setEditingJob(null);
          }}
          initialData={editingJob}
        />
      )}
    </div>
  );
}
