"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { X, Send, Loader2, Filter, Brain, Code2, ArrowLeft, CheckCircle2, Clock, Play, Lock, MessageSquare, GripVertical } from "lucide-react";
// Make sure this path matches exactly where you saved the data file
import { OopQuestion, oopQuestions } from "@/data/oops/oopsQuestions";

export default function OopPractice() {
  const { user, isLoaded } = useUser();
  
  // State
  const [selectedQuestion, setSelectedQuestion] = useState<OopQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [codeSubmission, setCodeSubmission] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [isCorrect, setIsCorrect] = useState(false);
  const [cooldownEnd, setCooldownEnd] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  
  // Progress State
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [failedIds, setFailedIds] = useState<number[]>([]);
  
  // UI State
  const [viewMode, setViewMode] = useState<"practice" | "solved" | "locked">("practice");
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  // 1. Fetch User Progress
  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          // Filter for 'oop-' prefix since that is how we store them
          const oopAttempts = data.user.attempts.filter((a: any) => a.questionId.startsWith('oop-'));
          
          const solved = oopAttempts
            .filter((a: any) => a.verdict === 'PASS')
            .map((a: any) => parseInt(a.questionId.replace('oop-', '')));
            
          const failed = oopAttempts
            .filter((a: any) => a.cooldownUntil && new Date(a.cooldownUntil) > new Date())
            .map((a: any) => parseInt(a.questionId.replace('oop-', '')));

          setSolvedIds([...new Set(solved)] as number[]);
          setFailedIds([...new Set(failed)] as number[]);
        }
      } catch (error) {
        console.error("Failed to load progress", error);
      }
    };

    fetchProgress();
  }, [user]);

  const showModelAnswer = isCorrect || (attemptNumber > 3 && !!cooldownEnd);

  // Cooldown Timer
  useEffect(() => {
    if (!cooldownEnd) {
      setTimeLeft("");
      return;
    }
    const interval = setInterval(() => {
      const diff = cooldownEnd.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("");
        setCooldownEnd(null);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownEnd]);

  // Resizable Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const modal = document.getElementById('split-modal');
      if (!modal) return;
      const rect = modal.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newWidth > 25 && newWidth < 75) setLeftWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Open Question Handler
  const openQuestion = async (q: OopQuestion) => {
    setSelectedQuestion(q);
    setUserAnswer("");
    setCodeSubmission("");
    setFeedback("");
    setAttemptNumber(1);
    setIsCorrect(false);
    setCooldownEnd(null);

    if (user) {
      try {
        // 👇 UPDATE 1: Updated URL to match your folder structure
        const res = await fetch(`/api/cooldown/check-cooldown-oops?questionId=${q.id}&clerkUserId=${user.id}`);
        const data = await res.json();
        if (data.cooldownUntil) {
          setCooldownEnd(new Date(data.cooldownUntil));
          setFeedback("You are currently in a cooldown period for this question.");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const closeQuestion = () => {
    setSelectedQuestion(null);
    setFeedback("");
    setCooldownEnd(null);
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!userAnswer.trim() || cooldownEnd || !selectedQuestion || !user) return;
    setLoading(true);

    try {
      // 👇 UPDATE 2: Updated URL to match your folder structure
      const response = await fetch('/api/evaluate-oops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkUserId: user.id,
          questionId: selectedQuestion.id.toString(),
          question: selectedQuestion.description,
          userAnswer: userAnswer,
          codeSubmission: codeSubmission,
          difficulty: selectedQuestion.difficulty,
          topic: selectedQuestion.topic,
          attemptNumber: attemptNumber,
          language: selectedQuestion.language
        })
      });

      const data = await response.json();

      if (data.error) {
        setFeedback(`Error: ${data.error}`);
        return;
      }

      setFeedback(data.feedback);
      
      if (data.isCorrect) {
        setIsCorrect(true);
        setSolvedIds(prev => [...new Set([...prev, selectedQuestion.id])]);
        setFailedIds(prev => prev.filter(id => id !== selectedQuestion.id));
      } else {
        setAttemptNumber(prev => prev + 1);
      }

      if (data.cooldown) {
        setCooldownEnd(new Date(data.cooldownUntil));
        setFailedIds(prev => [...new Set([...prev, selectedQuestion.id])]);
      }

    } catch (error) {
      setFeedback("Failed to submit answer. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Filtering Logic
  const filteredQuestions = oopQuestions.filter(q => {
    const isSolved = solvedIds.includes(q.id);
    const isFailed = failedIds.includes(q.id);
    if (viewMode === "solved") return isSolved;
    if (viewMode === "locked") return isFailed;
    return !isSolved && !isFailed;
  });

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center bg-[#0a0d1f] text-white"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0a0d1f] text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Practice <span className="text-indigo-400">OOP</span> like an<br />
            <span className="text-indigo-400">Interview.</span>
          </h1>
        </div>

        {/* View Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-800/30 rounded-2xl p-1.5 border border-gray-800">
            <button
              onClick={() => setViewMode("practice")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                viewMode === "practice" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <Play className="w-4 h-4" /> Practice
            </button>
            <button
              onClick={() => setViewMode("solved")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                viewMode === "solved" ? "bg-green-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> Solved ({solvedIds.length})
            </button>
            <button
              onClick={() => setViewMode("locked")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                viewMode === "locked" ? "bg-orange-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <Clock className="w-4 h-4" /> Locked ({failedIds.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 justify-center">
          {/* ... Filters UI ... */}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {["Encapsulation", "Inheritance", "Polymorphism"].map(topic => {
            const topicQuestions = filteredQuestions.filter(q => q.topic === topic);
            if (topicQuestions.length === 0) return null;
            
            return (
              <div key={topic} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{topic}</h2>
                  <span className="px-2.5 py-0.5 bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-full">
                    {topicQuestions.length}
                  </span>
                </div>
                {topicQuestions.map((q) => {
                  const isFailed = failedIds.includes(q.id);
                  const isSolved = solvedIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => openQuestion(q)}
                      className="group cursor-pointer bg-gray-800/30 border-2 border-gray-800 rounded-2xl p-5 hover:border-indigo-600 hover:bg-gray-800/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            isSolved ? 'bg-green-600/20 text-green-400' : 
                            isFailed ? 'bg-orange-600/20 text-orange-400' : 
                            'bg-gray-700 text-gray-400 group-hover:text-indigo-400'
                          }`}>
                            {isSolved ? <CheckCircle2 className="w-5 h-5" /> : 
                             isFailed ? <Clock className="w-5 h-5" /> : 
                             <Play className="w-5 h-5" />}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors">
                              {q.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {q.description.substring(0, 120)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                            q.difficulty === 'Easy' ? 'bg-green-600/20 text-green-400' :
                            q.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-red-600/20 text-red-400'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal - Same as your existing code */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           {/* ... Keep your existing Modal UI ... */}
           <div id="split-modal" onClick={(e) => e.stopPropagation()} className="w-full max-w-[95vw] h-[90vh] bg-[#0f1629] rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-800 flex flex-col">
              <div className="border-b-2 border-gray-800 p-6 flex justify-between items-start bg-[#0f1629] z-10">
                <div>
                   <h2 className="text-2xl font-bold mb-2">{selectedQuestion.title}</h2>
                   <div className="flex gap-2">
                     <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-lg text-xs font-bold">{selectedQuestion.topic}</span>
                     <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs font-bold">{selectedQuestion.difficulty}</span>
                     {cooldownEnd && <span className="px-3 py-1 bg-orange-600/20 text-orange-400 rounded-lg text-xs font-bold animate-pulse">🔒 Cooldown: {timeLeft}</span>}
                   </div>
                </div>
                <button onClick={closeQuestion} className="p-2 rounded-full hover:bg-gray-800 transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-hidden flex relative">
                 <div style={{ width: `${leftWidth}%` }} className="overflow-y-auto bg-gray-900/30 p-6 space-y-6">
                    <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-800">
                      <h3 className="text-lg font-bold text-indigo-400 mb-3 flex items-center gap-2"><MessageSquare className="w-5 h-5" /> The Question</h3>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedQuestion.description}</p>
                    </div>
                    <div className="relative">
                       <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Interview Ready Answer</h3>
                       <div className={`relative bg-gray-800/30 rounded-2xl border border-gray-800 overflow-hidden transition-all ${showModelAnswer ? 'p-6' : 'h-[300px]'}`}>
                          {!showModelAnswer && (
                             <div className="absolute inset-0 z-10 backdrop-blur-md bg-gray-900/90 flex flex-col items-center justify-center text-center p-6">
                               <Lock className="w-8 h-8 text-gray-400 mb-4" />
                               <h4 className="text-xl font-bold mb-2">Answer Locked</h4>
                             </div>
                          )}
                          <div className={!showModelAnswer ? 'filter blur-sm opacity-50 select-none' : ''}>
                             <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap">{selectedQuestion.correctAnswer}</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div onMouseDown={handleMouseDown} className="w-1 bg-gray-800 hover:bg-indigo-600 cursor-col-resize relative group transition-colors">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-gray-700 rounded-full group-hover:bg-indigo-600"><GripVertical className="w-4 h-4" /></div>
                 </div>

                 <div style={{ width: `${100 - leftWidth}%` }} className="overflow-y-auto bg-[#0f1629] p-6 space-y-6">
                    <div className={cooldownEnd ? 'opacity-50 pointer-events-none' : ''}>
                       <label className="text-sm font-bold text-gray-400 flex items-center gap-2 mb-2"><Brain className="w-4 h-4" /> Your Explanation</label>
                       <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} className="w-full min-h-[120px] bg-gray-800/30 border-2 border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-600 transition-all resize-y text-white placeholder-gray-500" placeholder="Explain..." />
                    </div>
                    <div className={cooldownEnd ? 'opacity-50 pointer-events-none' : ''}>
                       <label className="text-sm font-bold text-gray-400 flex items-center gap-2 mb-2"><Code2 className="w-4 h-4" /> Code Implementation</label>
                       <textarea value={codeSubmission} onChange={(e) => setCodeSubmission(e.target.value)} className="w-full min-h-[180px] bg-gray-800/30 border-2 border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-600 transition-all resize-y font-mono text-sm text-white" placeholder="// Code..." />
                    </div>
                    <div className="flex justify-between items-center">
                       {cooldownEnd ? <span className="text-orange-400 font-bold flex items-center gap-2"><Clock className="w-4 h-4 animate-pulse" /> {timeLeft}</span> : <span className="text-sm text-gray-500">Attempt {attemptNumber} of 3</span>}
                       {!cooldownEnd && (
                         <button onClick={handleSubmit} disabled={loading || !userAnswer} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all">
                           {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit Answer</>}
                         </button>
                       )}
                    </div>
                    {feedback && (
                      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border-2 border-purple-500/30">
                        <div className="flex items-center gap-3 mb-4"><h3 className="text-lg font-bold">Feedback</h3></div>
                        <div className="bg-white/5 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">{feedback}</div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}