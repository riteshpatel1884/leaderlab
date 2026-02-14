"use client";

import Navbar from "@/app/component/navbar/navbar";
import HRQuestionsSection from "./Hrquestionssection";
export default function HRSubjectsPage() {
  return (
    <div
      className="min-h-screen text-white font-sans antialiased overflow-x-hidden"
      style={{
        background: "#060810",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
     
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300;1,9..40,400&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap');

        .display-font { font-family: 'Playfair Display', serif; }

        /* ── Question rows ── */
        .card-row {
          position: relative;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: background 0.2s;
          overflow: hidden;
        }
        .card-row::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 0;
          background: linear-gradient(90deg, rgba(99,102,241,0.07) 0%, transparent 100%);
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .card-row:hover::before        { width: 100%; }
        .card-row:hover .row-index     { color: #6366f1; }
        .card-row:hover .row-arrow     { opacity: 1; transform: translateX(0) translateY(0); }
        .card-row:hover .row-question  { color: #e0e1ff; }

        .row-arrow {
          opacity: 0;
          transform: translateX(-8px) translateY(4px);
          transition: opacity 0.25s, transform 0.25s;
        }

        /* ── Category pill ── */
        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── Popup answer bullet ── */
        .answer-line {
          position: relative;
          padding-left: 1.5rem;
        }
        .answer-line::before {
          content: '';
          position: absolute;
          left: 0; top: 6px;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 8px #6366f1;
        }

        /* ── Popup font ── */
        .popup-inner              { font-family: 'DM Sans', sans-serif; }
        .popup-inner .display-font { font-family: 'Playfair Display', serif; }

        /* ── Animated gradient button / logo square ── */
        @keyframes shine {
          from { background-position: -200% center; }
          to   { background-position:  200% center; }
        }
        .shine-btn {
          background: linear-gradient(90deg, #6366f1 0%, #a78bfa 40%, #6366f1 60%, #a78bfa 100%);
          background-size: 200%;
          animation: shine 3s linear infinite;
        }

        /* ── Ambient orbs ── */
        .glow-orb {
          position: fixed;
          border-radius: 9999px;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Noise texture ── */
        .noise-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          background-size: 180px;
          opacity: 0.4;
        }
      `}</style>

      {/* Ambient glows */}
      <div className="glow-orb w-[600px] h-[400px] top-[-100px] left-[-100px]" style={{ background: "rgba(99,102,241,0.12)" }} />
      <div className="glow-orb w-[500px] h-[400px] bottom-[10%] right-[-80px]"  style={{ background: "rgba(167,139,250,0.08)" }} />
      <div className="noise-overlay" />

      {/* ── Your existing Navbar ── */}
      <Navbar />

      {/* ── HR Questions list + popup (shared component) ── */}
      <HRQuestionsSection />
    </div>
  );
}