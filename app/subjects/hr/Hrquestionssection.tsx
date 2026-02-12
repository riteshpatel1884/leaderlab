"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hrQuestions, HRQuestion } from "@/data/hr/hrQuestions";
import { X, ArrowUpRight, ChevronRight } from "lucide-react";

const categoryColors: Record<string, { bg: string; text: string; dot: string }> = {
  Introduction: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  Behavioral:   { bg: "bg-amber-500/10",   text: "text-amber-400",   dot: "bg-amber-400"   },
  Motivation:   { bg: "bg-sky-500/10",     text: "text-sky-400",     dot: "bg-sky-400"     },
  Conflict:     { bg: "bg-rose-500/10",    text: "text-rose-400",    dot: "bg-rose-400"    },
};

const accentMap: Record<string, string> = {
  Introduction: "#10b981",
  Behavioral:   "#f59e0b",
  Motivation:   "#0ea5e9",
  Conflict:     "#f43f5e",
};

const fallback = { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" };

export default function HRQuestionsSection() {
  const [selected, setSelected] = useState<HRQuestion | null>(null);

  return (
    <>
      <style>{`
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
        .card-row:hover::before       { width: 100%; }
        .card-row:hover .row-index    { color: #6366f1; }
        .card-row:hover .row-arrow    { opacity: 1; transform: translateX(0) translateY(0); }
        .card-row:hover .row-question { color: #e0e1ff; }
        .row-arrow {
          opacity: 0;
          transform: translateX(-8px) translateY(4px);
          transition: opacity 0.25s, transform 0.25s;
        }
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
        @keyframes float-up {
          0%   { transform: translateY(0px) rotate(0deg);   opacity: 0.06; }
          50%  { transform: translateY(-18px) rotate(3deg); opacity: 0.10; }
          100% { transform: translateY(0px) rotate(0deg);   opacity: 0.06; }
        }
        .bubble   { animation: float-up 6s ease-in-out infinite; }
        .bubble-2 { animation: float-up 8s ease-in-out infinite reverse; }
        .tip-card { position: relative; overflow: hidden; }
        .tip-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%);
          pointer-events: none;
        }
        .practice-btn { position: relative; overflow: hidden; }
        .practice-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .practice-btn:hover::after { transform: translateX(100%); }
      `}</style>

      {/* ─── QUESTIONS LIST ─── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-24 pb-32">
        <div className="flex items-end justify-between mb-2">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.02em", color: "white" }}>
            Core Interview <span style={{ color: "#6366f1" }}>Subjects</span>
          </h2>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
            {hrQuestions.length} questions
          </span>
        </div>

        <div
          className="grid"
          style={{ gridTemplateColumns: "48px 1fr 140px 48px", gap: "0 24px", padding: "12px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span>#</span><span>Question</span><span>Category</span><span />
        </div>

        {hrQuestions.map((q, idx) => {
          const c = categoryColors[q.category] ?? fallback;
          return (
            <motion.div
              key={q.id}
              className="card-row"
              style={{ padding: "20px 24px" }}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelected(q)}
            >
              <span className="row-index" style={{ width: 48, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.18)", transition: "color 0.2s", flexShrink: 0, marginRight: 24 }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <p className="row-question" style={{ flex: 1, fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.75)", lineHeight: 1.4, transition: "color 0.2s", marginRight: 24 }}>
                {q.question}
              </p>
              <div style={{ width: 140, display: "flex", justifyContent: "flex-start" }}>
                <span className={`tag-pill ${c.bg} ${c.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  {q.category}
                </span>
              </div>
              <div className="row-arrow" style={{ width: 48, display: "flex", justifyContent: "flex-end" }}>
                <ChevronRight style={{ width: 18, height: 18, color: "#6366f1" }} />
              </div>
            </motion.div>
          );
        })}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }} />
      </div>

      {/* ─── POPUP ─── */}
      <AnimatePresence>
        {selected && (
          <AnswerModal
            question={selected}
            accent={accentMap[selected.category] ?? "#6366f1"}
            c={categoryColors[selected.category] ?? fallback}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Split-panel Answer Modal ─── */
function AnswerModal({
  question,
  accent,
  c,
  onClose,
}: {
  question: HRQuestion;
  accent: string;
  c: { bg: string; text: string; dot: string };
  onClose: () => void;
}) {
  const steps = question.answer.split(". ").filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(2,3,10,0.9)", backdropFilter: "blur(32px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative z-[101] w-full flex flex-col md:flex-row"
        style={{
          maxWidth: 860,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: `0 60px 120px -30px rgba(0,0,0,0.9), 0 0 0 1px ${accent}25`,
        }}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {/* ── LEFT PANEL – Question ── */}
        <div
          style={{
            width: 300,
            flexShrink: 0,
            padding: "2.5rem 2rem",
            background: `linear-gradient(160deg, ${accent}1e 0%, ${accent}08 45%, #07090f 100%)`,
            borderRight: `1px solid ${accent}18`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            minHeight: 400,
            overflow: "hidden",
          }}
        >
          {/* Decorative floating circles */}
          <div
            className="bubble"
            style={{ position: "absolute", bottom: 30, right: -30, width: 130, height: 130, borderRadius: "50%", border: `1px solid ${accent}20`, pointerEvents: "none" }}
          />
          <div
            className="bubble-2"
            style={{ position: "absolute", bottom: 70, right: 30, width: 55, height: 55, borderRadius: "50%", background: `${accent}0a`, pointerEvents: "none" }}
          />

          <div>
            {/* Category pill */}
            <span className={`tag-pill ${c.bg} ${c.text}`} style={{ marginBottom: "1.75rem", display: "inline-flex" }}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
              {question.category}
            </span>

            {/* Giant decorative Q */}
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 88, fontWeight: 900, lineHeight: 1, color: `${accent}15`, letterSpacing: "-0.05em", userSelect: "none", marginBottom: "0.25rem" }}>
              Q.
            </div>

            {/* Question text */}
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 2.4vw, 1.55rem)", fontWeight: 900, lineHeight: 1.25, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.95)", margin: 0 }}>
              {question.question}
            </h2>
          </div>

          {/* Difficulty bar */}
          <div style={{ marginTop: "2rem" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.6rem" }}>
              Difficulty
            </p>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ height: 4, flex: 1, borderRadius: 9999, background: i <= 3 ? accent : "rgba(255,255,255,0.07)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL – Answer ── */}
        <div style={{ flex: 1, background: "#090c17", padding: "2.25rem 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative" }}>

          {/* Close btn */}
          <button
            onClick={onClose}
            style={{ position: "absolute", top: "1.25rem", right: "1.25rem", width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.3)", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.3)"; }}
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 16, borderRadius: 9999, background: accent }} />
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: 0 }}>
              Master Answer Framework
            </p>
          </div>

          {/* Answer step cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {steps.map((sentence, i) => (
              <motion.div
                key={i}
                className="tip-card"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 12, padding: "0.85rem 1rem", display: "flex", gap: 12, alignItems: "flex-start" }}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 6, background: `${accent}18`, border: `1px solid ${accent}28`, color: accent, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: 14.5, lineHeight: 1.68, color: "rgba(255,255,255,0.65)", fontWeight: 400, margin: 0 }}>
                  {sentence}{sentence.endsWith(".") ? "" : "."}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 8, paddingTop: "0.25rem" }}>
            <button
              className="practice-btn"
              style={{ flex: 1, height: 48, borderRadius: 12, background: accent, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 800, color: "white", letterSpacing: "0.03em", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: `0 8px 28px -8px ${accent}66` }}
            >
              Practice This Question <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)"; }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}