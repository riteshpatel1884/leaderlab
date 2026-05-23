"use client";

import { useState, useEffect, useRef } from "react";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET;

// ── Styles injected once ──────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gmail-red: #d93025;
    --gmail-blue: #1a73e8;
    --gmail-green: #34a853;
    --gmail-yellow: #fbbc04;
    --surface: #ffffff;
    --surface-2: #f6f8fc;
    --surface-3: #e8eaed;
    --on-surface: #202124;
    --on-surface-2: #5f6368;
    --on-surface-3: #80868b;
    --border: #e0e0e0;
    --border-focus: #1a73e8;
    --shadow-1: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
    --shadow-2: 0 1px 3px rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15);
    --shadow-3: 0 2px 6px 2px rgba(60,64,67,0.15), 0 1px 2px rgba(60,64,67,0.3);
    --radius: 8px;
    --radius-lg: 16px;
    --font: 'Google Sans', 'Roboto', sans-serif;
  }

  body { font-family: var(--font); background: var(--surface-2); color: var(--on-surface); }

  .gmail-app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: var(--surface-2);
  }

  /* ── Top bar ── */
  .topbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
    height: 64px;
  }
  .topbar-logo {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 22px;
    font-weight: 400;
    color: var(--on-surface-2);
    white-space: nowrap;
    margin-right: 8px;
  }
  .topbar-logo strong { color: var(--on-surface); font-weight: 500; }
  .topbar-logo .badge-admin {
    font-size: 10px;
    font-weight: 500;
    background: #fce8e6;
    color: var(--gmail-red);
    border: 1px solid #f5c6c2;
    border-radius: 4px;
    padding: 1px 6px;
    margin-left: 6px;
    letter-spacing: 0.3px;
  }
  .topbar-spacer { flex: 1; }
  .topbar-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--gmail-blue);
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  /* ── Layout ── */
  .main-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 0;
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 16px;
    gap: 16px;
    align-items: start;
  }

  /* ── Sidebar ── */
  .sidebar {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 8px 0;
    box-shadow: var(--shadow-1);
    position: sticky;
    top: 80px;
  }
  .sidebar-compose-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 8px 12px 16px;
    padding: 16px 20px;
    background: #c2e7ff;
    border: none;
    border-radius: 16px;
    font-family: var(--font);
    font-size: 14px;
    font-weight: 500;
    color: var(--on-surface);
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.15s;
    width: calc(100% - 24px);
  }
  .sidebar-compose-btn:hover { background: #a8d8f5; box-shadow: var(--shadow-1); }
  .sidebar-compose-btn .compose-icon { font-size: 20px; }
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--on-surface-2);
    border-radius: 0 24px 24px 0;
    cursor: pointer;
    margin-right: 12px;
    transition: background 0.1s;
    user-select: none;
  }
  .sidebar-item:hover { background: var(--surface-3); }
  .sidebar-item.active { background: #d3e3fd; color: var(--on-surface); }
  .sidebar-item .icon { font-size: 18px; width: 20px; text-align: center; }
  .sidebar-item .count { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--on-surface); }
  .sidebar-divider { border: none; border-top: 1px solid var(--border); margin: 8px 0; }

  /* ── Main content ── */
  .content-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ── Compose card (Gmail compose window style) ── */
  .compose-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-1);
    overflow: hidden;
  }
  .compose-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: #404040;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  .compose-header-actions { display: flex; gap: 8px; }
  .compose-header-btn {
    background: none; border: none; color: #fff;
    font-size: 18px; cursor: pointer; opacity: 0.8;
    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; transition: background 0.1s;
    font-family: var(--font);
  }
  .compose-header-btn:hover { background: rgba(255,255,255,0.15); opacity: 1; }

  .compose-field {
    display: flex;
    align-items: flex-start;
    padding: 8px 16px;
    border-bottom: 1px solid var(--border);
    gap: 8px;
  }
  .compose-field-label {
    font-size: 13px;
    color: var(--on-surface-2);
    min-width: 56px;
    padding-top: 6px;
    flex-shrink: 0;
    font-weight: 500;
  }
  .compose-field-input {
    flex: 1;
    border: none;
    outline: none;
    font-family: var(--font);
    font-size: 14px;
    color: var(--on-surface);
    background: transparent;
    padding: 6px 0;
    min-width: 0;
  }
  .compose-field-input::placeholder { color: var(--on-surface-3); }

  .recipient-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;
    align-items: center;
    padding: 4px 0;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--surface-3);
    border-radius: 16px;
    padding: 3px 10px 3px 6px;
    font-size: 13px;
    color: var(--on-surface);
  }
  .chip-avatar {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: var(--gmail-blue);
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .chip-remove {
    background: none; border: none; cursor: pointer;
    color: var(--on-surface-2); font-size: 16px; line-height: 1;
    padding: 0; opacity: 0.7; font-family: var(--font);
  }
  .chip-remove:hover { opacity: 1; }

  .compose-body-area {
    padding: 8px 16px;
    min-height: 200px;
  }
  .compose-textarea {
    width: 100%;
    border: none;
    outline: none;
    font-family: var(--font);
    font-size: 14px;
    color: var(--on-surface);
    background: transparent;
    resize: none;
    line-height: 1.7;
  }
  .compose-textarea::placeholder { color: var(--on-surface-3); }

  .compose-toolbar {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-top: 1px solid var(--border);
    gap: 4px;
  }
  .compose-send-btn {
    background: var(--gmail-blue);
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 22px;
    font-family: var(--font);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.15s;
    margin-right: 4px;
  }
  .compose-send-btn:hover:not(:disabled) { background: #1557b0; box-shadow: var(--shadow-1); }
  .compose-send-btn:disabled { background: #a8c7fa; cursor: not-allowed; }
  .compose-toolbar-btn {
    background: none; border: none;
    color: var(--on-surface-2); font-size: 18px;
    cursor: pointer; padding: 6px;
    border-radius: 4px;
    transition: background 0.1s;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font);
  }
  .compose-toolbar-btn:hover { background: var(--surface-3); }

  /* ── Users list card (inbox-style) ── */
  .users-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-1);
    overflow: hidden;
  }
  .users-toolbar {
    display: flex;
    align-items: center;
    padding: 8px 8px 8px 16px;
    border-bottom: 1px solid var(--border);
    gap: 8px;
    background: var(--surface);
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .users-toolbar-title {
    font-size: 14px;
    color: var(--on-surface-2);
    font-weight: 400;
  }
  .users-toolbar-count {
    font-size: 13px;
    color: var(--on-surface-3);
    margin-left: 4px;
  }
  .users-toolbar-spacer { flex: 1; }
  .users-search {
    display: flex;
    align-items: center;
    background: var(--surface-2);
    border: 1px solid transparent;
    border-radius: 24px;
    padding: 6px 12px;
    gap: 8px;
    transition: border-color 0.15s, background 0.15s;
    max-width: 240px;
    flex: 1;
  }
  .users-search:focus-within {
    background: var(--surface);
    border-color: var(--border);
    box-shadow: var(--shadow-1);
  }
  .users-search input {
    border: none; outline: none; background: transparent;
    font-family: var(--font); font-size: 13px;
    color: var(--on-surface); width: 100%;
  }
  .users-search input::placeholder { color: var(--on-surface-3); }

  /* Gmail-style email row */
  .user-row {
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 52px;
    border-bottom: 1px solid transparent;
    cursor: pointer;
    transition: background 0.08s;
    gap: 12px;
    position: relative;
  }
  .user-row:hover { background: #f2f6fc; border-color: #e0e0e0; }
  .user-row.selected { background: #d3e3fd; }
  .user-row.selected:hover { background: #c2d8f7; }
  .user-row.unread .user-name { font-weight: 700; }

  .user-checkbox {
    opacity: 0;
    transition: opacity 0.1s;
    width: 18px; height: 18px;
    accent-color: var(--gmail-blue);
    cursor: pointer;
    flex-shrink: 0;
  }
  .user-row:hover .user-checkbox,
  .user-row.selected .user-checkbox { opacity: 1; }

  .user-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 500;
    color: #fff; flex-shrink: 0;
  }
  .user-info { flex: 1; min-width: 0; display: flex; align-items: baseline; gap: 8px; }
  .user-name {
    font-size: 14px; font-weight: 500; color: var(--on-surface);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 140px; flex-shrink: 0;
  }
  .user-email {
    font-size: 13px; color: var(--on-surface-2);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    flex: 1;
  }
  .user-email.no-email { color: var(--on-surface-3); font-style: italic; }
  .user-apps-badge {
    font-size: 11px; font-weight: 500;
    background: var(--surface-2);
    border: 1px solid var(--border);
    color: var(--on-surface-2);
    border-radius: 10px;
    padding: 1px 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .user-email-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--gmail-green);
    flex-shrink: 0;
  }
  .user-email-dot.no-email { background: var(--surface-3); }

  .select-count-bar {
    background: #d3e3fd;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    color: var(--on-surface);
    display: flex;
    align-items: center;
    gap: 12px;
    border-top: 1px solid #b8d0f5;
  }
  .select-count-bar button {
    background: none; border: none;
    font-family: var(--font); font-size: 13px;
    color: var(--gmail-blue); cursor: pointer; font-weight: 500;
    padding: 0;
  }
  .select-count-bar button:hover { text-decoration: underline; }

  /* ── Result banner ── */
  .result-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #e6f4ea;
    border: 1px solid #ceead6;
    border-radius: var(--radius);
    padding: 12px 16px;
    font-size: 13px;
    color: #137333;
  }
  .result-banner .icon { font-size: 18px; }
  .result-stats { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 8px; }
  .stat-pill {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 12px; font-weight: 500;
    padding: 3px 10px; border-radius: 12px;
  }
  .stat-pill.sent { background: #d3e3fd; color: #1a73e8; }
  .stat-pill.notif { background: #e8d5fb; color: #7b1fa2; }
  .stat-pill.skip { background: #fce8e6; color: #c5221f; }
  .stat-pill.total { background: var(--surface-3); color: var(--on-surface-2); }

  .error-banner {
    display: flex; align-items: center; gap: 10px;
    background: #fce8e6; border: 1px solid #f5c6c2;
    border-radius: var(--radius); padding: 10px 14px;
    font-size: 13px; color: var(--gmail-red);
  }

  /* ── Auth gate ── */
  .auth-screen {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface-2);
    padding: 24px;
  }
  .auth-card {
    width: min(400px, 100%);
    background: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-2);
    padding: 40px 32px;
    text-align: center;
  }
  .auth-google-logo {
    font-size: 48px;
    margin-bottom: 12px;
  }
  .auth-title {
    font-size: 22px;
    font-weight: 400;
    color: var(--on-surface);
    margin-bottom: 6px;
  }
  .auth-subtitle {
    font-size: 14px;
    color: var(--on-surface-2);
    margin-bottom: 28px;
    line-height: 1.5;
  }
  .auth-input-wrap {
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 12px 14px;
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 8px;
    transition: border-color 0.15s;
  }
  .auth-input-wrap:focus-within { border-color: var(--gmail-blue); }
  .auth-input-wrap input {
    border: none; outline: none; font-family: var(--font);
    font-size: 14px; color: var(--on-surface); width: 100%;
    background: transparent;
  }
  .auth-error { font-size: 12px; color: var(--gmail-red); text-align: left; margin-bottom: 16px; }
  .auth-next-btn {
    background: var(--gmail-blue); color: #fff; border: none;
    border-radius: 4px; padding: 10px 28px;
    font-family: var(--font); font-size: 14px; font-weight: 500;
    cursor: pointer; float: right;
    transition: background 0.15s;
  }
  .auth-next-btn:hover { background: #1557b0; }
  .auth-footer {
    clear: both;
    margin-top: 32px;
    font-size: 11px;
    color: var(--on-surface-3);
  }
  .auth-footer a { color: var(--gmail-blue); text-decoration: none; }

  /* ── Recipient mode tabs ── */
  .recipient-tabs {
    display: flex;
    background: var(--surface-2);
    border-radius: 8px;
    padding: 3px;
    gap: 2px;
    margin-bottom: 0;
  }
  .recipient-tab {
    flex: 1;
    padding: 7px 10px;
    font-family: var(--font);
    font-size: 12px;
    font-weight: 500;
    border: none;
    background: transparent;
    color: var(--on-surface-2);
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
    white-space: nowrap;
    text-align: center;
  }
  .recipient-tab.active {
    background: var(--surface);
    color: var(--gmail-blue);
    box-shadow: var(--shadow-1);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .main-layout {
      grid-template-columns: 1fr;
      padding: 8px;
      gap: 8px;
    }
    .sidebar { display: none; }
    .sidebar.mobile-open {
      display: block;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: 280px;
      z-index: 200;
      border-radius: 0;
      box-shadow: var(--shadow-3);
      overflow-y: auto;
      padding-top: 16px;
    }
    .mobile-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 199;
    }
    .topbar { padding: 8px 12px; }
    .topbar-logo { font-size: 18px; }
    .compose-field-label { min-width: 44px; font-size: 12px; }
    .user-name { max-width: 100px; }
    .compose-toolbar { flex-wrap: wrap; }
  }

  @media (max-width: 480px) {
    .compose-header { padding: 8px 12px; font-size: 13px; }
    .compose-field { padding: 6px 12px; }
    .compose-body-area { padding: 6px 12px; }
    .user-row { height: 56px; padding: 0 12px; }
    .user-info { flex-direction: column; gap: 1px; align-items: flex-start; }
    .user-name { max-width: 180px; }
    .user-email { font-size: 12px; }
    .topbar-logo .badge-admin { display: none; }
  }
`;

// Avatar colors
const AVATAR_COLORS = ["#1a73e8","#d93025","#34a853","#fbbc04","#e91e63","#9c27b0","#00bcd4","#ff5722"];
const getColor = (str) => AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];
const getInitial = (id) => id?.slice(-4, -3)?.toUpperCase() || "U";

export default function AdminEmailPage() {
  const [authed, setAuthed] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [search, setSearch] = useState("");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientMode, setRecipientMode] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [customEmails, setCustomEmails] = useState("");

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const styleInjected = useRef(false);

  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);

  const handleAuth = () => {
    if (secretInput === ADMIN_SECRET) {
      setAuthed(true); setAuthError("");
    } else {
      setAuthError("Wrong password. Try again.");
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoadingUsers(true);
    fetch("/api/admin/send-email", { headers: { "x-admin-secret": ADMIN_SECRET } })
      .then(r => r.json())
      .then(d => setUsers(d.users || []))
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoadingUsers(false));
  }, [authed]);

  const toggleUser = (id) =>
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);

  const selectAll = () => setSelectedUsers(filteredUsers.map(u => u.clerkUserId));
  const selectNone = () => setSelectedUsers([]);

  const filteredUsers = users.filter(u =>
    !search ||
    u.clerkUserId.toLowerCase().includes(search.toLowerCase()) ||
    (u.notifyEmail || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) { setError("Subject and message are required."); return; }
    if (recipientMode === "selected" && selectedUsers.length === 0) { setError("Select at least one user."); return; }
    setSending(true); setError(""); setResult(null);

    const customEmailList = customEmails.split(/[\n,]/).map(e => e.trim()).filter(Boolean);
    const recipients = recipientMode === "selected" ? selectedUsers : recipientMode;

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
        body: JSON.stringify({ subject, message, recipients, customEmails: customEmailList }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setResult(data);
      setSubject(""); setMessage(""); setSelectedUsers([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  // ── Auth Gate ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-google-logo">✉️</div>
          <h1 className="auth-title">Sign in to Admin</h1>
          <p className="auth-subtitle">Use your admin password to access<br />LeaderLab's broadcast panel</p>
          <div className="auth-input-wrap">
            <span style={{ fontSize: 16, color: "var(--on-surface-3)" }}>🔑</span>
            <input
              type="password"
              placeholder="Enter admin password"
              value={secretInput}
              onChange={e => setSecretInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAuth()}
              autoFocus
            />
          </div>
          {authError && <div className="auth-error">{authError}</div>}
          <button className="auth-next-btn" onClick={handleAuth}>Next</button>
          <div className="auth-footer">
            By continuing, you acknowledge this is a secure admin panel.<br />
            <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    );
  }

  const emailCount = users.filter(u => u.notifyEmail).length;

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <div className="gmail-app">
      {/* Top bar */}
      <header className="topbar">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--on-surface-2)", padding: 6, borderRadius: 4 }}
        >☰</button>
        <div className="topbar-logo">
          ✉️ &nbsp;<strong>Admin</strong>Mail
          <span className="badge-admin">ADMIN ONLY</span>
        </div>
        <div className="topbar-spacer" />
        <div className="topbar-avatar" title="Admin">A</div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="main-layout">
        {/* Sidebar */}
        <aside className={`sidebar${sidebarOpen ? " mobile-open" : ""}`}>
          <button className="sidebar-compose-btn" onClick={() => { setSidebarOpen(false); document.getElementById("subject-input")?.focus(); }}>
            <span className="compose-icon">✏️</span> Compose
          </button>
          <hr className="sidebar-divider" />
          {[
            { icon: "📣", label: "Broadcast", active: true },
            { icon: "📥", label: "All Users", count: users.length },
            { icon: "✉️", label: "With Email", count: emailCount },
            { icon: "🔕", label: "No Email", count: users.length - emailCount },
          ].map(item => (
            <div key={item.label} className={`sidebar-item${item.active ? " active" : ""}`}>
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.count !== undefined && <span className="count">{item.count}</span>}
            </div>
          ))}
          <hr className="sidebar-divider" />
          {[
            { icon: "⚙️", label: "Settings" },
            { icon: "🚪", label: "Sign out" },
          ].map(item => (
            <div key={item.label} className="sidebar-item">
              <span className="icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </aside>

        {/* Content */}
        <div className="content-area">

          {/* Result / Error banners */}
          {result && (
            <div className="result-banner">
              <span className="icon">✅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 6 }}>Message sent successfully!</div>
                <div className="result-stats">
                  <span className="stat-pill total">📊 {result.total} targeted</span>
                  <span className="stat-pill sent">✉️ {result.emailed} emailed</span>
                  <span className="stat-pill notif">🔔 {result.notified} notified</span>
                  {result.skipped > 0 && <span className="stat-pill skip">⚠️ {result.skipped} skipped</span>}
                </div>
                {result.errors?.length > 0 && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "#c5221f" }}>
                    {result.errors.length} error(s): {result.errors.map(e => e.email || e.clerkUserId).join(", ")}
                  </div>
                )}
              </div>
              <button onClick={() => setResult(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#137333", fontFamily: "var(--font)" }}>✕</button>
            </div>
          )}
          {error && (
            <div className="error-banner">
              <span>⚠️</span> {error}
              <button onClick={() => setError("")} style={{ background: "none", border: "none", marginLeft: "auto", cursor: "pointer", color: "var(--gmail-red)", fontFamily: "var(--font)", fontSize: 16 }}>✕</button>
            </div>
          )}

          {/* Compose card */}
          <div className="compose-card">
            <div className="compose-header">
              <span>New Message</span>
              <div className="compose-header-actions">
                <button className="compose-header-btn" title="Minimize">−</button>
                <button className="compose-header-btn" title="Full screen">⤢</button>
                <button className="compose-header-btn" title="Close" onClick={() => { setSubject(""); setMessage(""); }}>✕</button>
              </div>
            </div>

            {/* Recipients row */}
            <div className="compose-field" style={{ minHeight: 44 }}>
              <span className="compose-field-label">To</span>
              <div className="recipient-tabs">
                {[
                  { value: "all", label: `All (${users.length})` },
                  { value: "with_email", label: `Email (${emailCount})` },
                  { value: "selected", label: selectedUsers.length > 0 ? `Selected (${selectedUsers.length})` : "Selected" },
                ].map(t => (
                  <button
                    key={t.value}
                    className={`recipient-tab${recipientMode === t.value ? " active" : ""}`}
                    onClick={() => setRecipientMode(t.value)}
                  >{t.label}</button>
                ))}
              </div>
            </div>

            {/* Extra emails row */}
            <div className="compose-field">
              <span className="compose-field-label">Cc</span>
              <input
                className="compose-field-input"
                placeholder="Extra emails (comma or newline separated)"
                value={customEmails}
                onChange={e => setCustomEmails(e.target.value)}
              />
            </div>

            {/* Subject row */}
            <div className="compose-field">
              <span className="compose-field-label">Subject</span>
              <input
                id="subject-input"
                className="compose-field-input"
                placeholder="Subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>

            {/* Body */}
            <div className="compose-body-area">
              <textarea
                className="compose-textarea"
                placeholder="Write your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={10}
              />
            </div>

            {/* Toolbar */}
            <div className="compose-toolbar">
              <button
                className="compose-send-btn"
                onClick={handleSend}
                disabled={sending || !subject.trim() || !message.trim()}
              >
                {sending ? "Sending..." : "Send"}
              </button>
              {["📎", "🖼️", "😊", "🔗", "🗑️"].map(icon => (
                <button key={icon} className="compose-toolbar-btn" title={icon}>{icon}</button>
              ))}
            </div>
          </div>

          {/* Users list */}
          <div className="users-card">
            <div className="users-toolbar">
              <span className="users-toolbar-title">
                Recipients
                <span className="users-toolbar-count">1–{Math.min(filteredUsers.length, 50)} of {filteredUsers.length}</span>
              </span>
              <div className="users-toolbar-spacer" />
              <div className="users-search">
                <span style={{ fontSize: 14, color: "var(--on-surface-3)" }}>🔍</span>
                <input
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingUsers ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--on-surface-3)", fontSize: 14 }}>
                Loading users…
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--on-surface-3)", fontSize: 14 }}>
                No users found
              </div>
            ) : (
              <>
                {filteredUsers.slice(0, 50).map(u => {
                  const isSelected = selectedUsers.includes(u.clerkUserId);
                  const hasEmail = !!u.notifyEmail;
                  return (
                    <div
                      key={u.clerkUserId}
                      className={`user-row${isSelected ? " selected" : ""}`}
                      onClick={() => recipientMode === "selected" && toggleUser(u.clerkUserId)}
                    >
                      <input
                        type="checkbox"
                        className="user-checkbox"
                        checked={isSelected}
                        onChange={() => toggleUser(u.clerkUserId)}
                        onClick={e => e.stopPropagation()}
                        style={{ opacity: recipientMode === "selected" || isSelected ? 1 : undefined }}
                      />
                      <div
                        className="user-avatar"
                        style={{ background: getColor(u.clerkUserId) }}
                      >
                        {getInitial(u.clerkUserId)}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{u.clerkUserId.slice(-12)}</span>
                        <span className={`user-email${hasEmail ? "" : " no-email"}`}>
                          {hasEmail ? `✉ ${u.notifyEmail}` : "— no notify email set"}
                        </span>
                      </div>
                      <span className="user-apps-badge">{u.applicationCount} apps</span>
                      <div className={`user-email-dot${hasEmail ? "" : " no-email"}`} title={hasEmail ? "Has email" : "No email"} />
                    </div>
                  );
                })}
              </>
            )}

            {/* Select bar */}
            {recipientMode === "selected" && (
              <div className="select-count-bar">
                <span>{selectedUsers.length} selected</span>
                <button onClick={selectAll}>Select all</button>
                {selectedUsers.length > 0 && <button onClick={selectNone}>Clear</button>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}