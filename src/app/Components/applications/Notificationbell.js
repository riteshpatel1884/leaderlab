"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const TYPE_ICONS = {
  application_added: "✅",
  followup_reminder: "⚡",
  status_change:     "🔄",
  admin_message:     "📣",
};

const TYPE_COLORS = {
  application_added: "#22c55e",
  followup_reminder: "#eab308",
  status_change:     "#6c63ff",
  admin_message:     "#f472b6",
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.round((now - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen]                   = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [deletingId, setDeletingId]       = useState(null);
  const pollRef                           = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/applications/trackJob/notifications");
      if (!res.ok) return;
      const data = await res.json();
      // Sort newest first — no section grouping
      const sorted = (data.notifications || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sorted);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    pollRef.current = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(pollRef.current);
  }, [fetchNotifications]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const markAllRead = async () => {
    await fetch("/api/applications/trackJob/notifications", { method: "PATCH" });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markOneRead = async (id) => {
    await fetch(`/api/applications/trackJob/notifications/${id}`, { method: "PATCH" });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);

    try {
      const res = await fetch(`/api/applications/trackJob/notifications/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Delete failed:", res.status, body);
        // Still refetch so UI is accurate
        await fetchNotifications();
        return;
      }

      // Confirmed deleted on server — remove from local state
      setNotifications(prev => {
        const target = prev.find(n => n.id === id);
        if (target && !target.read) {
          setUnreadCount(c => Math.max(0, c - 1));
        }
        return prev.filter(n => n.id !== id);
      });
    } catch (err) {
      console.error("Delete error:", err);
      await fetchNotifications(); // resync on any error
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "relative",
          background: open ? "var(--bg-hover, rgba(255,255,255,0.08))" : "transparent",
          border: "1px solid var(--border, rgba(255,255,255,0.08))",
          borderRadius: 10,
          width: 38, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 16,
          transition: "all 0.15s",
          color: "var(--text-secondary)",
          flexShrink: 0,
        }}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 5, right: 5,
            minWidth: 16, height: 16, borderRadius: 8,
            background: "#ef4444", color: "#fff",
            fontSize: 9, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 3px", border: "2px solid var(--bg-main, #0f0f1a)", lineHeight: 1,
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 9998,
              background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
              animation: "notifFadeIn 0.18s ease",
            }}
          />

          {/* Modal */}
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(420px, 92vw)", maxHeight: "72vh",
            background: "var(--bg-card, #1a1a2e)",
            border: "1px solid var(--border, rgba(255,255,255,0.1))",
            borderRadius: 16,
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            zIndex: 9999, display: "flex", flexDirection: "column", overflow: "hidden",
            animation: "notifSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)",
          }}>

            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 18px 14px",
              borderBottom: "1px solid var(--border, rgba(255,255,255,0.07))",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20,
                    background: "rgba(239,68,68,0.15)", color: "#ef4444",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      background: "none", border: "none",
                      color: "var(--accent, #6c63ff)", fontSize: 11, fontWeight: 600,
                      cursor: "pointer", padding: "2px 6px", borderRadius: 6, fontFamily: "inherit",
                    }}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: "1px solid var(--border)",
                    background: "transparent", color: "var(--text-muted)",
                    fontSize: 15, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {notifications.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🔕</div>
                  No notifications yet
                  <div style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>
                    You'll see alerts here when you add applications or have follow-ups due.
                  </div>
                </div>
              ) : (
                notifications.map((n) => {
                  const color = TYPE_COLORS[n.type] || "#6c63ff";
                  const isDeleting = deletingId === n.id;

                  return (
                    <div
                      key={n.id}
                      onClick={() => !n.read && markOneRead(n.id)}
                      className="notif-row"
                      style={{
                        display: "flex", gap: 12, padding: "12px 14px 12px 16px",
                        borderBottom: "1px solid var(--border, rgba(255,255,255,0.05))",
                        background: n.read ? "transparent" : `${color}09`,
                        cursor: n.read ? "default" : "pointer",
                        transition: "background 0.12s, opacity 0.2s",
                        opacity: isDeleting ? 0.4 : 1,
                        alignItems: "flex-start",
                        position: "relative",
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: `${color}18`,
                        border: `1px solid ${color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16,
                      }}>
                        {TYPE_ICONS[n.type] || "🔔"}
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0, paddingRight: 28 }}>
                        <div style={{
                          fontSize: 12, fontWeight: n.read ? 500 : 700,
                          color: "var(--text-primary)", marginBottom: 2,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {n.title}
                        </div>
                        <div style={{
                          fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5,
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                          {n.body}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, opacity: 0.6 }}>
                          {timeAgo(n.createdAt)}
                        </div>
                      </div>

                      {/* Unread dot */}
                      {!n.read && (
                        <div style={{
                          width: 7, height: 7, borderRadius: "50%",
                          background: color, flexShrink: 0, marginTop: 6,
                        }} />
                      )}

                      {/* Delete button — revealed on row hover via CSS */}
                      <button
                        className="notif-delete-btn"
                        onClick={(e) => deleteNotification(e, n.id)}
                        disabled={isDeleting}
                        title="Dismiss notification"
                        style={{
                          position: "absolute", top: 10, right: 12,
                          width: 22, height: 22, borderRadius: "50%",
                          border: "1px solid var(--border, rgba(255,255,255,0.12))",
                          background: "var(--bg-card, #1a1a2e)",
                          color: "var(--text-muted)",
                          fontSize: 12, lineHeight: 1,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: isDeleting ? "not-allowed" : "pointer",
                          opacity: 0,
                          transition: "opacity 0.15s, background 0.1s, color 0.1s, border-color 0.1s",
                          fontFamily: "inherit",
                          padding: 0, zIndex: 2,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div style={{
                padding: "10px 16px",
                borderTop: "1px solid var(--border, rgba(255,255,255,0.06))",
                textAlign: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Showing last {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <style>{`
            @keyframes notifFadeIn  { from { opacity: 0 } to { opacity: 1 } }
            @keyframes notifSlideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)) } to { opacity: 1; transform: translate(-50%, -50%) } }

            .notif-row:hover { background: rgba(255,255,255,0.04) !important; }
            .notif-row:hover .notif-delete-btn { opacity: 1 !important; }
            .notif-delete-btn:hover {
              background: rgba(239,68,68,0.15) !important;
              color: #ef4444 !important;
              border-color: rgba(239,68,68,0.35) !important;
            }
          `}</style>
        </>
      )}
    </>
  );
}