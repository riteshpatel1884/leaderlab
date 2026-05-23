// lib/TrackJob/email.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || "LeaderLab <noreply@leaderlab.in>";

// ── Shared HTML wrapper ────────────────────────────────────────────────────────
function htmlWrapper(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LeaderLab</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0f0f1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #e2e8f0; }
    .wrapper { max-width: 560px; margin: 0 auto; padding: 32px 16px; }
    .card { background: #1a1a2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #6c63ff22, #3b82f611); padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 20px; font-weight: 800; color: #a78bfa; letter-spacing: -0.5px; }
    .logo span { color: #6c63ff; }
    .body { padding: 28px 32px; }
    .company-row { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
    .company-avatar { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #6c63ff, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; color: #fff; flex-shrink: 0; }
    .company-name { font-size: 20px; font-weight: 700; color: #f1f5f9; }
    .role-name { font-size: 14px; color: #94a3b8; margin-top: 2px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
    .info-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px 14px; }
    .info-label { font-size: 10px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; }
    .info-value { font-size: 13px; color: #e2e8f0; font-weight: 500; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .badge-applied { background: rgba(59,130,246,0.15); color: #3b82f6; border: 1px solid rgba(59,130,246,0.3); }
    .badge-interview { background: rgba(234,179,8,0.15); color: #eab308; border: 1px solid rgba(234,179,8,0.3); }
    .badge-offer { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
    .badge-rejected { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
    .alert-box { background: rgba(234,179,8,0.08); border: 1px solid rgba(234,179,8,0.25); border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; }
    .alert-title { font-size: 14px; font-weight: 700; color: #fbbf24; margin-bottom: 4px; }
    .alert-body { font-size: 13px; color: #94a3b8; line-height: 1.5; }
    .message-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 22px; margin-bottom: 24px; font-size: 14px; color: #cbd5e1; line-height: 1.8; white-space: pre-wrap; }
    .cta { display: block; text-align: center; background: linear-gradient(135deg, #6c63ff, #4f46e5); color: #fff !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 20px; }
    .footer { padding: 18px 32px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #475569; text-align: center; line-height: 1.6; }
    .notes-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 12px 14px; font-size: 12px; color: #94a3b8; line-height: 1.6; margin-bottom: 16px; }
    h2 { font-size: 16px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; }
    p { font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 14px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">Leader<span>Lab</span></div>
      </div>
      ${content}
      <div class="footer">
        LeaderLab · Your job application tracker<br/>
        You're receiving this because you're a registered user of LeaderLab.
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ── Application Added Email ────────────────────────────────────────────────────
export async function sendApplicationAddedEmail({ to, application }) {
  const {
    company, role, status, platform, dateApplied,
    jobType, workType, applyType, salary, followUpDate, notes, jobLink
  } = application;

  const dateStr = dateApplied
    ? new Date(dateApplied).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : "Today";

  const followUpStr = followUpDate
    ? new Date(followUpDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leaderlab.in";

  const content = `
    <div class="body">
      <p style="margin-bottom:20px;">New application tracked! Here's a summary:</p>
      <div class="company-row">
        <div class="company-avatar">${company.charAt(0).toUpperCase()}</div>
        <div>
          <div class="company-name">${company}</div>
          <div class="role-name">${role}</div>
        </div>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Status</div><div class="info-value"><span class="badge badge-${status.toLowerCase()}">${status}</span></div></div>
        <div class="info-item"><div class="info-label">Date Applied</div><div class="info-value">${dateStr}</div></div>
        <div class="info-item"><div class="info-label">Type</div><div class="info-value">${jobType || "Job"}</div></div>
        <div class="info-item"><div class="info-label">Work Mode</div><div class="info-value">${workType || "Onsite"}</div></div>
        ${platform ? `<div class="info-item"><div class="info-label">Platform</div><div class="info-value">${platform}</div></div>` : ""}
        ${applyType ? `<div class="info-item"><div class="info-label">Apply Method</div><div class="info-value">${applyType}</div></div>` : ""}
        ${salary ? `<div class="info-item"><div class="info-label">Salary / Stipend</div><div class="info-value" style="color:#22c55e;font-weight:700;">${salary}</div></div>` : ""}
        ${followUpStr ? `<div class="info-item"><div class="info-label">Follow-up Date</div><div class="info-value" style="color:#eab308;">${followUpStr}</div></div>` : ""}
      </div>
      ${notes ? `<div class="notes-box">📝 ${notes}</div>` : ""}
      ${jobLink ? `<p><a href="${jobLink}" style="color:#6c63ff;">View Job Posting ↗</a></p>` : ""}
      <a href="${appUrl}/dashboard" class="cta">View in LeaderLab →</a>
    </div>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `✅ Applied to ${role} at ${company} — LeaderLab`,
    html: htmlWrapper(content),
  });
}

// ── Follow-up Reminder Email ───────────────────────────────────────────────────
export async function sendFollowUpReminderEmail({ to, application }) {
  const { company, role, status, followUpDate, platform, notes, jobLink } = application;

  const followUpStr = followUpDate
    ? new Date(followUpDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : "";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leaderlab.in";

  const content = `
    <div class="body">
      <div class="alert-box">
        <div class="alert-title">⚡ Follow-up Reminder — Tomorrow!</div>
        <div class="alert-body">Your follow-up for <strong style="color:#f1f5f9;">${company}</strong> is scheduled for <strong style="color:#fbbf24;">${followUpStr}</strong>. Don't miss it!</div>
      </div>
      <div class="company-row">
        <div class="company-avatar">${company.charAt(0).toUpperCase()}</div>
        <div>
          <div class="company-name">${company}</div>
          <div class="role-name">${role}</div>
        </div>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Current Status</div><div class="info-value"><span class="badge badge-${status.toLowerCase()}">${status}</span></div></div>
        <div class="info-item"><div class="info-label">Follow-up Date</div><div class="info-value" style="color:#fbbf24;font-weight:700;">${followUpStr}</div></div>
        ${platform ? `<div class="info-item"><div class="info-label">Platform</div><div class="info-value">${platform}</div></div>` : ""}
      </div>
      <h2 style="margin-bottom:10px;">💡 Suggested actions</h2>
      <p>• Send a polite follow-up email to the recruiter<br/>• Connect on LinkedIn if you haven't already<br/>• Update the status in LeaderLab after following up</p>
      ${notes ? `<div class="notes-box">📝 Your notes: ${notes}</div>` : ""}
      ${jobLink ? `<p><a href="${jobLink}" style="color:#6c63ff;">View Job Posting ↗</a></p>` : ""}
      <a href="${appUrl}/dashboard" class="cta">Update Status in LeaderLab →</a>
    </div>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `⚡ Follow-up tomorrow: ${role} at ${company} — LeaderLab`,
    html: htmlWrapper(content),
  });
}

// ── Admin Custom Email ─────────────────────────────────────────────────────────
export async function sendAdminCustomEmail({ to, subject, message }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leaderlab.in";

  const content = `
    <div class="body">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
        <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6c63ff,#4f46e5);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">📣</div>
        <div>
          <div style="font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">Message from LeaderLab Team</div>
          <div style="font-size:15px;font-weight:700;color:#f1f5f9;margin-top:2px;">${subject}</div>
        </div>
      </div>

      <div class="message-box">${message}</div>

      <a href="${appUrl}/dashboard" class="cta">Open LeaderLab →</a>
    </div>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `📣 ${subject} — LeaderLab`,
    html: htmlWrapper(content),
  });
}