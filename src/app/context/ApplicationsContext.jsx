"use client";

import { createContext, useContext, useState, useEffect } from "react";

const Ctx = createContext(null);

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("jobApplications");
    if (saved) setApplications(JSON.parse(saved));
  }, []);

  const save = (apps) => {
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
    save([...applications, newJob]);
  };

  const updateApplication = (id, updates) => {
    const updated = applications.map((app) => {
      if (app.id !== id) return app;
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
    });
    save(updated);
  };

  const deleteApplication = (id) =>
    save(applications.filter((a) => a.id !== id));

  return (
    <Ctx.Provider
      value={{
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useApplications = () => useContext(Ctx);
