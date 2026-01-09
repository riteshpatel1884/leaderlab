

// "use client";

// import React, { useState, useEffect } from "react";
// import { SqlQuestion, sqlQuestions } from "@/data/sql/sqlQuestions";
// import MacCodeWindow from "@/app/component/MacCodeWindow/MacCodeWindow";
// import { X, Play, Loader2, Send, GripVertical, Filter, AlertTriangle, Monitor, ChevronDown, ChevronUp, MessageSquare, Sparkles, Lightbulb, Brain, Zap, ArrowLeft } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import { motion, AnimatePresence } from "framer-motion";
// import CodeMirror from '@uiw/react-codemirror';
// import { sql } from '@codemirror/lang-sql';
// import Navbar from "@/app/component/navbar/navbar";
// import { useUser } from "@clerk/nextjs";

// export default function SqlPracticePage() {
//   const { user, isLoaded } = useUser();
//   const [selectedQuestion, setSelectedQuestion] = useState<SqlQuestion | null>(null);
//   const [userQuery, setUserQuery] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isDark, setIsDark] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [showMobileWarning, setShowMobileWarning] = useState(false);
//   const [pendingQuestion, setPendingQuestion] = useState<SqlQuestion | null>(null);
  
//   // Follow-up conversation states
//   const [followUpResponse, setFollowUpResponse] = useState("");
//   const [followUpLoading, setFollowUpLoading] = useState(false);
//   const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  
//   // Mobile section visibility
//   const [showProblem, setShowProblem] = useState(true);
//   const [showEditor, setShowEditor] = useState(true);
//   const [showFeedback, setShowFeedback] = useState(true);
  
//   // Filter states
//   const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
//   const [selectedTopic, setSelectedTopic] = useState<string>("All");
  
//   // Resizable widths and heights
//   const [problemWidth, setProblemWidth] = useState(41.666667);
//   const [queryHeight, setQueryHeight] = useState(60);
//   const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
//   const [isResizingVertical, setIsResizingVertical] = useState(false);

//   // Check if mobile device
//   const isMobileDevice = () => {
//     return window.innerWidth < 768;
//   };

//   // Load theme preference on mount
//   useEffect(() => {
//     setMounted(true);
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setIsDark(true);
//     } else if (savedTheme === 'light') {
//       setIsDark(false);
//     } else {
//       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//       setIsDark(prefersDark);
//     }
//   }, []);

//   // Save theme preference and apply class whenever it changes
//   useEffect(() => {
//     if (mounted) {
//       localStorage.setItem('theme', isDark ? 'dark' : 'light');
//       if (isDark) {
//         document.documentElement.classList.add('dark');
//       } else {
//         document.documentElement.classList.remove('dark');
//       }
//     }
//   }, [isDark, mounted]);

//   // Group questions by topic
//   const groupedQuestions = sqlQuestions.reduce((acc, question) => {
//     const topic = question.topic || "Other";
//     if (!acc[topic]) {
//       acc[topic] = [];
//     }
//     acc[topic].push(question);
//     return acc;
//   }, {} as Record<string, SqlQuestion[]>);

//   // Get unique topics and difficulties
//   const topics = ["All", ...Object.keys(groupedQuestions).sort()];
//   const difficulties = ["All", "Easy", "Medium", "Hard"];

//   // Filter questions
//   const filteredGroupedQuestions = Object.entries(groupedQuestions).reduce((acc, [topic, questions]) => {
//     // Filter by topic
//     if (selectedTopic !== "All" && topic !== selectedTopic) {
//       return acc;
//     }

//     // Filter by difficulty
//     const filteredQuestions = selectedDifficulty === "All" 
//       ? questions 
//       : questions.filter(q => q.difficulty === selectedDifficulty);

//     if (filteredQuestions.length > 0) {
//       acc[topic] = filteredQuestions;
//     }

//     return acc;
//   }, {} as Record<string, SqlQuestion[]>);

//   const openQuestion = (q: SqlQuestion) => {
//     if (isMobileDevice()) {
//       setPendingQuestion(q);
//       setShowMobileWarning(true);
//       document.body.style.overflow = 'hidden';
//     } else {
//       setSelectedQuestion(q);
//       setUserQuery("");
//       setFeedback("");
//       document.body.style.overflow = 'hidden';
//     }
//   };

//   const proceedAnyway = () => {
//     if (pendingQuestion) {
//       setSelectedQuestion(pendingQuestion);
//       setUserQuery("");
//       setFeedback("");
//       setShowProblem(true);
//       setShowEditor(true);
//       setShowFeedback(false);
//     }
//     setShowMobileWarning(false);
//     setPendingQuestion(null);
//   };

//   const cancelMobileWarning = () => {
//     setShowMobileWarning(false);
//     setPendingQuestion(null);
//     document.body.style.overflow = 'auto';
//   };

//   const closeQuestion = () => {
//     setSelectedQuestion(null);
//     setFeedback("");
//     setUserQuery("");
//     setFollowUpResponse("");
//     setConversationHistory([]);
//     document.body.style.overflow = 'auto';
//   };

//   const handleSubmit = async () => {
//     if (!userQuery.trim()) return;
//     setLoading(true);
//     setFeedback("");
//     setConversationHistory([]); // Reset conversation when submitting new query

//     try {
//       const res = await fetch("/api/evaluate-sql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question: selectedQuestion?.description,
//           schema: selectedQuestion?.schema,
//           userQuery: userQuery,
//           questionId: selectedQuestion?.id,
//           difficulty: selectedQuestion?.difficulty,
//           topic: selectedQuestion?.topic,
//           clerkUserId: user?.id, // Pass Clerk user ID for database storage
//         }),
//       });
//       const data = await res.json();
//       setFeedback(data.feedback);
      
//       // Initialize conversation history
//       setConversationHistory([
//         { role: "assistant", content: data.feedback }
//       ]);
      
//       if (isMobileDevice()) {
//         setShowFeedback(true);
//         // Scroll to feedback section on mobile
//         setTimeout(() => {
//           document.getElementById('feedback-section')?.scrollIntoView({ behavior: 'smooth' });
//         }, 100);
//       }
//     } catch (err) {
//       setFeedback("Error connecting to the interviewer.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFollowUpSubmit = async () => {
//     if (!followUpResponse.trim()) return;
//     setFollowUpLoading(true);

//     try {
//       // Add user response to conversation history
//       const updatedHistory = [
//         ...conversationHistory,
//         { role: "user", content: followUpResponse }
//       ];

//       const res = await fetch("/api/evaluate-sql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question: selectedQuestion?.description,
//           schema: selectedQuestion?.schema,
//           userQuery: userQuery,
//           followUp: true,
//           conversationHistory: updatedHistory,
//           userResponse: followUpResponse,
//           clerkUserId: user?.id,
//         }),
//       });
//       const data = await res.json();
      
//       // Update conversation history with AI response
//       const newHistory = [
//         ...updatedHistory,
//         { role: "assistant", content: data.feedback }
//       ];
      
//       setConversationHistory(newHistory);
//       setFeedback(data.feedback);
//       setFollowUpResponse("");
//     } catch (err) {
//       console.error("Error in follow-up:", err);
//     } finally {
//       setFollowUpLoading(false);
//     }
//   };

//   const handleHorizontalMouseDown = (e: React.MouseEvent) => {
//     setIsResizingHorizontal(true);
//     e.preventDefault();
//   };

//   const handleVerticalMouseDown = (e: React.MouseEvent) => {
//     setIsResizingVertical(true);
//     e.preventDefault();
//   };

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (isResizingHorizontal) {
//         const modal = document.getElementById('modal-container');
//         if (!modal) return;
        
//         const rect = modal.getBoundingClientRect();
//         const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
        
//         if (newWidth > 20 && newWidth < 70) {
//           setProblemWidth(newWidth);
//         }
//       }
      
//       if (isResizingVertical) {
//         const panel = document.getElementById('right-panel');
//         if (!panel) return;
        
//         const rect = panel.getBoundingClientRect();
//         const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
        
//         if (newHeight > 20 && newHeight < 80) {
//           setQueryHeight(newHeight);
//         }
//       }
//     };

//     const handleMouseUp = () => {
//       setIsResizingHorizontal(false);
//       setIsResizingVertical(false);
//     };

//     if (isResizingHorizontal || isResizingVertical) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isResizingHorizontal, isResizingVertical]);

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e27] text-gray-900 dark:text-white transition-colors duration-300">
//       {/* Back Button */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
//         <a 
//           href="/"
//           className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group shadow-sm hover:shadow-lg hover:shadow-indigo-500/10"
//         >
//           <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//           <span className="font-semibold text-sm">Back to Home</span>
//         </a>
//       </div>

//       {/* Hero Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
//         <div className="text-center mb-8 sm:mb-12">
//           <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 sm:mb-8 px-2">
//             Practice <span className="text-indigo-600 dark:text-indigo-400 relative inline-block"> SQL </span> the way <br className="hidden sm:block" />
//             <span className="text-indigo-600 dark:text-indigo-400 relative inline-block">
//               interviews judge you.
//               <svg className="absolute -bottom-7 left-0 w-full hidden sm:block" viewBox="0 0 300 12" fill="none">
               
//               </svg>
//             </span>
//           </h1>
          
//           <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
//             Write the{" "}
//             <span className="font-bold text-gray-900 dark:text-white underline decoration-indigo-600 dark:decoration-indigo-400 underline-offset-4">SQL query.</span>{" "}
//             Get evaluated the way interviews evaluate it.
//           </p>

//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
//             <div className="flex items-center gap-2 bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2">
//               <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
//               <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter:</span>
//             </div>

//             {/* Difficulty Filter */}
//             <div className="flex flex-wrap gap-2 justify-center">
//               {difficulties.map((diff) => (
//                 <button
//                   key={diff}
//                   onClick={() => setSelectedDifficulty(diff)}
//                   className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
//                     selectedDifficulty === diff
//                       ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
//                       : 'bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-indigo-500'
//                   }`}
//                 >
//                   {diff}
//                 </button>
//               ))}
//             </div>

//             {/* Topic Filter */}
//             <select
//               value={selectedTopic}
//               onChange={(e) => setSelectedTopic(e.target.value)}
//               className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer hover:border-indigo-500 transition-all"
//             >
//               {topics.map((topic) => (
//                 <option key={topic} value={topic}>
//                   {topic === "All" ? "All Topics" : topic}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Questions Grouped by Topic */}
//         <div className="space-y-6 sm:space-y-8">
//           {Object.entries(filteredGroupedQuestions).map(([topic, questions]) => (
//             <div key={topic} className="space-y-3 sm:space-y-4">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-2">
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{topic}</h2>
//                 <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs sm:text-sm font-bold">
//                   {questions.length} {questions.length === 1 ? 'question' : 'questions'}
//                 </span>
//               </div>

//               <div className="space-y-3">
//                 {questions.map((q) => (
//                   <motion.div
//                     key={q.id}
//                     onClick={() => openQuestion(q)}
//                     whileHover={{ scale: 1.01, x: 4 }}
//                     whileTap={{ scale: 0.99 }}
//                     className="group cursor-pointer border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-4 sm:p-5 rounded-xl hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
//                   >
//                     <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 w-full">
//                       <div className="flex-shrink-0 mt-1 sm:mt-0">
//                         <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
//                       </div>
                      
//                       <div className="flex-1 min-w-0">
//                         <h3 className="text-base sm:text-lg font-bold mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
//                           {q.title}
//                         </h3>
//                         <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
//                           {q.description}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-auto">
//                       <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
//                         ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 
//                           q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : 
//                           'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
//                         {q.difficulty}
//                       </span>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           ))}

//           {Object.keys(filteredGroupedQuestions).length === 0 && (
//             <div className="text-center py-12 sm:py-16">
//               <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400">
//                 No questions found with the selected filters.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Warning Modal */}
//       <AnimatePresence>
//         {showMobileWarning && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
//             onClick={cancelMobileWarning}
//           >
//             <motion.div 
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-gray-200 dark:border-gray-800"
//             >
//               <div className="flex flex-col items-center text-center">
//                 <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
//                   <Monitor className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
//                 </div>
                
//                 <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
//                   Better on Desktop
//                 </h3>
                
//                 <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
//                   For the best coding experience with our split-screen editor and resizable panels, we recommend accessing this on a laptop or desktop device.
//                 </p>

//                 <div className="flex flex-col sm:flex-row gap-3 w-full">
//                   <button
//                     onClick={cancelMobileWarning}
//                     className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
//                   >
//                     Go Back
//                   </button>
//                   <button
//                     onClick={proceedAnyway}
//                     className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
//                   >
//                     Continue Anyway
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Pop-up Modal */}
//       <AnimatePresence>
//         {selectedQuestion && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4"
//             onClick={closeQuestion}
//           >
//             <motion.div 
//               id="modal-container"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="w-full max-w-7xl h-[95vh] sm:h-[90vh] bg-white dark:bg-[#0f1629] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border-2 border-gray-200 dark:border-gray-800"
//             >
//               {/* DESKTOP LAYOUT */}
//               <div className="hidden md:flex md:flex-row w-full h-full">
//                 {/* LEFT SIDE: Problem & Schema - Resizable */}
//                 <div 
//                   style={{ width: `${problemWidth}%` }}
//                   className="border-r-2 border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-[#0a0e27] relative"
//                 >
//                   <div className="p-8 overflow-y-auto h-full">
//                     <h2 className="text-3xl font-bold mb-3">{selectedQuestion.title}</h2>
//                     <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-6
//                       ${selectedQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' : 
//                         selectedQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400' : 
//                         'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'}`}>
//                       {selectedQuestion.difficulty}
//                     </span>

//                     <div className="mb-8">
//                       <h3 className="text-xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">Problem</h3>
//                       <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{selectedQuestion.description}</p>
//                     </div>

//                     <div className="mb-8">
//                       <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Database Schema</h3>
//                       <MacCodeWindow code={selectedQuestion.schema} title="schema.sql" />
//                     </div>
//                   </div>
//                 </div>

//                 {/* HORIZONTAL RESIZE HANDLE */}
//                 <div 
//                   className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 dark:hover:bg-indigo-500 cursor-col-resize flex items-center justify-center group relative"
//                   onMouseDown={handleHorizontalMouseDown}
//                 >
//                   <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 absolute" />
//                 </div>

//                 {/* RIGHT SIDE: IDE & Feedback */}
//                 <div 
//                   id="right-panel"
//                   className="flex-1 flex flex-col h-full bg-white dark:bg-[#0f1629] relative"
//                 >
//                   <button 
//                     onClick={closeQuestion}
//                     className="absolute top-4 right-4 p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 hover:text-red-600 transition-all z-10 shadow-lg"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>

//                   <div className="p-8 flex flex-col" style={{ height: `${queryHeight}%` }}>
//                     <div className="flex items-center gap-3 mb-4">
//                       <h3 className="text-xl font-bold">Your Query</h3>
//                       <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full uppercase tracking-wide">SQL</span>
//                     </div>
                    
//                     <div className="flex-1 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg min-h-0">
//                       <CodeMirror
//                         value={userQuery}
//                         height="100%"
//                         theme={isDark ? "dark" : "light"}
//                         extensions={[sql()]}
//                         onChange={(value) => setUserQuery(value)}
//                         placeholder="SELECT * FROM ..."
//                       />
//                     </div>

//                     <div className="mt-6 flex justify-end">
//                       <button
//                         onClick={handleSubmit}
//                         disabled={loading || !userQuery || !isLoaded || !user}
//                         className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:cursor-not-allowed shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50"
//                       >
//                         {loading ? (
//                           <>
//                             <Loader2 className="w-5 h-5 animate-spin" /> Evaluating...
//                           </>
//                         ) : (
//                           <>
//                             Submit Solution <Send className="w-5 h-5" />
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {feedback && (
//                     <>
//                       <div 
//                         className="h-1 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 dark:hover:bg-indigo-500 cursor-row-resize flex items-center justify-center group relative"
//                         onMouseDown={handleVerticalMouseDown}
//                       >
//                         <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 rotate-90 absolute" />
//                       </div>

//                       {/* ENHANCED FEEDBACK SECTION - DESKTOP */}
//                       <div 
//                         style={{ height: `${100 - queryHeight}%` }}
//                         className="border-t-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-[#0a0e27] dark:to-blue-950/20 relative overflow-hidden"
//                       >
//                         {/* Animated background effect */}
//                         <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 animate-pulse" />
                        
//                         <div className="relative p-8 overflow-y-auto h-full">
//                           {/* Header with icon */}
//                           <div className="flex items-center gap-4 mb-6">
//                             <div className="relative">
//                               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
//                               <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-xl">
//                                 <Brain className="w-7 h-7 text-white" />
//                               </div>
//                             </div>
                            
//                             <div>
//                               <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
//                                 Interviewer Feedback
                                
//                               </h3>
                              
//                             </div>
//                           </div>

//                           {/* Main content card */}
//                           <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
//                             {/* Decorative gradient border effect */}
//                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                            
//                             <div className="relative p-6 lg:p-8">
//                               {/* Feedback content with enhanced typography */}
//                               <div className="prose prose-base lg:prose-lg dark:prose-invert max-w-none
//                                 prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tight prose-headings:mb-4
//                                 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
//                                 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
//                                 prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400 prose-strong:font-bold
//                                 prose-em:text-purple-600 dark:prose-em:text-purple-400 prose-em:not-italic prose-em:font-semibold
//                                 prose-code:bg-gradient-to-r prose-code:from-indigo-50 prose-code:to-purple-50 dark:prose-code:from-indigo-950/50 dark:prose-code:to-purple-950/50 
//                                 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-indigo-700 dark:prose-code:text-indigo-300 
//                                 prose-code:font-mono prose-code:text-sm prose-code:font-semibold prose-code:border prose-code:border-indigo-200 dark:prose-code:border-indigo-800
//                                 prose-pre:bg-gradient-to-br prose-pre:from-gray-50 prose-pre:to-slate-50 dark:prose-pre:from-gray-900 dark:prose-pre:to-slate-900 
//                                 prose-pre:border-2 prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-pre:shadow-xl prose-pre:rounded-xl
//                                 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:leading-relaxed prose-li:mb-2
//                                 prose-ul:space-y-2 prose-ol:space-y-2
//                                 prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-950/20 
//                                 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
//                                 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2
//                                 prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-8
//                                 prose-table:border-collapse prose-table:w-full
//                                 prose-th:bg-indigo-50 dark:prose-th:bg-indigo-950/30 prose-th:font-bold prose-th:text-left prose-th:p-3 prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700
//                                 prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
//                                 ">
//                                 <ReactMarkdown
//                                   components={{
//                                     // Custom renderer for headings to add icons
//                                     h1: ({node, ...props}) => <h1 className="flex items-center gap-2" {...props}><Zap className="w-6 h-6 text-indigo-500" />{props.children}</h1>,
//                                     h2: ({node, ...props}) => <h2 className="flex items-center gap-2" {...props}><Lightbulb className="w-5 h-5 text-purple-500" />{props.children}</h2>,
//                                     // Add custom styling for lists
//                                     ul: ({node, ...props}) => <ul className="space-y-3 my-4" {...props} />,
//                                     li: ({node, ...props}) => (
//                                       <li className="flex items-start gap-2" {...props}>
//                                         <span className="text-indigo-500 dark:text-indigo-400 mt-1.5">▸</span>
//                                         <span className="flex-1">{props.children}</span>
//                                       </li>
//                                     ),
//                                   }}
//                                 >
//                                   {feedback}
//                                 </ReactMarkdown>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Footer hint */}
//                           <div className="mt-6 space-y-4">
//                             {/* Follow-up Response Input */}
//                             <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 p-4 shadow-lg">
//                               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                                 💬 Your Response
//                               </label>
//                               <div className="flex gap-2">
//                                 <input
//                                   type="text"
//                                   value={followUpResponse}
//                                   onChange={(e) => setFollowUpResponse(e.target.value)}
//                                   onKeyPress={(e) => {
//                                     if (e.key === 'Enter' && !followUpLoading) {
//                                       handleFollowUpSubmit();
//                                     }
//                                   }}
//                                   placeholder="Type your answer or ask a question..."
//                                   className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
//                                 />
//                                 <button
//                                   onClick={handleFollowUpSubmit}
//                                   disabled={followUpLoading || !followUpResponse.trim()}
//                                   className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-500/30"
//                                 >
//                                   {followUpLoading ? (
//                                     <>
//                                       <Loader2 className="w-4 h-4 animate-spin" />
//                                       <span className="hidden sm:inline">Sending...</span>
//                                     </>
//                                   ) : (
//                                     <>
//                                       <Send className="w-4 h-4" />
//                                       <span className="hidden sm:inline">Send</span>
//                                     </>
//                                   )}
//                                 </button>
//                               </div>
//                             </div>

//                             {/* Pro tip */}
//                             <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-5 py-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
//                               <MessageSquare className="w-5 h-5 text-indigo-500 flex-shrink-0" />
//                               <p className="leading-relaxed">
//                                 <span className="font-semibold text-gray-900 dark:text-white">Pro tip:</span> Review the feedback carefully and iterate on your solution for better results.
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* MOBILE LAYOUT - Vertical Stack */}
//               <div className="md:hidden flex flex-col w-full h-full overflow-y-auto">
//                 {/* Close Button - Fixed at top */}
//                 <div className="sticky top-0 z-20 bg-white dark:bg-[#0f1629] border-b-2 border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
//                   <h2 className="text-lg font-bold truncate flex-1">{selectedQuestion.title}</h2>
//                   <button 
//                     onClick={closeQuestion}
//                     className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 hover:text-red-600 transition-all shadow-lg ml-2"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* Section 1: Problem & Schema */}
//                 <div className="border-b-2 border-gray-200 dark:border-gray-800">
//                   <button
//                     onClick={() => setShowProblem(!showProblem)}
//                     className="w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-[#0a0e27] hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <span className="text-2xl">📝</span>
//                       <h3 className="text-lg font-bold">Problem & Schema</h3>
//                     </div>
//                     {showProblem ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                   </button>
                  
//                   <AnimatePresence>
//                     {showProblem && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="overflow-hidden"
//                       >
//                         <div className="p-4 bg-gray-50 dark:bg-[#0a0e27]">
//                           <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-4
//                             ${selectedQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' : 
//                               selectedQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400' : 
//                               'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'}`}>
//                             {selectedQuestion.difficulty}
//                           </span>

//                           <div className="mb-6">
//                             <h4 className="text-base font-bold mb-2 text-indigo-600 dark:text-indigo-400">Problem</h4>
//                             <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedQuestion.description}</p>
//                           </div>

//                           <div>
//                             <h4 className="text-base font-bold mb-3 text-indigo-600 dark:text-indigo-400">Database Schema</h4>
//                             <MacCodeWindow code={selectedQuestion.schema} title="schema.sql" />
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Section 2: Query Editor */}
//                 <div className="border-b-2 border-gray-200 dark:border-gray-800">
//                   <button
//                     onClick={() => setShowEditor(!showEditor)}
//                     className="w-full p-4 flex items-center justify-between bg-white dark:bg-[#0f1629] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <span className="text-2xl">💻</span>
//                       <h3 className="text-lg font-bold">Your Query</h3>
//                       <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 rounded-full uppercase tracking-wide">SQL</span>
//                     </div>
//                     {showEditor ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                   </button>
                  
//                   <AnimatePresence>
//                     {showEditor && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="overflow-hidden"
//                       >
//                         <div className="p-4 bg-white dark:bg-[#0f1629]">
//                           <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg mb-4" style={{ height: '300px' }}>
//                             <CodeMirror
//                               value={userQuery}
//                               height="100%"
//                               theme={isDark ? "dark" : "light"}
//                               extensions={[sql()]}
//                               onChange={(value) => setUserQuery(value)}
//                               placeholder="SELECT * FROM ..."
//                             />
//                           </div>

//                           <button
//                             onClick={handleSubmit}
//                             disabled={loading || !userQuery || !isLoaded || !user}
//                             className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-bold transition-all disabled:cursor-not-allowed shadow-xl shadow-indigo-500/30"
//                           >
//                             {loading ? (
//                               <>
//                                 <Loader2 className="w-5 h-5 animate-spin" /> Evaluating...
//                               </>
//                             ) : (
//                               <>
//                                 Submit Solution <Send className="w-5 h-5" />
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Section 3: Feedback - ENHANCED FOR MOBILE */}
//                 {feedback && (
//                   <div id="feedback-section" className="border-b-2 border-gray-200 dark:border-gray-800">
//                     <button
//                       onClick={() => setShowFeedback(!showFeedback)}
//                       className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-[#0a0e27] dark:to-blue-950/20 hover:opacity-90 transition-all"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
//                           <Brain className="w-5 h-5 text-white" />
//                         </div>
//                         <div className="text-left">
//                           <h3 className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
//                             Interviewer Feedback
//                           </h3>
//                           <p className="text-xs text-gray-600 dark:text-gray-400">AI-powered review</p>
//                         </div>
//                       </div>
//                       {showFeedback ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                     </button>
                    
//                     <AnimatePresence>
//                       {showFeedback && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           transition={{ duration: 0.3 }}
//                           className="overflow-hidden"
//                         >
//                           <div className="p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-[#0a0e27] dark:to-blue-950/20 relative">
//                             {/* Background effect */}
//                             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5" />
                            
//                             {/* Content */}
//                             <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl p-4">
//                               <div className="prose prose-sm dark:prose-invert max-w-none
//                                 prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:text-base prose-headings:mb-3
//                                 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-sm prose-p:mb-3
//                                 prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400 prose-strong:font-bold
//                                 prose-em:text-purple-600 dark:prose-em:text-purple-400 prose-em:not-italic prose-em:font-semibold
//                                 prose-code:bg-gradient-to-r prose-code:from-indigo-50 prose-code:to-purple-50 dark:prose-code:from-indigo-950/50 dark:prose-code:to-purple-950/50 
//                                 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-indigo-700 dark:prose-code:text-indigo-300 prose-code:text-xs prose-code:font-mono prose-code:font-semibold
//                                 prose-pre:bg-gradient-to-br prose-pre:from-gray-50 prose-pre:to-slate-50 dark:prose-pre:from-gray-900 dark:prose-pre:to-slate-900 
//                                 prose-pre:border-2 prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-pre:shadow-lg prose-pre:rounded-lg prose-pre:text-xs
//                                 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:text-sm prose-li:leading-relaxed
//                                 prose-ul:space-y-2 prose-ol:space-y-2
//                                 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline">
//                                 <ReactMarkdown
//                                   components={{
//                                     li: ({node, ...props}) => (
//                                       <li className="flex items-start gap-2" {...props}>
//                                         <span className="text-indigo-500 dark:text-indigo-400 mt-0.5 text-xs">▸</span>
//                                         <span className="flex-1">{props.children}</span>
//                                       </li>
//                                     ),
//                                   }}
//                                 >
//                                   {feedback}
//                                 </ReactMarkdown>
//                               </div>
//                             </div>

//                             {/* Footer */}
//                             <div className="relative mt-4 space-y-3">
//                               {/* Follow-up Response Input - Mobile */}
//                               <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg border-2 border-gray-200/50 dark:border-gray-700/50 p-3 shadow-lg">
//                                 <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                                   💬 Your Response
//                                 </label>
//                                 <div className="flex flex-col gap-2">
//                                   <input
//                                     type="text"
//                                     value={followUpResponse}
//                                     onChange={(e) => setFollowUpResponse(e.target.value)}
//                                     onKeyPress={(e) => {
//                                       if (e.key === 'Enter' && !followUpLoading) {
//                                         handleFollowUpSubmit();
//                                       }
//                                     }}
//                                     placeholder="Type your answer or ask a question..."
//                                     className="w-full px-3 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
//                                   />
//                                   <button
//                                     onClick={handleFollowUpSubmit}
//                                     disabled={followUpLoading || !followUpResponse.trim()}
//                                     className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 text-sm"
//                                   >
//                                     {followUpLoading ? (
//                                       <>
//                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                         Sending...
//                                       </>
//                                     ) : (
//                                       <>
//                                         <Send className="w-4 h-4" />
//                                         Send Response
//                                       </>
//                                     )}
//                                   </button>
//                                 </div>
//                               </div>

//                               {/* Pro tip - Mobile */}
//                               <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-3 py-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
//                                 <MessageSquare className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
//                                 <p className="leading-relaxed">
//                                   <span className="font-semibold text-gray-900 dark:text-white">Tip:</span> Review feedback and refine your query
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SqlQuestion, sqlQuestions } from "@/data/sql/sqlQuestions";
import MacCodeWindow from "@/app/component/MacCodeWindow/MacCodeWindow";
import { X, Play, Loader2, Send, GripVertical, Filter, ChevronDown, ChevronUp, MessageSquare, Brain, Zap, ArrowLeft, CheckCircle2, Trophy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { useUser } from "@clerk/nextjs";

export default function SqlPracticePage() {
  const { user, isLoaded } = useUser();
  const [selectedQuestion, setSelectedQuestion] = useState<SqlQuestion | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<SqlQuestion | null>(null);
  
  // Progress states
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"practice" | "solved">("practice");
  
  // Follow-up conversation states
  const [followUpResponse, setFollowUpResponse] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  
  // Mobile section visibility
  const [showProblem, setShowProblem] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  
  // Filter states
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  
  // Resizable widths and heights
  const [problemWidth, setProblemWidth] = useState(41.666667);
  const [queryHeight, setQueryHeight] = useState(60);
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);

  // Fetch Solved Questions from DB
  const fetchProgress = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/user-progress?clerkUserId=${user.id}`);
      const data = await res.json();
      if (data.solvedIds) {
        setSolvedIds(data.solvedIds);
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    setMounted(true);
    if (isLoaded && user) {
      fetchProgress();
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    } else if (savedTheme === 'light') {
      setIsDark(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, [isLoaded, user, fetchProgress]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark, mounted]);

  // Filter and Group questions
  const filteredGroupedQuestions = Object.entries(
    sqlQuestions.reduce((acc, question) => {
      const topic = question.topic || "Other";
      if (!acc[topic]) acc[topic] = [];
      acc[topic].push(question);
      return acc;
    }, {} as Record<string, SqlQuestion[]>)
  ).reduce((acc, [topic, questions]) => {
    if (selectedTopic !== "All" && topic !== selectedTopic) return acc;

    const filteredQuestions = questions.filter(q => {
      const isSolved = solvedIds.includes(q.id);
      const matchesDifficulty = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      const matchesViewMode = viewMode === "solved" ? isSolved : !isSolved;
      return matchesDifficulty && matchesViewMode;
    });

    if (filteredQuestions.length > 0) {
      acc[topic] = filteredQuestions;
    }
    return acc;
  }, {} as Record<string, SqlQuestion[]>);

  const topics = ["All", ...Array.from(new Set(sqlQuestions.map(q => q.topic))).sort()];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const openQuestion = (q: SqlQuestion) => {
    if (window.innerWidth < 768) {
      setPendingQuestion(q);
      setShowMobileWarning(true);
    } else {
      setSelectedQuestion(q);
      setUserQuery("");
      setFeedback("");
      setQueryHeight(60); // Reset heights on open
      document.body.style.overflow = 'hidden';
    }
  };

  const closeQuestion = () => {
    setSelectedQuestion(null);
    setFeedback("");
    setUserQuery("");
    setFollowUpResponse("");
    setConversationHistory([]);
    document.body.style.overflow = 'auto';
  };

  const handleSubmit = async () => {
    if (!userQuery.trim()) return;
    setLoading(true);
    setFeedback("");
    setConversationHistory([]);

    try {
      const res = await fetch("/api/evaluate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion?.description,
          schema: selectedQuestion?.schema,
          userQuery: userQuery,
          questionId: selectedQuestion?.id,
          difficulty: selectedQuestion?.difficulty,
          topic: selectedTopic === "All" ? selectedQuestion?.topic : selectedTopic,
          clerkUserId: user?.id,
        }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      
      if (data.feedback.toUpperCase().includes("PASS")) {
        fetchProgress();
      }

      setConversationHistory([{ role: "assistant", content: data.feedback }]);
      if (window.innerWidth < 768) setShowFeedback(true);
    } catch (err) {
      setFeedback("Error connecting to the interviewer.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpSubmit = async () => {
    if (!followUpResponse.trim()) return;
    setFollowUpLoading(true);
    try {
      const updatedHistory = [...conversationHistory, { role: "user", content: followUpResponse }];
      const res = await fetch("/api/evaluate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion?.description,
          schema: selectedQuestion?.schema,
          userQuery: userQuery,
          followUp: true,
          conversationHistory: updatedHistory,
          userResponse: followUpResponse,
          clerkUserId: user?.id,
        }),
      });
      const data = await res.json();
      setConversationHistory([...updatedHistory, { role: "assistant", content: data.feedback }]);
      setFeedback(data.feedback);
      setFollowUpResponse("");
    } catch (err) {
      console.error(err);
    } finally {
      setFollowUpLoading(false);
    }
  };

  // RESIZING LOGIC
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingHorizontal) {
        const modal = document.getElementById('modal-container');
        if (modal) {
          const rect = modal.getBoundingClientRect();
          const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
          if (newWidth > 20 && newWidth < 70) setProblemWidth(newWidth);
        }
      }
      if (isResizingVertical) {
        const panel = document.getElementById('right-panel');
        if (panel) {
          const rect = panel.getBoundingClientRect();
          const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
          if (newHeight > 15 && newHeight < 85) setQueryHeight(newHeight);
        }
      }
    };
    const handleMouseUp = () => { setIsResizingHorizontal(false); setIsResizingVertical(false); };
    if (isResizingHorizontal || isResizingVertical) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingHorizontal, isResizingVertical]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e27] text-gray-900 dark:text-white transition-colors duration-300">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <a href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 hover:border-indigo-500 transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Home</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Practice <span className="text-indigo-600 dark:text-indigo-400">SQL</span> like an <br className="hidden sm:block" />
            <span className="text-indigo-600 dark:text-indigo-400">Interview.</span>
          </h1>
          
          <div className="flex flex-col items-center gap-6 mt-10">
            {/* VIEW MODE TOGGLE */}
            <div className="flex p-1.5 bg-gray-200 dark:bg-gray-800/50 rounded-2xl border-2 border-gray-200 dark:border-gray-800 w-fit">
              <button
                onClick={() => setViewMode("practice")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  viewMode === "practice" 
                  ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-lg" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Play className="w-4 h-4" /> Practice
              </button>
              <button
                onClick={() => setViewMode("solved")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  viewMode === "solved" 
                  ? "bg-white dark:bg-green-600 text-green-600 dark:text-white shadow-lg" 
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Solved ({solvedIds.length})
              </button>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2">
                <Filter className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-bold">Filter:</span>
              </div>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-indigo-500'
                  }`}
                >
                  {diff}
                </button>
              ))}
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-800 cursor-pointer outline-none focus:border-indigo-500"
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>{topic === "All" ? "All Topics" : topic}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="space-y-8">
          {Object.entries(filteredGroupedQuestions).map(([topic, questions]) => (
            <div key={topic} className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <h2 className="text-xl font-bold">{topic}</h2>
                <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-xs font-bold rounded-full">{questions.length}</span>
              </div>
              <div className="grid gap-3">
                {questions.map((q) => (
                  <motion.div
                    key={q.id}
                    onClick={() => openQuestion(q)}
                    whileHover={{ x: 4 }}
                    className="group cursor-pointer border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-5 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${solvedIds.includes(q.id) ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-indigo-500'}`}>
                        {solvedIds.includes(q.id) ? <CheckCircle2 className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{q.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{q.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                      q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                      q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {q.difficulty}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(filteredGroupedQuestions).length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-medium">
                {viewMode === "solved" 
                  ? "You haven't solved any questions in this category yet." 
                  : "All questions in this category have been solved!"}
              </p>
              {viewMode === "practice" && (
                <button onClick={() => setViewMode("solved")} className="mt-4 text-indigo-500 font-bold hover:underline">
                  View Solved Questions →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL & OVERLAYS */}
      <AnimatePresence>
        {selectedQuestion && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={closeQuestion}
          >
            <motion.div 
              id="modal-container"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-7xl h-[90vh] bg-white dark:bg-[#0f1629] rounded-3xl overflow-hidden shadow-2xl flex border-2 border-gray-200 dark:border-gray-800"
            >
              {/* LEFT: Problem & Schema */}
              <div style={{ width: `${problemWidth}%` }} className="border-r-2 border-gray-200 dark:border-gray-800 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0a0e27]">
                <h2 className="text-3xl font-bold mb-4">{selectedQuestion.title}</h2>
                <div className="flex gap-2 mb-6">
                   <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-lg text-xs font-bold">{selectedQuestion.topic}</span>
                   <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold">{selectedQuestion.difficulty}</span>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-lg font-bold text-indigo-500">The Challenge</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedQuestion.description}</p>
                  <h3 className="text-lg font-bold text-indigo-500 mt-8 mb-4">Database Schema</h3>
                  <MacCodeWindow code={selectedQuestion.schema} title="schema.sql" />
                </div>
              </div>

              {/* HORIZONTAL RESIZE HANDLE */}
              <div className="w-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 cursor-col-resize transition-colors flex items-center justify-center" onMouseDown={() => setIsResizingHorizontal(true)}>
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>

              {/* RIGHT: IDE & Feedback */}
              <div id="right-panel" className="flex-1 flex flex-col relative bg-white dark:bg-[#0f1629]">
                <button onClick={closeQuestion} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 z-10 transition-colors">
                  <X className="w-6 h-6" />
                </button>

                {/* Top Section: Code Editor */}
                <div className="p-8 flex flex-col min-h-0" style={{ height: `${feedback ? queryHeight : 100}%` }}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" /> Your Solution
                  </h3>
                  <div className="flex-1 border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-inner">
                    <CodeMirror
                      value={userQuery}
                      height="100%"
                      theme={isDark ? "dark" : "light"}
                      extensions={[sql()]}
                      onChange={(value) => setUserQuery(value)}
                      placeholder="-- Write your SQL query here..."
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !userQuery || !user}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit</>}
                    </button>
                  </div>
                </div>

                {/* VERTICAL RESIZE HANDLE (ONLY SHOWS IF FEEDBACK EXISTS) */}
                {feedback && (
                  <div 
                    className="h-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-indigo-500 cursor-row-resize transition-colors flex items-center justify-center group" 
                    onMouseDown={() => setIsResizingVertical(true)}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-white rotate-90" />
                  </div>
                )}

                {/* Bottom Section: Feedback Area */}
                {feedback && (
                  <div className="flex-1 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0e27]/50 overflow-y-auto p-8" style={{ height: `${100 - queryHeight}%` }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">Interviewer's Review</h3>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{feedback}</ReactMarkdown>
                      </div>
                      
                      {/* Follow up Chat */}
                      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={followUpResponse}
                            onChange={(e) => setFollowUpResponse(e.target.value)}
                            placeholder="Ask a follow-up or try a hint..."
                            className="flex-1 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && handleFollowUpSubmit()}
                          />
                          <button 
                            onClick={handleFollowUpSubmit}
                            disabled={followUpLoading || !followUpResponse}
                            className="p-3 bg-indigo-600 text-white rounded-xl disabled:bg-gray-400 transition-colors"
                          >
                            {followUpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE WARNING */}
      <AnimatePresence>
        {showMobileWarning && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
            <div className="max-w-xs">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Desktop Recommended</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">Coding challenges are best experienced on a larger screen with a physical keyboard.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { setSelectedQuestion(pendingQuestion); setShowMobileWarning(false); setPendingQuestion(null); }} className="w-full py-4 bg-indigo-600 rounded-2xl font-bold shadow-lg shadow-indigo-500/20">
                  Continue Anyway
                </button>
                <button onClick={() => setShowMobileWarning(false)} className="w-full py-4 bg-white/10 rounded-2xl font-bold">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}