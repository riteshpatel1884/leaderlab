"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "applications", icon: "☰", label: "Applications" },
  { id: "analytics", icon: "◈", label: "Analytics" },
  { id: "weekly", icon: "◷", label: "Weekly Report" },
  { id: "resume", icon: "⬡", label: "Resume Matcher" },
];

const bottomItems = navItems.slice(0, 4);
const moreItems = navItems.slice(4);

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <nav className="mobile-bottom-nav">
      {bottomItems.map((item) => {
        const href = `/${item.id}`;
        const isActive = pathname === href;
        return (
          <Link
            key={item.id}
            href={href}
            className={`mobile-tab-item ${isActive ? "active" : ""}`}
            onClick={() => setMoreOpen(false)}
          >
            <span className="mobile-tab-icon">{item.icon}</span>
            <span className="mobile-tab-label">{item.label}</span>
          </Link>
        );
      })}

      {/* More button */}
      <button
        className={`mobile-tab-item ${moreItems.some((i) => `/${i.id}` === pathname) || moreOpen ? "active" : ""}`}
        onClick={() => setMoreOpen((p) => !p)}
      >
        <span className="mobile-tab-icon">•••</span>
        <span className="mobile-tab-label">More</span>
      </button>

      {/* More drawer */}
      {moreOpen && (
        <>
          <div className="more-backdrop" onClick={() => setMoreOpen(false)} />
          <div className="more-drawer">
            {moreItems.map((item) => {
              const href = `/${item.id}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={item.id}
                  href={href}
                  className={`more-drawer-item ${isActive ? "active" : ""}`}
                  onClick={() => setMoreOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </nav>
  );
}
