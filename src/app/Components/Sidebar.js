// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { useTheme } from "../../utils/themeProvider/Themeprovider"; // adjust path as needed

// const navItems = [
//   { id: "dashboard", icon: "⊞", label: "Dashboard" },
//   { id: "applications", icon: "☰", label: "Applications" },
//   { id: "analytics", icon: "◈", label: "Analytics" },
// ];

// // ── Theme toggle pill ────────────────────────────────────────────────────────
// function ThemeToggle() {
//   const { theme, toggleTheme } = useTheme();
//   const isDark = theme === "dark";
//   return (
//     <button
//       onClick={toggleTheme}
//       title={isDark ? "Switch to light mode" : "Switch to dark mode"}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 8,
//         width: "100%",
//         padding: "7px 10px",
//         borderRadius: 8,
//         border: "1px solid var(--border)",
//         background: "var(--bg-hover)",
//         cursor: "pointer",
//         transition: "all 0.15s",
//         color: "var(--text-secondary)",
//         fontFamily: "'DM Sans', sans-serif",
//         fontSize: 12,
//         fontWeight: 500,
//       }}
//       onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.color = "var(--text-primary)"; }}
//       onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
//     >
//       {/* Track */}
//       <span style={{ position: "relative", width: 32, height: 18, borderRadius: 9, background: isDark ? "var(--border-light)" : "var(--accent)", display: "inline-flex", alignItems: "center", flexShrink: 0, transition: "background 0.2s", padding: "0 2px" }}>
//         <span style={{ width: 14, height: 14, borderRadius: "50%", background: isDark ? "var(--text-muted)" : "#fff", transform: isDark ? "translateX(0)" : "translateX(14px)", transition: "transform 0.2s, background 0.2s", display: "block" }} />
//       </span>
//       <span style={{ flex: 1 }}>{isDark ? "Dark mode" : "Light mode"}</span>
//       <span style={{ fontSize: 14 }}>{isDark ? "🌙" : "☀️"}</span>
//     </button>
//   );
// }

// export default function Sidebar() {
//   const pathname = usePathname();
//   const { user, isLoaded } = useUser();

//   return (
//     <aside className="sidebar">
//       {/* Logo */}
//       <div className="sidebar-logo">
//         <div className="logo-mark">LeaderLab</div>
//       </div>

//       {/* Nav */}
//       <nav className="sidebar-nav">
//         <div className="nav-section-label">Navigation</div>
//         {navItems.map((item) => {
//           const href = `/${item.id}`;
//           const isActive = pathname === href || pathname.startsWith(`/${item.id}/`);
//           return (
//             <Link key={item.id} href={href} className={`nav-item ${isActive ? "active" : ""}`}>
//               <span className="nav-icon">{item.icon}</span>
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Bottom section */}
//       <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
//         {/* User row */}
//         {isLoaded && user ? (
//           <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
//             <UserButton afterSignOutUrl="/sign-in" />
//             <div style={{ flex: 1, overflow: "hidden" }}>
//               <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                 {user.fullName || user.username || "User"}
//               </p>
//               <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                 {user.emailAddresses[0]?.emailAddress}
//               </p>
//             </div>
//           </div>
//         ) : isLoaded && !user ? (
//           <Link href="/sign-in" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: "var(--accent-dim)", border: "1px solid var(--accent-border)", color: "var(--accent)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
//             <span style={{ fontSize: 14 }}>→</span> Sign in
//           </Link>
//         ) : null}

//         {/* Theme toggle */}
//         <ThemeToggle />
//       </div>
//     </aside>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "../../utils/themeProvider/Themeprovider"; // adjust path as needed

const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "applications", icon: "☰", label: "Applications" },
  { id: "analytics", icon: "◈", label: "Analytics" },
];

// ── Small inline spinner ─────────────────────────────────────────────────────
function Spinner({ size = 13 }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid var(--border-light)",
        borderTopColor: "var(--accent)",
        display: "inline-block",
        animation: "sidebarSpin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

// ── Center-of-screen loading overlay ─────────────────────────────────────────
function CenterLoader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-overlay, rgba(0,0,0,0.25))",
        backdropFilter: "blur(2px)",
        animation: "sidebarFadeIn 0.15s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "22px 28px",
          borderRadius: 14,
          background: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "3px solid var(--border-light)",
            borderTopColor: "var(--accent)",
            animation: "sidebarSpin 0.7s linear infinite",
          }}
        />
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Loading…</span>
      </div>
    </div>
  );
}

// ── Theme toggle pill ────────────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "7px 10px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--bg-hover)",
        cursor: "pointer",
        transition: "all 0.15s",
        color: "var(--text-secondary)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 500,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.color = "var(--text-primary)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
    >
      {/* Track */}
      <span style={{ position: "relative", width: 32, height: 18, borderRadius: 9, background: isDark ? "var(--border-light)" : "var(--accent)", display: "inline-flex", alignItems: "center", flexShrink: 0, transition: "background 0.2s", padding: "0 2px" }}>
        <span style={{ width: 14, height: 14, borderRadius: "50%", background: isDark ? "var(--text-muted)" : "#fff", transform: isDark ? "translateX(0)" : "translateX(14px)", transition: "transform 0.2s, background 0.2s", display: "block" }} />
      </span>
      <span style={{ flex: 1 }}>{isDark ? "Dark mode" : "Light mode"}</span>
      <span style={{ fontSize: 14 }}>{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [loadingId, setLoadingId] = useState(null);

  // Clear the loading state once navigation actually lands on the new route
  useEffect(() => {
    setLoadingId(null);
  }, [pathname]);

  return (
    <>
      <style>{`
        @keyframes sidebarSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes sidebarFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {loadingId && <CenterLoader />}

      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">LeaderLab</div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map((item) => {
            const href = `/${item.id}`;
            const isActive = pathname === href || pathname.startsWith(`/${item.id}/`);
            const isLoading = loadingId === item.id && !isActive;
            return (
              <Link
                key={item.id}
                href={href}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (!isActive) setLoadingId(item.id);
                }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span className="nav-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 16 }}>
                  {isLoading ? <Spinner /> : item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* User row */}
          {isLoaded && user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
              <UserButton afterSignOutUrl="/sign-in" />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.fullName || user.username || "User"}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          ) : isLoaded && !user ? (
            <Link href="/sign-in" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: "var(--accent-dim)", border: "1px solid var(--accent-border)", color: "var(--accent)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              <span style={{ fontSize: 14 }}>→</span> Sign in
            </Link>
          ) : null}

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}