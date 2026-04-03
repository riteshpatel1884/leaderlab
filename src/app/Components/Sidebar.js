"use client";

import { useState } from "react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [moreOpen, setMoreOpen] = useState(false);

  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "applications", icon: "☰", label: "Applications" },
    { id: "analytics", icon: "◈", label: "Analytics" },
    { id: "weekly", icon: "◷", label: "Weekly Report" },
    { id: "resume", icon: "⬡", label: "Resume Matcher" },
  ];

  const bottomItems = navItems.slice(0, 4);
  const moreItems = navItems.slice(4);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">Statuscode</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div
          style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            Data stored locally
            <br />
            in your browser
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="mobile-bottom-nav">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className={`mobile-tab-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(item.id);
              setMoreOpen(false);
            }}
          >
            <span className="mobile-tab-icon">{item.icon}</span>
            <span className="mobile-tab-label">{item.label}</span>
          </button>
        ))}

        {/* More (⋯) button */}
        <button
          className={`mobile-tab-item ${moreItems.some((i) => i.id === activeTab) || moreOpen ? "active" : ""}`}
          onClick={() => setMoreOpen((prev) => !prev)}
        >
          <span className="mobile-tab-icon">•••</span>
          <span className="mobile-tab-label">More</span>
        </button>

        {/* More drawer */}
        {moreOpen && (
          <>
            <div className="more-backdrop" onClick={() => setMoreOpen(false)} />
            <div className="more-drawer">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  className={`more-drawer-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMoreOpen(false);
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </nav>
    </>
  );
}
