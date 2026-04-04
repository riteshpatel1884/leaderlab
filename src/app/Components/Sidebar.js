"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "applications", icon: "☰", label: "Applications" },
  { id: "analytics", icon: "◈", label: "Analytics" },
  { id: "weekly", icon: "◷", label: "Weekly Report" },
  { id: "resume", icon: "⬡", label: "Resume Matcher" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">LeaderLab</div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map((item) => {
          const href = `/${item.id}`;
          const isActive = pathname === href;
          return (
            <Link
              key={item.id}
              href={href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
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
