// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { useTheme } from "../../utils/themeProvider/Themeprovider"; // adjust path as needed

// const navItems = [
//   { id: "dashboard", icon: "⊞", label: "Dashboard" },
//   { id: "applications", icon: "☰", label: "Applications" },
//   { id: "analytics", icon: "◈", label: "Analytics" },
// ];

// const bottomItems = navItems.slice(0, 3);
// const moreItems = navItems.slice(3);

// // ── Inline theme toggle row for the More drawer ──────────────────────────────
// function DrawerThemeToggle() {
//   const { theme, toggleTheme } = useTheme();
//   const isDark = theme === "dark";
//   return (
//     <button
//       onClick={toggleTheme}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         width: "100%",
//         padding: "10px 16px",
//         background: "none",
//         border: "none",
//         borderTop: "1px solid var(--border)",
//         cursor: "pointer",
//         color: "var(--text-secondary)",
//         fontFamily: "'DM Sans', sans-serif",
//         fontSize: 13,
//         fontWeight: 500,
//         transition: "background 0.15s",
//       }}
//       onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
//       onMouseLeave={e => e.currentTarget.style.background = "none"}
//     >
//       <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>{isDark ? "🌙" : "☀️"}</span>
//       <span style={{ flex: 1, textAlign: "left" }}>{isDark ? "Dark mode" : "Light mode"}</span>
//       {/* Toggle track */}
//       <span style={{ position: "relative", width: 30, height: 17, borderRadius: 9, background: isDark ? "var(--border-light)" : "var(--accent)", display: "inline-flex", alignItems: "center", flexShrink: 0, transition: "background 0.2s", padding: "0 2px" }}>
//         <span style={{ width: 13, height: 13, borderRadius: "50%", background: isDark ? "var(--text-muted)" : "#fff", transform: isDark ? "translateX(0)" : "translateX(13px)", transition: "transform 0.2s, background 0.2s", display: "block" }} />
//       </span>
//     </button>
//   );
// }

// export default function BottomNav() {
//   const pathname = usePathname();
//   const [moreOpen, setMoreOpen] = useState(false);
//   const { user, isLoaded } = useUser();

//   return (
//     <nav className="mobile-bottom-nav">
//       {bottomItems.map((item) => {
//         const href = `/${item.id}`;
//         const isActive = pathname === href;
//         return (
//           <Link
//             key={item.id}
//             href={href}
//             className={`mobile-tab-item ${isActive ? "active" : ""}`}
//             onClick={() => setMoreOpen(false)}
//           >
//             <span className="mobile-tab-icon">{item.icon}</span>
//             <span className="mobile-tab-label">{item.label}</span>
//           </Link>
//         );
//       })}

//       {/* More button */}
//       <button
//         className={`mobile-tab-item ${moreItems.some(i => `/${i.id}` === pathname) || moreOpen ? "active" : ""}`}
//         onClick={() => setMoreOpen(p => !p)}
//       >
//         <span className="mobile-tab-icon">&bull;&bull;&bull;</span>
//         <span className="mobile-tab-label">More</span>
//       </button>

//       {/* More drawer */}
//       {moreOpen && (
//         <>
//           <div className="more-backdrop" onClick={() => setMoreOpen(false)} />
//           <div className="more-drawer">
//             {/* User section */}
//             {isLoaded && user ? (
//               <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px 14px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
//                 <UserButton afterSignOutUrl="/sign-in" />
//                 <div style={{ overflow: "hidden", flex: 1 }}>
//                   <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                     {user.fullName || user.username || "User"}
//                   </p>
//                   <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                     {user.emailAddresses[0]?.emailAddress}
//                   </p>
//                 </div>
//               </div>
//             ) : isLoaded && !user ? (
//               <div style={{ padding: "12px 16px 14px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
//                 <Link href="/sign-in" onClick={() => setMoreOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
//                   <span>&rarr;</span> Sign in to your account
//                 </Link>
//               </div>
//             ) : null}

//             {moreItems.map((item) => {
//               const href = `/${item.id}`;
//               const isActive = pathname === href;
//               return (
//                 <Link key={item.id} href={href} className={`more-drawer-item ${isActive ? "active" : ""}`} onClick={() => setMoreOpen(false)}>
//                   <span className="nav-icon">{item.icon}</span>
//                   {item.label}
//                 </Link>
//               );
//             })}

//             {/* Theme toggle */}
//             <DrawerThemeToggle />
//           </div>
//         </>
//       )}
//     </nav>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "../../utils/themeProvider/Themeprovider"; // adjust path as needed

const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "applications", icon: "☰", label: "Applications" },
  { id: "analytics", icon: "◈", label: "Analytics" },
];

const bottomItems = navItems.slice(0, 3);
const moreItems = navItems.slice(3);

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
        animation: "bottomNavSpin 0.7s linear infinite",
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
        animation: "bottomNavFadeIn 0.15s ease",
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
            animation: "bottomNavSpin 0.7s linear infinite",
          }}
        />
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Loading…</span>
      </div>
    </div>
  );
}

// ── Inline theme toggle row for the More drawer ──────────────────────────────
function DrawerThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggleTheme}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "10px 16px",
        background: "none",
        border: "none",
        borderTop: "1px solid var(--border)",
        cursor: "pointer",
        color: "var(--text-secondary)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        transition: "background 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
      onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
      <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>{isDark ? "🌙" : "☀️"}</span>
      <span style={{ flex: 1, textAlign: "left" }}>{isDark ? "Dark mode" : "Light mode"}</span>
      {/* Toggle track */}
      <span style={{ position: "relative", width: 30, height: 17, borderRadius: 9, background: isDark ? "var(--border-light)" : "var(--accent)", display: "inline-flex", alignItems: "center", flexShrink: 0, transition: "background 0.2s", padding: "0 2px" }}>
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: isDark ? "var(--text-muted)" : "#fff", transform: isDark ? "translateX(0)" : "translateX(13px)", transition: "transform 0.2s, background 0.2s", display: "block" }} />
      </span>
    </button>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const { user, isLoaded } = useUser();

  // Clear the loading state once navigation actually lands on the new route
  useEffect(() => {
    setLoadingId(null);
  }, [pathname]);

  return (
    <>
      <style>{`
        @keyframes bottomNavSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes bottomNavFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {loadingId && <CenterLoader />}

      <nav className="mobile-bottom-nav">
        {bottomItems.map((item) => {
          const href = `/${item.id}`;
          const isActive = pathname === href;
          const isLoading = loadingId === item.id && !isActive;
          return (
            <Link
              key={item.id}
              href={href}
              className={`mobile-tab-item ${isActive ? "active" : ""}`}
              onClick={() => {
                setMoreOpen(false);
                if (!isActive) setLoadingId(item.id);
              }}
            >
              <span className="mobile-tab-icon" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {isLoading ? <Spinner /> : item.icon}
              </span>
              <span className="mobile-tab-label">{item.label}</span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          className={`mobile-tab-item ${moreItems.some(i => `/${i.id}` === pathname) || moreOpen ? "active" : ""}`}
          onClick={() => setMoreOpen(p => !p)}
        >
          <span className="mobile-tab-icon">&bull;&bull;&bull;</span>
          <span className="mobile-tab-label">More</span>
        </button>

        {/* More drawer */}
        {moreOpen && (
          <>
            <div className="more-backdrop" onClick={() => setMoreOpen(false)} />
            <div className="more-drawer">
              {/* User section */}
              {isLoaded && user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px 14px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                  <UserButton afterSignOutUrl="/sign-in" />
                  <div style={{ overflow: "hidden", flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {user.fullName || user.username || "User"}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </div>
              ) : isLoaded && !user ? (
                <div style={{ padding: "12px 16px 14px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                  <Link href="/sign-in" onClick={() => setMoreOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    <span>&rarr;</span> Sign in to your account
                  </Link>
                </div>
              ) : null}

              {moreItems.map((item) => {
                const href = `/${item.id}`;
                const isActive = pathname === href;
                const isLoading = loadingId === item.id && !isActive;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={`more-drawer-item ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setMoreOpen(false);
                      if (!isActive) setLoadingId(item.id);
                    }}
                  >
                    <span className="nav-icon" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16 }}>
                      {isLoading ? <Spinner /> : item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}

              {/* Theme toggle */}
              <DrawerThemeToggle />
            </div>
          </>
        )}
      </nav>
    </>
  );
}