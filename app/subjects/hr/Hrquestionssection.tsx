"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hrQuestions, HRQuestion } from "@/data/hr/hrQuestions";
import { X, ChevronRight } from "lucide-react";

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

  const handleNext = () => {
    if (!selected) return;
    const currentIndex = hrQuestions.findIndex((q) => q.id === selected.id);
    const nextIndex = (currentIndex + 1) % hrQuestions.length;
    setSelected(hrQuestions[nextIndex]);
  };

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
        .card-row:hover .row-question { color: #e0e1ff; }
        
        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        @media (min-width: 640px) {
          .tag-pill { font-size: 11px; padding: 4px 12px; }
        }

        /* Float Animations for Modal */
        @keyframes float-up {
          0%   { transform: translateY(0px); opacity: 0.06; }
          50%  { transform: translateY(-18px); opacity: 0.10; }
          100% { transform: translateY(0px); opacity: 0.06; }
        }
        .bubble { animation: float-up 6s ease-in-out infinite; }
      `}</style>

     
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-12 pt-24 pb-32">
        <div className="flex items-end justify-between mb-6">
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.4rem, 4vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "white" }}>
            Core Interview <span style={{ color: "#6366f1" }}>Subjects</span>
          </h2>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
            {hrQuestions.length} questions
          </span>
        </div>

        {/* Responsive Grid Header */}
        <div
          className="grid"
          style={{ 
            gridTemplateColumns: "35px 1fr 100px", // Smaller widths for mobile
            gap: "0 12px", 
            padding: "12px 16px", 
            fontSize: 10, 
            fontWeight: 700, 
            letterSpacing: "0.12em", 
            textTransform: "uppercase", 
            color: "rgba(255,255,255,0.2)", 
            borderBottom: "1px solid rgba(255,255,255,0.06)" 
          }}
        >
          <span className="md:w-[48px]">#</span>
          <span>Question</span>
          <span className="text-right md:text-left md:w-[140px]">Category</span>
        </div>

        {hrQuestions.map((q, idx) => {
          const c = categoryColors[q.category] ?? fallback;
          return (
            <motion.div
              key={q.id}
              className="card-row grid"
              style={{ 
                gridTemplateColumns: "35px 1fr 100px", 
                gap: "0 12px", 
                padding: "20px 16px",
                alignItems: "center"
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelected(q)}
            >
              <span className="row-index" style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.18)" }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              
              <p className="row-question" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)", fontWeight: 600, color: "rgba(255,255,255,0.75)", lineHeight: 1.4, margin: 0 }}>
                {q.question}
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span className={`tag-pill ${c.bg} ${c.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  {q.category}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── POPUP ─── */}
      <AnimatePresence mode="wait">
        {selected && (
          <AnswerModal
            key={selected.id}
            question={selected}
            accent={accentMap[selected.category] ?? "#6366f1"}
            c={categoryColors[selected.category] ?? fallback}
            onClose={() => setSelected(null)}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function AnswerModal({ question, accent, c, onClose, onNext }: {
  question: HRQuestion;
  accent: string;
  c: { bg: string; text: string; dot: string };
  onClose: () => void;
  onNext: () => void;
}) {
  const steps = question.answer.split(". ").filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(2,3,10,0.85)", backdropFilter: "blur(20px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative z-[101] w-full flex flex-col md:flex-row bg-[#090c17] overflow-hidden"
        style={{
          maxWidth: 860,
          maxHeight: "90vh",
          borderRadius: 24,
          boxShadow: `0 40px 100px -20px rgba(0,0,0,0.8), 0 0 0 1px ${accent}20`,
        }}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
      >
        {/* Important: Enable scrolling for mobile */}
        <div className="flex flex-col md:flex-row w-full overflow-y-auto">
          
          {/* Left Panel */}
          <div className="w-full md:w-[300px] flex-shrink-0 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden"
            style={{ 
              background: `linear-gradient(160deg, ${accent}1e 0%, #07090f 100%)`,
              borderRight: `1px solid ${accent}18`,
              borderBottom: `1px solid ${accent}18` 
            }}
          >
            <div className="bubble" style={{ position: "absolute", bottom: -20, right: -20, width: 100, height: 100, borderRadius: "50%", border: `1px solid ${accent}20` }} />
            
            <div className="relative z-10">
              <span className={`tag-pill ${c.bg} ${c.text} mb-6`}>
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                {question.category}
              </span>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 64, fontWeight: 900, color: `${accent}15`, lineHeight: 1 }}>Q.</div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.3, color: "white" }}>
                {question.question}
              </h2>
            </div>

            <div className="mt-8 relative z-10">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2">Difficulty</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? "" : "bg-white/10"}`} style={{ background: i <= 3 ? accent : "" }} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 p-8 md:p-10 flex flex-col gap-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white z-20 hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-1 h-4 rounded-full" style={{ background: accent }} />
              <p className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-white/40">Master Answer Framework</p>
            </div>

            <div className="flex flex-col gap-3">
              {steps.map((sentence, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex gap-4"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold" style={{ background: `${accent}20`, color: accent }}>
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-white/70 m-0">
                    {sentence.trim()}{sentence.trim().endsWith(".") ? "" : "."}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-4">
              <button
                onClick={onNext}
                className="w-full h-12 rounded-xl border-none cursor-pointer text-sm font-bold text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                style={{ background: accent, boxShadow: `0 10px 30px -10px ${accent}80` }}
              >
                Next Question <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}