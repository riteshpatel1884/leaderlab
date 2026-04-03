"use client";

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "applications", icon: "☰", label: "Applications" },
    { id: "analytics", icon: "◈", label: "Analytics" },
    { id: "weekly", icon: "◷", label: "Weekly Report" },
    { id: "resume", icon: "⬡", label: "Resume Matcher" },
  ];

  return (
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
  );
}
